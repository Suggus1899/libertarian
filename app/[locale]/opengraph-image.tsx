import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d0d0d',
          color: '#ffffff',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div
          style={{
            fontSize: 22,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: '#d4a017',
            marginBottom: 24,
          }}
        >
          Think Tank Libertario
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            textTransform: 'uppercase',
            textAlign: 'center',
            padding: '0 60px',
            lineHeight: 1.1,
          }}
        >
          Libertarian Forum
        </div>
      </div>
    ),
    { ...size },
  );
}
