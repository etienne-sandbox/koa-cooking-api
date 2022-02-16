import { knex } from "./connexion.js";
import { createIngredientId, createUserToken } from "./utils.js";
import { hash, compare } from "bcrypt";

export async function insertIngredient(data: {
  name: string;
  price: number;
  unit?: string | null;
}): Promise<string> {
  const id = createIngredientId();
  await knex.table("ingredients").insert({
    id: id,
    name: data.name,
    unit: data.unit ?? null,
    price: data.price,
  });
  return id;
}

type Ingredient = {
  id: string;
  name: string;
  unit: string | null;
  price: number | null;
};

export async function findAllIngredients(): Promise<Array<Ingredient>> {
  return knex.select("*").from("ingredients");
}

export async function insertUser(
  username: string,
  password: string
): Promise<string> {
  const passwordHash = await hash(password, 10);
  const token = createUserToken();
  await knex.table("users").insert({
    username,
    password: passwordHash,
    token,
  });
  return token;
}

type User = {
  username: string;
  token: string;
};

export async function findUserByToken(token: string): Promise<User | null> {
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

export async function findUserByUsernamePassword(
  username: string,
  password: string
): Promise<User | null> {
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
