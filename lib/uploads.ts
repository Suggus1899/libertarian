import path from 'node:path';
import { promises as fs } from 'node:fs';

export async function uploadImage(file: File): Promise<string> {
  const uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads');
  const slug = `${Date.now()}-${sanitizeFilename(file.name)}`;
  const filePath = path.join(uploadDir, slug);

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));

  const publicPrefix = path.join(process.cwd(), 'public');
  if (uploadDir.startsWith(publicPrefix)) {
    const rel = path.relative(publicPrefix, filePath).split(path.sep).join('/');
    return `/${rel}`;
  }
  return `/uploads/${slug}`;
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
}
