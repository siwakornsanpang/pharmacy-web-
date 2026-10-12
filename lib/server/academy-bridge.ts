import { NextRequest, NextResponse } from "next/server";
import { readPharmacySession } from "./pharmacy-auth/session";
import { API_BASE_URL } from "@/lib/api";
import { signPharmacyAssertion } from "./conference-assertion";
import type { VerifiedPharmacyIdentity } from "./pharmacy-auth/adapter";

export function memberIdentity(request: NextRequest) {
  const session = readPharmacySession(request);
  return session.status === "valid" ? session.identity : null;
}

export async function academyMember(path: string, init?: RequestInit, identity?: VerifiedPharmacyIdentity) {
  try {
    const headers = new Headers(init?.headers);
    headers.set("Content-Type", "application/json");
    if (process.env.ACADEMY_BRIDGE_KEY) headers.set("x-academy-bridge", process.env.ACADEMY_BRIDGE_KEY);
    else if (identity) headers.set("authorization", `Bearer ${await signPharmacyAssertion(identity, "pharmacy-academy-api")}`);
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store",
      signal: AbortSignal.timeout(20000),
    });
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "เชื่อมต่อ Academy API ไม่สำเร็จ กรุณาลองใหม่" }, { status: 502 });
  }
}
