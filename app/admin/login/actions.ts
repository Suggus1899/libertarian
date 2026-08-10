'use server';

import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';
import { redirect } from 'next/navigation';
import { createSession } from '@/lib/auth';

function readEnvLocal(): Record<string, string> {
  try {
    const content = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
    const env: Record<string, string> = {};
    for (const line of content.split('\n')) {
      const m = line.match(/^([^=#][^=]*)=(.*)/);
      if (m) env[m[1].trim()] = m[2].trim().replace(/^['"]|['"]$/g, '');
    }
    return env;
  } catch {
    return {};
  }
}

export async function login(_prevState: unknown, formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || typeof password !== 'string') {
    return { error: 'Datos inválidos.' };
  }

  const env = readEnvLocal();
  const adminEmail = (process.env.ADMIN_EMAIL ?? env.ADMIN_EMAIL)?.trim();
  const adminPasswordHash = (process.env.ADMIN_PASSWORD_HASH ?? env.ADMIN_PASSWORD_HASH)?.trim().replace(/^['"]|['"]$/g, '');

  if (!adminEmail || !adminPasswordHash) {
    return { error: 'El admin no está configurado. Contacta al desarrollador.' };
  }

  if (email !== adminEmail) {
    return { error: 'Credenciales incorrectas.' };
  }

  const valid = await bcrypt.compare(password, adminPasswordHash);
  if (!valid) {
    return { error: 'Credenciales incorrectas.' };
  }

  await createSession(email);
  redirect('/admin');
}

// Demo login — bypasses password check. Only active when DEMO_MODE=true is
// set in the environment. This lets reviewers try the admin panel without
// knowing the real password. NEVER set DEMO_MODE in production.
export async function demoLogin() {
  if (process.env.DEMO_MODE !== 'true') {
    return { error: 'El modo demo no está activo.' };
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'demo@libertarianforum.org';
  await createSession(adminEmail);
  redirect('/admin');
}
