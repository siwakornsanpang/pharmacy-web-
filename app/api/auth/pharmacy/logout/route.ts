import { NextRequest, NextResponse } from "next/server";
import { PHARMACY_SESSION_COOKIE } from "@/lib/server/pharmacy-auth/session";
import { revokeSession } from "@/lib/server/pharmacy-auth/session-store";

export async function POST(request: NextRequest) {
  const id = request.cookies.get(PHARMACY_SESSION_COOKIE)?.value;
  if (id) revokeSession(id);
  const response = new NextResponse(null, { status: 204 });
  response.cookies.delete(PHARMACY_SESSION_COOKIE);
  return response;
}
