import { useState } from "react";
import type { User } from "../lib/types";
import { login, signup } from "../lib/auth";
import { DEMO_CREDENTIALS } from "../lib/demo";
import { Feather } from "./icons";

type Mode = "login" | "signup";

export default function AuthScreen({ onAuthed }: { onAuthed: (u: User) => void }) {
  const [mode, setMode] = useState<Mode>("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    window.setTimeout(() => {
      const result = mode === "login" ? login(username, password) : signup(username, password);
      setBusy(false);
      if (result.ok) onAuthed(result.user);
      else setError(result.error);
    }, 420);
  }

  function useDemo() {
    setMode("login");
    setUsername(DEMO_CREDENTIALS.username);
    setPassword(DEMO_CREDENTIALS.password);
    setError(null);
  }

  return (
    <div className="min-h-full w-full flex items-center justify-center px-6 py-16 anim-fade">
      <div className="w-full max-w-sm anim-scale">
        <div className="flex flex-col items-center text-center mb-10">
          <div className="w-11 h-11 rounded-full bg-[var(--color-accent-soft)] text-[var(--color-accent)] flex items-center justify-center mb-6">
            <Feather size={20} />
          </div>
          <h1 className="font-serif text-[2rem] leading-none tracking-tight">SlowMail</h1>
          <p className="text-[var(--color-muted)] text-sm mt-3 max-w-[16rem] leading-relaxed">
            Messages that arrive when the moment does, not the instant you hit send.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-line)] mb-6" role="tablist" aria-label="Account access">
          {(["login", "signup"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={mode === m}
              onClick={() => {
                setMode(m);
                setError(null);
              }}
              className={`flex-1 h-9 rounded-full text-sm transition-smooth ${
                mode === m
                  ? "bg-[var(--color-ink)] text-white"
                  : "text-[var(--color-muted)] hover:text-[var(--color-ink)]"
              }`}
            >
              {m === "login" ? "Log in" : "Sign up"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-3">
          <Field
            label="Username"
            value={username}
            onChange={setUsername}
            placeholder="you"
            autoFocus
            autoComplete="username"
            required
          />
          <Field
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="••••"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
          />

          {error && (
            <p role="alert" className="text-sm text-[var(--color-wait)] anim-fade px-1">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="w-full h-11 rounded-xl bg-[var(--color-ink)] text-white text-sm font-medium transition-smooth hover:opacity-90 active:scale-[0.99] disabled:opacity-60 mt-1"
          >
            {busy ? (
              <span className="anim-pulse">One moment…</span>
            ) : mode === "login" ? (
              "Log in"
            ) : (
              "Create account"
            )}
          </button>
        </form>

        <button
          type="button"
          onClick={useDemo}
          className="w-full mt-4 text-xs text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-smooth"
        >
          Try the demo, <span className="font-mono">{DEMO_CREDENTIALS.username}</span> /{" "}
          <span className="font-mono">{DEMO_CREDENTIALS.password}</span>
        </button>
        <p className="text-[0.68rem] text-[var(--color-faint)] text-center mt-2">
          Demo data stays in this browser.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoFocus,
  autoComplete,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  autoFocus?: boolean;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-xs text-[var(--color-muted)] mb-1.5 px-1">{label}</span>
      <input
        type={type}
        value={value}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 px-3.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-line)] text-sm outline-none transition-smooth focus:border-[var(--color-line-strong)] focus:ring-2 focus:ring-[var(--color-accent-soft)] placeholder:text-[var(--color-faint)]"
      />
    </label>
  );
}
