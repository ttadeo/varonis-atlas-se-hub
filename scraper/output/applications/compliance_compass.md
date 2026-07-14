---
title: Compliance Compass
url: https://prod.alltrue-be.com/_docs/docs/applications/ai_compliance
section: applications
---

# Compliance Compass

- [](/_docs/)- Applications- AI ComplianceExport PDFOn this page# Compliance Compass
Compliance Compass is the Atlas application area for managing AI compliance end to end. You use it to identify the regulations and frameworks that apply to each AI project, run scoped audits, gather evidence directly inside the Atlas UI, build and approve internal policy documents, track findings, and export compliance issue reports. Throughout this page, "Compliance Compass" refers to the overall workflow and product experience; "Compass" is the short form used in the application menu and for the questionnaire-driven framework-discovery surface.

You access Compliance Compass from the AI Compliance group in the main navigation. The menu exposes six subitems: Dashboard, Audit, Hub, Compass, Issues, and Report. Compliance Compass features require a Tier 3 entitlement, and individual surfaces are gated by AI Compliance permissions covering dashboard access, policies, issues, reporting, and the AI Knowledge Hub. Users without the appropriate role see only the surfaces they are entitled to.

The rest of this page walks through each subitem in the order you typically use them: starting from the Dashboard to understand current posture, moving through Compass to scope frameworks for a project, initiating and completing audits, working policy documents in the Hub and Policy Builder, triaging issues, and exporting reports.

## Dashboard[​](#dashboard)
The Dashboard is the landing page for AI Compliance. It summarizes the current state of compliance work across your projects and provides the entry points for everything that follows.

At the top of the Dashboard you see four counters:

- **Active audits** — audits that have been initiated and have not yet been marked complete.
- **Completed audits** — audits whose work has finished and whose results are available for review and reporting.
- **Audit gaps** — projects that would normally be expected to carry an audit for one or more applicable frameworks, but for which no audit has been initiated.
- **Outstanding remediations** — open compliance issues that still need action.

Below the counters, the Dashboard splits its audit listing into three tabs:

- **Active** — currently in-flight audit projects, with their owner, framework, due date, and progress.
- **Completed** — audits whose work is finished. From this tab, you can download the latest audit report for each completed audit.
- **Gaps** — projects with frameworks you should be auditing but have not started. From here you can jump directly into Audit to initiate the missing work.

The Dashboard also surfaces the **Compliance Heatmap**, a project-by-framework matrix. Each row is a project, each column is a framework that is active for at least one project in scope, and each cell shows the current compliance score as a percentage. Click a cell to drill into the underlying audit or framework configuration for that project.

The heatmap is the fastest way to get a bird's-eye view of where your compliance posture is strong, where it is weak, and where audits have not yet started. Companion posture views are available on the [AI Security Posture Management](/_docs/docs/applications/ai_spm) page, and aggregate compliance rollups appear in [AI 360](/_docs/docs/applications/ai_360).

## Audit[​](#audit)
The Audit area is where you initiate and complete audit work for a specific framework on a specific project.

### Selecting a framework[​](#selecting-a-framework)
Open the **Audit** tab to see a table of supported frameworks. Each row describes the framework and includes attributes such as:

- **Enforcement** — whether the framework is regulatory, voluntary, or operating as a best-practice standard.
- **Penalties** — a short description of the penalties associated with non-compliance, where applicable.
- **Status and deadline** — the current audit status for that framework on the selected project and any deadline derived from the project or framework.

Framework lists are dynamically sourced from the AI Compliance service; the exact set of frameworks visible in the table depends on what is currently supported and what is enabled for your projects.

To start work on a framework, select its row and click **Initiate Audit**.

### Initiating an audit[​](#initiating-an-audit)
When you initiate an audit, you provide:

- The **project** to audit, selected from your existing AI inventory.
- The **owner email** — the team member responsible for completing the audit. They receive a notification when the audit is created.
- The **due date** for completing the audit.

Click **Start Audit Project** to create the audit. The audit immediately appears in the **Active** tab on the Dashboard, and the workflow routes you directly into the in-product risk questionnaire for the new audit. All audit work is performed inside the Atlas UI; you do not need to manage any external project tool to drive the audit.

### Risk questionnaire[​](#risk-questionnaire)
The first step of every audit is a risk questionnaire scoped to the chosen framework and project. The questionnaire shows the questions in groups; as you answer, follow-up questions may appear dynamically based on your previous responses.

The questionnaire supports four modes:

- **Save** — persist partial answers without submitting.
- **Submit** — finalize the questionnaire and continue.
- **Update** — re-open a submitted questionnaire and revise answers.
- **View** — open in read-only mode after submission.

Once you submit the risk questionnaire, the audit transitions into the **Establish Controls** workflow.

### Establish Controls[​](#establish-controls)
Establish Controls is where you work through each requirement for the chosen framework on this audit.

You see the requirements organized by category. Each category displays its overall status and progress, and you can search and filter requirements to focus on what is most relevant. For each requirement, you see a status indicator (for example, not started, in progress, compliant, non-compliant, or not applicable) so you can track work across the audit.

