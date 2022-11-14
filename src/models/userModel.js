const { doCreate, doRetrieve } = require("../database/mongo");
const collectionName = "user"

/* 模型层的函数命名都是CRUD风格 */

/* 添加用户（对接视图层的注册功能） */
function addUser(user) {
  return doCreate(collectionName,user)
}

/* 删除用户（对接视图层的注销功能） */
function removeUser(uid) {}

/* 修改用户信息（对接视图层的修改个人信息功能） */
function updateUser(uid, user) {}

/* 
查询用户列表（对接视图层的用户列表功能/管理员功能） 
whereOptions=查询条件
*/
function getUsers(whereOptions) {
  return doRetrieve(collectionName,whereOptions)
}

/* 查询单个用户信息（对接视图层的个人中心功能） */
function getUser(uid) {}

module.exports = {
  addUser,
  removeUser,
  updateUser,
  getUsers,
  getUser,
};
