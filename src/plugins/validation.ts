import { TypeBoxValidatorCompiler } from "@fastify/type-provider-typebox";
import fp from "fastify-plugin";

export default fp((fastify, _, done) => {
    fastify.setValidatorCompiler(TypeBoxValidatorCompiler);
    done();
});
