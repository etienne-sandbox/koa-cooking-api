import { knex } from "./connexion.js";
import { createIngredientId, createUserToken } from "./utils.js";
import { hash, compare } from "bcrypt";

// data: { name, unit?, price }
export async function insertIngredient(data) {
  const id = createIngredientId();
  await knex.table("ingredients").insert({
    id: id,
    name: data.name,
    unit: data.unit ?? null,
    price: data.price,
  });
  return id;
}

export async function findAllIngredients() {
  return knex.select("*").from("ingredients");
}

export async function insertUser(username, password) {
  const passwordHash = await hash(password, 10);
  const token = createUserToken();
  await knex.table("users").insert({
    username,
    password: passwordHash,
    token,
  });
  return token;
}

export async function findUserByToken(token) {
  const user = (
    await knex.select("*").from("users").where("token", token).limit(1)
  )[0];
  return user
    ? {
        username: user.username,
        token: user.token,
      }
    : null;
}

export async function findUserByUsernamePassword(username, password) {
  const user = (
    await knex.select("*").from("users").where("username", username).limit(1)
  )[0];
  if (user) {
    const validPassword = await compare(password, user.password);
    if (validPassword) {
      return {
        username: user.username,
        token: user.token,
      };
    }
  }
  return null;
}
