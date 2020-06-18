const Koa = require("koa");
const app = new Koa();
const { createProxyMiddleware } = require("http-proxy-middleware");
const c2k = require("koa-connect")

app.use(require("./routes/user"));
app.use(
  c2k(createProxyMiddleware("/api", {
    target: "http://yuanjin.tech:5100",
  }))
);
app.listen(9527, () => {
  console.log("server listening");
});
