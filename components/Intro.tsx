'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

const WORDS = ['LIBERTAD', 'PROPIEDAD', 'LIBRE MERCADO'];

export function Intro() {
  const t = useTranslations('metadata');
  const [visible, setVisible] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('intro-played')) return;
    setVisible(true);
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem('intro-played', '1');
      }, 600);
    }, 4200);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-negro ${
        fading ? 'animate-[introOut_0.6s_ease_forwards]' : ''
      }`}
      aria-hidden="true"
    >
      {WORDS.map((word, i) => (
        <span
          key={word}
          className="absolute font-display font-black text-blanco opacity-0"
          style={{
            fontSize: 'clamp(1.6rem, 6vw, 3.2rem)',
            letterSpacing: '0.18em',
            animation: `wordFlash 0.75s ease ${i * 0.65 + 0.1}s both`,
          }}
        >
          {word}
        </span>
      ))}

      <div
        className="relative z-[2] flex flex-col items-center gap-5 opacity-0"
        style={{ animation: 'logoIn 0.8s cubic-bezier(0.22,1,0.36,1) 2.15s forwards', transform: 'translateY(18px)' }}
      >
        <div className="h-20 text-blanco sm:h-24">
          <svg viewBox="0 0 120 120" className="h-full w-auto" aria-hidden="true">
            <rect x="10" y="10" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="6" />
            <text
              x="60" y="72"
              textAnchor="middle"
              fontSize="36"
              fontWeight="900"
              fill="currentColor"
              fontFamily="var(--font-montserrat), sans-serif"
            >
              LF
            </text>
          </svg>
        </div>
        <div
          className="h-[2px] w-0 bg-dorado"
          style={{ animation: 'dividerSlide 0.8s ease 2.95s forwards' }}
        />
        <div
          className="opacity-0 text-[0.72rem] font-medium uppercase tracking-[5px] text-gris-cla"
          style={{ animation: 'tagFade 0.8s ease 3.3s forwards' }}
        >
          {t('title')}
        </div>
      </div>

      <style jsx>{`
        @keyframes wordFlash {
          0%   { opacity: 0; transform: scale(0.94); }
          25%  { opacity: 1; transform: scale(1); }
          65%  { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.06); }
        }
        @keyframes logoIn {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dividerSlide {
          to { width: 180px; }
        }
        @keyframes tagFade {
          to { opacity: 1; }
        }
        @keyframes introOut {
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
