const express = require("express");
const { ObjectId } = require("mongodb");
const {
  doCreate,
  doCreateMany,
  doDelete,
  doUpdate,
  doRetrieve,
} = require("../database/mongo");

/* 导入鉴权中间件 */
const loginCheck = require("../middlewares/loginCheck");
const adminCheck = require("../middlewares/adminCheck");

/* 中间件速查表 */
const middlewares = {
  loginCheck,
  adminCheck,
};

// app.use(`/film`,RouterGenerator.from("film",middlewares).generate())
/* 
RouterGenerator.from("film",middlewares)// 返回一个（为xxRouter准备好了前缀 + CRUD系列接口的中间件列表）的实例
.generate() //生成xxRouter
*/
class RouterGenerator {

  /* 静态方法中的this为当前类 */
  static from(collectionName, middlewares = null) {
    // this.collectionName = jsonTemplateName

    return Object.assign(
      // 创建一个空实例，在实例的地址中覆盖一些新配置
      new RouterGenerator(), //实例

      /* 在上述地址中覆盖配置 */
      {
        //实例.collectionName = "file"
        collectionName, 

        /* 
        实例.middlewares = {
          // 给单个添加声明好中间件
          create:[adminCheck,loginCheck]

          ...其它接口及其中间件列表
        }
        */
        middlewares: this.applyMiddlewares(middlewares),
      }
    );
  }

  /* 
  _middlewares定义了每个CRUD接口的中间件列表
  {
      "create": ["adminCheck"],
      "createMany": ["adminCheck"],
      "retrieve": [],
      "retrieveMany": [],
      "update": ["adminCheck"],
      "delete": ["adminCheck"]
  }
  将上面的对象中的中间件名称映射为真正的中间件实体
  {
      "create": [adminCheck],
      "createMany": [adminCheck],
      "retrieve": [],
      "retrieveMany": [],
      "update": [adminCheck],
      "delete": [adminCheck]
  }
  */
  static applyMiddlewares(_middlewares) {
    for (let key in _middlewares) {

      // ["loginCheck","adminCheck",...]
      let names = _middlewares[key];
      // console.log("names=",names);

      // 将名字映射为中间件 配置回去
      _middlewares[key] = names.map(
        // 中间件名字 => 真正的中间件
        (name) => middlewares[name]
      );
    }

    // {loginCheck,adminCheck,...}
    return _middlewares;
  }

  /* 实例方法：生成xxRouter */
  generate() {
    // 创建filmRouter
    const router = express.Router();

    /* 在filmRouter身上添加了CRUD接口*6 */

    // POST /film/0 = 添加单个film
    // create: [loginCheck,adminCheck,...],
    router.post(
      // /film/0路由
      "/0", 

      // 一堆中间件
      ...this.middlewares?.create, 

      // 真正的业务处理器
      async (req, resp) => {
        // View层直接调用MVCD中的Database引擎层 将请求体数据数据插入数据库
        const result = await doCreate(this.collectionName, req.body);

        // 数据库的操作结果直接返回客户端
        resp.json(result);
      }
    );

    /* POST /film/-1 = 批量插入film */
    router.post("/-1", ...this.middlewares?.createMany, async (req, resp) => {
      const result = await doCreateMany(this.collectionName, req.body);
      resp.json(result);
    });

    /* DELETE /film/:id = 删除单个film */
    router.delete("/:id", ...this.middlewares?.delete, async (req, resp) => {
      const result = await doDelete(req.params.id, this.collectionName);
      resp.json(result);
    });

    /* PUT /film/:id = 修改单个film */
    router.put("/:id", ...this.middlewares?.update, async (req, resp) => {
      const result = await doUpdate(
        req.params.id,
        req.body,
        this.collectionName
      );
      resp.json(result);
    });

    /* GET /film/0 = 查询所有film */
    router.get("/0", ...this.middlewares?.retrieveMany, async (req, resp) => {
      const result = await doRetrieve(this.collectionName, {});
      resp.json(result);
    });

    /* GET /film/:id = 查询单个film详情 */
    router.get("/:id", ...this.middlewares?.retrieve, async (req, resp) => {
      const result = await doRetrieve(this.collectionName, {
        _id: new ObjectId(req.params.id),
      });
      resp.json(result);
    });

    // 返回配置好了CURD接口的filmRouter
    return router;
  }
}

module.exports = RouterGenerator;
