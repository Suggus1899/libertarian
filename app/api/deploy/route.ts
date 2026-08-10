import { createHmac, timingSafeEqual } from 'crypto';
import { spawn } from 'child_process';

export async function POST(request: Request) {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;
  if (!secret) return Response.json({ error: 'GITHUB_WEBHOOK_SECRET not set' }, { status: 500 });

  const sig = request.headers.get('x-hub-signature-256') ?? '';
  const body = await request.text();
  const expected = `sha256=${createHmac('sha256', secret).update(body).digest('hex')}`;

  if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
    return Response.json({ error: 'invalid signature' }, { status: 401 });
  }

  const payload = JSON.parse(body) as { ref?: string };
  if (payload.ref !== 'refs/heads/master') {
    return Response.json({ message: 'skipped — not master' });
  }

  const child = spawn('bash', ['/var/www/libertarian/scripts/deploy.sh'], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();

  return Response.json({ message: 'deploy started' }, { status: 202 });
}
