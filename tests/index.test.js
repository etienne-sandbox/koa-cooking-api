import { createApp } from "../src/app";
import supertest from "supertest";
import { knex } from "../src/database/connexion";

let request, server;

beforeAll(async () => {
  const app = await createApp();
  server = app.listen();
  request = supertest.agent(server);
});

test("/ should return object", async () => {
  const res = await request.get("/").expect(200);
  expect(res.body).toEqual({ hello: "world" });
});

test("/ingredients should return list of objects", async () => {
  const res = await request.get("/ingredients").expect(200);
  expect(Array.isArray(res.body)).toBeTruthy();
});

afterAll(() => {
  server.close();
  knex.destroy();
});
