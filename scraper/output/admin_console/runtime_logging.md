---
title: Runtime Logging
url: https://prod.alltrue-be.com/_docs/docs/admin_console/runtime_logging
section: admin_console
---

# Runtime Logging

- [](/_docs/)- [Admin Console](/_docs/docs/admin_console/)- Runtime LoggingExport PDFOn this page# Runtime Logging
Control and configure system-wide logging behavior that automatically applies to prompt sources. The Runtime Logging page lets you set tenant-wide defaults for what AI Runtime captures (prompt content and operational metrics) and optionally allows per-Prompt-Source overrides on top of those defaults.

## Where to find it[​](#where-to-find-it)
Open **Admin Console &gt; System Settings &gt; Runtime Logging**. The page has four tabs:

- **Global** — tenant-wide defaults for Prompt Logging and Operational Metrics Logging. Per-section "Allow Prompt Source Overrides" toggles decide whether the Prompt Source tab can override that section.
- **Prompt Source** — per-resource overrides for individual Prompt Sources. This tab is disabled unless at least one of the Global "Allow Prompt Source Overrides" toggles is on.
- **Data Retention** — customer-configurable retention period for prompt-log data.
- **OTEL Export** — stream masked runtime-log records to an external observability platform that accepts OTLP. See [OTEL Export](#otel-export) below.

## Global tab[​](#global-tab)
The Global tab applies tenant-wide. It exposes two independent sections.

### Prompt Logging[​](#prompt-logging)
Choose one mode for prompt content capture:

- **All** — Store all prompt content including messages, responses, and tool data.
- **Actions Only** — Store prompt content only when a gateway action (block, strip, quarantine, etc.) is taken. Otherwise, content is masked.
- **Issues Only** — Store prompt content only when an issue is created. Otherwise, content is masked.
- **None** — Never store prompt content. All prompt fields are masked. Metadata and request records are still preserved.

A **Mask Sensitive Content** toggle appears below the mode selector. It is disabled when Prompt Logging is set to None (the whole prompt is dropped, so there is nothing to mask). Turn it on to replace detected PII fragments with `[MASKED]` before the prompt is stored; masking only has an effect when the PII guardrail is enabled to produce detections. This control is detailed in the [Mask sensitive content](#mask-sensitive-content) section below.

Turn on **Allow Prompt Source Overrides** to let the Prompt Source tab override this section for individual prompt sources.

### Operational Metrics Logging[​](#operational-metrics-logging)
Choose one mode for operational-metrics capture:

- **All** — Store all operational metrics including latency and token usage.
- **None** — Never store operational metrics.

Turn on **Allow Prompt Source Overrides** to let the Prompt Source tab override this section for individual prompt sources.

## Prompt Source tab[​](#prompt-source-tab)
The Prompt Source tab is where you apply per-resource overrides. The tab is disabled until at least one Global "Allow Prompt Source Overrides" toggle is on.

- Use the searchable Prompt Source selector to pick a prompt source. The list is populated from AI Inventory resources with the LLM gateway capability.
- The page shows the current effective settings for that source, seeded with the Global defaults.
- Click **Customize Logging Settings** to create an override for the source. Set Prompt Logging and Operational Metrics Logging values independently. Sections whose Global override toggle is off are read-only and show the disabled-state message; turn the override toggle on in Global first if you want to change them here.
- When customizing Prompt Logging for a source, the **Mask Sensitive Content** toggle is also available (it is disabled when Prompt Logging is None). It is seeded from the Global Mask Sensitive Content value and can be overridden independently for the source.
- Click **Delete Logging Settings** to remove an override. The source reverts to the Global defaults.

A prompt source inherits Global until an override is created and only diverges in the sections explicitly customized.

## Data Retention[​](#data-retention)
The Data Retention tab controls how long prompt-log data is retained in the platform before automatic purging. Administrators can set the retention period in days to balance compliance requirements, investigation needs, and storage costs.

**Retention period (days)** — Set the number of days prompt-log data is retained. The minimum is 60 days; the maximum is fixed at provisioning time based on your plan and is displayed on the page. Values above the maximum are rejected.

Each night, the platform automatically purges prompt-log data older than the configured retention period. This includes captured prompt content, responses, and operational metrics. Related records (issues, quarantine entries, alert history) are preserved beyond the retention window so security investigations and compliance audits remain intact.

You can adjust the retention period at any time. The change takes effect at the next nightly purge: if you shorten the period, data that now falls outside the window is deleted on that run. Purged data cannot be restored.

## OTEL Export[​](#otel-export)
Use **OTEL Export** to stream your masked runtime-log records to an external observability platform. The platform must accept the OpenTelemetry Protocol (OTLP) over HTTPS — Grafana is one validated destination. What gets exported is the same runtime-log content governed by the masking modes above: prompts, responses, and metadata, masked according to your Runtime Logging settings before they leave the data plane.

To configure it, open the **OTEL Export** tab and set the following:

- **Enable OTEL Export** — Turn export on or off. When off, no records are streamed to the destination.
- **Destination Name** *(optional)* — A label for the destination, for your own reference.
- **Endpoint URL** *(required)* — The OTLP endpoint that receives the records, for example `https://collector.example.com/v1/logs`. The URL must use HTTPS. Do not embed credentials in the URL — supply them as authentication headers instead.
- **Authentication Headers** *(optional)* — Secret HTTP headers, such as an API token, sent with each export request. Entered values are stored securely and cannot be viewed after saving. To rotate one header without affecting the others, edit only that header's value; leave a header's value blank to keep its stored secret.
- **Additional Headers** *(optional)* — Non-secret HTTP headers sent with each export request. Credential headers (for example `Authorization` or `X-API-Key`) are rejected here — provide those as **Authentication Headers** instead.

**Activation timing.** OTEL Export settings sync on an hourly cycle. After you enable or disable export — or change the destination or headers — it can take up to about an hour for the change to take effect. When you enable export, records may not begin arriving at your destination until the next sync completes, so the destination can show no data during that window. This is expected.

## Mask sensitive content[​](#mask-sensitive-content)
When Mask Sensitive Content is on, PII detected by the PII guardrail is replaced with `[MASKED]` in logged prompts (both Original and Modified) **before the prompt is stored**. Surrounding non-PII text is left intact, so context for investigation and audit is preserved.

**Key characteristics:**

- **Requires the PII guardrail to take effect** — Masking replaces PII that the PII guardrail detects. If the PII guardrail is off there are no detections, so nothing is masked. This is a functional dependency, not UI gating — the toggle itself is always shown.
- **Disabled when Prompt Logging is None** — When Prompt Logging is set to None the whole prompt is already dropped, so there is nothing to mask; the Mask Sensitive Content toggle is disabled (greyed out) for this mode rather than hidden.
- **Content masking, not capture-mode masking** — Mask Sensitive Content removes detected PII fragments from the prompt before storage. It does not decide whether the whole prompt is stored (that's the Prompt Logging mode: All / Actions Only / Issues Only / None). It does not apply role-based read-time masking (that's the Prompt Reader role, covered below).
- **Tenant-wide and per-source scope** — The Global tab sets the tenant-wide default. When Allow Prompt Source Overrides is on for Prompt Logging, the Prompt Source tab lets you override Mask Sensitive Content for individual sources.

For example, if Mask Sensitive Content is on and the PII guardrail detects an email address in a prompt, the stored prompt reads: "The user's email is [MASKED]." The surrounding context ("The user's email is") is preserved for audit and investigation, but the detected PII fragment is not persisted.

## How Runtime Logging relates to encryption and role-based masking[​](#how-runtime-logging-relates-to-encryption-and-role-based-masking)
Runtime Logging governs *what is captured and forwarded* from the data plane to the control plane. Once data is stored, role-based masking governs *how the stored content is decrypted and presented* on read. Both layers operate together: the Runtime Logging mode chosen above decides whether prompt content reaches the platform at all; if it does, the role of the user reading it decides what they see.

The platform applies **three forms of masking**:

- **Content masking (Mask Sensitive Content, before store)** — PII detected by the PII guardrail is replaced with `[MASKED]` **before the prompt is stored**. The sensitive fragment is never persisted. This is described in the section above.
- **Capture-mode masking (Prompt Logging mode)** — Decides whether the whole prompt is stored at all. Actions Only and Issues Only mask the entire prompt content unless an action or issue triggers storage; None never stores prompt content.
- **Role-based read-time masking (Prompt Reader role)** — Stored content is decrypted and masked or unmasked based on the reader's role. A user without the Prompt Reader role sees masked text instead of actual prompt content; a user with Prompt Reader sees the stored content (which may already have PII fragments replaced by `[MASKED]` if Mask Sensitive Content was on when the prompt was stored).

For the encryption model and the per-role masking rules, see [Data Encryption and Key Management](/_docs/docs/platform_services/encryption).

## Runtime Logging vs SIEM[​](#runtime-logging-vs-siem)
Runtime Logging and [SIEM](/_docs/docs/admin_console/siem) are independent settings.

- **Runtime Logging** controls what AI Runtime forwards from the data plane to the control plane (prompt content, operational metrics).
- **SIEM** controls how security events generated by the platform are forwarded outward to external security tools.

Both can be enabled at the same time; configuring one does not affect the other.
[PreviousIntegrations](/_docs/docs/admin_console/integrations)[NextLog Sources](/_docs/docs/admin_console/log_sources)- [Where to find it](#where-to-find-it)- [Global tab](#global-tab)[Prompt Logging](#prompt-logging)- [Operational Metrics Logging](#operational-metrics-logging)- [Prompt Source tab](#prompt-source-tab)- [Data Retention](#data-retention)- [OTEL Export](#otel-export)- [Mask sensitive content](#mask-sensitive-content)- [How Runtime Logging relates to encryption and role-based masking](#how-runtime-logging-relates-to-encryption-and-role-based-masking)- [Runtime Logging vs SIEM](#runtime-logging-vs-siem)
