import DOMPurify from 'dompurify';
import { marked } from 'marked';

/**
 * Markdown rendering for note bodies.
 *
 * This sits in `notes/` rather than `domain/` on purpose: sanitising needs a
 * DOM, so it is not pure the way the rest of the model is. Notes are stored as
 * markdown source; HTML only ever exists at render time.
 */

/**
 * Text formatting only. Notes are deliberately not a rich document format —
 * images, embeds and tables are all excluded, so there is nothing here that
 * loads a remote resource or breaks the card layout.
 */
const ALLOWED_TAGS = [
  'p',
  'br',
  'hr',
  'strong',
  'em',
  'del',
  'code',
  'pre',
  'blockquote',
  'ul',
  'ol',
  'li',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'a',
];

const ALLOWED_ATTR = ['href', 'title', 'target', 'rel'];

marked.use({
  gfm: true,
  // A single newline is a line break. In a notes app people press Enter once
  // and expect a new line, not a continuation of the same paragraph.
  breaks: true,
});

/** Anything leaving the app in a new tab should not get a handle back on it. */
let hookInstalled = false;
function installLinkHook() {
  if (hookInstalled || !DOMPurify.isSupported) return;
  DOMPurify.addHook('afterSanitizeAttributes', node => {
    if (node.tagName !== 'A') return;
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  });
  hookInstalled = true;
}

const escapeHtml = (text: string): string =>
  text.replace(
    /[&<>"']/g,
    character =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!,
  );

/**
 * Markdown source to sanitised HTML, safe to pass to `{@html}`.
 *
 * During prerender there is no DOM to sanitise with, so rather than shipping
 * unsanitised markup we fall back to escaped plain text. In practice the
 * prerendered pass has no notes to render anyway — storage is browser-only.
 */
export function renderMarkdown(source: string): string {
  if (!source.trim()) return '';

  const html = marked.parse(source, { async: false });

  if (!DOMPurify.isSupported) return `<p>${escapeHtml(source)}</p>`;

  installLinkHook();
  return DOMPurify.sanitize(html, { ALLOWED_TAGS, ALLOWED_ATTR });
}

/**
 * Markdown source stripped to readable text, for previews, `title` attributes
 * and anywhere a length needs measuring without markup skewing it.
 */
export function toPlainText(source: string): string {
  return source
    .replace(/```[\s\S]*?```/g, ' ') // fenced code blocks
    .replace(/`([^`]*)`/g, '$1') // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images, were any to slip in
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links keep their text
    .replace(/^\s{0,3}>\s?/gm, '') // blockquote markers
    .replace(/^\s{0,3}#{1,6}\s+/gm, '') // heading markers
    .replace(/^\s{0,3}[-*+]\s+/gm, '') // bullets
    .replace(/^\s{0,3}\d+\.\s+/gm, '') // ordered list markers
    .replace(/^\s{0,3}([-*_])\s*(?:\1\s*){2,}$/gm, ' ') // thematic breaks
    .replace(/(\*\*|__)(.*?)\1/g, '$2') // bold
    .replace(/(\*|_)(.*?)\1/g, '$2') // italic
    .replace(/~~(.*?)~~/g, '$1') // strikethrough
    .replace(/\s+/g, ' ')
    .trim();
}
