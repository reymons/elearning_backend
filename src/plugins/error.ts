import { PROD_ENV } from "@/config/env";
import { CORSError } from "@/lib/error";
import fp from "fastify-plugin";

declare module "fastify" {
    interface FastifyReply {
        err(code: number, message: string): this;
    }
}

export default fp((fastify, _, done) => {
    fastify.setErrorHandler((err, _, reply) => {
        if (err instanceof CORSError) {
            reply.err(403, err.message);
        } else {
            fastify.log.error(err.message);
            if (!PROD_ENV) {
                reply.err(500, err.message);
            } else {
                reply.code(500).send();
            }
        }
    });

    fastify.decorateReply("err", function (code, message) {
        this.code(code).send({ message });
        return this;
    });

    done();
});
