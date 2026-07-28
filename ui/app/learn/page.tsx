"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import HelpPanel from "@/components/HelpPanel";

const N8N_WEBHOOK = "/api/learn";

type LearningStyle = "visual" | "reading" | "voice";

const STYLE_PREFIXES: Record<LearningStyle, string> = {
  visual:
    "RESPONSE STYLE: Use structured formatting — headers, bullet points, tables, and numbered steps. Be concise and scannable. ",
  reading:
    "RESPONSE STYLE: Write in flowing prose with rich context and explanation. Use narrative paragraphs rather than lists. ",
  voice:
    "RESPONSE STYLE: Write conversationally as if speaking aloud. Avoid markdown, headers, and bullet points — use plain sentences. Keep it natural and easy to listen to. ",
};

function stripMarkdown(text: string): string {
  return text
    .replace(/#{1,6}\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`{1,3}[^`]*`{1,3}/g, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\|[^\n]+\|/g, "")
    .replace(/\n{2,}/g, ". ")
    .replace(/\n/g, " ")
    .trim();
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Lesson {
  id: number;
  title: string;
  tier: string;
  intro: string;
  checkQuestion: string;
  followUpPrompts: string[];
}

interface JudgeResult {
  passed: boolean;
  score: number;
  feedback: string;
  missing: string[];
}

const LESSONS: Lesson[] = [
  {
    id: 1,
    title: "What is Varonis Atlas?",
    tier: "beginner",
    checkQuestion: "In your own words, what is the main security problem that Atlas is designed to solve?",
    followUpPrompts: [
      "Give me a real customer scenario where all four risk categories show up",
      "How would I explain Shadow AI to a CISO in one sentence?",
      "What's the difference between AI Gateway and AI Monitor?",
    ],
    intro: `[LEARNING MODE - Lesson 1: What is Varonis Atlas?]
You are teaching a Varonis Sales Engineer who is new to Atlas. Please:
1. Explain what Varonis Atlas is and its core purpose in 2-3 sentences
2. Describe the four core AI risk categories Atlas addresses — use these exact terms: Shadow AI, Data Leakage, Compliance Gaps, Attacks on AI
3. List the key applications in Atlas at a high level (AI Gateway, AI Usage, AI Inventory, AI Monitor, AI 360, AI Compliance)
4. End with this exact check question: "In your own words, what is the main security problem that Atlas is designed to solve?"
Keep it concise and SE-friendly. No need for the SE to have deep technical knowledge yet.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate to the next lesson using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 2,
    title: "Atlas Architecture Overview",
    tier: "beginner",
    checkQuestion: "Why does Atlas run the proxy on the customer plane rather than in Varonis infrastructure?",
    followUpPrompts: [
      "What data actually lives in the Control Plane vs Customer Plane?",
      "How does the two-plane architecture address data residency requirements?",
      "Walk me through what happens when a prompt is blocked — where does that data go?",
    ],
    intro: `[LEARNING MODE - Lesson 2: Atlas Architecture Overview]
You are teaching a Varonis Sales Engineer. Please:
1. Explain the two-plane architecture: Control Plane (Varonis-managed) vs Customer Plane (customer-deployed)
2. Explain what runs on the customer plane and why it matters for data privacy
3. Describe how Atlas connects to LLM endpoints
4. End with this exact check question: "Why does Atlas run the proxy on the customer plane rather than in Varonis infrastructure?"
Keep it concise and SE-friendly.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 3,
    title: "The AI Gateway",
    tier: "beginner",
    checkQuestion: "A customer's application currently calls https://api.openai.com/v1. What do they need to change to route traffic through Atlas?",
    followUpPrompts: [
      "What does the rule orchestrator actually do when it evaluates a prompt?",
      "What happens to a MODIFIED prompt — does the user see the original or modified version?",
      "Can a customer deploy the AI Gateway without changing application code?",
    ],
    intro: `[LEARNING MODE - Lesson 3: The AI Gateway]
You are teaching a Varonis Sales Engineer. Please:
1. Explain what the AI Gateway is (nginx proxy, sits between apps and LLMs)
2. Explain the flow: app → proxy → rule orchestrator → policy rules → LLM
3. Explain the three policy actions: WARN, BLOCK, MODIFY — and what each does to the prompt
4. Explain that connecting an app to Atlas is simply changing the LLM base URL to point to the Atlas proxy
5. End with this exact check question: "A customer's application currently calls https://api.openai.com/v1. What do they need to change to route traffic through Atlas?"
Keep it concise and SE-friendly.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 4,
    title: "Policy Types: WARN, BLOCK, MODIFY",
    tier: "beginner",
    checkQuestion: "A customer wants to prevent prompt injection attacks but still wants to see what was attempted. Which action(s) would you recommend and why?",
    followUpPrompts: [
      "Give me an example policy combining BLOCK on input and WARN on output",
      "What's the performance impact of synchronous vs asynchronous processing?",
      "How does MODIFY work on output guard — can you show me a real example?",
    ],
    intro: `[LEARNING MODE - Lesson 4: Policy Actions in Depth]
You are teaching a Varonis Sales Engineer. Please:
1. Go deeper on each policy action: WARN, BLOCK, MODIFY — with a real-world example for each
2. Explain that actions apply to Input Guard (prompts) and/or Output Guard (responses)
3. Explain that actions can be combined (e.g. BLOCK on input, WARN on output)
4. Explain the difference between synchronous (BLOCK/MODIFY) and asynchronous (WARN/LOG) processing
5. End with this exact check question: "A customer wants to prevent prompt injection attacks but still wants to see what was attempted. Which action(s) would you recommend and why?"
Keep it concise and SE-friendly.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 5,
    title: "AI Inventory & AI Usage",
    tier: "beginner",
    checkQuestion: "A CISO asks: how do I know if employees are using unauthorized AI tools like personal ChatGPT accounts? Which Atlas application answers this, and how?",
    followUpPrompts: [
      "How does Atlas discover AI usage through ZTNA integrations specifically?",
      "What's the difference between an unsanctioned AI service and Shadow AI in Atlas?",
      "What does Atlas do when it finds a new unsanctioned AI tool?",
    ],
    intro: `[LEARNING MODE - Lesson 5: AI Inventory and AI Usage]
You are teaching a Varonis Sales Engineer. Please:
1. Explain AI Inventory — what it tracks (LLM endpoints, models, libraries, AI resources) and why SEs should care
2. Explain AI Usage — how it discovers what AI services employees are using via ZTNA integrations
3. Explain the concept of sanctioned vs unsanctioned AI services
4. Explain how these two applications together give security teams visibility into Shadow AI
5. End with this exact check question: "A CISO asks: how do I know if employees are using unauthorized AI tools like personal ChatGPT accounts? Which Atlas application answers this, and how?"
Keep it concise and SE-friendly.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 6,
    title: "Guardrails & Built-in Rules",
    tier: "beginner",
    checkQuestion: "Which Atlas rule would you recommend first for a customer who is worried about employees accidentally leaking sensitive data through an AI chatbot?",
    followUpPrompts: [
      "Walk me through how the OWASP LLM Top 10 template maps to specific guardrail rules",
      "What are Agentic Guardrails specifically protecting against?",
      "How does PII detection work — does it use regex or semantic analysis?",
    ],
    intro: `[LEARNING MODE - Lesson 6: Guardrails and Built-in Rules]
You are teaching a Varonis Sales Engineer. This is the final beginner lesson. Please:
1. Explain what guardrails are in the context of Atlas
2. Cover the key built-in rule categories: prompt injection prevention, PII detection, jailbreak prevention, invisible text removal, topic detection
3. Mention the OWASP LLM Top 10 policy template as a quick-start option
4. Explain Agentic Guardrails (beta) — why they matter for AI workflow tools like n8n
5. Congratulate the SE on completing the beginner tier and tell them they are now ready for the Intermediate tier
6. End with this exact check question: "Which Atlas rule would you recommend first for a customer who is worried about employees accidentally leaking sensitive data through an AI chatbot?"
Keep it concise and SE-friendly.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 7,
    title: "AI Observability & Audit Trail",
    tier: "intermediate",
    checkQuestion: "A customer's legal team wants a complete audit trail of every prompt sent to their AI chatbot for the past 90 days. Which Atlas component provides this, and where is that data stored?",
    followUpPrompts: [
      "What exactly is stored in OpenSearch vs S3, and when does data move between them?",
      "Can a customer query their audit trail programmatically via the Atlas API?",
      "What log settings can be configured per-project?",
    ],
    intro: `[LEARNING MODE - Lesson 7: AI Observability and Audit Trail]
You are teaching a Varonis Sales Engineer who has completed the Beginner tier. Please:
1. Explain what the AI Observability layer is — it logs all LLM inputs, outputs, and guardrail actions that pass through the AI Gateway
2. Explain where that data lives: in the customer's own AWS data plane (OpenSearch instance), not on Varonis infrastructure
3. Explain what can be configured: per-project log settings, sensitivity levels, what gets logged vs. not
4. Explain default retention: 3 months in the index, 6 months in S3
5. Explain why this matters for compliance: regulators in financial services, healthcare, and legal require audit trails of AI interactions
6. End with this exact check question: "A customer's legal team wants a complete audit trail of every prompt sent to their AI chatbot for the past 90 days. Which Atlas component provides this, and where is that data stored?"
Keep it concise and SE-friendly. This is an intermediate lesson — go a level deeper than Beginner.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 8,
    title: "AI 360 Dashboard",
    checkQuestion: "A CISO asks for a single dashboard showing their organization's complete AI risk posture. What do you show them in Atlas, and what key risk categories does it surface?",
    tier: "intermediate",
    followUpPrompts: [
      "Walk me through what a CISO would actually see on first opening AI 360",
      "How does AI 360 prioritize which risks to surface first?",
      "Does AI 360 show trends over time or just current state?",
    ],
    intro: `[LEARNING MODE - Lesson 8: AI 360 Dashboard]
You are teaching a Varonis Sales Engineer who has completed the Beginner tier. Please:
1. Explain what AI 360 is — Atlas's unified risk dashboard that aggregates findings across all Atlas applications into a single risk view
2. Explain what it surfaces: AI risk posture metrics, findings from AI Inventory, AI Usage, AI Gateway, AI SPM, and AI Compliance
3. Explain how SEs should use it in customer conversations — it's the first screen to show a CISO who wants to see their overall AI security posture at a glance
4. Explain the concept of risk findings and how AI 360 prioritizes what needs attention
5. End with this exact check question: "A CISO asks for a single dashboard showing their organization's complete AI risk posture. What do you show them in Atlas, and what key risk categories does it surface?"
Keep it concise and SE-friendly. This is an intermediate lesson.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 9,
    title: "AI Security Posture Management",
    checkQuestion: "A customer says they want to know if any of their AI Python libraries have known CVEs. Which Atlas application handles this, and how does it discover and report those vulnerabilities?",
    tier: "intermediate",
    followUpPrompts: [
      "How does the LLM pen testing work — what attack types does it test for?",
      "What happens when AI SPM finds a CVE — what's the remediation flow?",
      "What cloud permissions does Atlas need to discover AI resources?",
    ],
    intro: `[LEARNING MODE - Lesson 9: AI Security Posture Management (AI SPM)]
You are teaching a Varonis Sales Engineer who has completed the Beginner tier. Please:
1. Explain what AI SPM is — it scans AI resources for security vulnerabilities, misconfigurations, and weaknesses
2. Cover the three main scan categories: library vulnerability scanning (CVEs in AI packages like LangChain, PyTorch), cloud misconfiguration detection (S3 buckets, IAM roles, exposed model endpoints), and model vulnerability scanning
3. Explain LLM penetration testing — Atlas can run automated adversarial tests against LLM endpoints to find prompt injection and jailbreak vulnerabilities before attackers do
4. Explain how SPM findings surface as Issues in Atlas with severity ratings
5. End with this exact check question: "A customer says they want to know if any of their AI Python libraries have known CVEs. Which Atlas application handles this, and how does it discover and report those vulnerabilities?"
Keep it concise and SE-friendly. This is an intermediate lesson.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 10,
    title: "AI Incidents & Issues",
    tier: "intermediate",
    checkQuestion: "After deploying Atlas, a security analyst sees a new 'Shadow AI' issue in the dashboard. What does that mean, and what are the two most likely causes?",
    followUpPrompts: [
      "Walk me through the full lifecycle of an issue from detection to remediation",
      "How does the Splunk integration work — what format does Atlas send issues in?",
      "What's the difference between an Incident and an Issue in Atlas?",
    ],
    intro: `[LEARNING MODE - Lesson 10: AI Incidents and Issues]
You are teaching a Varonis Sales Engineer who has completed the Beginner tier. Please:
1. Explain how Issues are generated in Atlas — they are created automatically by guardrail policy violations, AI Inventory discoveries (Shadow AI, Unprotected AI), AI SPM scan findings, and AI Usage monitoring
2. Explain the key issue types: Shadow AI (unreviewed or unsanctioned resources), Unprotected AI (resources missing available protections like no Gateway attached), and policy violation issues (from guardrail rules triggering)
3. Explain how the security team triages and remediates issues — severity ratings, assignment, status tracking
4. Explain SIEM integrations: Issues can be forwarded to Splunk or ServiceNow for teams that work from existing security workflows
5. End with this exact check question: "After deploying Atlas, a security analyst sees a new 'Shadow AI' issue in the dashboard. What does that mean, and what are the two most likely causes?"
Keep it concise and SE-friendly. This is an intermediate lesson.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 11,
    title: "Compliance & TPRM",
    checkQuestion: "A financial services customer says they need to demonstrate AI governance controls for their upcoming SOC 2 audit. Which Atlas applications and features would you highlight, and what evidence can Atlas provide?",
    tier: "intermediate",
    followUpPrompts: [
      "How does Atlas map its controls to the EU AI Act specifically?",
      "What does a TPRM assessment for a third-party AI vendor actually look like?",
      "Can Atlas generate a compliance report I can hand to an auditor?",
    ],
    intro: `[LEARNING MODE - Lesson 11: Compliance and Third-Party Risk Management]
You are teaching a Varonis Sales Engineer who has completed the Beginner tier. Please:
1. Explain the AI Compliance application — it maps Atlas controls and findings to regulatory frameworks and compliance requirements (OWASP LLM Top 10, NIST AI RMF, and others)
2. Explain TPRM (Third Party Risk Management) — Atlas helps organizations assess the AI risk posture of their third-party AI vendors and tools
3. Explain why compliance matters for Atlas positioning: regulated industries (financial services, healthcare, legal) have specific obligations around AI governance, audit trails, and data handling that Atlas directly addresses
4. Explain how the OWASP LLM Top 10 policy template in the AI Gateway maps to specific compliance requirements
5. End with this exact check question: "A financial services customer says they need to demonstrate AI governance controls for their upcoming SOC 2 audit. Which Atlas applications and features would you highlight, and what evidence can Atlas provide?"
Keep it concise and SE-friendly. This is an intermediate lesson.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 12,
    title: "Putting It All Together",
    tier: "intermediate",
    checkQuestion: "Walk me through how you would open an Atlas conversation with a financial services CISO who tells you their developers are using AI coding assistants but the security team has no visibility into what data is being shared.",
    followUpPrompts: [
      "What's the typical time from first meeting to having Atlas in WARN mode on a production system?",
      "What does the 'before picture' from AI Usage typically reveal in a customer environment?",
      "How do you handle a customer who wants to start with BLOCK mode right away?",
    ],
    intro: `[LEARNING MODE - Lesson 12: Putting It All Together]
You are teaching a Varonis Sales Engineer. This is the final intermediate lesson — a synthesis lesson that ties everything together. Please:
1. Walk through a complete end-to-end Atlas deployment scenario for a mid-size financial services company worried about AI data leakage. Cover: Discovery (AI Inventory + AI Usage), Protection (AI Gateway + Guardrails), Monitoring (AI Observability + AI 360), Risk Management (AI SPM + AI Incidents), and Compliance (AI Compliance)
2. Show how each Atlas application plays a role in the story — no component is standalone
3. Explain the typical SE engagement approach: start with AI Usage to show the CISO what's happening today (the problem), then show AI Gateway to demonstrate how Atlas solves it, then show AI 360 and AI Compliance for ongoing governance
4. Congratulate the SE on completing the Intermediate tier
5. End with this exact check question: "Walk me through how you would open an Atlas conversation with a financial services CISO who tells you their developers are using AI coding assistants but the security team has no visibility into what data is being shared."
Keep it concise and SE-friendly. This is the capstone lesson — connect all the dots.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 13,
    title: "Prompt Data Privacy & Encryption",
    tier: "advanced",
    checkQuestion: "A CISO asks: if a guardrail fires and blocks a prompt containing employee PII, does Varonis have access to that PII? Walk me through exactly where that data goes and who can see it.",
    followUpPrompts: [
      "What exactly does BYOK mean operationally — who holds the key and how is it used?",
      "If a customer disables prompt logging for an endpoint, what visibility do they lose?",
      "How do I explain the Prompt Reader role to a CISO worried about insider threats?",
    ],
    intro: `[LEARNING MODE - Lesson 13: Prompt Data Privacy and Encryption]
You are teaching an experienced Varonis Sales Engineer who has completed the Beginner and Intermediate tiers. This is an advanced lesson covering how Atlas handles sensitive prompt data — a top enterprise objection. Please:
1. Explain the two distinct storage locations for prompt data: (a) runtime prompts logged by the AI Gateway live in the customer's own AWS Data Plane (OpenSearch instance) — Varonis never sees this data; (b) prompts that appear in policy violation alerts/issues are stored in the Control Plane
2. Explain the encryption controls for Control Plane prompt storage: AES-256 encryption at rest, with two key management options — customer-managed BYOK or platform-managed keys via AWS KMS
3. Explain the Prompt Reader RBAC role — even within the same Atlas tenant, only users explicitly assigned this role can view stored prompt content in alerts/issues
4. Explain the upcoming endpoint-level logging controls (April 2026) — customers will be able to disable prompt logging entirely for specific high-sensitivity endpoints
5. Explain the Q2 2026 architectural shift for Azure Data Plane support — prompt logging will move to the Control Plane, using the same AES-256/BYOK/Prompt Reader controls already in place today
6. End with this exact check question: "A CISO asks: if a guardrail fires and blocks a prompt containing employee PII, does Varonis have access to that PII? Walk me through exactly where that data goes and who can see it."
This is an advanced lesson — be precise about the architecture. The SE needs to handle this objection confidently with enterprise security teams.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 14,
    title: "Competitive Positioning",
    tier: "advanced",
    checkQuestion: "A prospect says they already have Wiz and feel their AI security needs are covered. How do you respond?",
    followUpPrompts: [
      "How do you handle a prospect who is deep into a Wiz evaluation?",
      "What's the best response when a prospect says Microsoft Purview already covers this?",
      "How do you explain the Varonis data context advantage over pure-play AI security tools?",
    ],
    intro: `[LEARNING MODE - Lesson 14: Competitive Positioning]
You are teaching an experienced Varonis Sales Engineer. This is an advanced lesson on positioning Atlas against the competitive landscape. Please:
1. Explain the three competitive categories Atlas faces: (a) AI TRiSM platforms (Portal26, CalypsoAI — similar scope but less integrated), (b) AI SPM point tools (Wiz AI-SPM, CrowdStrike, Orca — cloud-focused, missing runtime protection and compliance), (c) Big vendor bundles (Cisco/Robust Intelligence, Microsoft Agent365, Palo Alto/ProtectAI — broad but not purpose-built for AI security)
2. Explain the Wiz objection specifically — Wiz's AI-SPM is a small feature addition to a CSPM product. Atlas does what Wiz does on AI discovery PLUS codebase scanning, runtime protection, automated compliance, and TPRM. Different scope entirely.
3. Explain the IBM relationship context — AllTrue had an OEM agreement with IBM. Varonis honors the existing agreement, but IBM has wound down sales efforts in this area. WatsonX integration is supported.
4. Explain Atlas's core differentiator: no other platform combines full AI lifecycle security (inventory → runtime protection → posture management → compliance → TPRM) with the data visibility depth that comes from the Varonis portfolio
5. End with this exact check question: "A prospect says they already have Wiz and feel their AI security needs are covered. How do you respond?"
This is an advanced lesson — the SE should be able to handle a competitive objection live in a customer call.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 15,
    title: "Deployment Deep Dive & CI/CD",
    tier: "advanced",
    checkQuestion: "A DevOps team asks: can Atlas automatically test our LLM endpoints every time we push a code change, without requiring a manual security review? How does that work?",
    followUpPrompts: [
      "Walk me through the Docker NGINX deployment step by step",
      "What does the GitHub Actions security gate actually output on a PR?",
      "How long does a typical POC take from kickoff to first real findings?",
    ],
    intro: `[LEARNING MODE - Lesson 15: Deployment Deep Dive and CI/CD Integration]
You are teaching an experienced Varonis Sales Engineer. This is an advanced lesson covering technical deployment scenarios that come up with architect-level buyers. Please:
1. Explain the recommended Atlas deployment sequence: start with AI Usage (establishes the "before" picture for CISOs), deploy AI Gateway in WARN/LOG mode first to baseline traffic without disruption, escalate to BLOCK after reviewing issues, then enable AI Inventory and AI SPM, and add Compliance and TPRM last
2. Explain the three AI Gateway deployment options in detail: (a) NGINX reverse proxy via Docker — most common, requires URL swap in app config; (b) Python SDK — for apps that cannot use a proxy, integrates directly into application code; (c) Existing API gateway plugin — for customers already running Kong or Apigee
3. Explain CI/CD integration: Atlas provides a GitHub Action and an Azure DevOps Task Extension that trigger LLM Endpoint Pentesting and Model Scanning automatically on each pull request or build — security gating built into the development pipeline
4. Explain multiple data plane support: enterprises with global operations can deploy multiple data planes in different AWS regions to keep AI traffic and observability data local to where users and data reside
5. Explain POC logistics: 24-48 hour tenant provisioning, Varonis builds the lab environment, customers supply the infrastructure they want to test, aim to connect to a production system within 2 weeks
6. End with this exact check question: "A DevOps team asks: can Atlas automatically test our LLM endpoints every time we push a code change, without requiring a manual security review? How does that work?"
This is an advanced lesson — the SE needs to handle architect and DevOps-level questions.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 16,
    title: "Objection Handling Masterclass",
    checkQuestion: "A security-conscious CTO asks: 'We run our AI workloads in Azure, not AWS — can Atlas even work for us?' How do you answer this, and what roadmap context is relevant?",
    tier: "advanced",
    followUpPrompts: [
      "How do you respond if a prospect says they're waiting for their AI strategy to mature?",
      "What's the best way to handle pricing pushback before you've sized the deployment?",
      "How do you get a technical champion when your initial contact is in procurement?",
    ],
    intro: `[LEARNING MODE - Lesson 16: Objection Handling Masterclass]
You are teaching an experienced Varonis Sales Engineer. This is an advanced lesson on handling the toughest customer objections — the ones that come up in late-stage deals and executive conversations. Please cover each of these objections with the recommended response:
1. "We're not ready for AI security yet — our AI usage is minimal." Response: AI usage is almost never minimal — it's usually unknown. Start with AI Usage to show what's actually happening. The inventory always surprises security teams.
2. "We already have a CSPM tool that covers AI." Response: CSPM tools have bolt-on AI features. Atlas is purpose-built — it scans codebases (not just cloud), provides runtime protection, automates compliance, and manages third-party AI risk. Different scope.
3. "Can Varonis see our data?" Response: No. The Data Plane — where all AI traffic flows — is deployed in the customer's own AWS VPC. Varonis manages the infrastructure but has no access to the data. Prompts in policy violation alerts are encrypted AES-256 with optional BYOK and gated by the Prompt Reader RBAC role.
4. "How does pricing work?" Response: Tiered model — number of AI systems for the posture/inventory/pen-testing tier, number of prompts for the runtime protection tier. POC first to size accurately.
5. "Who is the right Atlas customer?" Response: Organizations with active or budgeted AI initiatives, an executive sponsor (CISO or equivalent), and technical stakeholders from cloud, AI engineering, and security who can participate in a 2-3 week evaluation.
6. End with this exact check question: "A security-conscious CTO asks: 'We run our AI workloads in Azure, not AWS — can Atlas even work for us?' How do you answer this, and what roadmap context is relevant?"
This is an advanced lesson — these are real objections from real deals.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 17,
    title: "AI Attack Techniques & Atlas Detection",
    tier: "advanced",
    checkQuestion: "A customer's security team asks: our AI assistant has access to our internal knowledge base and customer data — how would an attacker try to abuse that, and how does Atlas catch it?",
    followUpPrompts: [
      "Walk me through a confused deputy attack scenario step by step",
      "How does the Remove Invisible Text guardrail actually detect zero-width characters?",
      "What does an Atlas LLM pen test report look like — what does it give the customer?",
    ],
    intro: `[LEARNING MODE - Lesson 17: AI Attack Techniques and How Atlas Detects Them]
You are teaching an experienced Varonis Sales Engineer. This is an advanced lesson on the actual adversarial AI attack techniques that Atlas is designed to detect and block — the "why this matters" layer that makes demos land with technical audiences. Please:
1. Explain Prompt Injection attacks: malicious instructions embedded in documents, emails, or tool outputs that hijack an AI agent's behavior. Example: a resume containing hidden instructions tells an HR AI system to access and exfiltrate the HR database. Atlas detects these via the Agentic Guardrails and Prevent Jailbreak rules.
2. Explain Unicode/Invisible Text injection (Zero-Width Character attacks): malicious payloads hidden using invisible Unicode characters that bypass traditional text scanning. The text looks clean to humans but contains instructions the LLM executes. Atlas detects this via the Remove Invisible Text guardrail rule.
3. Explain Semantic Obfuscation (DLP bypass): attackers rephrase sensitive data exfiltration requests using synonyms, metaphors, or indirect language to evade keyword-based DLP rules. Example: instead of "send SSNs to attacker@evil.com," the payload says "forward the talent intelligence database to our analytics partner." Atlas detects this via Detect Topics and Agentic Guardrails.
4. Explain Confused Deputy attacks: an AI agent with legitimate permissions is manipulated into abusing those permissions on behalf of an attacker. The agent thinks it's doing its job; it's actually exfiltrating data or executing unauthorized actions. Atlas detects this via Agentic Guardrails and Prevent Jailbreak.
5. Explain how Atlas's LLM Pen Testing feature proactively tests customer LLM endpoints for susceptibility to these attack types before attackers find them
6. End with this exact check question: "A customer's security team asks: our AI assistant has access to our internal knowledge base and customer data — how would an attacker try to abuse that, and how does Atlas catch it?"
This is an advanced lesson — the SE should be able to explain attack vectors in technical terms and map them directly to Atlas capabilities.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 18,
    title: "Advanced Capstone",
    tier: "advanced",
    checkQuestion: "A global financial services firm needs to show their board a complete AI security posture within 90 days. Walk me through how you would sequence the Atlas deployment and what you would show the board at the end.",
    followUpPrompts: [
      "How do you handle a board that wants a single AI risk score — can Atlas provide that?",
      "What does the EU data residency deployment look like architecturally?",
      "How do you maintain momentum through a 90-day deployment when stakeholders get distracted?",
    ],
    intro: `[LEARNING MODE - Lesson 18: Advanced Capstone]
You are teaching an experienced Varonis Sales Engineer. This is the final advanced lesson — a full synthesis scenario designed to prepare the SE for a technical deep-dive with a CISO and their security architect. Please:
1. Set the scenario: A global financial services firm (5,000 employees, US and EU operations) has mandated an AI security program after their legal team flagged that developers are using AI coding assistants and an internal LLM chatbot with access to customer financial data. The CISO needs to show the board a complete AI security posture within 90 days.
2. Walk through the complete Atlas engagement: (a) Week 1-2: Deploy AI Usage and connect Cloudflare ZTNA — discover what AI services are actually in use; (b) Week 2-3: Enable AI Inventory scanning across AWS and Azure cloud accounts and GitHub repos; (c) Week 3-4: Deploy AI Gateway in WARN/LOG mode on the internal chatbot — baseline traffic without disruption; (d) Month 2: Review Issues, escalate high-confidence attack vectors to BLOCK, run LLM pen tests; (e) Month 3: Activate AI Compliance for EU AI Act and NIST AI RMF mapping, onboard TPRM for third-party AI vendors
3. Address the EU data residency question: explain the EU Central (Frankfurt) deployment region and the data plane architecture that keeps EU customer data in-region
4. Address the board reporting question: AI 360 dashboard provides the executive risk posture view; AI Compliance provides the regulatory mapping evidence
5. Congratulate the SE on completing all three tiers of the Atlas learning program
6. End with this exact check question: "You're in a final technical review with the CISO and their security architect. The architect asks: 'When a guardrail fires and blocks a prompt, does that blocked prompt get sent to Varonis? And who in our organization can see the content of blocked prompts?' Give your complete answer."
This is the capstone — the SE should be able to handle a board-level conversation and a deep technical objection in the same meeting.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 19,
    title: "AI Investigation",
    checkQuestion: "A customer's legal team asks you to demonstrate that Atlas actually monitored and logged their AI chatbot's activity over the past 30 days. What do you show them, and where in Atlas does that evidence live?",
    tier: "beginner",
    followUpPrompts: [
      "What's the difference between the Events page and the Sessions page — when do you use each?",
      "How does AI Investigation help you prove to an auditor that guardrails are actually working?",
      "What alert thresholds would you recommend setting first for a new Atlas customer?",
    ],
    intro: `[LEARNING MODE - Lesson 19: AI Investigation]
You are teaching a Varonis Sales Engineer. This is a beginner lesson on AI Investigation — one of Atlas's newest applications and a powerful demonstration tool for SEs. Please:
1. Explain what AI Investigation is: the central hub for runtime visibility and evidence. It answers the question "what actually happened?" after guardrails fire or after unusual AI behavior is detected. It turns runtime protection from a black box into something security teams can review, prove, and act on.
2. Walk through the five main areas of AI Investigation: (a) Dashboard — trend charts for quality metrics (jailbreak attempts, PII detections, etc.) and performance metrics (latency, token usage); configure alerts that fire when something exceeds a threshold; (b) Issues — alert-driven triage queue; repeated alerts on the same condition group into a single issue with full history; (c) Events — chronological list of every individual runtime request; inspect the full prompt, response, policy tags, and actions taken; (d) Sessions — full conversation reconstruction when the client sends a user_session_id; see the entire multi-turn interaction, tool calls, and where guardrails intervened; (e) Reports — export issue history for auditors and compliance evidence
3. Explain the investigation workflow: start at the Dashboard to spot a trend change, jump to Issues to see what fired, drill into Events for the specific request, open Sessions when you need full conversation context
4. Explain why this matters in an SE demo context: AI Investigation lets you show a CISO "here is a jailbreak attempt that was blocked last Tuesday at 2:14pm — here is the exact prompt, here is what the guardrail did" — not just "guardrails are configured"
5. End with this exact check question: "A customer's legal team asks you to demonstrate that Atlas actually monitored and logged their AI chatbot's activity over the past 30 days. What do you show them, and where in Atlas does that evidence live?"
Keep it practical and SE-focused. This is a beginner lesson — no deep technical architecture required.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 20,
    title: "MCP Security",
    checkQuestion: "A customer says their AI engineering team just connected three external MCP servers to their internal agent. The security team has zero visibility into what tools those servers expose and no way to prevent tool drift. Walk me through what Atlas does about this, step by step.",
    tier: "intermediate",
    followUpPrompts: [
      "What's the difference between a Virtual MCP and MCP Quarantine — don't they do the same thing?",
      "How does Atlas detect Shadow MCPs — what's the discovery mechanism?",
      "Walk me through a scenario where a tool drifts overnight and what Atlas does about it",
    ],
    intro: `[LEARNING MODE - Lesson 20: MCP Security]
You are teaching a Varonis Sales Engineer. This is an intermediate lesson on MCP Security — one of the hottest topics in enterprise AI security and a significant Atlas differentiator. Please:
1. Explain what MCP (Model Context Protocol) is and why it changes the security model: MCP allows AI agents to dynamically discover and invoke tools at runtime. A single external MCP URL can expose dozens of tools via a single list_tools call — and that tool set can change over time without the security team knowing. This is the fundamental problem.
2. Explain the three core risks Atlas's MCP Security addresses: (a) Shadow MCPs — MCP servers discovered in code or in use, but with no governance visibility into what tools they expose; (b) Tool Drift — an approved MCP server silently adds a new tool overnight (supply chain risk); (c) Unapproved Tool Exposure — agents receive tools they were never authorized to use
3. Explain the Atlas MCP governance model with its four key components: (a) MCP Catalog — centralized inventory of all MCP servers and their tools, with ownership, risk, and review status; (b) Virtual MCPs (VMCPs) — curated allowlists of approved tools for specific workflows; define exactly which tools an agent is allowed to use; (c) MCP Quarantine — runtime enforcement that strips tools not on the VMCP allowlist before the model even sees them; (d) MCP Activity — operational monitoring showing which tools are being called, which endpoints are most active, and which tools are being quarantined
4. Walk through the recommended MCP governance workflow: Discover (code scanning surfaces Shadow MCPs) → Inspect (MCP Inspector connects to the server and retrieves its tool list) → Review (approve or reject tools in the Catalog) → Create VMCP (select only the tools needed for each workflow) → Enable MCP Quarantine (enforce the allowlist at runtime) → Monitor Issues (drift, unapproved usage, failed inspections)
5. Explain the SE angle: organizations deploying agentic AI are connecting MCP servers without any visibility into what those servers expose or whether tool sets have changed. This is a direct conversation opener with any customer using n8n, LangChain, or similar agentic frameworks.
6. End with this exact check question: "A customer says their AI engineering team just connected three external MCP servers to their internal agent. The security team has zero visibility into what tools those servers expose and no way to prevent tool drift. Walk me through what Atlas does about this, step by step."
This is an intermediate lesson — be precise about the MCP governance components. The SE needs to handle technical questions from AI engineering teams.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 21,
    title: "Integration Patterns",
    checkQuestion: "A DevOps team says they already use LiteLLM Proxy as their AI gateway and cannot change their application code or infrastructure. Can Atlas still protect their LLM endpoints? How does the integration work and what does it actually enforce?",
    tier: "intermediate",
    followUpPrompts: [
      "How does the LiteLLM integration handle fail-open vs fail-closed when Atlas is unreachable?",
      "What's different about the Copilot Studio integration vs a standard NGINX proxy deployment?",
      "Which integration pattern would you recommend for a customer who can't change their application code at all?",
    ],
    intro: `[LEARNING MODE - Lesson 21: Integration Patterns]
You are teaching a Varonis Sales Engineer. This is an intermediate lesson on how Atlas integrates with customer environments — the most common technical question in discovery calls. Please:
1. Explain the three AI Gateway deployment options in practical terms: (a) NGINX reverse proxy via Docker — the most common deployment; the customer swaps their LLM endpoint URL (e.g., api.openai.com) to the Atlas gateway URL; all traffic flows through Atlas with zero application code changes; (b) Python SDK — for applications that cannot use a proxy; Atlas guardrails integrate directly into the application code; (c) Existing API gateway plugin — for customers already running Kong, Apigee, or similar; Atlas provides a plugin so guardrails layer onto the existing infrastructure
2. Explain the LiteLLM Proxy integration: if a customer already uses LiteLLM as their AI gateway, Atlas integrates via LiteLLM's Generic Guardrail API — a single config block in the LiteLLM config.yaml enables pre-call and post-call guardrail evaluation with no application code changes. Key configuration concepts: guardrail modes (pre_call blocks/modifies prompts before the LLM call; post_call evaluates responses; logging_only audits without blocking); fail_closed vs fail_open fallback when Atlas is unreachable
3. Explain the Microsoft Copilot Studio integration: Atlas uses Microsoft's external threat detection webhook to evaluate every tool invocation before it executes. Atlas also discovers Copilot Studio agents, their tools, connectors, and authentication configurations via AI Inventory — giving teams visibility into Copilot Studio's AI footprint alongside everything else in the environment. Note: this integration blocks tool invocations but does not support content modification (unlike NGINX/LiteLLM which support MODIFY actions)
4. Explain CI/CD integration: Atlas provides a GitHub Action and Azure DevOps Task Extension that run automated LLM endpoint pentesting on every pull request — making security validation part of the development pipeline rather than a separate manual review
5. Explain the SE discovery angle: "How does Atlas fit into our existing stack?" is the #1 technical question. Knowing these four integration patterns lets you answer confidently for any customer architecture — whether they use LiteLLM, Copilot Studio, a custom proxy, or no proxy at all.
6. End with this exact check question: "A DevOps team says they already use LiteLLM Proxy as their AI gateway and cannot change their application code or infrastructure. Can Atlas still protect their LLM endpoints? How does the integration work and what does it actually enforce?"
This is an intermediate lesson — the SE needs to handle integration architecture questions with technical buyers.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 22,
    title: "Agentic AI Security",
    checkQuestion: "A customer's AI agent has access to their internal file system, corporate email, and CRM database. Their security architect asks: what are the three main ways an attacker would try to abuse that agent, and which specific Atlas guardrails catch each one?",
    tier: "advanced",
    followUpPrompts: [
      "Walk me through a real confused deputy attack step by step against an agent with email access",
      "How is Agent Reflection Evaluation different from the other agentic guardrail rules?",
      "Which agentic guardrail rules would you turn on first for a customer deploying n8n workflows?",
    ],
    intro: `[LEARNING MODE - Lesson 22: Agentic AI Security]
You are teaching an experienced Varonis Sales Engineer. This is an advanced lesson on agentic AI security — the fastest-growing attack surface in enterprise AI and a topic that Atlas addresses more deeply than any competitor. Please:
1. Explain why agentic AI is fundamentally different from a security perspective: AI agents take real-world actions — they read files, query databases, call APIs, send emails, execute code. Unlike a chatbot that only generates text, an agent with legitimate permissions can cause actual damage if manipulated. The security model must assume an attacker will try to control the agent's actions, not just its outputs.
2. Explain the three primary attack vectors against agentic systems in detail: (a) Prompt Injection — malicious instructions embedded in documents, emails, tool outputs, or knowledge base content that hijack the agent's behavior; example: a resume uploaded by an applicant contains hidden instructions telling an HR AI agent to exfiltrate the HR database; (b) Confused Deputy — an agent is tricked into misusing its own legitimate permissions on behalf of an attacker; the agent thinks it's doing its job; it's actually exfiltrating data or executing unauthorized transactions; (c) Excessive Autonomy — the agent takes actions beyond its intended scope without human approval checkpoints, either through manipulation or emergent behavior
3. Walk through Atlas's seven Agentic Guardrail rules and what each one does: (a) Agent Tool Selection — evaluates whether the model selected the appropriate tool for the task; catches agents choosing dangerous or inappropriate capabilities; (b) Agent Parameter Evaluation — validates that the parameters passed to a tool are appropriate and aligned with user intent; catches cases where correct tool, wrong payload; (c) Malicious Tool Calls — detects and blocks harmful or unauthorized tool invocations; the safety gate against agents attempting destructive actions; (d) Inappropriate Agentic Behavior — detects agents acting outside their authorized scope, defying instructions, or engaging in harmful conduct; (e) Agent Tool Quarantine — immediately restricts access to specific unapproved tools without disrupting the entire agent workflow; (f) Agent Planning Evaluation — analyzes a proposed multi-step plan for logic, resource risk, and unauthorized data access before the agent executes it; (g) Agent Reflection Evaluation — post-execution check that assesses whether the final outcome aligns with user intent and security policies; can trigger retries or escalate for human review
4. Explain MCP Quarantine as the enforcement layer that makes agentic guardrails actionable: even if guardrails detect a problem, MCP Quarantine prevents unapproved tools from being presented to the model in the first place — reducing the attack surface before evaluation even runs
5. End with this exact check question: "A customer's AI agent has access to their internal file system, corporate email, and CRM database. Their security architect asks: what are the three main ways an attacker would try to abuse that agent, and which specific Atlas guardrails catch each one?"
This is an advanced lesson — the SE must be able to explain attack vectors with precision and map them directly to Atlas capabilities in front of a security architect.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 24,
    title: "Coding Agent Protection",
    tier: "intermediate",
    checkQuestion: "A developer asks: 'I use Cursor in my IDE every day — how does Atlas actually intercept what my agent does, and what can it block vs. just log?' Walk me through the answer.",
    followUpPrompts: [
      "Which coding agents support blocking on prompt submission vs. only observing it?",
      "What is Intent-Based Access Control and how is it different from a standard allow/deny policy?",
      "How does Atlas handle a Cursor agent that calls an MCP server — which hook events fire?",
    ],
    intro: `[LEARNING MODE - Lesson 24: Coding Agent Protection]
You are teaching a Varonis Sales Engineer. This is an intermediate lesson on Atlas Coding Agent Protection — one of the most technically differentiated capabilities in v3.5.0, covering the nine supported agents and how Atlas enforces policy at the hook level. Please:
1. Explain the core problem: Coding agents (Cursor, Claude Code, Copilot, Codex, etc.) operate inside developer environments with access to source code, local files, terminals, credentials, repositories, and MCP servers. They combine natural-language instructions with the ability to act on them. Traditional endpoint controls were not built for this kind of activity — they miss which agents are in use, what they're accessing, whether actions match developer intent, and what happened during a session.
2. Explain the hook-based architecture: Atlas integrates with each coding agent through a hooks system. When the agent runs, it triggers a hook event at a key point in its workflow (for example, a user submits a prompt). The hook sends the event payload to Atlas's data plane. Atlas evaluates it against AI Runtime policies and returns allow, block, or modify — and the coding agent enforces the decision. All evaluation happens on the customer data plane; no unencrypted LLM data leaves the customer's account.
3. Walk through the six hook event types: (a) Prompt submission — evaluates user input before the agent processes it; (b) Pre-tool use — evaluates tool calls before execution (blocking possible on all agents); (c) Post-tool use — evaluates tool output after execution (varies by agent); (d) File read — evaluates file content before the agent reads it (Cursor and Devin Desktop only); (e) Agent response — observational, records agent output for audit; (f) Agent thought — monitors agent reasoning activity where available (Cursor only)
4. List the nine supported agents and key capability differences: Cursor (most complete — all 6 events, file read, agent thought, MCP output modification); Claude Code (5 events — prompt, pre/post-tool, agent response; full output modification); VS Code (3 events — prompt, pre/post-tool; no file read or agent response); GitHub Copilot (3 events — prompt observational only, pre-tool block+modify, post-tool modify-only); OpenAI Codex (5 events — prompt, pre/post-tool, agent response; post-tool block only); Kiro CLI (prompt+pre-tool only; pre-tool block not enforced on Windows); Devin CLI (prompt, pre/post-tool; post-tool observational); Devin Desktop (prompt, pre-tool, file read — no content modification); Google Antigravity (pre-tool only — block or pass-through, no content modification)
5. Explain Intent-Based Access Control (IBAC): Beyond simple allow/deny, IBAC evaluates whether a tool call aligns with the user's stated intent. An agent can take an action that is technically permitted but outside the scope of what the developer asked for — IBAC catches this divergence. Example: developer asks agent to "add unit tests to auth.ts" — agent then calls a shell tool to run git push to remote. The push permission is technically allowed, but pushing is outside the stated intent. IBAC flags or blocks it.
6. Summarize the four Atlas Coding Agent Protection capabilities: Runtime protection + IBAC (hook-based enforcement at point of action); Visibility (session reconstruction — who, which agent, which tools called, which policies fired); Artifact discovery and posture (scans repos for agent files, MCP configs, malicious skills — separate from the hook path); Threat detection (surfaces repeated or anomalous policy violations across sessions)
7. End with this exact check question: "A developer asks: 'I use Cursor in my IDE every day — how does Atlas actually intercept what my agent does, and what can it block vs. just log?' Walk me through the answer."
This is an intermediate lesson — the SE must be able to explain hook events and capability gaps per-agent in a technical discovery call.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 25,
    title: "Coding Agent Fleet Deployment",
    tier: "advanced",
    checkQuestion: "A CISO says: 'We have 400 developers using Claude Code on macOS. I cannot ask each developer to install an Atlas hook manually — what are our options, and what does the fail-open behavior mean for policy enforcement?' Give your complete answer.",
    followUpPrompts: [
      "Walk me through the Claude Code managed-settings deployment end to end — what files are distributed and where do they go?",
      "When would you recommend fail-closed over fail-open, and what's the trade-off for developer productivity?",
      "What authentication does the hook script use to talk to Atlas, and how do you rotate that key across 400 machines?",
    ],
    intro: `[LEARNING MODE - Lesson 25: Coding Agent Fleet Deployment]
You are teaching an experienced Varonis Sales Engineer. This is an advanced lesson on deploying Atlas Coding Agent Protection at scale — distributing hooks across an entire developer fleet without per-machine setup. This is the deployment architecture conversation that shows up in every enterprise deal. Please:
1. Explain the deployment challenge: A single-developer installation is straightforward, but enterprises have hundreds or thousands of developers. Requiring each developer to manually install hook scripts and configure API keys is impractical and creates inconsistency. Atlas addresses this with organization-level distribution mechanisms.
2. Explain the three hook configuration outputs Atlas generates (from the Configure Runtime drawer in AI Runtime > Policies): (a) Script-based hooks — a hook configuration file (e.g., hooks.json or ai-atlas.json) with a launch command, the hook script for the selected environment (ai-atlas-hook.sh for Bash/macOS/Linux, ai-atlas-hook.py for Python, ai-atlas-hook.ps1 for Windows PowerShell), and an ai-atlas.conf configuration file; (b) A settings block — a single configuration block (e.g., Claude Code managed-settings block) for paste into the agent's configuration file; (c) A plugin bundle — downloadable zip containing plugin files plus ai-atlas.conf (Claude Code)
3. Walk through fleet distribution options by agent: (a) Claude Code — managed settings block can be distributed org-wide through Claude Code's managed settings system; no developer action required — the hook configuration is pushed centrally; (b) VS Code — deploy via VS Code's extension management (MDM, Intune, Jamf) for organization-wide rollout; (c) Cursor — project-level hooks.json can be committed to the repo root, applying to every developer who clones; (d) All agents — the ai-atlas.conf file and hook scripts can be distributed via MDM (Jamf, Intune, SCCM) to developer machines; the AI_ATLAS_API_KEY and AI_ATLAS_API_URL values centrally managed
4. Explain hook authentication: The hook script authenticates to Atlas using a Firewall Proxy API key (created under Admin Console > Permissions > API Keys, key type: Firewall Proxy). The key is configured in ai-atlas.conf as AI_ATLAS_API_KEY. For managed deployments, this key is distributed alongside the hook config — developers never need to touch it. If no API key is found, the hook fails open and the agent continues without Atlas evaluation.
5. Explain fail-open vs. fail-closed behavior in depth: By default, hooks fail open — if a hook times out, fails, or cannot reach Atlas, agent activity is allowed to continue. This default is chosen to prevent disruption during initial deployment and Atlas connectivity issues. Organizations requiring stricter enforcement can configure fail-closed, where if Atlas is unreachable, the agent is blocked from proceeding. SE talking point: "Start with fail-open during rollout — build confidence in policy tuning — then tighten to fail-closed for high-risk developer environments." Kiro CLI has a known limitation on Windows 11 where pre-tool-use block may not be enforced regardless of setting.
6. Explain the ai-atlas.conf configuration reference: Key settings include AI_ATLAS_API_URL (pre-filled with Atlas webhook), AI_ATLAS_ENDPOINT_IDENTIFIER (pre-filled), AI_ATLAS_API_KEY (replace placeholder), AI_ATLAS_USER_EMAIL (override email attribution), AI_ATLAS_DEBUG (set true for verbose logging — log can contain sensitive content), AI_ATLAS_CA_FILE (for TLS-inspecting proxies). Environment variables always override ai-atlas.conf values.
7. End with this exact check question: "A CISO says: 'We have 400 developers using Claude Code on macOS. I cannot ask each developer to install an Atlas hook manually — what are our options, and what does the fail-open behavior mean for policy enforcement?' Give your complete answer."
This is an advanced lesson — the SE must explain fleet distribution options with confidence and handle the fail-open/closed trade-off in front of a security architect.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 26,
    title: "Log Sources & Multi-System Integration",
    tier: "intermediate",
    checkQuestion: "A customer uses Claude claude.ai Business across their organization, but they cannot route all Claude traffic through the Atlas gateway. Can Atlas still see and evaluate that Claude activity? How does it work, and what's the one important limitation?",
    followUpPrompts: [
      "What's the difference between the Anthropic Compliance API and the Atlas AI Gateway — when does a customer need both?",
      "Walk me through the exact API key type needed for the Anthropic Compliance API and why the wrong key type causes a 403",
      "A customer already uses Cloudflare for ZTNA — what does the Shadow AI integration with Cloudflare actually show them vs. what it cannot show?",
    ],
    intro: `[LEARNING MODE - Lesson 26: Log Sources & Multi-System Integration]
You are teaching a Varonis Sales Engineer. This is an intermediate lesson on Atlas Log Sources — the integrations that give Atlas visibility into AI activity that doesn't flow through the Atlas Gateway. This is a critical objection handler: "we can't route everything through your proxy." Please:
1. Explain the core distinction: Atlas Gateway (AI Runtime) is inline — it sits between applications and LLMs, can block or modify requests in real time. Log Sources are offline — Atlas polls or receives logs from external systems after the fact, evaluates them against policies, but cannot block what has already happened. Offline policy violations surface as ALERTs instead of blocks. Both are valuable but serve different roles in a layered AI security program.
2. Explain the Anthropic Compliance API integration in detail: This is a pull-based Log Source that ingests Claude usage history into Atlas for offline policy evaluation. Atlas polls Anthropic's Compliance API on a schedule, reconstructs returned chats into sessions, and evaluates them against configured policies — so Claude activity that happens outside the Atlas gateway (e.g., developers using claude.ai directly) still shows up in AI Investigation and can raise policy violations. Key setup details SEs need to know: (a) Requires an Anthropic Compliance Access Key — generated in claude.ai > Organization Settings > API, NOT in Atlas; only the Primary Owner of the Anthropic organization can create one; (b) The key type must be sk-ant-api01- (Compliance Access Key) — a standard API key (sk-ant-api03-) or Admin API key (sk-ant-admin01-) returns 403 and cannot read chats; (c) Scopes needed: read:compliance_org_data and read:compliance_user_data; (d) Offline limitation: policies evaluate every chat, but BLOCK or MODIFY actions fire as ALERTs instead — cannot stop a request that already happened; (e) Backfill capability: after initial setup, import historical activity over a date range
3. Explain the AWS Bedrock OTEL integration: Atlas ingests OpenTelemetry (OTEL) telemetry from AWS Bedrock API calls, correlating with Atlas's own policy telemetry to surface Bedrock model usage that doesn't route through the gateway. Key for customers running AI workloads on AWS who can't or won't proxy Bedrock traffic.
4. Explain Shadow AI through SASE (Cloudflare and Netskope): These integrations collect access events from the network layer — users accessing ChatGPT, Claude, Gemini, or other AI services through corporate network paths. (a) Cloudflare — push model: Cloudflare sends access events to Atlas; (b) Netskope — pull model: Atlas periodically retrieves events from Netskope. Important SE distinction: Shadow AI via SASE shows which AI services users are accessing, but does NOT show the prompt, response, uploaded files, or actions taken inside the AI service. It's access-level visibility — "this user accessed ChatGPT at 2pm from this device" — not content inspection. Content inspection requires gateway or direct application log integration.
5. Explain the Varonis Data Security Platform log sources: If the customer also has Varonis DSP, Atlas can ingest Copilot Events and ChatGPT Enterprise Events from the DSP, providing an additional visibility layer for those specific services.
6. End with this exact check question: "A customer uses Claude claude.ai Business across their organization, but they cannot route all Claude traffic through the Atlas gateway. Can Atlas still see and evaluate that Claude activity? How does it work, and what's the one important limitation?"
This is an intermediate lesson — the SE needs to confidently explain the gateway vs. log source distinction and handle the "can't use your proxy" objection with a concrete alternative.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 27,
    title: "Shadow AI & Intent Drift (IBAC)",
    tier: "advanced",
    checkQuestion: "A CISO asks: 'We use Netskope. Can Atlas tell me which AI services my employees are using without touching our network traffic?' Then they follow up: 'What is Intent-Based Access Control and how is it different from just blocking tool calls?' Give complete answers to both questions.",
    followUpPrompts: [
      "What's the difference between an Unauthorized AI Usage issue and a Shadow MCP finding — can you have both at once?",
      "Walk me through what Atlas's AI Service catalog is and how a customer adds a custom internal AI tool to it",
      "Give me an example of a tool call that would pass a standard allow/deny policy but get flagged by IBAC",
    ],
    intro: `[LEARNING MODE - Lesson 27: Shadow AI & Intent Drift (IBAC)]
You are teaching an experienced Varonis Sales Engineer. This is an advanced lesson covering two of Atlas v3.5.0's most differentiated capabilities: Shadow AI discovery through network integrations, and Intent-Based Access Control (IBAC) for coding agents. These are the capabilities that separate Atlas from point solutions. Please:
1. Explain Shadow AI discovery via SASE in depth: Atlas integrates with Cloudflare and Netskope to collect network access events. Atlas parses these events and compares URLs, domains, and request patterns against its AI Service catalog — a built-in list of known AI services (ChatGPT, Claude, Gemini, Perplexity, etc.) that Atlas can recognize automatically. Matching events are associated with known or custom AI Services and displayed in AI Usage, AI Investigation, and AI Inventory. If an AI Service is marked Unauthorized, Atlas creates or updates an Unauthorized AI Usage issue. Customers can also define custom AI Services for internal tools, niche AI products, or services not in the default catalog. (a) Cloudflare integration: push model — Cloudflare sends events to Atlas; near real-time visibility; (b) Netskope integration: pull model — Atlas periodically retrieves events; batch visibility with slight lag
2. Explain what Shadow AI via SASE can and cannot tell you: CAN tell you — which AI services employees are accessing, which users are accessing them, access frequency, device, IP, timestamp. CANNOT tell you — the prompt content, the response, files uploaded, actions taken inside the AI application. SE talking point: "Cloudflare/Netskope gives you the 'who and where' of Shadow AI. Atlas AI Gateway or Log Sources give you the 'what they said.' You often need both layers."
3. Explain artifact discovery and posture as a separate shadow AI signal: Atlas scans source code repositories for coding-agent artifacts — agent definition files, memory files, instruction files, and MCP server configurations. This surfaces Shadow MCP servers (external MCP URLs referenced in code that have never been inventoried) and malicious skills (agent instruction files containing suspicious or policy-violating directives). This discovery path is separate from the runtime hook path — it does not require hooks to be installed.
4. Explain Intent-Based Access Control (IBAC) in depth: IBAC is Atlas's most sophisticated enforcement layer for coding agents. Standard allow/deny policies ask "is this tool call permitted?" IBAC asks "does this tool call match what the user actually asked for?" It evaluates tool calls against the user's stated intent at the time of the session. Example scenario: a developer asks Claude Code to "add error handling to the login function." Claude Code then calls a shell tool to run git push origin main. Standard policies: push is an allowed action → passes. IBAC: the developer asked for error handling, not a git push → IBAC flags the action as outside stated intent and blocks or alerts. Why this matters: agents can technically stay within permitted tool lists while still doing things the user never intended. Intent drift — where an agent's actions gradually diverge from the user's original goal — is a subtle but real risk in long-running agentic sessions. IBAC is the only control layer that catches this class of behavior.
5. Explain the Quarantine and permanent-deny enforcement layer: When a user or attribute repeatedly violates policy (including IBAC violations), Atlas can apply a time-boxed quarantine — the user's access to coding agents is suspended for a configurable duration — or a permanent deny that does not expire, containing risky behavior while keeping coding agents available for other users.
6. End with this exact check question: "A CISO asks: 'We use Netskope. Can Atlas tell me which AI services my employees are using without touching our network traffic?' Then they follow up: 'What is Intent-Based Access Control and how is it different from just blocking tool calls?' Give complete answers to both questions."
This is an advanced lesson — the SE must articulate IBAC with precision and distinguish it from standard policy enforcement. This is a differentiator conversation.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 28,
    title: "Atlas MCP Server for Coding Agents",
    tier: "advanced",
    checkQuestion: "An AI engineering team lead says: 'We're already using Claude Code and Cursor — can those agents actually talk to Atlas and take security actions, or is it one-way?' Explain the bidirectional architecture and give two concrete examples of what a developer could ask their coding agent to do with Atlas.",
    followUpPrompts: [
      "What's the difference between the Atlas MCP Server and the MCP Security capabilities — don't confuse a customer asking about both",
      "Walk me through what happens when a developer asks their agent to quarantine a Copilot Studio tool — what Atlas APIs does that chain through?",
      "What's the security model for the Atlas MCP Server — what can a developer do vs. what requires approval?",
    ],
    intro: `[LEARNING MODE - Lesson 28: Atlas MCP Server for Coding Agents]
You are teaching an experienced Varonis Sales Engineer. This is an advanced lesson on the Atlas MCP Server for Coding Agents — the bidirectional architecture that lets coding agents query and operate the Atlas platform directly from the developer's IDE. This is one of Atlas's most compelling differentiators and a powerful demo story. Please:
1. Establish the bidirectional architecture concept clearly: Atlas governs coding agents (via runtime hooks — Lessons 24 and 25 in this course). AND coding agents can also query and operate Atlas (via the Atlas MCP Server). These are two different things that work in opposite directions. The SE must be able to distinguish them clearly to avoid confusing customers. One direction: Atlas watching the agent. Other direction: the agent querying Atlas.
2. Explain what the Atlas MCP Server is: Atlas provides an MCP server endpoint that any MCP-compatible coding agent (Claude Code, Cursor, OpenAI Codex CLI, etc.) can connect to. Once connected, the coding agent gains access to live Atlas data — every model, agent, policy, finding, and compliance gap in the tenant. The developer can ask questions in plain English from their IDE or terminal, and the agent queries Atlas, reasons across data sources, and returns synthesized answers. No dashboards to click through, no APIs to wrangle, no leaving the editor.
3. Walk through five concrete use cases with examples: (a) Risk briefing — "Connect to Atlas and give me a prioritized rundown of my most pressing AI security risks right now." The agent returns a cross-domain synthesis: posture score, open critical issues by category, recommended next action — all live tenant data from a single question. (b) Finding investigation — "Dig into that agent-tool-poisoning critical. What exactly is the tool doing, what asset is it on, and what's the blast radius?" The agent pulls the finding, the affected asset's configuration, surfaces the literal malicious payload, and recommends remediation. (c) Estate mapping — "Give me a map of our AI estate by risk category and which agents can reach sensitive data." The agent fuses discovery, shadow-AI detection, and sensitive-data reach across clouds and SaaS into one prioritized view. (d) Audit readiness — "Where do we stand on AI compliance frameworks and what's blocking certification?" The agent maps open gaps by framework and recommends which framework to target first given current posture. (e) Tool governance — "List our Virtual MCPs, show me the tool surface the GitHub one exposes, and flag anything unreviewed or high-impact." The agent lists VMCPs, retrieves tool inventories from the MCP Catalog, and highlights unreviewed tools.
4. Explain the safety model: Actions that read or report data are available by default. Actions that are destructive or modify Atlas configuration — quarantining a tool, updating a policy, closing an issue — require explicit human approval before the agent executes them. The pattern is: agent proposes the action, developer confirms, Atlas executes. This is intentional — Atlas does not allow agents to take security actions autonomously. The SE talking point: "Your coding agent becomes your AI security analyst — it can research, synthesize, and stage actions — but a human approves anything destructive."
5. Explain the setup: The Atlas MCP Server connection is a one-time configuration. The developer adds the Atlas MCP Server endpoint and an API key to their agent's MCP configuration file. Once connected, all the use cases above are available through natural language — no additional tooling.
6. Position the SE demo angle: This is a closing demo move. After showing how Atlas blocks a Cursor agent from accessing production secrets (hook-based enforcement), pivot to: "And from that same Cursor session, your developer can ask Atlas what happened, see the investigation timeline, and understand their full AI security posture — without ever leaving their editor." The bidirectional story makes Atlas feel native to the developer workflow, not bolted on.
7. End with this exact check question: "An AI engineering team lead says: 'We're already using Claude Code and Cursor — can those agents actually talk to Atlas and take security actions, or is it one-way?' Explain the bidirectional architecture and give two concrete examples of what a developer could ask their coding agent to do with Atlas."
This is an advanced lesson — the SE must explain the bidirectional architecture clearly and distinguish Atlas MCP Server from MCP Security in front of a technical audience.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
  {
    id: 23,
    title: "Atlas v3.6.0 — New Features",
    checkQuestion: "A CISO asks: 'We have Salesforce Agentforce in production and we're worried about what those agents are doing with sensitive data. And separately, we have a situation where a tool call triggered a guardrail but we're not sure whether to block it or approve it — we don't want to be too aggressive.' How does v3.6.0 answer both concerns?",
    tier: "advanced",
    followUpPrompts: [
      "Walk me through the Agent Manifest — what does it define, how does Atlas compare it against observed behavior, and what's the SE talking point for a customer who says 'we already document our agents'?",
      "Explain the Require Approval action — when would a customer use it instead of block or allow, and what does the reviewer actually see?",
      "A customer sends runtime logs to Splunk today. How does Runtime OpenTelemetry Export change the architecture, and what's the advantage of exporting directly from the data plane?",
    ],
    intro: `[LEARNING MODE - Lesson 23: Atlas v3.6.0 — New Features]
You are teaching an experienced Varonis Sales Engineer. This is an advanced lesson covering the major new capabilities introduced in Atlas v3.6.0 (released July 24, 2026) — the features customers and prospects will be asking about now. Please:
1. Frame why this release matters: v3.6.0's headline theme is governance maturity — moving Atlas from detect-and-block to detect-review-approve, and expanding agentic ecosystem coverage to Salesforce Agentforce, Copilot Studio connectors, and LlamaIndex. The release also introduces structured agent governance baselines via Agent Manifest and significantly deepens AI SPM coverage around sensitive data. SE framing: "v3.6.0 is about what happens after you've deployed Atlas — now you need governance workflows, not just guardrails."
2. Explain the Require Approval Action — the most important new runtime capability: When a runtime policy is triggered, instead of automatically blocking or allowing, Atlas can now hold the AI activity and require an authorized reviewer to approve or reject it. This is specifically designed for sensitive tool call interactions where an automated decision is too blunt. The reviewer sees full context — what was triggered, what the policy was, what the agent was doing — before deciding. SE talking point: "Customers were asking for a middle ground between 'block everything suspicious' and 'allow with a log.' Require Approval gives them a human checkpoint. It's especially valuable for agentic tool calls that touch sensitive systems or PII where you want a human in the loop before allowing or denying permanently." This is a new action type alongside block, allow, and alert.
3. Explain Agent Manifest — the governance baseline for agents: Agent Manifest provides a structured definition of an agent's approved purpose, expected behavior, permitted tools, capabilities, and ownership. Atlas compares observed agent activity against that manifest to detect drift. SE talking point: "This is how you answer the question 'is this agent doing what we think it's doing?' You define the contract upfront — what the agent is allowed to do, what tools it should use, who owns it — and Atlas tells you when it breaks that contract." Distinguish clearly from IBAC: IBAC enforces intent dynamically at runtime per tool call. Agent Manifest is a static governance declaration used to assess overall agent behavior over time. Both are complementary.
4. Explain the Salesforce and Copilot Studio expansions: (a) Salesforce Agentforce Prompt Log Ingestion — Agentforce prompt activity can now be ingested into Atlas. The resulting events and sessions appear in AI Investigation, providing visibility into how Agentforce agents are being used, supporting investigation, auditing, and usage analysis. SE talking point: "Salesforce Agentforce is one of the most widely deployed enterprise agentic platforms — this closes a major blind spot. You can now see what your Agentforce agents are actually doing in AI Investigation." (b) Copilot Studio Connector Credential Discovery — Atlas now discovers the credentials associated with Microsoft Copilot Studio connectors, giving visibility into the identities and authentication mechanisms that agents use to access connected services. SE talking point: "It's not enough to know a Copilot Studio agent exists — you need to know what credentials it's using to access your systems. This surfaces that."
5. Explain MCP enhancements — two distinct improvements: (a) Multiple Credentials for MCP Server Registration — the same MCP server can now support multiple authentication configurations and access contexts. Useful for multi-team or multi-tenant MCP deployments where different users or groups need different credentials to the same server. (b) Per-Token MCP Gateway Credentials — each Gateway Access Token can use separate credentials when connecting to MCP servers, enabling granular identity and access control at the token level. SE talking point: "As MCP deployments scale in production, a single credential per server doesn't work. These changes let customers build enterprise-grade MCP security with proper identity separation."
6. Explain Runtime Policy Consolidation — important UI change: Session policies and monitoring policies are now configured from the Runtime Policies page, alongside other runtime controls. This is now the single location for creating, reviewing, and managing all runtime policy types. SE impact: customers upgrading from v3.5.0 will find session and monitoring policies in a new location — always flag this when demoing or training to avoid confusion.
7. Explain the six new AI SPM Sensitive Data policies: These policies detect governance gaps specifically around sensitive data access — not just that sensitive data is exposed, but whether the right governance processes have been followed. Cover each: (a) Sensitive Access Uses Shared or Privileged Runtime Identity — access to sensitive data via a shared or privileged identity reduces accountability and increases blast radius. (b) Sensitive Data Has Weak Sharing Control Path — the path to sensitive data has insufficient access controls. (c) Sensitive Workflow Uses Rejected Tools — a sensitive data workflow includes a tool that was previously rejected during governance review. (d) Sensitive Write Access Lacks Approved Governance — write-capable access to sensitive data hasn't gone through the required governance and approval process. (e) Sensitive Access Lacks Approved Governance — even read access to sensitive data hasn't been reviewed. (f) Sensitive Access Review Expired — a previous governance review exists but is no longer current and must be renewed. SE talking point: "These policies operationalize your AI governance workflow. They don't just tell you sensitive data is exposed — they tell you whether someone actually reviewed and approved that access, and whether that review is still valid."
8. Cover the remaining features concisely: (a) Runtime OpenTelemetry Export — runtime logs now export directly from the Atlas data plane to a customer-configured OTel destination, without routing through the control plane. Benefits: lower latency, no control plane dependency, compatible with any OTel-capable SIEM or observability platform (Splunk, Datadog, etc.). (b) Prompt Sensitive Content Masking — sensitive content within prompts can be masked before it is stored or displayed, reducing exposure while retaining enough surrounding context for investigation and audit. (c) Configurable Prompt Data Retention — admins can now control how long prompt content is retained, aligning with organizational privacy, compliance, and investigation requirements. (d) AI Investigation enhancements: Issue Detail Drawers (review issue context and evidence without leaving the investigation page) and Runtime Issues Assess Tab (explains exactly why an issue was created — the trigger reasons and supporting evidence — making it easier to validate findings). (e) AI Investigation Alert and Session Quarantines — quarantine actions are now available directly from alert and session workflows. (f) LlamaIndex Artifact Discovery — LlamaIndex agents, tools, workflows, and components found in repository code scanning now appear in AI inventory, improving visibility into LlamaIndex-based agentic applications.
9. End with this exact check question: "A CISO asks: 'We have Salesforce Agentforce in production and we're worried about what those agents are doing with sensitive data. And separately, we have a situation where a tool call triggered a guardrail but we're not sure whether to block it or approve it — we don't want to be too aggressive.' How does v3.6.0 answer both concerns?"
This is an advanced lesson — the SE must be able to position v3.6.0 as a coherent story around governance maturity and agentic ecosystem expansion, not just a feature list.
IMPORTANT: Do not reference, describe, or suggest what comes in any future lesson. The SE will navigate using the sidebar.
If the SE answers with a topic list instead of a full sentence, say exactly: "It looks like you sent me a list of topics rather than an answer — but I can work with that!" then give feedback.`,
  },
];

// Intended display order — Beginner → Intermediate → Advanced, new lessons in natural position
const DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 19, 7, 8, 9, 10, 11, 12, 20, 21, 24, 26, 13, 14, 15, 16, 17, 22, 23, 25, 27, 28, 18];
const LESSON_NUM = Object.fromEntries(DISPLAY_ORDER.map((id, i) => [id, i + 1]));

export default function LearnPage() {
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Learning style & voice preferences
  const [learningStyle, setLearningStyle] = useState<LearningStyle | null>(null);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [voiceAutoplay, setVoiceAutoplay] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  // LLM Judge
  const [judgeEnabled, setJudgeEnabled] = useState(false);
  const [judging, setJudging] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [judgeResults, setJudgeResults] = useState<Record<number, JudgeResult>>({});
  const [judgePassed, setJudgePassed] = useState<Set<number>>(new Set());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Load preferences on mount — auto-resumes last lesson using fetched values directly
  useEffect(() => {
    fetch("/api/preferences")
      .then((r) => r.json())
      .then((prefs) => {
        const style = prefs.learningStyle as LearningStyle | null;
        if (style) {
          setLearningStyle(style);
          setVoiceEnabled(prefs.voiceEnabled ?? false);
          setVoiceAutoplay(prefs.voiceAutoplay ?? false);
        } else {
          setShowOnboarding(true);
        }
        setJudgeEnabled(prefs.judgeEnabled ?? false);
        if (prefs.completedLessons?.length) {
          setCompleted(new Set(prefs.completedLessons as number[]));
        }
        // Restore last active lesson from localStorage (fast, reliable, no round-trip)
        const savedLesson = parseInt(localStorage.getItem("atlas_active_lesson") ?? "", 10);
        if (savedLesson && style) {
          setActiveLesson(savedLesson);
          startLesson(savedLesson, style);
        }
        setPrefsLoaded(true);
      })
      .catch(() => setPrefsLoaded(true));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function savePrefs(style: LearningStyle, voice: boolean, autoplay: boolean, judge?: boolean) {
    await fetch("/api/preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        learningStyle: style,
        voiceEnabled: voice,
        voiceAutoplay: autoplay,
        judgeEnabled: judge ?? judgeEnabled,
      }),
    });
  }

  function speak(text: string, index: number) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const plain = stripMarkdown(text);
    const utt = new SpeechSynthesisUtterance(plain);
    utt.rate = 0.95;
    utt.onstart = () => setSpeakingIndex(index);
    utt.onend = () => setSpeakingIndex(null);
    utt.onerror = () => setSpeakingIndex(null);
    window.speechSynthesis.speak(utt);
  }

  function stopSpeaking() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeakingIndex(null);
  }

  async function sendToN8n(question: string, currentHistory: Message[]) {
    const sanitized = question
      .replace(/\n/g, ' ')
      .replace(/\r/g, '')
      .replace(/"/g, "'")
      .replace(/\[/g, '(')
      .replace(/\]/g, ')')
      .replace(/\\/g, '/');
    const res = await fetch(N8N_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: sanitized, history: currentHistory }),
    });
    return res.json();
  }

  async function startLesson(lessonId: number, styleOverride?: LearningStyle) {
    const lesson = LESSONS.find((l) => l.id === lessonId)!;
    setActiveLesson(lessonId);
    setMessages([]);
    setHistory([]);
    setLoading(true);
    stopSpeaking();

    // Persist active lesson to localStorage — instant, survives navigation
    localStorage.setItem("atlas_active_lesson", String(lessonId));

    const effectiveStyle = styleOverride ?? learningStyle;
    const stylePrefix = effectiveStyle ? STYLE_PREFIXES[effectiveStyle] : "";
    const prompt = stylePrefix ? `${stylePrefix}\n\n${lesson.intro}` : lesson.intro;

    try {
      const data = await sendToN8n(prompt, []);
      setMessages([{ role: "assistant", content: data.answer }]);
      setHistory(data.history);
    } catch {
      setMessages([{ role: "assistant", content: "Error loading lesson. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  // Auto-play voice for last assistant message when autoplay is on
  useEffect(() => {
    if (!voiceAutoplay || !voiceEnabled || messages.length === 0 || loading) return;
    const last = messages[messages.length - 1];
    if (last.role !== "assistant") return;
    speak(last.content, messages.length - 1);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages]);

  async function sendMessage() {
    const question = input.trim();
    if (!question || loading) return;

    const userMessage: Message = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const data = await sendToN8n(question, history);
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      setHistory(data.history);

      // LLM Judge — runs after response if enabled and lesson is active
      if (judgeEnabled && activeLesson) {
        const lesson = LESSONS.find((l) => l.id === activeLesson);
        if (lesson) {
          setJudging(true);
          try {
            const judgeRes = await fetch("/api/judge", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                lessonTitle: lesson.title,
                checkQuestion: lesson.checkQuestion,
                answer: question,
              }),
            });
            if (judgeRes.ok) {
              const result: JudgeResult = await judgeRes.json();
              const msgIndex = messages.length + 1; // index of the user message just sent
              setJudgeResults((prev) => ({ ...prev, [msgIndex]: result }));
              if (result.passed) {
                setJudgePassed((prev) => new Set(prev).add(activeLesson));
              }
            }
          } finally {
            setJudging(false);
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to Atlas. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function sendBubblePrompt(prompt: string) {
    if (loading) return;
    const userMessage: Message = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    try {
      const data = await sendToN8n(prompt, history);
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
      setHistory(data.history);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to Atlas. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const currentLesson = LESSONS.find((l) => l.id === activeLesson);

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">

      {/* Onboarding modal */}
      {prefsLoaded && showOnboarding && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 max-w-lg w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🎓</div>
              <h2 className="text-xl font-semibold text-white">How do you learn best?</h2>
              <p className="text-sm text-gray-400 mt-1">Atlas will tailor responses to your style.</p>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {(["visual", "reading", "voice"] as LearningStyle[]).map((style) => {
                const meta = {
                  visual: { icon: "📊", label: "Visual", desc: "Tables, headers & structured lists" },
                  reading: { icon: "📖", label: "Reading", desc: "Rich prose and narrative explanations" },
                  voice: { icon: "🔊", label: "Voice", desc: "Plain speech, easy to listen to" },
                }[style];
                return (
                  <button
                    key={style}
                    onClick={() => setLearningStyle(style)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all text-center ${
                      learningStyle === style
                        ? "border-blue-500 bg-blue-950 text-white"
                        : "border-gray-700 hover:border-gray-500 text-gray-300"
                    }`}
                  >
                    <span className="text-2xl">{meta.icon}</span>
                    <span className="text-sm font-medium">{meta.label}</span>
                    <span className="text-xs text-gray-400">{meta.desc}</span>
                  </button>
                );
              })}
            </div>
            {(learningStyle === "voice") && (
              <div className="mb-4 p-3 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-between">
                <span className="text-sm text-gray-300">Auto-play responses aloud</span>
                <button
                  onClick={() => setVoiceAutoplay((v) => !v)}
                  className={`w-10 h-5 rounded-full transition-colors ${voiceAutoplay ? "bg-blue-600" : "bg-gray-600"}`}
                >
                  <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${voiceAutoplay ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            )}
            <button
              disabled={!learningStyle}
              onClick={async () => {
                if (!learningStyle) return;
                const voice = learningStyle === "voice" || voiceEnabled;
                setVoiceEnabled(voice);
                await savePrefs(learningStyle, voice, voiceAutoplay);
                setShowOnboarding(false);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium py-3 rounded-xl transition-colors"
            >
              Start Learning →
            </button>
          </div>
        </div>
      )}
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 flex flex-col">
        <div className="border-b border-gray-800 px-4 py-4 flex items-center gap-2">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← Back</Link>
        </div>
        <div className="px-4 py-4 flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Beginner Tier</p>
          <div className="space-y-1 mb-5">
            {DISPLAY_ORDER.map((id) => LESSONS.find((l) => l.id === id)!).filter((l) => l.tier === "beginner").map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => startLesson(lesson.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  activeLesson === lesson.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <span className={`text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  completed.has(lesson.id)
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}>
                  {completed.has(lesson.id) ? "✓" : LESSON_NUM[lesson.id]}
                </span>
                <span className="leading-tight">{lesson.title}</span>
              </button>
            ))}
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Intermediate Tier</p>
          <div className="space-y-1 mb-5">
            {DISPLAY_ORDER.map((id) => LESSONS.find((l) => l.id === id)!).filter((l) => l.tier === "intermediate").map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => startLesson(lesson.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  activeLesson === lesson.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <span className={`text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  completed.has(lesson.id)
                    ? "bg-green-500 text-white"
                    : "bg-gray-700 text-gray-400"
                }`}>
                  {completed.has(lesson.id) ? "✓" : LESSON_NUM[lesson.id]}
                </span>
                <span className="leading-tight">{lesson.title}</span>
              </button>
            ))}
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Advanced Tier</p>
          <div className="space-y-1">
            {DISPLAY_ORDER.map((id) => LESSONS.find((l) => l.id === id)!).filter((l) => l.tier === "advanced").map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => startLesson(lesson.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                  activeLesson === lesson.id
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <span className={`text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                  completed.has(lesson.id)
                    ? "bg-green-500 text-white"
                    : "bg-purple-900 text-purple-300"
                }`}>
                  {completed.has(lesson.id) ? "✓" : LESSON_NUM[lesson.id]}
                </span>
                <span className="leading-tight">{lesson.title}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto border-t border-gray-800">
          {/* Learning style settings */}
          <div className="px-4 py-3 border-b border-gray-800">
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">Learning Style</p>
            <div className="flex gap-1">
              {(["visual", "reading", "voice"] as LearningStyle[]).map((style) => {
                const icons = { visual: "📊", reading: "📖", voice: "🔊" };
                return (
                  <button
                    key={style}
                    title={style.charAt(0).toUpperCase() + style.slice(1)}
                    onClick={async () => {
                      setLearningStyle(style);
                      const voice = style === "voice" || voiceEnabled;
                      setVoiceEnabled(voice);
                      await savePrefs(style, voice, voiceAutoplay);
                    }}
                    className={`flex-1 py-1.5 rounded-lg text-sm transition-colors ${
                      learningStyle === style
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {icons[style]}
                  </button>
                );
              })}
            </div>
            {voiceEnabled && (
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-400">Auto-play</span>
                <button
                  onClick={async () => {
                    const next = !voiceAutoplay;
                    setVoiceAutoplay(next);
                    await savePrefs(learningStyle!, voiceEnabled, next);
                  }}
                  className={`w-8 h-4 rounded-full transition-colors relative ${voiceAutoplay ? "bg-blue-600" : "bg-gray-600"}`}
                >
                  <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${voiceAutoplay ? "left-4" : "left-0.5"}`} />
                </button>
              </div>
            )}
          </div>
          {/* AI Answer Grading toggle */}
          <div className="px-4 py-3 border-b border-gray-800">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-semibold text-gray-400">AI Answer Grading</p>
                <p className="text-xs text-gray-600 mt-0.5 leading-snug">
                  Scores your check question answers and unlocks &ldquo;Mark as Complete&rdquo; when you pass.
                </p>
              </div>
              <button
                onClick={async () => {
                  const next = !judgeEnabled;
                  setJudgeEnabled(next);
                  if (learningStyle) await savePrefs(learningStyle, voiceEnabled, voiceAutoplay, next);
                  else {
                    await fetch("/api/preferences", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ learningStyle: null, voiceEnabled, voiceAutoplay, judgeEnabled: next }),
                    });
                  }
                }}
                className={`mt-0.5 w-8 h-4 rounded-full transition-colors relative shrink-0 ${judgeEnabled ? "bg-purple-600" : "bg-gray-600"}`}
              >
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${judgeEnabled ? "left-4" : "left-0.5"}`} />
              </button>
            </div>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-gray-500">{completed.size} / {LESSONS.length} lessons completed</p>
            <div className="mt-2 bg-gray-800 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all"
                style={{ width: `${(completed.size / LESSONS.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-white">
              {currentLesson ? `Lesson ${LESSON_NUM[currentLesson.id]}: ${currentLesson.title}` : "Atlas Learning Course"}
            </h1>
            <p className="text-xs text-gray-400">
              {currentLesson ? "Read the lesson, then answer the check question to continue" : "Select a lesson from the sidebar to begin"}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {currentLesson && (
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                currentLesson.tier === "beginner" ? "bg-blue-900 text-blue-300" :
                currentLesson.tier === "intermediate" ? "bg-yellow-900 text-yellow-300" :
                "bg-purple-900 text-purple-300"
              }`}>
                {currentLesson.tier.charAt(0).toUpperCase() + currentLesson.tier.slice(1)}
              </span>
            )}
            <button
              onClick={() => setHelpOpen(true)}
              className="w-7 h-7 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold flex items-center justify-center transition-colors"
              title="Help"
            >
              ?
            </button>
          </div>
        </header>
        <HelpPanel page="learn" open={helpOpen} onClose={() => setHelpOpen(false)} />

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {!activeLesson && (
            <div className="text-center text-gray-500 mt-20">
              <div className="text-4xl mb-4">📚</div>
              <p className="text-lg font-medium text-gray-300">Select a lesson to begin</p>
              <p className="text-sm mt-2">Work through all 23 lessons across Beginner, Intermediate, and Advanced tiers.</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="relative group max-w-2xl min-w-0">
                {msg.role === "assistant" && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-10">
                    {voiceEnabled && (
                      <button
                        onClick={() => speakingIndex === i ? stopSpeaking() : speak(msg.content, i)}
                        className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded-md"
                        title={speakingIndex === i ? "Stop" : "Read aloud"}
                      >
                        {speakingIndex === i ? "⏹" : "🔊"}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(msg.content);
                        setCopiedIndex(i);
                        setTimeout(() => setCopiedIndex(null), 2000);
                      }}
                      className="bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded-md"
                    >
                      {copiedIndex === i ? "Copied!" : "Copy"}
                    </button>
                  </div>
                )}
              <div
                className={`min-w-0 rounded-2xl px-4 py-3 text-sm leading-relaxed overflow-hidden ${
                  msg.role === "user" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-100"
                }`}
              >
                {msg.role === "user" ? (
                  msg.content
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h2: ({ children }) => <h2 className="text-base font-semibold mt-3 mb-1">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-sm font-semibold mt-2 mb-1">{children}</h3>,
                      p: ({ children }) => <p className="mb-2">{children}</p>,
                      ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                      table: ({ children }) => <table className="w-full text-xs border-collapse my-2">{children}</table>,
                      th: ({ children }) => <th className="border border-gray-600 px-2 py-1 bg-gray-700 text-left">{children}</th>,
                      td: ({ children }) => <td className="border border-gray-600 px-2 py-1">{children}</td>,
                      pre: ({ children }) => <pre className="bg-gray-700 rounded p-2 my-2 overflow-x-auto text-xs font-mono">{children}</pre>,
                      code: ({ children }) => <code className="bg-gray-700 px-1 rounded text-xs font-mono break-all">{children}</code>,
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                )}
              </div>
              {/* Judge result card — shown after user messages when judge is on */}
              {judgeEnabled && msg.role === "user" && judgeResults[i] && (
                <div className={`mt-1 rounded-xl px-3 py-2 text-xs border ${
                  judgeResults[i].passed
                    ? "bg-green-950 border-green-700 text-green-300"
                    : "bg-yellow-950 border-yellow-700 text-yellow-300"
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold">{judgeResults[i].passed ? "✓ Passed" : "Not quite"}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-400">Score: {judgeResults[i].score}/100</span>
                  </div>
                  <p>{judgeResults[i].feedback}</p>
                  {judgeResults[i].missing.length > 0 && (
                    <p className="mt-1 text-gray-400">Missing: {judgeResults[i].missing.join(", ")}</p>
                  )}
                </div>
              )}
              </div>
            </div>
          ))}

          {(loading || judging) && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-2xl px-4 py-3 text-sm text-gray-400">
                {judging ? "Grading your answer…" : activeLesson && messages.length === 0 ? "Loading lesson…" : "Thinking…"}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {activeLesson && currentLesson && messages.length >= 2 && !loading && messages[messages.length - 1].role === "assistant" && (
          <div className="px-6 pt-4 pb-2">
            <p className="text-xs text-gray-500 mb-2 text-center">Want to go deeper before moving on?</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {currentLesson.followUpPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendBubblePrompt(prompt)}
                  className="text-xs px-3 py-1.5 rounded-full border border-gray-600 text-gray-300 hover:border-blue-500 hover:text-blue-300 hover:bg-blue-950 transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeLesson && (
          <div className="border-t border-gray-800 px-6 py-4">
            <div className="flex gap-3 max-w-3xl mx-auto">
              <textarea
                className="flex-1 bg-gray-800 text-gray-100 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder-gray-500"
                rows={1}
                placeholder="Answer the check question or ask a follow-up..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {voiceEnabled && messages.length > 0 && (
                <button
                  onClick={() => {
                    if (speakingIndex !== null) {
                      stopSpeaking();
                    } else {
                      const lastAssistant = [...messages].reverse().find((m) => m.role === "assistant");
                      if (lastAssistant) speak(lastAssistant.content, messages.lastIndexOf(lastAssistant));
                    }
                  }}
                  title={speakingIndex !== null ? "Stop reading" : "Read last response aloud"}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    speakingIndex !== null
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }`}
                >
                  {speakingIndex !== null ? "⏹ Stop" : "▶ Play"}
                </button>
              )}
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 text-sm font-medium transition-colors"
              >
                Send
              </button>
            </div>
            <div className="flex flex-col items-center gap-1 mt-3">
              <button
                onClick={async () => {
                  if (!activeLesson) return;
                  const next = new Set(completed).add(activeLesson);
                  setCompleted(next);
                  await fetch("/api/preferences", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      learningStyle,
                      voiceEnabled,
                      voiceAutoplay,
                      judgeEnabled,
                      completedLessons: Array.from(next),
                    }),
                  });
                }}
                disabled={
                  !activeLesson ||
                  completed.has(activeLesson) ||
                  (judgeEnabled && !judgePassed.has(activeLesson))
                }
                className="text-xs px-4 py-1.5 rounded-full border border-green-600 text-green-400 hover:bg-green-600 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {activeLesson && completed.has(activeLesson)
                  ? "✓ Lesson Complete"
                  : judgeEnabled && activeLesson && !judgePassed.has(activeLesson)
                  ? "Answer the check question to unlock"
                  : "Mark as Complete"}
              </button>
              {judgeEnabled && activeLesson && !judgePassed.has(activeLesson) && !completed.has(activeLesson) && (
                <p className="text-xs text-purple-400">AI grading is on — pass the check question to complete this lesson</p>
              )}
            </div>
            <p className="text-center text-xs text-gray-600 mt-2">Press Enter to send · Shift+Enter for new line</p>
          </div>
        )}
      </div>
    </div>
  );
}
