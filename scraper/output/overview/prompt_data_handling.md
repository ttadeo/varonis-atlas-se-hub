---
title: Atlas Prompt Data Handling — Storage, Encryption, and Access Controls
url: https://internal.varonis.com/atlas-data-handling
section: overview
---

# Atlas Prompt Data Handling — Storage, Encryption, and Access Controls

This document describes how Atlas AI Security stores and handles prompts (including prompts that may contain sensitive data) across the Data Plane and Control Plane.

## Architectural Context

Atlas is architected with a strict separation of responsibilities between two planes:

### Control Plane (Varonis-managed SaaS)

The Control Plane is responsible for orchestration and governance functions:
- Platform configuration and management
- AI inventory and posture management (AI SPM)
- Compliance, GRC, and reporting workflows

**The Control Plane is not an inline data path for customer AI traffic.**

### Data Plane (Customer-owned, deployed in customer AWS account)

The Data Plane is deployed inside the customer's AWS environment (VPC) and is responsible for:
- Runtime AI Gateway / reverse proxy
- Observability and logging of AI interactions (when enabled)
- Guardrail enforcement and runtime controls

---

## Prompt Flow and Storage Behavior

### Runtime Prompt Handling (Data Plane)

When the AI Gateway or SDK is deployed, LLM prompts and responses may be observed and logged within an OpenSearch instance deployed on the Data Plane, depending on customer configuration:

- Observability and logging behavior is **configurable per project** — customers control whether prompts are logged
- Logged runtime data (including prompts and responses) **resides within the customer's Data Plane**
- Varonis does not have access to this data

### Prompts Stored in Alerts and Issues (Control Plane)

Certain prompts may appear in issues or alerts (for example, when a policy violation is raised). In this case:

- Prompts that appear in alerts or issues are **stored in the Control Plane**
- All such stored prompt data is encrypted using **AES-256 encryption at rest**

---

## Encryption Key Management

Atlas supports two options for encryption key management:

1. **BYOK (Bring Your Own Key)** — Customer-managed encryption keys give the customer full control over key rotation and access
2. **Platform-managed keys** — Atlas creates and manages a dedicated key using AWS Key Management Service (AWS KMS)

---

## Access Controls for Stored Prompts

Prompts stored in the Control Plane (as part of alerts or issues) are **not visible to all users by default**:

- Visibility is restricted via **role-based access control (RBAC)**
- Only users explicitly assigned the **"Prompt Reader" role** are permitted to view stored prompt content
- This ensures that even within the same tenant, access to sensitive prompt content is limited to authorized personnel

---

## Upcoming Enhancements

### Endpoint-Level Prompt Logging Controls (April 2026)

Atlas will introduce endpoint-level controls for prompt logging. This allows customers to disable prompt logging entirely for specific endpoints or applications representing highly sensitive AI workloads — more granular than the current per-project setting.

### Azure Data Plane Support (Q2 2026)

Atlas will introduce architectural changes to support Azure-based Data Planes. To enable this:

- The current use of AWS OpenSearch as the observability data lake within the Data Plane will be deprecated
- When prompt logging is enabled (at either the project or endpoint level), prompts will be stored in the Control Plane
- Prompt storage in the Control Plane will leverage the same security controls already in use for alerts and issues:
  - AES-256 encryption at rest
  - BYOK or platform-managed keys via AWS KMS
  - RBAC including the Prompt Reader role

These are planned enhancements that extend existing security controls — they do not alter Atlas's core security model.

---

## SE Talking Points

**"Can Varonis see my prompts?"**
Currently: No — runtime prompts and responses are logged only in the customer's own Data Plane (their AWS VPC). Varonis has no access. The only exception is prompts that appear in policy violation alerts/issues, which are stored in the Control Plane and protected by AES-256 encryption and the Prompt Reader RBAC role.

**"What happens to my data if Atlas processes it?"**
The Data Plane — where all AI traffic flows — is deployed in the customer's own AWS account. Varonis manages the infrastructure but has no exposure to customer data. This is the core architectural guarantee.

**"What about in the future with Azure?"**
In Q2 2026 when Azure Data Plane support launches, prompt logging will shift to the Control Plane — but with the same encryption (AES-256), key management (BYOK/KMS), and access control (Prompt Reader role) already protecting alerts and issues today.
