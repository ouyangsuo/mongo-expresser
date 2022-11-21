// 引入express
const express = require("express")

// 上传中间件（可以读取二进制数据的请求体了）
const multer = require("multer")

const path = require("path")
const fs = require("fs")

/* 引入核心类【路由生成器RouterGenerator】 */
const RouterGenerator = require("./views/RouterGenerator")

/* 导入子模块路由处理器 */
// 用户路由器，提供了注册+登录功能
const userRouter = require("./views/userRouter")

// 文件路由器，提供了上传功能
const fileRouter = require("./views/fileRouter")

// 导入端口配置 + 路由模块的鉴权中间件配置
const { port,routes } = require("./config")

// 创建应用实例
const app = express()

/* 配置中间件 */
// 从请求体中读取json
app.use(express.json())

// 从请求体中国读取form
app.use(express.urlencoded({extended:false}))

// 从请求体中读取二进制文件数据
// temp=临时文件存储目录
// file=上传表单中携带文件的input的name
// <input type="file" name="file" />
app.use(multer({dest:path.resolve("temp")}).array("file"))

// 静态资源目录为public目录
app.use(express.static(path.resolve("public")))

/* 派发请求给路由器【中间件】 */
// 根据前缀派发路由给具体的路由处理器
app.use("/user",userRouter)
app.use("/file",fileRouter)

/* 
遍历路由表配置 
将/film开头的路由派发给自动生成的"filmRouter"
将/city开头的路由派发给自动生成的"cityRouter"
*/
routes.forEach(
    ({name,middlewares})=>{
        // 为每个业务模块 自动配置xxRouter
        // app.use("/film",filmRouter)
        app.use(`/${name}`,RouterGenerator.from(name,middlewares).generate())
    }
)

// 将应用实例app挂载监听在指定端口
const server = app.listen(
    port,
    ()=>{
        const host = server.address().address
        const port = server.address().port
        console.log("listening at %s:%s",host,port);
    }
)