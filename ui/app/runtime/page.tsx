"use client";

import { useState } from "react";
import Link from "next/link";
import HelpPanel from "@/components/HelpPanel";

// ─── Types ────────────────────────────────────────────────────────────────────

type SimType = "prompt" | "mcp" | "agent" | "custom";

interface PromptResult {
  simulation_type: "prompt";
  label: string;
  prompt: string;
  status: "sent" | "blocked" | "error";
  response?: string;
  policy_triggered?: string;
  error?: string;
}

interface McpResult {
  simulation_type: "mcp";
  label: string;
  tool_name: string;
  tool_args: Record<string, unknown>;
  tool_result_preview: string;
  user_ask: string;
  risk_type: string;
  status: "sent" | "blocked" | "error";
  response?: string;
  policy_triggered?: string;
  error?: string;
}

interface AgentStepResult {
  step_number: number;
  step_name: string;
  action_label: string;
  prompt: string;
  status: "sent" | "blocked" | "error" | "skipped";
  response?: string;
  policy_triggered?: string;
  error?: string;
}

type AnyResult = PromptResult | McpResult;

type SimResult =
  | {
      simulation_type: "prompt" | "mcp";
      scenario_id: string;
      gateway_endpoint: string;
      prompts_fired: number;
      results: AnyResult[];
      runtime_hint: string;
    }
  | {
      simulation_type: "agent";
      scenario_id: string;
      gateway_endpoint: string;
      scenario_label: string;
      steps_fired: number;
      steps_total: number;
      chain_status: "completed" | "blocked_mid_chain";
      steps: AgentStepResult[];
      runtime_hint: string;
    };

// ─── Scenario Definitions ─────────────────────────────────────────────────────

interface ScenarioDef {
  id: string;
  name: string;
  subtitle: string;
  icon: string;
  description: string;
  risk: string;
  color: string;
  talkingPoints: string[];
  atlasFeatures: string[];
  suggestedQuestions: string[];
}

