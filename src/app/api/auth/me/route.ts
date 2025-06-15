// src/app/api/auth/me/route.ts
import { adminAuth } from "@/lib/firebase/firebase-admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieFn = await cookies();
  const token = cookieFn.get("token")?.value;

  if (!token) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return NextResponse.json({ authenticated: true, email: decoded.email });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
