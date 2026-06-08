"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ChapterMeta } from "./getEbookData";

export type SectionItem = { id: string; text: string };

interface CourseSidebarProps {
  bookSlug: string;
  chapters: ChapterMeta[];
  currentSlug: string;
  bookTitle: string;
  productUrl: string;
  sections?: SectionItem[];
}

function shortTitle(title: string): string {
  const m = title.match(/(?:The\s+)?(\w+(?:\s+\w+)?)\s+Pattern/i);
  return m ? m[1] : title;
}

function normalizeKey(s: string): string {
  return s
    .replace(/[`*]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Curated short labels for the in-chapter section nav (sidebar).
 * Keyed by a normalized version of the full `## ` heading so the sidebar
 * can stay readable without cutting titles off with an ellipsis.
 */
const SHORT_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries({
    // 01 — Builder
    'The real problem isn\'t "too many constructor arguments"': "The real problem",
    "First: do you even need a builder?": "Do you need one?",
    "Solution — the Classic Builder (GoF)": "Classic Builder",
    "Fluent Builder (my personal choice)": "Fluent Builder",
    "Director — encapsulating construction recipes": "Director",
    "Nested (Hierarchical) builders": "Nested builders",
    "Step Builder — making the compiler enforce required steps": "Step Builder",
    "Validating the result with FluentValidation": "Validation",
    "Test Data Builders (the one everybody underuses)": "Test Data Builders",
    "Where NOT to use the Builder pattern": "Where NOT to use",

    // 02 — Decorator
    "Story: the café and the combinatorial explosion": "The café story",
    "Building it step by step": "Step by step",
    "Composing decorators for real: cross-cutting concerns": "Cross-cutting concerns",
    "Adding Scrutor — composing the onion in DI": "Scrutor & DI",
    "The lifetime trap: captive dependencies": "Lifetime trap",
    "Testing a decorator in isolation": "Testing",

    // 03 — Strategy
    "Story: BookLibrary's shipping problem": "The shipping story",
    "The solution: a family of interchangeable algorithms": "The solution",
    "Strategy vs. polymorphism on the domain model": "vs. polymorphism",
    "Dependency Injection with Strategy (.NET 8 keyed services)": "DI & keyed services",
    "Combining Strategy with a Factory": "With a Factory",
    "The real-world case: payment gateways": "Payment gateways",
    "Composing Strategy with Decorator": "With Decorator",
    "Configuration-driven selection": "Config-driven selection",
    "Testing: prove the right strategy is chosen": "Testing",

    // 04 — Adapter
    "The problem: the plug that doesn't fit": "The problem",
    "The interface your domain wants — and the file-storage abstraction we'll reuse":
      "The domain interface",
    "The teaching example: adapting a legacy payment gateway": "Teaching example",
    "Object Adapter (composition)": "Object Adapter",
    "Class Adapter (inheritance)": "Class Adapter",
    "Cloud providers integration": "Cloud providers",
    "The honest limit: adapters that *lie*": "The honest limit",
    "Testing an adapter": "Testing",

    // 05 — Mediator
    "The story: the overwhelmed airport": "The airport story",
    "The teaching example: a chatroom": "Teaching example",
    "Request/Response with MediatR": "Request/Response",
    "Cross-cutting concerns with pipeline behaviors": "Pipeline behaviors",
    "Event aggregation (one-to-many notifications)": "Event aggregation",
    "You don't always need MediatR — and MediatR isn't free anymore":
      "Do you need MediatR?",

    // 06 — Result
    "The problem: exceptions for things that aren't exceptional": "The problem",
    "A minimal Result type": "Minimal Result type",
    "A non-generic Result for operations that return nothing": "Non-generic Result",
    "Railway-oriented programming: composing results": "Railway-oriented programming",
    "The part most tutorials skip: async railway": "Async railway",
    "Aggregating errors (validation returns *many*)": "Aggregating errors",
    "Turning a Result into an HTTP response — with ProblemDetails": "HTTP response",
    "Is it actually faster? A quick benchmark": "Benchmark",

    // 07 — Pipeline
    "The problem: one method doing the work of ten": "The problem",
    "Chain of Responsibility vs. Pipeline — they aren't the same":
      "CoR vs. Pipeline",
    "You already use it: ASP.NET Core middleware (a pipeline)":
      "ASP.NET middleware",
    "Building your own typed pipeline (a CoR for domain rules)": "Build your own",
    "Relationship to Mediator pipeline behaviors": "Relation to Mediator",

    // 08 — Specification
    "The problem: the repository method explosion": "The problem",
    "A specification that EF Core can translate": "EF Core translation",
    "Composing specifications — the right way to merge expression trees":
      "Composing specs",
    "Using it against EF Core": "Using with EF Core",
    "The real payoff: one rule, two uses": "The real payoff",
    "When you outgrow a bare `Where`": "Outgrowing Where",

    // 09 — Factory
    "The problem: `new` welds you to a concrete type": "The problem",
    "A factory you already use: `IHttpClientFactory`": "IHttpClientFactory",
    "Factory Method (the classic)": "Factory Method",
    "Abstract Factory (families of related objects)": "Abstract Factory",
    "The modern .NET way #1 — keyed DI as a factory": "Keyed DI factory",
    "The modern .NET way #2 — factory delegates and ActivatorUtilities":
      "Factory delegates",
    "Testing a factory": "Testing",

    // 10 — State
    "The problem: boolean soup and illegal transitions": "The problem",
    "Step 1 — model states and transitions explicitly": "Model states",
    "Transitions that return a Result instead of throwing": "Result transitions",
    "Step 2 — class-per-state, when behavior diverges": "Class-per-state",
    "The concurrency trap a state machine over a database must handle":
      "Concurrency trap",
    "Entry / exit actions — and when to reach for a library":
      "Entry / exit actions",
    "Testing illegal transitions": "Testing",

    // shared across chapters
    "Definition": "Definition",
    "Pros & cons": "Pros & cons",
    "Where to use / NOT to use": "When to use",
    "Key takeaways": "Key takeaways",
  }).map(([k, v]) => [normalizeKey(k), v])
);

function shortSection(text: string): string {
  const mapped = SHORT_LABELS[normalizeKey(text)];
  if (mapped) return mapped;
  // fallback: strip code/emphasis + parentheticals, then cap length
  let t = text
    .replace(/[`*]/g, "")
    .replace(/\([^)]*\)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const cut = t.split(/\s+[—–-]\s+|:\s+/)[0].trim();
  if (cut) t = cut;
  const words = t.split(" ");
  return words.length > 4 ? words.slice(0, 4).join(" ") + "…" : t;
}

export default function CourseSidebar({
  bookSlug,
  chapters,
  currentSlug,
  bookTitle,
  productUrl,
  sections = [],
}: CourseSidebarProps) {
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [doneSections, setDoneSections] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const storageKey = `ebook-progress-${bookSlug}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      const existing: string[] = saved ? JSON.parse(saved) : [];
      const next = new Set([...existing, currentSlug]);
      setCompleted(next);
      localStorage.setItem(storageKey, JSON.stringify([...next]));
    } catch {
      setCompleted(new Set([currentSlug]));
    }
  }, [currentSlug, storageKey]);

  useEffect(() => {
    fetch("/api/auth-session", { credentials: "include" })
      .then((r) => r.json())
      .then((s) => setIsAuthenticated(s?.authenticated === true))
      .catch(() => {});
  }, []);

  // Track which in-chapter sections the reader has scrolled through, so the
  // sidebar can show a ✓ next to the ones already read and highlight the
  // section currently in view.
  useEffect(() => {
    if (sections.length === 0) return;
    const ids = sections.map((s) => s.id);
    let raf = 0;

    const update = () => {
      raf = 0;
      const passed = ids.filter((id) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top < 140 : false;
      });
      const active = passed.length ? passed[passed.length - 1] : null;
      const done = new Set(passed.slice(0, -1));
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 80;
      if (atBottom && active) done.add(active);
      setDoneSections(done);
      setActiveSection(active);
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sections]);

  const completedCount = completed.size;
  const totalCount = chapters.length;
  const progressPct = Math.round((completedCount / totalCount) * 100);

  return (
    <aside className="rd-sidebar">
      <div className="rd-sidebar-inner">
        <div className="rd-sidebar-header">
          <p className="rd-sidebar-booktitle">{bookTitle}</p>
          <div className="rd-sidebar-progress">
            <div className="rd-sidebar-progress-bar">
              <div
                className="rd-sidebar-progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <span className="rd-sidebar-progress-text">
              {completedCount} / {totalCount} chapters read
            </span>
          </div>
        </div>

        <nav className="rd-sidebar-nav">
          {chapters.map((c) => {
            const isCurrent = c.slug === currentSlug;
            const isDone = completed.has(c.slug) && !isCurrent;
            const isLocked = c.access !== "free";

            return (
              <div key={c.slug}>
                <Link
                  href={`/read/${bookSlug}/${c.slug}`}
                  className={`rd-sidebar-item${isCurrent ? " active" : ""}${isDone ? " done" : ""}`}
                >
                  <span className="rd-sidebar-num">
                    {isDone ? "✓" : String(c.order).padStart(2, "0")}
                  </span>
                  <span className="rd-sidebar-info">
                    <span className="rd-sidebar-title">{shortTitle(c.title)}</span>
                    {c.estReadMin && (
                      <span className="rd-sidebar-meta">{c.estReadMin} min read</span>
                    )}
                  </span>
                  {!isAuthenticated && (
                    isLocked ? (
                      <span className="rd-badge-lock-sm" aria-label="Locked">🔒</span>
                    ) : (
                      !isCurrent && <span className="rd-badge-free-sm">Free</span>
                    )
                  )}
                </Link>

                {isCurrent && sections.length > 0 && (
                  <ul className="rd-sidebar-sections">
                    {sections.map((s) => {
                      const isSectionDone = doneSections.has(s.id);
                      const isSectionActive = activeSection === s.id;
                      return (
                        <li key={s.id}>
                          <a
                            href={`#${s.id}`}
                            className={`rd-sidebar-section-link${isSectionActive ? " active" : ""}${isSectionDone ? " done" : ""}`}
                          >
                            <span className="rd-sidebar-section-tick" aria-hidden="true">
                              {isSectionDone ? "✓" : "○"}
                            </span>
                            <span className="rd-sidebar-section-text">
                              {shortSection(s.text)}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        <div className="rd-sidebar-footer">
          <Link href={productUrl} className="rd-sidebar-cta">
            Get the full book →
          </Link>
        </div>
      </div>
    </aside>
  );
}
