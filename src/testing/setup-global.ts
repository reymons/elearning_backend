require("tsconfig-paths").register();

import { signUp } from "@/modules/auth";
import { TEST_USER_EMAIL, TEST_USER_PASS } from "./app";
import { closeDatabase } from "@/lib/db";

async function seedTestUser() {
    await signUp({
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASS,
        firstName: "Basic",
        lastName: "User",
        dateOfBirth: "1990-01-01"
    });
}

export default async function setup() {
    await seedTestUser();
    await closeDatabase();
}

