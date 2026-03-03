// src/app/api/auth/login/route.ts
// Accepts an AES-GCM encrypted payload so credentials never travel in plain text.
// Firebase REST API is called server-side only; the raw password never leaves the server.

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase/firebase-admin";
import { decryptPayload } from "@/utils/crypto";

interface Credentials {
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const { payload } = (await request.json()) as { payload: string };

    const secret = process.env.ENCRYPT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // Decrypt AES-GCM encrypted credentials from the client
    const { email, password } = await decryptPayload<Credentials>(payload, secret);

    // Authenticate via Firebase Auth REST API (server-side only — password never exposed)
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const fbRes = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      }
    );

    if (!fbRes.ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const { idToken } = (await fbRes.json()) as { idToken: string };

    // Verify token and enforce allowed admin email
    const decoded = await adminAuth.verifyIdToken(idToken);
    if (decoded.email !== process.env.ALLOWED_ADMIN_EMAIL) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("token", idToken, {
      httpOnly: true,
      secure: true,
      path: "/",
      sameSite: "strict",
    });

    // Create a custom token so the client SDK can call signInWithCustomToken()
    // — this gives Firestore/Storage rules access to request.auth
    const customToken = await adminAuth.createCustomToken(decoded.uid);

    return NextResponse.json({ status: "ok", customToken });
  } catch {
    return NextResponse.json({ error: "Authentication failed" }, { status: 401 });
  }
}
