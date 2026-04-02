---
title: AI Data Leakage — Real-World Examples and Atlas Prevention
url: https://prod.alltrue-be.com/_docs/docs/applications/data_leakage_examples
section: applications
---

# AI Data Leakage — Real-World Examples and Atlas Prevention

Data leakage through AI tools occurs when sensitive organizational data is transmitted to external LLM providers without authorization or visibility. Atlas addresses this through the AI Gateway proxy and AI Usage monitoring.

## What Is AI Data Leakage

AI data leakage happens when employees or applications send sensitive information to Large Language Models (LLMs). Unlike traditional data loss, AI data leakage is often unintentional — employees are simply trying to do their jobs faster using AI tools.

Common sensitive data types leaked through AI tools include:
- Personally Identifiable Information (PII): names, emails, SSNs, passport numbers
- Credentials and API keys embedded in code or configuration files
- Proprietary source code and business logic
- Financial data: revenue figures, deal sizes, customer contracts
- Healthcare data (PHI) subject to HIPAA regulations
- Legal documents and privileged communications

## Real-World Example: Developer Code Review

A developer at a financial services firm uses an internal AI coding assistant powered by GPT-4 to help debug code faster. They paste a block of internal code into the chatbot to ask for help.

That code contains:
- Database connection strings with credentials
- API keys for a payment processor
- Proprietary trading algorithm logic

Because the coding assistant calls OpenAI's API directly — not through the Atlas AI Gateway — the entire prompt including the sensitive code is transmitted to OpenAI's servers outside the organization's control.

The problem chain:
- No visibility that this happened — the security team has no record
- No policy that could have blocked or redacted the credentials before they left
- No audit trail of which employee sent what data, or how often this occurred

How Atlas prevents this: The Atlas AI Gateway acts as a proxy between the coding assistant and OpenAI. When the developer submits the prompt, the Gateway intercepts it, applies PII and credential detection guardrails, and either redacts the sensitive values (MODIFY action) or blocks the request (BLOCK action) before the prompt reaches OpenAI. An Issue is created in Atlas for the security team regardless.

## Real-World Example: ChatGPT for Document Summarization

An HR manager copies and pastes employee performance reviews into ChatGPT to generate summaries. The documents contain employee names, salaries, medical accommodation requests, and disciplinary history.

This data is now in OpenAI's systems, potentially used for model training, and violates the organization's data handling obligations under GDPR and HIPAA.

How Atlas prevents this: The AI Usage application detects that the HR manager is accessing ChatGPT (an unsanctioned or consumer-tier AI service) via ZTNA telemetry. The security team can quarantine or block access to consumer ChatGPT while ensuring the organization's sanctioned AI tools route through the Atlas AI Gateway where guardrails enforce PII detection on all prompts.

## Real-World Example: Sales Rep Using AI for Proposal Writing

A sales representative uses an AI writing tool to draft a customer proposal. They paste in deal information including the customer name, contract value, discount structure, and competitive positioning notes.

If the AI writing tool calls an external LLM directly, this confidential deal information leaves the organization's environment without any logging or enforcement.

How Atlas prevents this: The AI Gateway logs all prompts and responses passing through it. Even if a BLOCK or MODIFY action is not triggered, the security team has a complete audit trail of what data was sent to which LLM endpoint, by which application, and when. The AI 360 dashboard surfaces this as a risk finding.

## How Atlas Detects and Prevents Data Leakage

Atlas addresses data leakage through two complementary mechanisms:

The AI Gateway provides inline protection by sitting between applications and LLM endpoints. Every prompt passes through the Gateway before reaching the LLM. Guardrail rules inspect the prompt for PII, credentials, sensitive topics, and other policy violations. The Gateway can block the request, modify it by redacting sensitive content, or log it for review — all before data leaves the organization's environment.

The AI Usage application provides discovery and governance by monitoring which AI services employees access via ZTNA integrations. This catches data leakage through consumer AI tools that bypass the Gateway entirely — like an employee using their personal ChatGPT account on a corporate network.

## Key SE Talking Points

The developer did not do anything malicious — they were trying to be productive. The gap is that there was no control between them and the LLM. Atlas sits in that gap without disrupting the workflow.

The key question to ask customers: Do you know what your developers, sales reps, and HR team are pasting into AI tools today? Most CISOs answer no. That is the problem Atlas solves.

For regulated industries such as financial services, healthcare, and legal, this is not just a security concern — it is a compliance obligation. Atlas provides the audit trail and enforcement controls that regulators require.
