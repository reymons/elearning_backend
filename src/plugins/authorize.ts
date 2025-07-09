import { ACCESS_TOKEN_COOKIE, verifyToken } from "@/lib/jwt";
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from "fastify";
import fp from "fastify-plugin";

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

function handler(
    req: FastifyRequest,
    rep: FastifyReply,
    done: HookHandlerDoneFunction
) {
    const accessToken = req.cookies[ACCESS_TOKEN_COOKIE];
    if (accessToken) {
        const payload = verifyToken(accessToken);
        req.user = payload;
        done();
    } else {
        rep.code(401).send();
    }
}

export default fp((fastify, _, done) => {
    fastify.decorate("authorize", handler);
    done();
});

