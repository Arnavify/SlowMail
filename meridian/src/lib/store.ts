import type { Conversation, Message, User } from "./types";
import { seedIfEmpty } from "./demo";

// localStorage-backed persistence. This is the single place that touches
// storage; the UI talks to the exported functions only, so the whole layer can
// later be replaced by a real backend (fetch/websocket) without UI changes.

const KEYS = {
  users: "slowmsg.users",
  session: "slowmsg.session",
  conversations: "slowmsg.conversations",
  messages: "slowmsg.messages",
} as const;

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage full / unavailable — demo degrades gracefully in memory.
  }
}

export const uid = (): string =>
  (crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2)}`);

// --- Users & session -------------------------------------------------------

export function getUsers(): User[] {
  return read<User[]>(KEYS.users, []);
}

export function saveUsers(users: User[]): void {
  write(KEYS.users, users);
}

export function getSession(): string | null {
  return read<string | null>(KEYS.session, null);
}

export function setSession(userId: string | null): void {
  write(KEYS.session, userId);
}

// --- Conversations ---------------------------------------------------------

export function getConversations(): Conversation[] {
  return read<Conversation[]>(KEYS.conversations, []);
}

// --- Messages --------------------------------------------------------------

export function getMessages(): Message[] {
  return read<Message[]>(KEYS.messages, []);
}

export function saveMessages(messages: Message[]): void {
  write(KEYS.messages, messages);
}

export function addMessage(message: Message): Message[] {
  const next = [...getMessages(), message];
  saveMessages(next);
  return next;
}

/** Mark all delivered, still-unread messages from the partner as read now. */
export function markConversationRead(conversationId: string, viewerId: string, now: number): Message[] {
  const next = getMessages().map((m) => {
    if (
      m.conversationId === conversationId &&
      m.senderId !== viewerId &&
      m.readAt == null &&
      now >= m.deliverAt
    ) {
      return { ...m, readAt: now };
    }
    return m;
  });
  saveMessages(next);
  return next;
}

// --- Bootstrap -------------------------------------------------------------

/** Ensure demo data exists on first launch. Returns the demo account. */
export function bootstrap(): User {
  return seedIfEmpty({
    getUsers,
    saveUsers,
    getConversations,
    saveConversations: (c: Conversation[]) => write(KEYS.conversations, c),
    getMessages,
    saveMessages,
    uid,
  });
}
