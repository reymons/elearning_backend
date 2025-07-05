import path from "path";
import fs from "fs";
import Fastify, { type FastifyInstance, type FastifyServerOptions } from "fastify";
import { registerPlugins } from "./plugins";
import { DEV_ENV, PROD_ENV } from "@/config/env";
import { ValidationError } from "yup";
import { CORSError } from "./errors";

function registerApi(fastify: FastifyInstance) {
    return fastify.register(async fastify => {
        const dir = path.resolve(__dirname, "..", "modules");
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        const imports = [];
        for (const ent of entries) {
            if (ent.isDirectory()) {
                const dir = path.join(ent.parentPath, ent.name, "api.ts");
                imports.push(import(dir).then(m => m.register(fastify)));
            }
        }
        await Promise.all(imports);
    }, { prefix: "/api/v1" });
}

export async function buildServer() {
    const opts: FastifyServerOptions = {
        logger: true,
    };
    if (DEV_ENV) {
        (opts as any).https = {
            key: fs.readFileSync(path.join(__dirname, "tls", "key.pem")),
            cert: fs.readFileSync(path.join(__dirname, "tls", "cert.pem")),
        };
    }

    const fastify = Fastify(opts);

    fastify.setErrorHandler((err, _, rep) => {
        if (err instanceof ValidationError) {
            rep.code(400).send({ message: err.message });
        } else if (err instanceof CORSError) {
            rep.code(403).send({ message: err.message });
        } else {
            if (!PROD_ENV) {
                fastify.log.error(err.message);
                rep.code(500).send({ message: err.message });
            } else {
                rep.code(500).send();
            }
        }
    });

    registerPlugins(fastify);
    await registerApi(fastify);
    
    return fastify;
}
