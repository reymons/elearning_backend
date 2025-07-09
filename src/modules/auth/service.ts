import { User } from "@/models/user";
import { SignUpBody } from "./schema";
import { hashPassword } from "./utils/password";

export async function signUp(body: SignUpBody) {
    return User.create({
        ...body,
        password: await hashPassword(body.password),
    });
}

