"use client";

import { useEffect } from "react";

export type HelpPage = "learn" | "ask" | "meeting" | "demo" | "architect" | "runtime" | "guides" | "analytics";

interface Step {
  title: string;
  body: string;
}

interface HelpContent {
  heading: string;
  intro: string;
  steps: Step[];
}

const HELP_CONTENT: Record<HelpPage, HelpContent> = {
  learn: {
    heading: "How to Use the Learning Course",
    intro: "The Atlas Learning Course walks you through Varonis Atlas AI Security across 3 tiers — Beginner, Intermediate, and Advanced. Here's how to get the most out of it.",
    steps: [
      {
        title: "1. Pick a Lesson",
        body: "Select any lesson from the sidebar. Start with Beginner Tier (Lesson 1) if you're new to Atlas. Each lesson builds on the previous one.",
      },
      {
        title: "2. Read the Introduction",
        body: "Each lesson opens with a brief introduction from Atlas. Read it, then ask follow-up questions in the chat below — anything goes.",
      },
      {
        title: "3. Ask Questions Freely",
        body: "Type any question related to the lesson topic. Atlas will pull from the full knowledge base to answer. Use the follow-up pill buttons for quick prompts if you're not sure what to ask.",
      },
      {
        title: "4. Choose Your Learning Style",
        body: "At the bottom of the sidebar, pick how you want Atlas to respond:\n• 📊 Visual — headers, tables, bullet points\n• 📖 Reading — flowing prose and narrative\n• 🔊 Voice — conversational, great with text-to-speech",
      },
      {
        title: "5. Answer the Check Question",
        body: "Each lesson ends with a Check Question. Type your answer in the chat. AI grading will score your response — you need to pass (score ≥ 70) before you can mark the lesson complete.",
      },
      {
        title: "6. Mark as Complete & Progress",
        body: "Once you pass the check question, click 'Mark as Complete'. Your progress is saved automatically. You can pick up where you left off in any future session.",
      },
      {
        title: "7. AI Answer Grading",
        body: "Toggle 'AI Answer Grading' in the sidebar to enable or disable scoring on your check question answers. When enabled, Atlas grades your response and tells you what you got right and what's missing.",
      },
    ],
  },

  ask: {
    heading: "How to Use Atlas Q&A",
    intro: "The Q&A page gives you direct access to the full Atlas knowledge base. Ask anything about the Atlas platform — no lesson structure required.",
    steps: [
      {
        title: "1. Ask Any Atlas Question",
        body: "Type a question about any Atlas feature, concept, or use case. Examples:\n• 'What is Shadow AI and why does it matter?'\n• 'How does the AI Gateway handle policy conflicts?'\n• 'What's the difference between WARN, BLOCK, and MODIFY policies?'",
      },
      {
        title: "2. Ask Navigation Questions",
        body: "Not sure where to find something in the Atlas UI? Ask:\n• 'Where do I configure guardrails?'\n• 'How do I get to the AI Inventory?'\nAtlas will give you the exact path and click instructions.",
      },
      {
        title: "3. Follow the Conversation",
        body: "The Q&A remembers your conversation history within the session. You can ask follow-up questions naturally — 'Tell me more about that' or 'Give me an example' — without repeating context.",
      },
      {
        title: "4. Use It for Meeting Prep",
        body: "Before a customer call, use Q&A to sharpen your answers on specific topics. Ask the tough questions a CISO or security architect might ask so you're prepared.",
      },
      {
        title: "5. Start Fresh",
        body: "To reset the conversation and start a new topic, refresh the page. Each session starts with a clean slate.",
      },
    ],
  },

  meeting: {
    heading: "How to Use the Meeting Co-Pilot",
    intro: "The Meeting Co-Pilot supports you during live customer conversations. Set your context before the meeting, then ask questions in real time as they come up.",
    steps: [
      {
        title: "1. Set Your Meeting Context",
        body: "Before asking questions, fill in the meeting context panel on the left:\n• Industry (e.g., Financial Services, Healthcare)\n• Meeting type (Discovery, Demo, Technical Deep Dive)\n• Attendees (e.g., CISO, Security Architect)\n• Known concerns or objections\n\nThis shapes how Atlas tailors every response.",
      },
      {
        title: "2. Generate a Demo Script",
        body: "Click 'Generate Demo Script' to get a full meeting guide — agenda, talking points, likely objections, and suggested demo flow — based on your context.",
      },
      {
        title: "3. Ask Live Questions",
        body: "During the meeting, type customer questions directly as they come up. Atlas responds with accurate, context-aware answers you can relay in real time.",
      },
      {
        title: "4. Use Quick Response Mode",
        body: "'Quick Response' gives you a short, sharp answer optimized for live meetings — no lengthy explanations. Use this when the customer is waiting. Toggle off for deeper analysis.",
      },
      {
        title: "5. Pop Out for Dual Screen",
        body: "Click 'Pop Out' to open the Q&A in a separate window. Keep the chat on one screen, your video call on the other.",
      },
      {
        title: "6. Confidence Scores",
        body: "Each answer shows a confidence score — High, Medium, or Low. Low confidence means Atlas is less certain; treat those answers as starting points and verify before sharing with the customer.",
      },
    ],
  },

  demo: {
    heading: "How to Use the Demo Provisioning Tool",
    intro: "The Demo Provisioning tool has two modes — Demo Prep stages Atlas policy templates for a customer use case, and Chain of Custody visualizes your full AI supply chain.",
    steps: [
      {
        title: "Demo Prep — Describe the Use Case",
        body: "In the text field, describe what the customer is trying to protect. Be specific:\n• 'Financial services firm worried about employees pasting PII into ChatGPT'\n• 'Healthcare org that wants to block unauthorized AI tools'\n• 'Tech company that needs visibility into which AI apps developers are using'",
      },
      {
        title: "Demo Prep — Find Matching Templates",
        body: "Click 'Find Matching Templates'. Claude analyzes your use case against real Atlas templates and returns:\n• Existing templates with match scores and reasoning\n• A custom recommendation if no template fits well\n• An overall recommendation of which path to take",
      },
      {
        title: "Demo Prep — Apply a Template",
        body: "'Apply This' applies an existing template to your Atlas project via API.\n\n'How to Apply' walks you through applying the template manually in the Atlas UI — use this for custom template recommendations, as the Atlas API currently restricts programmatic creation of new templates.",
      },
      {
        title: "Demo Prep — Atlas Project",
        body: "Select the Atlas Project where the template will be scoped. This determines which endpoint or project gets the policy configuration applied.",
      },
      {
        title: "Chain of Custody — Build Mock Scenario",
        body: "Use 'Build Mock Scenario' to populate your Atlas project with a realistic set of AI artifacts (LLM endpoints, models, libraries, frameworks) that match a customer scenario — E-Commerce, Healthcare, Financial Services, etc.",
      },
      {
        title: "Chain of Custody — Scan AI Inventory",
        body: "Click 'Scan AI Inventory' to pull live data from your Atlas tenant and visualize the full AI supply chain — every discovered resource across all projects, grouped by type (Models, Endpoints, Software, Agents, Applications). Use this to show customers what Atlas discovers automatically in their environment.",
      },
    ],
  },

  architect: {
    heading: "How to Use the Architecture Builder",
    intro: "The Architecture Builder generates a custom reference architecture document with a Mermaid diagram and a full narrative — tailored to a specific customer's environment and use case.",
    steps: [
      {
        title: "1. Set the Audience",
        body: "Choose between Customer-Facing and Internal SE.\n• Customer-Facing — professional tone, business value focus, no internal jargon\n• Internal SE — technical depth, implementation details, config notes",
      },
      {
        title: "2. Fill in the Customer Profile",
        body: "Complete all four fields:\n• Industry — select from the dropdown\n• AI Use Case — describe what AI they're building or using (be specific)\n• Tech Stack — list their actual tools (e.g. Azure, OpenAI API, LangChain, Snowflake)\n• Key Concerns — check all that apply\n\nMore detail = better output. The AI uses your exact stack and concerns throughout the document.",
      },
      {
        title: "3. Generate the Architecture",
        body: "Click 'Generate Architecture'. This calls the Atlas RAG knowledge base and Claude to produce:\n• A Mermaid flowchart showing the customer environment with Atlas overlaid\n• An 800-word narrative covering Executive Summary, Data Flow, Atlas Modules, Security Controls, and Implementation Considerations\n\nGeneration takes 20–60 seconds.",
      },
      {
        title: "4. Export Options",
        body: "Three export options in the toolbar:\n• ↗ Full Screen — opens the diagram in a standalone dark page, ideal for zooming/panning complex diagrams\n• Download .md — saves the full document as a Markdown file with embedded Mermaid code\n• Export PDF — prints the full document (diagram + narrative) as a PDF via browser print",
      },
      {
        title: "5. PDF Export Tips",
        body: "When exporting to PDF, use your browser's print dialog:\n• Set paper size to A4 or Letter, portrait\n• Enable 'Print backgrounds' for proper styling\n• The diagram and narrative are formatted to fit cleanly across pages",
      },
      {
        title: "6. Diagram Complexity",
        body: "Simple stacks (1-2 LLMs, clear data flow) produce clean diagrams. Complex environments with many tools may produce a dense diagram — use Full Screen to view it clearly, or reference the narrative which covers the same content in prose.",
      },
    ],
  },

  runtime: {
    heading: "How to Use the AI Runtime Demo",
    intro: "The AI Runtime Demo fires real prompts through the Atlas Gateway so you can show customers live policy enforcement — blocked requests, tagged PII, and logged events — in real time.",
    steps: [
      {
        title: "1. Select a Scenario",
        body: "Three pre-built scenarios are available:\n• Healthcare — Clinical Note Summarizer (SSNs, MRNs, PHI → PII guardrails)\n• Financial Services — AI Risk Analyzer (account numbers, unreleased earnings → data leakage guardrails)\n• E-Commerce — Recommendation Engine (prompt injection attack → injection guardrails)\n\nEach scenario fires 2 prompts designed to trigger specific Atlas policies.",
      },
      {
        title: "2. Run the Simulation",
        body: "Click 'Run Simulation →'. Both prompts are sent through the Atlas Gateway in real time using your configured endpoint. Results appear within seconds.",
      },
      {
        title: "3. Read the Results",
        body: "Each result card shows:\n• ✓ SENT — prompt passed through the Gateway (LLM responded normally)\n• 🛡 BLOCKED — Atlas policy fired and blocked the prompt\n• ⚠ ERROR — something went wrong (check Gateway configuration)\n\nBlocked cards show which policy triggered and the block message.",
      },
      {
        title: "4. View in Atlas Runtime",
        body: "Click 'View in Atlas Runtime →' after running a simulation. This opens Atlas AI Investigation where you can see every request logged, tagged PII categories, session severity ratings, and policy enforcement events — the full audit trail.",
      },
      {
        title: "5. Demo Talking Points",
        body: "Use this page to show customers:\n• Atlas sitting inline between their app and the LLM\n• Real-time policy enforcement (not just logging)\n• Every prompt logged with full context for compliance\n• The same gateway protects all AI tools, not just one",
      },
      {
        title: "6. Simulation Types",
        body: "Currently only 'Prompt Traffic' is active — fires real prompts through the Gateway. 'MCP Call Simulation' and 'Multi-Agent Workflow' are coming soon and will demonstrate Atlas protecting agentic and tool-call traffic.",
      },
    ],
  },

  guides: {
    heading: "How to Use the Technical Guide Producer",
    intro: "The Technical Guide Producer generates full markdown technical documents — deployment guides, compliance write-ups, integration specs — grounded in the Atlas knowledge base and tailored to a customer's context.",
    steps: [
      {
        title: "1. Select a Guide Type",
        body: "Five guide types are available:\n• MCP Integration Guide — Atlas + Model Context Protocol for secure AI agent workflows\n• AI Gateway Deployment Guide — step-by-step Gateway config and policy setup\n• Compliance & Audit Readiness — how Atlas addresses HIPAA, SOC2, GDPR, etc.\n• Problem → Solution Write-Up — document a customer engagement story\n• Custom Topic — any Atlas topic or customer scenario freeform",
      },
      {
        title: "2. Set the Audience",
        body: "Choose Customer-Facing or Internal SE. This determines the tone:\n• Customer-Facing — business value focus, professional language, no internal jargon\n• Internal SE — technical depth, config specifics, implementation notes",
      },
      {
        title: "3. Fill in the Topic",
        body: "The topic field pre-fills based on your guide type selection. You can edit it to be more specific:\n• Generic: 'Atlas AI Gateway deployment'\n• Better: 'Atlas AI Gateway deployment for a healthcare org using Azure OpenAI and LangChain'",
      },
      {
        title: "4. Add Industry and Tech Stack (optional)",
        body: "Adding these fields makes the guide significantly more specific and useful:\n• Industry — shapes compliance framing and risk language\n• Tech Stack — Claude references the customer's actual tools throughout the guide",
      },
      {
        title: "5. Add Customer Context (optional)",
        body: "Use the Customer Context field for any additional details — a known concern, a specific objection, a deployment constraint. Claude will incorporate this into the guide.",
      },
      {
        title: "6. Generate and Export",
        body: "Click 'Generate Guide'. Generation takes 20–60 seconds. Once complete:\n• Read the guide in the preview pane\n• Click 'Download .md' to save as a Markdown file\n• Use 'Export PDF' to print to PDF via browser\n\nThe guide is grounded in real Atlas documentation — not hallucinated.",
      },
    ],
  },

  analytics: {
    heading: "How to Use Interaction Analytics",
    intro: "Interaction Analytics shows how the Atlas Learning Platform is being used — session volume, question patterns, knowledge base coverage, and answer quality over time.",
    steps: [
      {
        title: "Summary Cards",
        body: "The top row shows aggregate counts:\n• Total Sessions — unique sessions across all users\n• Total Interactions — individual question/answer turns\n• Quick Answers — responses from the Meeting Co-Pilot quick mode\n• Chat Turns — full conversational exchanges\n\nUse these to gauge overall platform adoption.",
      },
      {
        title: "Session Trends",
        body: "The session chart shows usage volume over time. Look for:\n• Spikes around training events or product launches\n• Consistent daily usage indicating the platform is becoming part of SE workflow\n• Drops that might indicate friction or access issues",
      },
      {
        title: "Top Questions",
        body: "The most frequently asked questions reveal what SEs are actually uncertain about. Use this to:\n• Identify knowledge gaps worth covering in training\n• Prioritize which Atlas topics need better documentation in the knowledge base\n• Spot customer objections that are coming up repeatedly in meetings",
      },
      {
        title: "Knowledge Base Coverage",
        body: "Shows which Atlas topic areas are being queried most. Sections with low query volume may indicate SEs aren't finding value there, or the content isn't surfacing correctly in RAG retrieval.",
      },
      {
        title: "Refresh",
        body: "Click 'Refresh' in the header to pull the latest data. Analytics are logged from real interactions — the data updates as the platform is used.",
      },
    ],
  },
};

interface HelpPanelProps {
  page: HelpPage;
  open: boolean;
  onClose: () => void;
}

export default function HelpPanel({ page, open, onClose }: HelpPanelProps) {
  const content = HELP_CONTENT[page];

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      )}

      {/* Slide-out panel */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-gray-900 border-l border-gray-700 z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">?</div>
            <span className="font-semibold text-white text-sm">{content.heading}</span>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl leading-none"
            aria-label="Close help"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          <p className="text-sm text-gray-300 leading-relaxed">{content.intro}</p>

          <div className="space-y-4">
            {content.steps.map((step, i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-4">
                <p className="text-sm font-semibold text-white mb-1">{step.title}</p>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{step.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-700 shrink-0">
          <p className="text-xs text-gray-500 text-center">Press Esc or click outside to close</p>
        </div>
      </div>
    </>
  );
}
