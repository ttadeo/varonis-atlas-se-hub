---
title: Atlas FAQ — Sales Engineers (SE-Level Technical Questions and Objections)
url: https://internal.varonis.com/atlas-faq
section: faq
---

# Atlas FAQ — Sales Engineers (SE-Level Technical Questions and Objections)

## AI Inventory

**Q: What is AI Inventory and why is it important?**
A: Discover and catalog all AI assets (including sanctioned, unsanctioned, and shadow AI) via integrations with cloud providers, code repositories, and ZTNA. You must know what you are securing, so building an inventory for visibility is paramount.

**Q: How do you detect Shadow AI?**
A: Atlas offers a variety of discovery engines to identify instances of Shadow AI, including discovery for cloud accounts, code repositories, AI services like Copilot or ChatGPT, and even facilities for helping to manage third-party risk associated with embedded AI used by partners. These engines run daily to quickly capture any new assets that appear in the enterprise. These various engines collectively create a comprehensive inventory of all related AI assets and activities.

As an API-based system, there are options for interrogating an external inventory repository — typically generated as part of a governance process — and automatically reconciling the differences between defined vs. discovered inventory. The non-overlapping assets are the definition of Shadow AI.

**Q: What methods can be employed to ascertain whether an AI-generated output constitutes a hallucination?**
A: Atlas uses an LLM-as-a-Judge technique implemented through the AI Monitor. This approach applies rule-driven evaluations and LLM-based assessments to identify potential hallucinations and other quality or safety issues in AI outputs. Currently, the model applies its own training data to assess factual accuracy, which is most effective for general scenarios utilizing information from public domains.

**Q: How do you detect public AI tools like ChatGPT and Claude?**
A: ZTNA/SASE log files are forwarded to Atlas, and the system parses this information to identify which users are accessing which services. Customers may already be receiving these log files and reviewing them separately, but incorporating this information into Atlas yields unified visibility into all AI-related activities.

**Q: What privileges are needed to scan?**
A: For cloud accounts, Atlas executes scripts during the initial configuration that create basic read-only access permissions to scan cloud catalogs in search of AI-related assets. For code repositories, read/write access is configured during initial setup — write access enables Atlas to generate Pull Requests for automated remediation. A list of permissions is available upon customer request.

**Q: Which PaaS platforms can Atlas connect to?**
A: Primary support is for AWS and Azure. Atlas is also rolling out support for Databricks, Snowflake, and IBM WatsonX.

**Q: Can Atlas scan local models on workstations?**
A: Atlas does not scan workstations for AI content since it does not rely on any agent technology for visibility. However, as part of code repository scanning, Atlas does inspect Jupyter notebooks, which are the default key locations for emerging AI systems and often represent the start of AI development. These notebooks are also notorious for housing sensitive data used in early AI training.

**Q: What are the known blind spots in AI discovery?**
A: Atlas requires a known environment entry point — a connected cloud account, code repository, or network integration. Key blind spots include local LLMs (no network traffic, runs entirely on local hardware) and niche tools not yet widely deployed. If a customer is using a tool Atlas does not currently detect, sharing where and how it's used helps the technical team build targeted detection quickly.

**Q: If security delegates access to another team, is it role-based? Project-based?**
A: Atlas provides highly granular role and project-based controls to tightly manage who has access to specific functionality and project information. There are separate roles for security administration vs. operational tasks and audit logs highlighting all actions taken within the system. Isolating access for auditors or pen testing teams is fully supported. Many competitors do not offer this level of granular control.

**Q: How do I map a model/agent/resource to a project?**
A: Typically, you start by defining projects in the tool and then trigger scans under that project umbrella — resources are assigned to the correct project by default. Shadow AI assets not associated with a project are placed in the Default Project bucket and can then be assigned to the proper project once reviewed. There is a Discovery policy engine that controls what to search for and whether to assign an approved state to new assets.

**Q: How complete is Atlas AI discovery, and how does it keep up with new AI technologies?**
A: Atlas maintains a discovery policy list visible under AI Inventory → Configuration → Discovery Policy. Because AI is evolving rapidly, gaps are expected as new tools emerge. When a customer identifies a tool not currently detected, the team gathers details about how it's used and where it lives, then works with the technical team to build detection for it.

**Q: Can Atlas integrate with an existing LLM Gateway?**
A: Yes. Atlas integrates with Kong, for example. Customers with an existing API gateway can configure it to call the Atlas firewall APIs directly.

