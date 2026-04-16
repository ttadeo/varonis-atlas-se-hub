---
title: Varonis Launches Atlas to Secure AI and the Data That Powers It
url: https://varonis.highspot.com/items/69b958e1fe24accd35e2ce06?forward=true
section: competitive
---

# Varonis Launches Atlas to Secure AI and the Data That Powers It

Blog
Varonis Products
Varonis Launches Atlas to Secure AI and the Data That Powers It
New AI Security Platform gives organizations complete visibility and control over every AI system they build and run.
Shawn Hays
6 min read
Last updated March 17, 2026

Varonis is proud to announce the general availability of Varonis Atlas, an end-to-end AI Security Platform that helps organizations see and control AI across the enterprise.

Atlas is the only platform that covers the entire AI security lifecycle — from discovery and posture management to runtime protection and compliance — in a single solution. It connects to any AI system organizations build or run: hosted AI platforms, custom LLMs, agentic frameworks, chatbots, and embedded AI. And because Atlas is built on the Varonis Data Security Platform, it brings data context that no standalone AI security tool can match. 

“AI completely disrupts the enterprise security model. Instead of humans clicking through UIs, agents are accessing data directly — and this places data and AI security front and center,” said Yaki Faitelson, CEO and Co-founder of Varonis. “If you can’t see what AI systems you have and what sensitive data they can reach, you can’t safely use AI at scale. Varonis Atlas gives organizations the fastest path to safe and trustworthy AI.” 

Your fastest path to safe and trustworthy AI

AI agents, copilots, and LLMs are now embedded in enterprise workflows. They read, write, and act on data at machine speed. However, most organizations don’t know which AI systems they have, what those systems can access, or whether they’re compliant with emerging regulations.

Gartner® recently wrote a report, the Future of AI Security is in Securing Agent Actions, Not Prompts, and in their analysis, researchers discovered that over 50% of organizations have already begun deploying or plan to deploy AI agents. Organizations are also building with AI. 

The report predicts AI security platforms will be used in 30% of organizations to secure agent development within AI-native software engineering, as the growing majority of enterprise software relies on agentic coding tools.

As enterprises deploy more autonomous and agentic AI systems, risk escalates:

Agents read, write, create, and modify data continuously and at machine speed
Data access is often too broad and poorly understood
Small misconfigurations can result in massive data breaches or compliance fines

This is why AI security must be rooted in data security, and why Varonis Atlas exists. Atlas secures everything you build and run with AI. Let's take a deeper look at these capabilities. 

An overview of the Atlas platform's coverage throughout the entire AI security lifecycle  

Atlas AI security capabilities 
AI Inventory and Shadow AI 

Varonis Atlas provides continuous discovery of all AI systems across the enterprise, including sanctioned tools, custom-built agents, embedded AI, and shadow AI used without formal approval. By scanning cloud accounts, code repositories, AI platforms, and SaaS usage, Atlas builds a living inventory that shows what AI exists, how it’s connected, what data it can access, and what actions it can take — forming the foundation for every other AI security control. 

Go beyond surface discovery: Atlas inventories agents, models, tools, MCP servers, dependencies, and supporting infrastructure — not just LLM endpoints or chat apps.  
Uncover shadow AI with context: Discovered AI assets are tied to users, data access, and activity context, making shadow AI immediately actionable instead of just visible. 

 Continuously discover AI assets, projects, and systems — including shadow AI — across your entire environment.  

AI Security Posture Management (AI-SPM) 

Atlas AI Security Posture Management continuously assesses AI systems for vulnerabilities, misconfigurations, sensitive data exposure, and agentic risks across the entire AI stack. It analyzes code, prompts, models, dependencies, and configurations to surface concrete security issues and links them directly back to the AI assets and data they affect. This comprehensive approach allows teams to remediate risk before AI systems reach production or scale.  

Data-aware posture, not just model checks: Findings are enriched with data sensitivity and access context from the Varonis Data Security Platform, exposing real business risk.  
Built for enterprise scale: AI-SPM spans cloud platforms, agent frameworks, custom models, and third-party AI — not a single development environment or use case. 

 Scan your AI agents, chatbots, and models for vulnerabilities and misconfigurations.

AI Pen Testing 

Atlas proactively stress tests AI systems by executing adversarial prompts and dynamic attacks against live LLM endpoints. Only through runtime analysis can teams uncover all possible issues. These tests, therefore, simulate real-world threats such as prompt injection, jailbreaks, and policy bypass attempts, then record unsafe behaviors as concrete security findings tied directly to the affected models, agents, and configurations. 

Live, dynamic testing: Pen tests run against real production endpoints, not offline simulations or static rule checks. 
Downstream enforcement: Pentest results directly inform runtime guardrails and posture policies, closing the loop from testing to protection. 

Proactively stress test your AI systems for vulnerabilities like prompt injection and jailbreaks. 

AI Runtime Guardrails 

Atlas enforces real-time guardrails through an AI Gateway that sits in the live request path, inspecting prompts, responses, and agent actions before they reach the model or downstream systems. These controls prevent sensitive data leakage, block malicious or noncompliant behavior, and generate real-time alerts — without requiring changes to the underlying AI application or model.  

