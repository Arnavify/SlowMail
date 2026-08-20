// Core domain types. Kept intentionally small so the data layer can later be
// swapped for a real backend without touching the UI.

export interface User {
  id: string;
  username: string;
  displayName: string;
  // Demo-only: passwords are stored in plain text in localStorage. This is a
  // deliberate local/demo fallback, not a real auth scheme.
  password: string;
}

export type MessageStatus = "sending" | "waiting" | "delivered" | "read";

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  // When the sender pressed send.
  createdAt: number;
  // The real-world moment the message becomes visible to the recipient.
  deliverAt: number;
  // Set once the recipient has opened the conversation after delivery.
  readAt: number | null;
}

export interface Participant {
  id: string;
  displayName: string;
}

export interface Conversation {
  id: string;
  // The person the current user is talking to (demo is 1:1).
  partner: Participant;
  // Whether the partner is currently "typing" (demo ambience only).
  typing?: boolean;
}
