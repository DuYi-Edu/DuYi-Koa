const fs = require("fs");
const path = require("path");
const mime = require("mime");

// 用于获取文件路径
async function getFileName(urlPath, root) {
  const subPath = urlPath.substr(1);
  const filename = path.resolve(root, subPath);
  try {
    const stat = await fs.promises.stat(filename);
    if (stat.isDirectory()) {
      // 是目录
      const newUrlPath = path.join(urlPath, "index.html");
      return await getFileName(newUrlPath, root);
    } else {
      return filename;
    }
  } catch {
    return null;
  }
}

module.exports = function (root) {
  return async function (ctx, next) {
    if (ctx.method !== "GET") {
      await next();
      return;
    }
    const filename = await getFileName(ctx.path, root);
    if (!filename) {
      // 文件不存在
      await next();
      return;
    }
    // 得到文件内容
    ctx.body = fs.createReadStream(filename);
    ctx.type = mime.getType(filename);
  };
};
