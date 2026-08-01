import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';
import { media } from '@/lib/db/schema';
import { uploadImage } from '@/lib/uploads';

export async function POST(request: Request) {
  await requireAdmin();

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'No se recibió ningún archivo.' }, { status: 400 });
  }

  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Solo se permiten imágenes.' }, { status: 400 });
  }

  try {
    const url = await uploadImage(file);

    const [record] = await db
      .insert(media)
      .values({
        url,
        filename: file.name,
        contentType: file.type,
        size: file.size,
      })
      .returning();

    return NextResponse.json({ url: record.url, id: record.id });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Error al subir el archivo.';
    return NextResponse.json({ error: message }, { status: 501 });
  }
}
