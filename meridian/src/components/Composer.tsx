import { useRef, useState } from "react";
import { DEFAULT_DELAY, MINUTE, HOUR } from "../lib/timing";
import { ArrowUp, Clock } from "./icons";

// Preset delivery delays. "Soon" is the default slow cadence; the others let a
// user deliberately schedule a message further out.
const PRESETS: { label: string; ms: number }[] = [
  { label: "Soon", ms: DEFAULT_DELAY },
  { label: "1h", ms: HOUR },
  { label: "This evening", ms: 6 * HOUR },
  { label: "Tomorrow", ms: 24 * HOUR },
];

export default function Composer({
  onSend,
  partnerName,
}: {
  onSend: (body: string, delayMs: number) => void;
  partnerName: string;
}) {
  const [text, setText] = useState("");
  const [delayMs, setDelayMs] = useState(DEFAULT_DELAY);
  const [openSchedule, setOpenSchedule] = useState(false);
  const areaRef = useRef<HTMLTextAreaElement>(null);

  function send() {
    const body = text.trim();
    if (!body) return;
    onSend(body, delayMs);
    setText("");
    setDelayMs(DEFAULT_DELAY);
    setOpenSchedule(false);
    requestAnimationFrame(() => areaRef.current?.focus());
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const active = PRESETS.find((p) => p.ms === delayMs);

  return (
    <div className="px-4 sm:px-6 pb-4 pt-2">
      {openSchedule && (
        <div className="flex flex-wrap gap-1.5 mb-2.5 anim-rise">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setDelayMs(p.ms)}
              className={`h-8 px-3 rounded-full text-xs transition-smooth border ${
                delayMs === p.ms
                  ? "bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-transparent"
                  : "border-[var(--color-line)] text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-end gap-2 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-line)] p-2 transition-smooth focus-within:border-[var(--color-line-strong)] focus-within:ring-2 focus-within:ring-[var(--color-accent-soft)]">
        <button
          type="button"
          onClick={() => setOpenSchedule((v) => !v)}
          title="Schedule delivery"
          className={`shrink-0 h-9 px-2.5 rounded-xl flex items-center gap-1.5 text-xs transition-smooth ${
            openSchedule || delayMs !== DEFAULT_DELAY
              ? "text-[var(--color-accent)] bg-[var(--color-accent-soft)]"
              : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
          }`}
        >
          <Clock size={15} />
          <span className="hidden sm:inline">{active ? active.label : "Schedule"}</span>
        </button>

        <textarea
          ref={areaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          rows={1}
          placeholder={`Message ${partnerName.split(" ")[0]}…`}
          className="flex-1 resize-none bg-transparent outline-none text-[0.95rem] leading-relaxed py-2 max-h-32 placeholder:text-[var(--color-faint)]"
        />

        <button
          type="button"
          onClick={send}
          disabled={!text.trim()}
          className="shrink-0 w-9 h-9 rounded-xl bg-[var(--color-ink)] text-white flex items-center justify-center transition-smooth hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:scale-100"
        >
          <ArrowUp size={17} />
        </button>
      </div>
      <p className="text-[0.68rem] text-[var(--color-faint)] mt-2 px-1 text-center">
        Delivered on real time · press Enter to send
      </p>
    </div>
  );
}
