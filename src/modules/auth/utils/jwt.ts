import type { FastifyReply } from "fastify";
import {
    ACCESS_TOKEN_COOKIE,
    ACCESS_TOKEN_MAX_AGE,
    createAccessToken,
    createRefreshToken,
    REFRESH_TOKEN_COOKIE,
    REFRESH_TOKEN_MAX_AGE
} from "@/lib/jwt";

const accessTokenCookieOpts = {
    maxAge: ACCESS_TOKEN_MAX_AGE,
} as const;

const refreshTokenCookieOpts = {
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path: "/api/v1/auth/refresh"
} as const;

export function setJwtTokens(userId: number, rep: FastifyReply) {
    const accessToken = createAccessToken(userId);
    const refreshToken = createRefreshToken(userId);
    rep.setCookie(ACCESS_TOKEN_COOKIE, accessToken, accessTokenCookieOpts);
    rep.setCookie(REFRESH_TOKEN_COOKIE, refreshToken, refreshTokenCookieOpts);
}
