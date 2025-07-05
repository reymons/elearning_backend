import path from "path";
import { migrate } from "postgres-migrations";
import { DB } from "@/config/env";

migrate(
    {
        host: DB.HOST,
        port: DB.PORT,
        database: DB.NAME,
        user: DB.USER,
        password: DB.PASSWORD,
    },
    path.resolve(__dirname, "..", "src", "migrations")
);
