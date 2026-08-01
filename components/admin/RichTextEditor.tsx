'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import { useEffect, useRef, useState } from 'react';

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
      className={`border border-gris-brd px-2.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
        active ? 'bg-negro text-blanco' : 'bg-blanco text-gris-med hover:border-negro hover:text-negro'
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ link: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image,
      Youtube.configure({ width: 640, height: 360 }),
    ],
    content: defaultValue || '<p></p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[280px] px-4 py-3 focus:outline-none',
      },
    },
  });

  const [html, setHtml] = useState(defaultValue || '');

  useEffect(() => {
    if (!editor) return;
    const update = () => setHtml(editor.getHTML());
    editor.on('update', update);
    return () => {
      editor.off('update', update);
    };
  }, [editor]);

  if (!editor) return null;

  // After inserting an image/video node, ProseMirror leaves it as the active
  // "node selection". Moving the cursor to the end afterwards prevents the
  // *next* inserted node from replacing it instead of being added after it.
  function insertImageFromUrl() {
    const url = window.prompt('URL de la imagen:');
    if (!url) return;
    editor?.chain().focus().setImage({ src: url }).run();
    editor?.commands.focus('end');
  }

  function insertVideo() {
    const url = window.prompt('URL del video de YouTube:');
    if (!url) return;
    editor?.commands.setYoutubeVideo({ src: url });
    editor?.commands.focus('end');
  }

  function insertLink() {
    const url = window.prompt('URL del enlace:');
    if (url) editor?.chain().focus().setLink({ href: url }).run();
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al subir el archivo');
      editor?.chain().focus().setImage({ src: data.url }).run();
      editor?.commands.focus('end');
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Error al subir el archivo');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  return (
    <div className="border border-gris-brd bg-blanco">
      <div className="flex flex-wrap gap-1.5 border-b border-gris-brd bg-gris-bg p-2">
        <ToolbarButton title="Negrita" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          B
        </ToolbarButton>
        <ToolbarButton title="Cursiva" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          I
        </ToolbarButton>
        <ToolbarButton title="Título 2" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
          H2
        </ToolbarButton>
        <ToolbarButton title="Título 3" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
          H3
        </ToolbarButton>
        <ToolbarButton title="Lista con viñetas" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • Lista
        </ToolbarButton>
        <ToolbarButton title="Lista numerada" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. Lista
        </ToolbarButton>
        <ToolbarButton title="Cita" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          Cita
        </ToolbarButton>
        <ToolbarButton title="Enlace" active={editor.isActive('link')} onClick={insertLink}>
          Enlace
        </ToolbarButton>
        <ToolbarButton title="Imagen desde URL" onClick={insertImageFromUrl}>
          Imagen (URL)
        </ToolbarButton>
        <ToolbarButton title="Subir imagen" onClick={() => fileInputRef.current?.click()}>
          {uploading ? 'Subiendo...' : 'Subir imagen'}
        </ToolbarButton>
        <ToolbarButton title="Insertar video de YouTube" onClick={insertVideo}>
          Video
        </ToolbarButton>
        <ToolbarButton title="Deshacer" onClick={() => editor.chain().focus().undo().run()}>
          ↶
        </ToolbarButton>
        <ToolbarButton title="Rehacer" onClick={() => editor.chain().focus().redo().run()}>
          ↷
        </ToolbarButton>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileUpload}
      />

      {uploadError && (
        <p className="border-b border-gris-brd bg-red-50 px-4 py-2 text-xs font-semibold text-red-600">
          {uploadError}
        </p>
      )}

      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
