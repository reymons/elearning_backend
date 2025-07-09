import fs from "fs";
import path from "path";
import { FastifyServerOptions } from "fastify";
import { buildServer } from "./app";
import { DEV_ENV, HOST, PORT } from "@/config/env";

async function main() {
    const opts: FastifyServerOptions = {
        logger: true
    }
    if (DEV_ENV) {
        (opts as any).https = {
            key: fs.readFileSync(path.join(__dirname, "tls", "key.pem")),
            cert: fs.readFileSync(path.join(__dirname, "tls", "cert.pem")),
        };
    }

    const server = await buildServer(opts);

    server.listen({
        host: HOST,
        port: PORT,
    }, (err, addr) => {
        if (err) throw err;
        console.log(`Server is running on ${addr}`);
    });
}

main();

