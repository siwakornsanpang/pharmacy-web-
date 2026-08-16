import type { PharmacyAuthAdapter, VerifiedPharmacyIdentity } from "./adapter";

const MOCK_IDENTITY: VerifiedPharmacyIdentity = {
  provider: "pharmacy-council",
  subject: "mock-user-ph123",
  pharmacistLicense: "ภ12345",
  firstName: "สมชาย",
  lastName: "รักชาติ",
  email: "somchai@example.test",
  phone: "0800000440",
};

export const mockPharmacyAdapter: PharmacyAuthAdapter = {
  async authenticate(license, password) {
    return license.trim().toLowerCase() === "ph123" && password === "12345" ? MOCK_IDENTITY : null;
  },
  async verifyOtp(_identity, otp) {
    return otp === "111222";
  },
};
