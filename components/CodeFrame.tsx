"use client";

import React, { useState } from "react";

type Props = {
  language?: string;
  code: string;
  children: React.ReactNode;
};

export default function CodeFrame({ language, code, children }: Props) {
  const [copied, setCopied] = useState(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  return (
    <div className="tcm-code">
      <div className="tcm-code__header">
        <div className="tcm-code__dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="tcm-code__meta">
          {language ? <span className="tcm-code__lang">{language}</span> : null}
        </div>

        <button className="tcm-code__copy" onClick={copyToClipboard} type="button">
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {children}
    </div>
  );
}
