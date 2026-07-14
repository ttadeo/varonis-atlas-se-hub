---
title: AI Third-Party Risk Management
url: https://prod.alltrue-be.com/_docs/docs/applications/ai_tprm
section: applications
---

# AI Third-Party Risk Management

- [](/_docs/)- Applications- AI Third-Party Risk ManagementExport PDFOn this page# AI Third-Party Risk Management
Use the AI Third-Party Risk Management (AI TPRM) application to manage AI risk introduced through your supply chain. Because you rely on third-party vendors whose products and services may embed AI, you need a way to review how vendors use AI, evaluate their exposure and risk posture, collect AI-BOM and policy evidence, and track remediation. AI TPRM augments your existing third-party risk processes with an AI-specific lifecycle: you onboard a vendor, run internal and external exposure and risk surveys, capture AI-BOM and policy evidence, score risk, approve or reassess on a cadence, and remediate any issues that surface along the way.

AI TPRM lives under **AI TPRM** in the Applications navigation. Access requires the AI TPRM tier-3 entitlement plus the AI TPRM permission families that map to each sub-area (Dashboard, Vendors, Vendor Onboarding, Policies, Issues, and Report). Users without the entitlement or the relevant permission do not see the menu item.

## Dashboard[​](#dashboard)
The Dashboard gives you a top-level view of vendors under review and the AI risk they introduce. You can see the state of each review, the AI technologies in use across your supply chain, an aggregate risk profile, and progress on outstanding remediation work. The widgets include:

- **Vendor statistics.** The total number of vendors being reviewed, with a breakdown by category of the type of AI introduced through the third party. Vendor counts are also broken down by stage of the review process.
- **Aggregate risk profile.** A risk matrix with exposure risk on one axis and consequence risk on the other. Each cell shows the number of vendors mapped to those two dimensions.
- **Top remediation issues.** The highest-severity remediation items that are currently open. For details, navigate to the Issues section.
- **Issue breakdown.** Open issues grouped by severity.
- **Assessment progress.** Active assessments broken down by evaluation topic within the validation workflow and by stage. This helps you identify bottlenecks and track outstanding work items.
- **Vendors over time.** The number of vendors managed within AI TPRM over a rolling window, so you can see how your third-party AI footprint is trending.
- **Technologies used.** AI technologies discovered by analyzing vendor AI-BOM uploads, along with the number of vendors using each technology and its approval status. This gives you visibility into which AI technologies are being adopted through your supply chain.

## Vendors[​](#vendors)
The Vendors section is where you create new vendor AI assessments and manage assessments that are already in flight. From the Vendors table you can search and filter by status, add a new vendor, edit or delete a vendor, open the vendor detail drawer, jump into the internal review or the vendor-facing review, access the vendor's AI inventory if an AI-BOM has been uploaded, and start a reassessment.

To onboard a new vendor:

- From the Vendors table, click **Add Vendor**.
- Fill in the onboarding form:

**Master vendor** — select an existing master vendor or create a new one.
- **Project** — the project or product context in which you use this vendor.
- **Category** — the vendor category that determines which risk and requirement templates apply.
- **Internal owner** — the person inside your organization who owns this vendor relationship.
- **Vendor contact email** — the external vendor contact who will be invited to complete the vendor-facing surveys.
- **Importance tier** — the vendor's tier, which drives the default reassessment frequency.
- **Audit frequency** — how often the vendor must be reassessed.
- **Due date** — when the current assessment is due.

- Submit the form. The system creates the vendor audit and hands off to the Internal Exposure Survey, which the internal owner completes to start the assessment.

## Vendor Detail[​](#vendor-detail)
Open a vendor from the Vendors table to see the vendor detail drawer. The drawer has two tabs:

- **Info** — the vendor overview card (owner and contact, audit frequency, project usage, AI-BOM status and resource count, vendor agreement status), the assessment timeline showing where the vendor is in the lifecycle, links into the survey experiences, an action to upload the signed vendor agreement, and an action to generate a per-vendor PDF report summarizing the current state of the assessment.
- **Issue List** — the issues that have been opened against this vendor's assessment.

The timeline refreshes as the vendor and the internal owner complete each stage of the lifecycle, so you can return to the drawer at any time to see current progress.

## Assessment Lifecycle[​](#assessment-lifecycle)
Each vendor assessment moves through a fixed set of stages:

- **Internal Exposure Survey.** The internal owner answers exposure questions about how your organization uses the vendor and what AI is involved. Answers map to risk levels and tags.
- **Internal Risk Survey.** The internal owner provides evidence against the requirement categories that apply to this vendor's category, optionally using document analysis suggestions.
- **External Exposure Survey.** The invited vendor contact answers exposure questions about how their product or service uses AI.
- **External Risk Survey.** The invited vendor contact provides their AI-BOM upload and answers vendor-facing requirement questions, optionally attaching supporting documentation.
- **Ready for Approval.** All surveys are complete and the assessment is ready for internal sign-off.
- **Approved.** The vendor has been accepted at the current risk level. The vendor remains in the Approved state until the next reassessment is due.

