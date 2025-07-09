import { entity } from "@/testing/assert";
import { toPersonalUser } from "./utils";

test("deletes sensitive data", () => {
    const user = toPersonalUser(entity.user.mock());
    expect("password" in user).toBe(false);
});
