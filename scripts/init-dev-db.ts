import { DB } from "@/config/env";
import { execSync } from "child_process";

[
    `CREATE DATABASE ${DB.NAME}`,
    `CREATE USER ${DB.USER} WITH PASSWORD '${DB.PASSWORD}'`,
    `GRANT ALL PRIVILEGES ON DATABASE ${DB.NAME} TO ${DB.USER}`,
].forEach(cmd => {
    execSync(`psql -U postgres -p ${DB.PORT} -c "${cmd}"`);
});
