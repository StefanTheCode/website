import { PostMetadata } from "./PostMetadata";

interface SearchDocument {
  post: PostMetadata;
  title: string;
  subtitle: string;
  category: string;
  newsletterTitle: string;
  searchText: string;
  slug: string;
  all: string;
}

const normalize = (value: string | null | undefined) =>
  (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/asp\s*\.?\s*net/g, " aspnet asp dotnet ")
    .replace(/\.\s*net/g, " dotnet ")
    .replace(/c\s*(?:#|sharp)/g, " csharp ")
    .replace(/[^a-z0-9+]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");

const indexPost = (post: PostMetadata): SearchDocument => {
  const title = normalize(post.title);
  const subtitle = normalize(post.subtitle);
  const category = normalize(post.category);
  const newsletterTitle = normalize(post.newsletterTitle);
  const searchText = normalize(post.searchText);
  const slug = normalize(post.slug);

  return {
    post,
    title,
    subtitle,
    category,
    newsletterTitle,
    searchText,
    slug,
    all: `${title} ${subtitle} ${category} ${newsletterTitle} ${searchText} ${slug}`,
  };
};

const exactMatchRank = (document: SearchDocument, tokens: string[], phrase: string) => {
  if (document.title.includes(phrase)) return 0;

  return tokens.reduce((score, token) => {
    if (document.title.includes(token)) return score;
    if (document.category.includes(token)) return score + 2;
    if (document.subtitle.includes(token)) return score + 3;
    if (document.newsletterTitle.includes(token)) return score + 4;
    if (document.searchText.includes(token)) return score + 4;
    return score + 5;
  }, 0);
};

const editDistance = (left: string, right: string) => {
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let diagonal = previous[0];
    previous[0] = leftIndex;

    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const above = previous[rightIndex];
      previous[rightIndex] = Math.min(
        previous[rightIndex] + 1,
        previous[rightIndex - 1] + 1,
        diagonal + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      );
      diagonal = above;
    }
  }

  return previous[right.length];
};

const fuzzyTokenDistance = (queryToken: string, documentWords: string[]) => {
  const allowedDistance = queryToken.length >= 8 ? 2 : queryToken.length >= 5 ? 1 : 0;
  if (allowedDistance === 0) return Number.POSITIVE_INFINITY;

  let bestDistance = Number.POSITIVE_INFINITY;

  for (const word of documentWords) {
    if (Math.abs(word.length - queryToken.length) > allowedDistance) continue;
    bestDistance = Math.min(bestDistance, editDistance(queryToken, word));
    if (bestDistance === 0) break;
  }

  return bestDistance <= allowedDistance ? bestDistance : Number.POSITIVE_INFINITY;
};

export const searchBlogPosts = (posts: PostMetadata[], rawQuery: string): PostMetadata[] => {
  const query = normalize(rawQuery);
  if (!query) return posts;

  const tokens = Array.from(new Set(query.split(" ").filter(Boolean)));
  const documents = posts.map(indexPost);
  const exactMatches = documents
    .filter(document => tokens.every(token => document.all.includes(token)))
    .map(document => ({ document, rank: exactMatchRank(document, tokens, query) }))
    .sort((a, b) => a.rank - b.rank);

  if (exactMatches.length > 0) {
    return exactMatches.map(result => result.document.post);
  }

  // Keep a conservative typo-tolerant fallback. Every query word must still
  // match, so an unrelated article cannot rank merely because one word does.
  return documents
    .map(document => {
      const words = Array.from(new Set(document.all.split(" ").filter(Boolean)));
      const distances = tokens.map(token => {
        if (words.some(word => word.includes(token))) return 0;
        return fuzzyTokenDistance(token, words);
      });

      return { document, distances };
    })
    .filter(result => result.distances.every(Number.isFinite))
    .sort((a, b) => {
      const aDistance = a.distances.reduce((total, distance) => total + distance, 0);
      const bDistance = b.distances.reduce((total, distance) => total + distance, 0);
      return aDistance - bDistance;
    })
    .map(result => result.document.post);
};
