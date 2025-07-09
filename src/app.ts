import path from "path";
import AutoLoad from "@fastify/autoload";
import Fastify, { FastifyInstance, type FastifyServerOptions } from "fastify";
import { configureTypebox } from "@/lib/typebox";

function setupAutoLoader(fastify: FastifyInstance) {
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, "plugins"),
        ignorePattern: /.*\.test.ts$/
    });
    fastify.register(AutoLoad, {
        dir: path.join(__dirname, "modules"),
        indexPattern: /^.*api\.ts$/,
        options: { prefix: "/api/v1" },
        routeParams: true,
        dirNameRoutePrefix: false,
        ignorePattern: /.*\.test\.ts$/
    });
}

export async function buildServer(opts?: FastifyServerOptions) {
    const fastify = Fastify(opts);
    setupAutoLoader(fastify);
    configureTypebox();
    return fastify;
}
