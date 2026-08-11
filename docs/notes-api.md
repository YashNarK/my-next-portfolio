# Notes REST API

A read-only HTTP view of the admin notes clipboard, guarded by a static bearer
token so LLM tools, scripts and cron jobs can fetch notes without a browser
session.

## Setup

Set a single environment variable wherever the app runs (locally in
`.env.local`, and in the Vercel project settings for deployments):

```
NOTES_API_TOKEN=<a long random string>
```

Generate one with `openssl rand -hex 32`. If the variable is unset or blank the
endpoints answer `503` — they never fall open to anonymous access.

The API reads Firestore through `firebase-admin`, so the existing
`FIREBASE_PROJECT_ID` / `FIREBASE_CLIENT_EMAIL` / `FIREBASE_PRIVATE_KEY`
service-account variables must also be present.

## Authentication

Send the token on every request, in either header:

```
Authorization: Bearer <NOTES_API_TOKEN>
X-API-Key: <NOTES_API_TOKEN>
```

Query-string tokens are deliberately not accepted: this token grants read
access to every note, and query strings leak into server logs, browser history
and `Referer` headers.

Responses: `401` for a missing or wrong token, `503` when the server has no
token configured, `404` for an unknown note id, `400` for a bad parameter.

## `GET /api/notes`

Lists notes, newest update first.

| Query param      | Default | Meaning                                                  |
| ---------------- | ------- | -------------------------------------------------------- |
| `category`       | —       | Exact category match, case-insensitive (`Uncategorized` selects notes with no category) |
| `q`              | —       | Case-insensitive substring across title, content and category |
| `limit`          | —       | Positive integer; truncates the result                    |
| `includeContent` | `true`  | `false` omits note bodies, for a cheap index              |

```bash
curl -H "Authorization: Bearer $NOTES_API_TOKEN" \
     "https://<host>/api/notes?category=Snippets&limit=10"
```

```json
{
  "total": 42,
  "matched": 7,
  "count": 7,
  "categories": ["Snippets", "Uncategorized"],
  "notes": [
    {
      "id": "9YqK…",
      "title": "Docker prune",
      "category": "Snippets",
      "createdAt": "2026-07-02T09:14:00.000Z",
      "updatedAt": "2026-08-01T18:22:10.412Z",
      "fileName": "Docker prune.txt",
      "textUrl": "/api/notes/9YqK…?format=txt",
      "content": "docker system prune -af --volumes\n"
    }
  ]
}
```

`categories` always covers the whole collection, not just the returned page, so
one request is enough to discover what can be filtered on.

## `GET /api/notes/{id}`

A single note. `?format=json` (default) returns the same object shape as a list
entry. `?format=txt` returns the note content as `text/plain` with a
`Content-Disposition: attachment` filename of `<title>.txt` — byte-identical to
what the admin UI's **Download** button produces.

```bash
# saves "Docker prune.txt" in the current directory
curl -OJ -H "Authorization: Bearer $NOTES_API_TOKEN" \
     "https://<host>/api/notes/9YqK…?format=txt"
```

## Scope

The endpoints are read-only by design — there is no create, update or delete
over HTTP. Writes stay behind the authenticated admin UI, so a leaked token
costs disclosure, not data loss.
