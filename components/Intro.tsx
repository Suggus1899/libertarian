'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type Phase = 'playing' | 'exiting' | 'done';

export function Intro() {
  const t = useTranslations('intro');
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>('playing');

  const finish = useCallback(() => {
    setPhase((p) => (p === 'done' ? p : 'exiting'));
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('intro-played')) return;
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const exitTimer = setTimeout(finish, 3400);
    return () => clearTimeout(exitTimer);
  }, [visible, finish]);

  useEffect(() => {
    if (phase !== 'exiting') return;
    const doneTimer = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem('intro-played', '1');
    }, 700);
    return () => clearTimeout(doneTimer);
  }, [phase]);

  useEffect(() => {
    if (!visible || phase !== 'playing') return;
    const onKey = () => finish();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [visible, phase, finish]);

  if (!visible || phase === 'done') return null;

  return (
    <div
      role="dialog"
      aria-label="Intro de Libertarian Forum"
      onClick={finish}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-out"
      style={{
        backgroundColor: 'var(--negro)',
        opacity: phase === 'exiting' ? 0 : 1,
        cursor: 'pointer',
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(42% 42% at 50% 42%, rgba(212,160,23,0.14) 0%, rgba(212,160,23,0.04) 34%, transparent 60%)',
        }}
      />

      <div
        className="relative flex flex-col items-center px-6"
        style={{
          transform: phase === 'exiting' ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 700ms cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div className="relative flex items-center justify-center">
          <div
            aria-hidden
            className="lf-glow-anim absolute h-64 w-64 rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(212,160,23,0.5) 0%, rgba(212,160,23,0.12) 45%, transparent 70%)',
              filter: 'blur(8px)',
            }}
          />
          <div className="lf-emblem-anim relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/emblem.png"
              alt="Emblema de Libertarian Forum: un águila sobre tres pilares dentro de un escudo"
              className="relative h-40 w-auto select-none sm:h-48"
              draggable={false}
            />
            <span
              aria-hidden
              className="lf-shimmer-anim pointer-events-none absolute inset-y-0 left-0 w-1/3"
              style={{
                background:
                  'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
                mixBlendMode: 'overlay',
              }}
            />
          </div>
        </div>

        <div className="lf-word-anim mt-7 flex flex-col items-center overflow-hidden">
          <span
            className="font-display text-[2.2rem] font-black uppercase leading-[0.95] sm:text-[2.7rem]"
            style={{ color: 'var(--dorado)' }}
          >
            Libertarian
            <br />
            Forum
          </span>
          <span className="mt-2 text-sm sm:text-base" style={{ color: 'var(--dorado)' }}>
            {t('tagline')}
          </span>
        </div>

        <div
          className="lf-line-anim mt-6 h-px w-40 sm:w-56"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--dorado), transparent)',
          }}
        />
      </div>

      <p
        className="lf-fade-up absolute bottom-8 text-xs tracking-[0.3em] uppercase"
        style={{ color: 'rgba(212,160,23,0.55)', animationDelay: '2s' }}
      >
        {t('tapToContinue')}
      </p>
    </div>
  );
}
