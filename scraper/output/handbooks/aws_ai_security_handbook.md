---
title: AWS AI Security Handbook
url: https://prod.alltrue-be.com/_docs/docs/handbooks/aws_ai_security_handbook
section: handbooks
---

# AWS AI Security Handbook

- [](/_docs/)- Handbooks- AWS AI Security HandbookExport PDFOn this page# AWS AI Security Handbook
Practical operating model for securing AI systems in AWS with Atlas — discovery and inventory, posture, identity and data review, AI Red Team, runtime protection, evaluation and investigation, and governance and compliance.

## What this handbook is for[​](#what-this-handbook-is-for)
This handbook explains how to securely adopt, harden, and operate AI systems in AWS using Atlas. AI systems in AWS span many moving parts — Bedrock models, agents, and AgentCore resources, the identities they run as, the data they can reach, and the runtime paths through which users interact with them. As these systems become more agentic, the security question grows from "which model are we using?" to "what can this system access, call, and do?" This handbook threads Atlas's capabilities into one operating model for answering that question on AWS.

It is written for the teams who share responsibility for an AWS AI environment:

- **Security and GRC teams** — own risk decisions, review posture findings, govern runtime protections, and prepare evidence for audits.
- **Platform and AI-infrastructure teams** — link AWS accounts, run discovery, and operate the connection points the other teams depend on.
- **Application and agent developers** — connect repositories, register endpoints, and remediate findings on the systems they build.

If you are connecting AWS for the first time, start with the getting-started page [AWS](/_docs/docs/providers/aws), then return here for the end-to-end operating model.

## Key idea: AWS expands the AI attack surface[​](#key-idea-aws-expands-the-ai-attack-surface)
On AWS, the greatest risk is rarely the model in isolation — it is the combination of the AWS services behind the system, the identity it runs as, the tools and data it can reach, and the runtime paths through which it is used. Atlas runs an AWS discovery pipeline against each linked account that includes dedicated Bedrock model, agent, and AgentCore discovery, alongside the surrounding AWS services an AI system depends on. That inventory is the foundation the rest of this operating model builds on. For the full set of Bedrock resources Atlas inventories and the relationships it captures, see [AWS Bedrock](/_docs/docs/providers/aws_bedrock).

## Operating model (recommended)[​](#operating-model-recommended)
Use this as the golden path for securing an AI system in AWS. Each step builds on the inventory and findings of the ones before it.

### Step 1: Discover and inventory the AWS AI environment[​](#step-1-discover-and-inventory-the-aws-ai-environment)
**What to do:** Link your AWS account from **AI Inventory &gt; Configuration &gt; Cloud Accounts** (use **Resource Management &gt; Add New Cloud Account** to add one). Linking uses an assumed-role ARN, and Atlas verifies the connection by assuming the role before the account is committed. Both Bedrock logging and Bedrock invocation must be enabled for the account. Deploy the discovery stack as a Single Account (a command or a CloudFormation quick-create) or across many accounts with a CloudFormation StackSet, leaving the `EnableBedrockLogging` parameter on. See [AWS Bedrock](/_docs/docs/providers/aws_bedrock) for the cloud-account setup detail and [AWS](/_docs/docs/providers/aws) for the step-by-step linking flow.

**Why it matters:** Discovery turns an opaque AWS footprint into an inventory of Bedrock models, agents, AgentCore resources, identities, and data sources you can reason about.

**Success criteria:** The account is linked, Test Connection passes, and Bedrock resources begin to populate [AI Inventory](/_docs/docs/applications/ai_inventory).

### Step 2: Discover foundation-model usage from invocation logs[​](#step-2-discover-foundation-model-usage-from-invocation-logs)
**What to do:** Keep Bedrock invocation logging enabled so Atlas can read the S3-backed logs and infer which foundation models are actually in use.

**Why it matters:** Logs reveal real usage — including shadow Bedrock activity — that resource enumeration alone misses. Accounts without invocation logging still surface agents, imported, marketplace, and custom models, and AgentCore resources, but foundation-model usage will be missing.

**Success criteria:** Foundation models seen in invocations appear in inventory. See [AWS Bedrock](/_docs/docs/providers/aws_bedrock) for the mechanism.

