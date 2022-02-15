import process from "node:process";
import { createApp } from "./app";

createApp()
  .then((app) => {
    app.listen(3000, () => {
      console.log("Server is up on http://localhost:3000");
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
