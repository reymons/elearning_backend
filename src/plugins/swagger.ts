import fp from "fastify-plugin";

export default fp((fastify, _, done) => {
    fastify.register(import("@fastify/swagger"));
    fastify.register(import("@fastify/swagger-ui"), {
        routePrefix: "/_docs",

    });
    done();
});

