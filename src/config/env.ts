import * as yup from "yup";

const envSchema = yup.object({
    HOST: yup.string(),
    PORT: yup.string(),
    NODE_ENV: yup.string().required(),
    JWT_SECRET: yup.string().required(),
    DB_HOST: yup.string().required(),
    DB_PORT: yup.string().required(),
    DB_NAME: yup.string().required(),
    DB_USER: yup.string().required(),
    DB_PASSWORD: yup.string().required(),
});

const env = envSchema.validateSync(process.env);

const NODE_ENV = env.NODE_ENV ?? "development";

export const DEV_ENV = NODE_ENV === "development";
export const PROD_ENV = NODE_ENV === "production";

export const ALLOWED_ORIGINS: string[] = [];
export const HOST = env.HOST ?? "127.0.0.1";
export const PORT = Number(env.PORT ?? 6464);

export const DB = {
    HOST: env.DB_HOST,
    PORT: Number(env.DB_PORT),
    NAME: env.DB_NAME,
    USER: env.DB_USER,
    PASSWORD: env.DB_PASSWORD,
};

export const JWT_SECRET = env.JWT_SECRET;

