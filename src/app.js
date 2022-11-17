// 引入express
const express = require("express")
const multer = require("multer")
const path = require("path")
const fs = require("fs")

const RouterGenerator = require("./views/RouterGenerator")

/* 导入子模块路由处理器 */
const userRouter = require("./views/userRouter")
const fileRouter = require("./views/fileRouter")
const { port,routes } = require("./config")

// 创建应用实例
const app = express()

/* 配置中间件 */
app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(express.static(path.resolve("public")))
app.use(multer({dest:path.resolve("temp")}).array("file"))

/* 派发请求给路由器【中间件】 */
app.use("/user",userRouter)
app.use("/file",fileRouter)

// 读入JSON配置文件
// const config = JSON.parse(
//     fs.readFileSync(path.resolve("project.config.json"))
// )
// console.log("config=",config);
// console.log("config=",config.routes[1].middlewares.create);

// app.use("/cinema",RouterGenerator.from("cinema").generate("express_server"))
routes.forEach(
    ({name,middlewares})=>{
        app.use(`/${name}`,RouterGenerator.from(name,middlewares).generate("express_server"))
    }
)

// 将应用实例app挂载监听在8002端口
const server = app.listen(
    port,
    ()=>{
        const host = server.address().address
        const port = server.address().port
        console.log("listening at %s:%s",host,port);
    }
)