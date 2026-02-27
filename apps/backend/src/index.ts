import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { registerFolderController } from "./infrastructure/http/folder.controller";

const port = Number(Bun.env.PORT ?? process.env.PORT ?? 3000);
const app = new Elysia();
app.use(cors());
registerFolderController(app);
app.get("/", () => "Hello Elysia").listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
