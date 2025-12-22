import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, service: "gitnut-web", ts: new Date().toISOString() });
}
