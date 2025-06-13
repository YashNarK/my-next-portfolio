// src\app\api\auth\login\route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getApps,initializeApp, applicationDefault } from "firebase-admin/app";
import { adminAuth } from "@/lib/firebase/firebase-admin";
// Initialize Admin SDK once
// Initialize Admin SDK only if no apps are initialized
if (!getApps().length) {
  initializeApp({ credential: applicationDefault() });
}

export async function POST(request: Request) {
  const { token } = await request.json();
  const decodedToken = await adminAuth.verifyIdToken(token);
  const cookiesFn = await cookies();

  // Only allow specific admin email
  if (decodedToken.email !== process.env.ALLOWED_ADMIN_EMAIL) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  cookiesFn.set("token", token, { httpOnly: true, secure: true, path: "/" });
  return NextResponse.json({ status: "ok" });
}
