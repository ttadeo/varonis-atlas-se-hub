---
title: Atlas AI Gateway Deployment Options and CI/CD Integration
url: https://internal.varonis.com/atlas-gateway-deployment
section: faq
---

# Atlas AI Gateway Deployment Options and CI/CD Integration

## The Three Ways to Deploy the Atlas AI Gateway

Atlas offers three primary deployment modes for the AI Gateway, depending on the customer's architecture and constraints.

### Option 1: Reverse Proxy (NGINX)

The most common deployment. Atlas deploys an NGINX reverse proxy via Docker inside the customer's AWS VPC (Data Plane). All LLM traffic is routed through this proxy, which applies guardrail rules before forwarding requests to the LLM endpoint.

**When to use:**
- Customer can route application traffic through a proxy
- New deployments with no existing API gateway
- Fastest path to full runtime protection

**How it works:**
- NGINX container deployed in customer environment
- Applications point their LLM endpoint URL to the Atlas proxy URL
- Proxy inspects traffic, applies WARN/BLOCK/MODIFY/LOG actions, then forwards to the real LLM API

---

### Option 2: Python SDK

Atlas provides a Python SDK that integrates directly into the application code. Instead of routing traffic through a proxy, the SDK wraps LLM calls inline.

**When to use:**
- Customer cannot modify network routing to use a proxy
- Development teams prefer library-level integration
- Microservices or serverless architectures where a shared proxy is impractical

**How it works:**
- SDK is imported into the Python application
- LLM calls are wrapped with Atlas SDK calls
- Guardrails are evaluated within the SDK before the LLM request is made

---

### Option 3: Existing API Gateway Integration (Kong, Apigee)

Customers who already have Kong or Apigee as their API gateway can configure it to call the Atlas firewall APIs directly. The Atlas SDK can also be embedded within the customer's existing API Gateway flow.

**When to use:**
- Customer already has a centralized API gateway (Kong, Apigee)
- Enterprise environments with governed API management
- Customers who want to add Atlas as a plugin to existing infrastructure rather than deploying new infrastructure

**How it works:**
- Kong or Apigee is configured to call the Atlas firewall API for each LLM request
- Atlas evaluates the request and returns an allow/block/modify decision
- The API gateway enforces the decision

**Proxy chaining** is also supported for customers with multi-layer proxy architectures.

---

## CI/CD Integration — Automated LLM Endpoint Pentesting

Atlas integrates directly into CI/CD pipelines so security testing happens automatically at build time, not just at periodic review cycles.

### GitHub Action

Atlas provides a native GitHub Action for triggering LLM Endpoint Pentesting as part of a pull request or merge workflow.

**Use case:** Every time a new version of an AI application is deployed, the GitHub Action automatically runs adversarial tests against the LLM endpoint and gates the deployment on the results.

### Azure DevOps Task Extension

Atlas provides an Azure DevOps Task Extension for teams using Azure Pipelines. Same capability as the GitHub Action — trigger pentesting and model scanning as part of build/release pipelines.

### API-Driven Automation (Custom Pipelines)

The entire Atlas platform is API-driven. Every action available in the UI can be replicated through the REST or GraphQL APIs. This means customers using Jenkins, GitLab CI, CircleCI, or any other CI/CD system can trigger Atlas pentesting via custom API scripts.

**REST API docs:** https://prod.alltrue-be.com/_docs/api/openapi
**GraphQL API docs:** https://prod.alltrue-be.com/_docs/docs

---

## Summary: Deployment Option Decision Matrix

| Customer Situation | Recommended Deployment |
|--------------------|----------------------|
| New deployment, can route traffic | NGINX Reverse Proxy |
| Cannot change network routing | Python SDK |
| Already has Kong or Apigee | Existing API Gateway Integration |
| Multi-layer proxy | Proxy Chaining |
| CI/CD on GitHub | GitHub Action |
| CI/CD on Azure DevOps | Azure DevOps Task Extension |
| Custom CI/CD (Jenkins, GitLab, etc.) | Atlas REST/GraphQL API |

---

## SE Talking Points

**"We already have Kong as our API gateway — do we need to deploy another proxy?"**
No. Atlas integrates directly with Kong (and Apigee) so you can add Atlas as a plugin to your existing API gateway without deploying new infrastructure.

**"Can Atlas automatically test our LLM endpoints every time we push a release?"**
Yes. Atlas has native GitHub Actions and Azure DevOps Task Extensions for this exact use case — trigger LLM endpoint pentesting and model scanning as part of your CI/CD pipeline. Every release can be automatically security-tested before it reaches production.

**"What if we can't route traffic through a proxy?"**
Use the Python SDK. It integrates directly into application code and applies the same guardrail rules without requiring any network-level changes.
