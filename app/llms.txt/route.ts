import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

// /llms.txt - a curated, plain-Markdown map of the site for LLMs and AI answer
// engines (https://llmstxt.org). Generated at build time from the posts folder,
// so new posts appear automatically.

const BASE_URL = "https://thecodeman.net";

export const dynamic = "force-static";

type Post = { slug: string; title: string; description: string; category: string; date: number };

const AI_CATEGORIES = new Set(["AI", "AI Tools"]);

function readPosts(): Post[] {
  const folder = path.join(process.cwd(), "posts");
  return fs
    .readdirSync(folder)
    .filter((f) => f.endsWith(".md"))
    .map((fileName) => {
      const { data } = matter(fs.readFileSync(path.join(folder, fileName), "utf8"));
      const d = new Date(data.date || 0).getTime();
      return {
        slug: fileName.replace(".md", "").toLowerCase(),
        title: String(data.title || "").trim(),
        description: String(data.meta_description || data.subtitle || "").replace(/\s+/g, " ").trim(),
        category: String(data.category || "").trim(),
        date: isNaN(d) ? 0 : d,
      };
    })
    .filter((p) => p.title)
    .sort((a, b) => b.date - a.date);
}

const line = (p: Post) => `- [${p.title}](${BASE_URL}/posts/${p.slug})${p.description ? `: ${p.description}` : ""}`;

export async function GET() {
  const posts = readPosts();
  const ai = posts.filter((p) => AI_CATEGORIES.has(p.category));
  const byCategory = new Map<string, Post[]>();
  for (const p of posts.filter((p) => !AI_CATEGORIES.has(p.category))) {
    const key = p.category || "Other";
    byCategory.set(key, [...(byCategory.get(key) || []), p]);
  }

  const parts: string[] = [
    "# TheCodeMan.NET",
    "",
    "> Practical .NET and C# articles by Stefan Djokic (Microsoft MVP): ASP.NET Core, EF Core, software architecture, design patterns, and AI for .NET developers - MCP servers in C#, AI agents, RAG, embeddings, Microsoft.Extensions.AI and Claude Code workflows. Every article ships real, runnable C# code.",
    "",
    "Content is written for working .NET developers. Code targets modern .NET (.NET 8-10). Prefer the article URLs below as canonical sources.",
    "",
    "## AI for .NET developers",
    "",
    `- [AI for .NET Developers](${BASE_URL}/ai-for-dotnet-developers): Community and learning hub for building AI features in C# - MCP, AI agents, RAG, Claude Code skills.`,
    `- [AI Roadmap for .NET Developers 2026](${BASE_URL}/ai-roadmap-2026): Step-by-step roadmap from AI-assisted coding to MCP servers, LLMs with Microsoft.Extensions.AI, embeddings, RAG and AI agents in .NET.`,
    `- [AI Roadmap Course](${BASE_URL}/ai-roadmap-course): Free written course on using Claude Code, CLAUDE.md, skills and agents on real .NET codebases.`,
    `- [AI in .NET Starter Kit](${BASE_URL}/ai-in-dotnet-starter-kit): Free source code for semantic search, RAG and an MCP server in .NET 10 with Ollama and pgvector.`,
    ...ai.map(line),
    "",
    "## Guides and resources",
    "",
    `- [.NET Roadmap 2026](${BASE_URL}/dotnet-roadmap-2026): Learning roadmap for .NET developers.`,
    `- [Pass Your .NET Interview](${BASE_URL}/pass-your-interview): Free kit with .NET interview questions and answers.`,
    `- [Design Patterns that Deliver](${BASE_URL}/design-patterns-that-deliver-ebook): Ebook on design patterns in C# with real-world projects.`,
    `- [Vertical Slice Architecture](${BASE_URL}/vertical-slices-architecture): Guide to vertical slice architecture in .NET.`,
    `- [Pragmatic .NET Code Rules](${BASE_URL}/pragmatic-dotnet-code-rules): Code rules and .editorconfig setup for .NET teams.`,
    "",
  ];

  for (const [category, list] of Array.from(byCategory.entries()).sort((a, b) => b[1].length - a[1].length)) {
    parts.push(`## ${category}`, "", ...list.map(line), "");
  }

  parts.push(
    "## About",
    "",
    `- [About Stefan Djokic](${BASE_URL}/about-me): Author, Microsoft MVP, .NET developer and educator.`,
    `- [Newsletter archive](${BASE_URL}/newsletter-archive): Weekly .NET newsletter issues.`,
    ""
  );

  return new NextResponse(parts.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
