import Router from "@koa/router";
import { findAllIngredients, insertIngredient } from "../database/index.js";
import { z } from "zod";
import { validateZod } from "../utils.js";
import { authenticated } from "../middlewares/authenticated.js";

export const ingredientsRouter = new Router();

ingredientsRouter.get("/", authenticated(), async (ctx) => {
  const ingredients = await findAllIngredients();
  ctx.body = ingredients;
});

const PostSchema = z.object({
  name: z.string(),
  unit: z
    .union([z.literal("kg"), z.literal("litre")])
    .nullable()
    .optional(),
  price: z.number().positive(),
});

ingredientsRouter.post("/", authenticated(), async (ctx) => {
  const data = validateZod(PostSchema, ctx.request.body);
  const id = await insertIngredient(data);
  ctx.status = 201;
  ctx.body = { id };
});

ingredientsRouter.put("/:ingredientId", authenticated(), async () => {
  // update ingredient
});

ingredientsRouter.delete("/:ingredientId", authenticated(), async () => {
  // remove ingredient
});