When a reassessment cycle starts, the lifecycle repeats from the Internal Exposure Survey and previous completed rounds are preserved on the timeline.

Invited vendor contacts authenticate to complete their assigned survey links. If a vendor contact reaches a survey link without an active session, the system redirects them to a no-access page so that only the assigned contact can respond.

## Risk and Requirement Analysis[​](#risk-and-requirement-analysis)
Exposure surveys are structured as yes/no questions. As the respondent answers, the system maps responses to risk levels and tags so that the resulting risk picture is visible in real time. The respondent can save progress at any point and submit when complete.

The risk survey breaks requirements into categories. For each category you can see the question count, the number of questions answered, and the overall progress. Each question can be answered manually with a free-text response and optional file attachments, or it can be answered using **document analysis**:

- Upload a policy document or other supporting evidence.
- The system analyzes the document and proposes a suggested response for each relevant question.
- For each suggestion, you can choose **Use** to accept it as-is, **Amend** to edit before saving, or **Ignore** to dismiss it and answer manually.

Question history is preserved, so you can see prior answers and supporting attachments when revisiting a question.

## AI-BOM[​](#ai-bom)
The vendor's AI Bill of Materials (AI-BOM) is the structured inventory of AI components in the vendor's product or service. AI TPRM expects an AI-BOM JSON file as part of the External Risk Survey. When the vendor contact uploads the AI-BOM:

- The system parses the BOM and creates vendor resources for each component.
- Components are mapped to resource and technology types so that you can see what AI is in use across the vendor's offering.
- The Dashboard and the vendor inventory views aggregate these resources and technologies.

From the vendor inventory you can drill down into an individual vendor resource to review its metadata, set or update review status, see and update the status of any issues opened against the resource, and delete a resource that is not in scope. Technologies have their own drill-down so you can see every vendor resource that maps to a given technology.

The AI TPRM workflow requests an AI-BOM JSON file and links the parsed resources into the vendor's inventory. For details on how vendor AI-BOM resources relate to the broader AI Inventory model, see [AI Inventory](/_docs/docs/applications/ai_inventory).

## Policies[​](#policies)
The Policies section governs how often vendors must be reassessed. Vendor tiers determine the default reassessment cadence:

- **Tier 1, Tier 2, Tier 3, Tier 4** — each tier has its own reassessment frequency. The Policies page shows the current frequency for each tier and the number of vendors associated with that tier.
- **Vendor-specific exceptions** — when a particular vendor needs a different cadence than its tier default, you can set a per-vendor override. Overrides are listed alongside the tier defaults so you can see exactly which vendors deviate from the standard cadence.

When a vendor is due for or overdue for reassessment, you can open the vendor and click **Start Reassessment** to launch a new assessment round. The reassessment uses the current owner, contact email, category, and due date, which you can confirm or change as you start the round.

## Issues[​](#issues)
The Issues section is where you manage AI risk issues that surface during vendor assessments. Issues have **Open Issues** and **Closed Issues** tabs and a search box. You can filter by vendor, category, owner, severity, and status, and sort by severity, due date, or status.

Open an issue to see the issue detail drawer. From the drawer you can:

- Update the issue's status as remediation progresses.
- Use **Create Incident** to escalate the issue into the incident workflow when an open issue warrants formal incident handling.
- Add a remediation comment. When the remediation is tied to a specific requirement question, the comment records evidence that the system associates back with the related survey question, so the question history reflects the remediation activity.

Each issue is directly linkable, so you can share a URL that opens the corresponding issue drawer.

## Report[​](#report)
The Report section provides a CSV export of TPRM issue history across all vendors so you can audit issue activity or share it with external stakeholders. The Report page exports issue-level history.

This is distinct from the per-vendor **PDF report** generated from the Info tab of the Vendor Detail drawer, which summarizes the current state of a single vendor's assessment.

## Related Pages[​](#related-pages)

- [AI Inventory](/_docs/docs/applications/ai_inventory) — how vendor AI-BOM resources and technologies relate to the broader AI Inventory model.
- [AI 360](/_docs/docs/applications/ai_360) — unified risk rollups that include AI TPRM vendor and issue signals.
- [AI Compliance](/_docs/docs/applications/ai_compliance) — distinguishing internal compliance audits from third-party AI vendor assessments.
[PreviousAI Incidents](/_docs/docs/applications/ai_incidents)[NextAdmin Console](/_docs/docs/admin_console/)- [Dashboard](#dashboard)- [Vendors](#vendors)- [Vendor Detail](#vendor-detail)- [Assessment Lifecycle](#assessment-lifecycle)- [Risk and Requirement Analysis](#risk-and-requirement-analysis)- [AI-BOM](#ai-bom)- [Policies](#policies)- [Issues](#issues)- [Report](#report)- [Related Pages](#related-pages)
