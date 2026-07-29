"""
Judge Correlation Test
======================
Scores the same 10 worst-performing questions with multiple judge models
and compares rankings against GPT-4o-mini (our ground truth).

The best proxy judge is the one whose rankings most closely match GPT-4o-mini
at the lowest cost — that's what we'll use in the optimizer.

Judges tested:
  - gpt-4o-mini        (ground truth — current TrueLens standard)
  - claude-haiku-4-5   (what we used — proved to be a poor proxy)
  - claude-sonnet-4-6  (same model generating answers — hypothesis: better calibrated)
  - gemini-2.0-flash   (Google fast model — cheap, strong reasoning)

Usage:
  python evals/judge_correlation_test.py
"""

import os, json, csv, requests
from pathlib import Path
from dotenv import load_dotenv
from openai import OpenAI
from anthropic import Anthropic
from neo4j import GraphDatabase
import scipy.stats as stats

_DIR = Path(__file__).parent
load_dotenv(_DIR / ".env")
load_dotenv(_DIR.parent / "ui/.env.local", override=False)

OPENAI_API_KEY    = os.getenv("OPENAI_API_KEY")
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
GOOGLE_API_KEY    = os.getenv("GOOGLE_API_KEY")
N8N_WEBHOOK       = os.getenv("N8N_WEBHOOK_URL", "https://ttadeo.app.n8n.cloud/webhook/atlas-rag-query")
NEO4J_URI         = os.getenv("NEO4J_URI", "bolt://192.168.1.165:7687")
NEO4J_USER        = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD    = os.getenv("NEO4J_PASSWORD")

TOP_K_CHUNKS  = 5
EMBED_MODEL   = "text-embedding-3-small"
N_QUESTIONS   = 10

GROUNDEDNESS_PROMPT = """\
You are an objective evaluator assessing whether an AI-generated answer is grounded \
in the provided source context.

Score 0.0 to 1.0:
- 1.0: Every factual claim in the answer is explicitly supported by the source context
- 0.7: Most claims supported; minor inferences or bridging statements present
- 0.5: Some claims supported, others drawn from general knowledge
- 0.3: Significant claims not in the source context
- 0.0: Substantial information not present in the source context

Source context:
{context}

Answer:
{answer}

Respond with ONLY a single float between 0.0 and 1.0. No explanation."""


# ── Context retrieval ─────────────────────────────────────────────────────────

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
                top_k=TOP_K_CHUNKS, embedding=embedding,
            )
            chunks = [f"[{r['heading']}]\n{r['text']}" for r in result]
    finally:
        driver.close()
    return "\n\n---\n\n".join(chunks) if chunks else "(no context retrieved)"


def get_answer(question: str) -> str:
    sanitized = question.replace("\n", " ").replace('"', "'")
    try:
        r = requests.post(
            N8N_WEBHOOK,
            json={"question": sanitized, "history": []},
            timeout=120,
        )
        r.raise_for_status()
        return r.json().get("answer", "")
    except Exception as e:
        return f"[ERROR: {e}]"


# ── Judge implementations ─────────────────────────────────────────────────────

def judge_openai(model: str, context: str, answer: str, client: OpenAI) -> float:
    prompt = GROUNDEDNESS_PROMPT.format(context=context[:3000], answer=answer[:2000])
    try:
        r = client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            temperature=0,
            max_tokens=10,
        )
        return float(r.choices[0].message.content.strip())
    except Exception:
        return 0.5


def judge_anthropic(model: str, context: str, answer: str, client: Anthropic) -> float:
    prompt = GROUNDEDNESS_PROMPT.format(context=context[:3000], answer=answer[:2000])
    try:
        msg = client.messages.create(
            model=model,
            max_tokens=10,
            messages=[{"role": "user", "content": prompt}],
        )
        return float(msg.content[0].text.strip())
    except Exception:
        return 0.5


def judge_gemini(context: str, answer: str) -> float:
    if not GOOGLE_API_KEY:
        return None
    prompt = GROUNDEDNESS_PROMPT.format(context=context[:3000], answer=answer[:2000])
    try:
        r = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GOOGLE_API_KEY}",
            json={"contents": [{"parts": [{"text": prompt}]}],
                  "generationConfig": {"temperature": 0, "maxOutputTokens": 10}},
            timeout=30,
        )
        text = r.json()["candidates"][0]["content"]["parts"][0]["text"].strip()
        return float(text)
    except Exception:
        return None


# ── Load worst questions ──────────────────────────────────────────────────────

def load_worst_questions(n: int) -> list:
    csv_files = sorted(
        (_DIR / "results").glob("eval_results_*.csv"),
        key=lambda p: p.stat().st_mtime, reverse=True,
    )
    if not csv_files:
        raise FileNotFoundError("No eval CSV found — run run_evals.py first.")
    rows = []
    with open(csv_files[0]) as f:
        for row in csv.DictReader(f):
            rows.append(row)
    rows.sort(key=lambda r: float(r["groundedness"]))
    return rows[:n]


# ── Correlation helpers ───────────────────────────────────────────────────────

def spearman(scores_a: list, scores_b: list) -> float:
    """Spearman rank correlation between two score lists."""
    if len(scores_a) < 3:
        return float("nan")
    corr, _ = stats.spearmanr(scores_a, scores_b)
    return round(corr, 3)


