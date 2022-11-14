const { getUsers, addUser } = require("../models/userModel");
const JWT = require("../utils/jwt")

/* 控制层的方法命名都是典型的业务逻辑命名 */
/* 注册 */
async function register(user) {
  // 拿到视图层传递过来的用户名和密码
  const { username, password } = user;

  // 调用模型层的查询方法看看用户名是否被占用
  const { msg, err, arr: users } = await getUsers({ username });

  if (!err) {
    if (!users.length) {
      // 如果未被占用 就继续调用模型层的插入方法插入用户数据
      const { err, msg, result } = await addUser(user);

      // 将模型层的插入结果丢还视图层
      return {
        msg: err ? "注册失败：插入用户失败" : "注册成功",
        err,
        result,
      };
    } else {
      return {
        msg: "注册失败：用户名被占用",
      };
    }
  } else {
    // async函数中的return具体数据 就相当于履约
    return {
      msg: "注册失败：数据库操作失败",
      err,
    };
  }

}

/* 注销 */
function unregister(uid) {}

/* 修改用户信息 */
function updateUser(uid, user) {}

/* 登录 */
async function login(user) {
  // 拿到视图层传递过来的用户名和密码
  const { username, password } = user;

  /* 查询username和password对应的用户是否存在 */
  // 解构arr时取别名为users
  const { msg, err, arr: users } = await getUsers({ username, password });

  // 根据查询结果向视图层返回数据
  const result = {
    msg: users.length ? "登录成功" : "用户名或密码错误",
    err,
    users,
  };

  /* 一旦登录成功就给客户端发一个token */
  if (users.length) {
    const token = JWT.generate(
      { username, password, admin: users[0].admin },
      "60s"
    );
    // result.token = token
    Object.assign(result, { token });
  }

  // 在异步函数中return什么就相当于履约什么
  // 代码写法和在promise.then中的写法一样
  // 将结果履约给视图层
  return result;
}

/* 查询所有用户 */
function getAllUsers() {}

module.exports = {
  register,
  unregister,
  updateUser,
  login,
  getAllUsers,
};
