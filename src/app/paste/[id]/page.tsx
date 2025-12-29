import { headers } from "next/headers";

type Paste = {
  id: string;
  content: string;
  viewCount: number;
};

async function getPaste(id: string): Promise<Paste | null> {
  const headersList = await headers();
  const host = headersList.get("host");

  // Build absolute URL (THIS IS THE FIX)
  const url = `http://${host}/api/paste/${id}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) return null;
  return res.json();
}

export default async function PastePage(
  props: { params: Promise<{ id: string }> }
) {
  const { id } = await props.params;

  if (!id) {
    return (
      <main style={pageStyle}>
        <h2>Invalid paste link</h2>
      </main>
    );
  }

  const paste = await getPaste(id);

  return (
    <main style={pageStyle}>
      <div style={cardStyle}>
        {!paste ? (
          <h2>Paste not found or expired</h2>
        ) : (
          <>
            <h1 style={{ marginBottom: 12 }}>Paste</h1>

            <pre style={preStyle}>
              {paste.content}
            </pre>

            <p style={{ marginTop: 12 }}>
              Views: {paste.viewCount}
            </p>
          </>
        )}
      </div>
    </main>
  );
}

/* ---------- styles ---------- */

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0f172a",
  color: "#e5e7eb",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: 20,
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 720,
  background: "#020617",
  padding: 24,
  borderRadius: 12,
};

const preStyle: React.CSSProperties = {
  background: "#020617",
  padding: 16,
  borderRadius: 8,
  border: "1px solid #334155",
  whiteSpace: "pre-wrap",
};
