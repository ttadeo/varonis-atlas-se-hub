---
title: Atlas FAQ — AI SMEs (Deep Technical FAQs for AI Architects)
url: https://internal.varonis.com/atlas-faq
section: faq
---

# Atlas FAQ — AI SMEs (Deep Technical FAQs for AI Architects)

## Control Plane and Data Plane

### Data Plane Questions

**Q: Are AI Gateway and Observability part of the data plane?**
A: Yes. The AI Gateway (NGINX reverse proxy) and the Observability layer (OpenSearch instance) both reside on the data plane, which is deployed in the customer's own AWS environment (VPC). Varonis manages the infrastructure but the customer's data never leaves their environment.

**Q: Is proxy configuration the only way to deploy the AI Gateway?**
A: No. In addition to the proxy, Atlas offers:
- **Python SDK** — for customers who cannot use a proxy (integrates directly into application code)
- **Existing API Gateway integration** — customers with Kong or Apigee can configure their gateway to call the Atlas firewall APIs directly
- **Proxy chaining** — supported for customers with multi-layer proxy architectures
- **SDK in existing API Gateway flow** — the SDK can be integrated into a customer's own API Gateway

**Q: Can Atlas integrate into CI/CD pipelines for security gating during pull/merge/build stages?**
A: Yes. Atlas offers a GitHub Action and an Azure DevOps Task Extension for integrating LLM Endpoint Pentesting and Model Scanning into CI/CD pipelines. Additionally, the entire platform is API-driven, so any UI action can be replicated through custom API scripts.

**Q: What customer data will the data plane collect and store?**
A: If the AI Gateway is deployed, any LLM activity traversing it will be logged in the Observability layer (deployed in the customer data plane). This includes LLM inputs/outputs and Guardrail actions that have fired.

**Q: Is the data plane collecting any customer sensitive data?**
A: Depends on configuration. If the AI Gateway has been deployed and sensitive data is present in inputs/outputs, those may be logged in the observability layer. This is controlled through AI Observability → Configuration. There is a setting per project — select your project and scroll to the Gateway/Firewall section. You can configure what gets logged and at what log level. Log events reside within the data plane, which is deployed inside the customer's organization for this very reason.

**Q: What type of data is forwarded from the data plane to the control plane?**
A: Rules are processed by the rules orchestrator on the control plane, which means it does receive LLM input/output data — but this data is never persisted. Over the coming months, the architecture will change so that all rules processing takes place on the customer data plane, eliminating this data path entirely.

**Q: What is the data retention threshold/limits on the data plane?**
A: By default, the retention policy for the observability layer is 3 months in the index and 6 months in S3 files. Customers may request their specific retention policy to be modified (more or less).

**Q: Can customers deploy multiple data planes?**
A: Yes. Customers can deploy multiple data planes for regional needs to keep traffic and observability close to where data and users reside. This is valuable for global enterprises with data residency requirements.

### Control Plane Questions

**Q: What type of data goes directly to the control plane?**
A: The control plane handles most functions not related to the AI Gateway (proxy) and Observability layers. Control plane performs:
- AI Inventory scanning
- SPM scanning including pentesting
- GRC services including compliance audits and TPRM functions
- Integrations with SIEMs like Splunk and ServiceNow

In the case of the AI Gateway, if Guardrail policies are active, LLM activity is sent to the control plane for evaluation by the rules orchestrator — but this data is not stored in any way.

**Q: Is the control plane responsible for configuring and managing all data plane components?**
A: Yes. All functions are managed from the control plane. There is no separate management interface for the data plane that is accessible to customers.

**Q: What is the data retention threshold/limits on the control plane?**
A: There is no customer-configured retention limit on the control plane.

---

## Guardrails (Architect-Level)

**Q: Does the LLM Gateway introduce latency?**
A: Yes. BLOCK and MODIFY (Redaction) actions introduce latency because Atlas must wait on a verdict before allowing or blocking the request. WARN and LOG actions are asynchronous and introduce no latency. The amount of latency for blocking/redaction is impacted by the number of guardrails configured and the complexity and token size of the prompt.

**Q: How does runtime protection work technically?**
A: Atlas deploys an NGINX reverse proxy (via Docker), the Guardrails SDK, or a plugin to an existing API gateway such as Kong or Apigee. The proxy intercepts all LLM traffic and applies configured guardrail rules before forwarding to the LLM endpoint.

**Q: What LLM providers can be used for guardrails/evaluations?**
A: Customers can choose from a curated set of providers, including Bedrock, OpenAI, or Azure OpenAI (as configured under Admin). This is the "judge" LLM used by the AI Monitor for evaluating outputs.

---

## Compliance / Governance / TPRM

**Q: What are the two pentest modes the platform supports?**
A: Model scanning (artifact-level scanning) and LLM endpoint pentesting (runtime testing via adversarial prompts).

**Q: How does Atlas help orgs stay aligned to MITRE ATLAS?**
A: Atlas maps its AI security controls and findings to the MITRE ATLAS framework, allowing security teams to demonstrate coverage against known adversarial AI tactics and techniques.

---

## General

**Q: How does Atlas detect issues like tool poisoning? What makes an instruction "malicious"?**
A: Detection uses a combination of code-based heuristics and LLM-assisted evaluation for more complex or ambiguous cases. The system applies pattern matching for known attack signatures and uses an LLM-as-a-Judge approach for semantic analysis of prompt content.

**Q: Are there APIs available for advanced integration and automation?**
A: Yes. The entire system is built around APIs and all functionality is accessible via APIs. Atlas exposes both REST and GraphQL APIs. The REST API documentation is at https://prod.alltrue-be.com/_docs/api/openapi and GraphQL documentation is at https://prod.alltrue-be.com/_docs/docs. One example use case: triggering pen testing as a new version of an AI asset is released via CI/CD pipelines.
