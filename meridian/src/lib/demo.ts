import type { Conversation, Message, User } from "./types";
import { MINUTE, HOUR } from "./timing";

// Realistic demo data so the app never opens empty. The demo account can be
// used immediately; sample conversations include delivered, waiting, and
// scheduled (far-future) messages so all states are visible on first launch.

export const DEMO_CREDENTIALS = { username: "you", password: "slow" };

interface SeedDeps {
  getUsers: () => User[];
  saveUsers: (u: User[]) => void;
  getConversations: () => Conversation[];
  saveConversations: (c: Conversation[]) => void;
  getMessages: () => Message[];
  saveMessages: (m: Message[]) => void;
  uid: () => string;
}

export function seedIfEmpty(deps: SeedDeps): User {
  const users = deps.getUsers();
  let me = users.find((u) => u.username === DEMO_CREDENTIALS.username);

  if (!me) {
    me = {
      id: "user-you",
      username: DEMO_CREDENTIALS.username,
      displayName: "You",
      password: DEMO_CREDENTIALS.password,
    };
    deps.saveUsers([...users, me]);
  }

  if (deps.getConversations().length > 0) return me;

  const meId = me.id;
  const now = Date.now();

  const conversations: Conversation[] = [
    { id: "c-mara", partner: { id: "p-mara", displayName: "Mara Ellison" } },
    { id: "c-tobias", partner: { id: "p-tobias", displayName: "Tobias Re— Studio" }, typing: true },
    { id: "c-noor", partner: { id: "p-noor", displayName: "Noor Haddad" } },
    { id: "c-dad", partner: { id: "p-dad", displayName: "Dad" } },
  ];

  const m = (
    conversationId: string,
    senderId: string,
    body: string,
    createdAt: number,
    deliverAt: number,
    readAt: number | null,
  ): Message => ({
    id: deps.uid(),
    conversationId,
    senderId,
    body,
    createdAt,
    deliverAt,
    readAt,
  });

  const messages: Message[] = [
    // Mara — a settled thread, everything delivered & read.
    m("c-mara", "p-mara", "Morning. Did the light wake you too?", now - 5 * HOUR, now - 5 * HOUR + 20 * MINUTE, now - 4 * HOUR),
    m("c-mara", meId, "It did. I stayed with it for a while.", now - 4 * HOUR, now - 4 * HOUR + 15 * MINUTE, now - 3 * HOUR),
    m("c-mara", "p-mara", "That sounds like the right way to start.", now - 3 * HOUR, now - 3 * HOUR + 25 * MINUTE, now - 2 * HOUR),
    // A message I sent that is still WAITING to be delivered.
    m("c-mara", meId, "Coffee on the balcony this weekend?", now - 30 * MINUTE, now + 6 * MINUTE, null),

    // Tobias — recent delivered, partner typing, plus one I scheduled for later.
    m("c-tobias", "p-tobias", "The proofs came back from the printer.", now - 90 * MINUTE, now - 70 * MINUTE, now - 60 * MINUTE),
    m("c-tobias", meId, "Finally. How does the paper feel?", now - 60 * MINUTE, now - 45 * MINUTE, now - 40 * MINUTE),
    m("c-tobias", "p-tobias", "Heavier than the sample. In a good way.", now - 40 * MINUTE, now - 25 * MINUTE, now - 20 * MINUTE),
    // Scheduled far into the future.
    m("c-tobias", meId, "Let's review them together Monday morning.", now - 10 * MINUTE, now + 3 * HOUR, null),

    // Noor — one delivered inbound waiting to be read, one older exchange.
    m("c-noor", "p-noor", "Sending you the playlist for the drive.", now - 6 * HOUR, now - 5 * HOUR, now - 4 * HOUR),
    m("c-noor", meId, "Perfect timing, thank you.", now - 4 * HOUR, now - 3.5 * HOUR, now - 3 * HOUR),
    // Delivered but not yet read (arrives in the unread state).
    m("c-noor", "p-noor", "Also — are we still on for Thursday?", now - 2 * HOUR, now - 20 * MINUTE, null),

    // Dad — sparse, warm, all settled.
    m("c-dad", "p-dad", "Your mother found the old negatives.", now - 26 * HOUR, now - 25 * HOUR, now - 24 * HOUR),
    m("c-dad", meId, "No way. Bring them when you visit.", now - 24 * HOUR, now - 23 * HOUR, now - 22 * HOUR),
  ];

  deps.saveConversations(conversations);
  deps.saveMessages(messages);
  return me;
}
