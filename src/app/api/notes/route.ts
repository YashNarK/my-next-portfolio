// src/app/api/notes/route.ts
//
// Token-guarded, read-only listing of the notes clipboard, so LLM tools and
// scripts can pull notes over plain HTTP without a browser session.
//
//   curl -H "Authorization: Bearer $NOTES_API_TOKEN" https://<host>/api/notes
//
// Filters: ?category=Snippets  ?q=docker  ?limit=20  ?includeContent=false

import { NextResponse } from "next/server";
import { authorizeBearer } from "@/lib/api/bearer-auth";
import { filterNotes, listNotesServer } from "@/lib/firebase/notes-server";
import { noteCategory, noteFileName } from "@/lib/notes";

// firebase-admin and node:crypto need the Node runtime, and an auth-guarded
// response must never be cached or statically prerendered.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(request: Request) {
  const auth = authorizeBearer(request, process.env.NOTES_API_TOKEN);
  if (!auth.ok) {
    return NextResponse.json(
      { error: auth.error },
      {
        status: auth.status,
        headers:
          auth.status === 401
            ? { ...NO_STORE, "WWW-Authenticate": 'Bearer realm="notes"' }
            : NO_STORE,
      },
    );
  }

  const { searchParams } = new URL(request.url);
  const includeContent = searchParams.get("includeContent") !== "false";

  const rawLimit = searchParams.get("limit");
  const limit = rawLimit ? Number.parseInt(rawLimit, 10) : null;
  if (rawLimit && (!Number.isFinite(limit) || (limit as number) < 1)) {
    return NextResponse.json(
      { error: "'limit' must be a positive integer" },
      { status: 400, headers: NO_STORE },
    );
  }

  try {
    const all = await listNotesServer();
    const matched = filterNotes(all, {
      category: searchParams.get("category"),
      query: searchParams.get("q"),
    });
    const page = limit ? matched.slice(0, limit) : matched;

    return NextResponse.json(
      {
        total: all.length,
        matched: matched.length,
        count: page.length,
        // every category in the collection, not just the filtered page, so a
        // caller can discover what it may filter by from a single request
        categories: Array.from(new Set(all.map(noteCategory))).sort((a, b) =>
          a.localeCompare(b),
        ),
        notes: page.map((note) => ({
          id: note.id,
          title: note.title,
          category: noteCategory(note),
          createdAt: note.createdAt,
          updatedAt: note.updatedAt,
          fileName: noteFileName(note.title),
          textUrl: `/api/notes/${note.id}?format=txt`,
          ...(includeContent ? { content: note.content } : {}),
        })),
      },
      { headers: NO_STORE },
    );
  } catch (error) {
    console.error("GET /api/notes failed", error);
    return NextResponse.json(
      { error: "Failed to read notes" },
      { status: 500, headers: NO_STORE },
    );
  }
}
