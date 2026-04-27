---
title: AI Usage
url: https://prod.alltrue-be.com/_docs/docs/applications/ai_usage
section: applications
---

# AI Usage

- [](/_docs/)- Applications- AI UsageOn this page# AI Usage
The AI Usage application helps you manage which AI services your employees use. Get a complete view of all services being used, by whom, from which applications, and how frequently. Manage sanctioned and unsanctioned use of AI services and LLMs. Use this to ensure that unsanctioned AI services are not used and, if you have placed additional security controls on these AI services, that those controls are not bypassed. The system collects usage information from ZTNA systems to determine what is being accessed within the organization, then compares it with curated lists of AI services around the world. Certain integrations pull usage data from other applications such as Microsoft Copilot. Finally, you can manage access to LLMs through the built-in AI Runtime Protection or through third-party AI gateways by sanctioning or unsanctioning access to LLMs and quarantining the use of certain LLMs.

## Dashboard[​](#dashboard)
View all AI services you consume over the Internet from AI service providers, plus LLMs you consume that are monitored by the observability layer (the AI Runtime Protection).

Select the Overall Dashboard or a specific dashboard such as the OpenAI dashboard or the Microsoft Copilot dashboard. Specify additional filters to control what data is displayed.

Toggle between views by users or applications in the various widgets.

## Users[​](#users)
Use the users list to see all users accessing AI services, with a breakdown of which AI services they are using. For each user, hover your mouse over the "# GenAI App" blue text to see a tooltip listing the services used.

## Policies[​](#policies)
Define which AI services are sanctioned and which are unsanctioned. For each item, click View in Inventory to get more details.

## Quarantine Policy for LLM Endpoints[​](#quarantine-policy-for-llm-endpoints)
The LLM Endpoint Quarantine Policy allows you to control which LLM endpoints are permitted for use across your organization. This policy is managed from the AI Usage policies page, where you can toggle the policy on or off and manage the sanction status of individual LLM endpoints.

### Policy Controls[​](#policy-controls)

- **Enable/Disable Policy**: Use the toggle at the top of the AI Usage policies page to activate or deactivate the quarantine policy.
- **Manage Endpoint Status**: Use the list view to mark LLM endpoints as **sanctioned** (approved) or **unsanctioned** (blocked).
- **Inventory Integration**: The sanction status of an LLM endpoint is directly tied to its **Approved / Unapproved** review status in your AI Inventory. Only approved resources can be sanctioned for use.

### Enforcement Behavior[​](#enforcement-behavior)
When the quarantine policy is **enabled**, all incoming LLM requests are evaluated through the Quarantine Status Checking API:

- Any request referencing an **unsanctioned** LLM endpoint (by identifier, API key, or request headers) will be **blocked**.
- Only requests matching a **sanctioned resource** managed within the Varonis platform will be allowed.

### API: Check LLM Endpoint Quarantine Status[​](#api-check-llm-endpoint-quarantine-status)
**Endpoint**:

`POST /v1/ai-usage/quarantine/llm-endpoint`

This API checks whether an LLM endpoint is **sanctioned** (allowed) or **unsanctioned** (blocked), based on its identifier, API key, or API request metadata.

#### Request Parameters (JSON Body)[​](#request-parameters-json-body)
FieldTypeDescription`endpoint_identifier`stringIdentifier associated with a known LLM endpoint`api_key`stringAPI key registered with the LLM endpoint`llm_api_request`objectOriginal request metadata used to resolve provider and headers
**llm_api_request Object Fields**

- `provider` (string): Name of the LLM provider (e.g., OpenAI, Google, Anthropic)
- `request_headers` (object): JSON object of original HTTP headers sent with the LLM request

#### Response[​](#response)
Returns whether the endpoint is sanctioned:

```
{
 "sanctioned": true,
 "message": "Optional message if applicable"
}

```
Example responses:

- Sanctioned:

```
{"sanctioned": true}

```

- Unsanctioned:

```
{"sanctioned": false}

```

- With Note:

```
{"sanctioned": true, "message": "Skipped validation due to system issue"}

```
You control which LLMs are sanctioned or unsanctioned by enabling the LLM endpoint quarantine policy and sanctioning/approving LLMs on the AI Usage -&gt; Policies page:

## Issues[​](#issues)
View all issues such as usage of unsanctioned services.

## Report[​](#report)
Use the AI Usage report to search through all AI usage issues, present or past.
[PreviousAI Inventory](/_docs/docs/applications/ai_inventory)[NextAI SPM](/_docs/docs/applications/ai_spm)- [Dashboard](#dashboard)- [Users](#users)- [Policies](#policies)- [Quarantine Policy for LLM Endpoints](#quarantine-policy-for-llm-endpoints)[Policy Controls](#policy-controls)- [Enforcement Behavior](#enforcement-behavior)- [API: Check LLM Endpoint Quarantine Status](#api-check-llm-endpoint-quarantine-status)- [Issues](#issues)- [Report](#report)
