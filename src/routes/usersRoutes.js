import Router from "@koa/router";
import { z } from "zod";
import { validateZod } from "../utils.js";
import { insertUser, findUserByUsernamePassword } from "../database/index.js";
import httpErrors from "http-errors";
import { authenticated } from "../middlewares/authenticated.js";

export const usersRouter = new Router();

usersRouter.get("/", async (ctx) => {
  ctx.body = { users: true };
});

const SignupBodySchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(4),
});

usersRouter.post("/signup", async (ctx) => {
  const data = validateZod(SignupBodySchema, ctx.request.body);
  const token = await insertUser(data.username, data.password);
  ctx.status = 201;
  ctx.body = { token };
});

const LoginBodySchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty(),
});

usersRouter.post("/login", async (ctx) => {
  const data = validateZod(LoginBodySchema, ctx.request.body);
  const user = await findUserByUsernamePassword(data.username, data.password);
  if (!user) {
    throw new httpErrors.BadRequest(`Invalid username/password`);
  }
  ctx.body = user;
});

usersRouter.get("/me", authenticated(), async (ctx) => {
  ctx.body = ctx.user;
});

const paulOnlyAuthenticated = authenticated({ allowOnlyUsername: ["paul"] });

usersRouter.get("/admin", paulOnlyAuthenticated, async (ctx) => {
  ctx.body = { secret: "Bla bla bla, very secret !" };
});
