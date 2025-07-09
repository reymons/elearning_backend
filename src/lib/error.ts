import { Type } from "@sinclair/typebox";

export class CORSError extends Error {}

export const errorSchema = Type.Object({
    message: Type.String()
});
