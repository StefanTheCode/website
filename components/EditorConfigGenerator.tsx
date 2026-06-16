"use client";

import { useState } from "react";
import styles from "@/app/tools/tools.module.css";

type Options = {
  additionalRequirements: string;
  dotnetVersion: string;
  projectType: string;
  strictness: string;
  indentStyle: string;
  indentSize: number;
  fileScopedNamespaces: boolean;
  underscorePrivateFields: boolean;
  varPreference: string;
  stylecop: boolean;
  sonar: boolean;
  roslynator: boolean;
  treatWarningsAsErrors: boolean | null;
};

type Note = { title: string; text: string };
type Result = {
  editorconfig: string;
  props: string;
  fileName: string;
  propsFileName: string;
  notes: Note[];
  summary: string;
  courseUrl: string;
  extraApplied?: boolean;
};

const DEFAULTS: Options = {
  additionalRequirements: "",
  dotnetVersion: "net10.0",
  projectType: "solution",
  strictness: "balanced",
  indentStyle: "spaces",
  indentSize: 4,
  fileScopedNamespaces: true,
  underscorePrivateFields: true,
  varPreference: "apparent",
  stylecop: true,
  sonar: true,
  roslynator: false,
  treatWarningsAsErrors: null,
};

const selectStyle: React.CSSProperties = {
  background: "rgba(13,7,34,.55)",
  color: "#F3EFFA",
  border: "1px solid rgba(255,255,255,.09)",
  borderRadius: 10,
  padding: "11px 13px",
  fontSize: 15,
  fontFamily: "inherit",
  width: "100%",
};
const labelStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 11.5,
  letterSpacing: ".12em",
  textTransform: "uppercase",
  color: "#9C92B8",
  marginBottom: 7,
  display: "block",
};
const codeBoxStyle: React.CSSProperties = {
  background: "#0D0722",
  border: "1px solid rgba(255,255,255,.09)",
  borderRadius: 12,
  padding: "16px 18px",
  overflowX: "auto",
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 12.5,
  lineHeight: 1.6,
  color: "#D4CDE6",
  margin: 0,
  maxHeight: 420,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        cursor: "pointer",
        color: "#D4CDE6",
        fontSize: 14.5,
        padding: "10px 12px",
        background: "rgba(13,7,34,.4)",
        border: `1px solid ${checked ? "rgba(255,179,27,.4)" : "rgba(255,255,255,.09)"}`,
        borderRadius: 10,
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ accentColor: "#FFB31B", width: 17, height: 17 }}
      />
      {label}
    </label>
  );
}