---

## AI Usage

**Q: What is AI Usage?**
A: AI Usage provides the ability to have alerts from browser-based AI tool activity. It shows all AI services consumed over the Internet from AI service providers, plus LLMs consumed and monitored by the observability layer (the AI Gateway).

**Q: How do you see runtime activities?**
A: There are two primary paths for establishing visibility into AI activities:

For AI Services usage, Atlas receives log feeds from ZTNA/SASE tools and parses this information to identify which users are accessing which services. This is strictly session-level data since the logs do not provide prompt-level detail.

For classic GenAI activity, Atlas captures detailed prompt/response information and applies guardrails and real-time controls for blocking, alerting, and policy violations. There are three paths to collect this data: embedded nginx proxy, SDK access, and integration with API/AI gateways the client is already using.

---

## AI Security Posture Management (AI SPM)

**Q: What is AI SPM?**
A: AI Security Posture Management (AI SPM) is a comprehensive capability designed to provide continuous oversight and protection of AI-related assets across an organization. This includes the ongoing discovery, assessment, and evaluation of AI assets such as models, endpoints, code repositories, agents, and supporting infrastructure. The core objectives are to identify potential vulnerabilities, misconfigurations, excessive permissions, exposure of sensitive data, and agentic threats within these AI assets. AI SPM assigns risk scores to assets, offers remediation guidance, and incorporates penetration testing tools to help organizations strengthen their overall AI security posture.

**Q: What is AI TRiSM?**
A: AI TRiSM (AI Trust, Risk, and Security Management) is a framework for ensuring AI systems are secure, trustworthy, compliant, and governed by managing risks related to models, data, and AI usage across an organization.

**Q: How does Atlas determine if code is unsafe?**
A: Once AI assets are discovered, they are automatically subjected to a suite of security posture management scans evaluating code vulnerabilities, misconfigurations, and the presence of sensitive data. Code vulnerabilities are evaluated using pentesting and various industry sources that are continuously updated.

**Q: Do I need AI SPM if I already have a CSPM tool?**
A: Atlas is specifically focused on AI SPM and less focused on traditional CSPM or vulnerability tools. Many organizations use Wiz today as their CSPM, and Wiz offers capabilities for AI discovery and AI SPM — but it is only a small portion of the overall lifecycle protection that Atlas provides. Atlas does much more: inventory goes beyond cloud to scan codebases, it does runtime protection and detection, automates compliance, and manages third-party risk. There is some overlap in IaaS and some PaaS, but Atlas is purpose-built for AI security.

**Q: How is the safety score determined?**
A: The system catches a wide range of risk indicators, and a weighted algorithm determines the risk score. This helps customers gauge their AI security stance over time.

**Q: How is the severity of Vulnerable AI Resources determined?**
A: Severity levels (Critical, High, Medium, Low) are pulled from a variety of industry sources and mapped into Atlas. Atlas provides flexibility to change the severity level based on the client's risk tolerance, importance of the application, etc.

**Q: Can changes be rolled back?**
A: Customers have control for implementing fixes. Atlas does not have write permissions to misconfigurations. Customers can create pull requests and service tickets to facilitate any changes.

---

## AI Pen Testing

**Q: Does the platform perform penetration testing or red teaming?**
A: Yes. There is a fully integrated and intelligent pen testing facility on the platform covering both model scanning (artifact-level scanning) and LLM endpoint pentesting (runtime testing via adversarial prompts).

**Q: What are Penetration Testing Templates?**
A: Pentest templates come with pre-set criteria tailored to specific compliance frameworks a client wishes to align with. Additionally, the system includes a questionnaire that helps identify the appropriate compliance framework for an organization based on its industry and location.

---

## System Integrations

**Q: Can alerts be sent to a SIEM?**
A: Yes. The platform supports integration with a variety of SIEMs including Datadog, Splunk, and others. Issues can be forwarded to SIEM systems, and incidents can be exported to ServiceNow for ticketing and remediation tracking.

**Q: Can incidents be sent to ServiceNow?**
A: Yes. Atlas supports integration with ServiceNow for forwarding incident information into existing event management processes. There is also an integrated incident management system built into Atlas for smaller organizations that have not committed to a ServiceNow-type solution.

**Q: Does Atlas support on-premises AI model discovery?**
A: On-premises scanning is not currently supported. Atlas can scan for model file types (GGUFs, PyTorch, etc.) but is not looking for people running Ollama locally. Ask customers whether they're concerned about models on servers or endpoints to understand the use case.

