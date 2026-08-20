import type { Conversation, Message, User } from "../lib/types";
import { isVisibleTo, statusOf, formatTime } from "../lib/timing";
import { Clock, Dot, Feather } from "./icons";

interface Props {
  user: User;
  conversations: Conversation[];
  messages: Message[];
  now: number;
  activeId: string | null;
  onSelect: (id: string) => void;
  onLogout: () => void;
}

function initials(name: string): string {
  const parts = name.replace(/[^\w\s]/g, "").trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "·";
}

export default function Sidebar({
  user,
  conversations,
  messages,
  now,
  activeId,
  onSelect,
  onLogout,
}: Props) {
  return (
    <div className="flex flex-col h-full">
      <header className="px-5 pt-5 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center">
            <Feather size={16} />
          </span>
          <span className="font-serif text-xl tracking-tight">SlowMail</span>
        </div>
      </header>

      <nav className="flex-1 overflow-y-auto px-2" aria-label="Conversations">
        {conversations.map((c, i) => {
          const thread = messages.filter((m) => m.conversationId === c.id);
          const visible = thread.filter((m) => isVisibleTo(m, now, user.id));
          const last = visible[visible.length - 1];
          const unread = thread.filter(
            (m) => m.senderId !== user.id && statusOf(m, now, user.id) === "delivered",
          ).length;
          const outgoingWaiting = thread.some(
            (m) => m.senderId === user.id && now < m.deliverAt,
          );
          const active = c.id === activeId;

          return (
            <button
              key={c.id}
              type="button"
              onClick={() => onSelect(c.id)}
              aria-current={active ? "page" : undefined}
              style={{ animationDelay: `${i * 40}ms` }}
              className={`anim-rise w-full text-left px-3 py-3 rounded-xl mb-0.5 flex gap-3 transition-smooth ${
                active ? "bg-[var(--color-surface)] shadow-[0_1px_0_var(--color-line)]" : "hover:bg-[var(--color-surface)]/60"
              }`}
            >
              <span
                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium transition-smooth ${
                  active
                    ? "bg-[var(--color-ink)] text-white"
                    : "bg-[var(--color-accent-soft)] text-[var(--color-accent)]"
                }`}
              >
                {initials(c.partner.displayName)}
              </span>

              <span className="flex-1 min-w-0">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{c.partner.displayName}</span>
                  {last && (
                    <span className="shrink-0 font-mono text-[0.62rem] text-[var(--color-faint)]">
                      {formatTime(last.deliverAt, now)}
                    </span>
                  )}
                </span>
                <span className="flex items-center gap-1.5 mt-0.5">
                  {c.typing ? (
                    <span className="text-xs text-[var(--color-accent)]">typing…</span>
                  ) : (
                    <span className="truncate text-xs text-[var(--color-muted)]">
                      {last ? preview(last, user.id) : "No messages yet"}
                    </span>
                  )}
                  <span className="ml-auto flex items-center gap-1.5 shrink-0">
                    {outgoingWaiting && (
                      <Clock size={12} className="text-[var(--color-wait)]" />
                    )}
                    {unread > 0 && <Dot size={7} className="text-[var(--color-accent)]" />}
                  </span>
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      <footer className="px-3 py-3 border-t border-[var(--color-line)] flex items-center justify-between">
        <div className="flex items-center gap-2.5 px-2 min-w-0">
          <span className="w-8 h-8 rounded-full bg-[var(--color-ink)] text-white flex items-center justify-center text-xs">
            {initials(user.displayName)}
          </span>
          <span className="truncate text-sm">{user.displayName}</span>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-smooth px-2.5 py-1.5 rounded-lg"
        >
          Log out
        </button>
      </footer>
    </div>
  );
}

function preview(m: Message, viewerId: string): string {
  const who = m.senderId === viewerId ? "You: " : "";
  return who + m.body;
}
