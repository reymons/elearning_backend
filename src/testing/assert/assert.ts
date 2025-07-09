import { FastifyInstance } from "@/lib/fastify";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, verifyToken } from "@/lib/jwt";

type InjectResponse = Awaited<ReturnType<FastifyInstance["inject"]>>;

export const assert = {
    accessToken: (res: InjectResponse) => {
        const cookie = res.cookies.find(e => e.name === ACCESS_TOKEN_COOKIE);
        expect(() => verifyToken(cookie!.value)).not.toThrow();
    },
    refreshToken: (res: InjectResponse) => {
        const cookie = res.cookies.find(e => e.name === REFRESH_TOKEN_COOKIE);
        expect(() => verifyToken(cookie!.value)).not.toThrow();
    },
}

