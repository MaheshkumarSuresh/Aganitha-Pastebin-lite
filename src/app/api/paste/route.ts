import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT
        id,
        created_at,
        expires_at,
        max_views,
        view_count,
        CASE
          WHEN expires_at IS NOT NULL AND expires_at < NOW() THEN true
          WHEN max_views IS NOT NULL AND view_count >= max_views THEN true
          ELSE false
        END AS expired
      FROM pastes
      ORDER BY created_at DESC
      LIMIT 50
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("List pastes error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { content, expiresIn, maxViews } = body;

        if (!content || typeof content !== "string") {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        let expiresAt: Date | null = null;

        if (expiresIn && typeof expiresIn === "number") {
            expiresAt = new Date(Date.now() + expiresIn * 1000);
        }

        const result = await pool.query(
            `
      INSERT INTO pastes (content, expires_at, max_views)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
            [content, expiresAt, maxViews ?? null]
        );

        const id = result.rows[0].id;

        return NextResponse.json({
            id,
            url: `/paste/${id}`,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