const PROMPT_SCENARIOS: ScenarioDef[] = [
  {
    id: "healthcare",
    name: "Healthcare",
    subtitle: "Clinical Note Summarizer",
    icon: "🏥",
    description: "LangChain + GPT-4o summarizes patient records. Prompts contain SSNs, MRNs, and PHI — designed to trigger PII guardrails.",
    risk: "PII / PHI Exposure",
    color: "blue",
    talkingPoints: [
      "Atlas detected SSNs, MRNs, and DOB patterns before the LLM ever processed them",
      "The block happened in real-time — zero changes needed to the application code",
      "Clinical staff can still use AI tools — Atlas stops PHI from leaving the environment",
    ],
    atlasFeatures: ["PII / PHI Detection", "Real-time Policy Enforcement", "AI Gateway Proxy"],
    suggestedQuestions: [
      "Can we set different policies per department or use case?",
      "What does the user experience look like when a request is blocked?",
      "How do we tune sensitivity to reduce false positives on clinical abbreviations?",
    ],
  },
  {
    id: "finance",
    name: "Financial Services",
    subtitle: "AI Risk Analyzer",
    icon: "📈",
    description: "Claude 3 analyzes market risk using client account data. Prompts include account numbers, SSNs, and unreleased earnings.",
    risk: "Data Leakage / Insider Risk",
    color: "emerald",
    talkingPoints: [
      "MNPI and client SSNs were caught before reaching the LLM",
      "Every blocked request creates an immutable audit trail in AI Investigation",
      "Atlas protects against both accidental leakage and deliberate insider risk",
    ],
    atlasFeatures: ["PII Detection", "MNPI / Confidential Data Policy", "Audit Trail / AI Investigation"],
    suggestedQuestions: [
      "Does Atlas integrate with our SIEM?",
      "Can we alert the SOC when an analyst sends deal data through AI?",
      "What's the retention period for AI traffic logs?",
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce",
    subtitle: "Recommendation Engine",
    icon: "🛒",
    description: "Azure OpenAI powers product recommendations. Prompts include a prompt injection attack and behavioral data exfiltration.",
    risk: "Prompt Injection / Data Exfiltration",
    color: "violet",
    talkingPoints: [
      "The prompt injection attempt ('Ignore all previous instructions') was detected and blocked",
      "Behavioral data exfiltration — using health purchase history for ad targeting — was also flagged",
      "One policy covers both external attacks and internal misuse",
    ],
    atlasFeatures: ["Prompt Injection Detection", "Behavioral Data Policy", "Content Policy Enforcement"],
    suggestedQuestions: [
      "What injection techniques does Atlas detect beyond simple instruction override?",
      "Can we see a breakdown of blocked vs allowed traffic over time?",
      "How do we handle legitimate system prompt customization?",
    ],
  },
];

interface McpScenarioDef extends ScenarioDef {
  tools: string[];
}

const MCP_SCENARIOS: McpScenarioDef[] = [
  {
    id: "mcp_healthcare",
    name: "Healthcare EHR Agent",
    subtitle: "MCP + EHR Integration",
    icon: "🏥",
    description:
      "AI agent calls read_patient_record and search_appointments MCP tools. PHI is returned in the tool result and injected into LLM context — Atlas intercepts at the tool result layer.",
    risk: "PHI in MCP tool result",
    color: "blue",
    tools: ["read_patient_record", "search_appointments"],
    talkingPoints: [
      "Atlas intercepted PHI at the tool result layer — not just in user prompts",
      "The AI agent never received the patient data because Atlas blocked the MCP response",
      "This is the threat vector most security teams haven't considered yet",
    ],
    atlasFeatures: ["MCP Traffic Inspection", "Tool Result Scanning", "Agentic AI Governance"],
    suggestedQuestions: [
      "Does Atlas cover all MCP servers automatically or just configured ones?",
      "What's the policy for allowing legitimate tool results vs blocking sensitive ones?",
      "How do we get visibility into which agents are calling which tools?",
    ],
  },
  {
    id: "mcp_devcopilot",
    name: "Developer Copilot",
    subtitle: "MCP + Filesystem / Database",
    icon: "💻",
    description:
      "AI coding assistant calls read_file and execute_query MCP tools. Returns production credentials and bulk PII from a live database query.",
    risk: "Credential / PII exposure via MCP",
    color: "emerald",
    tools: ["read_file", "execute_query"],
    talkingPoints: [
      "Production credentials were blocked before the coding assistant could read or relay them",
      "Shadow AI risk: developers don't realize their AI tool can access prod secrets via filesystem MCP",
      "Atlas requires no changes to the AI tool or MCP server — it sits inline on the gateway",
    ],
    atlasFeatures: ["Credential / Secret Detection", "MCP Filesystem Tool Coverage", "Developer AI Governance"],
    suggestedQuestions: [
      "Can we allow read_file for non-sensitive paths but block .env and credential files?",
      "Does Atlas have a developer-specific policy template?",
      "What happens to the developer experience when a request is blocked?",
    ],
  },
  {
    id: "mcp_crmagent",
    name: "CRM Sales Agent",
    subtitle: "MCP + CRM Integration",
    icon: "👥",
    description:
      "AI sales assistant calls search_customers and get_user_history MCP tools. Returns M&A-sensitive account data and behavioral profiling information.",
    risk: "M&A data / behavioral profiling via MCP",
    color: "violet",
    tools: ["search_customers", "get_user_history"],
    talkingPoints: [
      "M&A sensitive data and behavioral profiling were both caught in CRM tool results",
      "The sales agent couldn't export the board presentation data it was asked to compile",
      "Atlas covers the full agentic loop — from user intent to tool result to LLM output",
    ],
    atlasFeatures: ["M&A / Insider Data Policy", "Behavioral Profiling Detection", "CRM Tool Coverage"],
    suggestedQuestions: [
      "How do we classify what counts as M&A sensitive vs normal deal data?",
      "Can we set policies per sales team or per deal stage?",
      "Does Atlas integrate with Salesforce or HubSpot natively?",
    ],
  },
  {
    id: "mcp_idecopilot",
    name: "IDE Coding Agent",
    subtitle: "VS Code + Copilot CLI Runtime Hooks (v3.4.0)",
    icon: "🧑‍💻",
    description:
      "Developer uses GitHub Copilot in VS Code and the Copilot CLI to generate infrastructure code. Atlas Runtime Hooks intercept a request containing production secrets — and Quarantine Action locks the user out for 15 minutes after the violation.",
    risk: "Secrets exfiltration via IDE AI + Quarantine enforcement",
    color: "orange",
    tools: ["copilot_completion", "copilot_cli_suggest"],
    talkingPoints: [
      "VS Code Runtime Hooks (v3.4.0) intercept Copilot requests at the IDE layer — no proxy reconfiguration needed",
      "Copilot CLI hooks extend the same coverage to terminal-based AI coding workflows",
      "Quarantine Action (v3.4.0) locks the developer's account after a blocking violation — automatic enforcement, no SOC intervention required",
      "This is the developer AI surface most customers haven't secured yet — IDE tools run outside the corporate proxy",
    ],
    atlasFeatures: ["VS Code Runtime Hooks", "Copilot CLI Runtime Hooks", "Quarantine Action", "Credential / Secret Detection"],
    suggestedQuestions: [
      "How is the VS Code hook deployed — does it require the developer to install anything?",
      "Can we configure the quarantine duration per policy or per team?",
      "Does the Copilot CLI hook cover both gh copilot suggest and gh copilot explain?",
    ],
  },
];

interface AgentScenarioDef extends ScenarioDef {
  stepNames: string[];
}

const AGENT_SCENARIOS: AgentScenarioDef[] = [
  {
    id: "agent_healthcare",
    name: "Healthcare Research Agent",
    subtitle: "4-Step EHR Research Pipeline",
    icon: "🏥",
    description:
      "AI research agent plans, retrieves EHR data, summarizes findings, and drafts a clinical report. Atlas intercepts at the data retrieval step — blocking PHI before the rest of the chain executes.",
    risk: "PHI Exfiltration via Agent Chain",
    color: "blue",
    stepNames: ["Plan", "Retrieve EHR Data", "Summarize Findings", "Draft Report"],
    talkingPoints: [
      "Atlas interrupted the agent chain mid-execution — steps 3 and 4 never fired",
      "The agent ran 1 benign planning step before being stopped at the data retrieval step",
      "This is why agentic AI is harder to secure — the threat is in orchestration, not just prompts",
    ],
    atlasFeatures: ["Multi-Step Agent Tracing", "Mid-Chain Interruption", "PHI Detection in Agentic Context"],
    suggestedQuestions: [
      "Does Atlas trace every step of every agent, or just steps that trigger policies?",
      "Can we see the full agent execution graph in AI Investigation?",
      "What happens to the agent task — does it fail gracefully or retry?",
    ],
  },
  {
    id: "agent_finance",
    name: "Financial Due Diligence Agent",
    subtitle: "4-Step M&A Analysis Pipeline",
    icon: "📈",
    description:
      "AI due diligence agent plans an M&A analysis, retrieves non-public financials and insider data, drafts an executive memo, and distributes it. Atlas blocks at the financial research step.",
    risk: "MNPI / PII via Agent Chain",
    color: "emerald",
    stepNames: ["Plan", "Research Financials", "Draft Memo", "Distribute"],
    talkingPoints: [
      "Unreleased financial data (MNPI) and CEO PII were caught at step 2 of a 4-step chain",
      "The due diligence agent couldn't complete its task — protecting the firm from accidental MNPI leakage",
      "Atlas acts as a circuit breaker in AI-powered financial workflows",
    ],
    atlasFeatures: ["MNPI / Financial Data Detection", "Agentic Chain Tracing", "Real-Time Circuit Breaker"],
    suggestedQuestions: [
      "Can we allow certain agents to access financial data with an approval workflow?",
      "Does Atlas support break-glass policies for authorized emergency access?",
      "How do we measure security risk avoided vs business impact of blocked agent tasks?",
    ],
  },
];

const ALL_SCENARIOS: ScenarioDef[] = [
  ...PROMPT_SCENARIOS,
  ...MCP_SCENARIOS,
  ...AGENT_SCENARIOS,
];

const COLOR_MAP: Record<string, { border: string; badge: string; button: string }> = {
  blue:    { border: "border-blue-500",    badge: "bg-blue-500/10 text-blue-300 border border-blue-500/30",       button: "bg-blue-600 hover:bg-blue-500" },
  emerald: { border: "border-emerald-500", badge: "bg-emerald-500/10 text-emerald-300 border border-emerald-500/30", button: "bg-emerald-600 hover:bg-emerald-500" },
  violet:  { border: "border-violet-500",  badge: "bg-violet-500/10 text-violet-300 border border-violet-500/30",   button: "bg-violet-600 hover:bg-violet-500" },
  orange:  { border: "border-orange-500",  badge: "bg-orange-500/10 text-orange-300 border border-orange-500/30",   button: "bg-orange-600 hover:bg-orange-500" },
};

const ATLAS_INVESTIGATION_URL =
  "https://prod.alltrue-be.com/ai-monitor?organization=985dfc2e-2cfd-4b4a-9c8a-6a98ec1efbdb&project=68869c92-9502-432c-8508-713264a919c7";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: "sent" | "blocked" | "error" | "skipped" }) {
  if (status === "blocked") return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">🛡 BLOCKED</span>
  );
  if (status === "error") return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">⚠ ERROR</span>
  );
  if (status === "skipped") return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-600/40 text-gray-500 border border-gray-600/40">– SKIPPED</span>
  );
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/40">✓ SENT</span>
  );
}

