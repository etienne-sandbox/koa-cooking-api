import Router from "@koa/router";

export const recipesRouter = new Router();

recipesRouter.get("/", async (ctx) => {
  ctx.body = { recipes: true };
});
