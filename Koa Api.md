# 创建 Koa 应用

```js
const Koa = require("koa");
const app = new Koa();
const http = require("http");
http.createServer(app.callback());

http.listen(port, callback);
```



```js
const Koa = require("koa");
const app = new Koa();

app.listen(port, callback);
```



# 注册中间件

```js
app.use(middleware1);
app.use(middleware2);
app.use(middleware3);
```



中间件的函数格式如下：

```js
function(ctx, next){
  // ctx 上下文对象
  // next 移交给下一个中间件的函数
}
```



# context

`context`中包含4个重要对象：

- `req`：`http`模块内置对象
- `res`：`http`模块内置对象
- `request`：`koa`封装的请求对象，用于获取请求传递的信息
- `response`：`koa`封装的响应对象，用户设置响应信息



## request

### request.header

请求头对象。这与 node [`http.IncomingMessage`](https://nodejs.org/api/http.html#http_class_http_incomingmessage) 上的 [`headers`](https://nodejs.org/api/http.html#http_message_headers) 字段相同

### request.header=

设置请求头对象。

### request.headers

请求头对象。别名为 `request.header`.

### request.headers=

设置请求头对象。别名为 `request.header=`.

### request.method

请求方法。

### request.method=

设置请求方法，对于实现诸如 `methodOverride()` 的中间件是有用的。

### request.length

返回以数字返回请求的 Content-Length，或 `undefined`。

### request.url

获取请求 URL.

### request.url=

设置请求 URL, 对 url 重写有用。

### request.originalUrl

获取请求原始URL。

### request.origin

获取URL的来源，包括 `protocol` 和 `host`。

```js
ctx.request.origin
// => http://example.com
```

### request.href

获取完整的请求URL，包括 `protocol`，`host` 和 `url`。

```js
ctx.request.href;
// => http://example.com/foo/bar?q=1
```

### request.path

获取请求路径名。

### request.path=

设置请求路径名，并在存在时保留查询字符串。

### request.querystring

根据 `?` 获取原始查询字符串.

### request.querystring=

设置原始查询字符串。

### request.search

使用 `?` 获取原始查询字符串。

### request.search=

设置原始查询字符串。

### request.host

存在时获取主机（hostname:port）。当 `app.proxy` 是 **true** 时支持 `X-Forwarded-Host`，否则使用 `Host`。

### request.hostname

存在时获取主机名。当 `app.proxy` 是 **true** 时支持 `X-Forwarded-Host`，否则使用 `Host`。

如果主机是 IPv6, Koa 解析到 [WHATWG URL API](https://nodejs.org/dist/latest-v8.x/docs/api/url.html#url_the_whatwg_url_api), *注意* 这可能会影响性能。

### request.URL

获取 WHATWG 解析的 URL 对象。

### request.type

获取请求 `Content-Type`, 不含 "charset" 等参数。

> 译者注: 这里其实是只获取 *mime-type*, 详见[源码及其注释](https://github.com/koajs/koa/blob/eda27608f7d39ede86d7b402aae64b1867ce31c6/lib/request.js#L639)

```js
const ct = ctx.request.type;
// => "image/png"
```

### request.charset

存在时获取请求字符集，或者 `undefined`：

```js
ctx.request.charset;
// => "utf-8"
```

### request.query

获取解析的查询字符串, 当没有查询字符串时，返回一个空对象。请注意，此 getter _不_ 支持嵌套解析。

例如 "color=blue&size=small":

```js
{
  color: 'blue',
  size: 'small'
}
```

### request.query=

将查询字符串设置为给定对象。 请注意，此 setter _不_ 支持嵌套对象。

```js
ctx.query = { next: '/login' };
```

### request.fresh

检查请求缓存是否“新鲜”，也就是内容没有改变。此方法用于 `If-None-Match` / `ETag`, 和 `If-Modified-Since` 和 `Last-Modified` 之间的缓存协商。 在设置一个或多个这些响应头后应该引用它。

```js
// 新鲜度检查需要状态20x或304
ctx.status = 200;
ctx.set('ETag', '123');

// 缓存是好的
if (ctx.fresh) {
  ctx.status = 304;
  return;
}

// 缓存是陈旧的
// 获取新数据
ctx.body = await db.find('something');
```

### request.stale

与 `request.fresh` 相反.

### request.protocol

返回请求协议，“https” 或 “http”。当 `app.proxy` 是 **true** 时支持 `X-Forwarded-Proto`。

### request.secure

通过 `ctx.protocol == "https"` 来检查请求是否通过 TLS 发出。

### request.ip

请求远程地址。 当 `app.proxy` 是 **true** 时支持 `X-Forwarded-Proto`。

### request.ips

当 `X-Forwarded-For` 存在并且 `app.proxy` 被启用时，这些 ips 的数组被返回，从上游 - >下游排序。 禁用时返回一个空数组。

例如，如果值是 "client, proxy1, proxy2"，将会得到数组 `["client", "proxy1", "proxy2"]`。

大多数反向代理（nginx）都通过 `proxy_add_x_forwarded_for` 设置了 x-forwarded-for，这带来了一定的安全风险。恶意攻击者可以通过伪造 `X-Forwarded-For` 请求头来伪造客户端的ip地址。 客户端发送的请求具有 'forged' 的 `X-Forwarded-For` 请求头。 在由反向代理转发之后，`request.ips` 将是 ['forged', 'client', 'proxy1', 'proxy2']。

Koa 提供了两种方式来避免被绕过。

如果您可以控制反向代理，则可以通过调整配置来避免绕过，或者使用 koa 提供的 `app.proxyIpHeader` 来避免读取 `x-forwarded-for` 获取 ips。

```js
const app = new Koa({
  proxy: true,
  proxyIpHeader: 'X-Real-IP',
});
```

如果您确切知道服务器前面有多少个反向代理，则可以通过配置 `app.maxIpsCount` 来避免读取用户的伪造的请求头：

```js
const app = new Koa({
  proxy: true,
  maxIpsCount: 1, // 服务器前只有一个代理
});

// request.header['X-Forwarded-For'] === [ '127.0.0.1', '127.0.0.2' ];
// ctx.ips === [ '127.0.0.2' ];
```

### request.subdomains

以数组形式返回子域。

子域是应用程序主域之前主机的点分隔部分。默认情况下，应用程序的域名假定为主机的最后两个部分。这可以通过设置 `app.subdomainOffset` 来更改。

例如，如果域名为“tobi.ferrets.example.com”：

如果 `app.subdomainOffset` 未设置, `ctx.subdomains` 是 `["ferrets", "tobi"]`. 如果 `app.subdomainOffset` 是 3, `ctx.subdomains` 是 `["tobi"]`.

### request.is(types...)

检查传入请求是否包含 `Content-Type` 消息头字段， 并且包含任意的 mime `type`。 如果没有请求主体，返回 `null`。 如果没有内容类型，或者匹配失败，则返回 `false`。 反之则返回匹配的 content-type。

