import httpErrors from "http-errors";

export function validateZod(schema, body) {
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
