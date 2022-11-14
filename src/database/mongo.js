const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017/";

const { dbName } = require("../config");
// const dbName = "express_server";

const { ObjectId } = require("mongodb");
const Response = require("../beans/Response");

/* 获取指定的集合对象 */
function getCollection(dbName, collectionName) {
  return new Promise((resolve) => {
    /* Promise的任务内容 */
    MongoClient.connect(
      url,

      /* 异步回调函数 */
      function (err, conn) {
        if (err) {
          resolve({
            err,
          });
          conn.close();
          return;
        }

        var db = conn.db(dbName);

        /* 插入用户记录 */
        const collection = db.collection(collectionName);
        // onCollection(collection, conn);
        resolve({
          collection,
          conn,
        });
      }
    );
  });
}

function doCreate(collectionName, data) {
  console.log("doCreate");

  return new Promise((resolve, reject) => {
    // 尝试连接指定collection
    getCollection(dbName, collectionName).then(({ err, collection, conn }) => {
      if (err) {
        resolve({
          msg: "连接数据库失败",
          err,
        });
        return;
      }

      collection.insertOne(
        data,

        // 操作的回调函数
        function (err, result) {
          if (err) {
            resolve({
              msg: "插入数据失败",
              err,
            });
          } else {
            resolve({
              msg: "插入数据成功",
              result,
            });
          }

          // 关闭数据库连接
          conn.close();
        }
      );
    });
  });
}

function doCreateMany(collectionName, data) {
  console.log("doCreateMany");

  return new Promise((resolve, reject) => {
    // 尝试连接指定collection
    getCollection(dbName, collectionName).then(({ err, collection, conn }) => {
      if (err) {
        resolve({
          msg: "连接数据库失败",
          err,
        });
        return;
      }

      collection.insertMany(
        data,

        // 操作的回调函数
        function (err, result) {
          if (err) {
            resolve({
              msg: "插入数据失败",
              err,
            });
          } else {
            resolve({
              msg: "插入数据成功",
              result,
            });
          }

          // 关闭数据库连接
          conn.close();
        }
      );
    });
  });
}

async function doDelete(id, collectionName) {
  return new Promise(
    /* 执行器函数 */
    async (resolve) => {
      // 死等一直到获取到collection
      const { err, collection, conn } = await getCollection(
        dbName,
        collectionName
      );

      /*  */
      if (err) {
        return new Response("连接数据库失败", err);
      }

      collection.deleteMany(
        { _id: new ObjectId(id) },

        /* 删除结果回调 */
        function (err, ret) {
          resolve(
            new Response(err ? "删除数据失败" : "删除数据成功", err, ret)
          );
          conn.close();
        }
      );
    }
  );
}

/* 通用更新方法 */
function doUpdate(id, data, collectionName) {
  return new Promise((resolve) => {
    getCollection(dbName, collectionName).then(({ err, collection, conn }) => {
      if (err) {
        // 在then回调里return什么就是履约什么
        return new Response("连接数据库失败", err);
      }

      collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: data },

        /* 更新结果回调 */
        function (err, ret) {
          conn.close();
          resolve(
            new Response(err ? "更新数据失败" : "更新数据成功", err, ret)
          );
        }
      );
    });
  });
}

function doRetrieve(collectionName, whereOptions) {
  /* 返回一个Promise */
  return new Promise((resolve) => {
    getCollection(dbName, collectionName).then(
      // 拿到履约的数据
      ({ err, collection, conn }) => {
        if (err) {
          resolve({
            msg: "查询数据失败",
            err,
          });
          return;
        }

        //控制层传递过来的查询条件
        collection.find(whereOptions).toArray(function (err, arr) {
          // 返回集合中所有数据
          if (err) {
            resolve({
              msg: "查询数据库失败",
              err,
              users: [],
            });
          } else {
            resolve({
              msg: "数据查询成功",
              arr,
              err,
            });
          }

          // 关闭数据库连接
          conn.close();
        });
      }
    );
  });
}

module.exports = {
  doCreate,
  doCreateMany,
  doDelete,
  doUpdate,
  doRetrieve,
};
