---
title: AI SPM — Library Vulnerabilities, Misconfigurations, and Security Posture
url: https://prod.alltrue-be.com/_docs/docs/applications/ai_spm
section: applications
---

# AI SPM — Library Vulnerabilities, Misconfigurations, and Security Posture

The AI Security Posture Management (AI SPM) application scans AI resources for security vulnerabilities, misconfigurations, and weaknesses. It works in conjunction with AI Inventory — once resources are discovered and added to inventory, AI SPM begins evaluating them automatically.

## Library Vulnerability Scanning (CVE Detection)

AI SPM scans AI libraries and dependencies for known CVEs (Common Vulnerabilities and Exposures). This is the right application to answer the question: *"Do any of our AI Python libraries have known security vulnerabilities?"*

How it works:

1. **AI Inventory** discovers libraries through code repository scanning, dependency file uploads, or manual addition — for example, packages listed in `requirements.txt` such as LangChain, PyTorch, Transformers, or other AI/ML dependencies
2. **AI SPM** evaluates those discovered libraries against known CVE databases nightly
3. **Vulnerabilities** are surfaced with severity ratings (Critical, High, Medium, Low) based on standard CVSS scoring
4. **Issues** are automatically created in Atlas for each library with a detected CVE, with details on the vulnerability and recommended remediation

In the AI Inventory Resource Details page, libraries include a **Vulnerabilities tab** that directly shows all CVEs detected against that specific library version.

## Cloud Misconfiguration Detection

AI SPM also scans cloud-hosted AI resources for security misconfigurations:

- Exposed S3 buckets containing AI models
- Overly permissive IAM roles attached to AI services
- Publicly accessible model endpoints
- Missing encryption on AI data stores

Cloud posture checks run nightly across all linked cloud accounts (AWS, Azure, Google Cloud, IBM WatsonX, Databricks). Findings are shown in the Security Posture Compliance Heatmap — a visual grid with posture checks on one axis and projects on the other.

## Notebook Security Scanning

For data science teams using Jupyter notebooks, AI SPM scans notebooks for:

- **PII exposure** — personal data embedded in notebook cells or outputs
- **Hardcoded secrets** — API keys, credentials, or tokens stored directly in notebooks
- **Notebook vulnerabilities** — known security weaknesses in notebook configurations

## LLM Penetration Testing

AI SPM includes an LLM Pentest module that runs automated adversarial tests against LLM endpoints and AI models. Unlike library CVE scanning (which is passive), pentesting is active — it sends adversarial prompts to the LLM to find exploitable weaknesses before attackers do.

Pentest categories are aligned to OWASP LLM Top 10 and MITRE ATLAS by default. Tests can include:

- Prompt injection vulnerabilities
- Jailbreak susceptibility
- Sensitive information disclosure
- Excessive agency and tool misuse
- Custom adversarial categories defined by the security team

After a pentest completes, Atlas generates a detailed report suitable for auditors, internal security reviews, or sharing with customers.

## How SPM Findings Surface

All AI SPM findings create Issues in Atlas with:

- **Severity rating** (Critical, High, Medium, Low)
- **Affected resource** linked to AI Inventory
- **Remediation guidance**
- **Trend tracking** — drift over time shows whether posture is improving or degrading

Issues are visible in the AI SPM dashboard, the AI Inventory Resource Details page, and aggregated in AI 360 under "Vulnerable AI Resources."

## SE Talking Point

The key question to ask customers:

> *"Do you know if any of the AI libraries your developers are using have known CVEs? What about your Jupyter notebooks — are any of them storing API keys or PII?"*

Most development teams have no automated answer to this. AI SPM provides it automatically, running nightly, across every AI library and resource in inventory.
