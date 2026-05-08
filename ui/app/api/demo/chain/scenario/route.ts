import { NextRequest, NextResponse } from "next/server";

const ATLAS_API_URL = "https://api.prod.alltrue-be.com";

async function getAtlasJWT(): Promise<string> {
  const apiKey = process.env.ATLAS_API_KEY;
  if (!apiKey) throw new Error("ATLAS_API_KEY not configured");

  const res = await fetch(`${ATLAS_API_URL}/v1/auth/issue-jwt-token`, {
    method: "POST",
    headers: { "X-API-Key": apiKey },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Atlas auth failed (${res.status}): ${body}`);
  }
  const data = await res.json();
  return data.access_token as string;
}

// ─── Schema helpers ────────────────────────────────────────────────────────────
// resource_data schemas discovered from Atlas inventory — exact format required per type

function softwarePkgData(library_name: string, version: string, description: string | null, language = "python") {
  return {
    license: null,
    version,
    home_page: null,
    description,
    library_name,
    display_fields: [],
    programming_language: language,
    second_class_attribute_details: [],
  };
}

function customLlmEndpointData(identifier: string, provider: string) {
  return {
    type: "custom",
    api_key: null,
    provider,
    endpoint_identifier: identifier,
    display_fields: [],
    second_class_attribute_details: [],
  };
}

function modelPackageData(org: string, repo: string, modelId: string) {
  return {
    credentials: {
      base_url: "https://huggingface.co",
      revision: "main",
      repo_name: repo,
      model_path: null,
      display_fields: [],
      storage_source: "HUGGINGFACE",
      organization_id: org,
      token_secret_name: null,
      hugging_face_model_id: modelId,
      second_class_attribute_details: [],
    },
    display_fields: [],
    second_class_attribute_details: [],
  };
}

// ─── Scenario definitions ──────────────────────────────────────────────────────

interface ScenarioResource {
  display_name: string;
  resource_type: string;
  technology_types: string[];
  resource_data: Record<string, unknown>;
  reviewed: "approved" | "unreviewed" | "unapproved";
}

interface ScenarioDefinition {
  id: string;
  name: string;
  description: string;
  resources: ScenarioResource[];
}

const SCENARIO_DEFINITIONS: ScenarioDefinition[] = [
  {
    id: "healthcare",
    name: "Healthcare — Clinical Note Summarizer",
    description:
      "LangChain orchestrates OpenAI GPT-4o to summarize patient notes, with a HuggingFace BART model loaded via Transformers. Demonstrates PII risk when patient data flows through unmonitored LLM endpoints.",
    resources: [
      {
        display_name: "LangChain",
        resource_type: "langchain",
        technology_types: ["langchain"],
        resource_data: softwarePkgData("langchain", "0.1.20", "LangChain is a framework for developing applications powered by large language models (LLMs)."),
        reviewed: "unreviewed",
      },
      {
        display_name: "OpenAI",
        resource_type: "openai",
        technology_types: ["openai"],
        resource_data: softwarePkgData("openai", "1.30.1", "The official Python library for the OpenAI API"),
        reviewed: "unreviewed",
      },
      {
        display_name: "HuggingFace Hub",
        resource_type: "huggingface_hub",
        technology_types: ["huggingface_hub"],
        resource_data: softwarePkgData("huggingface_hub", "0.23.0", null),
        reviewed: "unreviewed",
      },
      {
        display_name: "Transformers",
        resource_type: "transformers",
        technology_types: ["transformers"],
        resource_data: softwarePkgData("transformers", "4.40.2", null),
        reviewed: "unreviewed",
      },
      {
        display_name: "OpenAI GPT-4o (Clinical Summarizer)",
        resource_type: "CustomLlmEndpoint",
        technology_types: ["openai-api-key"],
        resource_data: customLlmEndpointData("openai-gpt4o-clinical-summarizer", "OpenAI"),
        reviewed: "unapproved",
      },
      {
        display_name: "facebook/bart-large-cnn",
        resource_type: "ModelPackage",
        technology_types: ["transformers", "summarization"],
        resource_data: modelPackageData("facebook", "bart-large-cnn", "facebook/bart-large-cnn"),
        reviewed: "unreviewed",
      },
    ],
  },
  {
    id: "finance",
    name: "Financial Services — AI Risk Analyzer",
    description:
      "LangChain + Anthropic Claude 3 Opus analyzes market risk using a fine-tuned FinBERT model. Demonstrates Shadow AI risk in financial workflows.",
    resources: [
      {
        display_name: "LangChain",
        resource_type: "langchain",
        technology_types: ["langchain"],
        resource_data: softwarePkgData("langchain", "0.1.20", "LangChain is a framework for developing applications powered by large language models (LLMs)."),
        reviewed: "unreviewed",
      },
      {
        display_name: "Anthropic",
        resource_type: "anthropic",
        technology_types: ["anthropic"],
        resource_data: softwarePkgData("anthropic", "0.26.0", null),
        reviewed: "unreviewed",
      },
      {
        display_name: "Transformers",
        resource_type: "transformers",
        technology_types: ["transformers"],
        resource_data: softwarePkgData("transformers", "4.40.2", null),
        reviewed: "unreviewed",
      },
      {
        display_name: "Anthropic Claude 3 Opus (Risk Analyzer)",
        resource_type: "CustomLlmEndpoint",
        technology_types: ["anthropic-api-key"],
        resource_data: customLlmEndpointData("anthropic-claude3-opus-risk-analyzer", "Anthropic"),
        reviewed: "unapproved",
      },
      {
        display_name: "ProsusAI/finbert",
        resource_type: "ModelPackage",
        technology_types: ["transformers", "financial-nlp"],
        resource_data: modelPackageData("ProsusAI", "finbert", "ProsusAI/finbert"),
        reviewed: "unreviewed",
      },
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce — Product Recommendation Engine",
    description:
      "LangChain + Azure OpenAI powers a recommendation engine using Sentence Transformers and ChromaDB for vector search. Demonstrates AI sprawl across cloud providers.",
    resources: [
      {
        display_name: "LangChain",
        resource_type: "langchain",
        technology_types: ["langchain"],
        resource_data: softwarePkgData("langchain", "0.1.20", "LangChain is a framework for developing applications powered by large language models (LLMs)."),
        reviewed: "approved",
      },
      {
        display_name: "ChromaDB",
        resource_type: "chromadb",
        technology_types: ["chromadb"],
        resource_data: softwarePkgData("chromadb", "0.5.0", "A JavaScript interface for chroma", "python"),
        reviewed: "unreviewed",
      },
      {
        display_name: "Sentence Transformers",
        resource_type: "sentence-transformers",
        technology_types: ["sentence-transformers"],
        resource_data: softwarePkgData("sentence-transformers", "2.7.0", null),
        reviewed: "approved",
      },
      {
        display_name: "Azure OpenAI GPT-4 Turbo (Recommendations)",
        resource_type: "CustomLlmEndpoint",
        technology_types: ["azure-openai-api-key"],
        resource_data: customLlmEndpointData("azure-openai-gpt4-turbo-recommendations", "Azure OpenAI"),
        reviewed: "unreviewed",
      },
      {
        display_name: "sentence-transformers/all-MiniLM-L6-v2",
        resource_type: "ModelPackage",
        technology_types: ["sentence-transformers", "embeddings"],
        resource_data: modelPackageData("sentence-transformers", "all-MiniLM-L6-v2", "sentence-transformers/all-MiniLM-L6-v2"),
        reviewed: "approved",
      },
    ],
  },
];

// ─── GET — return scenario catalog ────────────────────────────────────────────

export async function GET() {
  return NextResponse.json(
    SCENARIO_DEFINITIONS.map(({ id, name, description, resources }) => ({
      id,
      name,
      description,
      resource_count: resources.length,
      layers: [...new Set(resources.map((r) => r.resource_type))],
    }))
  );
}

// ─── POST — create scenario in Atlas ──────────────────────────────────────────
// Body: { scenario_id: string, project_id: string }

export async function POST(req: NextRequest) {
  if (!process.env.ATLAS_API_KEY) {
    return NextResponse.json({ error: "ATLAS_API_KEY not configured" }, { status: 503 });
  }

  const customerId = process.env.ATLAS_CUSTOMER_ID ?? "";

  let body: { scenario_id?: string; project_id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { scenario_id, project_id } = body;
  if (!scenario_id) return NextResponse.json({ error: "scenario_id is required" }, { status: 400 });
  if (!project_id) return NextResponse.json({ error: "project_id is required" }, { status: 400 });

  const scenario = SCENARIO_DEFINITIONS.find((s) => s.id === scenario_id);
  if (!scenario) return NextResponse.json({ error: `Unknown scenario_id: ${scenario_id}` }, { status: 400 });

  const errors: string[] = [];
  // Unique suffix so re-running a scenario doesn't conflict with prior runs
  const suffix = Date.now().toString(36);

  try {
    const token = await getAtlasJWT();
    const headers = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

    // ── Create resources in one batch call ─────────────────────────────────────
    // Note: technology_types must be empty — Atlas validates against its own catalog.
    // CustomLlmEndpoint uses endpoint_identifier as a unique key, so we append
    // the per-request suffix to prevent 409 conflicts on repeat runs.
    const resourcePayload = {
      resources: scenario.resources.map((r) => {
        let resource_data = r.resource_data;
        if (r.resource_type === "CustomLlmEndpoint" && typeof resource_data.endpoint_identifier === "string") {
          resource_data = { ...resource_data, endpoint_identifier: `${resource_data.endpoint_identifier}-${suffix}` };
        }
        return {
          display_name: r.display_name,
          resource_type: r.resource_type,
          resource_data,
          technology_types: [],
          project_ids: [project_id],
          reviewed: r.reviewed,
          tenant_global_resource: false,
        };
      }),
    };

    const createRes = await fetch(`${ATLAS_API_URL}/v1/inventory/resources`, {
      method: "POST",
      headers,
      body: JSON.stringify(resourcePayload),
      signal: AbortSignal.timeout(20000),
    });

    if (!createRes.ok) {
      const errBody = await createRes.text();
      return NextResponse.json(
        { error: `Atlas resource creation failed (${createRes.status})`, detail: errBody },
        { status: 502 }
      );
    }

    const createData = await createRes.json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawCreated: any[] = Array.isArray(createData)
      ? createData
      : Array.isArray(createData.added_resources)
      ? createData.added_resources
      : Array.isArray(createData.resources)
      ? createData.resources
      : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const created = rawCreated.map((r: any, idx: number) => ({
      id: r.resource_instance_id ?? r.id ?? `unknown-${idx}`,
      name: r.display_name ?? r.resource_display_name ?? scenario.resources[idx]?.display_name ?? "Unknown",
      resource_type: r.resource_type ?? scenario.resources[idx]?.resource_type,
      category: r.resource_type_category ?? "unknown",
    }));

    // ── Link resources into a sequential chain ─────────────────────────────────
    let dependenciesLinked = false;

    if (created.length >= 2) {
      const depLinks = created.slice(0, -1).map((r, idx) => ({
        source_resource_id: r.id,
        target_resource_id: created[idx + 1].id,
      }));

      try {
        const depRes = await fetch(`${ATLAS_API_URL}/v1/inventory/resources/dependencies/manual`, {
          method: "POST",
          headers,
          body: JSON.stringify({ dependencies: depLinks }),
          signal: AbortSignal.timeout(10000),
        });

        if (depRes.ok) {
          dependenciesLinked = true;
        } else {
          const depBody = await depRes.text();
          errors.push(`Dependencies not linked (${depRes.status}): ${depBody.slice(0, 200)}`);
        }
      } catch (depErr) {
        errors.push(`Dependency linking error: ${String(depErr)}`);
      }
    }

    return NextResponse.json({
      scenario_name: scenario.name,
      project_id,
      customer_id: customerId,
      created,
      dependencies_linked: dependenciesLinked,
      errors,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
