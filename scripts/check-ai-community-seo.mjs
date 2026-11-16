import assert from 'node:assert/strict';
import fs from 'node:fs';
import matter from 'gray-matter';

const base = 'https://thecodeman.net';
const route = '/ai-for-developers';
const guideRoute = '/ai-for-dotnet-developers';
const read = path => fs.readFileSync(path, 'utf8');
const hub = read(`out${route}.html`);
const htmlOnly = html => html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
const decode = text => text.replace(/&#x27;|&#39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const visibleText = html => decode(htmlOnly(html).replace(/<[^>]*>/g, ''));
const jsonLd = html => [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m => JSON.parse(m[1]));
const hasCanonical = (html, url) => assert.ok(html.includes(`<link rel="canonical" href="${url}"`), `Canonical missing: ${url}`);

hasCanonical(hub, base + route);
assert.equal((hub.match(/<h1\b/g) || []).length, 1, 'Hub must have one H1');
assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(hub), 'Hub must be indexable');
assert.ok(hub.includes('property="og:image" content="https://thecodeman.net/images/ai-for-dotnet-developers.webp"'), 'Community social image missing');
assert.ok(fs.existsSync('public/images/ai-for-dotnet-developers.webp'));
assert.ok(htmlOnly(hub).includes('https://www.skool.com/ai-for-dotnet-developers/about'), 'Join destination missing');
assert.ok(visibleText(hub).includes('$19') && visibleText(hub).includes('7-day free trial'), 'Current offer missing');
const graph = jsonLd(hub).flatMap(x => x['@graph'] || [x]);
for (const type of ['CollectionPage', 'Organization', 'ItemList', 'BreadcrumbList']) assert.ok(graph.some(x => x['@type'] === type), `Missing ${type}`);
assert.ok(!graph.some(x => x['@type'] === 'SoftwareApplication'), 'Community must not claim to be an application');

const sitemap = read('out/sitemap.xml');
assert.ok(sitemap.includes(`<loc>${base}${route}</loc>`));
assert.ok(!sitemap.includes(`${base}/ai-toolkit`), 'Old path still in sitemap');
assert.ok(sitemap.includes(`<loc>${base}${guideRoute}</loc>`), '.NET guide missing from sitemap');
const redirects = read('netlify.toml').split('[[redirects]]').slice(1);
assert.ok(!redirects.some(x => /from = "\/ai-for-dotnet-developers/.test(x)), 'The .NET guide must not be redirected');
for (const old of ['/ai-toolkit', '/ai-toolkit/', '/ai-toolkit.html']) {
  const rule = redirects.find(x => x.includes(`from = "${old}"`));
  assert.ok(rule?.includes(`to = "${route}"`) && /status = 301/.test(rule) && /force = true/.test(rule), `301 missing: ${old}`);
}

const links = [...htmlOnly(hub).matchAll(/href="(\/(?!\/)[^"?#]*)(?:[?#][^"]*)?"/g)].map(m => m[1]);
for (const link of new Set(links)) assert.ok(fs.existsSync(link === '/' ? 'out/index.html' : `out${link}.html`) || fs.existsSync(`out${link}`), `Broken hub link: ${link}`);
for (const file of ['out/index.html','out/blog.html','out/ai-roadmap-2026.html','out/ai-roadmap-course.html']) assert.ok(htmlOnly(read(file)).includes(`href="${route}"`), `Promotion missing: ${file}`);

// Free .NET guide: its own indexable page, every AI post listed once, no broken links.
const guide = read(`out${guideRoute}.html`);
hasCanonical(guide, base + guideRoute);
assert.equal((guide.match(/<h1\b/g) || []).length, 1, 'Guide must have one H1');
assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(guide), 'Guide must be indexable');
assert.ok(htmlOnly(guide).includes(`href="${route}"`), 'Guide must link to the community');
const guideGraph = jsonLd(guide).flatMap(x => x['@graph'] || [x]);
for (const type of ['CollectionPage', 'ItemList', 'BreadcrumbList', 'FAQPage']) assert.ok(guideGraph.some(x => x['@type'] === type), `Guide missing ${type}`);
const guideLinks = [...htmlOnly(guide).matchAll(/href="(\/(?!\/)[^"?#]*)(?:[?#][^"]*)?"/g)].map(m => m[1]);
for (const link of new Set(guideLinks)) assert.ok(fs.existsSync(link === '/' ? 'out/index.html' : `out${link}.html`) || fs.existsSync(`out${link}`), `Broken guide link: ${link}`);
const guideSlugs = new Set(guideLinks.filter(l => l.startsWith('/posts/')).map(l => l.slice(7)));
for (const s of guideSlugs) assert.ok(fs.existsSync(`posts/${s}.md`), `Guide links a missing post: ${s}`);

let checked = 0;
for (const file of fs.readdirSync('posts').filter(f => f.endsWith('.md'))) {
  const { data } = matter(read(`posts/${file}`));
  if (!['AI','AI Tools'].includes(data.category)) continue;
  const slug = file.slice(0,-3);
  const html = read(`out/posts/${slug}.html`);
  hasCanonical(html, `${base}/posts/${slug}`);
  assert.ok(htmlOnly(html).includes(`href="${route}"`), `Missing hub link: ${slug}`);
  assert.ok(!htmlOnly(html).includes('href="/ai-toolkit'), `Old link: ${slug}`);
  const article = jsonLd(html).find(x => x['@type'] === 'BlogPosting');
  assert.equal(article.isPartOf.url, base + guideRoute);
  assert.ok(htmlOnly(html).includes(`href="${guideRoute}"`), `Missing guide link: ${slug}`);
  assert.ok(guideSlugs.has(slug), `AI post not listed in the .NET guide: ${slug}`);
  if (data.updated) assert.equal(article.dateModified, new Date(data.updated).toISOString());
  const faqSchema = jsonLd(html).find(x => x['@type'] === 'FAQPage');
  for (const item of faqSchema?.mainEntity || []) {
    assert.ok(visibleText(html).includes(item.name), `FAQ question hidden: ${slug}: ${item.name}`);
    assert.ok(visibleText(html).includes(item.acceptedAnswer.text), `FAQ answer hidden: ${slug}: ${item.name}`);
  }
  checked++;
}
assert.ok(!read('app/blog/page.tsx').includes('clip: "rect'), 'Crawler-only blog index returned');
console.log(`AI community SEO OK: hub, ${new Set(links).size} hub links, guide with ${guideSlugs.size} posts, 3 redirect rules, ${checked} AI articles.`);
