import httpErrors from "http-errors";
import { Schema } from "zod";

export function validateZod<T>(schema: Schema<T>, body: unknown): T {
  const parsed = schema.safeParse(body);
  if (parsed.success === false) {
    const errorsText = Object.entries(parsed.error.flatten().fieldErrors)
      .map(([key, message]) => {
        return `${key}: ${message}`;
      })
      .join("\n");
    throw new httpErrors.BadRequest(`Body error: ${errorsText}`);
  }
  return parsed.data;
}