### Step 3: Review posture in AI SPM[​](#step-3-review-posture-in-ai-spm)
**What to do:** Enable the **AWS AI Security Best Practices** posture framework (and, for multi-cloud coverage, **Cloud Secure AI Fundamentals**) and triage the Bedrock findings in AI SPM. The Bedrock checks cover agents, agent versions, flows, prompts, and custom models that are not encrypted with a customer-managed KMS key; agents and agent versions with no Bedrock guardrail attached; and prompt max-token configuration.

**Why it matters:** Posture findings are where misconfigurations on production Bedrock resources surface.

**Success criteria:** High-risk findings are prioritized and assigned owners. See [AI SPM](/_docs/docs/applications/ai_spm).

### Step 4: Review identities and data access[​](#step-4-review-identities-and-data-access)
**What to do:** Use the AI Inventory dependency graph to review what each Bedrock resource can reach: model lineage, agent configuration, knowledge-base and data-source access, Lambda invocation edges, Redshift access, and IAM role permission edges.

**Why it matters:** The practical blast radius of an agent is defined by its identity and the data and tools it can reach — not by the model alone. This is especially important for agentic systems, where a privileged agent amplifies risk far beyond a single model interaction.

**Success criteria:** Risky identities and sensitive data paths are identified and privilege-reduction opportunities are visible. See [AWS Bedrock](/_docs/docs/providers/aws_bedrock) for the dependency-graph relationships.

### Step 5: Pentest with AI Red Team[​](#step-5-pentest-with-ai-red-team)
**What to do:** Register the Bedrock endpoint as an LLM endpoint (with an assumed-role ARN or AWS access keys plus a region — see [AWS Bedrock](/_docs/docs/providers/aws_bedrock)), then run an AI Red Team pentest against it using a framework scan template: OWASP Top 10 for LLM Applications, OWASP Top 10 for Agentic Systems, MITRE ATLAS Essentials, or a Quick Smoke Test. A scan run can also enable active runtime policies so pentest traffic flows through the endpoint's AI Runtime guardrails.

**Why it matters:** Adversarial testing shows how the system behaves under prompt injection, jailbreaks, data leakage, and unsafe instruction following before you rely on it.

**Success criteria:** Key exploit paths are understood, and runtime protections can be prioritized from real attack pressure. See [AI Red Team](/_docs/docs/applications/ai_red_team).

### Step 6: Protect runtime traffic with AI Runtime[​](#step-6-protect-runtime-traffic-with-ai-runtime)
**What to do:** Put production Bedrock endpoints behind AI Runtime, which supports Bedrock as a runtime provider. Integrate through the proxy, through the SDK or direct guardrail calls, or via an existing API gateway. Policies bind to the endpoint identifier — set in the request URL path or in the `x-alltrue-llm-endpoint-identifier` header — and are configured on the **AI Runtime &gt; Policies** page.

**Why it matters:** Runtime protection is the enforcement point for prompt and response inspection on live Bedrock traffic.

**Success criteria:** The protected path is established and policies apply to the right endpoint. See [AI Runtime](/_docs/docs/applications/ai_gateway); Bedrock endpoint auth (assumed role versus keys) is covered on [AWS Bedrock](/_docs/docs/providers/aws_bedrock).

### Step 7: Govern MCP and tool exposure[​](#step-7-govern-mcp-and-tool-exposure)
AgentCore and Bedrock agents can expose MCP tools. Where they do, govern the available tool surface with Virtual MCPs and tool quarantine rather than letting it expand silently. This handbook keeps that thin — see the [MCP Security Handbook](/_docs/docs/handbooks/mcp_security_handbook) and [AI MCP](/_docs/docs/applications/ai_mcp) for the full workflow.

### Step 8: Evaluate and investigate[​](#step-8-evaluate-and-investigate)
**What to do:** Review Bedrock runtime traffic as it flows through AI Runtime: alerts and issues first, then sessions and events in AI Investigation, escalating material findings into AI Incidents.

**Why it matters:** Reviewing real sessions is one of the highest-value ways to validate controls, demonstrate improved resilience after changes, and explain outcomes to stakeholders.

