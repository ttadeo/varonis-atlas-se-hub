"use client";

import { useEffect } from "react";

export type HelpPage = "learn" | "ask" | "meeting" | "demo";

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
        title: "7. AI Answer Grading (Optional)",
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
        title: "5. Attach Documents",
        body: "Attach RFPs, security questionnaires, or customer architecture diagrams using the attachment button. Atlas will factor the document content into its answers.",
      },
      {
        title: "6. Pop Out for Dual Screen",
        body: "Click 'Pop Out' to open the Q&A in a separate window. Keep the chat on one screen, your video call on the other. Both windows stay in sync.",
      },
      {
        title: "7. Confidence Scores",
        body: "Each answer shows a confidence score — High, Medium, or Low. Low confidence means Atlas is less certain; treat those answers as starting points and verify before sharing with the customer.",
      },
    ],
  },
  demo: {
    heading: "How to Use the Demo Provisioning Tool",
    intro: "The Demo Provisioning tool helps you stand up an Atlas demo environment tailored to a specific customer use case — in minutes, not hours.",
    steps: [
      {
        title: "1. Describe the Use Case",
        body: "In the text field, describe what the customer is trying to protect or control. Be specific:\n• 'Financial services firm worried about employees pasting customer PII into ChatGPT'\n• 'Healthcare org that wants to block unauthorized AI tools entirely'\n• 'Tech company that needs visibility into which AI apps their developers are using'",
      },
      {
        title: "2. Add Industry and Meeting Type",
        body: "Select the customer's industry and meeting type. This helps Atlas match the most relevant policy templates and frame the recommendation correctly.",
      },
      {
        title: "3. Discover Matching Templates",
        body: "Click 'Discover Templates'. Atlas will analyze your use case and return:\n• Existing templates that match (with match scores and reasons)\n• A custom recommendation if no existing template fits well\n• An overall recommendation of which path to take",
      },
      {
        title: "4. Review the Recommendations",
        body: "Read through the matched templates. Each one shows:\n• Match score (how well it fits)\n• Why it matches\n• Which Atlas rules are included\n\nCompare against the custom recommendation to decide which to provision.",
      },
      {
        title: "5. Provision the Demo",
        body: "Select your preferred template (existing or custom) and click 'Provision Demo'. Atlas will apply the policy configuration to your demo tenant automatically. You'll get a confirmation when it's live.",
      },
      {
        title: "6. Use in the Meeting",
        body: "Once provisioned, your demo tenant reflects the customer's specific use case. Walk them through Atlas showing exactly the policies and guardrails relevant to their environment — not a generic demo.",
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
