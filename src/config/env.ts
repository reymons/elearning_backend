import { Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

const envSchema = Type.Object({
    HOST: Type.String({ default: "127.0.0.1" }),
    PORT: Type.String({
        default: "6464",
        pattern: "^[0-9]{4,5}$"
    }),
    NODE_ENV: Type.Union(
        [
            Type.Literal("production"),
            Type.Literal("development"),
            Type.Literal("test"),
        ],
        { default: "development" }
    ),
    JWT_SECRET: Type.String(),
    DB_HOST: Type.String(),
    DB_PORT: Type.String({ pattern: "^[0-9]{4,5}$" }),
    DB_NAME: Type.String(),
    DB_USER: Type.String(),
    DB_PASSWORD: Type.String(),
});

const env = Value.Parse(envSchema, process.env);
                 
export const {
    NODE_ENV,
    JWT_SECRET,
} = env;

export const DEV_ENV = NODE_ENV === "development";
export const PROD_ENV = NODE_ENV === "production";

export const ALLOWED_ORIGINS: string[] = [];
export const HOST = env.HOST;
export const PORT = Number(env.PORT);

export const DB = Object.freeze({
    HOST: env.DB_HOST,
    PORT: Number(env.DB_PORT),
    NAME: env.DB_NAME,
    USER: env.DB_USER,
    PASSWORD: env.DB_PASSWORD,
});

