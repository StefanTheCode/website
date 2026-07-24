"use client";

import { useEffect } from "react";

/**
 * Shared motion controller for all "Get for Free" landing pages.
 * One IntersectionObserver drives every in-view effect, and every effect
 * respects prefers-reduced-motion (those users get the final state instantly).
 *
 *   [data-reveal]  : fade/slide a section in (CSS handles the transition;
 *                    optional data-delay="1..5" staggers it)
 *   .crk-count     : count-up number (data-target, data-suffix, data-comma="1")
 *   .crk-type      : typewriter text (data-text)
 *   .crk-tree      : staggered cascade of its .crk-tree-line children
 *
 * The crk-* / [data-reveal] CSS lives in globals.css, so any free page can
 * opt in just by rendering <FreeMotion /> and adding the classes.
 */
export default function FreeMotion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fmt = (n: number, comma: boolean) =>
      comma ? n.toLocaleString("en-US") : String(n);

    const runCount = (el: HTMLElement) => {
      const target = Number(el.dataset.target || "0");
      const suffix = el.dataset.suffix || "";
      const comma = el.dataset.comma === "1";
      if (reduce || target === 0) {
        el.textContent = fmt(target, comma) + suffix;
        return;
      }
      const dur = 1100;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
        el.textContent = fmt(Math.round(target * eased), comma) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const runType = (el: HTMLElement) => {
      const text = el.dataset.text || el.textContent || "";
      if (reduce) {
        el.textContent = text;
        return;
      }
      el.textContent = "";
      let i = 0;
      const step = () => {
        el.textContent = text.slice(0, i);
        i += 1;
        if (i <= text.length) window.setTimeout(step, 45);
      };
      step();
    };

    // pre-stagger cascade lines
    document
      .querySelectorAll<HTMLElement>(".crk-tree .crk-tree-line")
      .forEach((line, idx) => {
        line.style.animationDelay = `${idx * 45}ms`;
      });

    const reveals = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const counts = Array.from(document.querySelectorAll<HTMLElement>(".crk-count"));
    const typeEl = document.querySelector<HTMLElement>(".crk-type");
    const tree = document.querySelector<HTMLElement>(".crk-tree");

    if (reduce || !("IntersectionObserver" in window)) {
      reveals.forEach((e) => e.classList.add("tk-in"));
      counts.forEach(runCount);
      if (typeEl) runType(typeEl);
      tree?.classList.add("crk-in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const t = en.target as HTMLElement;
          if (t.hasAttribute("data-reveal")) t.classList.add("tk-in");
          if (t.classList.contains("crk-count")) runCount(t);
          else if (t.classList.contains("crk-type")) runType(t);
          else if (t.classList.contains("crk-tree")) t.classList.add("crk-in");
          io.unobserve(t);
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -6% 0px" }
    );

    reveals.forEach((e) => io.observe(e));
    counts.forEach((c) => io.observe(c));
    if (typeEl) io.observe(typeEl);
    if (tree) io.observe(tree);

    return () => io.disconnect();
  }, []);

  return null;
}
