import { Node, mergeAttributes } from '@tiptap/core';

export type CalloutVariant = 'quote' | 'info' | 'warning';

export interface CalloutOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    callout: {
      setCallout: (attrs?: { variant?: CalloutVariant; cite?: string }) => ReturnType;
      toggleCallout: () => ReturnType;
      updateCallout: (attrs: Partial<{ variant: CalloutVariant; cite: string }>) => ReturnType;
    };
  }
}

/**
 * A callout / highlighted quote block for essays.
 *
 * Renders as `<blockquote class="callout" data-variant="quote|info|warning">`.
 * The `cite` attribute adds a `<cite>` footer (ideal for Hayek, Mises, etc.).
 *
 * This is a wrapping block (not atom) — the user types content inside it,
 * just like a regular blockquote. The variant and cite are controlled via
 * toolbar buttons.
 */
export const Callout = Node.create<CalloutOptions>({
  name: 'callout',
  group: 'block',
  content: 'block+',
  defining: true,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      variant: { default: 'quote' },
      cite: { default: '' },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'blockquote.callout',
        getAttrs: (el) => {
          if (!(el instanceof HTMLElement)) return {};
          const cite = el.querySelector('footer.callout-cite');
          return {
            variant: el.getAttribute('data-variant') || 'quote',
            cite: cite?.textContent ?? '',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const { variant, cite } = node.attrs as { variant: CalloutVariant; cite: string };

    const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      class: 'callout',
      'data-variant': variant,
    });

    if (cite) {
      return ['blockquote', attrs, 0, ['footer', { class: 'callout-cite' }, `— ${cite}`]];
    }

    return ['blockquote', attrs, 0];
  },

  addCommands() {
    return {
      setCallout:
        (attrs) =>
        ({ commands }) =>
          commands.wrapIn(this.name, attrs),
      toggleCallout:
        () =>
        ({ commands }) => {
          // If already inside a callout, lift out
          if (commands.lift(this.name)) return true;
          return commands.wrapIn(this.name, { variant: 'quote' });
        },
      updateCallout:
        (attrs) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, attrs),
    };
  },

  addKeyboardShortcuts() {
    return {
      'Mod-Shift-c': () => this.editor.commands.toggleCallout(),
    };
  },
});
