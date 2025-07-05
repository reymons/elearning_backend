import { buildServer } from "./app/server";
import { HOST, PORT } from "./config/env";

async function main() {
    const fastify = await buildServer();

    fastify.listen({
        host: HOST,
        port: PORT,
    }, (err, addr) => {
        if (err) throw err;
        console.log(`Server is running on ${addr}`);
    });
}

main();

