# Atlas Agentic AI Controls

Specialized guardrails for AI agents that interact with external tools, APIs, and multi-step workflows. These controls govern tool selection, parameter validation, behavioral boundaries, plan evaluation, and post-execution reflection to ensure agents operate safely within their authorized scope.

---

## Agent Tool Selection

**OWASP:** LLM06:2025 | LLM01:2025
**MITRE ATLAS:** AML.T0053 | AML.T0067 | AML.T0051

Evaluates whether the model selects the appropriate tool or action for a given request. Helps ensure agents use the correct capabilities — such as retrieval, generation, or computation — based on task intent and context.

**Background:** Agentic AI systems that can invoke external tools must be carefully governed. Incorrect tool selection can lead to unintended data exposure, privilege escalation, or execution of harmful operations. This rule validates that the agent's chosen action matches the user's intent.

---

## Agent Parameter Evaluation

**OWASP:** LLM06:2025 | LLM01:2025
**MITRE ATLAS:** AML.T0069 | AML.T0051

Assesses whether the parameters provided to a selected tool or function are appropriate, valid, and aligned with the user's intent. Ensures that agent actions are executed safely and accurately with correctly specified inputs.

**Background:** Even when the correct tool is selected, manipulated or incorrect parameters can lead to unintended consequences — such as querying the wrong database, modifying unintended records, or escalating privileges. This rule validates parameter integrity before execution.

---

## Malicious Tool Calls

**OWASP:** LLM06:2025 | LLM01:2025
**MITRE ATLAS:** AML.T0053 | AML.T0067 | AML.T0051

Detects and prevents potentially harmful or unauthorized tool invocations by an agent. Identifies attempts to misuse tools — for example, by executing unsafe commands, accessing restricted data, or performing unintended actions — and blocks such calls to maintain system integrity.

**Background:** Agentic AI systems with tool access present a significant attack surface. An attacker who successfully injects a prompt could instruct the agent to invoke destructive tools, exfiltrate data, or perform unauthorized transactions. This rule acts as a critical safety gate.

---

## Inappropriate Agentic Behavior

**OWASP:** LLM06:2025 | LLM01:2025
**MITRE ATLAS:** AML.T0053 | AML.T0067 | AML.T0051

Detects and flags instances where an agent exhibits unsafe, unethical, or unintended behavior. Identifies actions that fall outside the agent's authorized scope — such as defying instructions, performing disallowed tasks, manipulating outcomes, or engaging in harmful conduct.

**Background:** As AI agents become more autonomous, monitoring behavioral boundaries becomes essential. An agent operating outside its intended scope — whether through manipulation or emergent behavior — can cause significant harm. This rule provides behavioral guardrails for agentic workflows.

---

## Agent Tool Quarantine

**OWASP:** LLM06:2025 | LLM01:2025
**MITRE ATLAS:** AML.T0053 | AML.T0067 | AML.T0051

Allows teams to quarantine specific unapproved tools. Prevents the agent from invoking quarantined tools until they are reviewed and reauthorized.

**Background:** In rapidly evolving agentic environments, new tools may be added or existing tools may be found to have vulnerabilities. Quarantining provides a mechanism to immediately restrict access to suspect tools without disrupting the entire agent workflow.

---

## Agent Planning Evaluation

Analyzes an agent's proposed multi-step plan to determine its validity, efficiency, and alignment with available tools. Evaluates whether the plan is logically coherent, uses only approved tools, avoids redundancy, and does not risk resource overload or private data exposure. The rule classifies plans as ideal, valid, or invalid based on tool applicability, task sufficiency, and overall effectiveness.

**Background:** Complex agentic tasks often involve multi-step plans that chain multiple tool invocations together. Evaluating the plan before execution helps catch issues like circular logic, unnecessary data access, or plans that would exceed resource budgets.

---

## Agent Reflection Evaluation

Performs a reflection at the end of a task or reasoning chain to assess whether the final response or system state aligns with the user's intent and complies with security policies. Evaluates the correctness of the solution and identifies potential errors. Can trigger retries or escalate for human review if the reflection indicates unresolved issues or policy risks.

**Background:** Post-execution reflection provides a critical checkpoint for agentic AI. By evaluating the outcome against the original intent and security policies, this rule catches errors, policy violations, or unintended consequences that occurred during the agent's execution.

---

## Why Agentic Guardrails Matter

AI agents — like those built with n8n, LangChain, or similar orchestration tools — can take real-world actions: reading files, querying databases, calling APIs, sending emails. Unlike a simple chatbot that only generates text, an agent with legitimate permissions can cause real damage if manipulated.

The three primary attack vectors against agentic systems:

1. **Prompt Injection** — malicious instructions embedded in documents or tool outputs hijack the agent's behavior
2. **Confused Deputy** — the agent is tricked into misusing its own legitimate permissions on behalf of an attacker
3. **Excessive Autonomy** — the agent takes actions beyond its intended scope without human approval checkpoints

Atlas's Agentic Guardrails address all three by governing tool selection, parameter validation, behavioral boundaries, and post-execution reflection — providing defense at every stage of the agent's execution chain.
