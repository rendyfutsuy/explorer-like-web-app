import { Elysia } from "elysia";
import cors from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { registerFolderController } from "./infrastructure/http/folder.controller";
import { registerItemController } from "./infrastructure/http/item.controller";

const port = Number(Bun.env.PORT ?? process.env.PORT ?? 3000);
const app = new Elysia();
app.use(cors());
app.use(swagger({ path: "/swagger" }));
registerFolderController(app);
registerItemController(app);
app.get("/", () => "Hello Elysia").listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
