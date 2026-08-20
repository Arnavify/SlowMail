import { useEffect, useMemo, useState } from "react";
import type { Conversation as Convo, Message, User } from "./lib/types";
import { useNow } from "./hooks/useNow";
import {
  bootstrap,
  getConversations,
  getMessages,
  addMessage,
  markConversationRead,
  uid,
} from "./lib/store";
import { currentUser, logout } from "./lib/auth";
import { DEFAULT_DELAY } from "./lib/timing";
import AuthScreen from "./components/AuthScreen";
import Sidebar from "./components/Sidebar";
import Conversation from "./components/Conversation";

export default function App() {
  const now = useNow(1000);
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [conversations, setConversations] = useState<Convo[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  // First launch: seed demo data and restore any existing session.
  useEffect(() => {
    bootstrap();
    setConversations(getConversations());
    setMessages(getMessages());
    setUser(currentUser());
    setReady(true);
  }, []);

  const active = useMemo(
    () => conversations.find((c) => c.id === activeId) ?? null,
    [conversations, activeId],
  );

  // Mark inbound messages read once they've been delivered and are on screen.
  useEffect(() => {
    if (!user || !activeId) return;
    const next = markConversationRead(activeId, user.id, now);
    setMessages((prev) =>
      prev.length === next.length && !changed(prev, next) ? prev : next,
    );
  }, [user, activeId, now]);

  function handleSend(body: string, delayMs: number) {
    if (!user || !activeId) return;
    const created = Date.now();
    const message: Message = {
      id: uid(),
      conversationId: activeId,
      senderId: user.id,
      body,
      createdAt: created,
      deliverAt: created + (delayMs || DEFAULT_DELAY),
      readAt: null,
    };
    setMessages(addMessage(message));
  }

  function handleAuthed(u: User) {
    setUser(u);
    setConversations(getConversations());
    setMessages(getMessages());
  }

  function handleLogout() {
    logout();
    setUser(null);
    setActiveId(null);
  }

  if (!ready) return <div className="size-full" />;

  if (!user) {
    return (
      <div className="size-full overflow-y-auto">
        <AuthScreen onAuthed={handleAuthed} />
      </div>
    );
  }

  return (
    <div className="size-full grid md:grid-cols-[clamp(19rem,26vw,22rem)_1fr]">
      {/* Sidebar — full screen on mobile until a conversation is opened. */}
      <aside
        className={`${
          activeId ? "hidden md:flex" : "flex"
        } flex-col h-full bg-[var(--color-ground)] md:border-r border-[var(--color-line)]`}
      >
        <Sidebar
          user={user}
          conversations={conversations}
          messages={messages}
          now={now}
          activeId={activeId}
          onSelect={setActiveId}
          onLogout={handleLogout}
        />
      </aside>

      {/* Conversation pane. */}
      <main
        className={`${
          activeId ? "flex" : "hidden md:flex"
        } flex-col h-full min-w-0 bg-[var(--color-ground)]`}
      >
        {active ? (
          <Conversation
            key={active.id}
            conversation={active}
            messages={messages}
            user={user}
            now={now}
            onSend={handleSend}
            onBack={() => setActiveId(null)}
          />
        ) : (
          <EmptyState />
        )}
      </main>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-8 anim-fade">
      <p className="font-serif text-2xl tracking-tight mb-3">Nothing waiting on you</p>
      <p className="text-sm text-[var(--color-muted)] max-w-xs leading-relaxed">
        Choose a conversation. Here, messages take the time they need — sent now,
        felt later.
      </p>
    </div>
  );
}

// Helpers to avoid needless state churn from the per-second read-check.
function changed(a: Message[], b: Message[]): boolean {
  for (let i = 0; i < a.length; i++) if (a[i].readAt !== b[i].readAt) return true;
  return false;
}
