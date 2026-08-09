/**
 * Translation via MyMemory (free, no key required).
 * Optional: set MYMEMORY_API_KEY (free registration at mymemory.translated.net)
 * to raise the daily limit from ~1K to 10K words/day.
 */

const MYMEMORY = 'https://api.mymemory.translated.net/get';
const CHUNK = 480; // stay under the 500-char free-tier per-request limit

async function callApi(text: string, langpair: string): Promise<string> {
  const url = new URL(MYMEMORY);
  url.searchParams.set('q', text);
  url.searchParams.set('langpair', langpair);
  const key = process.env.MYMEMORY_API_KEY;
  if (key) url.searchParams.set('key', key);

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`MyMemory ${res.status}`);
  const data = await res.json() as { responseData: { translatedText: string }; responseStatus: number };
  if (data.responseStatus !== 200) throw new Error(`MyMemory status ${data.responseStatus}`);
  return data.responseData.translatedText;
}

async function translateChunked(text: string, langpair: string): Promise<string> {
  if (!text.trim()) return text;
  if (text.length <= CHUNK) return callApi(text, langpair);

  // Split on sentence boundaries, then batch into ≤CHUNK chunks
  const sentences = text.match(/[^.!?\n]+[.!?\n]*/g) ?? [text];
  const batches: string[] = [];
  let current = '';
  for (const s of sentences) {
    if (current.length + s.length > CHUNK && current) {
      batches.push(current);
      current = s;
    } else {
      current += s;
    }
  }
  if (current) batches.push(current);

  const parts: string[] = [];
  for (const batch of batches) {
    parts.push(await callApi(batch, langpair));
    if (batches.length > 1) await new Promise((r) => setTimeout(r, 200));
  }
  return parts.join(' ');
}

export async function translateText(
  text: string,
  source: 'es' | 'en',
  target: 'es' | 'en'
): Promise<string> {
  if (source === target || !text.trim()) return text;
  return translateChunked(text, `${source}|${target}`);
}

// Replaces HTML tags with numbered placeholders before sending to MyMemory,
// then restores them — so the API never sees or corrupts markup.
export async function translateHtml(
  html: string,
  source: 'es' | 'en',
  target: 'es' | 'en'
): Promise<string> {
  if (source === target || !html.trim()) return html;
  const tags: string[] = [];
  const stripped = html.replace(/<[^>]+>/g, (tag) => {
    tags.push(tag);
    return `[${tags.length - 1}]`;
  });
  const translated = await translateChunked(stripped, `${source}|${target}`);
  return translated.replace(/\[(\d+)\]/g, (_, i) => tags[+i] ?? '');
}

export async function translateArticleFields(
  article: {
    title: string;
    description: string;
    category: string;
    content: string;
    author: string;
  },
  source: 'es' | 'en',
  target: 'es' | 'en'
): Promise<{
  title: string;
  description: string;
  category: string;
  content: string;
  author: string;
}> {
  const lp = `${source}|${target}`;
  const [title, description, category] = await Promise.all([
    translateChunked(article.title, lp),
    translateChunked(article.description, lp),
    translateChunked(article.category, lp),
  ]);
  const content = await translateHtml(article.content, source, target);
  return { title, description, category, content, author: article.author };
}
