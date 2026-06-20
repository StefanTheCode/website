"use client";

import { useEffect } from "react";

/**
 * Adds the class `tk-in` to any element with a [data-reveal] attribute
 * once it scrolls into view. CSS handles the fade/slide. Respects
 * prefers-reduced-motion (those users just get everything visible).
 */
export default function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach((e) => e.classList.add("tk-in"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("tk-in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);

  return null;
}
