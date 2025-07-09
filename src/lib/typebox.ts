import { FormatRegistry } from "@sinclair/typebox";

export function configureTypebox() {
    // TODO: add formats
    FormatRegistry.Set("email", () => true);
    FormatRegistry.Set("date", () => true);
}

