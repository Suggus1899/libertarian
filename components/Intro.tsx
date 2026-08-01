'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export function Intro() {
  const t = useTranslations('metadata');
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => setVisible(false), 800);
    }, 3200);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-blanco ${
        fading ? 'animate-[introOut_0.8s_ease_forwards]' : ''
      }`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-[introBg_2s_ease_0.2s_both]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(212,160,23,0.07)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-[2] flex flex-col items-center gap-6 opacity-0 [animation:introCard_1s_cubic-bezier(0.22,1,0.36,1)_0.3s_forwards]">
        <div className="h-20 text-negro sm:h-28">
          <svg
            viewBox="0 0 120 120"
            className="h-full w-auto drop-shadow-[0_2px_12px_rgba(212,160,23,0.15)]"
            aria-hidden="true"
          >
            <rect x="10" y="10" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="6" />
            <text
              x="60"
              y="72"
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
        <div className="h-[2px] w-0 animate-[dividerSlide_0.8s_ease_1.6s_forwards] bg-dorado" />
        <div className="opacity-0 text-[0.72rem] font-medium uppercase tracking-[5px] text-gris-med [animation:tagFade_0.8s_ease_2s_forwards]">
          {t('title')}
        </div>
      </div>

      <style jsx>{`
        @keyframes introBg {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes introCard {
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes dividerSlide {
          to {
            width: 200px;
          }
        }
        @keyframes tagFade {
          to {
            opacity: 1;
          }
        }
        @keyframes introOut {
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