function CodeBlock({
  title,
  code,
  fileName,
}: {
  title: string;
  code: string;
  fileName: string;
}) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }
  function download() {
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.card}>
      <div className={styles.cardHead}>
        <p className={styles.cardName} style={{ fontSize: 17 }}>
          <span className={styles.group} style={{ marginRight: 10 }}>
            {fileName}
          </span>
          {title}
        </p>
        <div className={styles.links} style={{ margin: 0 }}>
          <button
            type="button"
            onClick={copy}
            className={`${styles.link} ${styles.linkBook}`}
            style={{ cursor: "pointer", border: "1px solid rgba(255,255,255,.09)" }}
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
          <button
            type="button"
            onClick={download}
            className={`${styles.link} ${styles.linkBlog}`}
            style={{ cursor: "pointer", border: 0 }}
          >
            Download
          </button>
        </div>
      </div>
      <pre style={codeBoxStyle}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function EditorConfigGenerator() {
  const [opt, setOpt] = useState<Options>(DEFAULTS);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  function set<K extends keyof Options>(key: K, value: Options[K]) {
    setOpt((o) => ({ ...o, [key]: value }));
  }

  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/editorconfig-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ options: opt, email: email || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form className={styles.field} onSubmit={generate}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
          }}
        >
          <Field label="Target framework">
            <select
              style={selectStyle}
              value={opt.dotnetVersion}
              onChange={(e) => set("dotnetVersion", e.target.value)}
            >
              <option value="net10.0">.NET 10 (C# 14)</option>
              <option value="net9.0">.NET 9 (C# 13)</option>
              <option value="net8.0">.NET 8 (C# 12)</option>
              <option value="net7.0">.NET 7 (C# 11)</option>
              <option value="net6.0">.NET 6 (C# 10)</option>
            </select>
          </Field>

          <Field label="Project type">
            <select
              style={selectStyle}
              value={opt.projectType}
              onChange={(e) => set("projectType", e.target.value)}
            >
              <option value="solution">Full solution</option>
              <option value="webapi">Web API</option>
              <option value="library">Class library</option>
              <option value="console">Console app</option>
            </select>
          </Field>

          <Field label="Strictness">
            <select
              style={selectStyle}
              value={opt.strictness}
              onChange={(e) => set("strictness", e.target.value)}
            >
              <option value="relaxed">Relaxed — suggestions (legacy)</option>
              <option value="balanced">Balanced — warnings (recommended)</option>
              <option value="strict">Strict — errors, fail the build</option>
            </select>
          </Field>

          <Field label="Indentation">
            <select
              style={selectStyle}
              value={`${opt.indentStyle}:${opt.indentSize}`}
              onChange={(e) => {
                const [style, size] = e.target.value.split(":");
                set("indentStyle", style);
                set("indentSize", Number(size));
              }}
            >
              <option value="spaces:4">4 spaces</option>
              <option value="spaces:2">2 spaces</option>
              <option value="tabs:4">Tabs</option>
            </select>
          </Field>

          <Field label="'var' preference">
            <select
              style={selectStyle}
              value={opt.varPreference}
              onChange={(e) => set("varPreference", e.target.value)}
            >
              <option value="apparent">var only when type is apparent</option>
              <option value="always">Prefer var everywhere</option>
              <option value="none">Always use explicit types</option>
            </select>
          </Field>
        </div>

        <div style={{ marginTop: 6 }}>
          <label style={labelStyle}>Options</label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
              gap: 10,
            }}
          >
            <Toggle
              label="File-scoped namespaces"
              checked={opt.fileScopedNamespaces}
              onChange={(v) => set("fileScopedNamespaces", v)}
            />
            <Toggle
              label="_camelCase private fields"
              checked={opt.underscorePrivateFields}
              onChange={(v) => set("underscorePrivateFields", v)}
            />
            <Toggle
              label="TreatWarningsAsErrors"
              checked={opt.treatWarningsAsErrors === null ? opt.strictness === "strict" : !!opt.treatWarningsAsErrors}
              onChange={(v) => set("treatWarningsAsErrors", v)}
            />
            <Toggle label="StyleCop.Analyzers" checked={opt.stylecop} onChange={(v) => set("stylecop", v)} />
            <Toggle label="SonarAnalyzer.CSharp" checked={opt.sonar} onChange={(v) => set("sonar", v)} />
            <Toggle label="Roslynator.Analyzers" checked={opt.roslynator} onChange={(v) => set("roslynator", v)} />
          </div>
        </div>

        <div style={{ marginTop: 6 }}>
          <label style={labelStyle}>Additional requirements (optional)</label>
          <textarea
            className={styles.textarea}
            style={{ minHeight: 90 }}
            placeholder="Write in plain language… e.g. 'Treat async methods without ConfigureAwait as warnings, require file headers with our company name, and forbid regions.'"
            value={opt.additionalRequirements}
            onChange={(e) => set("additionalRequirements", e.target.value)}
            maxLength={1000}
          />
          <span className={styles.hint}>
            AI turns these into extra rules, appended in a clearly-marked block to review before committing.
          </span>
        </div>

        <div className={styles.row} style={{ marginTop: 6 }}>
          <input
            className={styles.input}
            type="email"
            placeholder="Email (optional — for more daily generations)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className={styles.btn} type="submit" disabled={loading}>
            {loading ? "Generating…" : "Generate my config →"}
          </button>
        </div>
        <span className={styles.hint}>
          Free. Generated from vetted templates — valid rule IDs and syntax, every time.
        </span>
      </form>

      {error && (
        <div className={styles.error} style={{ marginTop: 20 }}>
          {error}
        </div>
      )}

      {result && (
        <div className={styles.results}>
          {result.summary && (
            <p className={styles.why} style={{ marginBottom: 4 }}>
              {result.summary}
            </p>
          )}

          {result.extraApplied && (
            <p className={styles.hint} style={{ margin: "0 0 -6px" }}>
              ✨ Extra rules from your requirements were appended to <code>.editorconfig</code> in a marked block — review before committing.
            </p>
          )}

          <CodeBlock title="Code style & analyzer rules" code={result.editorconfig} fileName={result.fileName} />
          <CodeBlock title="Centralized build settings" code={result.props} fileName={result.propsFileName} />

          {result.notes?.length > 0 && (
            <div className={styles.card}>
              <p className={styles.cardName} style={{ fontSize: 18, marginBottom: 6 }}>
                Why these choices
              </p>
              {result.notes.map((n, i) => (
                <div key={i} style={{ marginTop: 12 }}>
                  <p style={{ color: "#FFB31B", fontWeight: 600, margin: 0, fontSize: 15 }}>{n.title}</p>
                  <p className={styles.why} style={{ margin: "4px 0 0" }}>
                    {n.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className={styles.card} style={{ textAlign: "center" }}>
            <p className={styles.why} style={{ margin: "0 0 12px" }}>
              This is the starter setup. The full ruleset — every analyzer explained, Visual Studio cleanup
              profiles, Git hooks, architecture tests, and CI quality gates — is in the course.
            </p>
            <a
              className={`${styles.link} ${styles.linkBlog}`}
              href={result.courseUrl || "https://thecodeman.net/pragmatic-dotnet-code-rules"}
            >
              Get Pragmatic .NET Code Rules →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
