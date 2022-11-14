const express = require("express");
const { ObjectId } = require("mongodb");
const {
  doCreate,
  doCreateMany,
  doDelete,
  doUpdate,
  doRetrieve,
} = require("../database/mongo");

/* 鉴权中间件 */
const loginCheck = require("../middlewares/loginCheck");
const adminCheck = require("../middlewares/adminCheck");
const middlewares = {
  loginCheck,
  adminCheck,
};

// RouterGenerator.from("cinema").generate("express_server")
class RouterGenerator {
  static from(collectionName, middlewares = null) {
    // this.collectionName = jsonTemplateName

    return Object.assign(new RouterGenerator(), {
      collectionName,
      middlewares: this.applyMiddlewares(middlewares),
    });
  }

  static applyMiddlewares(_middlewares) {
    for (let key in _middlewares) {
      let names = _middlewares[key];
      // console.log("names=",names);
      _middlewares[key] = names.map((name) => middlewares[name]);
    }
    return _middlewares;
  }

  generate() {
    const router = express.Router();

    /* 在路由器身上添加CRUD */
    router.post("/0", ...this.middlewares?.create, async (req, resp) => {
      const result = await doCreate(this.collectionName, req.body);
      resp.json(result);
    });

    router.post("/-1", ...this.middlewares?.createMany, async (req, resp) => {
      const result = await doCreateMany(this.collectionName, req.body);
      resp.json(result);
    });

    router.delete("/:id", ...this.middlewares?.delete, async (req, resp) => {
      const result = await doDelete(req.params.id, this.collectionName);
      resp.json(result);
    });

    router.put("/:id", ...this.middlewares?.update, async (req, resp) => {
      const result = await doUpdate(
        req.params.id,
        req.body,
        this.collectionName
      );
      resp.json(result);
    });

    router.get("/0", ...this.middlewares?.retrieveMany, async (req, resp) => {
      const result = await doRetrieve(this.collectionName, {});
      resp.json(result);
    });

    router.get("/:id", ...this.middlewares?.retrieve, async (req, resp) => {
      const result = await doRetrieve(this.collectionName, {
        _id: new ObjectId(req.params.id),
      });
      resp.json(result);
    });

    return router;
  }
}

module.exports = RouterGenerator;
