// Map of common named HTML entities -> their decoded character.
// Numeric entities (&#123; / &#x7b;) are handled via regex below.
const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: "'",
  quot: '"',
  lt: '<',
  gt: '>',
  nbsp: ' ',
  copy: '©',
  reg: '®',
  trade: '™',
  hellip: '…',
  mdash: '—',
  ndash: '–',
  lsquo: '\u2018',
  rsquo: '\u2019',
  ldquo: '\u201c',
  rdquo: '\u201d',
  bull: '•',
  middot: '·',
  deg: '°',
  cent: '¢',
  pound: '£',
  euro: '€',
  yen: '¥',
}

/**
 * Decode HTML entities (named + numeric) in a string. Safe to call repeatedly.
 */
export function decodeHtmlEntities(input: string): string {
  if (!input) return ''
  return input
    // Numeric decimal: &#123;
    .replace(/&#(\d+);/g, (_m, code: string) => {
      const n = parseInt(code, 10)
      return Number.isFinite(n) ? String.fromCodePoint(n) : _m
    })
    // Numeric hex: &#x7b;
    .replace(/&#x([0-9a-f]+);/gi, (_m, code: string) => {
      const n = parseInt(code, 16)
      return Number.isFinite(n) ? String.fromCodePoint(n) : _m
    })
    // Named: &amp; &quot; etc.
    .replace(/&([a-z]+);/gi, (m, name: string) => {
      const k = name.toLowerCase()
      return NAMED_ENTITIES[k] !== undefined ? NAMED_ENTITIES[k] : m
    })
}

/**
 * Clean a property description: strip HTML tags, decode entities,
 * collapse whitespace, normalize line breaks. Returns a readable plain
 * string suitable for display in a paragraph.
 */
export function cleanDescription(raw: string | null | undefined): string {
  if (!raw) return ''
  let text = String(raw)
  // Replace common block tags with newlines so paragraphs survive.
  text = text.replace(/<\s*(br|p|div|li|h[1-6])[^>]*>/gi, '\n')
  // Strip every other tag.
  text = text.replace(/<[^>]+>/g, '')
  // Decode entities (do this after tag stripping in case entities were inside tags).
  text = decodeHtmlEntities(text)
  // Decode again in case entities were double-encoded (e.g. &amp;amp;).
  text = decodeHtmlEntities(text)
  // Collapse runs of whitespace within lines.
  text = text.replace(/[ \t\r\f\v]+/g, ' ')
  // Collapse 3+ newlines down to 2.
  text = text.replace(/\n{3,}/g, '\n\n')
  // Trim each line.
  text = text
    .split('\n')
    .map(l => l.trim())
    .join('\n')
  return text.trim()
}
