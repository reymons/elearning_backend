import { ALLOWED_ORIGINS, DEV_ENV } from "@/config/env";
import { ACCESS_TOKEN_COOKIE, verifyToken } from "@/lib/jwt";
import { CORSError } from "./errors";
import type {
    FastifyReply,
    FastifyRequest,
    FastifyInstance,
    HookHandlerDoneFunction
} from "fastify";

declare module "fastify" {
    interface FastifyInstance {
        authorize(
            req: FastifyRequest,
            rep: FastifyReply,
            done: HookHandlerDoneFunction
        ): void;
    }

    interface FastifyRequest {
        user: {
            id: number;
        }
    }
}

export function registerPlugins(fastify: FastifyInstance) {
    fastify.register(import("@fastify/cookie"), {
        parseOptions: {
            sameSite: DEV_ENV ? "lax" : "strict",
            httpOnly: true,
            secure: true,
        },
    });

    fastify.register(import("@fastify/cors"), {
        credentials: true,
        origin: (origin, callback) => {
            if (!ALLOWED_ORIGINS.length || ALLOWED_ORIGINS.includes(origin!)) {
                callback(null, true);
            } else {
                callback(new CORSError("Not allowed"), false);
            }
        }
    });

    fastify.register(import("@fastify/rate-limit"), {
        ban: 5,
        max: 100,
        timeWindow: "1 minute",
    });

    fastify.decorate(
        "authorize",
        (req: FastifyRequest, rep: FastifyReply, done: HookHandlerDoneFunction) => {
            const accessToken = req.cookies[ACCESS_TOKEN_COOKIE];
            if (accessToken) {
                const payload = verifyToken(accessToken);
                req.user = payload;
                done();
            } else {
                rep.code(401).send();
            }
        }
    );
}
