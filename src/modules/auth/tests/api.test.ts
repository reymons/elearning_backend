import { faker } from "@faker-js/faker";
import { buildTestServer, TEST_USER_EMAIL, TEST_USER_PASS } from "@/testing/app";
import { entity, assert } from "@/testing/assert";
import { SignInBody, SignUpBody } from "../schema";

describe("POST /api/v1/auth/sign-up", () => {
    let body: SignUpBody;

    beforeEach(() => {
        body = {
            firstName: faker.person.firstName(),
            lastName: faker.person.lastName(),
            email: faker.internet.email(),
            dateOfBirth: faker.date.birthdate().toDateString(),
            password: faker.internet.password(),
        };
    });

    it("creates new user and returns authorization tokens", async () => {
        const server = await buildTestServer();
        const res = await server.inject({
            method: "POST",
            path: "/api/v1/auth/sign-up",
            body,
        });

        expect(res.statusCode).toBe(201);
        expect(res.json()).toMatchObject(entity.personalUser.match({
            first_name: body.firstName,
            last_name: body.lastName,
            email: body.email,
        }));
        assert.accessToken(res);
        assert.refreshToken(res);
    });

    it("doesn't allow to sign up with the same email", async () => {
        const server = await buildTestServer();
        await server.inject({
            method: "POST",
            path: "/api/v1/auth/sign-up",
            body,
        });
        const res = await server.inject({
            method: "POST",
            path: "/api/v1/auth/sign-up",
            body,
        });
        expect(res.statusCode).toBe(500);
    });
});

describe("POST /api/v1/auth/sign-in", () => {
    const body: SignInBody = {
        email: TEST_USER_EMAIL,
        password: TEST_USER_PASS,
    };

    it("sings in and returns authorization tokens", async () => {
        const server = await buildTestServer();
        const res = await server.inject({
            method: "POST",
            path: "/api/v1/auth/sign-in",
            body,
        });
        assert.accessToken(res);
        assert.refreshToken(res);
    });

    it("checks if email and passwords are correct", async () => {
        const bodies: SignInBody[] = [
            { email: "fake@example.com", password: faker.internet.password() },
            { email: TEST_USER_EMAIL, password: faker.internet.password() },
        ];
        const server = await buildTestServer();

        for (const body of bodies) {
            const res = await server.inject({
                method: "POST",
                path: "/api/v1/auth/sign-in",
                body
            });

            expect(res.statusCode).toBe(400);
            expect(res.error?.message).toBe("Invalid email or password");
        }
    });
});

describe("POST /api/v1/auth/refresh", () => {
    it("returns new authorizations tokens", async () => {
        const server = await buildTestServer();
        const res = await server.injectAuthed({
            method: "POST",
            path: "/api/v1/auth/refresh",
        });
        assert.accessToken(res);
        assert.refreshToken(res);
    });

    it("checks if refresh token is present", async () => {
        const server = await buildTestServer();
        const res = await server.injectAuthed({
            method: "POST",
            path: "/api/v1/auth/refresh",
            auth: {
                refreshToken: ""
            }
        });
        
        expect(res.statusCode).toBe(400);
        expect(res.error?.message).toBe("No refresh token");
    });

    it("doesn't allow to reuse the same refresh token", async () => {
        const server = await buildTestServer();
        const { refreshToken } = await server.signIn();

        await server.inject({
            method: "POST",
            path: "/api/v1/auth/refresh",
            auth: { refreshToken }
        });
        const res = await server.inject({
            method: "POST",
            path: "/api/v1/auth/refresh",
            auth: { refreshToken }
        });
        
        expect(res.statusCode).toBe(400);
        expect(res.error?.message).toBe("Token has been already used");
    });
});

