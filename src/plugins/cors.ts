import { ALLOWED_ORIGINS } from "@/config/env";
import { CORSError } from "@/lib/error";
import fp from "fastify-plugin";

export default fp((fastify, _, done) => {
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
    done();
});

