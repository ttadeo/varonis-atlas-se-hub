---
title: Atlas SIEM and Service Management Integrations — Splunk, ServiceNow, Datadog
url: https://prod.alltrue-be.com/_docs/docs/platform_services/integration
section: platform_services
---

# Atlas SIEM and Service Management Integrations — Splunk, ServiceNow, Datadog

Atlas integrates with existing security and service management tools so that AI issues and incidents flow into the workflows organizations already use. This means security teams don't have to operate a separate interface for AI risk — Atlas findings surface in the same places they manage all other security issues.

## Outbound Integration Overview

Atlas supports outbound integration to three categories of external systems:

- **SIEM systems** — Issues can be sent to Splunk or other SIEM platforms for correlation with other security events
- **Service Management systems** — Incidents can be exported to ServiceNow for ticketing and remediation tracking
- **Observability platforms** — LLM Gateway events (prompts and responses) can be forwarded to Datadog's LLM Observability layer

## How Issues Flow to Splunk

Atlas can send Issues to SIEM systems like Splunk as they are generated. When a guardrail rule fires, a new Shadow AI resource is discovered, or a compliance gap is found, the resulting Issue is automatically forwarded to the configured SIEM endpoint.

**Setup process:**
1. Define the Splunk outbound endpoint in the Admin Console — provide the Splunk HEC (HTTP Event Collector) URL and API key
2. At the project level, select which endpoint receives which type of data
3. Atlas begins forwarding issues to Splunk automatically

The SIEM endpoint in Atlas functions as a Splunk HEC endpoint, meaning the configuration is identical to any other Splunk HEC integration — same fields, same format.

## How Incidents Flow to ServiceNow

Atlas distinguishes between **Issues** (automatically generated findings) and **Incidents** (issues that have been elevated to incident status by a security analyst). Incidents can be exported directly to ServiceNow for management.

**Workflow:**
1. A security analyst reviews Issues in Atlas and determines which ones warrant incident-level response
2. From any Issues list, click the three dots and choose "Create Incident" or "Associate Incident" (to add to an existing incident)
3. Atlas creates the incident and — if configured — immediately exports it to ServiceNow
4. From that point, the incident is managed in ServiceNow while Atlas maintains a read-only view

**Setup:**
- Define the ServiceNow integration in the Admin Console
- In AI Incidents → Configuration, select the project, choose the ServiceNow endpoint, and enable "Send All Incidents"
- This is configured per project, so different teams can route incidents to different ServiceNow instances

## How AI Gateway Events Flow to Datadog

All LLM prompts and responses that pass through the Atlas AI Gateway can be forwarded to Datadog's LLM Observability layer. This gives teams LLM visibility in Datadog without requiring any instrumentation changes to their applications.

**Setup:** Define a Datadog outbound endpoint in the Admin Console and configure the project to send Gateway events to that endpoint.

## Inbound Integration — ZTNA for AI Usage

Atlas also supports inbound integrations, where other systems push data into Atlas. The primary example is ZTNA (Zero Trust Network Access) providers like Cloudflare sending employee AI service access logs to Atlas. This is what powers the AI Usage application — when employees access ChatGPT, Claude, or other AI services through the corporate network, Cloudflare LogPush sends those events to Atlas for monitoring and governance.

## SE Talking Point

> *"If your security team already works in Splunk and ServiceNow, Atlas fits into those workflows. Issues from guardrail violations, shadow AI discoveries, and compliance gaps flow directly to the tools your analysts already use — no new interface to learn for day-to-day triage."*

This is particularly relevant for customers with mature SOC operations who are concerned about adopting yet another point tool. Atlas integrates as a data source into existing workflows rather than requiring a workflow change.
