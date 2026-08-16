import { randomBytes } from "node:crypto";
import type { VerifiedPharmacyIdentity } from "./adapter";

interface Stored<T> { value: T; expiresAt: number }

const globalStore = globalThis as typeof globalThis & {
  __pharmacySessions?: Map<string, Stored<VerifiedPharmacyIdentity>>;
  __pharmacyChallenges?: Map<string, Stored<VerifiedPharmacyIdentity>>;
};

const sessions: Map<string, Stored<VerifiedPharmacyIdentity>> = globalStore.__pharmacySessions ??= new Map<string, Stored<VerifiedPharmacyIdentity>>();
const challenges: Map<string, Stored<VerifiedPharmacyIdentity>> = globalStore.__pharmacyChallenges ??= new Map<string, Stored<VerifiedPharmacyIdentity>>();
const token = () => randomBytes(32).toString("base64url");

function takeValid<T>(store: Map<string, Stored<T>>, id: string, consume = false) {
  const entry = store.get(id);
  if (!entry || entry.expiresAt <= Date.now()) { store.delete(id); return null; }
  if (consume) store.delete(id);
  return entry.value;
}

export function createChallenge(identity: VerifiedPharmacyIdentity) {
  const id = token();
  challenges.set(id, { value: identity, expiresAt: Date.now() + 5 * 60_000 });
  return id;
}

export const consumeChallenge = (id: string) => takeValid(challenges, id, true);

export function createSession(identity: VerifiedPharmacyIdentity, ttlSeconds: number) {
  const id = token();
  sessions.set(id, { value: identity, expiresAt: Date.now() + ttlSeconds * 1000 });
  return id;
}

export const getSession = (id: string) => takeValid(sessions, id);
export const revokeSession = (id: string) => sessions.delete(id);
