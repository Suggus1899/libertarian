/**
 * Translation service using DeepL API.
 * Set DEEPL_API_KEY in .env.local — free keys end with ':fx' (api-free.deepl.com).
 * Paid keys use api.deepl.com. The base URL is auto-detected from the key suffix.
 */

function getBaseUrl(): string {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error('DEEPL_API_KEY is not set');
  return key.endsWith(':fx')
    ? 'https://api-free.deepl.com'
    : 'https://api.deepl.com';
}

async function deepl(texts: string[], target: 'es' | 'en', isHtml = false): Promise<string[]> {
  const key = process.env.DEEPL_API_KEY;
  if (!key) throw new Error('DEEPL_API_KEY is not set');

  const res = await fetch(`${getBaseUrl()}/v2/translate`, {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: texts,
      target_lang: target.toUpperCase(),
      ...(isHtml ? { tag_handling: 'html' } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`DeepL error ${res.status}: ${body || res.statusText}`);
  }

  const data = await res.json() as { translations: { text: string }[] };
  return data.translations.map((t) => t.text);
}

export async function translateText(
  text: string,
  source: 'es' | 'en',
  target: 'es' | 'en'
): Promise<string> {
  if (source === target || !text.trim()) return text;
  const [result] = await deepl([text], target);
  return result;
}

// DeepL handles HTML natively — no manual tag-splitting needed.
export async function translateHtml(
  html: string,
  source: 'es' | 'en',
  target: 'es' | 'en'
): Promise<string> {
  if (source === target || !html.trim()) return html;
  const [result] = await deepl([html], target, true);
  return result;
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
  // Batch plain-text fields and HTML content in parallel
  const [[title, description, category], content] = await Promise.all([
    deepl([article.title, article.description, article.category], target),
    deepl([article.content], target, true).then((r) => r[0]),
  ]);

  return { title, description, category, content, author: article.author };
}
