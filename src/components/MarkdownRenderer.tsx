import React, { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!content) return null;

  // Split content by code blocks ```
  const parts = content.split(/(```[\s\S]*?```)/g);

  return (
    <div className="space-y-4 text-xs leading-relaxed text-black font-serif">
      {parts.map((part, index) => {
        // Check if it's a code block
        if (part.startsWith("```")) {
          const match = part.match(/```(\w*)\n([\s\S]*?)```/);
          const lang = match ? match[1] : "code";
          const code = match ? match[2] : part.slice(3, -3);

          return (
            <div
              key={index}
              id={`code-block-${index}`}
              className="my-4 overflow-hidden rounded-none border-2 border-black bg-black shadow-none text-white font-mono"
            >
              <div className="flex items-center justify-between border-b-2 border-neutral-800 bg-neutral-950 px-4 py-2 text-[10px] uppercase font-mono tracking-widest text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <Terminal className="h-3.5 w-3.5 text-neutral-400" strokeWidth={1.5} />
                  <span>{lang || "plain text"}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(code.trim(), index)}
                  className="flex items-center gap-1 text-white hover:underline cursor-pointer"
                >
                  {copiedIndex === index ? (
                    <>
                      <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
                      <span className="text-white font-bold">已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" strokeWidth={1.5} />
                      <span>复制</span>
                    </>
                  )}
                </button>
              </div>
              <pre className="overflow-x-auto p-4 text-[11px] font-mono text-neutral-100 bg-neutral-950 leading-normal select-text">
                <code>{code.trim()}</code>
              </pre>
            </div>
          );
        }

        // Parse regular text line by line for basic Markdown features
        const lines = part.split("\n");
        return (
          <div key={index} className="space-y-2">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();

              // Empty line
              if (!trimmed) return <div key={lineIdx} className="h-2" />;

              // Headers: ### or ## or #
              if (trimmed.startsWith("### ")) {
                return (
                  <h4 key={lineIdx} className="text-xs font-mono font-bold uppercase tracking-wider text-black mt-5 mb-1.5 border-l-2 border-black pl-2">
                    {parseInlineStyles(trimmed.slice(4))}
                  </h4>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h3 key={lineIdx} className="text-sm font-serif font-bold text-black mt-6 mb-2 pb-1 border-b-2 border-neutral-100">
                    {parseInlineStyles(trimmed.slice(3))}
                  </h3>
                );
              }
              if (trimmed.startsWith("# ")) {
                return (
                  <h2 key={lineIdx} className="text-base font-serif font-black tracking-tight text-black mt-8 mb-3">
                    {parseInlineStyles(trimmed.slice(2))}
                  </h2>
                );
              }

              // Unordered list item: - or *
              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                  <ul key={lineIdx} className="list-disc pl-5 my-1 space-y-1">
                    <li className="text-neutral-800 font-serif">
                      {parseInlineStyles(trimmed.slice(2))}
                    </li>
                  </ul>
                );
              }

              // Ordered list item: e.g. 1.
              const matchOrdered = trimmed.match(/^(\d+)\.\s(.*)/);
              if (matchOrdered) {
                return (
                  <ol key={lineIdx} className="list-decimal pl-5 my-1 space-y-1">
                    <li className="text-neutral-800 font-serif">
                      {parseInlineStyles(matchOrdered[2])}
                    </li>
                  </ol>
                );
              }

              // Blockquotes: >
              if (trimmed.startsWith("> ")) {
                return (
                  <blockquote key={lineIdx} className="my-3 border-l-4 border-black bg-neutral-50 px-4 py-2.5 text-neutral-600 italic rounded-none font-serif text-xs">
                    {parseInlineStyles(trimmed.slice(2))}
                  </blockquote>
                );
              }

              // Standard Paragraph
              return (
                <p key={lineIdx} className="text-neutral-800 font-serif">
                  {parseInlineStyles(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

// Simple inline parser for bold **bold** and `code` tags
function parseInlineStyles(text: string): React.ReactNode[] {
  // Regex for bold **...** and inline code `...`
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={idx} className="font-bold text-black">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code key={idx} className="rounded-none bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] text-black border border-neutral-300">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}
