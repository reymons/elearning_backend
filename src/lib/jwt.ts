import jwt from "jsonwebtoken";
import * as yup from "yup";
import { JWT_SECRET } from "@/config/env";

export type JwtPayload = {
    id: number;
};

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";
export const ACCESS_TOKEN_MAX_AGE = 300; // 5 min
export const REFRESH_TOKEN_MAX_AGE = 2592000; // 30 days

const payloadSchema: yup.Schema<JwtPayload> = yup.object({
    id: yup.number().required().positive()
});

export function createAccessToken(userId: number) {
    const payload: JwtPayload = { id: userId };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: ACCESS_TOKEN_MAX_AGE });
}

export function createRefreshToken(userId: number) {
    const payload: JwtPayload = { id: userId };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_MAX_AGE });
}

export function verifyToken(token: string): JwtPayload {
    const p = jwt.verify(token, JWT_SECRET);
    payloadSchema.validateSync(p);
    return p as JwtPayload;
}
