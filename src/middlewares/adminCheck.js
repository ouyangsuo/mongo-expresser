const Response = require("../beans/Response")
const JWT = require("../utils/jwt")

/* 从请求中获取token */
const regToken = /Bearer (.*)/;
const getToken = (req) => {
  let token = req.headers["authorization"];
  if (token) {
    token = regToken.exec(token)[1];
  }

  console.log("getToken", token);
  return token;
};

const isAdmin = (token) => {
  const payload = JWT.verify(token);
  console.log("adminCheck:token/payload", token, payload);

  if (!payload) {
    return false;
  }
  const { admin } = payload;
  return admin === true;
};

const adminCheck = (req, resp, next) => {
  /* 提取token */
  const token = getToken(req)

  /* 从token中得知是否管理员 */
  /* 如果是管理员next 否则直接返回响应 */
  if(isAdmin(token)){
      next()
  }else{
      resp.json(
          new Response("权限不足")
      )
  }

};

module.exports = adminCheck;
