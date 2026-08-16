// @vitest-environment node
import { createLocalJWKSet, decodeProtectedHeader, jwtVerify } from "jose";
import { describe, expect, it } from "vitest";
import { signConferenceAssertion } from "@/lib/server/conference-assertion";

const jwks = { keys: [{ crv: "Ed25519", x: "GMN4Qz0izhAUxD8gLgU0PPkb_iIC48-MwLFG3fUTG0Q", kty: "OKP", kid: "pharmacy-web-dev-1", use: "sig", alg: "EdDSA" }] };
const identity = { provider: "pharmacy-council" as const, subject: "user-42", pharmacistLicense: "ภ12345", firstName: "สมชาย", lastName: "รักชาติ", email: null, phone: null };

describe("Conference identity assertion", () => {
  it("uses EdDSA, stable provider subject and a short one-time lifetime", async () => {
    const first = await signConferenceAssertion(identity);
    const second = await signConferenceAssertion(identity);
    expect(decodeProtectedHeader(first)).toMatchObject({ alg: "EdDSA", kid: "pharmacy-web-dev-1" });
    const { payload } = await jwtVerify(first, createLocalJWKSet(jwks), { issuer: "pharmacy-web", audience: "conference-api" });
    expect(payload).toMatchObject({ sub: "user-42", pharmacistLicense: "ภ12345", firstName: "สมชาย", lastName: "รักชาติ" });
    expect((payload.exp ?? 0) - (payload.iat ?? 0)).toBe(60);
    expect(first).not.toBe(second);
  });
});
