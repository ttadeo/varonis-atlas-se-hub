"use client";

import { useEffect, useRef, useState } from "react";

interface MermaidDiagramProps {
  code: string;
  className?: string;
}

export default function MermaidDiagram({ code, className = "" }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!code.trim() || !ref.current) return;

    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          themeVariables: {
            primaryColor: "#1e40af",
            primaryTextColor: "#f1f5f9",
            primaryBorderColor: "#3b82f6",
            lineColor: "#64748b",
            secondaryColor: "#1e293b",
            tertiaryColor: "#0f172a",
            background: "#0f172a",
            mainBkg: "#1e293b",
            nodeBorder: "#3b82f6",
            clusterBkg: "#1e293b",
            titleColor: "#f1f5f9",
            edgeLabelBackground: "#1e293b",
            attributeBackgroundColorEven: "#1e293b",
            attributeBackgroundColorOdd: "#0f172a",
          },
          securityLevel: "loose",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
        });

        const id = `mermaid-${Math.random().toString(36).slice(2)}`;
        const { svg } = await mermaid.render(id, code.trim());

        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg;
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(`Diagram render error: ${String(err)}`);
        }
      }
    }

    render();
    return () => { cancelled = true; };
  }, [code]);

  if (error) {
    return (
      <div className={`rounded-xl bg-gray-900 border border-red-800 p-4 ${className}`}>
        <p className="text-xs text-red-400 mb-2">Diagram could not be rendered</p>
        <pre className="text-xs text-gray-400 font-mono whitespace-pre-wrap">{code}</pre>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={`mermaid-container rounded-xl bg-gray-900 border border-gray-700 p-4 overflow-x-auto ${className}`}
    />
  );
}
