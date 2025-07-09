import { buildServer } from "@/app";
import { FastifyInstance } from "@/lib/fastify";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/jwt";
import { SignInBody } from "@/modules/auth";
import { InjectOptions } from "fastify";

export const TEST_USER_EMAIL = "basic@test.com";
export const TEST_USER_PASS = "strong.pwd123^$";

type TestInjectOptions = InjectOptions & {
    auth?: {
        accessToken?: string;
        refreshToken?: string;
    };
}

class TestServer {
    constructor(private readonly instance: FastifyInstance) {}

    async signIn() {
        const res = await this.inject({
            method: "POST",
            path: "/api/v1/auth/sign-in",
            body: {
                email: TEST_USER_EMAIL,
                password: TEST_USER_PASS,
            } satisfies SignInBody,
        });

        const accessToken = res.cookies.find(e => e.name === ACCESS_TOKEN_COOKIE);
        const refreshToken = res.cookies.find(e => e.name === REFRESH_TOKEN_COOKIE);

        return {
            accessToken: accessToken?.value ?? "",
            refreshToken: refreshToken?.value ?? "",
        }
    }

    inject(options: TestInjectOptions) {
        const { auth, ...opts } = options;

        if (opts.body && typeof opts.body === "object") {
            opts.headers = {
                ...opts.headers,
                ["Content-Type"]: "application/json"
            };
        }

        if (auth) {
            opts.cookies = {
                ...opts.cookies,
                [ACCESS_TOKEN_COOKIE]: auth.accessToken ?? "",
                [REFRESH_TOKEN_COOKIE]: auth.refreshToken ?? "",
            };
        }

        return this.instance.inject(opts).then(res => {
            return {
                ...res,
                error: res.statusCode < 400 ? null : new Error(res.json().message)
            }
        });
    }

    async injectAuthed(opts: TestInjectOptions) {
        const { accessToken, refreshToken } = await this.signIn();

        if (!accessToken) {
            throw new Error("Couldn't sign in due to lack of access token");
        }
        
        return this.inject({
            ...opts,
            auth: {
                accessToken,
                refreshToken,
                ...opts.auth,
            }
        });
    }
}

export async function buildTestServer() {
    const instance = await buildServer();
    return new TestServer(instance);
}

