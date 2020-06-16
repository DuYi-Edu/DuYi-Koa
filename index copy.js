const Koa = require("koa");
const app = new Koa();
const http = require("http");

const server = http.createServer(app.callback());


server.listen(9527, () => {
  console.log("server listening");
});
