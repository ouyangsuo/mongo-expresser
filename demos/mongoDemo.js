/* 连接数据库 */
function demoConnectMongo() {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/express_server";

  MongoClient.connect(url, function (err, db) {
    if (err) {
      console.log("连接失败", err);
    } else {
      console.log("数据库已创建!");
      db.close();
    }
  });
}
// demoConnectMongo();

/* 插入一条数据 */
function insertOne() {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(
    url,

    // err=错误信息 conn=MongoDB的连接对象
    function (err, conn) {
      if (err) {
        console.log("连接失败", err);
        return;
      }

      var db = conn.db("express_server");
      db.collection("inventory").insertOne(
        { name: "手撕菜鸡", url: "www.shousiji.com" },

        // 操作的回调函数
        function (err, res) {
          if (err) {
            console.log("插入数据失败", err);
          } else {
            console.log("文档插入成功", res);
          }
          conn.close();
        }
      );
    }
  );
}

/* 插入多条数据 */
function insertMany() {
  var mongodb = require("mongodb");
  var MongoClient = mongodb.MongoClient;

  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, conn) {
    if (err) {
      console.log("连接失败", err);
      return;
    }

    var db = conn.db("express_server");

    db.collection("inventory").insertMany(
      [
        { item: "菜鸟工具", url: "https://c.runoob.com", type: "cn" },
        { item: "Google", url: "https://www.google.com", type: "en" },
        { item: "Facebook", url: "https://www.google.com", type: "en" },
      ],

      function (err, res) {
        if (err) {
          console.log("插入数据失败", err);
        } else {
          console.log("文档插入成功", res);
        }
        conn.close();
      }
    );
  });
}

/* 查询全部 */
function findAll() {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, conn) {
    if (err) throw err;
    var db = conn.db("express_server");
    db.collection("inventory")
      .find({})
      .toArray(function (err, result) {
        // 返回集合中所有数据
        if (err) throw err;
        console.log(result);
        conn.close();
      });
  });
}

/* 按条件查询 */
function findByCondition() {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, conn) {
    if (err) throw err;

    var db = conn.db("express_server");

    db.collection("inventory")
      .find({
        item: "card",
        // qty:{$gte:20,$lte:50}
        $or: [{ qty: { $lt: 20 } }, { qty: { $gte: 50 } }],
      })
      .toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
        conn.close();
      });
  });
}

/* 更新数据 */
function update() {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, conn) {
    if (err) throw err;
    var db = conn.db("express_server");

    // db.collection("inventory").updateOne(
    db.collection("inventory").updateMany(
      { item: "card" },
      { $set: { url: "https://www.localhost.com" } },
      function (err, res) {
        if (err) throw err;
        console.log("文档更新成功");
        conn.close();
      }
    );
  });
}

/* 删除一条数据 */
function deleteData() {
  var MongoClient = require("mongodb").MongoClient;
  var url = "mongodb://localhost:27017/";

  MongoClient.connect(url, function (err, conn) {
    if (err) throw err;
    var db = conn.db("express_server");

    // db.collection("inventory").deleteOne(
    db.collection("inventory").deleteMany(
      {item:"card"}, 
      function (err, obj) {
        if (err) throw err;
        console.log("文档删除成功");
        conn.close();
      }
    );
  });
}
