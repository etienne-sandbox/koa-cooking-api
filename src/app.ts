import Koa from "koa";
import errorHandler from "koa-error";
import bodyparser from "koa-bodyparser";
import { ingredientsRouter } from "./routes/ingredientsRoutes.js";
import { recipesRouter } from "./routes/recipesRoutes.js";
import { usersRouter } from "./routes/usersRoutes.js";
import Router from "@koa/router";
import { setupDatabase } from "./database/setup.js";
import { authenticated } from "./middlewares/authenticated.js";

export async function createApp() {
  await setupDatabase();

  const app = new Koa();

  app.use(errorHandler());
  app.use(bodyparser());

  const router = new Router();

  router.use(
    "/recipes",
    authenticated,
    recipesRouter.routes(),
    recipesRouter.allowedMethods()
  );
  router.use(
    "/ingredients",
    ingredientsRouter.routes(),
    ingredientsRouter.allowedMethods()
  );
  router.use("/users", usersRouter.routes(), usersRouter.allowedMethods());

  router.get("/", async (ctx) => {
    ctx.body = { hello: "world" };
  });

  app.use(router.routes());
  app.use(router.allowedMethods());

  return app;
}
