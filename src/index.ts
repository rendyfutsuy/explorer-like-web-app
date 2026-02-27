import { Elysia } from "elysia";
import { registerFolderController } from "./infrastructure/http/folder.controller";

const port = Number(Bun.env.PORT ?? process.env.PORT ?? 3000);
const app = new Elysia();
registerFolderController(app);
app.get("/", () => "Hello Elysia").listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
