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
app.get("/assets/rendy.jpeg", () => {
  const file = Bun.file(new URL("../../frontend/public/rendy.jpeg", import.meta.url))
  return new Response(file, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=86400"
    }
  })
})
app.get("/assets/elysia_v.webp", () => {
  const file = Bun.file(new URL("../../frontend/public/elysia_v.webp", import.meta.url))
  return new Response(file, {
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=86400"
    }
  })
})
app.get("/assets/elysia.png", () => {
  const file = Bun.file(new URL("../../frontend/public/elysia.png", import.meta.url))
  return new Response(file, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400"
    }
  })
})
app.get("/", () => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Explorer API x Elysia.js</title>
  <link rel="icon" href="/assets/elysia.png">
  <style>
    :root {
      --accent: #f9a8d4;
      --accent-soft: #fee4f2;
      --violet-400: #a78bfa;
      --bg: #fff9fb;
      --bg-strong: #ffe4f1;
      --text: #3f3d56;
      --muted: #9f7a9b;
      --card: #ffffff;
    }
    * { box-sizing: border-box; }
    html, body { height: 100%; }
    body {
      margin: 0;
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
      background:
        radial-gradient(900px 480px at 80% -120px, rgba(249,168,212,0.4), transparent 60%),
        radial-gradient(700px 420px at 10% 120%, rgba(255,228,241,0.9), transparent 70%),
        var(--bg);
      color: var(--text);
    }
    .container { max-width: 1040px; margin: 0 auto; padding: 32px 20px 64px; }
    .nav {
      display: flex; align-items: center; justify-content: space-between;
      padding: 12px 0; margin-bottom: 12px;
    }
    .brand { display: inline-flex; align-items: center; gap: 10px; font-weight: 700; letter-spacing: 0.2px; text-decoration: none; color: inherit; }
    .brand-logo { height: 60px; }
    .links { display: flex; gap: 14px; }
    .link {
      color: var(--muted); text-decoration: none; opacity: 0.9;
    }
    .link:hover { opacity: 1; color: var(--text); }
    .hero {
      display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 28px; align-items: center;
      padding: 24px 0 24px;
    }
    .title {
      font-size: clamp(28px, 5vw, 46px);
      line-height: 1.05;
      margin: 0 0 12px;
      letter-spacing: -0.5px;
      background-image: linear-gradient(to right, var(--accent), var(--violet-400));
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .subtitle { color: var(--muted); font-size: 16px; margin-bottom: 18px; }
    .actions { display: flex; gap: 12px; flex-wrap: wrap; }
    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 10px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.12);
      color: var(--text); text-decoration: none;
      background: linear-gradient(180deg, rgba(249,168,212,0.9), rgba(249,168,212,0.65));
      box-shadow: 0 10px 24px rgba(249,168,212,0.45);
      color: white;
      font-weight: 600;
    }
    .card {
      background: radial-gradient(circle at top left, rgba(249,168,212,0.16), transparent 55%), var(--card);
      border: 1px solid rgba(249,168,212,0.32);
      border-radius: 14px; padding: 14px 16px;
    }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 24px; }
    .mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; font-size: 12px; color: #d4d9e3; }
    .api-doc {
      position: fixed; right: 16px; bottom: 16px;
      width: 44px; height: 44px;
      border-radius: 999px;
      background: rgba(255,255,255,0.75);
      border: 1px solid rgba(249,168,212,0.5);
      box-shadow: 0 10px 26px rgba(249,168,212,0.45);
      display: flex; align-items: center; justify-content: center;
      text-decoration: none;
      overflow: hidden;
    }
    .api-doc img { width: 100%; height: 100%; object-fit: cover; }
    @media (max-width: 840px) { .hero { grid-template-columns: 1fr; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="nav">
      <a class="brand" href="https://elysiajs.com/" target="_blank" rel="noopener">
        <img class="brand-logo" alt="Elysia Logo" src="/assets/elysia_v.webp" />
      </a>
    </div>
    <div class="hero">
      <div>
        <h2 class="title">Ergonomic Framework for Humans</h2>
        <p class="subtitle">API ini menggunakan Elysia.js sebagai framework backend.</p>
        <div class="actions">
          <a class="btn" href="/swagger" target="_blank" rel="noopener">Open API Docs</a>
        </div>
      </div>
    </div>
  </div>
  <a class="api-doc" href="https://github.com/rendyfutsuy" title="GitHub" target="_blank" rel="noopener">
    <img alt="GitHub" src="/assets/rendy.jpeg" />
  </a>
</body>
</html>`
  return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } })
}).listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