Open a requirement question to see its detail drawer. From the detail drawer you can:

- Provide a typed answer in the response field.
- Upload supporting files directly to the requirement.
- Review **suggested responses** generated from prior audit evidence, your uploaded documents, and processed video interviews.
- Mark the requirement **not applicable** with a justification when it does not apply to your project.
- Navigate between requirements using **Previous** and **Next** controls without leaving the drawer.

When the audit is complete or has reached a state where you want to share results, use the report download action available in Establish Controls to generate the audit report.

#### Evidence[​](#evidence)
Evidence supports your requirement responses with files and analysis. Inside Establish Controls, the Document Analysis surface shows two groups of documents:

- **Required documents** — the documents the framework expects you to provide for the audit, typed by category (for example, policies, procedures, technical specifications).
- **Additional documents** — optional documents you choose to provide to strengthen specific requirement responses.

For each document slot, you can either upload a new file or link an existing approved file from the AI Knowledge Hub. Once a document is attached, the system associates it with the relevant requirement questions so that suggested responses can cite document-backed evidence.

You can refresh the analysis after attaching or replacing documents, and you can remove a document link to detach a file from the audit. Removing a link does not delete the underlying document from the Hub; it only removes the association with this audit.

#### Video Interview Mode[​](#video-interview-mode)
Video Interview Mode lets you collect evidence from live conversations — for example, walkthroughs with engineering owners about how a system handles personal data, or interviews with compliance leads about existing controls.

To use Video Interview Mode for an audit:

- Provide consent for the meeting to be recorded and processed for compliance evidence.
- Create a meeting link from the audit and share it with your interviewee.
- Conduct the interview using the generated meeting link.

After the meeting, the audit shows a meeting record. Once the meeting has been processed, you can open the processed meeting details to see:

- A **summary** of what was discussed.
- **Transcript snippets** anchored to specific moments of the conversation.
- **Requirement insights** — automatically extracted observations tied to specific audit requirements, which then become available as suggested responses inside the requirement detail drawer.

Video Interview Mode is operated entirely from within the Atlas UI; you do not configure or manage any separate conferencing setup to participate in the workflow.

## Compass[​](#compass)
The Compass tab is where you determine which AI compliance frameworks apply to a project. Use it for new projects to scope frameworks from scratch, and for existing projects to re-assess as your AI footprint changes.

### Project selection and starting the questionnaire[​](#project-selection-and-starting-the-questionnaire)
Choose the project you want to assess from the project selector. Compass tracks framework discovery per project, so each project carries its own questionnaire state and framework recommendations.

If the project has never been assessed, click **Start Questionnaire** to begin. If the project has been assessed before, you can open **Edit Details** to revise prior answers and re-run the recommendation.

### Framework-discovery questionnaire[​](#framework-discovery-questionnaire)
The questionnaire asks about the AI use case, the data the system handles, the geographies it operates in, the user population, and other framework-relevant attributes. Your answers are saved as you go, and you can submit them when complete.

When you submit, Compass returns:

- A set of **tags** describing the project's compliance-relevant characteristics.
- **Framework recommendations** based on those characteristics, split into **required** frameworks (those the project should align with) and **suggested** frameworks (additional frameworks worth considering).

### Manage Compliance Frameworks[​](#manage-compliance-frameworks)
From the recommendations, you can enable frameworks for the project. For each enabled framework, configure:

- **Assessment frequency** — how often the framework should be re-evaluated for this project.
- **Justification** — a short note explaining why the framework was enabled or how it applies.

You can deactivate a framework you previously enabled if it no longer applies, and you can update the frequency and justification at any time.

The Compass surface organizes framework policies into three tables:

- **Active frameworks** — frameworks currently enabled for the project, with their compliance status (compliant, non-compliant, in progress) and assessment cadence.
- **Ignored frameworks** — frameworks that were considered and explicitly excluded, with their justification.
- **Available frameworks** — additional frameworks supported by the service that you may choose to enable.

Compass keeps the project's framework selection in sync with the Dashboard heatmap and the Audit tab: enabling a framework here makes it visible for audit initiation, and audits performed against it feed back into the compliance score shown in the heatmap.

## Hub[​](#hub)
The AI Knowledge Hub is where you manage the policy documents that back your compliance posture. Documents in the Hub are the same files you can attach as evidence inside Establish Controls.

The Hub organizes policy documents into four tabs:

- **Approved** — policy documents that have been reviewed and approved for active use. From this tab you can search, sort, download, and archive approved documents.
- **Under Review** — documents awaiting approval. You can replace a document with an updated upload, approve a document to move it into Approved, archive it, or search/sort/download as needed.
- **Required** — policy documents that one or more enabled frameworks expect but that you have not yet provided, grouped by document type, framework, and project. Use this tab to see what is missing and to start filling the gaps.
- **Draft** — generated policy drafts produced by Policy Builder, with their current progress. From here you can refresh a draft, delete a draft you no longer want, or open it to continue building.

