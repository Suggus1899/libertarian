/**
 * Translation service using LibreTranslate.
 *
 * Can use the public API (https://libretranslate.com) or a self-hosted instance.
 * Set LIBRETRANSLATE_URL in .env.local to use a custom instance.
 * The public API has rate limits; for production use a self-hosted instance
 * or the paid LibreTranslate hosted API key.
 */

const LIBRETRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL || 'https://libretranslate.com';

export type TranslationResult = {
  translatedText: string;
};

/**
 * Translates plain text using LibreTranslate.
 * Preserves HTML by translating in chunks separated by tags.
 */
export async function translateText(
  text: string,
  source: 'es' | 'en',
  target: 'es' | 'en'
): Promise<string> {
  if (source === target) return text;

  const apiKey = process.env.LIBRETRANSLATE_API_KEY || undefined;

  const res = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      q: text,
      source,
      target,
      format: 'text',
      ...(apiKey ? { api_key: apiKey } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `LibreTranslate error ${res.status}: ${body || res.statusText}`
    );
  }

  const data = (await res.json()) as TranslationResult;
  return data.translatedText;
}

/**
 * Translates HTML content by splitting on tags, translating text nodes,
 * and reassembling. This preserves the HTML structure.
 *
 * For better quality on complex HTML, this splits by block-level tags
 * and translates each text chunk separately.
 */
export async function translateHtml(
  html: string,
  source: 'es' | 'en',
  target: 'es' | 'en'
): Promise<string> {
  if (source === target) return html;

  // Split HTML into tags and text, preserving both
  // This regex matches either an HTML tag or a text chunk between tags
  const tokens = html.split(/(<[^>]+>)/).filter(Boolean);

  // Batch all text tokens for a single API call (more efficient)
  const textIndices: number[] = [];
  const textChunks: string[] = [];

  tokens.forEach((token, i) => {
    if (!token.startsWith('<')) {
      const trimmed = token.trim();
      if (trimmed) {
        textIndices.push(i);
        textChunks.push(token);
      }
    }
  });

  if (textChunks.length === 0) return html;

  // Translate all text chunks in a single batch request
  // LibreTranslate supports array input for batch translation
  try {
    const res = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: textChunks,
        source,
        target,
        format: 'text',
        ...(process.env.LIBRETRANSLATE_API_KEY
          ? { api_key: process.env.LIBRETRANSLATE_API_KEY }
          : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(
        `LibreTranslate batch error ${res.status}: ${body || res.statusText}`
      );
    }

    const data = await res.json();

    // LibreTranslate returns either a string (single) or array (batch)
    const translations: string[] = Array.isArray(data.translatedText)
      ? data.translatedText
      : [data.translatedText];

    // Reassemble: replace text tokens with translations
    textIndices.forEach((idx, j) => {
      tokens[idx] = translations[j] || tokens[idx];
    });

    return tokens.join('');
  } catch {
    // Fallback: translate chunks one by one
    for (let j = 0; j < textChunks.length; j++) {
      try {
        tokens[textIndices[j]] = await translateText(
          textChunks[j],
          source,
          target
        );
      } catch {
        // Keep original on failure
      }
    }
    return tokens.join('');
  }
}

/**
 * Translates an article's fields (title, description, category, content).
 * Returns the translated fields ready to insert into the DB.
 */
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
  const [title, description, category, content, author] = await Promise.all([
    translateText(article.title, source, target),
    translateText(article.description, source, target),
    translateText(article.category, source, target),
    translateHtml(article.content, source, target),
    // Author usually stays the same (proper name), but translate anyway
    article.author,
  ]);

  return { title, description, category, content, author };
}
