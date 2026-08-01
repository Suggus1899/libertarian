import { Node, mergeAttributes } from '@tiptap/core';

export type FigureAlign = 'left' | 'center' | 'right';

export interface FigureImageOptions {
  HTMLAttributes: Record<string, unknown>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    figureImage: {
      setFigureImage: (attrs: {
        src: string;
        alt?: string;
        caption?: string;
        width?: string;
        align?: FigureAlign;
      }) => ReturnType;
      updateFigureImage: (attrs: Partial<{
        alt: string;
        caption: string;
        width: string;
        align: FigureAlign;
      }>) => ReturnType;
    };
  }
}

/**
 * A WordPress-style image block: <figure><img/><figcaption/></figure>
 * with align (left/center/right) and width (percentage) attributes.
 * Rendered as an atom node — editing caption/align/width is done through
 * toolbar actions (see RichTextEditor) rather than inline contenteditable,
 * consistent with the rest of this editor's prompt-based media UX.
 */
export const FigureImage = Node.create<FigureImageOptions>({
  name: 'figureImage',
  group: 'block',
  atom: true,
  draggable: true,

  addOptions() {
    return { HTMLAttributes: {} };
  },

  addAttributes() {
    // `rendered: false` for all of these — renderHTML below builds the
    // <figure>/<img>/<figcaption> markup explicitly, so we don't want Tiptap
    // to also auto-serialize these as raw attributes on the <figure> tag.
    return {
      src: { default: null, rendered: false },
      alt: { default: '', rendered: false },
      caption: { default: '', rendered: false },
      width: { default: '100%', rendered: false },
      align: { default: 'center', rendered: false },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'figure[data-figure-image]',
        getAttrs: (el) => {
          if (!(el instanceof HTMLElement)) return {};
          const img = el.querySelector('img');
          const figcaption = el.querySelector('figcaption');
          return {
            src: img?.getAttribute('src') ?? null,
            alt: img?.getAttribute('alt') ?? '',
            caption: figcaption?.textContent ?? '',
            width: el.getAttribute('data-width') ?? '100%',
            align: el.getAttribute('data-align') ?? 'center',
          };
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes, node }) {
    const { src, alt, caption, width, align } = node.attrs as {
      src: string;
      alt: string;
      caption: string;
      width: string;
      align: FigureAlign;
    };

    const marginLeft = align === 'right' ? 'auto' : '0';
    const marginRight = align === 'left' ? 'auto' : '0';
    const style = `width:${width};margin-left:${marginLeft};margin-right:${marginRight};`;

    const children: unknown[] = [['img', { src, alt, style: 'width:100%;display:block;' }]];
    if (caption) {
      children.push(['figcaption', { style: 'text-align:center;font-size:0.8rem;color:#8a8a8a;margin-top:6px;' }, caption]);
    }

    return [
      'figure',
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        'data-figure-image': '',
        'data-width': width,
        'data-align': align,
        style,
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(children as any[]),
    ];
  },

  addCommands() {
    return {
      setFigureImage:
        (attrs) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs }),
      updateFigureImage:
        (attrs) =>
        ({ commands }) =>
          commands.updateAttributes(this.name, attrs),
    };
  },
});
