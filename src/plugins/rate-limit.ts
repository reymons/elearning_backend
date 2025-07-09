import fp from "fastify-plugin";
 
export default fp((fastify, _, done) => {
    fastify.register(import("@fastify/rate-limit"), {
        ban: 5,
        max: 100,
        timeWindow: "1 minute",
    });
    done();
});

