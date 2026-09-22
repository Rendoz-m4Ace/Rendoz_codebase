'use client';

import { useEffect, useState } from 'react';

export function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);
  const [running, setRunning] = useState(true);

  useEffect(() => {
    if (!running) return;
    if (remaining <= 0) {
      setRunning(false);
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, running]);

  const reset = (next: number = seconds) => {
    setRemaining(next);
    setRunning(true);
  };

  const fmt = `${String(Math.floor(remaining / 60)).padStart(2, '0')}:${String(remaining % 60).padStart(2, '0')}`;

  return { remaining, fmt, reset };
}
