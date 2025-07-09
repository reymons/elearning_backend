import { DEV_ENV } from "@/config/env";
import CookiePlugin from "@fastify/cookie";
import fp from "fastify-plugin";

export default fp((fastify, _, done) => {
    fastify.register(CookiePlugin, {
        parseOptions: {
            sameSite: DEV_ENV ? "lax" : "strict",
            httpOnly: true,
            secure: true,
        },
    });
    done();
});

