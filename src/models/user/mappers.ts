import { User } from "./entity"

export function toPersonalUser(user: User) {
    const u = { ...user };
    Reflect.deleteProperty(u, "password");
    return u;
}
