// 引入express
const express = require("express");

// 导入控制层
const { register, login } = require("../controllers/userController");

// 创建路由处理器
const userRouter = express.Router();

// 添加 /register 路由处理
userRouter.post("/register", async (req, res) => {
  /* 拿到用户POST过来的请求体 然后插入一条用户记录 */
  const { username, password, admin } = req.body;

  // 调用控制层的注册方法 并将结果直接转发用户
  const result = await register({ username, password, admin });

  // 将控制层结果直接转发用户
  res.json(result);
});

// 添加 /login 路由处理
userRouter.post("/login", async (req, res) => {
  // res.send("login");
  // 拿到用户POST上来的用户名和密码
  const { username, password } = req.body;

  /* 将用户意图 + 用户数据 转发控制器/控制层 */
  // 坐等控制层的操作结果
  const result = await login({ username, password });

  // 直接将控制层的结果原样转发用户
  res.json(result);
});

// 导出路由处理器
module.exports = userRouter;