**Success criteria:** Baseline behavior is understood, suspicious patterns are investigated, and material findings become incidents. See [AI Investigation](/_docs/docs/applications/ai_monitor), the [AI Investigation Handbook](/_docs/docs/handbooks/ai_investigation_handbook), and [AI Incidents](/_docs/docs/applications/ai_incidents).

### Step 9: Govern and document compliance[​](#step-9-govern-and-document-compliance)
**What to do:** Use the AI SPM posture frameworks (AWS AI Security Best Practices, Cloud Secure AI Fundamentals) together with AI Compliance to assemble framework-aligned evidence.

**Why it matters:** Governance turns the inventory, findings, and runtime history into reviewable evidence.

**Success criteria:** Evidence is available for security, governance, and compliance stakeholders. See [AI SPM](/_docs/docs/applications/ai_spm) and [AI Compliance](/_docs/docs/applications/ai_compliance).

## What to secure first on AWS[​](#what-to-secure-first-on-aws)
If you cannot do everything at once, start here — each item maps to a step above:

- Link the AWS account with Bedrock invocation logging on (Steps 1–2).
- Run discovery and build the Bedrock inventory (Step 1).
- Enable the AWS AI Security Best Practices posture framework and triage Bedrock findings (Step 3).
- Put your highest-value Bedrock runtime endpoints behind AI Runtime (Step 6).
- Pentest those endpoints with a framework template before launch (Step 5).

## Common scenarios and what to do[​](#common-scenarios-and-what-to-do)

- **A new AWS account is onboarded.** Link the account with Bedrock logging on, run discovery, and review the Bedrock inventory (Steps 1–2).
- **Shadow Bedrock usage shows up in invocation logs.** Confirm ownership of the foundation models inferred from logs and bring them under posture review (Steps 2–3).
- **AI SPM flags an unencrypted Bedrock agent or an agent with no guardrail.** Triage the finding, assign an owner, and remediate by attaching a guardrail or a customer-managed KMS key (Step 3).
- **A production Bedrock endpoint needs protection.** Register it as an LLM endpoint and put it behind AI Runtime, binding policies to its endpoint identifier (Step 6).
- **Pentest a Bedrock endpoint before launch.** Register the endpoint and apply a framework scan template; optionally enable active runtime policies during the scan (Step 5).
- **Escalate a material runtime finding.** Investigate the session in AI Investigation and open or attach an AI Incident (Step 8).

## Best practices[​](#best-practices)

- Prefer an assumed role over long-lived AWS access keys for Bedrock endpoints.
- Keep Bedrock invocation logging on so foundation-model usage stays visible.
- Treat AI SPM Bedrock findings as an owned queue, prioritized by production exposure and data sensitivity.
- Stage AI Runtime enforcement: start by observing traffic, then tighten policies before enforcing broadly.
- Close the loop — route material findings into AI Incidents and assemble evidence in AI Compliance.
[PreviousAI Investigation Handbook](/_docs/docs/handbooks/ai_investigation_handbook)[NextGraphQL API Reference](/_docs/docs/)- [What this handbook is for](#what-this-handbook-is-for)- [Key idea: AWS expands the AI attack surface](#key-idea-aws-expands-the-ai-attack-surface)- [Operating model (recommended)](#operating-model-recommended)[Step 1: Discover and inventory the AWS AI environment](#step-1-discover-and-inventory-the-aws-ai-environment)- [Step 2: Discover foundation-model usage from invocation logs](#step-2-discover-foundation-model-usage-from-invocation-logs)- [Step 3: Review posture in AI SPM](#step-3-review-posture-in-ai-spm)- [Step 4: Review identities and data access](#step-4-review-identities-and-data-access)- [Step 5: Pentest with AI Red Team](#step-5-pentest-with-ai-red-team)- [Step 6: Protect runtime traffic with AI Runtime](#step-6-protect-runtime-traffic-with-ai-runtime)- [Step 7: Govern MCP and tool exposure](#step-7-govern-mcp-and-tool-exposure)- [Step 8: Evaluate and investigate](#step-8-evaluate-and-investigate)- [Step 9: Govern and document compliance](#step-9-govern-and-document-compliance)- [What to secure first on AWS](#what-to-secure-first-on-aws)- [Common scenarios and what to do](#common-scenarios-and-what-to-do)- [Best practices](#best-practices)
