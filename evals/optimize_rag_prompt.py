"""
Atlas RAG Prompt Optimizer
===========================
Inspired by Karpathy's autoresearch pattern:
  - One modifiable thing:  the RAG system prompt
  - One metric:            TrueLens groundedness (GPT-4o-mini — same judge as full eval)
  - Loop:                  suggest edit → test → keep if better → discard if worse

Why TrueLens instead of a simple judge prompt?
  TrueLens decomposes answers into individual claims and scores each claim separately.
  Simple "score this 0-1" prompts score everything ~1.0 — proven useless as a proxy.

Connects to the existing Atlas infrastructure:
  - n8n atlas-rag-query webhook  → generates answers with candidate prompt
  - Neo4j (direct bolt)          → retrieves context for TrueLens scoring
  - Upstash KV                   → stores best prompt, live progress, trigger requests
  - Vercel /analytics            → trigger button + live progress UI

Usage:
  python evals/optimize_rag_prompt.py           # run immediately
  python evals/optimize_rag_prompt.py --watch   # poll KV for trigger from Vercel UI

Cost: ~$10–15 per full run (TrueLens GPT-4o-mini scoring + Sonnet suggestions)
"""

import os, json, time, argparse, requests, csv
from datetime import datetime, timezone
from pathlib import Path
from anthropic import Anthropic
from openai import OpenAI
from neo4j import GraphDatabase
from dotenv import load_dotenv
from trulens.providers.openai import OpenAI as TruOpenAI

_DIR = Path(__file__).parent
load_dotenv(_DIR / ".env")
load_dotenv(_DIR.parent / "ui/.env.local", override=False)

# ── Config ────────────────────────────────────────────────────────────────────

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
OPENAI_API_KEY    = os.getenv("OPENAI_API_KEY")
N8N_WEBHOOK       = os.getenv("N8N_WEBHOOK_URL", "https://ttadeo.app.n8n.cloud/webhook/atlas-rag-query")
KV_URL            = os.getenv("KV_REST_API_URL")
KV_TOKEN          = os.getenv("KV_REST_API_TOKEN")
NEO4J_URI         = os.getenv("NEO4J_URI", "bolt://192.168.1.165:7687")
NEO4J_USER        = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD    = os.getenv("NEO4J_PASSWORD")

ITERATIONS      = 15
TOP_N_QUESTIONS = 10
EMBED_MODEL     = "text-embedding-3-small"
TOP_K_CHUNKS    = 5
WATCH_INTERVAL  = 30   # seconds between KV polls in --watch mode
NO_IMPROVE_STOP = 5    # early-stop after this many consecutive non-improving iterations

SUGGEST_MODEL = "claude-sonnet-4-6"

# Upstash KV keys
KV_SYSTEM_PROMPT = "rag:system_prompt_ask"   # production prompt (used by n8n for all real users)
KV_PROGRESS      = "rag:optimize_progress"   # live progress streamed to Vercel UI
KV_REQUEST       = "rag:optimize_request"    # trigger written by Vercel button
KV_RESULT        = "rag:optimize_result"     # final result summary

# ── Baseline system prompt ────────────────────────────────────────────────────
# Exact match of the ask-mode prompt currently hardcoded in n8n atlas-rag-query.
# {context} is a placeholder — n8n substitutes retrieved Neo4j chunks at runtime.

