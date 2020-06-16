module.exports = async function (ctx, next) {
  // ctx.path: /a     ctx.path: /index.html
  if (
    ctx.method === "GET" &&
    ctx.headers.accept.includes("text/html") &&
    !ctx.path.includes(".")
  ) {
    ctx.path = "/index.html";
  }
  await next();
};
