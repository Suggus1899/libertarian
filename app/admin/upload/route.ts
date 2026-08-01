import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { requireAdmin } from '@/lib/auth';

export async function POST(request: Request) {
  await requireAdmin();

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          'La subida de archivos no está configurada (falta BLOB_READ_WRITE_TOKEN). Usá "Imagen (URL)" mientras tanto.',
      },
      { status: 501 },
    );
  }

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Solo se permiten imágenes.' }, { status: 400 });
  }

  const blob = await put(`articles/${Date.now()}-${file.name}`, file, {
    access: 'public',
  });

  return NextResponse.json({ url: blob.url });
}
