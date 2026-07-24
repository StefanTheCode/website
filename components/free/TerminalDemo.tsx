"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Interactive, auto-playing terminal demo (the "click a command to see it in
 * action" element). Each tab types out its command, then streams simulated
 * output line by line. Auto-plays when scrolled into view, gently rotates
 * through the tabs, and stops rotating once the user clicks a tab.
 * Respects prefers-reduced-motion (everything shown instantly, no rotation).
 */

export type DemoLine = { text: string; tone?: "muted" | "green" | "yellow" | "red" | "plain" };
export type DemoTab = { id: string; label: string; command: string; lines: DemoLine[] };

const toneColor: Record<NonNullable<DemoLine["tone"]>, string> = {
  muted: "rgba(255,255,255,0.45)",
  green: "#46d39a",
  yellow: "#ffbd39",
  red: "#ff6b81",
  plain: "rgba(255,255,255,0.92)",
};

export default function TerminalDemo({ title, tabs }: { title: string; tabs: DemoTab[] }) {
  const [active, setActive] = useState(0);
  const [typed, setTyped] = useState("");
  const [visible, setVisible] = useState(0);
  const [done, setDone] = useState(false);
  const [started, setStarted] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const interacted = useRef(false);
  const reduce = useRef(false);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };
  const wait = (ms: number) => new Promise<number>((res) => { const t = window.setTimeout(res, ms); timers.current.push(t); });

  // start when scrolled into view
  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = rootRef.current;
    if (!el || !("IntersectionObserver" in window)) { setStarted(true); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setStarted(true); io.unobserve(e.target); } });
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // run the animation for the active tab
  useEffect(() => {
    if (!started) return;
    const tab = tabs[active];
    clearTimers();
    setDone(false);

    if (reduce.current) {
      setTyped(tab.command);
      setVisible(tab.lines.length);
      setDone(true);
      return;
    }

    let cancelled = false;
    setTyped("");
    setVisible(0);

    (async () => {
      // type the command
      for (let i = 1; i <= tab.command.length; i++) {
        if (cancelled) return;
        setTyped(tab.command.slice(0, i));
        await wait(38);
      }
      await wait(360);
      // stream output lines
      for (let i = 1; i <= tab.lines.length; i++) {
        if (cancelled) return;
        setVisible(i);
        await wait(230);
      }
      setDone(true);
      // gentle auto-rotate to the next tab, unless the user took over
      if (!interacted.current && tabs.length > 1) {
        await wait(2600);
        if (!cancelled && !interacted.current) setActive((a) => (a + 1) % tabs.length);
      }
    })();

    return () => { cancelled = true; clearTimers(); };
  }, [active, started, tabs]);

  const pick = (i: number) => { interacted.current = true; setActive(i); };

  const tab = tabs[active];

  return (
    <div ref={rootRef}>
      {/* command tabs */}
      <div className="d-flex flex-wrap justify-content-center gap-2 mb-3">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => pick(i)}
            className={`td-tab ${i === active ? "td-tab-on" : ""}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* terminal window */}
      <div className="td-window" style={{ border: "1px solid var(--tk-line)", borderRadius: "16px", background: "var(--tk-card-bg)", overflow: "hidden" }}>
        <div className="d-flex align-items-center" style={{ gap: "8px", padding: "13px 18px", borderBottom: "1px solid var(--tk-line)" }}>
          <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff6b81", display: "inline-block" }} />
          <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd39", display: "inline-block" }} />
          <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#46d39a", display: "inline-block" }} />
          <span className="text-white" style={{ marginLeft: "10px", opacity: 0.6, fontSize: "0.82rem", fontFamily: "'JetBrains Mono', monospace" }}>{title}</span>
        </div>

        <div style={{ padding: "18px 20px", fontFamily: "'JetBrains Mono', monospace", fontSize: "0.86rem", lineHeight: 1.75, minHeight: "270px" }}>
          <div style={{ color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>⏵⏵ auto-accept edits on</div>
          <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            <span style={{ color: "#46d39a" }}>❯ </span>
            <span style={{ color: "#ffbd39" }}>{typed}</span>
            {!done && <span className="crk-caret" style={{ verticalAlign: "-2px" }} />}
          </div>
          <div style={{ marginTop: "10px" }}>
            {tab.lines.slice(0, visible).map((l, i) => (
              <div key={i} className="td-line" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", color: toneColor[l.tone ?? "plain"] }}>
                {l.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
