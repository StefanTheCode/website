"use client";

import { useEffect, useState } from "react";

type Session =
  | { authenticated: false }
  | { authenticated: true; email: string; entitlements: string[] };

const panel: React.CSSProperties = {
  position: "absolute",
  top: "calc(100% + 10px)",
  right: 0,
  background: "#22184C",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 14,
  padding: 18,
  width: 340,
  boxShadow: "0 20px 50px rgba(13,7,34,.55)",
  zIndex: 60,
};
const input: React.CSSProperties = {
  width: "100%",
  background: "rgba(13,7,34,.55)",
  color: "#F3EFFA",
  border: "1px solid rgba(255,255,255,.12)",
  borderRadius: 10,
  padding: "11px 14px",
  fontSize: 14,
  marginBottom: 10,
};
const link: React.CSSProperties = {
  color: "#9C92B8",
  background: "none",
  border: 0,
  cursor: "pointer",
  fontFamily: "inherit",
  fontSize: 14.5,
  fontWeight: 500,
};

export default function ReaderAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [key, setKey] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/auth-session", { credentials: "include" });
      setSession(await res.json());
    } catch {
      setSession({ authenticated: false });
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return setErr("Please enter a valid email.");
    if (key.trim().length < 3) return setErr("Enter your license key or order number.");
    setBusy(true);
    try {
      const res = await fetch("/api/auth-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, key }),
      });
      const data = await res.json();
      if (res.ok) {
        await load();
        setOpen(false);
        setKey("");
      } else {
        setErr(data.error || "Sign-in failed.");
      }
    } catch {
      setErr("Network error — please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    await fetch("/api/auth-logout", { method: "POST", credentials: "include" });
    setSession({ authenticated: false });
  }

  if (session?.authenticated) {
    return (
      <div style={{ position: "relative" }}>
        <button style={link} onClick={() => setOpen((o) => !o)}>
          ✓ {session.email}
        </button>
        {open && (
          <div style={panel}>
            <p style={{ margin: "0 0 6px", color: "#F3EFFA", fontWeight: 600 }}>Signed in</p>
            <p style={{ margin: "0 0 14px", color: "#9C92B8", fontSize: 13.5 }}>
              {session.entitlements?.length
                ? `Access: ${session.entitlements.join(", ")}`
                : "No books on this account yet."}
            </p>
            <button style={link} onClick={logout}>
              Log out
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ position: "relative" }}>
      <button style={link} onClick={() => setOpen((o) => !o)}>
        Sign in
      </button>
      {open && (
        <div style={panel}>
          <form onSubmit={signIn}>
            <p style={{ margin: "0 0 12px", color: "#D4CDE6", fontSize: 13.5 }}>
              Sign in with the email you bought with and your <strong>license key</strong>{" "}
              (or <strong>order number</strong> from your receipt).
            </p>
            <input
              style={input}
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              style={input}
              type="text"
              placeholder="License key or order number"
              value={key}
              onChange={(e) => setKey(e.target.value)}
            />
            <button
              className="rd-cta"
              type="submit"
              disabled={busy}
              style={{ border: 0, cursor: "pointer", width: "100%" }}
            >
              {busy ? "Checking…" : "Unlock my books"}
            </button>
            {err && <p style={{ color: "#E2607A", margin: "10px 0 0", fontSize: 13 }}>{err}</p>}
          </form>
        </div>
      )}
    </div>
  );
}
