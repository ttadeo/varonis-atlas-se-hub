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

// ─── Scenario definitions ──────────────────────────────────────────────────────
// resource_type must match Atlas's resource-types catalog.
// Known valid types from Atlas: langchain, openai, anthropic, transformers, hugging_face, chromadb, faiss

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
      "LangChain orchestrates OpenAI GPT-4o to summarize patient notes using a HuggingFace BART model, with training data sourced from a clinical notes dataset. Demonstrates PII risk when patient data flows through unmonitored LLM endpoints.",
    resources: [
      {
        display_name: "LangChain",
        resource_type: "langchain",
        technology_types: ["python", "llm-orchestration"],
        resource_data: {
          version: "0.1.20",
          package_manager: "pip",
          package_name: "langchain",
          source: "PyPI",
        },
        reviewed: "unreviewed",
      },
      {
        display_name: "OpenAI GPT-4o (Clinical Summarizer)",
        resource_type: "openai",
        technology_types: ["llm", "openai", "gpt-4"],
        resource_data: {
          model: "gpt-4o",
          endpoint_url: "https://api.openai.com/v1/chat/completions",
          use_case: "clinical note summarization",
          temperature: 0,
        },
        reviewed: "unapproved",
      },
      {
        display_name: "facebook/bart-large-cnn",
        resource_type: "hugging_face",
        technology_types: ["transformers", "summarization", "pytorch"],
        resource_data: {
          model_id: "facebook/bart-large-cnn",
          framework: "transformers",
          task: "summarization",
          source: "HuggingFace Hub",
        },
        reviewed: "unreviewed",
      },
      {
        display_name: "Clinical Notes Training Dataset",
        resource_type: "dataset",
        technology_types: ["csv", "pii", "healthcare"],
        resource_data: {
          format: "csv",
          contains_pii: true,
          description: "Synthetic de-identified clinical notes used for model fine-tuning",
          estimated_rows: 50000,
          data_classification: "sensitive",
        },
        reviewed: "unreviewed",
      },
    ],
  },
  {
    id: "finance",
    name: "Financial Services — AI Risk Analyzer",
    description:
      "LangChain + Anthropic Claude 3 Opus analyzes market risk using a fine-tuned FinBERT model trained on proprietary transaction data. Demonstrates Shadow AI risk in financial workflows.",
    resources: [
      {
        display_name: "LangChain",
        resource_type: "langchain",
        technology_types: ["python", "llm-orchestration"],
        resource_data: {
          version: "0.1.20",
          package_manager: "pip",
          package_name: "langchain",
          source: "PyPI",
        },
        reviewed: "unreviewed",
      },
      {
        display_name: "Anthropic Claude 3 Opus (Risk Analyzer)",
        resource_type: "anthropic",
        technology_types: ["llm", "anthropic", "claude"],
        resource_data: {
          model: "claude-3-opus-20240229",
          endpoint_url: "https://api.anthropic.com/v1/messages",
          use_case: "financial risk analysis",
        },
        reviewed: "unapproved",
      },
      {
        display_name: "FinBERT (Fine-tuned)",
        resource_type: "hugging_face",
        technology_types: ["transformers", "financial-nlp", "bert"],
        resource_data: {
          model_id: "ProsusAI/finbert",
          framework: "transformers",
          task: "text-classification",
          fine_tuned: true,
          source: "HuggingFace Hub",
        },
        reviewed: "unreviewed",
      },
      {
        display_name: "Market Transaction Dataset (Q1-Q4 2024)",
        resource_type: "dataset",
        technology_types: ["csv", "financial", "proprietary"],
        resource_data: {
          format: "parquet",
          contains_pii: false,
          description: "Internal market transaction records used for FinBERT fine-tuning",
          data_classification: "confidential",
          retention_policy: "7 years",
        },
        reviewed: "unapproved",
      },
    ],
  },
  {
    id: "ecommerce",
    name: "E-Commerce — Product Recommendation Engine",
    description:
      "LangChain + Azure OpenAI powers a product recommendation engine using Sentence Transformers and a customer behavior dataset stored in a vector store. Demonstrates AI sprawl across cloud providers.",
    resources: [
      {
        display_name: "LangChain",
        resource_type: "langchain",
        technology_types: ["python", "llm-orchestration"],
        resource_data: {
          version: "0.1.20",
          package_manager: "pip",
          source: "PyPI",
        },
        reviewed: "approved",
      },
      {
        display_name: "Azure OpenAI (GPT-4 Turbo)",
        resource_type: "openai",
        technology_types: ["llm", "azure", "gpt-4"],
        resource_data: {
          provider: "Azure",
          model: "gpt-4-turbo",
          endpoint_url: "https://my-company.openai.azure.com/openai/deployments/gpt-4-turbo",
          use_case: "product recommendation generation",
        },
        reviewed: "unreviewed",
      },
      {
        display_name: "all-MiniLM-L6-v2 (Sentence Transformer)",
        resource_type: "hugging_face",
        technology_types: ["sentence-transformers", "embeddings", "pytorch"],
        resource_data: {
          model_id: "sentence-transformers/all-MiniLM-L6-v2",
          framework: "sentence-transformers",
          task: "feature-extraction",
          source: "HuggingFace Hub",
        },
        reviewed: "approved",
      },
      {
        display_name: "ChromaDB Vector Store",
        resource_type: "chromadb",
        technology_types: ["vector-store", "rag", "python"],
        resource_data: {
          version: "0.5.0",
          deployment: "local",
          collection: "product_catalog_embeddings",
        },
        reviewed: "unreviewed",
      },
      {
        display_name: "Customer Behavior Dataset",
        resource_type: "dataset",
        technology_types: ["parquet", "pii", "behavioral"],
        resource_data: {
          format: "parquet",
          contains_pii: true,
          description: "Customer purchase history and browsing behavior used for recommendation model training",
          estimated_rows: 2000000,
          data_classification: "sensitive",
        },
        reviewed: "unreviewed",
      },
    ],
  },
];

