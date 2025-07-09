import { faker } from "@faker-js/faker";
import { hashPassword, verifyPassword } from "../utils/password";

describe("verifyPassword", () => {
    it("verifies correctly", async () => {
        const pass = faker.internet.password();
        const hash = await hashPassword(pass);
        expect(await verifyPassword(pass, hash)).toBe(true);
        expect(await verifyPassword("wrongpass", hash)).toBe(false);
    });
});
