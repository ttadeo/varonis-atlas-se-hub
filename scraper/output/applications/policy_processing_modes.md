---
title: Policy Processing Modes — Synchronous and Asynchronous Actions
url: https://prod.alltrue-be.com/_docs/docs/applications/policy_processing_modes
section: applications
---

# Policy Processing Modes — Synchronous and Asynchronous Actions

Atlas AI Gateway policy rules process LLM traffic using two distinct processing modes: synchronous and asynchronous. Understanding the difference is essential for configuring policies that balance security enforcement with application performance.

## Synchronous Processing

Synchronous processing means the policy action is evaluated and executed inline with the LLM API call. The request is held by the Gateway until the policy evaluation is complete, and the result of the evaluation determines whether and how the request proceeds.

Policy actions that use synchronous processing:

BLOCK is synchronous. When a BLOCK rule triggers, the Gateway immediately stops the request from reaching the LLM and returns an error or rejection response to the calling application. The LLM never receives the prompt. This happens in real time within the same request lifecycle.

MODIFY is synchronous. When a MODIFY rule triggers, the Gateway rewrites the prompt — for example, redacting PII or removing invisible text — and then forwards the modified version to the LLM. The calling application receives a response as normal, but the LLM only ever saw the sanitized prompt. This also happens inline within the same request.

The tradeoff with synchronous processing is latency. Because the Gateway must evaluate the policy before forwarding the request, there is a small processing delay added to every LLM call. For most enterprise use cases this latency is acceptable, typically measured in milliseconds for simple rules and slightly longer for complex ML-based detection.

## Asynchronous Processing

Asynchronous processing means the policy action is evaluated and recorded out-of-band — separate from the main request/response flow. The LLM call is not held or blocked while the evaluation occurs. The request proceeds to the LLM immediately, and the policy evaluation happens in parallel or after the fact.

Policy actions that use asynchronous processing:

WARN is asynchronous. When a WARN rule triggers, the request is allowed to proceed to the LLM without interruption. The policy violation is recorded as an Issue in Atlas and may generate an alert, but the end user's prompt is not blocked or modified. This gives security teams visibility into what is happening without disrupting user workflows.

LOG operates similarly to WARN — it records traffic for observability and audit purposes without blocking or modifying the request.

The advantage of asynchronous processing is zero latency impact on the application. Because the request is not held for evaluation, the LLM call completes at full speed. This makes WARN and LOG appropriate for monitoring and baselining use cases where enforcement is not yet required.

## Combining Synchronous and Asynchronous Actions

Atlas allows multiple policy actions to be applied to the same guardrail rule simultaneously. A common pattern is to combine a synchronous BLOCK on the input side with an asynchronous WARN on the output side.

For example, a prompt injection detection rule might be configured with BLOCK on Input Guard to prevent the attack from reaching the LLM, and WARN on Output Guard to flag any suspicious content in the LLM's response for review. This gives the security team both enforcement and observability in a single rule.

## Recommended Approach for New Deployments

For organizations deploying Atlas for the first time, the recommended approach is to start with asynchronous WARN rules across all guardrails. This creates a baselining period where the security team can see what AI traffic looks like in their environment without disrupting users. After reviewing the Issues generated during baselining, high-confidence attack vectors such as encoded injection attacks can be escalated to synchronous BLOCK enforcement, while lower-confidence detections remain in WARN mode for continued monitoring.

This phased approach reduces false-positive risk during rollout and improves user adoption of AI governance controls.

## Input Guard and Output Guard

Both synchronous and asynchronous processing apply independently to Input Guard and Output Guard.

Input Guard evaluates and acts on the prompt before it reaches the LLM. Synchronous actions on Input Guard (BLOCK, MODIFY) prevent sensitive data or attack payloads from ever reaching the LLM provider.

Output Guard evaluates and acts on the LLM response before it reaches the calling application. This catches cases where the LLM generates sensitive, harmful, or policy-violating content in its response even when the prompt appeared clean.

Actions can be configured independently on each guard within the same rule. A rule can BLOCK on input and WARN on output, or MODIFY on input and LOG on output, giving fine-grained control over enforcement at each point in the request lifecycle.
