export const AI_COMMUNITY_PATH = '/ai-for-developers';
export const AI_COMMUNITY_URL = `https://thecodeman.net${AI_COMMUNITY_PATH}`;
export const AI_COMMUNITY_JOIN_URL = 'https://www.skool.com/ai-for-developers/about';
export const AI_COMMUNITY_IMAGE = '/images/ai-for-dotnet-developers.webp';

// Free guide for C# developers. Separate from the community landing page above:
// the guide targets ".NET / C#" searches, the community page sells the membership.
export const DOTNET_AI_GUIDE_PATH = '/ai-for-dotnet-developers';
export const DOTNET_AI_GUIDE_URL = `https://thecodeman.net${DOTNET_AI_GUIDE_PATH}`;
export const DOTNET_AI_GUIDE_NAME = 'AI for .NET Developers';

type GuideArticle = { slug: string; title: string };
type AiLearningPath = {
  id: string;
  label: string;
  title: string;
  description: string;
  articles: GuideArticle[];
};

// Three short paths for the community page and the blog index.
// Curated learning paths, not keyword matching against arbitrary post titles.
export const aiLearningPaths: AiLearningPath[] = [
  {
    id: 'coding', label: '01 / USE AI', title: 'AI coding workflows for C#',
    description: 'Give Claude Code useful project context, load .NET skills, and refactor existing .NET applications in small, testable steps.',
    articles: [
      { slug: 'claude-for-dotnet-developers', title: 'Claude Code for .NET: setup, CLAUDE.md and skills' },
      { slug: 'dotnet-skills-for-coding-agents', title: '.NET Skills for coding agents: dotnet/skills and your own SKILL.md' },
      { slug: 'refactoring-legacy-dotnet-with-claude', title: 'Refactor legacy .NET with Claude and characterization tests' },
    ],
  },
  {
    id: 'mcp', label: '02 / CONNECT TOOLS', title: 'MCP servers and AI agents in .NET',
    description: 'Connect an AI assistant to your own code with a C# MCP server, then build agents that call tools and review a repository.',
    articles: [
      { slug: 'building-mcp-server-in-dotnet', title: 'How to build an MCP server in C# and .NET' },
      { slug: 'ai-agent-in-csharp-microsoft-agent-framework', title: 'Build an AI agent in C# with Microsoft Agent Framework' },
      { slug: 'ai-agents-for-dotnet-security-and-ef-core', title: 'AI code review for .NET: security and EF Core agents' },
    ],
  },
  {
    id: 'rag', label: '03 / BUILD AI', title: 'AI features, embeddings and RAG in C#',
    description: 'Start with a model call through Microsoft.Extensions.AI, then add embeddings, vector search and retrieval over your own data.',
    articles: [
      { slug: 'getting-started-with-ai-in-csharp', title: 'Getting started with AI in C#: Microsoft.Extensions.AI' },
      { slug: 'semantic-search-ai-in-dotnet', title: 'Semantic search in C# with embeddings' },
      { slug: 'how-to-implement-rag-in-dotnet', title: 'RAG in C# with Ollama and PostgreSQL pgvector' },
    ],
  },
];

// Full topic map for the AI for .NET Developers guide. Every AI post belongs to
// exactly one section; the post page uses this for its "continue learning" box.
export const dotnetAiGuide: AiLearningPath[] = [
  {
    id: 'start', label: '01 / START HERE', title: 'Your first AI feature in C#',
    description: 'One abstraction, IChatClient from Microsoft.Extensions.AI, covers OpenAI, Azure OpenAI, Ollama and other providers. Learn model calls, streaming and DI before adding anything else.',
    articles: [
      { slug: 'getting-started-with-ai-in-csharp', title: 'Getting started with AI in C#: Microsoft.Extensions.AI and IChatClient' },
      { slug: 'how-to-use-chatgpt-in-csharp-application', title: 'ChatGPT in C#: the original OpenAI API example (legacy)' },
    ],
  },
  {
    id: 'agents', label: '02 / AGENTS', title: 'AI agents in C#',
    description: 'An agent is a model that can call your tools over several steps. Microsoft Agent Framework is the .NET library for this and replaces Semantic Kernel for new projects.',
    articles: [
      { slug: 'ai-agent-in-csharp-microsoft-agent-framework', title: 'Build an AI agent in C# with Microsoft Agent Framework' },
      { slug: 'github-copilot-sdk-csharp-bring-your-own-model', title: 'GitHub Copilot SDK in C#: bring your own model' },
      { slug: 'ai-agents-for-dotnet-security-and-ef-core', title: 'AI code review for .NET: security and EF Core agents' },
    ],
  },
  {
    id: 'mcp', label: '03 / MCP', title: 'MCP: connect AI to your .NET code',
    description: 'The Model Context Protocol lets Claude, Copilot and your own agents call tools you write in C#. The official MCP C# SDK builds on ASP.NET Core.',
    articles: [
      { slug: 'building-mcp-server-in-dotnet', title: 'How to build an MCP server in C# and .NET' },
      { slug: 'ai-architecture-diagrams-miro-mcp', title: 'Generate .NET architecture diagrams on Miro with MCP' },
    ],
  },
  {
    id: 'data', label: '04 / YOUR DATA', title: 'Embeddings, vector search and RAG',
    description: 'Retrieval comes before generation. Turn text into embeddings, search them in SQL Server or PostgreSQL, then pass the best matches to the model.',
    articles: [
      { slug: 'semantic-search-ai-in-dotnet', title: 'Semantic search in C# with embeddings' },
      { slug: 'your-dotnet-api-doesnt-need-a-vector-database-anymore', title: 'EF Core vector search with SQL Server 2025' },
      { slug: 'how-to-implement-rag-in-dotnet', title: 'RAG in C# with Ollama and PostgreSQL pgvector' },
    ],
  },
  {
    id: 'coding', label: '05 / CODE WITH AI', title: 'AI coding tools for .NET developers',
    description: 'Claude Code and GitHub Copilot work better on a .NET repository when they get project context, skills and checks. Review every change and run your tests.',
    articles: [
      { slug: 'claude-for-dotnet-developers', title: 'Claude Code for .NET: setup, CLAUDE.md, skills and agents' },
      { slug: 'claude-code-hooks-headless-mcp-rewind', title: '4 Claude Code features for .NET: hooks, headless mode, MCP, /rewind' },
      { slug: 'dotnet-skills-for-coding-agents', title: '.NET Skills for coding agents: dotnet/skills and your own SKILL.md' },
      { slug: 'ship-agent-skills-in-nuget-packages', title: 'Ship agent skills inside your NuGet package' },
      { slug: 'refactoring-legacy-dotnet-with-claude', title: 'Refactor legacy .NET with Claude: a test-first workflow' },
    ],
  },
];

export function isAiPost(category?: string) {
  return category === 'AI' || category === 'AI Tools';
}
