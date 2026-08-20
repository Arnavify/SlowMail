export default function TypingIndicator() {
  return (
    <div className="flex items-center anim-bubble">
      <div className="flex items-center gap-1.5 bg-[var(--color-surface)] border border-[var(--color-line)] rounded-2xl rounded-bl-md px-4 py-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="typing-dot w-1.5 h-1.5 rounded-full bg-[var(--color-muted)]"
            style={{ animationDelay: `${i * 0.18}s` }}
          />
        ))}
      </div>
    </div>
  );
}