function PromptResultCard({ r }: { r: PromptResult }) {
  return (
    <div className={`bg-gray-800 border rounded-xl p-5 ${r.status === "blocked" ? "border-red-500/60" : r.status === "error" ? "border-yellow-500/60" : "border-gray-700"}`}>
      <div className="flex items-center gap-2 mb-3">
        <StatusBadge status={r.status} />
        <span className="text-sm font-medium text-white">{r.label}</span>
      </div>
      <div className="mb-3">
        <div className="text-xs text-gray-500 mb-1">Prompt sent to Atlas Gateway</div>
        <div className="bg-gray-900 rounded-lg p-3 text-xs text-gray-300 font-mono leading-relaxed">{r.prompt}</div>
      </div>
      {r.status === "blocked" && r.policy_triggered && (
        <div className="bg-red-950/50 rounded-lg p-3">
          <div className="text-xs text-red-400 font-semibold mb-0.5">Policy triggered</div>
          <div className="text-xs text-red-300">{r.policy_triggered}</div>
        </div>
      )}
      {r.status === "sent" && r.response && (
        <div>
          <div className="text-xs text-gray-500 mb-1">LLM response (passed through Gateway)</div>
          <div className="bg-gray-900 rounded-lg p-3 text-xs text-gray-300 leading-relaxed">{r.response}</div>
        </div>
      )}
      {r.status === "error" && r.error && (
        <div className="text-xs text-yellow-400">{r.error}</div>
      )}
    </div>
  );
}

