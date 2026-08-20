import type { Message, MessageStatus } from "./types";

// Centralised slow-delivery logic. Delivery state is derived purely from stored
// timestamps compared against the current time — never from a setTimeout that
// "reveals" a message. This means state survives refreshes and closed tabs.

export const MINUTE = 60_000;
export const HOUR = 60 * MINUTE;

// How long the outgoing "sending" state is shown before a message transitions
// to "waiting". Cosmetic only; real elapsed time still governs delivery.
export const SENDING_WINDOW = 1200;

// Default delay applied to a freshly sent message when the sender does not pick
// an explicit scheduled time. Deliberately slow — this is the whole point.
export const DEFAULT_DELAY = 4 * MINUTE;

/** Resolve the current status of a message from timestamps alone. */
export function statusOf(message: Message, now: number, viewerId: string): MessageStatus {
  const outgoing = message.senderId === viewerId;

  if (now < message.deliverAt) {
    // Show a brief "sending" flourish right after creation, then "waiting".
    if (outgoing && now - message.createdAt < SENDING_WINDOW) return "sending";
    return "waiting";
  }
  if (message.readAt != null && now >= message.readAt) return "read";
  return "delivered";
}

/** A message is visible to a viewer if they sent it, or it has been delivered. */
export function isVisibleTo(message: Message, now: number, viewerId: string): boolean {
  if (message.senderId === viewerId) return true;
  return now >= message.deliverAt;
}

/** Milliseconds remaining until delivery, or 0 once delivered. */
export function remaining(message: Message, now: number): number {
  return Math.max(0, message.deliverAt - now);
}

/** Human, calm phrasing for how long until a waiting message lands. */
export function formatCountdown(ms: number): string {
  if (ms <= 0) return "any moment";
  const mins = Math.round(ms / MINUTE);
  if (mins >= 90) {
    const hrs = Math.round(ms / HOUR);
    return `arrives in ~${hrs}h`;
  }
  if (mins >= 1) return `arrives in ${mins} min`;
  const secs = Math.max(1, Math.round(ms / 1000));
  return `arrives in ${secs}s`;
}

/** Short relative timestamp for delivered messages. */
export function formatTime(ts: number, now: number): string {
  const d = new Date(ts);
  const sameDay = new Date(now).toDateString() === d.toDateString();
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  if (sameDay) return time;
  const yesterday = new Date(now - 24 * HOUR).toDateString() === d.toDateString();
  if (yesterday) return `Yesterday · ${time}`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" }) + ` · ${time}`;
}