// ─── POST /api/demo/chain/scenario ────────────────────────────────────────────
// Body: { scenario_id: string, project_id: string }
// Returns: { scenario_name, created: [{id, name, category}], dependencies_linked, errors }

export async function GET() {
  // Return available scenario definitions (no Atlas call needed)
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
  if (!scenario) {
    return NextResponse.json({ error: `Unknown scenario_id: ${scenario_id}` }, { status: 400 });
  }

  const errors: string[] = [];

  try {
    const token = await getAtlasJWT();
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    // ── Step 1: Create all resources in one batch call ─────────────────────────
    const resourcePayload = {
      resources: scenario.resources.map((r) => ({
        display_name: r.display_name,
        resource_type: r.resource_type,
        resource_data: r.resource_data,
        technology_types: r.technology_types,
        project_ids: [project_id],
        reviewed: r.reviewed,
        tenant_global_resource: false,
      })),
    };

    const createRes = await fetch(`${ATLAS_API_URL}/v1/inventory/resources`, {
      method: "POST",
      headers,
      body: JSON.stringify(resourcePayload),
      signal: AbortSignal.timeout(20000),
    });

    if (!createRes.ok) {
      const body = await createRes.text();
      return NextResponse.json(
        { error: `Atlas resource creation failed (${createRes.status})`, detail: body },
        { status: 502 }
      );
    }

    const createData = await createRes.json();

    // Extract created resource IDs from response — Atlas may return array or { resources: [] }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rawCreated: any[] = Array.isArray(createData)
      ? createData
      : Array.isArray(createData.resources)
      ? createData.resources
      : [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const created = rawCreated.map((r: any, idx: number) => ({
      id: r.resource_instance_id ?? r.id ?? `unknown-${idx}`,
      name: r.resource_display_name ?? r.display_name ?? scenario.resources[idx]?.display_name ?? "Unknown",
      resource_type: r.resource_type ?? scenario.resources[idx]?.resource_type,
      category: r.resource_type_category ?? "unknown",
    }));

    // ── Step 2: Link resources into a chain (sequential dependencies) ──────────
    let dependenciesLinked = false;

    if (created.length >= 2) {
      // Build sequential chain: resource[0] → resource[1] → resource[2] → ...
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
      raw_response: createData,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
