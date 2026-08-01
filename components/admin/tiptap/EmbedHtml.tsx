import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer, NodeViewWrapper, type NodeViewProps } from '@tiptap/react';
import { useEffect, useRef } from 'react';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    embedHtml: {
      setEmbedHtml: (attrs: { html: string }) => ReturnType;
    };
  }
}

/** Known providers we convert to a clean iframe automatically. Anything else
 * (Twitter/X, Instagram, TikTok, etc.) is embedded as raw HTML pasted by the
 * admin from the platform's own "copy embed code" feature — the same
 * fallback WordPress's "Custom HTML" block provides. */
function resolveEmbedHtml(input: string): string {
  const trimmed = input.trim();

  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return `<iframe src="https://player.vimeo.com/video/${vimeoMatch[1]}" width="640" height="360" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
  }

  const spotifyMatch = trimmed.match(/open\.spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/);
  if (spotifyMatch) {
    return `<iframe src="https://open.spotify.com/embed/${spotifyMatch[1]}/${spotifyMatch[2]}" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"></iframe>`;
  }

  // Looks like a plain URL with no known pattern — wrap it in a link instead
  // of guessing at an embed.
  if (/^https?:\/\/\S+$/.test(trimmed) && !trimmed.includes('<')) {
    return `<p><a href="${trimmed}" target="_blank" rel="noopener noreferrer">${trimmed}</a></p>`;
  }

  // Raw embed code pasted by the admin (Twitter/X, Instagram, TikTok, etc.)
  return trimmed;
}

function EmbedHtmlComponent({ node }: NodeViewProps) {
  const html = node.attrs.html as string;
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // <script> tags inserted via innerHTML don't execute; re-create them so
    // platform embed widgets (e.g. Twitter's widgets.js) actually run.
    const scripts = Array.from(container.querySelectorAll('script'));
    scripts.forEach((oldScript) => {
      const newScript = document.createElement('script');
      Array.from(oldScript.attributes).forEach((attr) => newScript.setAttribute(attr.name, attr.value));
      newScript.textContent = oldScript.textContent;
      oldScript.replaceWith(newScript);
    });
  }, [html]);

  return (
    <NodeViewWrapper className="my-4" data-embed-html contentEditable={false}>
      <div
        ref={containerRef}
        className="embed-html-content"
        // Trusted content: pasted exclusively by the site's single admin.
        dangerouslySetInnerHTML={{ __html: node.attrs.html }}
      />
    </NodeViewWrapper>
  );
}

export const EmbedHtml = Node.create({
  name: 'embedHtml',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      html: { default: '' },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-embed-html]' }];
  },

  renderHTML({ HTMLAttributes, node }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-embed-html': '' }),
      node.attrs.html,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(EmbedHtmlComponent);
  },

  addCommands() {
    return {
      setEmbedHtml:
        ({ html }) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { html: resolveEmbedHtml(html) } }),
    };
  },
});
