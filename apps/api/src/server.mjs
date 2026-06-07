import { createServer } from "./app.mjs";

const port = Number(process.env.PORT ?? 8787);
const host = process.env.HOST ?? "127.0.0.1";
const server = createServer();

server.listen(port, host, () => {
  console.log(`Foobow API listening on http://${host}:${port}`);
});
