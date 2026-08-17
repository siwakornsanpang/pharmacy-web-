import { afterEach, describe, expect, it, vi } from "vitest";
import { mockPharmacyAdapter } from "@/lib/server/pharmacy-auth/mock-adapter";
import { pharmacyAuthConfig } from "@/lib/server/pharmacy-auth/session";
import { consumeChallenge, createChallenge, createSession, getSession } from "@/lib/server/pharmacy-auth/session-store";

afterEach(() => vi.unstubAllEnvs());

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

  it("uses an encrypted stateless session token", async () => {
    const identity = await mockPharmacyAdapter.authenticate("ph123", "12345");
    expect(identity).not.toBeNull();
    const id = createSession(identity!, 300);
    expect(id).not.toContain("ph123");
    expect(getSession(id)?.pharmacistLicense).toBe("ภ12345");
    expect(getSession(`${id}tampered`)).toBeNull();
    expect(consumeChallenge(createChallenge(identity!))?.subject).toBe(identity!.subject);
  });

  it("allows mock authentication only when POC mode is explicit", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("PHARMACY_AUTH_MODE", "mock");
    vi.stubEnv("PHARMACY_SESSION_STORE", "memory");
    vi.stubEnv("PHARMACY_POC_MODE", "true");

    expect(pharmacyAuthConfig().ttlSeconds).toBe(7 * 24 * 60 * 60);
  });
});
