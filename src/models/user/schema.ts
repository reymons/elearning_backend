import { Static, Type } from "@sinclair/typebox";

export const personalUserSchema = Type.Object({
    id: Type.Number(),
    first_name: Type.String(),
    last_name: Type.String(),
    email: Type.String(),
    date_of_birth: Type.String(),
    created_at: Type.String(),
});

export type PersonalUser = Static<typeof personalUserSchema>;
