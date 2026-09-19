# AI for .NET Developers: research and implementation

Research date: 2026-09-19. Audience: English-speaking C# and .NET developers. Primary conversion: community trial on Skool.

## Evidence and limits

This is qualitative search-intent research, not a keyword-volume report. No Search Console, Keyword Planner or paid keyword dataset was available. Priorities below are editorial judgments based on developer questions, current primary documentation, existing content and proximity to the community offer. Search result presence does not establish search volume or ranking difficulty.

- [Stack Overflow Developer Survey 2025: AI](https://survey.stackoverflow.co/2025/ai): widespread adoption coexists with distrust of output. This supports content about checking AI changes, debugging, tests and concrete workflows rather than unsupported productivity claims.
- [Microsoft: .NET AI ecosystem](https://learn.microsoft.com/en-us/dotnet/ai/dotnet-ai-ecosystem): separates model access, retrieval, MCP, agents and evaluation. Use these distinctions to organize learning paths. A coding assistant and an AI feature inside an application serve different intents.
- [Microsoft: .NET AI articles](https://devblogs.microsoft.com/dotnet/category/ai/): recent coverage includes MCP, model routing, deployment and real developer stories. These are active ecosystem topics, not measured search-demand estimates.
- [Developer question: where to start with AI in .NET](https://www.reddit.com/r/dotnet/comments/1g0tf7w/): an illustrative beginner-intent signal, not a representative sample.
- [Developer discussion: boundaries for agents generating .NET code](https://www.reddit.com/r/dotnet/comments/1t78oxr/where_do_you_draw_the_line_on_letting_an_ai_agent/): an illustrative signal for review and control concerns. Technical guidance is grounded in documentation and existing articles, not Reddit claims.
- [Current community offer](https://www.skool.com/ai-for-dotnet-developers/about): verified the current destination, $19/month or $180/year and 7-day trial. Removed the old landing page's $12/$100 price, 1,500+ member claim and unsupported no-card claim. Do not hard-code a changing membership count. The image already in the workspace is reused.
- [Google: moving URLs](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes): permanent redirect, updated internal links, self-canonical destination and new sitemap entry.
- [Google: helpful content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content): prioritize useful explanations and honest authorship/version context. Do not mass-produce near-duplicate keyword pages or imply old examples were retested on current SDKs.

## Query map

| Priority | Search intent / representative query | Destination and action |
| --- | --- | --- |
| P1 | AI for .NET developers; AI for C# developers; .NET AI community | `/ai-for-dotnet-developers`: community offer and learning hub; own the broad intent here |
| P1 | Claude Code .NET; CLAUDE.md C#; Claude skills .NET | `/posts/claude-for-dotnet-developers`: setup, project context and reusable workflow |
| P1 | AI code review C#; .NET security AI agent; EF Core AI review | `/posts/ai-agents-for-dotnet-security-and-ef-core`: concrete audit and verification |
| P1 | MCP server C#; MCP .NET API performance | `/posts/building-mcp-server-in-dotnet`: performance-tool use case; avoid competing with a generic introductory MCP tutorial |
| P1 | RAG .NET C#; Ollama PostgreSQL pgvector | `/posts/how-to-implement-rag-in-dotnet`: pipeline explanation and explicit original-example caveat |
| P1 | semantic search .NET; Microsoft.Extensions.AI embeddings | `/posts/semantic-search-ai-in-dotnet`: retrieval concepts, distinction from RAG and package-version context |
| P2 | refactor legacy .NET Claude; AI characterization tests | `/posts/refactoring-legacy-dotnet-with-claude`: test-first incremental modernization |
| P2 | how to learn AI as a .NET developer | Existing `/ai-roadmap-2026` and course preview; links to the community |
| P2 | ChatGPT C# integration | Existing 2023 article clearly labeled historical; requires a separately tested SDK refresh before targeting current setup queries |

The MCP tutorial already present as an untracked draft keeps its own beginner intent and publication workflow. The future-dated vector-search article is not added to the curated hub in this change.

## Implemented

- Community landing page with a descriptive H1, practical value, free learning paths, visible FAQs, real article links, current offer and join links.
- Dedicated canonical, social image and CollectionPage / Organization / ItemList / BreadcrumbList data. No invented ratings, membership totals or SoftwareApplication offer for a community. FAQ rich results are not promised.
- Forced Netlify 301s for `/ai-toolkit`, `/ai-toolkit/` and `/ai-toolkit.html`; Next.js redirect fallback for local navigation. Production HTTP behavior still needs verification after deployment.
- Promotion in the global top bar, navigation, home hero, home feature, footer, blog index, article sidebars, AI article conclusions, roadmap and course preview.
- Visible, server-rendered blog learning links and an expandable full article directory; replaced the off-screen crawler-only index.
- Seven existing AI articles received focused titles/descriptions and answer-first introductions or historical context. Four received question-and-answer data rendered visibly by the article template. Original publication dates are preserved; edited articles have an explicit updated date used in HTML, social metadata, Article schema and sitemap.
- AI articles link to the hub and related learning-path articles. Related cards use the resolved cover image rather than assuming `.png`.
- Existing community URLs updated to the current Skool slug. Repository/plugin installation identifiers retain their original names.

## Next editorial priorities

These are a future publication backlog, not newly published tutorials or claims about included lessons.

1. **Build your first AI feature with Microsoft.Extensions.AI and IChatClient.** A complete, pinned, runnable C# repository, configuration, streaming, cancellation, errors and a small evaluation set. Link from the historical API article after it exists.
2. **RAG in ASP.NET Core: a reproducible project.** Replace illustrative legacy snippets with tested ingestion, embeddings, retrieval, source attribution and authorization. Show failure cases, not only successful answers.
3. **MCP server security in C#.** Tool scope, validation, secrets, transport/auth choices, logging and tests. Keep separate from the performance-testing walkthrough.
4. **Claude vs Copilot vs Codex for the same .NET task.** Original experiments on one public repository; publish tool/model versions, date, diffs, test outcomes and actual costs. Do not invent benchmark winners.
5. **Test AI output in .NET with evaluations.** A practical regression set, incorrect-answer cases and a clear difference between deterministic tests and model-assisted grading.
6. **EF Core vector search vs a dedicated vector store.** Build on the existing scheduled draft after publication. Measure a representative workload before making scale or performance claims.

## Measurement after deployment

- Confirm old-path HTTP 301 responses land on the new path in one hop, including existing query strings; confirm the new URL returns 200.
- Submit the sitemap and inspect the new canonical in Search Console. A route change does not guarantee immediate indexing or a ranking increase.
- Record a 28-day baseline, then compare equal periods for AI query impressions, clicks, CTR and landing pages. Segment brand/community searches from tutorial queries.
- Track the existing `data-cta` hooks with the site's GTM setup if custom community click events are desired. These attributes are hooks, not a claim that an analytics event is configured.
- Compare community outbound clicks and actual Skool trials. Search traffic alone is not the conversion goal.
- Recheck Skool price and trial terms when the offer changes. Refresh technical examples only after verifying their packages and code.

## Validation

Run `npm run build`, `npm run seo-check` and `node scripts/check-ai-community-seo.mjs`. The focused check verifies canonical/social/schema output, migrated sitemap paths, internal guide links, visible question text, article dates and configured redirect rules. Inspect desktop/mobile layouts and both themes before publishing.

### Results from this workspace

- Production build succeeded: 189 static pages, including the new community route.
- Focused AI SEO check passed: 38 internal links on the hub, three Netlify redirect rules and nine AI article exports.
- General SEO check passed across 142 articles and 169 sitemap URLs. It still reports 82 existing warnings, mostly long descriptions outside this AI update and a missing cover for the untracked MCP draft. The image check now recognizes WebP covers correctly.
- Home, blog and community exports each have one H1 and the expected canonical.
- `git diff --check` passed.
- Browser visual QA could not run: the browser tool reported that no browser (including the in-app browser) was available. Desktop/mobile appearance and actual Netlify HTTP redirects remain post-deployment checks.
- No deployment or Search Console submission was performed.
