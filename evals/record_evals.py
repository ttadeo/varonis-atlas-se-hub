"""
Atlas Learning Platform — TruLens Recording Harness
Records all eval runs into TruLens SQLite database for dashboard visualization.

Run this AFTER run_evals.py to populate the dashboard database.
Then launch the dashboard with: python launch_dashboard.py

Usage:
  python record_evals.py              # Record all 38 questions
  python record_evals.py --lesson 17  # Record one lesson only
"""

import os
import json
import argparse
from dotenv import load_dotenv
from openai import OpenAI

from trulens.core import TruSession, Feedback
from trulens.apps.basic import TruBasicApp
from trulens.providers.openai import OpenAI as TruOpenAI

# Import helpers from run_evals
import sys
sys.path.insert(0, os.path.dirname(__file__))
from run_evals import retrieve_context, get_answer, score_safety, sanitize

load_dotenv()

OPENAI_API_KEY        = os.getenv("OPENAI_API_KEY")
NEO4J_URI             = os.getenv("NEO4J_URI",      "bolt://192.168.1.165:7687")
NEO4J_USER            = os.getenv("NEO4J_USER",     "neo4j")
NEO4J_PASSWORD        = os.getenv("NEO4J_PASSWORD")
GOLDEN_QUESTIONS_FILE = os.path.join(os.path.dirname(__file__), "golden_questions.json")
DB_PATH               = os.path.join(os.path.dirname(__file__), "trulens.sqlite")


def main(lesson_filter: int | None = None):
    missing = [v for v in ["OPENAI_API_KEY", "NEO4J_PASSWORD"] if not os.getenv(v)]
    if missing:
        raise EnvironmentError(f"Missing env vars: {', '.join(missing)}")

    openai_client = OpenAI(api_key=OPENAI_API_KEY)
    provider      = TruOpenAI(api_key=OPENAI_API_KEY)

    # ── TruLens session (writes to local SQLite) ───────────────────────────────
    tru = TruSession(database_url=f"sqlite:///{DB_PATH}")

    with open(GOLDEN_QUESTIONS_FILE) as f:
        questions = json.load(f)

    if lesson_filter:
        questions = [q for q in questions if q["lesson_id"] == lesson_filter]

    # ── Feedbacks ──────────────────────────────────────────────────────────────
    f_ar = Feedback(provider.relevance,               name="Answer Relevance" ).on_input_output()
    f_cr = Feedback(provider.context_relevance,       name="Context Relevance").on_input_output()
    f_gr = Feedback(
        provider.groundedness_measure_with_cot_reasons, name="Groundedness"
    ).on_input_output()

    # ── Per-question recording ─────────────────────────────────────────────────
    print(f"\n{'─'*60}")
    print(f"Recording {len(questions)} questions into TruLens dashboard database")
    print(f"Database: {DB_PATH}")
    print(f"{'─'*60}\n")

    for i, q in enumerate(questions, 1):
        label = f"L{q['lesson_id']} [{q['question_type']}]"
        print(f"[{i}/{len(questions)}] {label}  {q['question'][:70]}...")

        # Pre-retrieve context so we can pass it as the "context" input
        context = retrieve_context(q["question"], openai_client)

        # Wrap a function that takes (question, context) and returns the answer
        # TruLens records input/output for each call
        def pipeline(question_text: str, ctx: str = context) -> str:
            return get_answer(question_text)

        app_version = f"L{q['lesson_id']}-{q['question_type']}"
        tru_app = TruBasicApp(
            pipeline,
            app_name="Atlas RAG",
            app_version=app_version,
            feedbacks=[f_ar],
        )

        with tru_app as recording:
            answer = tru_app.app(q["question"])

        safety = score_safety(q["question"], answer, openai_client)
        print(f"  → recorded  SAFE={safety:.2f}")

    print(f"\n✓ Done. Launch dashboard with: python evals/launch_dashboard.py")
    tru.stop_evaluator_pipe()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Atlas TruLens recording harness")
    parser.add_argument("--lesson", type=int, help="Record only this lesson ID")
    args = parser.parse_args()
    main(lesson_filter=args.lesson)
