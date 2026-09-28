import { Children, isValidElement, type ReactNode } from 'react';

const BLOCK_TAGS = new Set([
  'ul', 'ol', 'dl', 'div', 'pre', 'table', 'blockquote', 'figure', 'hr', 'section',
  'details', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'form', 'nav', 'aside',
]);

/**
 * markdown-to-jsx sometimes nests lists/blocks inside a <p> (e.g. loose nested lists).
 * <ul> inside <p> is invalid HTML: the browser splits the paragraph, React hydration
 * fails (minified error #418) and the whole page re-renders on the client (console
 * error + layout shift). Render such paragraphs as <div class="md-p"> instead.
 */
export default function MarkdownParagraph({ children, ...props }: { children?: ReactNode; [k: string]: any }) {
  const hasBlock = Children.toArray(children).some(
    (c) => isValidElement(c) && (typeof c.type !== 'string' || BLOCK_TAGS.has(c.type))
  );
  return hasBlock ? <div {...props} className={`md-p ${props.className ?? ''}`.trim()}>{children}</div> : <p {...props}>{children}</p>;
}
