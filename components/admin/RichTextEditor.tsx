'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
// Link and Underline are NOT imported separately — StarterKit v3 bundles both.
// Passing options through StarterKit.configure({ link: {...}, underline: false })
// avoids the "duplicate extension names" warning.

import Image from '@tiptap/extension-image';
import Youtube from '@tiptap/extension-youtube';
import TextAlign from '@tiptap/extension-text-align';
import { Table, TableRow, TableHeader, TableCell } from '@tiptap/extension-table';
import { useEffect, useState } from 'react';
import { FigureImage } from './tiptap/FigureImage';
import { EmbedHtml } from './tiptap/EmbedHtml';
import { MediaLibrary } from './MediaLibrary';
import { PromptModal, type PromptField } from './PromptModal';

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`border border-gris-brd px-3 py-2 text-xs font-semibold uppercase tracking-wide transition min-h-[40px] ${
        active ? 'bg-negro text-blanco' : 'bg-blanco text-gris-med hover:border-negro hover:text-negro'
      }`}
    >
      {children}
    </button>
  );
}

function ToolbarDivider() {
  return <span className="mx-0.5 w-px self-stretch bg-gris-brd" />;
}

export function RichTextEditor({
  name,
  defaultValue,
  onChange,
}: {
  name: string;
  defaultValue?: string;
  onChange?: (html: string) => void;
}) {
  const [mediaOpen, setMediaOpen] = useState(false);
  const [prompt, setPrompt] = useState<{
    title: string;
    fields: PromptField[];
    submitLabel?: string;
    onSubmit: (values: Record<string, string>) => void;
  } | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false, autolink: true },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Image, // kept for parsing legacy/plain <img> content
      FigureImage,
      EmbedHtml,
      Youtube.configure({ width: 640, height: 360 }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: defaultValue || '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[280px] px-4 py-3 focus:outline-none',
      },
    },
  });

  const [html, setHtml] = useState(defaultValue || '');
  // Forces a re-render on selection changes (e.g. clicking an image) even when
  // the HTML content itself is unchanged — React bails out of re-rendering on
  // an identical `setHtml` string, which would otherwise leave the contextual
  // image/table toolbars stuck showing stale active state.
  const [, forceRerender] = useState(0);

  useEffect(() => {
    if (!editor) return;
    const onUpdate = () => {
      const next = editor.getHTML();
      setHtml(next);
      onChange?.(next);
    };
    const onSelectionChange = () => forceRerender((n) => n + 1);
    editor.on('update', onUpdate);
    editor.on('selectionUpdate', onSelectionChange);
    return () => {
      editor.off('update', onUpdate);
      editor.off('selectionUpdate', onSelectionChange);
    };
  }, [editor, onChange]);

  if (!editor) return null;

  function focusEnd() {
    editor?.commands.focus('end');
  }

  function insertImageFromUrl() {
    setPrompt({
      title: 'Insertar imagen',
      fields: [
        { name: 'url', label: 'URL de la imagen', placeholder: 'https://...', required: true },
        { name: 'caption', label: 'Leyenda (opcional)', placeholder: 'Pie de foto' },
      ],
      onSubmit: ({ url, caption }) => {
        if (!url) return;
        editor?.chain().focus().setFigureImage({ src: url, caption: caption || '', align: 'center', width: '100%' }).run();
        focusEnd();
      },
    });
  }

  function insertImageFromLibrary(url: string) {
    setPrompt({
      title: 'Leyenda de la imagen',
      submitLabel: 'Insertar',
      fields: [{ name: 'caption', label: 'Leyenda (opcional)', placeholder: 'Pie de foto' }],
      onSubmit: ({ caption }) => {
        editor?.chain().focus().setFigureImage({ src: url, caption: caption || '', align: 'center', width: '100%' }).run();
        focusEnd();
      },
    });
  }

  function insertVideo() {
    setPrompt({
      title: 'Insertar video de YouTube',
      fields: [{ name: 'url', label: 'URL del video', placeholder: 'https://youtube.com/watch?v=...', required: true }],
      onSubmit: ({ url }) => {
        if (!url) return;
        editor?.commands.setYoutubeVideo({ src: url });
        focusEnd();
      },
    });
  }

  function insertEmbed() {
    setPrompt({
      title: 'Insertar embed',
      fields: [
        {
          name: 'html',
          label: 'URL (Vimeo/Spotify) o código de embed (Twitter/X, Instagram, TikTok...)',
          multiline: true,
          required: true,
        },
      ],
      onSubmit: ({ html }) => {
        if (!html) return;
        editor?.chain().focus().setEmbedHtml({ html }).run();
        focusEnd();
      },
    });
  }

  function insertLink() {
    setPrompt({
      title: 'Insertar enlace',
      fields: [{ name: 'url', label: 'URL del enlace', placeholder: 'https://...', required: true }],
      onSubmit: ({ url }) => {
        if (url) editor?.chain().focus().setLink({ href: url }).run();
      },
    });
  }

  function insertTable() {
    editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  }

  function editCaption() {
    if (!editor) return;
    const current = (editor.getAttributes('figureImage').caption as string) || '';
    setPrompt({
      title: 'Editar leyenda',
      submitLabel: 'Guardar',
      fields: [{ name: 'caption', label: 'Leyenda de la imagen', defaultValue: current }],
      onSubmit: ({ caption }) => {
        editor.chain().focus().updateFigureImage({ caption }).run();
      },
    });
  }

  const isFigureSelected = editor.isActive('figureImage');
  const isInTable = editor.isActive('table');

  return (
    <div className="border border-gris-brd bg-blanco">
      <div className="flex flex-wrap items-center gap-1.5 border-b border-gris-brd bg-gris-bg p-2">
        <ToolbarButton title="Negrita" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          B
        </ToolbarButton>
        <ToolbarButton title="Cursiva" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          I
        </ToolbarButton>
        <ToolbarButton title="Subrayado" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          U
        </ToolbarButton>
        <ToolbarButton title="Tachado" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
          S
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton title="Título 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </ToolbarButton>
        <ToolbarButton title="Título 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton title="Alinear izquierda" active={editor.isActive({ textAlign: 'left' })} onClick={() => editor.chain().focus().setTextAlign('left').run()}>
          ⇤
        </ToolbarButton>
        <ToolbarButton title="Centrar" active={editor.isActive({ textAlign: 'center' })} onClick={() => editor.chain().focus().setTextAlign('center').run()}>
          ⇔
        </ToolbarButton>
        <ToolbarButton title="Alinear derecha" active={editor.isActive({ textAlign: 'right' })} onClick={() => editor.chain().focus().setTextAlign('right').run()}>
          ⇥
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton title="Lista con viñetas" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • Lista
        </ToolbarButton>
        <ToolbarButton title="Lista numerada" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. Lista
        </ToolbarButton>
        <ToolbarButton title="Cita" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          Cita
        </ToolbarButton>
        <ToolbarButton title="Línea horizontal" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          ―
        </ToolbarButton>
        <ToolbarButton title="Enlace" active={editor.isActive('link')} onClick={insertLink}>
          Enlace
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton title="Imagen desde URL" onClick={insertImageFromUrl}>
          Imagen (URL)
        </ToolbarButton>
        <ToolbarButton title="Elegir de la biblioteca / subir" onClick={() => setMediaOpen(true)}>
          Biblioteca de medios
        </ToolbarButton>
        <ToolbarButton title="Insertar video de YouTube" onClick={insertVideo}>
          Video
        </ToolbarButton>
        <ToolbarButton title="Insertar embed (Vimeo, Spotify, Twitter/X, Instagram...)" onClick={insertEmbed}>
          Embed
        </ToolbarButton>
        <ToolbarButton title="Insertar tabla" onClick={insertTable}>
          Tabla
        </ToolbarButton>

        <ToolbarDivider />

        <ToolbarButton title="Deshacer" onClick={() => editor.chain().focus().undo().run()}>
          ↶
        </ToolbarButton>
        <ToolbarButton title="Rehacer" onClick={() => editor.chain().focus().redo().run()}>
          ↷
        </ToolbarButton>
      </div>

      {isFigureSelected && (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-gris-brd bg-dorado/10 p-2">
          <span className="text-[0.68rem] font-bold uppercase tracking-widest text-gris-med">Imagen:</span>
          <ToolbarButton title="Alinear a la izquierda" onClick={() => editor.chain().focus().updateFigureImage({ align: 'left' }).run()}>
            Izquierda
          </ToolbarButton>
          <ToolbarButton title="Centrar" onClick={() => editor.chain().focus().updateFigureImage({ align: 'center' }).run()}>
            Centro
          </ToolbarButton>
          <ToolbarButton title="Alinear a la derecha" onClick={() => editor.chain().focus().updateFigureImage({ align: 'right' }).run()}>
            Derecha
          </ToolbarButton>
          <ToolbarDivider />
          {['25%', '50%', '75%', '100%'].map((w) => (
            <ToolbarButton key={w} title={`Ancho ${w}`} onClick={() => editor.chain().focus().updateFigureImage({ width: w }).run()}>
              {w}
            </ToolbarButton>
          ))}
          <ToolbarDivider />
          <ToolbarButton title="Editar leyenda" onClick={editCaption}>
            Leyenda
          </ToolbarButton>
        </div>
      )}

      {isInTable && (
        <div className="flex flex-wrap items-center gap-1.5 border-b border-gris-brd bg-dorado/10 p-2">
          <span className="text-[0.68rem] font-bold uppercase tracking-widest text-gris-med">Tabla:</span>
          <ToolbarButton title="Agregar fila" onClick={() => editor.chain().focus().addRowAfter().run()}>
            + Fila
          </ToolbarButton>
          <ToolbarButton title="Agregar columna" onClick={() => editor.chain().focus().addColumnAfter().run()}>
            + Columna
          </ToolbarButton>
          <ToolbarButton title="Eliminar fila" onClick={() => editor.chain().focus().deleteRow().run()}>
            − Fila
          </ToolbarButton>
          <ToolbarButton title="Eliminar columna" onClick={() => editor.chain().focus().deleteColumn().run()}>
            − Columna
          </ToolbarButton>
          <ToolbarButton title="Eliminar tabla" onClick={() => editor.chain().focus().deleteTable().run()}>
            Eliminar tabla
          </ToolbarButton>
        </div>
      )}

      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />

      <MediaLibrary open={mediaOpen} onClose={() => setMediaOpen(false)} onSelect={insertImageFromLibrary} />

      <PromptModal
        open={prompt !== null}
        title={prompt?.title ?? ''}
        fields={prompt?.fields ?? []}
        submitLabel={prompt?.submitLabel}
        onSubmit={(v) => prompt?.onSubmit(v)}
        onClose={() => setPrompt(null)}
      />
    </div>
  );
}
