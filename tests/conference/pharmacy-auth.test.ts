import { describe, expect, it } from "vitest";
import { mockPharmacyAdapter } from "@/lib/server/pharmacy-auth/mock-adapter";
import { createSession, getSession, revokeSession } from "@/lib/server/pharmacy-auth/session-store";

describe("server-side Pharmacy authentication", () => {
  it("keeps demo credential and OTP verification out of the browser auth state", async () => {
    const identity = await mockPharmacyAdapter.authenticate("ph123", "12345");
    expect(identity?.subject).toBe("mock-user-ph123");
    expect(await mockPharmacyAdapter.authenticate("ph123", "wrong")).toBeNull();
    expect(identity && await mockPharmacyAdapter.verifyOtp(identity, "111222")).toBe(true);
  });

  it("uses an opaque revocable session id", async () => {
    const identity = await mockPharmacyAdapter.authenticate("ph123", "12345");
    expect(identity).not.toBeNull();
    const id = createSession(identity!, 300);
    expect(id).not.toContain("ph123");
    expect(getSession(id)?.pharmacistLicense).toBe("ภ12345");
    revokeSession(id);
    expect(getSession(id)).toBeNull();
  });
});
