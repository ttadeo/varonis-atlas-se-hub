"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import HelpPanel from "@/components/HelpPanel";

// ─── Chain of Custody types ──────────────────────────────────────────────────

interface AtlasProject {
  id?: string;
  project_id?: string;
  name?: string;
  display_name?: string;
  organization_name?: string;
  organization_id?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ScenarioDef {
  id: string;
  name: string;
  description: string;
  resource_count: number;
  layers: string[];
}

interface CreatedResource {
  id: string;
  name: string;
  resource_type: string;
  category: string;
}

interface ScenarioResult {
  scenario_name: string;
  project_id: string;
  created: CreatedResource[];
  dependencies_linked: boolean;
  errors: string[];
}

interface AtlasResource {
  id?: string;
  name?: string;
  resource_type?: string;
  technology?: string;
  resource_category?: string;
  review_status?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

interface ChainScanResult {
  resources: { resources?: AtlasResource[]; [key: string]: unknown } | null;
  dependency_graphs: unknown;
  org_projects: unknown;
}

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ExistingMatch {
  template_name: string;
  match_score: number;
  match_reason: string;
  rules_included: string[];
}

interface CustomRule {
  rule_type: string;
  reason: string;
}

interface CustomRecommendation {
  suggested_name: string;
  description: string;
  rules: CustomRule[];
}

interface DiscoverResult {
  existing_matches: ExistingMatch[];
  custom_recommendation: CustomRecommendation;
  recommendation: "existing" | "custom";
  recommendation_reason: string;
  use_case: string;
  industry: string;
  meeting_type: string;
}


// ─── Scenario Templates ────────────────────────────────────────────────────────

const SCENARIO_TEMPLATES = [
  {
    id: "pii_phi",
    label: "PII & PHI Protection",
    icon: "🏥",
    color: "border-rose-600 hover:border-rose-400 bg-rose-900/10",
    activeColor: "border-rose-400 bg-rose-900/30",
    tagColor: "text-rose-400",
    description: "Healthcare staff pasting patient data into ChatGPT — HIPAA risk via PII/PHI leakage",
    industry: "Healthcare",
    meetingType: "Technical Deep Dive",
    useCase:
      "A healthcare organization where clinical staff (nurses and physicians) are regularly pasting patient notes, lab results, and medication records into ChatGPT to generate summaries and draft documentation. This creates significant HIPAA risk: PHI including names, DOBs, diagnoses, and treatment plans is being sent to an external LLM with no visibility, no policy enforcement, and no audit trail. The security team has no way to know which staff are doing this, how frequently, or what data is leaving the environment. We need Atlas to detect and block PII/PHI in prompts in real time, provide a full audit log of AI interactions involving sensitive data, and give the compliance team dashboards they can present to auditors.",
  },
  {
    id: "exec_ai_gov",
    label: "Executive AI Governance",
    icon: "🏛️",
    color: "border-blue-600 hover:border-blue-400 bg-blue-900/10",
    activeColor: "border-blue-400 bg-blue-900/30",
    tagColor: "text-blue-400",
    description: "Board-level AI governance — full visibility, policy enforcement, and audit trail across all AI usage",
    industry: "Financial Services",
    meetingType: "Executive Briefing",
    useCase:
      "A financial services firm whose board and CISO need enterprise-wide visibility into all AI tool usage: which models employees are using, what data is being sent, and whether usage complies with internal AI policies and regulatory requirements (SOC 2, SEC AI guidance). Currently there is no centralized view - different business units have adopted Copilot, ChatGPT, and various coding assistants independently with no governance layer. Leadership wants a single pane of glass showing AI usage by department, real-time policy enforcement to block prohibited use cases (e.g. sending client financial data to consumer AI), and an immutable audit trail they can produce during regulatory examinations.",
  },
  {
    id: "shadow_ai",
    label: "Shadow AI Monitor",
    icon: "👁️",
    color: "border-amber-600 hover:border-amber-400 bg-amber-900/10",
    activeColor: "border-amber-400 bg-amber-900/30",
    tagColor: "text-amber-400",
    description: "Discover unauthorized AI tools employees are using without IT or security knowledge",
    industry: "Technology",
    meetingType: "Discovery",
    useCase:
      "A technology company where the security team suspects employees are using AI tools that were never reviewed or approved: browser-based AI assistants, coding copilots, AI-powered SaaS apps, and local models running on company laptops. IT has no inventory of what AI tools are actually in use across the org. The risk is that sensitive source code, internal documents, and customer data could be flowing into unsanctioned models with no controls. We need Atlas to automatically discover every AI tool in use across the environment, classify them as sanctioned or unsanctioned, surface risk by department and data type, and give the security team the ability to set policies that block or monitor specific tools going forward.",
  },
];

// ─── Constants ─────────────────────────────────────────────────────────────────

const INDUSTRIES = [
  "Healthcare",
  "Financial Services",
  "Legal",
  "Retail & E-Commerce",
  "Technology",
  "Manufacturing",
  "Education",
  "Government & Public Sector",
  "Energy & Utilities",
  "Insurance",
  "Other",
];

const MEETING_TYPES = [
  "Discovery",
  "Technical Deep Dive",
  "POC",
  "RFP Response",
  "Executive Briefing",
];

// ─── Score bar ─────────────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 75 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-gray-700 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span
        className={`text-sm font-semibold w-8 text-right ${
          score >= 75
            ? "text-green-400"
            : score >= 50
            ? "text-yellow-400"
            : "text-red-400"
        }`}
      >
        {score}
      </span>
    </div>
  );
}

// ─── Chain helpers ──────────────────────────────────────────────────────────

const CATEGORY_META: Record<string, { label: string; color: string; icon: string }> = {
  // API resource_type_category values
  "software_package": { label: "Library / Framework", color: "bg-purple-700/60 text-purple-200 border-purple-600", icon: "📦" },
  "llm_endpoint":     { label: "LLM Endpoint",        color: "bg-blue-700/60 text-blue-200 border-blue-600",       icon: "🤖" },
  "model_assets":     { label: "AI Model",            color: "bg-green-700/60 text-green-200 border-green-600",     icon: "🧠" },
  "cloud_resource":   { label: "Cloud Resource",      color: "bg-cyan-700/60 text-cyan-200 border-cyan-600",        icon: "☁️" },
  "dataset":          { label: "Dataset / File",      color: "bg-yellow-700/60 text-yellow-200 border-yellow-600",  icon: "📄" },
  "agentic":          { label: "AI Agent",            color: "bg-orange-700/60 text-orange-200 border-orange-600",  icon: "🤖" },
};

const CHAIN_LAYER_ORDER = [
  "software_package",
  "cloud_resource",
  "agentic",
  "llm_endpoint",
  "model_assets",
  "dataset",
];

function categoryMeta(cat?: string) {
  return CATEGORY_META[cat ?? ""] ?? { label: cat ?? "Resource", color: "bg-gray-700/60 text-gray-200 border-gray-600", icon: "⬜" };
}

function statusBadge(status?: string) {
  if (!status) return null;
  const lower = status.toLowerCase();
  if (lower === "approved")   return <span className="text-xs px-2 py-0.5 rounded-full bg-green-800/60 text-green-300 border border-green-700">Approved</span>;
  if (lower === "unapproved") return <span className="text-xs px-2 py-0.5 rounded-full bg-red-800/60 text-red-300 border border-red-700">Rejected</span>;
  return                             <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-800/60 text-yellow-300 border border-yellow-700">Unreviewed</span>;
}

