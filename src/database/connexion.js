import { resolve } from "node:path";
import Knex from "knex";

export const SQLITE_FILE_PATH = resolve("data", "database.sqlite");

export const knex = Knex({
  client: "better-sqlite3",
  connection: {
    filename: SQLITE_FILE_PATH,
  },
  useNullAsDefault: true,
});
