function slugifyHeading(text: string, index: number): string {
  return (
    text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `heading-${index}`
  );
}

/**
 * Inject `id` attributes onto H2/H3 tags in article HTML so the
 * TOC anchor links work. Call this server-side before rendering.
 */
export function addHeadingIds(html: string): string {
  let counter = 0;
  return html.replace(
    /<h([23])(\s[^>]*)?>(.+?)<\/h\1>/gi,
    (_match, level, attrs = '', content) => {
      const text = content.replace(/<[^>]*>/g, '').trim();
      const id = slugifyHeading(text, counter++);
      return `<h${level} id="${id}"${attrs}>${content}</h${level}>`;
    }
  );
}
