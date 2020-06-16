const Koa = require("koa");
const koaStatic = require("./koa-static");
const path = require("path");
const app = new Koa();
app.use(require("./koa-fallback"));
app.use(koaStatic(path.resolve(__dirname, "public")));

app.listen(9527, () => {
  console.log("server listening");
});