// ─── Resource Detail Modal ────────────────────────────────────────────────────

function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  function copy() {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button
      onClick={copy}
      className="shrink-0 text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
    >
      {copied ? "Copied!" : `Copy ${label}`}
    </button>
  );
}

function ResourceDetailModal({ resource, onClose }: { resource: AtlasResource; onClose: () => void }) {
  const [fullRecord, setFullRecord] = useState<AtlasResource | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(false);

  const id = resource.resource_instance_id ?? resource.id ?? "";

  // Fetch full record from Atlas on mount
  useEffect(() => {
    if (!id) return;
    setFetching(true);
    fetch(`/api/demo/chain/resource?id=${encodeURIComponent(id)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) setFetchError(data.error);
        else setFullRecord(data);
      })
      .catch((e) => setFetchError(String(e)))
      .finally(() => setFetching(false));
  }, [id]);
  const name = resource.resource_display_name ?? resource.name ?? "Unnamed";
  const category = resource.resource_type_category ?? resource.resource_category;
  const reviewed = resource.reviewed ?? resource.review_status;
  const meta = categoryMeta(category);
  const projectIds: string[] = Array.isArray(resource.project_ids) ? resource.project_ids : (resource.project_id ? [resource.project_id] : []);
  const technologies: string[] = Array.isArray(resource.technology_types) ? resource.technology_types : [];

  const fields = [
    { label: "Resource ID",    value: id,                                              copyLabel: "ID" },
    { label: "Display Name",   value: name,                                            copyLabel: "Name" },
    { label: "Type",           value: resource.resource_type_display_name ?? resource.resource_type ?? "—", copyLabel: null },
    { label: "Category",       value: meta.label,                                      copyLabel: null },
    { label: "Technologies",   value: technologies.join(", ") || "—",                  copyLabel: null },
    { label: "Review Status",  value: reviewed ?? "—",                                 copyLabel: null },
    { label: "Active Status",  value: resource.status ?? "—",                          copyLabel: null },
    { label: "Project ID(s)",  value: projectIds.join(", ") || "—",                    copyLabel: projectIds.length > 0 ? "Project ID" : null },
    { label: "Discovery Scan", value: resource.discovery_scan_id ?? "—",              copyLabel: resource.discovery_scan_id ? "Scan ID" : null },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`flex items-start gap-3 px-5 py-4 rounded-t-2xl border-b border-gray-700 ${meta.color}`}>
          <span className="text-2xl mt-0.5">{meta.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white truncate">{name}</p>
            <p className="text-xs opacity-80 mt-0.5">{resource.resource_type_display_name ?? meta.label}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-lg leading-none ml-2">✕</button>
        </div>

        {/* Live record from Atlas */}
        {fetching && (
          <div className="mx-5 mt-4 text-xs text-gray-500 animate-pulse">Fetching full record from Atlas…</div>
        )}
        {fetchError && (
          <div className="mx-5 mt-4 text-xs text-red-400">Could not fetch full record: {fetchError}</div>
        )}
        {fullRecord && (() => {
          // Show any extra fields that aren't already in our static list
          const knownKeys = new Set(["resource_instance_id","resource_display_name","resource_type_display_name","resource_type","resource_type_category","technology_types","project_ids","status","reviewed","discovery_scan_id","has_valid_pentest_connection_details","pentest_connection_last_tested","pentest_connection_last_test_status","pentest_connection_last_test_error_msg","issue_summaries","provider"]);
          const extraFields = Object.entries(fullRecord).filter(([k, v]) => !knownKeys.has(k) && v !== null && v !== undefined && v !== "");
          if (extraFields.length === 0) return null;
          return (
            <div className="mx-5 mt-4 bg-gray-800/60 border border-gray-700 rounded-xl px-4 py-3 space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Additional Fields from Atlas</p>
              {extraFields.map(([key, val]) => (
                <div key={key} className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 mb-0.5">{key}</p>
                    <p className="text-sm text-gray-200 break-all font-mono">{typeof val === "object" ? JSON.stringify(val) : String(val)}</p>
                  </div>
                  {typeof val === "string" && val.length > 0 && <CopyButton value={val} label="Value" />}
                </div>
              ))}
            </div>
          );
        })()}

        {/* Atlas UI navigation guide */}
        <div className="mx-5 mt-4 bg-blue-900/30 border border-blue-700/60 rounded-xl px-4 py-3 space-y-1.5">
          <p className="text-xs font-semibold text-blue-300 uppercase tracking-wider">Find in Atlas UI</p>
          <p className="text-xs text-blue-400">Atlas search doesn&apos;t support special characters or IDs. Navigate instead:</p>
          <ol className="text-xs text-blue-200 space-y-0.5 list-decimal list-inside">
            <li>Go to <span className="text-white font-medium">AI Inventory</span></li>
            <li>Open <span className="text-white font-medium">{meta.label}</span> panel</li>
            {projectIds.length > 0 && <li>Filter by project — copy Project ID below</li>}
            <li>Browse to find <span className="text-white font-medium">{resource.resource_type_display_name ?? meta.label}</span> entries</li>
          </ol>
        </div>

        {/* Fields */}
        <div className="px-5 py-4 space-y-3">
          {fields.map(({ label, value, copyLabel }) => (
            <div key={label} className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                <p className="text-sm text-gray-200 break-all font-mono">{value}</p>
              </div>
              {copyLabel && value !== "—" && <CopyButton value={value} label={copyLabel} />}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-5 pb-4 pt-1 border-t border-gray-800 flex gap-2">
          <button
            onClick={() => {
              const text = [
                `Resource ID: ${id}`,
                `Name: ${name}`,
                `Type: ${resource.resource_type_display_name ?? resource.resource_type ?? ""}`,
                `Category: ${meta.label}`,
                `Project ID(s): ${projectIds.join(", ")}`,
                `Review Status: ${reviewed ?? ""}`,
              ].join("\n");
              navigator.clipboard.writeText(text);
            }}
            className="flex-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl px-4 py-2 text-sm font-medium transition-colors"
          >
            Copy All Details
          </button>
          <button onClick={onClose} className="bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl px-4 py-2 text-sm transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ResourcePill({ resource, onClick }: { resource: AtlasResource; onClick: () => void }) {
  const name = resource.resource_display_name ?? resource.name ?? "Unnamed";
  const category = resource.resource_type_category ?? resource.resource_category;
  const reviewed = resource.reviewed ?? resource.review_status;
  const meta = categoryMeta(category);
  return (
    <button
      onClick={onClick}
      className={`inline-flex flex-col gap-1 px-3 py-2 rounded-lg border text-xs text-left cursor-pointer hover:brightness-125 transition-all ${meta.color}`}
    >
      <div className="flex items-center gap-1.5 font-medium">
        <span>{meta.icon}</span>
        <span className="truncate max-w-40">{name}</span>
      </div>
      <div className="flex items-center gap-1.5 opacity-80">
        <span>{resource.resource_type_display_name ?? meta.label}</span>
        {statusBadge(reviewed)}
      </div>
    </button>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

type Step = "input" | "results" | "applied";
type Mode = "provision" | "chain";

interface ApplyResult {
  success: boolean;
  selection_type: string;
  demo_name: string;
  message: string;
}

export default function DemoPage() {
  const [mode, setMode] = useState<Mode>("provision");

  // ── Demo Provisioning state ─────────────────────────────────────────────────
  const [step, setStep] = useState<Step>("input");
  const [useCase, setUseCase] = useState("");
  const [industry, setIndustry] = useState("Healthcare");
  const [meetingType, setMeetingType] = useState("Discovery");

  const [discovering, setDiscovering] = useState(false);
  const [discoverError, setDiscoverError] = useState<string | null>(null);
  const [result, setResult] = useState<DiscoverResult | null>(null);

  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [cleanupCount, setCleanupCount] = useState<number | null>(null);
  const [cleaningUp, setCleaningUp] = useState(false);
  const [cleanupResult, setCleanupResult] = useState<string | null>(null);
  const [autoDeploy, setAutoDeploy] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applied, setApplied] = useState<ApplyResult | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);

  // ── Session-only Atlas API key (never persisted) ───────────────────────────
  const [atlasApiKey, setAtlasApiKey] = useState("");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [apiKeyConnecting, setApiKeyConnecting] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  const [apiKeyOpen, setApiKeyOpen] = useState(false);

  // Returns headers for all demo API calls — injects SE key when present
  function demoHeaders(extra: Record<string, string> = {}): Record<string, string> {
    const h: Record<string, string> = { ...extra };
    if (atlasApiKey) h["x-atlas-api-key"] = atlasApiKey;
    return h;
  }

  async function connectApiKey() {
    if (!apiKeyInput.trim()) return;
    setApiKeyConnecting(true);
    setApiKeyError(null);
    try {
      const res = await fetch("/api/demo/chain/projects", {
        headers: { "x-atlas-api-key": apiKeyInput.trim() },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      // Key works — load projects from SE's account
      const map = buildProjectMap(data);
      const list = Object.entries(map).map(([id, meta]) => ({ id, name: meta.name, orgName: meta.orgName }));
      list.sort((a, b) => a.name.localeCompare(b.name));
      setAtlasApiKey(apiKeyInput.trim());
      setApiKeyInput("");
      setChainProjects(list);
      setSelectedProjectId(list[0]?.id ?? "");
      setApiKeyOpen(false);
      setCleanupCount(null);
      setCleanupResult(null);
    } catch (err) {
      setApiKeyError(`Invalid key: ${String(err)}`);
    } finally {
      setApiKeyConnecting(false);
    }
  }

  function disconnectApiKey() {
    setAtlasApiKey("");
    setApiKeyInput("");
    setApiKeyError(null);
    setChainProjects([]);
    setSelectedProjectId("");
    setProjectsLoaded(false); // triggers reload with env key
    setCleanupCount(null);
    setCleanupResult(null);
  }

  // ── Project selection (shared between provision + chain) ───────────────────
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [chainProjects, setChainProjects] = useState<{ id: string; name: string; orgName: string }[]>([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);

  // Load projects on mount — needed for both provision and chain modes
  // Skip if SE has connected their own key (projects already loaded by connectApiKey)
  useEffect(() => {
    if (projectsLoaded || atlasApiKey) return;
    setProjectsLoaded(true);
    fetch("/api/demo/chain/projects")
      .then((r) => r.json())
      .then((data) => {
        const map = buildProjectMap(data);
        const list = Object.entries(map).map(([id, meta]) => ({ id, name: meta.name, orgName: meta.orgName }));
        list.sort((a, b) => a.name.localeCompare(b.name));
        setChainProjects(list);
        // Default to Tadeo-Demo-Environment project, fallback to first
        const preferred = list.find((p) => p.id === "606cbc7b-9329-4288-bf55-06210ca43e97");
        setSelectedProjectId((preferred ?? list[0])?.id ?? "");
      })
      .catch(() => {});
  }, [projectsLoaded, atlasApiKey]);

  // ── Chain of Custody state ──────────────────────────────────────────────────
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [chainResult, setChainResult] = useState<ChainScanResult | null>(null);

  // ── Chain of Custody: Scan ─────────────────────────────────────────────────

  async function handleChainScan() {
    if (scanning) return;
    setScanning(true);
    setScanError(null);
    setChainResult(null);
    try {
      const res = await fetch("/api/demo/chain");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setChainResult(data);
    } catch (err) {
      setScanError(String(err));
    } finally {
      setScanning(false);
    }
  }

  // ── Step 1: Discover ────────────────────────────────────────────────────────

  async function handleDiscover() {
    if (!useCase.trim() || discovering) return;
    setDiscovering(true);
    setDiscoverError(null);

    try {
      const res = await fetch("/api/demo/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          use_case: useCase,
          industry,
          meeting_type: meetingType,
        }),
      });
      const data: DiscoverResult = await res.json();
      if (!res.ok) throw new Error((data as { error?: string }).error ?? `HTTP ${res.status}`);
      setResult(data);

      if (autoDeploy) {
        // Auto-apply the top-scored match without showing Step 2
        setApplying(true);
        setApplyError(null);
        try {
          let body: Record<string, unknown>;
          if (data.recommendation === "existing" && data.existing_matches.length > 0) {
            body = {
              selection_type: "existing",
              template_name: data.existing_matches[0].template_name,
              project_id: selectedProjectId,
            };
          } else {
            body = {
              selection_type: "custom",
              demo_name: data.custom_recommendation.suggested_name,
              description: data.custom_recommendation.description,
              project_id: selectedProjectId,
              rules: data.custom_recommendation.rules.map((r) => ({ rule_type: r.rule_type })),
            };
          }
          const applyRes = await fetch("/api/demo/apply", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
          });
          const applyData = await applyRes.json();
          if (!applyRes.ok) throw new Error(applyData.error ?? `HTTP ${applyRes.status}`);
          setApplied(applyData);
          setStep("applied");
        } catch (err) {
          setApplyError(String(err));
          setStep("results"); // fall back to manual review on error
        } finally {
          setApplying(false);
        }
      } else {
        setStep("results");
      }
    } catch (err) {
      setDiscoverError(String(err));
    } finally {
      setDiscovering(false);
    }
  }

  // ── Step 2: Apply ───────────────────────────────────────────────────────────


  // ── Reset ───────────────────────────────────────────────────────────────────

  async function handleApplyExisting(templateName: string) {
    setApplying(true);
    setApplyError(null);
    try {
      const res = await fetch("/api/demo/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selection_type: "existing",
          template_name: templateName,
          project_id: selectedProjectId,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setApplied(data);
      setStep("applied");
    } catch (err) {
      setApplyError(String(err));
    } finally {
      setApplying(false);
    }
  }

  async function handleApplyCustom() {
    if (!result) return;
    setApplying(true);
    setApplyError(null);
    try {
      const res = await fetch("/api/demo/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selection_type: "custom",
          demo_name: result.custom_recommendation.suggested_name,
          description: result.custom_recommendation.description,
          project_id: selectedProjectId,
          rules: result.custom_recommendation.rules.map((r) => ({ rule_type: r.rule_type })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setApplied(data);
      setStep("applied");
    } catch (err) {
      setApplyError(String(err));
    } finally {
      setApplying(false);
    }
  }

  async function checkCleanup() {
    if (!selectedProjectId) return;
    const res = await fetch(`/api/demo/cleanup?project_id=${selectedProjectId}`, {
      headers: demoHeaders(),
    });
    const data = await res.json();
    setCleanupCount(data.count ?? 0);
    setCleanupResult(null);
  }

  async function handleCleanup() {
    if (!selectedProjectId || cleaningUp) return;
    const projectName = chainProjects.find((p) => p.id === selectedProjectId)?.name ?? selectedProjectId;
    const confirmed = window.confirm(
      `Delete all scenario resources from "${projectName}"?\n\nThis cannot be undone.`
    );
    if (!confirmed) return;
    setCleaningUp(true);
    setCleanupResult(null);
    try {
      const res = await fetch(`/api/demo/cleanup?project_id=${selectedProjectId}`, {
        method: "DELETE",
        headers: demoHeaders(),
      });
      const data = await res.json();
      setCleanupResult(`Deleted ${data.deleted_count} resources${data.failed_count > 0 ? `, ${data.failed_count} failed` : ""}.`);
      setCleanupCount(0);
    } catch (err) {
      setCleanupResult(`Error: ${String(err)}`);
    } finally {
      setCleaningUp(false);
    }
  }

  async function handleScenario(scenarioId: string) {
    const s = SCENARIO_TEMPLATES.find((t) => t.id === scenarioId);
    if (!s || !selectedProjectId) return;
    setActiveScenario(scenarioId);
    setResult(null);
    setApplied(null);
    setApplyError(null);
    setDiscoverError(null);
    // Bypass n8n discover/apply — call the direct Atlas API route
    setApplying(true);
    try {
      const res = await fetch("/api/demo/chain/scenario", {
        method: "POST",
        headers: demoHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ scenario_id: scenarioId, project_id: selectedProjectId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setApplied({
        success: true,
        selection_type: "scenario",
        demo_name: s.label,
        message: `Provisioned ${data.created?.length ?? 0} resources for "${s.label}" in Atlas.`,
      });
      setStep("applied");
    } catch (err) {
      setApplyError(String(err));
    } finally {
      setApplying(false);
      setActiveScenario(null);
    }
  }

  function reset() {
    setStep("input");
    setUseCase("");
    setIndustry("Healthcare");
    setMeetingType("Discovery");
    setResult(null);
    setApplied(null);
    setSelectedTemplate(null);
    setApplyError(null);
    setDiscoverError(null);
    setActiveScenario(null);
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <Link href="/" className="text-gray-400 hover:text-white text-sm mr-2">
          ← Back
        </Link>
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-sm">
          D
        </div>
        <div>
          <h1 className="font-semibold text-white">
            {mode === "provision" ? "Demo Provisioning" : "AI Chain of Custody"}
          </h1>
          <p className="text-xs text-gray-400">
            {mode === "provision"
              ? "Describe the customer use case → get ranked Atlas templates → provision"
              : "Scan Atlas Inventory to visualize how AI artifacts are connected"}
          </p>
        </div>

        {/* Mode toggle + step indicator */}
        <div className="ml-auto flex items-center gap-3">
          {/* Tab toggle */}
          <div className="flex rounded-lg overflow-hidden border border-gray-700 text-xs">
            <button
              onClick={() => setMode("provision")}
              className={`px-3 py-1.5 transition-colors ${
                mode === "provision"
                  ? "bg-emerald-700 text-white font-medium"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              Demo Prep
            </button>
            <button
              onClick={() => setMode("chain")}
              className={`px-3 py-1.5 transition-colors ${
                mode === "chain"
                  ? "bg-emerald-700 text-white font-medium"
                  : "bg-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              Chain of Custody
            </button>
          </div>

          {/* Step indicator — only for provision mode */}
          {mode === "provision" && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className={step === "input" ? "text-white font-medium" : ""}>1. Use Case</span>
              <span>›</span>
              <span className={step === "results" ? "text-white font-medium" : ""}>2. Template Match</span>
              <span>›</span>
              <span className={step === "applied" ? "text-white font-medium" : ""}>3. Provisioned</span>
            </div>
          )}

          <button
            onClick={() => setHelpOpen(true)}
            className="w-7 h-7 rounded-full bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold flex items-center justify-center transition-colors"
            title="Help"
          >
            ?
          </button>
        </div>
      </header>
      <HelpPanel page="demo" open={helpOpen} onClose={() => setHelpOpen(false)} />

      <main className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">

          {/* ── Chain of Custody mode ─────────────────────────────────────── */}
          {mode === "chain" && <ChainView scanning={scanning} scanError={scanError} chainResult={chainResult} onScan={handleChainScan} projects={chainProjects} />}

          {/* ── Demo Provisioning mode ────────────────────────────────────── */}
          {mode === "provision" && <>

          {/* ── Step 1: Input ─────────────────────────────────────────────── */}
          {step === "input" && (
            <div className="space-y-6">

              {/* Atlas Account — session-only API key */}
              <div className="rounded-xl border border-gray-700 bg-gray-900/50 overflow-hidden">
                <button
                  onClick={() => setApiKeyOpen((o) => !o)}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">🔑</span>
                    <span className="font-medium text-gray-300">Atlas Account</span>
                    {atlasApiKey ? (
                      <span className="text-xs text-emerald-400 bg-emerald-900/30 border border-emerald-700 rounded-full px-2 py-0.5">SE key connected</span>
                    ) : (
                      <span className="text-xs text-gray-500">using admin key</span>
                    )}
                  </div>
                  <span className="text-gray-500 text-xs">{apiKeyOpen ? "▲" : "▼"}</span>
                </button>

                {apiKeyOpen && (
                  <div className="border-t border-gray-700 px-4 py-4 space-y-3">
                    {atlasApiKey ? (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-400">Your Atlas API key is active for this session. Projects and resources will use your Atlas environment.</p>
                        <button
                          onClick={disconnectApiKey}
                          className="ml-4 shrink-0 text-xs text-red-400 hover:text-red-300 border border-red-800 hover:border-red-600 rounded-lg px-3 py-1.5 transition-colors"
                        >
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-gray-400">
                          Enter your Atlas API key to provision demos into your own Atlas environment. Key is never stored — session only.
                        </p>
                        <p className="text-xs text-gray-500">
                          To create a key: <span className="text-gray-300">Admin Console → Permissions → API Keys → Add API Key</span> (type: Custom Integrations). Copy and save it locally — Atlas only shows it once.
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            value={apiKeyInput}
                            onChange={(e) => setApiKeyInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && connectApiKey()}
                            placeholder="Atlas API key"
                            className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                          />
                          <button
                            onClick={connectApiKey}
                            disabled={!apiKeyInput.trim() || apiKeyConnecting}
                            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                          >
                            {apiKeyConnecting ? "Connecting…" : "Connect"}
                          </button>
                        </div>
                        {apiKeyError && <p className="text-xs text-red-400">{apiKeyError}</p>}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Start Scenarios */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Quick Start Scenarios</h2>
                <p className="text-sm text-gray-400 mb-4">
                  Pick a pre-built scenario to instantly match and provision the right Atlas template — or describe a custom use case below.
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {SCENARIO_TEMPLATES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleScenario(s.id)}
                      disabled={applying}
                      className={`text-left rounded-xl border-2 p-4 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                        activeScenario === s.id ? s.activeColor : s.color
                      }`}
                    >
                      <div className="text-2xl mb-2">{s.icon}</div>
                      <p className="text-sm font-semibold text-white mb-1">{s.label}</p>
                      <p className="text-xs text-gray-400 leading-snug">{s.description}</p>
                      <p className={`text-xs mt-3 font-medium ${s.tagColor}`}>
                        {s.industry} · {s.meetingType}
                      </p>
                    </button>
                  ))}
                </div>
                {applying && activeScenario && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-400">
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    Provisioning {SCENARIO_TEMPLATES.find(s => s.id === activeScenario)?.label} in Atlas…
                  </div>
                )}
                {applyError && step === "input" && (
                  <div className="mt-3 bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 text-sm text-red-300">
                    {applyError}
                  </div>
                )}
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h2 className="text-lg font-semibold text-white mb-1">
                  Or Describe a Custom Use Case
                </h2>
                <p className="text-sm text-gray-400">
                  Be specific — the more detail you provide, the better Claude can
                  match to an Atlas template or build a custom one.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Use Case
                </label>
                <textarea
                  rows={6}
                  className="w-full bg-gray-800 text-gray-100 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-gray-500"
                  placeholder="e.g. Healthcare company where nurses are using ChatGPT to summarize patient notes, creating HIPAA risk through PII leakage to external models..."
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Industry
                  </label>
                  <select
                    className="w-full bg-gray-800 text-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    {INDUSTRIES.map((i) => (
                      <option key={i} value={i}>
                        {i}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Meeting Type
                  </label>
                  <select
                    className="w-full bg-gray-800 text-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    value={meetingType}
                    onChange={(e) => setMeetingType(e.target.value)}
                  >
                    {MEETING_TYPES.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Project selector */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Atlas Project
                </label>
                <p className="text-xs text-red-400 font-medium mb-2">
                  ⚠ Select YOUR project — do not provision into someone else&apos;s environment
                </p>
                {chainProjects.length > 0 ? (
                  <select
                    className="w-full bg-gray-800 text-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                  >
                    {chainProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {p.orgName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    className="w-full bg-gray-800 text-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-gray-500"
                    placeholder="Paste Atlas project ID (loading projects…)"
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                  />
                )}
              </div>

              {/* Cleanup button */}
              {selectedProjectId && (
                <div className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-200">Clean Up Demo Resources</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Remove scenario resources from this project before a fresh demo run
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={checkCleanup}
                        className="text-xs px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                      >
                        Check
                      </button>
                      <button
                        onClick={handleCleanup}
                        disabled={cleaningUp || cleanupCount === 0}
                        className="text-xs px-3 py-1.5 rounded-lg bg-red-800 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors"
                      >
                        {cleaningUp ? "Cleaning…" : "Delete All"}
                      </button>
                    </div>
                  </div>
                  {cleanupCount !== null && (
                    <p className={`text-xs ${cleanupCount > 0 ? "text-amber-400" : "text-green-400"}`}>
                      {cleanupCount > 0 ? `${cleanupCount} scenario resource(s) found in this project` : "No scenario resources found — project is clean"}
                    </p>
                  )}
                  {cleanupResult && (
                    <p className="text-xs text-emerald-400">{cleanupResult}</p>
                  )}
                </div>
              )}

              {/* Auto-deploy toggle */}
              <div className="flex items-center justify-between bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-200">Auto-deploy best match</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Skip review — Claude picks and deploys the top match automatically
                  </p>
                </div>
                <button
                  onClick={() => setAutoDeploy((v) => !v)}
                  role="switch"
                  aria-checked={autoDeploy}
                  className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ml-4 ${
                    autoDeploy ? "bg-emerald-600" : "bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      autoDeploy ? "translate-x-5" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              {discoverError && (
                <div className="bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 text-sm text-red-300">
                  {discoverError}
                </div>
              )}

              <button
                onClick={handleDiscover}
                disabled={discovering || !useCase.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 text-sm font-medium transition-colors"
              >
                {discovering
                  ? applying
                    ? "Deploying…"
                    : "Analyzing with Claude…"
                  : autoDeploy
                  ? "Analyze & Auto-Deploy →"
                  : "Find Matching Templates →"}
              </button>
            </div>
          )}

          {/* ── Step 2: Results ───────────────────────────────────────────── */}
          {step === "results" && result && (
            <div className="space-y-6">
              {/* Recommendation banner */}
              <div
                className={`rounded-xl px-5 py-4 border ${
                  result.recommendation === "existing"
                    ? "bg-green-900/30 border-green-700"
                    : "bg-blue-900/30 border-blue-700"
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">
                    {result.recommendation === "existing" ? "✅" : "🔧"}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {result.recommendation === "existing"
                        ? "Use an existing template"
                        : "Build a custom template"}
                    </p>
                    <p className="text-sm text-gray-300 mt-1">
                      {result.recommendation_reason}
                    </p>
                  </div>
                </div>
              </div>

              {/* Existing templates */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Existing Templates
                </h3>
                <div className="space-y-3">
                  {result.existing_matches.map((m) => (
                    <div
                      key={m.template_name}
                      className="bg-gray-800 border border-gray-700 rounded-xl p-4"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          <p className="font-medium text-white">{m.template_name}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Rules: {m.rules_included.join(", ")}
                          </p>
                        </div>
                        {m.match_score >= 75 && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => setSelectedTemplate(selectedTemplate === m.template_name ? null : m.template_name)}
                              className="shrink-0 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                            >
                              How to Apply
                            </button>
                            <button
                              onClick={() => handleApplyExisting(m.template_name)}
                              disabled={applying}
                              className="shrink-0 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                            >
                              {applying ? "Applying…" : "Apply This →"}
                            </button>
                          </div>
                        )}
                      </div>
                      <ScoreBar score={m.match_score} />
                      <p className="text-xs text-gray-400 mt-2">{m.match_reason}</p>

                      {/* Inline guide panel */}
                      {selectedTemplate === m.template_name && (
                        <div className="mt-4 bg-emerald-950/50 border border-emerald-700/50 rounded-xl p-4 space-y-2">
                          <p className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">How to apply in Atlas UI</p>
                          <ol className="text-xs text-emerald-200 space-y-1.5 list-decimal list-inside leading-relaxed">
                            <li>Go to <span className="text-white font-medium">AI Runtime → Policies</span></li>
                            <li>Select your demo endpoint from the endpoint list</li>
                            <li>Click <span className="text-white font-medium">Policy Templates</span></li>
                            <li>Find <span className="text-white font-medium">{m.template_name}</span> and click <span className="text-white font-medium">Apply</span></li>
                            <li>The rules will be installed on that endpoint immediately</li>
                          </ol>
                          <p className="text-xs text-emerald-400 mt-2">
                            💡 Templates apply the guardrail settings configured at the org level — no additional setup needed.
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom recommendation */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Custom Recommendation
                </h3>
                <div className="bg-gray-800 border border-gray-700 rounded-xl p-4">
                  <div className="mb-3">
                    <p className="font-medium text-white">
                      {result.custom_recommendation.suggested_name}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">
                      {result.custom_recommendation.description}
                    </p>
                  </div>

                  <div className="space-y-2 mb-4">
                    {result.custom_recommendation.rules.map((r, i) => (
                      <div
                        key={i}
                        className="flex gap-3 bg-gray-700/50 rounded-lg px-3 py-2"
                      >
                        <span className="text-xs font-mono text-emerald-400 shrink-0 pt-0.5">
                          {r.rule_type}
                        </span>
                        <span className="text-xs text-gray-400">{r.reason}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-700 pt-3 flex items-start gap-3">
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">
                        To build this custom template: go to <span className="text-gray-300">AI Runtime → Policies</span>, install each rule above on your demo endpoint, then create a template from those settings via <span className="text-gray-300">Policy Templates → Create Custom Template</span>.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const rules = result.custom_recommendation.rules
                          .map((r) => `${r.rule_type} — ${r.reason}`)
                          .join("\n");
                        navigator.clipboard.writeText(
                          `Template: ${result.custom_recommendation.suggested_name}\n\nDescription: ${result.custom_recommendation.description}\n\nRules:\n${rules}`
                        );
                      }}
                      className="shrink-0 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              {applyError && (
                <div className="bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 text-sm text-red-300">
                  {applyError}
                </div>
              )}

              <button
                onClick={reset}
                className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
              >
                ← Start over
              </button>
            </div>
          )}

          {/* ── Step 3: Applied ───────────────────────────────────────────── */}
          {step === "applied" && applied && (
            <div className="text-center py-16 space-y-6">
              <div className="text-6xl">
                {applied.success ? "✅" : "❌"}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">
                  {applied.success ? "Demo Environment Ready" : "Provisioning Failed"}
                </h2>
                <p className="text-gray-400 text-sm max-w-lg mx-auto">
                  {applied.message}
                </p>
              </div>

              {applied.success && (
                <div className="bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 text-left max-w-md mx-auto">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Template Provisioned</p>
                  <p className="font-medium text-white">{applied.demo_name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Type: {applied.selection_type === "existing" ? "Existing template applied" : "Custom template created & applied"}
                  </p>
                </div>
              )}

              <div className="flex gap-3 justify-center pt-4">
                <button
                  onClick={reset}
                  className="bg-gray-700 hover:bg-gray-600 text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  Provision Another
                </button>
                <Link
                  href="/meeting"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-colors"
                >
                  Go to Meeting Readiness →
                </Link>
              </div>
            </div>
          )}

          </> /* end provision mode */}
        </div>
      </main>
    </div>
  );
}

// ─── Chain of Custody View ────────────────────────────────────────────────────

// Build a map of project_id → { name, orgName } from whatever shape Atlas returns
function buildProjectMap(orgProjects: unknown): Record<string, { name: string; orgName: string }> {
  const map: Record<string, { name: string; orgName: string }> = {};
  if (!orgProjects || typeof orgProjects !== "object") return map;

  // Try array of orgs, each with projects array
  // Atlas returns: organization_name, projects: [{ project_id, project_name, ... }]
  const tryOrgsArray = (orgs: AtlasProject[]) => {
    for (const org of orgs) {
      const orgName = org.organization_name ?? org.name ?? org.display_name ?? "";
      const projects: AtlasProject[] = org.projects ?? [];
      for (const p of projects) {
        const pid = p.project_id ?? p.id ?? "";
        if (pid) map[pid] = { name: p.project_name ?? p.name ?? p.display_name ?? pid, orgName };
      }
    }
  };

  // Try flat array of projects (each with org info embedded)
  const tryFlatArray = (items: AtlasProject[]) => {
    for (const item of items) {
      const pid = item.project_id ?? item.id ?? "";
      if (pid) {
        map[pid] = {
          name: item.project_name ?? item.name ?? item.display_name ?? pid,
          orgName: item.organization_name ?? "",
        };
      }
    }
  };

  const data = orgProjects as Record<string, unknown>;
  if (Array.isArray(data)) {
    // Could be array of orgs or flat array of projects
    const first = data[0] as AtlasProject | undefined;
    if (first?.projects) tryOrgsArray(data as AtlasProject[]);
    else tryFlatArray(data as AtlasProject[]);
  } else {
    // Could be { organizations: [...] } or { projects: [...] }
    if (Array.isArray(data.organizations)) tryOrgsArray(data.organizations as AtlasProject[]);
    else if (Array.isArray(data.projects)) tryFlatArray(data.projects as AtlasProject[]);
    else if (Array.isArray(data.data)) tryFlatArray(data.data as AtlasProject[]);
  }
  return map;
}

function groupByCategory(resources: AtlasResource[]): Record<string, AtlasResource[]> {
  const grouped = CHAIN_LAYER_ORDER.reduce<Record<string, AtlasResource[]>>(
    (acc, cat) => {
      const items = resources.filter((r) => (r.resource_type_category ?? r.resource_category) === cat);
      if (items.length) acc[cat] = items;
      return acc;
    },
    {}
  );
  for (const r of resources) {
    const cat = r.resource_type_category ?? r.resource_category ?? "unknown";
    if (!CHAIN_LAYER_ORDER.includes(cat)) {
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(r);
    }
  }
  return grouped;
}

const LAYER_PAGE_SIZE = 10;

function ProjectChain({
  projectId,
  resources,
  projectMeta,
  matchedIds,
  matchReasons,
}: {
  projectId: string;
  resources: AtlasResource[];
  projectMeta?: { name: string; orgName: string };
  matchedIds: Set<string>;
  matchReasons: Record<string, string>;
}) {
  const grouped = groupByCategory(resources);
  const layers = Object.keys(grouped);
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({});
  const [selectedResource, setSelectedResource] = useState<AtlasResource | null>(null);

  const approved   = resources.filter((r) => (r.reviewed ?? r.review_status)?.toLowerCase() === "approved").length;
  const unreviewed = resources.filter((r) => (r.reviewed ?? r.review_status)?.toLowerCase() === "unreviewed").length;
  const rejected   = resources.filter((r) => (r.reviewed ?? r.review_status)?.toLowerCase() === "unapproved").length;
  const categoryCount = layers.length;

  // If search active, highlight matched resources
  const hasSearch = matchedIds.size > 0;
  const projectHasMatch = hasSearch && resources.some((r) => matchedIds.has(r.resource_instance_id ?? ""));

  // Hide non-matching projects entirely when search is active
  if (hasSearch && !projectHasMatch) return null;

  return (
    <div className={`bg-gray-800/50 border rounded-xl p-4 space-y-4 transition-all ${
      hasSearch ? "border-emerald-600 shadow-lg shadow-emerald-900/30" : "border-gray-700"
    }`}>
      {/* Project header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white">{projectMeta?.name ?? projectId}</p>
          {projectMeta?.orgName && <p className="text-xs text-gray-500 mt-0.5">{projectMeta.orgName}</p>}
          <p className="text-xs font-mono text-gray-600 mt-0.5">{projectId}</p>
          <div className="flex gap-3 mt-1 text-xs">
            <span className="text-gray-300">{resources.length} resources</span>
            <span className="text-gray-600">·</span>
            <span className="text-gray-300">{categoryCount} layer{categoryCount !== 1 ? "s" : ""}</span>
            <span className="text-gray-600">·</span>
            <span className="text-green-400">{approved} approved</span>
            {unreviewed > 0 && <><span className="text-gray-600">·</span><span className="text-yellow-400">{unreviewed} unreviewed</span></>}
            {rejected > 0 && <><span className="text-gray-600">·</span><span className="text-red-400">{rejected} rejected</span></>}
          </div>
        </div>
      </div>

      {selectedResource && (
        <ResourceDetailModal resource={selectedResource} onClose={() => setSelectedResource(null)} />
      )}

      {/* Layer chain — when search active, only show layers/resources that matched */}
      <div className="space-y-2">
        {layers.map((cat, idx) => {
          const meta = categoryMeta(cat);
          const items = grouped[cat];

          // When search active, filter to only matched resources in this layer
          const displayItems = hasSearch
            ? items.filter((r) => matchedIds.has(r.resource_instance_id ?? r.id ?? ""))
            : items;

          // Skip this layer entirely if search active and nothing matched
          if (hasSearch && displayItems.length === 0) return null;

          const isExpanded = expandedLayers[cat] ?? false;
          const visible = (hasSearch || isExpanded) ? displayItems : displayItems.slice(0, LAYER_PAGE_SIZE);
          const overflow = displayItems.length - LAYER_PAGE_SIZE;

          return (
            <div key={cat}>
              <div className="bg-gray-900/60 border border-gray-700/60 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  {meta.icon} {meta.label} {hasSearch ? `(${displayItems.length} matched)` : `(${items.length})`}
                </p>
                <div className="flex flex-wrap gap-2">
                  {visible.map((r, i) => {
                    const rid = r.resource_instance_id ?? r.id ?? String(i);
                    const isMatch = matchedIds.has(rid);
                    const reason = matchReasons[rid];
                    return (
                      <div key={rid} className={`flex items-start gap-2 ${isMatch ? "ring-2 ring-emerald-500 rounded-lg" : ""}`}>
                        <ResourcePill resource={r} onClick={() => setSelectedResource(r)} />
                        {isMatch && reason && (
                          <div className="flex items-start gap-1.5 bg-emerald-900/40 border border-emerald-700/60 rounded-lg px-2.5 py-1.5 max-w-xs self-stretch">
                            <span className="text-emerald-400 text-xs shrink-0 mt-0.5">✓</span>
                            <div>
                              <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider leading-none mb-1">Use Case Match</p>
                              <p className="text-emerald-200 text-xs leading-snug">{reason}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {overflow > 0 && (
                  <button
                    onClick={() => setExpandedLayers((prev) => ({ ...prev, [cat]: !isExpanded }))}
                    className="mt-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    {isExpanded ? "Show less ↑" : `Show ${overflow} more ↓`}
                  </button>
                )}
              </div>
              {idx < layers.length - 1 && (
                <div className="flex justify-center py-1 text-gray-600 text-lg select-none">↓</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface SearchResult {
  summary: string;
  matches: { id: string; reason: string }[];
}

// ─── Mock Scenario Builder ────────────────────────────────────────────────────

const SCENARIO_ICONS: Record<string, string> = {
  healthcare: "🏥",
  finance: "💹",
  ecommerce: "🛒",
};

function MockScenarioBuilder({ projects }: { projects: { id: string; name: string; orgName: string }[] }) {
  const [scenarios, setScenarios] = useState<ScenarioDef[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [customProjectId, setCustomProjectId] = useState<string>("");
  const [creating, setCreating] = useState(false);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  // Load scenario definitions on first open
  useEffect(() => {
    if (!open || scenarios.length > 0) return;
    fetch("/api/demo/chain/scenario")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setScenarios(data);
      })
      .catch(() => { /* ignore */ });
  }, [open, scenarios.length]);

  // Pre-select project when list loads
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0].id);
    }
  }, [projects, selectedProject]);

  const projectId = selectedProject || customProjectId.trim();
  const canCreate = selectedScenario && projectId && !creating;

  async function handleCreate() {
    if (!canCreate) return;
    setCreating(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/demo/chain/scenario", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario_id: selectedScenario, project_id: projectId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail ?? data.error ?? `HTTP ${res.status}`);
      setResult(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setCreating(false);
    }
  }

  const chosenScenario = scenarios.find((s) => s.id === selectedScenario);
  const chosenProjectName = projects.find((p) => p.id === projectId)?.name ?? projectId;

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden">
      {/* Header — toggles open/close */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-700/30 transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🧪</span>
          <div>
            <p className="text-sm font-semibold text-white">Build Mock Scenario</p>
            <p className="text-xs text-gray-400">
              Create a realistic &quot;cradle to grave&quot; AI chain in your Atlas project
            </p>
          </div>
        </div>
        <span className="text-gray-500 text-lg select-none">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-5 border-t border-gray-700">
          <p className="text-xs text-gray-500 pt-4">
            Select a scenario template and your Atlas project. This will create mock AI artifacts
            (libraries → LLM endpoint → model → dataset) in Atlas so you can demonstrate a full
            chain of custody in the inventory.
          </p>

          {/* Scenario selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Scenario Template
            </label>
            <div className="space-y-2">
              {scenarios.length === 0 && (
                <p className="text-xs text-gray-500 animate-pulse">Loading scenarios…</p>
              )}
              {scenarios.map((s) => (
                <button
                  key={s.id}
                  onClick={() => { setSelectedScenario(s.id); setResult(null); setError(null); }}
                  className={`w-full text-left rounded-xl border px-4 py-3 transition-all ${
                    selectedScenario === s.id
                      ? "border-emerald-500 bg-emerald-900/20"
                      : "border-gray-700 hover:border-gray-600 bg-gray-900/40"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg mt-0.5">{SCENARIO_ICONS[s.id] ?? "🤖"}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">{s.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5 leading-snug">{s.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {s.layers.map((l) => (
                          <span key={l} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700 text-gray-300 font-mono">
                            {l}
                          </span>
                        ))}
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-700/50 text-gray-500">
                          {s.resource_count} resources
                        </span>
                      </div>
                    </div>
                    {selectedScenario === s.id && (
                      <span className="text-emerald-400 text-base shrink-0">✓</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Project selector */}
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Target Atlas Project
            </label>
            {projects.length > 0 ? (
              <select
                value={selectedProject}
                onChange={(e) => { setSelectedProject(e.target.value); setResult(null); setError(null); }}
                className="w-full bg-gray-900 text-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 border border-gray-700"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}{p.orgName ? ` — ${p.orgName}` : ""}
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-1.5">
                <input
                  type="text"
                  placeholder="Paste your Atlas Project UUID"
                  value={customProjectId}
                  onChange={(e) => { setCustomProjectId(e.target.value); setResult(null); setError(null); }}
                  className="w-full bg-gray-900 text-gray-100 rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-600 border border-gray-700 placeholder-gray-600"
                />
                <p className="text-xs text-gray-500">
                  Projects will auto-populate after scanning. Paste a project UUID manually if needed.
                </p>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          {/* Success result */}
          {result && (
            <div className="bg-emerald-900/20 border border-emerald-700/60 rounded-xl px-4 py-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400 text-lg">✓</span>
                <p className="text-sm font-semibold text-emerald-300">Scenario Created</p>
              </div>
              <p className="text-xs text-emerald-400">{result.scenario_name} → {chosenProjectName}</p>

              <div className="space-y-1.5">
                {result.created.map((r, i) => (
                  <div key={r.id} className="flex items-center gap-2 bg-gray-900/60 rounded-lg px-3 py-2">
                    <span className="text-gray-500 text-xs w-4 shrink-0">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-200 truncate">{r.name}</p>
                      <p className="text-[10px] text-gray-500 font-mono">{r.resource_type} · {r.category || "pending categorization"}</p>
                    </div>
                    <span className="text-[10px] font-mono text-gray-600 truncate max-w-24">{r.id.slice(0, 8)}…</span>
                  </div>
                ))}
              </div>

              {result.dependencies_linked && (
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <span>🔗</span>
                  <span>Dependencies linked — chain visible in Atlas Inventory</span>
                </div>
              )}

              {result.errors.length > 0 && (
                <div className="space-y-1">
                  {result.errors.map((e, i) => (
                    <p key={i} className="text-xs text-yellow-400">⚠ {e}</p>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-500">
                Resources are now in your Atlas project. Re-scan the inventory to see them in the chain visualization.
              </p>

              <button
                onClick={() => { setResult(null); setSelectedScenario(""); }}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
              >
                Build another scenario →
              </button>
            </div>
          )}

          {/* Create button */}
          {!result && (
            <button
              onClick={handleCreate}
              disabled={!canCreate}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 text-sm font-medium transition-colors"
            >
              {creating
                ? "Creating in Atlas…"
                : chosenScenario
                ? `Create "${chosenScenario.name}" in Atlas →`
                : "Select a scenario to continue"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function ChainView({
  scanning,
  scanError,
  chainResult,
  onScan,
  projects,
}: {
  scanning: boolean;
  scanError: string | null;
  chainResult: ChainScanResult | null;
  onScan: () => void;
  projects: { id: string; name: string; orgName: string }[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const resources: AtlasResource[] = chainResult?.resources?.resources ?? [];
  const projectMap = buildProjectMap(chainResult?.org_projects);

  // Group by project_id — use project_ids array (first entry)
  const byProject = resources.reduce<Record<string, AtlasResource[]>>((acc, r) => {
    const pid = (Array.isArray(r.project_ids) ? r.project_ids[0] : null) ?? r.project_id ?? r.project ?? "No Project";
    if (!acc[pid]) acc[pid] = [];
    acc[pid].push(r);
    return acc;
  }, {});

  const projectIds = Object.keys(byProject);
  projectIds.sort((a, b) => {
    const catsA = new Set(byProject[a].map((r) => r.resource_type_category ?? r.resource_category)).size;
    const catsB = new Set(byProject[b].map((r) => r.resource_type_category ?? r.resource_category)).size;
    return catsB - catsA;
  });

  const matchedIds = new Set((searchResult?.matches ?? []).map((m) => m.id));
  const matchReasons = Object.fromEntries((searchResult?.matches ?? []).map((m) => [m.id, m.reason]));

  // Build a name+type → reason map so we can match even when IDs differ due to deduplication
  const matchedNameKeys = new Set((searchResult?.matches ?? []).map((m) => {
    const r = resources.find((r) => (r.resource_instance_id ?? r.id) === m.id);
    return r ? `${r.resource_display_name}||${r.resource_type_category}` : m.id;
  }));
  const matchReasonsById: Record<string, string> = {};
  for (const r of resources) {
    const nameKey = `${r.resource_display_name}||${r.resource_type_category}`;
    const directMatch = searchResult?.matches?.find((m) => m.id === (r.resource_instance_id ?? r.id));
    const nameMatch = matchedNameKeys.has(nameKey)
      ? searchResult?.matches?.find((m) => {
          const mr = resources.find((rr) => (rr.resource_instance_id ?? rr.id) === m.id);
          return mr && `${mr.resource_display_name}||${mr.resource_type_category}` === nameKey;
        })
      : undefined;
    const match = directMatch ?? nameMatch;
    if (match) matchReasonsById[r.resource_instance_id ?? r.id ?? ""] = match.reason;
  }
  const effectiveMatchedIds = new Set(Object.keys(matchReasonsById));

  const approved   = resources.filter((r) => (r.reviewed ?? r.review_status)?.toLowerCase() === "approved").length;
  const unreviewed = resources.filter((r) => (r.reviewed ?? r.review_status)?.toLowerCase() === "unreviewed").length;
  const rejected   = resources.filter((r) => (r.reviewed ?? r.review_status)?.toLowerCase() === "unapproved").length;

  async function handleSearch() {
    if (!searchQuery.trim() || searching || resources.length === 0) return;
    setSearching(true);
    setSearchError(null);
    setSearchResult(null);
    try {
      const res = await fetch("/api/demo/chain/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, resources }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
      setSearchResult(data);
    } catch (err) {
      setSearchError(String(err));
    } finally {
      setSearching(false);
    }
  }


  return (
    <div className="space-y-6">
      {/* Intro */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-1">AI Chain of Custody</h2>
        <p className="text-sm text-gray-400">
          Scan the Atlas AI Inventory to discover every AI artifact across all projects
          and visualize how they&apos;re connected — from libraries and frameworks
          through to LLM endpoints and models.
        </p>
      </div>

      {/* Mock Scenario Builder */}
      <MockScenarioBuilder projects={projects} />

      {/* Scan button */}
      <button
        onClick={onScan}
        disabled={scanning}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 text-sm font-medium transition-colors"
      >
        {scanning ? "Scanning Atlas Inventory…" : chainResult ? "Re-Scan Inventory" : "Scan AI Inventory →"}
      </button>

      {/* Error */}
      {scanError && (
        <div className="bg-red-900/40 border border-red-700 rounded-xl px-4 py-3 text-sm text-red-300">
          {scanError}
        </div>
      )}

      {/* Empty */}
      {chainResult && resources.length === 0 && !scanError && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl px-5 py-8 text-center text-sm text-gray-400">
          No resources found. Link a cloud account or code repository in Atlas AI Inventory to begin discovery.
        </div>
      )}

      {resources.length > 0 && (
        <>
          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Total Resources", value: resources.length,  color: "text-white" },
              { label: "Approved",        value: approved,           color: "text-green-400" },
              { label: "Unreviewed",      value: unreviewed,         color: "text-yellow-400" },
              { label: "Rejected",        value: rejected,           color: "text-red-400" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-center">
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          {/* Intelligent search */}
          <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Intelligent Search</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSearchResult(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g. Show me where a guardrail blocks PII from leaving a prompt"
                className="flex-1 bg-gray-900 text-gray-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 placeholder-gray-600"
              />
              <button
                onClick={handleSearch}
                disabled={searching || !searchQuery.trim()}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap"
              >
                {searching ? "Analyzing…" : "Search"}
              </button>
              {searchResult && (
                <button
                  onClick={() => { setSearchResult(null); setSearchQuery(""); }}
                  className="bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg px-3 py-2.5 text-sm transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {searchError && (
              <p className="text-xs text-red-400">{searchError}</p>
            )}

            {searchResult && (
              <div className="space-y-2">
                <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg px-4 py-3">
                  <p className="text-sm text-emerald-200">{searchResult.summary}</p>
                  <p className="text-xs text-emerald-500 mt-1">{searchResult.matches.length} resource{searchResult.matches.length !== 1 ? "s" : ""} matched — highlighted below</p>
                </div>
              </div>
            )}
          </div>

          {/* Per-project chains */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              AI Supply Chain — by Project ({projectIds.length})
            </h3>
            {projectIds.map((pid) => (
              <ProjectChain
                key={pid}
                projectId={pid}
                resources={byProject[pid]}
                projectMeta={projectMap[pid]}
                matchedIds={effectiveMatchedIds}
                matchReasons={matchReasonsById}
              />
            ))}
          </div>

          {/* Raw response toggles */}
          <details className="text-xs text-gray-600">
            <summary className="cursor-pointer hover:text-gray-400">Raw org/project response</summary>
            <pre className="mt-2 bg-gray-900 rounded-lg p-3 overflow-x-auto text-gray-500 text-[11px]">
              {JSON.stringify(chainResult?.org_projects, null, 2)}
            </pre>
          </details>
          <details className="text-xs text-gray-600">
            <summary className="cursor-pointer hover:text-gray-400">Raw inventory response</summary>
            <pre className="mt-2 bg-gray-900 rounded-lg p-3 overflow-x-auto text-gray-500 text-[11px]">
              {JSON.stringify(chainResult?.resources, null, 2)}
            </pre>
          </details>
        </>
      )}

      {/* No scan yet */}
      {!chainResult && !scanning && !scanError && (
        <div className="bg-gray-800/50 border border-dashed border-gray-700 rounded-xl px-6 py-12 text-center space-y-2">
          <p className="text-4xl">🔗</p>
          <p className="text-sm font-medium text-gray-300">Ready to scan</p>
          <p className="text-xs text-gray-500">
            Click &ldquo;Scan AI Inventory&rdquo; to pull live data from Atlas across all projects.
          </p>
        </div>
      )}
    </div>
  );
}
