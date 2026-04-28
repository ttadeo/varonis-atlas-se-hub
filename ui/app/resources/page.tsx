"use client";

import { useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

type Resource = {
  slug: string;
  title: string;
  type: string;
  tag: string;
  tagColor: string;
  description: string;
  highspotUrl: string;
};

const RESOURCES: Resource[] = [
  {
    slug: "field_friday_qa",
    title: "Field Friday Q&A",
    type: "Q&A",
    tag: "Sales",
    tagColor: "bg-orange-500/20 text-orange-300",
    description: "Live Q&A from Field Friday session — pricing, objections, positioning, and customer scenarios.",
    highspotUrl: "https://varonis.highspot.com/items/69b006be2da0bb1e4e76c2e5",
  },
  {
    slug: "comparison_deck_varonis_atlas_vs_ai_vendors",
    title: "Comparison Deck — Atlas vs AI Vendors",
    type: "Deck",
    tag: "Competitive",
    tagColor: "bg-red-500/20 text-red-300",
    description: "Side-by-side comparison of Varonis Atlas against competing AI security vendors. Q1 2026.",
    highspotUrl: "https://varonis.highspot.com/items/69b9665d2ee199b8eddda372",
  },
  {
    slug: "varonis_atlas_case_study_cresta",
    title: "Case Study — Cresta",
    type: "Case Study",
    tag: "Customer",
    tagColor: "bg-green-500/20 text-green-300",
    description: "How Cresta achieved ISO 42001 compliance and best-in-class AI security posture with Atlas.",
    highspotUrl: "https://varonis.highspot.com/items/69cd248a36b19a01b8bf9072",
  },
  {
    slug: "technical_overview_varonis_atlas_and_iso_42001",
    title: "Technical Overview — Atlas and ISO 42001",
    type: "Technical",
    tag: "Compliance",
    tagColor: "bg-blue-500/20 text-blue-300",
    description: "How Atlas maps to ISO 42001 AI Management System requirements. For compliance conversations.",
    highspotUrl: "https://varonis.highspot.com/items/69d501b387baa60bf047b80a",
  },
  {
    slug: "atlas_ai_security_platform_infosheet",
    title: "Atlas AI Security Platform Infosheet",
    type: "Infosheet",
    tag: "Overview",
    tagColor: "bg-purple-500/20 text-purple-300",
    description: "One-page platform overview covering all Atlas applications and key capabilities.",
    highspotUrl: "https://varonis.highspot.com/items/69af650d938e191570bbf91e",
  },
  {
    slug: "datasheet_varonis_interceptor",
    title: "Datasheet — Varonis Interceptor",
    type: "Datasheet",
    tag: "Product",
    tagColor: "bg-cyan-500/20 text-cyan-300",
    description: "Product datasheet for Varonis Interceptor — real-time AI traffic inspection and control.",
    highspotUrl: "https://varonis.highspot.com/items/68e5be018b52f953b08b8793",
  },
  {
    slug: "ai_security_fundamentals",
    title: "AI Security Fundamentals",
    type: "Training",
    tag: "Education",
    tagColor: "bg-yellow-500/20 text-yellow-300",
    description: "Foundational AI security concepts — useful for setting the stage with new prospects.",
    highspotUrl: "https://varonis.highspot.com/items/69b19527fa7d83a446b02db4",
  },
  {
    slug: "varonis_atlas_case_study_cresta",
    title: "Varonis Atlas Case Study — Cresta",
    type: "Case Study",
    tag: "Customer",
    tagColor: "bg-green-500/20 text-green-300",
    description: "Customer story from Cresta on implementing Atlas for AI security posture management.",
    highspotUrl: "https://varonis.highspot.com/items/69cd248a36b19a01b8bf9072",
  },
  {
    slug: "varonis_to_acquire_alltrueai_to_manage_and_secure_ai_across_the_enterprise",
    title: "Varonis to Acquire AllTrue.ai",
    type: "News",
    tag: "Company",
    tagColor: "bg-gray-500/20 text-gray-300",
    description: "Acquisition announcement — background on how Atlas originated from AllTrue.ai.",
    highspotUrl: "https://varonis.highspot.com/items/6982889000854d7b28ae83f0",
  },
];

// Deduplicate by slug
const UNIQUE_RESOURCES = RESOURCES.filter(
  (r, i, arr) => arr.findIndex((x) => x.slug === r.slug) === i
);

const ALL_TAGS = ["All", ...Array.from(new Set(UNIQUE_RESOURCES.map((r) => r.tag)))];

export default function ResourcesPage() {
  const [activeTag, setActiveTag] = useState("All");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const filtered =
    activeTag === "All"
      ? UNIQUE_RESOURCES
      : UNIQUE_RESOURCES.filter((r) => r.tag === activeTag);

  const selectedResource = UNIQUE_RESOURCES.find((r) => r.slug === selectedSlug);

  async function openResource(resource: Resource) {
    if (selectedSlug === resource.slug) {
      setSelectedSlug(null);
      setContent("");
      return;
    }
    setSelectedSlug(resource.slug);
    setContent("");
    setLoading(true);
    try {
      const res = await fetch(`/api/resources/${resource.slug}`);
      const data = await res.json();
      setContent(data.content || "Content unavailable.");
    } catch {
      setContent("Failed to load content.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-sm">
            A
          </div>
          <div>
            <h1 className="font-semibold text-white">Atlas Learning Platform</h1>
            <p className="text-xs text-gray-400">Varonis Atlas AI Security — Internal SE Tool</p>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
            {UNIQUE_RESOURCES.length} resources
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Resource List */}
        <div className={`flex flex-col ${selectedSlug ? "w-96 shrink-0" : "flex-1"} border-r border-gray-800 overflow-hidden transition-all`}>
          {/* Title + filters */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-800">
            <h2 className="text-lg font-semibold text-white mb-1">Resource Library</h2>
            <p className="text-sm text-gray-400 mb-4">
              Highspot competitive decks, case studies, and field materials.
            </p>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`text-xs px-3 py-1 rounded-full transition-colors ${
                    activeTag === tag
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:text-white"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Resource cards */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {filtered.map((resource) => (
              <button
                key={resource.slug}
                onClick={() => openResource(resource)}
                className={`w-full text-left rounded-xl border p-4 transition-all ${
                  selectedSlug === resource.slug
                    ? "border-blue-500 bg-blue-950/40"
                    : "border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="font-medium text-white text-sm leading-snug">
                    {resource.title}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${resource.tagColor}`}>
                    {resource.tag}
                  </span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{resource.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <span className="text-xs text-gray-600">{resource.type}</span>
                  <a
                    href={resource.highspotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-blue-400 hover:text-blue-300 ml-auto"
                  >
                    Open in Highspot ↗
                  </a>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Content Viewer */}
        {selectedSlug && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Viewer header */}
            <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">{selectedResource?.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">{selectedResource?.type} · {selectedResource?.tag}</p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={selectedResource?.highspotUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 px-3 py-1.5 border border-blue-800 rounded-lg"
                >
                  Open in Highspot ↗
                </a>
                <button
                  onClick={() => { setSelectedSlug(null); setContent(""); }}
                  className="text-gray-400 hover:text-white text-lg leading-none"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              {loading ? (
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  Loading content...
                </div>
              ) : (
                <div className="prose prose-invert prose-sm max-w-3xl">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
