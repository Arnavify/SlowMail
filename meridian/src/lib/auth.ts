import type { User } from "./types";
import { getUsers, saveUsers, setSession, getSession, uid } from "./store";

// Lightweight demo auth. Credentials live in localStorage in plain text — this
// is an intentional static/demo fallback, easily swapped for a real provider.

export type AuthResult = { ok: true; user: User } | { ok: false; error: string };

export function currentUser(): User | null {
  const id = getSession();
  if (!id) return null;
  return getUsers().find((u) => u.id === id) ?? null;
}

export function login(username: string, password: string): AuthResult {
  const u = getUsers().find((x) => x.username.toLowerCase() === username.trim().toLowerCase());
  if (!u) return { ok: false, error: "No account with that username." };
  if (u.password !== password) return { ok: false, error: "Incorrect password." };
  setSession(u.id);
  return { ok: true, user: u };
}

export function signup(username: string, password: string): AuthResult {
  const name = username.trim();
  if (name.length < 2) return { ok: false, error: "Choose a username of at least 2 characters." };
  if (password.length < 3) return { ok: false, error: "Choose a password of at least 3 characters." };
  const users = getUsers();
  if (users.some((x) => x.username.toLowerCase() === name.toLowerCase())) {
    return { ok: false, error: "That username is taken." };
  }
  const user: User = {
    id: uid(),
    username: name,
    displayName: name.charAt(0).toUpperCase() + name.slice(1),
    password,
  };
  saveUsers([...users, user]);
  setSession(user.id);
  return { ok: true, user };
}

export function logout(): void {
  setSession(null);
}
