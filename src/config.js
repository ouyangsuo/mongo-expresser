const path = require("path");
const fs = require("fs");

const publicPath = path.resolve("public");
const uploadPath = path.join(publicPath, "upload");
const tempPath = path.resolve("temp");

/* 读入配置 */
const { dbName, jwtSecret } = JSON.parse(
  fs.readFileSync(path.resolve("project.config.json"))
);

module.exports = {
  dbName,
  jwtSecret,
  publicPath,
  uploadPath,
  tempPath,
};