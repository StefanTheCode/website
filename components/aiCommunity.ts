export const AI_COMMUNITY_PATH = '/ai-for-dotnet-developers';
export const AI_COMMUNITY_URL = `https://thecodeman.net${AI_COMMUNITY_PATH}`;
export const AI_COMMUNITY_JOIN_URL = 'https://www.skool.com/ai-for-dotnet-developers/about';
export const AI_COMMUNITY_IMAGE = '/images/ai-for-dotnet-developers.webp';

// Curated learning paths, not keyword matching against arbitrary post titles.
type AiLearningPath = {
  id: string;
  label: string;
  title: string;
  description: string;
  articles: { slug: string; title: string }[];
};

export const aiLearningPaths: AiLearningPath[] = [
  {
    id: 'coding', label: '01 / USE AI', title: 'AI coding workflows for C#',
    description: 'Give Claude Code useful project context, review its changes, and refactor existing .NET applications in small, testable steps.',
    articles: [
      { slug: 'claude-for-dotnet-developers', title: 'Claude Code for .NET: setup, CLAUDE.md and skills' },
      { slug: 'refactoring-legacy-dotnet-with-claude', title: 'Refactor legacy .NET with Claude and characterization tests' },
    ],
  },
  {
    id: 'mcp', label: '02 / CONNECT TOOLS', title: 'MCP servers and AI agents in .NET',
    description: 'Connect an AI assistant to your own tools. See how a C# MCP server exposes a performance-testing workflow and how agents review a repository.',
    articles: [
      { slug: 'building-mcp-server-in-dotnet', title: 'Build a C# MCP server for .NET API performance testing' },
      { slug: 'ai-agents-for-dotnet-security-and-ef-core', title: 'Use AI agents to review ASP.NET Core security and EF Core' },
    ],
  },
  {
    id: 'rag', label: '03 / BUILD AI', title: 'RAG, embeddings and semantic search in C#',
    description: 'Understand retrieval first, then connect it to generation. Work through embeddings, similarity search and a RAG application using your own data.',
    articles: [
      { slug: 'semantic-search-ai-in-dotnet', title: 'Semantic search with Microsoft.Extensions.AI and embeddings' },
      { slug: 'how-to-implement-rag-in-dotnet', title: 'RAG in .NET with Ollama and PostgreSQL pgvector' },
    ],
  },
];

export function isAiPost(category?: string) {
  return category === 'AI' || category === 'AI Tools';
}
