import { validateZod } from "../src/utils";
import { z } from "zod";

test("validateZod should return data when valid", () => {
  const schema = z.object({ name: z.string() });

  expect(validateZod(schema, { name: "Hello" })).toEqual({ name: "Hello" });
});

test("validateZod should throw when invalid data", () => {
  const schema = z.object({ name: z.number() });

  expect(() => validateZod(schema, {})).toThrow();
});
