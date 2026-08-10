'use client';

import { useEffect, useState } from 'react';

export function ReadingProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const fn = () => {
      const h = document.body.scrollHeight - window.innerHeight;
      setPct(h > 0 ? (window.scrollY / h) * 100 : 0);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 z-[9998] h-[3px] bg-dorado"
      style={{ width: `${pct}%`, transition: 'width 80ms linear' }}
    />
  );
}
