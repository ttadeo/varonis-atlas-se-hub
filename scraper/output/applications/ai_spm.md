---
title: AI SPM
url: https://prod.alltrue-be.com/_docs/docs/applications/ai_spm
section: applications
---

# AI SPM

- [](/_docs/)- Applications- AI SPMExport PDFOn this page# AI SPM
Use AI Security Posture Management (AI SPM) to set policies for the security posture of your AI estate, track adherence to those policies, and uncover and remediate vulnerabilities, misconfigurations, and other issues across the AI resources you develop and run.

AI SPM inspects the AI resources that are part of your [discovered AI systems](/_docs/docs/applications/ai_inventory). Once a resource is in inventory, AI SPM begins evaluating it against your posture policies. Different scan types run on different cadences — see [Scan types](#scan-types) below — but for most cloud-configuration and policy-group results you can expect a daily refresh as part of the system ETL. Model, notebook, and dataset scans run asynchronously when you trigger them.

## Dashboard[​](#dashboard)
View vulnerabilities, misconfigurations, and exposed resources for the selected projects or organizations, and drill down into each finding directly from the dashboard. For a cross-policy compliance view, see [AI Compliance](/_docs/docs/applications/ai_compliance), which owns the compliance heatmap UX.

## Scan types[​](#scan-types)
AI SPM covers several materially different scan types. Each scan type focuses on a different class of AI resource, but all of them produce posture results that flow into the same dashboard, issues list, and reports.

Scan typeWhat it scansWhat you seeCloud ConfigurationThe cloud-provider configuration of the AI resources discovered in your AWS, GCP, and Azure accounts.Misconfiguration findings against the Cloud Configuration policy.ModelStandalone AI models registered in inventory — for malware, prohibited operations, suspicious layers, and similar model-file risks.Model scan results in the dashboard and a downloadable per-scan report.Jupyter NotebookNotebooks discovered in inventory — for PII in notebooks, secrets stored in notebooks, and notebook vulnerabilities.Notebook scan findings as posture issues.DatasetDatasets registered in inventory.Dataset scan findings as posture issues.AgenticAgentic AI systems and their tool/agent topology, for agent-specific posture checks.Findings under the Agentic Threats policy.MCP SecurityModel Context Protocol servers and their exposed tools. Cross-links to [AI MCP](/_docs/docs/applications/ai_mcp) for the dedicated MCP surface.MCP posture findings as issues.Resource Hash VersioningApproved-versus-current hashes of AI resources, to detect unauthorized changes since your last approved baseline.Drift findings when a resource changes outside the approved baseline.CVELibrary dependencies of your AI resources, matched against known CVEs.CVE findings as posture issues.Inventory Hygiene (Shadow AI / Unprotected AI)The inventory itself — to flag AI resources that exist outside your governed perimeter (Shadow AI) or that are governed but not protected by runtime controls (Unprotected AI). Cross-links to [AI Inventory](/_docs/docs/applications/ai_inventory).Hygiene findings as issues.
## Policies[​](#policies)
Configure a policy or select from an existing one, then track your posture against it. The Policies page exposes the policy groups that AI SPM evaluates against your inventory — currently:

- **Cloud Configuration** — posture checks against the cloud-provider configuration of your AI resources.
- **Sensitive Data** — The Sensitive Data policy group includes scan-based checks for PII and secrets in notebooks and datasets, and agent governance policies that detect insufficient governance, weak sharing controls, and risky runtime identities involving sensitive data:

**Sensitive Access Uses Shared or Privileged Runtime Identity** — detects sensitive-data reach via a shared or privileged runtime identity, from a declared manifest attestation or an observed dependency-graph posture.
- **Sensitive Data Has Weak Sharing Control Path** — detects sensitive-data reach exposed through a tool with weak sharing controls (public or anonymous links, broad share/move/copy operations, ACL or permission changes).
- **Sensitive Workflow Uses Rejected Tools** — detects a sensitive-data workflow that still carries a tool or MCP server explicitly rejected (NOT_APPROVED) during the agent's governance review.
- **Sensitive Write Access Lacks Approved Governance** — detects write-capable access to sensitive data on an agent whose manifest declares no approval step (never approved, or human-out-of-the-loop).
- **Sensitive Access Lacks Approved Governance** — detects access to sensitive data by an agent whose governance manifest was never approved (missing, draft, in review, or rejected).
- **Sensitive Access Review Expired** — detects access to sensitive data by an agent whose previously-approved governance review has aged past the review window (marked STALE); remediation is re-review, distinct from never-approved.

- **Agentic Threats** — posture checks targeted at agentic AI systems.

For each policy:

- Click **Open** to view adherence to the policy and drift over time. Issues are listed by category, and you can drill into the specific policy details for each item.
- Toggle **Enable** to turn the policy on. Enabling a policy also auto-creates issues for any AI SPM finding that violates it.

## Model scans[​](#model-scans)
Model scans inspect a standalone AI model file for risky properties and capabilities. To run a model scan:

- **Select your model resource** — choose the standalone model you want to scan.
- **Describe the system** — provide a brief description that will appear in the report.
- **Configure scan options** — select which of the following checks to run:

**Code Execution Prohibited** — flag the model if it can execute embedded code at load or inference time.
- **Input-Output Operations Prohibited** — flag the model if it can read from or write to the local filesystem or other I/O.
- **Network Access Prohibited** — flag the model if it can make outbound network calls.
- **Malware Signatures Prohibited** — flag the model if its serialized artifacts match known malware signatures.
- **Custom Layers Prohibited** — flag the model if it contains custom or non-standard layers that can carry arbitrary code.

After the scan completes, view results in the dashboard or download the full report for distribution. Model scans are triggered on demand — they do not run on the daily ETL cycle.

## Issues[​](#issues)
Issues uncovered by AI SPM include vulnerability findings, misconfiguration findings, and scan findings from each of the scan types above. The Issues view stays the single place to triage everything AI SPM is responsible for.

NOTE: If a dependency entry (e.g., `numpy` instead of `numpy==1.23.0`) does not specify a package version, the system will not generate CVEs or list "potential" vulnerabilities for that particular unversioned entry. This is intentional — it prevents flooding teams with a high volume of unconfirmed issues that may not be applicable.

## Report[​](#report)
Use the AI SPM report to search through all AI SPM events, present or past.

## Related applications[​](#related-applications)

- [AI Inventory](/_docs/docs/applications/ai_inventory) — register custom LLM endpoints and other AI resources so AI SPM can evaluate them.
- [AI Compliance](/_docs/docs/applications/ai_compliance) — Compliance Compass and the compliance heatmap that aggregate AI SPM posture data into compliance frameworks.
- [AI MCP](/_docs/docs/applications/ai_mcp) — the dedicated surface for Model Context Protocol servers and the MCP Security scan type.
[PreviousAI Usage](/_docs/docs/applications/ai_usage)[NextAI Runtime](/_docs/docs/applications/ai_gateway)- [Dashboard](#dashboard)- [Scan types](#scan-types)- [Policies](#policies)- [Model scans](#model-scans)- [Issues](#issues)- [Report](#report)- [Related applications](#related-applications)