AI-aware blocking and policy enforcement: Guardrails understand execution flow, agent tools, and indirect leakage paths — not just simple pattern matching.  
Customer-owned data plane: Prompts, responses, and telemetry stay inside the customer’s environment, supporting data residency and sovereignty requirements.  

 Enforce real-time policies that prevent sensitive data leakage and block malicious and non-compliant AI usage. 

AI Compliance and Governance 

Atlas operationalizes AI governance by continuously mapping AI systems to regulatory frameworks such as the EU AI Act and NIST AI RMF. The platform generates audit-ready reports, maintains lineage and transparency artifacts, and tracks risk assessments and remediation status—turning compliance from a one-time exercise into an ongoing, evidence-backed process.

Built on real system evidence: Compliance reporting is grounded in live AI inventory, lineage graphs, activity logs, and security findings — not questionnaires alone.  
Unified with security controls: Governance is directly connected to discovery, posture, pen testing, and runtime enforcement, avoiding fragmented GRC tooling. 

Get out-of-the-box audit reporting to validate your compliance with ever-changing AI regulations and frameworks. 

AI Third-Party Risk Management (AI TPRM) 

Varonis Atlas extends AI security beyond internally built systems to include the AI services, models, and platforms organizations consume through their supply chain. It continuously assesses third-party AI vendors by combining their AI inventory or AI Bills of Materials (AIBOM) with vendor questionnaire responses to understand how external AI systems handle data and possibly create risk due to specific dependencies. This enables organizations to identify, track, and remediate third-party AI risk as part of a unified AI security lifecycle.  

Continuous, not point in time: Third-party AI risk is continuously reassessed as vendor inputs, dependencies, or behaviors change, rather than relying on static reviews. 
Integrated with AI inventory: Third-party AI systems are tracked alongside internal AI assets, providing automated risk analysis and visibility. 

 Manage AI use within products and services that you consume through your supply chain and take control of third-party risk. 

AI Activity Monitoring 

Atlas AI Activity Monitoring provides end-to-end visibility into how AI systems behave in production by capturing prompts, responses, agent actions, data access, and guardrail decisions. Through a customer-owned observability layer and centralized dashboards, security and governance teams can understand how AI is used, detect anomalous behavior, and investigate incidents with full execution context across models, agents, and tools.  

Full execution visibility: Monitoring spans prompts, responses, agent tool calls, and data access—not just user chat logs or model outputs.  
Customer-owned telemetry: All AI activity logs remain within the customer’s environment, supporting auditability, data residency, and forensic investigation.  

 View an audit trail of full end-to-end flows of AI interactions, including LLM calls, data access, tool calls, and guardrails. 

AI Detection & Response (AIDR) 

Varonis Atlas delivers AI Detection and Response (AIDR) by identifying malicious, unsafe, or noncompliant AI behavior across models, agents, tools, and data flows in real time. When threats such as prompt injections or jailbreak attempts are detected, Atlas generates actionable alerts, blocks activity inline when needed, and integrates with SIEM and SOAR platforms to support rapid investigation and response.  

AI-native threat detection: AIDR understands AI-specific attack techniques and agentic behavior rather than relying on traditional application security signals. 
Unified with data security: Detections are enriched with data sensitivity and access context, enabling teams to prioritize incidents based on real business impact. 

Detect and monitor all AI usage with a full end-to-end audit trail and generate real-time alerts.

Secure AI and the data that powers it  

AI security cannot live in silos or point solutions. It demands a unified approach that connects to the data that AI depends on. As organizations scale AI they also scale exposure. The only way forward is security that understands both how AI behaves and what data it can reach.

“Most AI security tools are fragmented and data-blind. They can inventory your AI systems or monitor prompts, but they can’t see what sensitive data AI is accessing or control what it does with that data. That’s the real risk, and is exactly what Atlas and the Varonis Data Security Platform solve together.”

Ron Bennatan, VP of AI and Data Security Strategy at Varonis, co-founder of AllTrue.ai, creator of Guardium (acquired by IBM) and jSonar (acquired by Imperva)

 

Varonis Atlas is available today. Begin by watching the demo video below or with a free trial with full access to Atlas’ AI inventory, posture management, security testing, runtime guardrails, and compliance reporting functionality. 

What should I do now?

Below are three ways you can continue your journey to reduce data risk at your company:

1

Schedule a demo with us to see Varonis in action. We'll personalize the session to your org's data security needs and answer any questions.

2

See a sample of our Data Risk Assessment and learn the risks that could be lingering in your environment. Varonis' DRA is completely free and offers a clear path to automated remediation.

3

Follow us on LinkedIn, YouTube, and X (Twitter) for bite-sized insights on all things data security, including DSPM, threat detection, AI security, and more.

Shawn Hays
Shawn is a Product Marketing Manager for Varonis, focusing largely on AI and the Microsoft cloud. He has been a journeyman in the Microsoft ecosystem and cybersecurity arena for ten years. When not pontificating on AI and data security, you can catch him at a music festival or throwing a frisbee.
