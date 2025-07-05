import * as yup from "yup";
import { type FastifyInstance } from "fastify";
import { toPersonalUser, User } from "@/models/user";
import { SignInBody, SignUpBody } from "./types";
import { hashPassword, verifyPassword } from "./utils/password";
import { setJwtTokens } from "./utils/jwt";
import { REFRESH_TOKEN_COOKIE, verifyToken } from "@/lib/jwt";
import { RefreshTokenBlacklist } from "@/models/rtb";

const maxDate = new Date();
maxDate.setFullYear(maxDate.getFullYear() - 6);

// @ts-ignore
// yup.date() returns a string, but ts is unable to understand that
const signUpSchema: yup.Schema<SignUpBody> = yup.object({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    dateOfBirth: yup.date().required().min("1920-01-01").max(maxDate),
    email: yup.string().required().email(),
    password: yup.string().required().min(6).max(60), // TODO: validate for a strong password
});

const signInSchema: yup.Schema<SignInBody> = yup.object({
    email: yup.string().required(),
    password: yup.string().required(),
});

export function register(fastify: FastifyInstance) {
    fastify.post("/auth/sign-up", async (req, rep) => {
        const body = await signUpSchema.validate(req.body);
        const user = await User.create({
            ...body,
            password: await hashPassword(body.password),
        });
        setJwtTokens(user.id, rep);
        rep.code(201).send(toPersonalUser(user));
    });

    fastify.post("/auth/sign-in", async (req, rep) => {
        const body = await signInSchema.validate(req.body);
        try {
            const user = await User.getByEmail(body.email);
            if (await verifyPassword(body.password, Buffer.from(user.password))) {
                setJwtTokens(user.id, rep);
                rep.code(200).send(toPersonalUser(user));
            } else {
                rep.code(400).send({ message: "Invalid email or password" });
            }
        } catch {
            rep.code(400).send({ message: "Invalid email or password" });
        }
    });

    fastify.post("/auth/refresh", async (req, rep) => {
        const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];
        if (!refreshToken) {
            rep.code(400).send({ message: "No refresh token" });
            return;
        }
        try {
            const user = verifyToken(refreshToken);
            await RefreshTokenBlacklist.add(refreshToken, user.id);
            setJwtTokens(user.id, rep);
            rep.code(201).send();
        } catch {
            rep.code(400).send();
        }
    });
}
