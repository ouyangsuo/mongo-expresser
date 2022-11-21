const path = require("path");
const fs = require("fs");

/* 常用文件目录 */
// 静态资源目录 = 根目录下的public文件夹
const publicPath = path.resolve("public");

// 上传目录 = 静态资源目录/upload
const uploadPath = path.join(publicPath, "upload");

// 临时文件目录 = 根目录/temp
const tempPath = path.resolve("temp");

/* 读入配置文件：数据库名称 jwt秘钥 token有效期 运行端口 模块定义 */
// import { dbName, jwtSecret, tokenAge, port, routes } from "../project.config.json"
const { dbName, jwtSecret, tokenAge, port, routes } = JSON.parse(
  fs.readFileSync(path.resolve("project.config.json"))
);

/* 导出所有配置 */
module.exports = {
  dbName,
  jwtSecret,
  tokenAge,
  port,
  routes,
  publicPath,
  uploadPath,
  tempPath,
};
