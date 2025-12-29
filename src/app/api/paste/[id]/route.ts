import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        // ✅ unwrap params correctly
        const { id } = await context.params;

        const trimmedId = id.trim();

        // Query paste (Postgres validates UUID)
        const result = await pool.query(
            `SELECT * FROM pastes WHERE id = $1::uuid`,
            [trimmedId]
        );

        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: "Paste not found" },
                { status: 404 }
            );
        }

        const paste = result.rows[0];

        // ⏰ Time-based expiry
        if (paste.expires_at && new Date(paste.expires_at) < new Date()) {
            return NextResponse.json(
                { error: "Paste expired" },
                { status: 410 }
            );
        }

        // 👁️ View-count expiry
        if (
            paste.max_views !== null &&
            paste.view_count >= paste.max_views
        ) {
            return NextResponse.json(
                { error: "Paste expired" },
                { status: 410 }
            );
        }

        // Increment view count atomically
        const update = await pool.query(
            `
      UPDATE pastes
      SET view_count = view_count + 1
      WHERE id = $1::uuid
      RETURNING view_count
      `,
            [trimmedId]
        );

        return NextResponse.json({
            id: paste.id,
            content: paste.content,
            viewCount: update.rows[0].view_count,
        });
    } catch (error: any) {
        // Invalid UUID format
        if (error.code === "22P02") {
            return NextResponse.json(
                { error: "Invalid paste id" },
                { status: 400 }
            );
        }

        console.error("GET paste error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
