"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

const N8N_WEBHOOK = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL!;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Lesson {
  id: number;
  title: string;
  tier: string;
  intro: string;
  followUpPrompts: string[];
}

const LESSONS: Lesson[] = [
  {
    id: 1,
    title: "What is Varonis Atlas?",
    tier: "beginner",
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
];

export default function LearnPage() {
  const [activeLesson, setActiveLesson] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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

  async function startLesson(lessonId: number) {
    const lesson = LESSONS.find((l) => l.id === lessonId)!;
    setActiveLesson(lessonId);
    setMessages([]);
    setHistory([]);
    setLoading(true);

    try {
      const data = await sendToN8n(lesson.intro, []);
      setMessages([{ role: "assistant", content: data.answer }]);
      setHistory(data.history);
    } catch {
      setMessages([{ role: "assistant", content: "Error loading lesson. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

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
      {/* Sidebar */}
      <div className="w-64 border-r border-gray-800 flex flex-col">
        <div className="border-b border-gray-800 px-4 py-4 flex items-center gap-2">
          <Link href="/" className="text-gray-400 hover:text-white text-sm">← Back</Link>
        </div>
        <div className="px-4 py-4 flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Beginner Tier</p>
          <div className="space-y-1 mb-5">
            {LESSONS.filter((l) => l.tier === "beginner").map((lesson) => (
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
                  {completed.has(lesson.id) ? "✓" : lesson.id}
                </span>
                <span className="leading-tight">{lesson.title}</span>
              </button>
            ))}
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Intermediate Tier</p>
          <div className="space-y-1 mb-5">
            {LESSONS.filter((l) => l.tier === "intermediate").map((lesson) => (
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
                  {completed.has(lesson.id) ? "✓" : lesson.id}
                </span>
                <span className="leading-tight">{lesson.title}</span>
              </button>
            ))}
          </div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Advanced Tier</p>
          <div className="space-y-1">
            {LESSONS.filter((l) => l.tier === "advanced").map((lesson) => (
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
                  {completed.has(lesson.id) ? "✓" : lesson.id}
                </span>
                <span className="leading-tight">{lesson.title}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto px-4 py-4 border-t border-gray-800">
          <p className="text-xs text-gray-500">{completed.size} / {LESSONS.length} lessons completed</p>
          <div className="mt-2 bg-gray-800 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all"
              style={{ width: `${(completed.size / LESSONS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-gray-800 px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-white">
              {currentLesson ? `Lesson ${currentLesson.id}: ${currentLesson.title}` : "Atlas Learning Course"}
            </h1>
            <p className="text-xs text-gray-400">
              {currentLesson ? "Read the lesson, then answer the check question to continue" : "Select a lesson from the sidebar to begin"}
            </p>
          </div>
          {currentLesson && (
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
              currentLesson.tier === "beginner" ? "bg-blue-900 text-blue-300" :
              currentLesson.tier === "intermediate" ? "bg-yellow-900 text-yellow-300" :
              "bg-purple-900 text-purple-300"
            }`}>
              {currentLesson.tier.charAt(0).toUpperCase() + currentLesson.tier.slice(1)}
            </span>
          )}
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {!activeLesson && (
            <div className="text-center text-gray-500 mt-20">
              <div className="text-4xl mb-4">📚</div>
              <p className="text-lg font-medium text-gray-300">Select a lesson to begin</p>
              <p className="text-sm mt-2">Work through all 18 lessons across Beginner, Intermediate, and Advanced tiers.</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className="relative group max-w-2xl min-w-0">
                {msg.role === "assistant" && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(msg.content);
                      setCopiedIndex(i);
                      setTimeout(() => setCopiedIndex(null), 2000);
                    }}
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 hover:bg-gray-600 text-gray-300 text-xs px-2 py-1 rounded-md z-10"
                  >
                    {copiedIndex === i ? "Copied!" : "Copy"}
                  </button>
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
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-800 rounded-2xl px-4 py-3 text-sm text-gray-400">
                {activeLesson && messages.length === 0 ? "Loading lesson…" : "Thinking…"}
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
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-4 py-3 text-sm font-medium transition-colors"
              >
                Send
              </button>
            </div>
            <div className="flex justify-center mt-3">
              <button
                onClick={() => {
                  if (activeLesson) setCompleted((prev) => new Set(prev).add(activeLesson));
                }}
                disabled={activeLesson ? completed.has(activeLesson) : true}
                className="text-xs px-4 py-1.5 rounded-full border border-green-600 text-green-400 hover:bg-green-600 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {activeLesson && completed.has(activeLesson) ? "✓ Lesson Complete" : "Mark as Complete"}
              </button>
            </div>
            <p className="text-center text-xs text-gray-600 mt-2">Press Enter to send · Shift+Enter for new line</p>
          </div>
        )}
      </div>
    </div>
  );
}