BASELINE_PROMPT = """\
You are an expert Varonis Atlas AI Security Platform advisor helping Sales Engineers learn and present Atlas.

You have been given a set of retrieved documentation chunks below. These chunks are your ONLY permitted knowledge source for answering the question. You must not draw on your general training knowledge about Varonis, Atlas, or AI security — even if you believe it to be accurate.

<retrieved_documentation>
{context}
</retrieved_documentation>

GROUNDING RULES — ABSOLUTE:
- Your answer must be derived exclusively from the text inside <retrieved_documentation> above
- Before answering, identify which chunk(s) support your answer. If no chunk supports it, do not answer it
- Do not add facts, features, claims, or elaborations that are not explicitly present in the retrieved chunks — even if you believe them to be true
- Do not infer, extrapolate, or fill gaps using general knowledge
- If the retrieved documentation fully covers the question: answer using only what it supports
- If the retrieved documentation partially covers the question: answer what it supports and say "I don't have full documentation on [specific gap]"
- If the retrieved documentation does not cover the question at all: say "I don't have documentation on this specific topic" — do not guess
- Never contradict the retrieved documentation
- When in doubt, quote or closely paraphrase the retrieved content rather than restating it in your own words

RESPONSE STYLE:
- Be concise and SE-focused — your audience is technical sales staff, not developers
- Do not use framing like "based on the context" or "the documentation states" — just answer directly

CRITICAL ARCHITECTURAL CONTEXT (only apply if the retrieved documentation supports it):
- Applications connect to Atlas by routing LLM API calls through the Atlas AI Gateway proxy URL instead of calling the LLM provider directly
- The AI Gateway is a proxy — any application can use it by changing its endpoint URL

SOURCE ATTRIBUTION:
- At the end of your answer, add a "Sources:" line listing the title(s) of the chunks you drew from
- Format: **Sources:** Document Title, Another Document Title
- Only list sources you actually used — do not fabricate source names"""


# ── Upstash KV helpers ────────────────────────────────────────────────────────

def kv_get(key: str):
    """Read a value from Upstash KV. Returns None if not set or on error."""
    try:
        r = requests.get(
            f"{KV_URL}/get/{key}",
            headers={"Authorization": f"Bearer {KV_TOKEN}"},
            timeout=10,
        )
        return r.json().get("result")
    except Exception:
        return None


def kv_set(key: str, value) -> bool:
    """Write a JSON-serialized value to Upstash KV."""
    try:
        payload = value if isinstance(value, str) else json.dumps(value)
        r = requests.post(
            f"{KV_URL}/pipeline",
            headers={"Authorization": f"Bearer {KV_TOKEN}", "Content-Type": "application/json"},
            data=json.dumps([["SET", key, payload]]),
            timeout=10,
        )
        return r.status_code == 200
    except Exception:
        return False


def kv_delete(key: str):
    try:
        requests.get(
            f"{KV_URL}/del/{key}",
            headers={"Authorization": f"Bearer {KV_TOKEN}"},
            timeout=5,
        )
    except Exception:
        pass


# ── Neo4j context retrieval ───────────────────────────────────────────────────

def get_embedding(text: str, client: OpenAI) -> list:
    return client.embeddings.create(input=text, model=EMBED_MODEL).data[0].embedding


def retrieve_context(question: str, openai_client: OpenAI) -> str:
    embedding = get_embedding(question, openai_client)
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
    try:
        with driver.session() as session:
            result = session.run(
                """
                CALL db.index.vector.queryNodes('atlas_chunk_embeddings', $top_k, $embedding)
                YIELD node AS c, score
                RETURN c.heading AS heading, c.text AS text
                ORDER BY score DESC
                """,
                top_k=TOP_K_CHUNKS,
                embedding=embedding,
            )
            chunks = [f"[{r['heading']}]\n{r['text']}" for r in result]
    finally:
        driver.close()
    return "\n\n---\n\n".join(chunks) if chunks else "(no context retrieved)"


# ── TrueLens groundedness scoring (GPT-4o-mini — same judge as full eval) ─────

def score_groundedness(context: str, answer: str, provider: TruOpenAI) -> float:
    """
    Score groundedness using TrueLens claim decomposition.
    Same method as run_evals.py — decomposes answer into individual claims,
    scores each against context, averages. Far more accurate than a holistic prompt.
    """
    try:
        score = provider.groundedness_measure_with_cot_reasons(
            source=context, statement=answer
        )
        # Returns (score, reasons_dict) or just score depending on TrueLens version
        if isinstance(score, tuple):
            score = score[0]
        return float(score)
    except Exception:
        return 0.5  # neutral on scoring error


