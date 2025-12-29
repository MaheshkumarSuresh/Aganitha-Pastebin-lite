"use client";

import { useState } from "react";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function createPaste() {
    setError(null);
    setResultUrl(null);

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    const payload: any = { content };
    if (expiresIn) payload.expiresIn = Number(expiresIn);
    if (maxViews) payload.maxViews = Number(maxViews);

    const res = await fetch("/api/paste", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Failed to create paste");
      return;
    }

    setResultUrl(data.url);
    setCreatedAt(new Date().toLocaleString());
    setContent("");
    setExpiresIn("");
    setMaxViews("");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e5e7eb",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          background: "#020617",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
        }}
      >
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Pastebin Lite</h1>

        <textarea
          rows={8}
          placeholder="Enter your text here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            background: "#020617",
            color: "#e5e7eb",
            border: "1px solid #334155",
            outline: "none",
            marginBottom: 16,
          }}
        />

        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <input
            type="number"
            placeholder="Expiry (seconds)"
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            style={inputStyle}
          />

          <input
            type="number"
            placeholder="Max views"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
            style={inputStyle}
          />
        </div>

        <button
          onClick={createPaste}
          style={{
            width: "100%",
            padding: 12,
            borderRadius: 8,
            background: "#2563eb",
            color: "white",
            fontWeight: 600,
            cursor: "pointer",
            border: "none",
          }}
        >
          Create Paste
        </button>

        {error && (
          <p style={{ color: "#f87171", marginTop: 12 }}>{error}</p>
        )}

        {resultUrl && (
          <div style={{ marginTop: 16 }}>
          <p style={{ color: "#4ade80", marginBottom: 6 }}>
            ✅ Paste created successfully
          </p>

          <a
            href={resultUrl}
            target="_blank"
            style={{
              color: "#38bdf8",
              fontWeight: 600,
              textDecoration: "underline",
            }}
          >
            Click here to view the post
          </a>

        {createdAt && (
          <p style={{ marginTop: 6, fontSize: 14, color: "#94a3b8" }}>
            Posted on {createdAt}
          </p>
        )}
      </div>
    )}

      </div>
    </main>
  );
}

const inputStyle = {
  flex: 1,
  padding: 12,
  borderRadius: 8,
  background: "#020617",
  color: "#e5e7eb",
  border: "1px solid #334155",
  outline: "none",
};
