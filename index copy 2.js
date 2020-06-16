const Koa = require("koa");
const app = new Koa();

app.use(function (ctx, next) {
  // url: /news/index.html
  // ctx.request.url = "/";
  // console.log("url", ctx.request.url);
  // console.log("originalUrl", ctx.request.originalUrl);
  // console.log("origin", ctx.request.origin);
  // console.log("href", ctx.request.href);
  // console.log("path", ctx.request.path);
  // console.log("querystring", ctx.request.querystring);
  // console.log("search", ctx.request.search);
  // console.log("host", ctx.request.host);
  // console.log("hostname", ctx.request.hostname);
  // console.log("URL", ctx.request.URL);

  // ctx.response.status = 200;
  // ctx.response.message = "asdfasfdsaf";

  // ctx.response.body = {
  //   a: 1,
  //   b: 2,
  // };
});

app.listen(9527, () => {
  console.log("server listening");
});
