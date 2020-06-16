> 官网：https://koajs.com/
>
> 民间中文网：https://koa.bootcss.com/

# 创建 Koa 应用

```js
const Koa = require("koa");
const app = new Koa();
const http = require("http");
const server = http.createServer(app.callback());

server.listen(port, callback);
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



`Koa`不建议你使用原生的对象，绝大部分情况下，都应该使用它封装的对象



## 响应流程

![image-20200616112945546](http://mdrs.yuanjin.tech/img/image-20200616112945546.png)

当给body赋值时，`Koa`会将status自动赋值为200或204



## 简化 api

为了方便使用，`Koa`将`request`和`response`中的很多成员提取到了`context`中，并使用访问器控制

## cookie

`Koa`原生支持`cookie`，不需要安装其他中间件

```js
ctx.cookies.set(name, value, [options]); // 设置cookie
ctx.cookies.get(name); // 获取cookie
```

`Koa`同样支持加密的`cookie`

```js
app.keys = ['im a newer secret', 'i like turtle']; // 加密的多个秘钥
ctx.cookies.set(name, value, { signed: true}); // 设置加密的cookie
ctx.cookies.get(name, {signed: true}); // 解密cookie
```

> `Koa`中的加密是利用第三方库[KeyGrip](https://github.com/jed/keygrip)完成的，该库使用多个秘钥，轮流用它们加密目标字符串，在解密时，选择合适的秘钥进行解密
>
> 这种叫做旋转加密的方式，更加难以破解。

## 自定义空间

有时，某些中间件希望添加一些额外的信息，以方便后续中间件处理，比如当前登录的用户信息

`Koa`建议把这些信息添加到`ctx.state`中

该属性默认是一个空对象，专门提供给中间件开发者添加额外信息的

## 错误处理

`Koa`实现了`EventEmitter`，因此，它是通过注册事件的方式处理错误的

```js
// 当中间件发生错误时，会抛出 error 事件
app.on("error", err=>{
  
})
```

你也可以手动的抛出该事件

```js
ctx.throw([status], [msg], [properties])
```



> 由于Koa实现了EventEmitter，除了错误处理之外，还可以利用它做别的事情