def mae(scores_a: list, scores_b: list) -> float:
    """Mean absolute error between two score lists."""
    return round(sum(abs(a - b) for a, b in zip(scores_a, scores_b)) / len(scores_a), 3)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print("\n" + "═" * 65)
    print("  Judge Correlation Test")
    print("═" * 65)

    openai_client    = OpenAI(api_key=OPENAI_API_KEY)
    anthropic_client = Anthropic(api_key=ANTHROPIC_API_KEY)

    judges = {
        "gpt-4o-mini":       lambda ctx, ans: judge_openai("gpt-4o-mini",              ctx, ans, openai_client),
        "claude-haiku":      lambda ctx, ans: judge_anthropic("claude-haiku-4-5-20251001", ctx, ans, anthropic_client),
        "claude-sonnet":     lambda ctx, ans: judge_anthropic("claude-sonnet-4-6",      ctx, ans, anthropic_client),
    }
    if GOOGLE_API_KEY:
        judges["gemini-2.0-flash"] = lambda ctx, ans: judge_gemini(ctx, ans)
    else:
        print("  Note: GOOGLE_API_KEY not set — skipping Gemini judge")

    # Load worst questions
    print(f"\n[1/3] Loading {N_QUESTIONS} worst-performing questions...")
    worst = load_worst_questions(N_QUESTIONS)
    for q in worst:
        print(f"  GR={float(q['groundedness']):.2f}  {q['question'][:65]}")

    # Get answers from n8n
    print(f"\n[2/3] Fetching answers from n8n RAG pipeline...")
    samples = []
    for i, q in enumerate(worst, 1):
        question = q["question"]
        print(f"  [{i}/{N_QUESTIONS}] {question[:55]}...", end=" ", flush=True)
        context = retrieve_context(question, openai_client)
        answer  = get_answer(question)
        samples.append({"question": question, "context": context, "answer": answer})
        print("✓")

    # Score with all judges
    print(f"\n[3/3] Scoring with {len(judges)} judges...\n")
    results = {name: [] for name in judges}

    for i, sample in enumerate(samples, 1):
        q_short = sample["question"][:50]
        print(f"  Q{i}: {q_short}...")
        for name, judge_fn in judges.items():
            score = judge_fn(sample["context"], sample["answer"])
            results[name].append(score if score is not None else 0.5)
            print(f"       {name:<20} {score:.2f}" if score is not None else f"       {name:<20} N/A")
        print()

    # Correlation analysis vs GPT-4o-mini (ground truth)
    ground_truth = results["gpt-4o-mini"]

    print("═" * 65)
    print("CORRELATION VS GPT-4o-mini (ground truth)")
    print("═" * 65)
    print(f"{'Judge':<22} {'Spearman ρ':>12} {'MAE':>8}  {'Verdict'}")
    print("─" * 65)

    correlations = {}
    for name, scores in results.items():
        if name == "gpt-4o-mini":
            continue
        valid = [(g, s) for g, s in zip(ground_truth, scores) if s is not None]
        if not valid:
            continue
        g_vals = [v[0] for v in valid]
        s_vals = [v[1] for v in valid]
        rho  = spearman(g_vals, s_vals)
        error = mae(g_vals, s_vals)
        correlations[name] = {"spearman": rho, "mae": error}

        if rho >= 0.85:
            verdict = "✓ Excellent proxy"
        elif rho >= 0.70:
            verdict = "~ Good proxy"
        elif rho >= 0.50:
            verdict = "△ Weak proxy"
        else:
            verdict = "✗ Poor proxy"

        print(f"  {name:<20} {rho:>12.3f} {error:>8.3f}  {verdict}")

    # Per-question score table
    print(f"\n{'─' * 65}")
    print("PER-QUESTION SCORES")
    print(f"{'─' * 65}")
    header = f"  {'Q':>2}  {'GPT-4o-mini':>12}"
    for name in judges:
        if name != "gpt-4o-mini":
            header += f"  {name[:14]:>14}"
    print(header)
    print("  " + "─" * 62)
    for i, (sample, gt_score) in enumerate(zip(samples, ground_truth), 1):
        row = f"  {i:>2}  {gt_score:>12.2f}"
        for name, scores in results.items():
            if name != "gpt-4o-mini":
                row += f"  {scores[i-1]:>14.2f}"
        print(row)

    # Recommendation
    print(f"\n{'═' * 65}")
    print("RECOMMENDATION")
    print(f"{'═' * 65}")
    if correlations:
        best = max(correlations, key=lambda k: correlations[k]["spearman"])
        best_rho = correlations[best]["spearman"]
        best_mae = correlations[best]["mae"]
        print(f"  Best proxy judge: {best}")
        print(f"  Spearman ρ={best_rho:.3f}, MAE={best_mae:.3f}")
        if best_rho >= 0.85:
            print(f"\n  Use {best} in the optimizer — high correlation with ground truth.")
            print(f"  It will find real improvements, not Haiku noise.")
        elif best_rho >= 0.70:
            print(f"\n  {best} is a reasonable proxy but not ideal.")
            print(f"  Consider running full GPT-4o-mini eval every 3rd iteration to sanity-check.")
        else:
            print(f"\n  No tested model correlates well with GPT-4o-mini.")
            print(f"  Use GPT-4o-mini directly in the optimizer (full-quality run).")
    print()


if __name__ == "__main__":
    main()
