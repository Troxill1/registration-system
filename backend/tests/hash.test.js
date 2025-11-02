import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "../utils/hash.js";

describe("Password hashing and verification", async () => {
    const password = "password123";
    const hashedPassword = await hashPassword(password);

    it("hashPassword() should return valid salt and hash", () => {
        expect(hashedPassword.includes(":")).toBe(true);

        const [salt, key] = hashedPassword.split(":");
        expect(salt.length).toBe(32);  // 16 binary bytes -> 32 hexadecimal chars
        expect(key.length).toBe(128);
    });

    it("verifyPassword() should return true for matching passwords", async () => {
        const passwordsMatch = await verifyPassword(password, hashedPassword);
        expect(passwordsMatch).toBe(true);
    });

    it("verifyPassword() should return false for mismatching passwords", async () => {
        const wrongPassword = "password124";
        const passwordsMatch = await verifyPassword(wrongPassword, hashedPassword);
        expect(passwordsMatch).toBe(false);
    });
});