# ── n8n RAG call ──────────────────────────────────────────────────────────────

def get_answer_with_prompt(question: str, prompt_template: str, retries: int = 2) -> str:
    """
    Call n8n RAG webhook with a system_prompt_override.
    n8n substitutes {context} from its own Neo4j retrieval before passing to Claude.
    """
    sanitized = (
        question.replace("\n", " ")
                .replace('"', "'")
                .replace("[", "(")
                .replace("]", ")")
    )
    for attempt in range(1, retries + 1):
        try:
            r = requests.post(
                N8N_WEBHOOK,
                json={
                    "question": sanitized,
                    "history": [],
                    "system_prompt_override": prompt_template,
                },
                timeout=120,
            )
            r.raise_for_status()
            return r.json().get("answer", "")
        except Exception as e:
            if attempt == retries:
                return f"[ERROR: {e}]"
            time.sleep(2)
    return ""


# ── Prompt suggestion (Sonnet) ────────────────────────────────────────────────

SUGGEST_PROMPT = """\
You are optimizing a RAG system prompt for an AI assistant that answers questions \
about the Varonis Atlas AI Security Platform.

CURRENT SYSTEM PROMPT:
{current_prompt}

---

WORST-PERFORMING QUESTIONS (lowest groundedness scores):

{failing_examples}

---

The primary failure mode: the AI adds claims or details that are NOT in the retrieved \
context — drawing on general LLM knowledge instead of staying within the provided docs.

Suggest ONE specific, targeted edit to the system prompt that will improve groundedness.

Rules:
- Make exactly ONE change — do not rewrite the entire prompt
- The change must make the grounding constraint clearer or harder to violate
- Keep the {{context}} placeholder exactly as-is (it is substituted at runtime)
- Output ONLY the complete updated system prompt. No explanation, no preamble."""


def suggest_prompt_edit(current_prompt: str, failing_examples: list, client: Anthropic) -> str:
    examples_text = ""
    for i, ex in enumerate(failing_examples[:5], 1):
        examples_text += (
            f"\n{i}. Q: {ex['question'][:120]}\n"
            f"   Groundedness: {ex['groundedness']:.2f}\n"
            f"   Answer excerpt: {ex['answer'][:200]}\n"
        )
    msg = client.messages.create(
        model=SUGGEST_MODEL,
        max_tokens=4000,
        messages=[{"role": "user", "content": SUGGEST_PROMPT.format(
            current_prompt=current_prompt,
            failing_examples=examples_text,
        )}],
    )
    return msg.content[0].text.strip()


# ── Load worst questions from latest eval CSV ─────────────────────────────────

