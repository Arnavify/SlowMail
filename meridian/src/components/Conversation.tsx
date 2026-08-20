import { useEffect, useMemo, useRef } from "react";
import type { Conversation as Convo, Message, User } from "../lib/types";
import { isVisibleTo } from "../lib/timing";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import Composer from "./Composer";
import { Back } from "./icons";

interface Props {
  conversation: Convo;
  messages: Message[];
  user: User;
  now: number;
  onSend: (body: string, delayMs: number) => void;
  onBack: () => void;
}

function initials(name: string): string {
  const parts = name.replace(/[^\w\s]/g, "").trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "·";
}

export default function Conversation({
  conversation,
  messages,
  user,
  now,
  onSend,
  onBack,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const thread = useMemo(
    () => messages.filter((m) => m.conversationId === conversation.id),
    [messages, conversation.id],
  );
  const visible = thread.filter((m) => isVisibleTo(m, now, user.id));
  const pendingCount = thread.filter((m) => m.senderId === user.id && now < m.deliverAt).length;

  // Keep the latest message in view. Depend on visible count so the view
  // settles when a held message finally lands.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [visible.length, conversation.id]);

  return (
    <div className="flex flex-col h-full anim-fade">
      <header className="flex items-center gap-3 px-4 sm:px-6 h-16 border-b border-[var(--color-line)]">
        <button
          onClick={onBack}
          className="md:hidden -ml-1 w-9 h-9 rounded-lg flex items-center justify-center text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-smooth"
        >
          <Back size={20} />
        </button>
        <span className="w-9 h-9 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center text-xs font-medium">
          {initials(conversation.partner.displayName)}
        </span>
        <div className="min-w-0">
          <h2 className="text-sm font-medium truncate">{conversation.partner.displayName}</h2>
          <p className="text-xs text-[var(--color-muted)]">
            {conversation.typing
              ? "typing…"
              : pendingCount > 0
                ? `${pendingCount} message${pendingCount > 1 ? "s" : ""} on the way`
                : "on real time"}
          </p>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="mx-auto max-w-2xl flex flex-col gap-3">
          <p className="text-center text-xs text-[var(--color-faint)] font-mono mb-2">
            messages arrive when their time comes
          </p>
          {visible.map((m) => (
            <MessageBubble key={m.id} message={m} now={now} viewerId={user.id} />
          ))}
          {conversation.typing && <TypingIndicator />}
        </div>
      </div>

      <div className="border-t border-[var(--color-line)]">
        <div className="mx-auto max-w-2xl">
          <Composer onSend={onSend} partnerName={conversation.partner.displayName} />
        </div>
      </div>
    </div>
  );
}