**Q: What authentication methods does Atlas support?**
A: Authentication varies by integration. For cloud platforms, Atlas uses IAM roles (AWS) and Service Principals (Azure). For code repositories, Personal Access Tokens are supported, and GitHub has a dedicated app installation option. LLM endpoints connect via API keys. The Atlas platform itself uses Auth0 and supports SSO providers like Okta and Entra ID.

**Q: Are there APIs available for more advanced integration and automation?**
A: Yes. The entire system is built around APIs, and all functionality is accessible via APIs. One example is triggering pen testing as a new version of an AI asset is released via CI/CD pipelines. Atlas has already built GitHub Actions and Azure DevOps hooks to support this use case.

**Q: Is there a REST API or GraphQL API for Atlas?**
A: Yes. Atlas exposes both REST and GraphQL APIs. The REST API documentation is at https://prod.alltrue-be.com/_docs/api/openapi and GraphQL documentation is at https://prod.alltrue-be.com/_docs/docs.

---

## Deployment

**Q: What are the requirements for a POC/Eval?**
A: POCs take place in a laboratory that Atlas sets up for customers. Clients supply Varonis with the infrastructure and tools they wish to test, and Varonis builds a suitable environment. The aim is to establish a connection to some type of production system within two weeks. Customers also have the option to import their own datasets into the POC.

**Q: How is Atlas deployed?**
A: Atlas is a SaaS solution built on AWS technology that consists of two major components: a Control Plane for overseeing the operation of the tool and a Data Plane responsible for all interaction with the customers' data. Varonis manages the operation of both components under a SaaS model, even though the Data Plane is installed in the customer's own AWS VPC. This ensures full data privacy — Varonis has no exposure to customer data.

**Q: Can the data plane be deployed in any cloud?**
A: The Data Plane can only be deployed on AWS currently. Varonis is exploring an option to install it in Azure. The fact that the data plane is hosted in AWS does not limit Atlas's ability to support other major cloud platforms for AI security coverage.

**Q: What are the currently supported deployment regions?**
A: US West 2, US East 1, and EU Central (Frankfurt).

**Q: How long does it take to provision a new tenant for a POC?**
A: Typically 24–48 hours, with the data plane deployment taking roughly 30 minutes once prerequisites are met.

**Q: What is the recommended Atlas deployment sequence for new customers?**
A: Best practice is to start with AI Usage to establish visibility into what AI services employees are already accessing — this creates the "before" picture that resonates with CISOs. Next, deploy the AI Gateway and start with WARN/LOG rules (asynchronous) across all guardrails to baseline traffic without disrupting users. After reviewing Issues generated during this baselining period, escalate high-confidence attack vectors to BLOCK enforcement. Then enable AI Inventory and AI SPM scanning to discover and assess AI assets. AI Compliance and TPRM come later once the foundational visibility and protection layers are in place.

**Q: Does the Approve/Reject feature make changes in the customer's environment?**
A: No — it is a flag within the Atlas platform only. Atlas does not request write permissions to customer environments. The intended workflow is: mark a resource as unapproved, then manually remove it from the environment. If that resource reappears in a future scan, Atlas will surface it as a Shadow AI issue, which can be forwarded to a SIEM or ticketing system.

---

## Guardrails

**Q: What is LLM as a Judge?**
A: LLM as a Judge is a technique that uses an LLM to assess and score AI outputs against predefined safety, quality, or policy criteria. Atlas uses this in the AI Monitor for evaluating hallucinations and output quality.

**Q: Does the LLM Gateway introduce latency?**
A: Yes. BLOCK and MODIFY (Redaction) actions introduce some latency because Atlas must wait on a verdict before allowing or blocking the request. The amount of latency is impacted by the number of guardrails configured and the complexity and token size of the prompt. WARN and LOG actions are asynchronous and introduce no latency.

---

## Compliance and Governance

**Q: What are the currently supported deployment regions for customer tenants?**
A: US West 2, US East 1, and EU Central (Frankfurt).

**Q: How does Atlas help enforce responsible AI in an organization?**
A: Atlas provides the controls, visibility, and audit trail that responsible AI governance requires: guardrail enforcement to prevent policy violations, AI Inventory to ensure all AI assets are known and reviewed, AI Compliance to map controls to regulatory frameworks, and AI Observability to provide the audit trail regulators require. The AI 360 dashboard gives executive-level visibility into the organization's overall AI risk posture.
