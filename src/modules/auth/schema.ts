import { Type as t, Static } from "@sinclair/typebox";

export const signUpSchema = t.Object({
    firstName: t.String(),
    lastName: t.String(),
    dateOfBirth: t.String({
        format: "date",
        minimumTimestamp: new Date("1920-01-01").getTime(),
    }),
    email: t.String({ format: "email" }),
    password: t.String({ minLength: 6, maxLength: 60 }),
});

export const signInSchema = t.Object({
    email: t.String(),
    password: t.String(),
});

export type SignInBody = Static<typeof signInSchema>;
export type SignUpBody = Static<typeof signUpSchema>;
