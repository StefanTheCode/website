"use client";

import { useState, useEffect, useRef } from "react";
import AskTheBook from "./AskTheBook";

interface AskAIDrawerProps {
  chapter?: string;
}

export default function AskAIDrawer({ chapter }: AskAIDrawerProps) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <>
      {/* Floating button */}
      <button
        className="rd-ai-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Ask AI about this chapter"
        aria-expanded={open}
      >
        <span className="rd-ai-btn-icon">✦</span>
        <span className="rd-ai-btn-label">Ask AI</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="rd-ai-backdrop"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`rd-ai-drawer${open ? " open" : ""}`}
        aria-hidden={!open}
      >
        <div className="rd-ai-drawer-head">
          <div className="rd-ai-drawer-title">
            <span className="rd-ai-icon">✦</span>
            Ask the Book
          </div>
          <button
            className="rd-ai-close"
            onClick={() => setOpen(false)}
            aria-label="Close AI panel"
          >
            ✕
          </button>
        </div>
        <p className="rd-ai-drawer-hint">
          Ask anything about this chapter. I answer only from the book's content.
        </p>
        <div className="rd-ai-drawer-body">
          <AskTheBook chapter={chapter} />
        </div>
      </div>
    </>
  );
}
