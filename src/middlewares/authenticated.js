import httpErrors from "http-errors";
import { findUserByToken } from "../database/index.js";

// options: { allowOnlyUsername: ['user1', 'user2'] }
export function authenticated(options = {}) {
  return async function authenticatedMiddleware(ctx, next) {
    const authorization = ctx.get("Authorization");
    if (!authorization) {
      throw new httpErrors.Unauthorized();
    }
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer" || !token) {
      throw new httpErrors.Unauthorized();
    }
    const user = await findUserByToken(token);
    if (!user) {
      throw new httpErrors.Unauthorized();
    }
    if (options.allowOnlyUsername) {
      if (options.allowOnlyUsername.includes(user.username) === false) {
        throw new httpErrors.Unauthorized();
      }
    }
    ctx.user = user;
    return await next();
  };
}
