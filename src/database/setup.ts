import { knex, SQLITE_FILE_PATH } from "./connexion.js";
import fse from "fs-extra";
import { dirname } from "node:path";
import { createIngredientId } from "./utils.js";

export async function setupDatabase() {
  const dbAlreadyExists = fse.existsSync(SQLITE_FILE_PATH);

  await fse.ensureDir(dirname(SQLITE_FILE_PATH));

  if (!dbAlreadyExists) {
    console.log("Create tables");
    await knex.schema.createTable("ingredients", (ingredientTable) => {
      ingredientTable.text("id").primary().notNullable();
      ingredientTable.text("name").notNullable();
      ingredientTable.text("unit"); // kg
      ingredientTable.float("price"); // prix / kg
    });

    await knex.schema.createTable("users", (ingredientTable) => {
      ingredientTable.text("username").primary().notNullable();
      ingredientTable.text("password").notNullable();
      ingredientTable.text("token").notNullable();
    });

    await knex.table("ingredients").insert([
      { id: createIngredientId(), name: "Farine", unit: "kg", price: 1 },
      { id: createIngredientId(), name: "Oeufs", unit: null, price: 0.5 },
      { id: createIngredientId(), name: "Lait", unit: "litre", price: 1.05 },
    ]);
  }
}
