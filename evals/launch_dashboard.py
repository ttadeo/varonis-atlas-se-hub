"""
Atlas Learning Platform — TruLens Dashboard Launcher

Launches the TruLens Streamlit dashboard showing all recorded eval runs.
Run record_evals.py first to populate the database.

Usage:
  python launch_dashboard.py
  → Opens http://localhost:8501 in your browser
"""

import os
from trulens.core import TruSession

DB_PATH = os.path.join(os.path.dirname(__file__), "trulens.sqlite")

if not os.path.exists(DB_PATH):
    print("No database found. Run record_evals.py first:")
    print("  python evals/record_evals.py")
    exit(1)

print("Starting TruLens dashboard...")
print("→ Open http://localhost:8501 in your browser")
print("→ Press Ctrl+C to stop\n")

tru = TruSession(database_url=f"sqlite:///{DB_PATH}")
tru.run_dashboard()
