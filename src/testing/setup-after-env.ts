import { closeDatabase } from "@/lib/db";

afterAll(async () => {
    await closeDatabase();
});

