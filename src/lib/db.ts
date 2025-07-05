import { DB } from "@/config/env";
import pgp from "pg-promise";

export const db = pgp()({
    host: DB.HOST,
    port: DB.PORT,
    database: DB.NAME,
    user: DB.USER,
    password: DB.PASSWORD,
});

