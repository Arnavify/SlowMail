import type { Message } from "../lib/types";
import { statusOf, remaining, formatCountdown, formatTime } from "../lib/timing";
import { Clock, Check, CheckDouble, Dot } from "./icons";

export default function MessageBubble({
  message,
  now,
  viewerId,
}: {
  message: Message;
  now: number;
  viewerId: string;
}) {
  const mine = message.senderId === viewerId;
  const status = statusOf(message, now, viewerId);
  const waiting = status === "sending" || status === "waiting";

  return (
    <div className={`flex flex-col ${mine ? "items-end" : "items-start"} anim-bubble`}>
      <div
        className={[
          "max-w-[min(78%,32rem)] px-4 py-2.5 text-[0.95rem] leading-relaxed transition-smooth",
          mine
            ? "bg-[var(--color-bubble-me)] text-white rounded-2xl rounded-br-md"
            : "bg-[var(--color-surface)] border border-[var(--color-line)] rounded-2xl rounded-bl-md",
          waiting && mine ? "opacity-70" : "",
        ].join(" ")}
      >
        {message.body}
      </div>

      <Meta message={message} now={now} mine={mine} status={status} />
    </div>
  );
}

function Meta({
  message,
  now,
  mine,
  status,
}: {
  message: Message;
  now: number;
  mine: boolean;
  status: ReturnType<typeof statusOf>;
}) {
  const base =
    "flex items-center gap-1.5 mt-1.5 px-1 font-mono text-[0.68rem] tracking-tight";

  if (status === "sending") {
    return (
      <span className={`${base} text-[var(--color-faint)] anim-pulse`}>
        <Dot size={6} /> sending
      </span>
    );
  }

  if (status === "waiting") {
    return (
      <span className={`${base} text-[var(--color-wait)]`}>
        <Clock size={12} />
        {mine ? formatCountdown(remaining(message, now)) : "held"}
      </span>
    );
  }

  // Delivered / read.
  return (
    <span className={`${base} text-[var(--color-muted)]`}>
      {formatTime(message.deliverAt, now)}
      {mine &&
        (status === "read" ? (
          <CheckDouble size={13} className="text-[var(--color-accent)]" />
        ) : (
          <Check size={13} />
        ))}
    </span>
  );
}
