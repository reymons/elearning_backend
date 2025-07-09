import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/config/env";
import { Static, Type } from "@sinclair/typebox";
import { Value } from "@sinclair/typebox/value";

export type JwtPayload = Static<typeof payloadSchema>;

export const ACCESS_TOKEN_COOKIE = "accessToken";
export const REFRESH_TOKEN_COOKIE = "refreshToken";
export const ACCESS_TOKEN_MAX_AGE = 300; // 5 min
export const REFRESH_TOKEN_MAX_AGE = 2592000; // 30 days

const payloadSchema = Type.Object({
    id: Type.Number({ minimum: 1 })
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
    return Value.Parse(payloadSchema, p);
}
