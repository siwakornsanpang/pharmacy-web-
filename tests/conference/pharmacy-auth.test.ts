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

  it("authenticates each five-digit mock pharmacist with unique identity data", async () => {
    const licenses = ["ph123", "11111", "22222", "33333", "44444", "55555", "66666", "77777", "88888", "99999", "00000"];
    const identities = await Promise.all(
      licenses.map((license) => mockPharmacyAdapter.authenticate(license, "12345")),
    );
    expect(identities.every(Boolean)).toBe(true);
    expect(new Set(identities.map((identity) => identity?.subject)).size).toBe(11);
    expect(new Set(identities.map((identity) => identity?.email)).size).toBe(11);
    expect(await mockPharmacyAdapter.authenticate("11111", "wrong")).toBeNull();
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
