import { put } from '@vercel/blob';
import path from 'node:path';
import { promises as fs } from 'node:fs';

/**
 * Image upload abstraction.
 *
 * Two drivers:
 *  - "vercel-blob" (default): uses @vercel/blob. Requires BLOB_READ_WRITE_TOKEN.
 *    Best for Vercel deployments.
 *  - "local": writes to UPLOAD_DIR (defaults to ./public/uploads) and returns a
 *    relative URL served by Next.js. Best for VPS deployments where you control
 *    the filesystem and want uploads to persist across restarts.
 *
 * The driver is selected via UPLOAD_DRIVER env var. When neither
 * BLOB_READ_WRITE_TOKEN nor UPLOAD_DRIVER=local is set, uploadImage throws and
 * the caller (the /admin/upload route) returns a 501 so the admin can still
 * paste an image URL directly.
 */
export async function uploadImage(file: File): Promise<string> {
  const driver = process.env.UPLOAD_DRIVER || 'vercel-blob';

  if (driver === 'local') {
    return uploadLocal(file);
  }

  return uploadBlob(file);
}

async function uploadBlob(file: File): Promise<string> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error(
      'La subida de archivos no está configurada (falta BLOB_READ_WRITE_TOKEN). Usá "Imagen (URL)" mientras tanto.',
    );
  }

  const blob = await put(`articles/${Date.now()}-${file.name}`, file, {
    access: 'public',
  });
  return blob.url;
}

async function uploadLocal(file: File): Promise<string> {
  const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads');
  const slug = `${Date.now()}-${sanitizeFilename(file.name)}`;
  const filePath = path.join(uploadDir, slug);

  // Ensure the directory exists.
  await fs.mkdir(uploadDir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(filePath, bytes);

  // Return a web-accessible relative URL. UPLOAD_DIR is expected to live
  // inside public/ (the default), so the URL is /uploads/<slug>. If the admin
  // points UPLOAD_DIR elsewhere, they're responsible for serving it.
  const publicPrefix = path.join(process.cwd(), 'public');
  if (uploadDir.startsWith(publicPrefix)) {
    const rel = path.relative(publicPrefix, filePath).split(path.sep).join('/');
    return `/${rel}`;
  }

  // Fallback: assume a static mount at /uploads regardless.
  return `/uploads/${slug}`;
}

function sanitizeFilename(name: string): string {
  // Keep it filesystem-safe: strip path separators, collapse spaces.
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
}