function McpResultCard({ r }: { r: McpResult }) {
  return (
    <div className={`bg-gray-800 border rounded-xl overflow-hidden ${r.status === "blocked" ? "border-red-500/60" : r.status === "error" ? "border-yellow-500/60" : "border-gray-700"}`}>
      <div className="px-5 py-3 flex items-center gap-2 border-b border-gray-700/50">
        <StatusBadge status={r.status} />
        <span className="text-sm font-medium text-white">{r.label}</span>
      </div>
      <div className="px-5 py-4 space-y-3">
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 shrink-0">1</div>
            <div className="w-px flex-1 bg-gray-700 mt-1" />
          </div>
          <div className="flex-1 pb-3">
            <div className="text-xs text-gray-500 mb-1">User request to AI agent</div>
            <div className="bg-gray-900 rounded-lg px-3 py-2 text-xs text-gray-300 italic">"{r.user_ask}"</div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-400 shrink-0">2</div>
            <div className="w-px flex-1 bg-gray-700 mt-1" />
          </div>
          <div className="flex-1 pb-3">
            <div className="text-xs text-gray-500 mb-1">Agent calls MCP tool</div>
            <div className="bg-gray-900 rounded-lg px-3 py-2">
              <span className="text-xs font-mono text-amber-400">{r.tool_name}</span>
              <span className="text-xs text-gray-500 ml-2">
                ({Object.entries(r.tool_args).map(([k, v]) => `${k}: ${JSON.stringify(v)}`).join(", ")})
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 ${r.status === "blocked" ? "bg-red-700 text-red-200" : "bg-gray-700 text-gray-400"}`}>3</div>
          </div>
          <div className="flex-1">
            <div className="text-xs text-gray-500 mb-1 flex items-center gap-2">
              MCP tool result injected into LLM context
              {r.status === "blocked" && <span className="text-red-400 font-semibold">← Atlas intercepts here</span>}
            </div>
            <div className={`rounded-lg px-3 py-2 text-xs font-mono leading-relaxed ${r.status === "blocked" ? "bg-red-950/40 text-red-300" : "bg-gray-900 text-gray-300"}`}>
              {r.tool_result_preview}
            </div>
            <div className="text-xs text-gray-600 mt-1">Risk: <span className="text-amber-500">{r.risk_type}</span></div>
          </div>
        </div>
      </div>
      {r.status === "blocked" && r.policy_triggered && (
        <div className="mx-5 mb-4 bg-red-950/50 rounded-lg p-3">
          <div className="text-xs text-red-400 font-semibold mb-0.5">Atlas policy triggered</div>
          <div className="text-xs text-red-300">{r.policy_triggered}</div>
        </div>
      )}
      {r.status === "sent" && r.response && (
        <div className="mx-5 mb-4">
          <div className="text-xs text-gray-500 mb-1">LLM response (tool result passed through Gateway)</div>
          <div className="bg-gray-900 rounded-lg p-3 text-xs text-gray-300 leading-relaxed">{r.response}</div>
        </div>
      )}
      {r.status === "error" && r.error && (
        <div className="mx-5 mb-4 text-xs text-yellow-400">{r.error}</div>
      )}
    </div>
  );
}

function AgentStepRow({ step, isLast }: { step: AgentStepResult; isLast: boolean }) {
  const isSkipped = step.status === "skipped";
  const isBlocked = step.status === "blocked";
  const isSent = step.status === "sent";

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
          isBlocked ? "bg-red-700 text-red-200" :
          isSkipped ? "bg-gray-800 text-gray-600 border border-gray-700" :
          isSent    ? "bg-green-800 text-green-300" :
                      "bg-yellow-800 text-yellow-300"
        }`}>
          {isBlocked ? "✕" : isSkipped ? "–" : isSent ? "✓" : "!"}
        </div>
        {!isLast && <div className={`w-px flex-1 mt-1 ${isSkipped ? "bg-gray-800" : "bg-gray-700"}`} />}
      </div>
      <div className={`flex-1 ${isLast ? "" : "pb-3"} ${isSkipped ? "opacity-35" : ""}`}>
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className={`text-xs font-semibold ${isSkipped ? "text-gray-600" : "text-gray-200"}`}>
            Step {step.step_number}: {step.step_name}
          </span>
          <span className="text-xs text-gray-600">{step.action_label}</span>
          {isBlocked && <span className="text-red-400 text-xs font-semibold">← Atlas intercepts here</span>}
          {isSkipped && <span className="text-gray-600 text-xs italic">Not executed — chain interrupted</span>}
        </div>
        {!isSkipped && (
          <div className={`rounded-lg px-3 py-2 text-xs leading-relaxed font-mono ${
            isBlocked ? "bg-red-950/40 text-red-300" : "bg-gray-900 text-gray-400"
          }`}>
            {step.prompt.slice(0, 220)}{step.prompt.length > 220 ? "…" : ""}
          </div>
        )}
        {isBlocked && step.policy_triggered && (
          <div className="mt-2 bg-red-950/50 rounded-lg px-3 py-2">
            <div className="text-xs text-red-400 font-semibold">Atlas policy triggered</div>
            <div className="text-xs text-red-300">{step.policy_triggered}</div>
          </div>
        )}
        {isSent && step.response && (
          <div className="mt-1.5 bg-gray-900/60 rounded-lg px-3 py-2 text-xs text-gray-500 leading-relaxed">
            {step.response.slice(0, 180)}{step.response.length > 180 ? "…" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

function AgentResultCard({ result }: { result: SimResult & { simulation_type: "agent" } }) {
  return (
    <div className={`bg-gray-800 border rounded-xl overflow-hidden ${result.chain_status === "blocked_mid_chain" ? "border-red-500/60" : "border-gray-700"}`}>
      <div className="px-5 py-3 border-b border-gray-700/50 flex items-center justify-between">
        <span className="text-sm font-medium text-white">{result.scenario_label}</span>
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
          result.chain_status === "blocked_mid_chain"
            ? "bg-red-500/20 text-red-300 border-red-500/40"
            : "bg-green-500/20 text-green-300 border-green-500/40"
        }`}>
          {result.chain_status === "blocked_mid_chain" ? "🛡 CHAIN INTERRUPTED" : "✓ COMPLETED"}
        </span>
      </div>
      <div className="px-5 py-4 space-y-0">
        {result.steps.map((step, i) => (
          <AgentStepRow key={i} step={step} isLast={i === result.steps.length - 1} />
        ))}
      </div>
      <div className="px-5 pb-4 text-xs text-gray-600">
        {result.steps_fired} of {result.steps_total} steps executed before chain {result.chain_status === "blocked_mid_chain" ? "was interrupted" : "completed"}
      </div>
    </div>
  );
}

function TalkingPointsPanel({ scenario }: { scenario: ScenarioDef | null }) {
  if (!scenario) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
        💬 Talking Points for This Demo
      </h3>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <div className="text-xs font-semibold text-white mb-2">What just happened</div>
          <ul className="space-y-2">
            {scenario.talkingPoints.map((p, i) => (
              <li key={i} className="text-xs text-gray-400 flex gap-2 leading-relaxed">
                <span className="text-green-500 shrink-0 mt-0.5">•</span>{p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="text-xs font-semibold text-white mb-2">Atlas features demonstrated</div>
          <div className="flex flex-wrap gap-1.5">
            {scenario.atlasFeatures.map((f, i) => (
              <span key={i} className="text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20 px-2 py-0.5 rounded-full">
                {f}
              </span>
            ))}
          </div>
        </div>
        <div>
          <div className="text-xs font-semibold text-white mb-2">Suggested next questions</div>
          <ul className="space-y-2">
            {scenario.suggestedQuestions.map((q, i) => (
              <li key={i} className="text-xs text-gray-400 flex gap-2 leading-relaxed">
                <span className="text-amber-500 shrink-0 mt-0.5">→</span>{q}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const CUSTOM_RISK_TYPES = [
  "PII / PHI Exposure",
  "Credential Exposure",
  "Prompt Injection",
  "Data Exfiltration",
  "MNPI / Insider Risk",
  "Behavioral Profiling",
  "Other",
];

export default function RuntimePage() {
  const [simType, setSimType] = useState<SimType>("prompt");
  const [selected, setSelected] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<SimResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [simulationTime, setSimulationTime] = useState<Date | null>(null);

  // Custom scenario state
  const [customPrompt, setCustomPrompt] = useState("");
  const [customLabel, setCustomLabel] = useState("");
  const [customRisk, setCustomRisk] = useState(CUSTOM_RISK_TYPES[0]);

  const scenarios =
    simType === "agent" ? AGENT_SCENARIOS :
    simType === "mcp"   ? MCP_SCENARIOS   :
                          PROMPT_SCENARIOS;

  const selectedScenario = simType === "custom" ? null : scenarios.find((s) => s.id === selected);
  const colors = selectedScenario ? COLOR_MAP[selectedScenario.color] : null;

  const resultScenario = result ? ALL_SCENARIOS.find((s) => s.id === result.scenario_id) ?? null : null;

  function switchSimType(t: SimType) {
    setSimType(t);
    setSelected(null);
    setResult(null);
    setError(null);
    setSimulationTime(null);
  }

  async function runSimulation() {
    if ((simType !== "custom" && !selected) || running) return;
    if (simType === "custom" && !customPrompt.trim()) return;
    setRunning(true);
    setResult(null);
    setError(null);
    setSimulationTime(new Date());

    const body =
      simType === "custom"
        ? {
            scenario_id: "custom",
            simulation_type: "prompt",
            custom_prompt: customPrompt.trim(),
            custom_label: customLabel.trim() || customRisk,
          }
        : { scenario_id: selected, simulation_type: simType };

    try {
      const res = await fetch("/api/demo/runtime/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? `Request failed (${res.status})`);
      else setResult(data);
    } catch (e) {
      setError(String(e));
    } finally {
      setRunning(false);
    }
  }

  const firedAtLabel = simulationTime
    ? simulationTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-gray-100">

      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors text-sm mr-2">← Home</Link>
        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-sm">R</div>
        <div>
          <h1 className="font-semibold text-white">AI Runtime Demo</h1>
          <p className="text-xs text-gray-400">Simulate AI traffic through Atlas Gateway — watch policy enforcement in action</p>
        </div>
        <button
          onClick={() => setHelpOpen(true)}
          className="ml-auto w-6 h-6 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-gray-300 hover:text-white text-xs font-bold transition-colors"
          title="Help"
        >?</button>
      </header>
      <HelpPanel page="runtime" open={helpOpen} onClose={() => setHelpOpen(false)} />

      <main className="flex-1 px-6 py-8 max-w-4xl mx-auto w-full">

        {/* Simulation Type */}
        <div className="mb-8">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Simulation Type</h2>
          <div className="grid grid-cols-4 gap-3">

            <button
              onClick={() => switchSimType("prompt")}
              className={`border rounded-xl p-4 text-left transition-all ${simType === "prompt" ? "bg-gray-800 border-red-500" : "bg-gray-900 border-gray-800 hover:border-gray-600 hover:bg-gray-800/50"}`}
            >
              <div className="text-xl mb-2">🚦</div>
              <div className={`font-medium text-sm ${simType === "prompt" ? "text-white" : "text-gray-400"}`}>Prompt Traffic</div>
              <div className="text-xs text-gray-500 mt-1">Fire real prompts through Atlas Gateway</div>
            </button>

            <button
              onClick={() => switchSimType("mcp")}
              className={`border rounded-xl p-4 text-left transition-all ${simType === "mcp" ? "bg-gray-800 border-red-500" : "bg-gray-900 border-gray-800 hover:border-gray-600 hover:bg-gray-800/50"}`}
            >
              <div className="text-xl mb-2">🔌</div>
              <div className={`font-medium text-sm ${simType === "mcp" ? "text-white" : "text-gray-400"}`}>MCP Call Simulation</div>
              <div className="text-xs text-gray-500 mt-1">Simulate MCP tool call chains through Atlas</div>
            </button>

            <button
              onClick={() => switchSimType("agent")}
              className={`border rounded-xl p-4 text-left transition-all ${simType === "agent" ? "bg-gray-800 border-red-500" : "bg-gray-900 border-gray-800 hover:border-gray-600 hover:bg-gray-800/50"}`}
            >
              <div className="text-xl mb-2">🤖</div>
              <div className={`font-medium text-sm ${simType === "agent" ? "text-white" : "text-gray-400"}`}>Multi-Agent Workflow</div>
              <div className="text-xs text-gray-500 mt-1">Trace agentic task chains through Atlas</div>
            </button>

            <button
              onClick={() => switchSimType("custom")}
              className={`border rounded-xl p-4 text-left transition-all ${simType === "custom" ? "bg-gray-800 border-red-500" : "bg-gray-900 border-gray-800 hover:border-gray-600 hover:bg-gray-800/50"}`}
            >
              <div className="text-xl mb-2">✏️</div>
              <div className={`font-medium text-sm ${simType === "custom" ? "text-white" : "text-gray-400"}`}>Custom Scenario</div>
              <div className="text-xs text-gray-500 mt-1">Define your own prompt and risk type</div>
            </button>

          </div>

          {/* Sim-type explainers */}
          {simType === "mcp" && (
            <div className="mt-3 bg-amber-950/20 border border-amber-800/40 rounded-xl px-4 py-3 text-xs text-amber-300/80 leading-relaxed">
              <span className="font-semibold text-amber-300">How MCP simulation works: </span>
              Each scenario fires a realistic MCP tool call chain through Atlas Gateway — user request → agent calls MCP tool → tool returns sensitive data → Atlas intercepts at the tool result layer.
              This demonstrates how Atlas catches threats that originate <span className="italic">inside</span> the agent context, not just in user prompts.
            </div>
          )}
          {simType === "agent" && (
            <div className="mt-3 bg-purple-950/20 border border-purple-800/40 rounded-xl px-4 py-3 text-xs text-purple-300/80 leading-relaxed">
              <span className="font-semibold text-purple-300">How multi-agent simulation works: </span>
              Each scenario fires a sequential chain of agent steps (plan → retrieve → summarize → write).
              Atlas traces every step individually. When a step is blocked, the entire chain is interrupted — downstream steps never fire.
              Check AI Investigation afterward to see the full per-step execution trace.
            </div>
          )}
          {simType === "custom" && (
            <div className="mt-3 bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-xs text-gray-400 leading-relaxed">
              <span className="font-semibold text-gray-300">Custom scenario: </span>
              Enter any prompt to fire directly through Atlas Gateway. Use this to test specific content against your live policies, demonstrate a customer-specific risk type, or validate a policy configuration in real time.
            </div>
          )}
        </div>

        {/* Scenario Picker or Custom Form */}
        {simType === "custom" ? (
          <div className="mb-6 bg-gray-800 border border-gray-700 rounded-xl p-5 space-y-4">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Build Your Scenario</h2>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Scenario Label <span className="text-gray-600">(optional — shown in results)</span></label>
              <input
                type="text"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="e.g. PCI Data in Support Chat"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-500"
              />
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Risk Type</label>
              <select
                value={customRisk}
                onChange={(e) => setCustomRisk(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-gray-500"
              >
                {CUSTOM_RISK_TYPES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-400 mb-1.5 block">Prompt <span className="text-red-400">*</span></label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Enter the prompt to fire through Atlas Gateway…"
                rows={5}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 font-mono leading-relaxed focus:outline-none focus:border-gray-500 resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={runSimulation}
                disabled={running || !customPrompt.trim()}
                className="px-5 py-2.5 rounded-lg font-medium text-sm text-white bg-red-600 hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {running ? "Running…" : "Run Custom Simulation →"}
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {simType === "agent" ? "Select an Agent Scenario" :
               simType === "mcp"   ? "Select an MCP Agent Scenario" :
                                     "Select a Customer Scenario"}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {scenarios.map((s) => {
                const c = COLOR_MAP[s.color];
                const isSelected = selected === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => { setSelected(s.id); setResult(null); setError(null); }}
                    className={`bg-gray-800 border rounded-xl p-5 text-left transition-all hover:bg-gray-700 ${isSelected ? c.border : "border-gray-700"}`}
                  >
                    <div className="text-2xl mb-3">{s.icon}</div>
                    <div className="font-semibold text-white text-sm mb-0.5">{s.name}</div>
                    <div className="text-xs text-gray-400 mb-3">{s.subtitle}</div>
                    {"tools" in s && Array.isArray(s.tools) && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {(s.tools as string[]).map((t) => (
                          <span key={t} className="text-xs font-mono bg-gray-700 text-amber-400 px-1.5 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    )}
                    {"stepNames" in s && Array.isArray(s.stepNames) && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {(s.stepNames as string[]).map((t, i) => (
                          <span key={t} className="text-xs font-mono bg-gray-700 text-sky-400 px-1.5 py-0.5 rounded">{i + 1}. {t}</span>
                        ))}
                      </div>
                    )}
                    <div className={`text-xs px-2 py-1 rounded-full inline-block ${c.badge}`}>{s.risk}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Selected scenario detail + run */}
        {selectedScenario && colors && simType !== "custom" && (
          <div className={`bg-gray-800 border ${colors.border} rounded-xl p-5 mb-6`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-semibold text-white mb-1">
                  {selectedScenario.icon} {selectedScenario.name} — {selectedScenario.subtitle}
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">{selectedScenario.description}</p>
              </div>
              <button
                onClick={runSimulation}
                disabled={running}
                className={`shrink-0 px-5 py-2.5 rounded-lg font-medium text-sm text-white transition-colors ${colors.button} disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {running ? "Running…" :
                 simType === "mcp"   ? "Run MCP Simulation →" :
                 simType === "agent" ? "Run Agent Workflow →" :
                                       "Run Simulation →"}
              </button>
            </div>
          </div>
        )}

        {!selected && simType !== "custom" && (
          <div className="text-center text-gray-500 text-sm py-8">Select a scenario above to begin</div>
        )}

        {error && (
          <div className="bg-red-950 border border-red-700 rounded-xl p-4 mb-6 text-red-300 text-sm">{error}</div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">

            {/* Results header with timestamp + investigation link */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {result.simulation_type === "agent"
                    ? `Agent Results — ${result.steps_fired} of ${result.steps_total} steps executed`
                    : `Results — ${result.prompts_fired} ${result.simulation_type === "mcp" ? "tool call chains" : "prompts"} fired`}
                </h2>
                {firedAtLabel && (
                  <span className="text-xs bg-gray-800 border border-gray-700 text-gray-500 px-2 py-0.5 rounded-full">
                    Fired at {firedAtLabel}
                  </span>
                )}
              </div>
              <a
                href={ATLAS_INVESTIGATION_URL}
                target="_blank"
                rel="noopener noreferrer"
                title={firedAtLabel ? `Filter to ${firedAtLabel} in AI Investigation` : "Open AI Investigation"}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                View in Atlas Runtime →
              </a>
            </div>

            {/* Result cards */}
            {result.simulation_type === "agent" ? (
              <AgentResultCard result={result} />
            ) : (
              result.results.map((r, i) =>
                r.simulation_type === "mcp"
                  ? <McpResultCard key={i} r={r as McpResult} />
                  : <PromptResultCard key={i} r={r as PromptResult} />
              )
            )}

            {/* Runtime hint */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-xs text-gray-400">
              💡 {result.runtime_hint}
            </div>

            {/* Talking points */}
            <TalkingPointsPanel scenario={resultScenario} />

          </div>
        )}
      </main>
    </div>
  );
}
