// src\app\api\auth\logout\route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookiesFn = await cookies();
  cookiesFn.set("token", "", { maxAge: -1, path: "/" });
  return NextResponse.json({ status: "logged_out" });
}
