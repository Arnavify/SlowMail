import { useEffect, useState } from "react";

/**
 * A ticking clock. Everything time-based derives from timestamps, so the UI
 * only needs a periodic "now" to re-evaluate delivery state. Re-renders on a
 * gentle cadence and re-syncs when the tab regains focus (covers sleep/return).
 */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), intervalMs);
    const sync = () => setNow(Date.now());
    window.addEventListener("focus", sync);
    document.addEventListener("visibilitychange", sync);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, [intervalMs]);

  return now;
}
