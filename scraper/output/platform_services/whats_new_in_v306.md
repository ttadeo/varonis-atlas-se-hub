---
title: What's New in V3.0.6
url: https://prod.alltrue-be.com/_docs/docs/platform_services/306
section: platform_services
---

# What's New in V3.0.6

- [](/_docs/)- Release Notes- What's New in V3.0.6On this page# What's New in V3.0.6
Release Date: April 5, 2025

## Compliance Knowledge Hub[​](#compliance-knowledge-hub)
The knowledge hub stores documents and policies required for compliance and governance automation and serves as a RAG system for the built-in AI agents. The system is able to create evidence from the documents in the hub automatically. Features include:

- Managing Documents from within the UI
- Generating Documents via templates

## LLM Quarantine[​](#llm-quarantine)
Centrally manage sanctioned and unsanctioned access to LLMs. Features include:

- Quarantine Policy - Under AI Usage you can turn on the quarantine policy. At that point any access to the LLM through the AI Gateway will be blocked.
- Quarantine API - Call the quarantine API from third-party systems, using the TRiSM hub as your central control point for LLM access.
- Integration with Kong Konnect - The quarantine API can be called from a plugin for the Kong Konnect AI Gateway.

## Pentest Customization[​](#pentest-customization)

- Customer Categories: Create your own groups of tests called "categories." You can either start by cloning an existing one, or start from scratch.
- Template-specific Categories: Create categories that can only be used by individual templates.
- Custom test cases: In addition to the pre-loaded test cases, you can add/remove/change any test case in any category (either those loaded by us or a custom category).
- Customized evaluation mechanisms: You can either accept the system's default evaluation, or configure your own from a set of configurable strategies. For example, you can define a prompt for an LLM to act as a judge which will evaluate dynamically.

## Pentest Result Comparisons[​](#pentest-result-comparisons)
Compare results from up to five pentest results side-by-side. You can compare different runs (at different times) for the same LLM, scans on different LLMs or any combination of scans that need to be compared.

## Guardrails Enhancements[​](#guardrails-enhancements)
Code Injection/Generation and Code Leakage guardrails can now be evaluated using an LLM rather than models and you can set the strictness of the LLM evaluation depending on your sensitivity level to false positives.

## Project Metadata and Attachments[​](#project-metadata-and-attachments)
Each project has supporting metadata; these are used in various reports.
[PreviousWhat's New in V3.0.7](/_docs/docs/platform_services/307)[NextWhat's New in V3.0.5](/_docs/docs/platform_services/305)- [Compliance Knowledge Hub](#compliance-knowledge-hub)- [LLM Quarantine](#llm-quarantine)- [Pentest Customization](#pentest-customization)- [Pentest Result Comparisons](#pentest-result-comparisons)- [Guardrails Enhancements](#guardrails-enhancements)- [Project Metadata and Attachments](#project-metadata-and-attachments)