### Adding a policy[​](#adding-a-policy)
Click **Add Policy** to bring a document into the Hub. You provide a policy name and choose how to source the document:

- **Upload** an existing file you already maintain.
- **Generate from a template** to start a new Policy Builder draft for a chosen policy type.

In both cases you set the hierarchy and project scope so that the policy applies to the correct part of your organization. If a policy with the same scope already exists, the Hub prompts you to confirm a replacement rather than silently overriding the prior document.

When generating from a template, you also assign the draft an owner and a due date so that responsibility for completing the policy is tracked from the start.

## Policy Builder[​](#policy-builder)
Policy Builder is the workflow that turns a generated draft into an approved policy document. You enter Policy Builder either by adding a new generated policy from the Hub or by opening an existing Draft.

### Scope Policy[​](#scope-policy)
The first step in Policy Builder is **Scope Policy**. Here you answer a short background questionnaire about your organization, the project, the policy's audience, and other attributes that influence the generated content. Your answers auto-save as you progress, so you can leave and return without losing work.

When you have completed the background questionnaire, click **Start Building** to move into the main build experience.

### Build Policy[​](#build-policy)
Build Policy presents the draft as a set of categories of questions. Each category shows its completion status and progress so you can see at a glance how far along the policy is.

Inside a category, open a question to see its detail drawer. For each question you can:

- Edit the response directly.
- Review **suggested responses** based on your background answers, prior approved documents, and audit evidence.
- Use **Amend** to start from a suggested response and revise it.
- Use **Use** to accept a suggested response as-is.
- Use **Ignore** to dismiss a suggestion and provide your own answer.
- Reset a response if you want to start over.

As you complete questions, Policy Builder updates the generated document. You can download the in-progress document at any time. When the policy is ready, mark categories complete and approve the document to move it from Draft into Under Review, and ultimately into Approved once an authorized reviewer signs off.

## Issues[​](#issues)
The Issues tab lists findings raised by audits as **AI Compliance Issues**. Each issue corresponds to a requirement or category that needs remediation.

The issues table shows:

- **Framework** the issue belongs to.
- **Requirement or category** the issue is associated with.
- **Owner** responsible for resolving the issue.
- **Status** of remediation.
- **Severity** assigned to the issue.

You can filter the table by any of these fields to focus on what matters to you right now — for example, all critical open issues for a given framework, or all issues owned by a specific team member.

Click an issue to open its detail drawer, which exposes two tabs:

- **Information** — full description of the issue, the originating requirement, and the related context.
- **Related incidents** — incidents linked to the issue, with the ability to create a new incident or link an existing one. Linked incidents make it easier to coordinate compliance remediation with operational incident response. For broader incident context, see [AI Incidents](/_docs/docs/applications/ai_incidents) when available.

From the detail drawer, you can:

- Open the originating audit or requirement question to investigate further.
- Post a remediation comment summarizing the action taken or planned.
- Create a new incident from the issue, or link the issue to an existing incident.

Resolving issues here is what drives the **outstanding remediations** counter on the Dashboard back down.

## Report[​](#report)
Use the Report tab to export the current set of AI Compliance issues. The Report module exposes a CSV export of the compliance issues view so that you can share findings with stakeholders, archive them, or feed them into another reporting tool.

The Report tab in AI Compliance is scoped to the issues export described above. Broader narrative reports — for example, the per-audit report download — are produced from inside the audit workflow itself (see **Establish Controls** above) rather than from the Report tab.

## Related pages[​](#related-pages)

- [AI 360](/_docs/docs/applications/ai_360) — aggregate AI security, compliance, and posture overview.
- [AI Security Posture Management](/_docs/docs/applications/ai_spm) — posture views that overlap with the Compliance Heatmap.
- [AI Third-Party Risk Management](/_docs/docs/applications/ai_tprm) — adjacent governance workflows for vendor and third-party risk.
- [GUI Navigation](/_docs/docs/overview/gui_navigation) — navigation reference for the AI Compliance menu group and the Compass short menu label.
[PreviousSession Policies](/_docs/docs/applications/ai_monitor/session_policies)[NextAI Red Team](/_docs/docs/applications/ai_red_team)- [Dashboard](#dashboard)- [Audit](#audit)[Selecting a framework](#selecting-a-framework)- [Initiating an audit](#initiating-an-audit)- [Risk questionnaire](#risk-questionnaire)- [Establish Controls](#establish-controls)- [Compass](#compass)[Project selection and starting the questionnaire](#project-selection-and-starting-the-questionnaire)- [Framework-discovery questionnaire](#framework-discovery-questionnaire)- [Manage Compliance Frameworks](#manage-compliance-frameworks)- [Hub](#hub)[Adding a policy](#adding-a-policy)- [Policy Builder](#policy-builder)[Scope Policy](#scope-policy)- [Build Policy](#build-policy)- [Issues](#issues)- [Report](#report)- [Related pages](#related-pages)
