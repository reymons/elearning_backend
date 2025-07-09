import { REFRESH_TOKEN_COOKIE, verifyToken } from "@/lib/jwt";
import { FastifyInstance } from "@/lib/fastify";
import { errorSchema } from "@/lib/error";
import { RefreshTokenBlacklist } from "@/models/rtb";
import { personalUserSchema, toPersonalUser, User } from "@/models/user";
import { signInSchema, signUpSchema } from "./schema";
import { setJwtTokens } from "./utils/jwt";
import { verifyPassword } from "./utils/password";
import { signUp } from "./service";

export default function register(fastify: FastifyInstance) {
    fastify.route({
        method: "POST",
        url: "/auth/sign-up",
        schema: {
            tags: ["Authorization"],
            body: signUpSchema,
            response: {
                201: personalUserSchema,
                400: errorSchema,
            }
        },
        async handler(req, reply) {
            const user = await signUp(req.body);
            setJwtTokens(user.id, reply);
            reply.code(201).send(toPersonalUser(user));
        }
    });

    fastify.route({
        method: "POST",
        url: "/auth/sign-in",
        schema: {
            tags: ["Authorization"],
            body: signInSchema,
            response: {
                200: personalUserSchema,
                400: errorSchema,
                404: errorSchema,
            }
        },
        async handler(req, reply) {
            const body = req.body;
            try {
                const user = await User.getByEmail(body.email);
                if (await verifyPassword(body.password, Buffer.from(user.password))) {
                    setJwtTokens(user.id, reply);
                    reply.code(200).send(toPersonalUser(user));
                } else {
                    reply.err(400, "Invalid email or password");
                    reply.err(400, "Invalid email or password");
                }
            } catch {
                reply.err(400, "Invalid email or password");
            }
        }
    });

    fastify.route({
        method: "POST",
        url: "/auth/refresh",
        schema: {
            tags: ["Authorization"],
        },
        async handler(req, reply) {
            const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE];
            if (!refreshToken) {
                reply.err(400, "No refresh token");
                return;
            }
            try {
                const user = verifyToken(refreshToken);
                await RefreshTokenBlacklist.add(refreshToken, user.id);
                setJwtTokens(user.id, reply);
                reply.code(201).send();
            } catch {
                reply.err(400, "Token has been already used");
            }
        }
    });
};

