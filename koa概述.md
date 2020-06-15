# 什么是Koa

官网：https://koajs.com/

民间中文网：https://koa.bootcss.com/

Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 为搭建web服务器提供**更轻量**、**更优雅**的方案。

Koa目前的版本是`koa2`

# 对比 Express



## 更轻量

在`express`的基础上进一步简化了框架

这些简化表现在下面两个方面：

- `koa`没有内置的中间件
- `koa`不提供路由匹配



## 更合理的对象结构

`express`的主要操作对象有`app`、`req`、`res`，它们的逻辑关系如下：

<img src="http://mdrs.yuanjin.tech/img/image-20200615132605132.png" alt="image-20200615132605132" style="zoom:50%;" />

而在`koa`中，它的主要操作对象有`app`、`context`、`request`、`response`，它们的逻辑关系如下：

<img src="http://mdrs.yuanjin.tech/img/image-20200615132844959.png" alt="image-20200615132844959" style="zoom:50%;" />

## 更友好的中间件支持

**`koa`最大的优势，就是它支持异步中间件，从而提供了基于合理的中间件模型**

```js
// express 的中间件示例
function delay(duration){
  return new Promise(resolve=>{
    setTimeout(()=>{
      resolve();
    }, duration)
  })
}
// 中间件1
app.use(function(req, res, next){
  console.log(1);
  next();
  console.log(4);
})

// 中间件2
app.use(async function(req, res, next){
  console.log(2);
  await delay(1000);
  console.log(3);
})

// 得到的结果：1 2 4 3
```

<img src="http://mdrs.yuanjin.tech/img/image-20200615134901284.png" alt="image-20200615134901284" style="zoom:50%;" />

这会导致一系列的问题

而`koa`是真正支持异步的中间件模型

```js
// koa 的中间件示例
function delay(duration){
  return new Promise(resolve=>{
    setTimeout(()=>{
      resolve();
    }, duration)
  })
}
// 中间件1
app.use(async function(ctx, next){
  console.log(1);
  await next();
  console.log(4);
})

// 中间件2
app.use(async function(req, res, next){
  console.log(2);
  await delay(1000);
  console.log(3);
})

// 得到的结果：1 2 3 4
```

<img src="http://mdrs.yuanjin.tech/img/image-20200615134918087.png" alt="image-20200615134918087" style="zoom:50%;" />

可以看到，对于每个中间件，在完成了一些事情后，可以非常优雅的将控制权传递给下一个中间件，**并能够等待它完成**，当后续的中间件完成处理后，控制权又回到了自己，这种中间件模型称之为洋葱模型

![clipboard.png](http://mdrs.yuanjin.tech/img/bV6DZG.png)