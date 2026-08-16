// @vitest-environment node
import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { GET as getPharmacyMe } from "@/app/api/auth/pharmacy/me/route";
import { POST as establishConferenceSession } from "@/app/api/conference/session/route";
import { shouldReloadForStaleSession } from "@/lib/conference/session-recovery";
import { createSession } from "@/lib/server/pharmacy-auth/session-store";

const request = (path: string, sessionId?: string) => new NextRequest(`http://localhost${path}`, {
  headers: sessionId ? { cookie: `pharmacy_session=${sessionId}` } : undefined,
});

describe("stale Pharmacy session recovery", () => {
  it("does not clear or reload when no Pharmacy cookie was sent", async () => {
    const response = await getPharmacyMe(request("/api/auth/pharmacy/me"));
    const problem = await response.json();
    expect(response.status).toBe(401);
    expect(problem).toMatchObject({ code: "PHARMACY_SESSION_REQUIRED" });
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(shouldReloadForStaleSession(problem)).toBe(false);
  });

  it("clears a present-but-invalid cookie and requests one recovery reload", async () => {
    const response = await getPharmacyMe(request("/api/auth/pharmacy/me", "stale-session-id"));
    const problem = await response.json();
    expect(response.status).toBe(401);
    expect(problem).toMatchObject({ code: "PHARMACY_SESSION_INVALID", meta: { sessionCleared: true } });
    expect(response.headers.get("set-cookie")).toContain("pharmacy_session=");
    expect(response.headers.get("set-cookie")).toMatch(/Expires=Thu, 01 Jan 1970 00:00:00 GMT/i);
    expect(shouldReloadForStaleSession(problem)).toBe(true);
  });

  it("keeps a valid Pharmacy session", async () => {
    const sessionId = createSession({ provider: "pharmacy-council", subject: "test-user", pharmacistLicense: "ภ999", firstName: "ทดสอบ", lastName: "ระบบ", email: null, phone: null }, 300);
    const response = await getPharmacyMe(request("/api/auth/pharmacy/me", sessionId));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ user: { pharmacistLicense: "ภ999" } });
    expect(response.headers.get("set-cookie")).toBeNull();
  });

  it("also clears stale Pharmacy state before Conference exchange", async () => {
    const response = await establishConferenceSession(request("/api/conference/session", "stale-conference-session"));
    expect(response.status).toBe(401);
    expect(await response.json()).toMatchObject({ code: "PHARMACY_SESSION_INVALID", meta: { sessionCleared: true } });
    expect(response.headers.get("set-cookie")).toMatch(/Expires=Thu, 01 Jan 1970 00:00:00 GMT/i);
  });
});
