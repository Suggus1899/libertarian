'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

type Phase = 'playing' | 'exiting' | 'done';

const WORDMARK = ['L', 'i', 'b', 'e', 'r', 't', 'a', 'r', 'i', 'a', 'n', ' ', 'F', 'o', 'r', 'u', 'm'];
const TOTAL_MS = 3400;

export function Intro() {
  const t = useTranslations('intro');
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<Phase>('playing');
  const [elapsed, setElapsed] = useState(0);

  const finish = useCallback(() => {
    setPhase((p) => (p === 'done' ? p : 'exiting'));
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem('intro-played')) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(true);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const exitTimer = setTimeout(finish, TOTAL_MS);
    return () => clearTimeout(exitTimer);
  }, [visible, finish]);

  // Progress bar tick
  useEffect(() => {
    if (!visible || phase !== 'playing') return;
    const start = Date.now();
    const id = setInterval(() => {
      setElapsed(Math.min(Date.now() - start, TOTAL_MS));
    }, 32);
    return () => clearInterval(id);
  }, [visible, phase]);

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

  const progress = elapsed / TOTAL_MS;

  return (
    <div
      role="dialog"
      aria-label="Intro de Libertarian Forum"
      onClick={finish}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: 'var(--negro)',
        opacity: phase === 'exiting' ? 0 : 1,
        transition: 'opacity 700ms ease-out',
        cursor: 'pointer',
      }}
    >
      {/* Ambient glow */}
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
        {/* Emblem */}
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
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)',
                mixBlendMode: 'overlay',
              }}
            />
          </div>
        </div>

        {/* Letter-stagger wordmark */}
        <div className="mt-7 flex flex-col items-center">
          <div
            className="font-display text-[2.2rem] font-black uppercase leading-[0.95] sm:text-[2.7rem]"
            aria-label="Libertarian Forum"
          >
            {WORDMARK.map((char, i) => (
              <span
                key={i}
                aria-hidden
                style={{
                  display: 'inline-block',
                  color: 'var(--dorado)',
                  opacity: 0,
                  animation: `lf-letter-in 0.45s cubic-bezier(0.22,1,0.36,1) ${0.85 + i * 0.045}s both`,
                }}
              >
                {char}
              </span>
            ))}
          </div>
          <span
            className="mt-2 text-sm sm:text-base"
            style={{
              color: 'var(--dorado)',
              opacity: 0,
              animation: `lf-fade-up 0.6s ease ${0.85 + WORDMARK.length * 0.045 + 0.1}s both`,
            }}
          >
            {t('tagline')}
          </span>
        </div>

        {/* Double line expanding from center */}
        <div className="relative mt-6 flex w-40 items-center justify-center sm:w-56">
          <div
            aria-hidden
            className="absolute left-1/2 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, var(--dorado))',
              width: 0,
              animation: 'lf-line-right 0.7s cubic-bezier(0.22,1,0.36,1) 1.15s both',
              transformOrigin: 'left',
            }}
          />
          <div
            aria-hidden
            className="absolute right-1/2 h-px"
            style={{
              background: 'linear-gradient(270deg, transparent, var(--dorado))',
              width: 0,
              animation: 'lf-line-left 0.7s cubic-bezier(0.22,1,0.36,1) 1.15s both',
              transformOrigin: 'right',
            }}
          />
        </div>
      </div>

      {/* Progress bar instead of tap-to-continue text */}
      <div
        aria-hidden
        className="absolute bottom-8 w-32 sm:w-44"
        style={{ opacity: 0, animation: 'lf-fade-up 0.5s ease 2s both' }}
      >
        <div
          className="h-px w-full"
          style={{ background: 'rgba(212,160,23,0.15)' }}
        >
          <div
            className="h-full"
            style={{
              width: `${progress * 100}%`,
              background: 'var(--dorado)',
              transition: 'width 32ms linear',
            }}
          />
        </div>
      </div>
    </div>
  );
}
