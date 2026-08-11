// src/app/api/notes/[id]/route.ts
//
// A single note, as JSON or as the same `<title>.txt` file the admin UI
// downloads:
//
//   curl -H "Authorization: Bearer $NOTES_API_TOKEN" \
//        -OJ "https://<host>/api/notes/<id>?format=txt"

import { NextResponse } from "next/server";
import { authorizeBearer } from "@/lib/api/bearer-auth";
import { getNoteServer } from "@/lib/firebase/notes-server";
import {
  noteCategory,
  noteContentDisposition,
  noteFileName,
  noteToPlainText,
} from "@/lib/notes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

  const { id } = await params;
  const format = new URL(request.url).searchParams.get("format") ?? "json";
  if (format !== "json" && format !== "txt") {
    return NextResponse.json(
      { error: "'format' must be 'json' or 'txt'" },
      { status: 400, headers: NO_STORE },
    );
  }

  try {
    const note = await getNoteServer(id);
    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404, headers: NO_STORE },
      );
    }

    if (format === "txt") {
      return new NextResponse(noteToPlainText(note), {
        headers: {
          ...NO_STORE,
          "Content-Type": "text/plain; charset=utf-8",
          "Content-Disposition": noteContentDisposition(note.title),
        },
      });
    }

    return NextResponse.json(
      {
        id: note.id,
        title: note.title,
        category: noteCategory(note),
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt,
        fileName: noteFileName(note.title),
        textUrl: `/api/notes/${note.id}?format=txt`,
      },
      { headers: NO_STORE },
    );
  } catch (error) {
    console.error(`GET /api/notes/${id} failed`, error);
    return NextResponse.json(
      { error: "Failed to read note" },
      { status: 500, headers: NO_STORE },
    );
  }
}
