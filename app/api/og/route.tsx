import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') ?? 'Libertarian Forum';
  const category = searchParams.get('category') ?? '';

  const fontSize = title.length > 60 ? 46 : title.length > 40 ? 56 : 68;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: '#0d0d0d',
          padding: '64px',
          position: 'relative',
        }}
      >
        {/* Watermark */}
        <div
          style={{
            position: 'absolute',
            top: -20,
            right: -10,
            color: 'rgba(255,255,255,0.025)',
            fontSize: 320,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          LF
        </div>

        {category && (
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: 6,
              textTransform: 'uppercase',
              color: '#d4a017',
              marginBottom: 20,
            }}
          >
            {category}
          </div>
        )}

        <div
          style={{
            fontSize,
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1.15,
            marginBottom: 40,
          }}
        >
          {title}
        </div>

        <div style={{ width: 80, height: 3, background: '#d4a017', marginBottom: 32 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              border: '4px solid rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.7)',
              fontSize: 18,
              fontWeight: 900,
            }}
          >
            LF
          </div>
          <div
            style={{
              fontSize: 16,
              letterSpacing: 5,
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
            }}
          >
            Libertarian Forum
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
