import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0d0d0d',
          color: '#d4a017',
          fontSize: 22,
          fontWeight: 900,
          fontFamily: 'Georgia, serif',
        }}
      >
        L
      </div>
    ),
    { ...size },
  );
}
