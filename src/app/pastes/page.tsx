import { headers } from "next/headers";

type Paste = {
  id: string;
  created_at: string;
  expires_at: string | null;
  view_count: number;
  max_views: number | null;
  expired: boolean;
};

async function getPastes(): Promise<Paste[]> {
  const headersList = await headers();
  const host = headersList.get("host");
  const url = `http://${host}/api/paste`;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return [];

  return res.json();
}

export default async function PastesPage() {
  const pastes = await getPastes();

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e5e7eb",
        padding: 40,
      }}
    >
      <h1 style={{ fontSize: 28, marginBottom: 20 }}>All Pastes</h1>

      {pastes.length === 0 && <p>No pastes found</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {pastes.map((paste) => (
          <div
            key={paste.id}
            style={{
              background: "#020617",
              padding: 16,
              borderRadius: 10,
              border: "1px solid #334155",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <p style={{ fontSize: 14, color: "#94a3b8" }}>
                Created: {new Date(paste.created_at).toLocaleString()}
              </p>

              <p style={{ fontSize: 14 }}>
                Views: {paste.view_count}
                {paste.max_views && ` / ${paste.max_views}`}
              </p>
            </div>

            {paste.expired ? (
              <span style={{ color: "#f87171", fontWeight: 600 }}>
                Expired
              </span>
            ) : (
              <a
                href={`/paste/${paste.id}`}
                style={{
                  color: "#38bdf8",
                  fontWeight: 600,
                  textDecoration: "underline",
                }}
              >
                View Paste
              </a>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
