import { User } from "./entity"
import { PersonalUser } from "./schema";

export function toPersonalUser(user: User): PersonalUser {
    const u = { ...user };
    Reflect.deleteProperty(u, "password");
    return u;
}