def load_worst_questions(n: int = TOP_N_QUESTIONS) -> list:
    csv_files = sorted(
        (_DIR / "results").glob("eval_results_*.csv"),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    if not csv_files:
        raise FileNotFoundError(
            "No eval results CSV found in evals/results/. Run run_evals.py first."
        )
    latest = csv_files[0]
    print(f"  Source: {latest.name}")
    rows = []
    with open(latest) as f:
        for row in csv.DictReader(f):
            rows.append(row)
    rows.sort(key=lambda r: float(r["groundedness"]))
    return rows[:n]


# ── Mini eval ─────────────────────────────────────────────────────────────────

def run_mini_eval(
    questions: list,
    prompt_template: str,
    openai_client: OpenAI,
    provider: TruOpenAI,
) -> tuple[float, list]:
    """
    Run eval on questions with a candidate prompt template.
    Uses TrueLens GPT-4o-mini claim decomposition — same judge as full eval.
    Returns (avg_groundedness, per_question_results).
    """
    results = []
    for i, q in enumerate(questions, 1):
        question = q["question"]
        print(f"    [{i}/{len(questions)}] {question[:55]}...", end=" ", flush=True)

        # Retrieve context (same vector search as n8n uses)
        context = retrieve_context(question, openai_client)

        # Get answer from n8n using candidate prompt
        answer = get_answer_with_prompt(question, prompt_template)
        if answer.startswith("[ERROR"):
            print("ERROR → skipping")
            continue

        # Score groundedness with TrueLens (GPT-4o-mini claim decomposition)
        score = score_groundedness(context, answer, provider)
        print(f"GR={score:.2f}")
        results.append({"question": question, "groundedness": score, "answer": answer, "context": context})

    if not results:
        return 0.0, []
    avg = sum(r["groundedness"] for r in results) / len(results)
    return avg, results


# ── Main optimization loop ────────────────────────────────────────────────────

def run_optimizer():
    print("\n" + "═" * 60)
    print("  Atlas RAG Prompt Optimizer")
    print("═" * 60)

    for var in ["ANTHROPIC_API_KEY", "OPENAI_API_KEY", "NEO4J_PASSWORD", "KV_REST_API_URL", "KV_REST_API_TOKEN"]:
        if not os.getenv(var):
            raise EnvironmentError(f"Missing required env var: {var}")

    openai_client    = OpenAI(api_key=OPENAI_API_KEY)
    anthropic_client = Anthropic(api_key=ANTHROPIC_API_KEY)
    provider         = TruOpenAI(api_key=OPENAI_API_KEY)

    # 1. Load worst questions
    print("\n[1/4] Loading worst-performing questions from latest eval...")
    worst_questions = load_worst_questions(TOP_N_QUESTIONS)
    for q in worst_questions:
        print(f"  GR={float(q['groundedness']):.2f}  {q['question'][:70]}")

    # 2. Load or initialize system prompt
    print(f"\n[2/4] Loading current system prompt...")
    current_prompt = kv_get(KV_SYSTEM_PROMPT)
    if not current_prompt:
        print("  KV empty — seeding with baseline prompt")
        current_prompt = BASELINE_PROMPT
        kv_set(KV_SYSTEM_PROMPT, current_prompt)
    else:
        print(f"  Loaded from KV ({len(current_prompt)} chars)")

    # 3. Baseline score
    print(f"\n[3/4] Scoring baseline on {len(worst_questions)} worst questions...")
    print(f"  (Using TrueLens GPT-4o-mini claim decomposition — same judge as full eval)")
    baseline_score, baseline_results = run_mini_eval(
        worst_questions, current_prompt, openai_client, provider
    )
    print(f"\n  Baseline groundedness: {baseline_score:.3f}")

    # 4. Optimization loop
    run_id   = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    progress = {
        "run_id": run_id,
        "status": "running",
        "iteration": 0,
        "total_iterations": ITERATIONS,
        "baseline_score": round(baseline_score, 3),
        "current_best": round(baseline_score, 3),
        "improvements": 0,
        "started_at": datetime.now(timezone.utc).isoformat(),
        "log": [f"Baseline: {baseline_score:.3f}"],
    }
    kv_set(KV_PROGRESS, json.dumps(progress))

    best_prompt  = current_prompt
    best_score   = baseline_score
    no_improve   = 0
    change_log   = []
    final_iter   = ITERATIONS

    print(f"\n[4/4] Running up to {ITERATIONS} optimization iterations...\n")

    for iteration in range(1, ITERATIONS + 1):
        final_iter = iteration
        print(f"{'─' * 50}")
        print(f"Iteration {iteration}/{ITERATIONS}  |  Best so far: {best_score:.3f}")

        # Suggest edit
        print("  → Asking Sonnet for a targeted prompt edit...")
        candidate_prompt = suggest_prompt_edit(best_prompt, baseline_results, anthropic_client)

        if not candidate_prompt or "{context}" not in candidate_prompt:
            print("  ✗ Invalid suggestion (missing {context} placeholder) — skipping")
            no_improve += 1
        else:
            # Test candidate
            print(f"  → Testing candidate ({len(candidate_prompt)} chars)...")
            candidate_score, candidate_results = run_mini_eval(
                worst_questions, candidate_prompt, openai_client, provider
            )
            delta = candidate_score - best_score

            if candidate_score > best_score:
                print(f"  ✓ IMPROVED: {best_score:.3f} → {candidate_score:.3f} (+{delta:.3f})")
                best_prompt    = candidate_prompt
                best_score     = candidate_score
                baseline_results = candidate_results  # use for next suggestion context
                no_improve     = 0
                change_log.append({
                    "iteration": iteration,
                    "score": round(candidate_score, 3),
                    "delta": round(delta, 3),
                })
                kv_set(KV_SYSTEM_PROMPT, best_prompt)  # promote to production immediately
            else:
                print(f"  ✗ No improvement: {candidate_score:.3f} vs best {best_score:.3f} ({delta:+.3f})")
                no_improve += 1

        # Update live progress
        progress.update({
            "iteration": iteration,
            "current_best": round(best_score, 3),
            "improvements": len(change_log),
            "log": progress["log"] + [
                f"Iter {iteration}: {'↑' if change_log and change_log[-1]['iteration'] == iteration else '→'} "
                f"{best_score:.3f}"
            ],
        })
        kv_set(KV_PROGRESS, json.dumps(progress))

        if no_improve >= NO_IMPROVE_STOP:
            print(f"\n  Early stop: no improvement for {no_improve} consecutive iterations.")
            break

        time.sleep(1)

    # Final result
    total_improvement = best_score - baseline_score
    result = {
        "run_id": run_id,
        "status": "complete",
        "baseline_score": round(baseline_score, 3),
        "final_score": round(best_score, 3),
        "improvement": round(total_improvement, 3),
        "iterations_run": final_iter,
        "improvements_found": len(change_log),
        "change_log": change_log,
        "completed_at": datetime.now(timezone.utc).isoformat(),
    }
    kv_set(KV_RESULT, json.dumps(result))
    progress["status"] = "complete"
    kv_set(KV_PROGRESS, json.dumps(progress))

    print(f"\n{'═' * 60}")
    print("OPTIMIZATION COMPLETE")
    print(f"{'═' * 60}")
    print(f"  Baseline groundedness:  {baseline_score:.3f}")
    print(f"  Final groundedness:     {best_score:.3f}")
    print(f"  Total improvement:      {total_improvement:+.3f}")
    print(f"  Improvements found:     {len(change_log)}/{final_iter} iterations")
    if total_improvement > 0:
        print(f"\n  ✓ Winning prompt is LIVE in KV ({KV_SYSTEM_PROMPT})")
        print(f"    n8n reads it on every production request.")
    else:
        print(f"\n  → No net improvement. Baseline prompt remains in KV.")
    print()


# ── Watch mode ────────────────────────────────────────────────────────────────

def watch_for_trigger():
    print(f"\nWatch mode — polling KV every {WATCH_INTERVAL}s for trigger...")
    print("Use the Optimize RAG button in /analytics to start a run.")
    print("Press Ctrl+C to stop.\n")
    seen_request = None
    while True:
        try:
            raw = kv_get(KV_REQUEST)
            if raw and raw != seen_request:
                seen_request = raw
                try:
                    req_data = json.loads(raw)
                    requested_by = req_data.get("requested_by", "unknown")
                except Exception:
                    requested_by = "unknown"
                print(f"\n  Trigger received from {requested_by}!")
                kv_delete(KV_REQUEST)
                run_optimizer()
                print("\nResuming watch mode...")
            else:
                ts = datetime.now().strftime("%H:%M:%S")
                print(f"  [{ts}] Waiting for trigger from Vercel...", end="\r")
        except KeyboardInterrupt:
            print("\nWatch mode stopped.")
            break
        except Exception as e:
            print(f"\n  Watch error: {e}")
        time.sleep(WATCH_INTERVAL)


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Atlas RAG Prompt Optimizer")
    parser.add_argument(
        "--watch",
        action="store_true",
        help="Poll Upstash KV for a trigger from the Vercel /analytics UI",
    )
    args = parser.parse_args()

    if args.watch:
        watch_for_trigger()
    else:
        run_optimizer()
