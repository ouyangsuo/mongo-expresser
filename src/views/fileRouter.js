// 引入express
const express = require("express");
const fs = require("fs")
const path = require("path")

const {uploadPath} = require("../config")

const regExtname = /.+\.([a-z]+)/
const resolveExtname = name => regExtname.exec(name)[1]

// 创建路由处理器
const fileRouter = express.Router();

// 添加上传处理器
fileRouter.post("/upload",(req,res)=>{
    // res.json({
    //     msg:"upload...",
    //     // file:req.files[0],
    //     path:req.files[0].path
    // })
    console.log("path",req.files[0].path);
    console.log("originalname",req.files[0].originalname);
    const oname = req.files[0].originalname

    // 从临时存储位置读入字节数据 再写出到目标文件位置 昵称.jpg
    fs.readFile(
        req.files[0].path,
        (err,data)=>{
            if(err){
                res.json({
                    msg:"读取临时路径失败"
                })
            }else{
                // 再写出到目标文件位置 upload/昵称.jpg
                fs.writeFile(
                    // 要写出的目标路径
                    path.join(uploadPath,`${req.body.nickname}.${resolveExtname(oname)}`),

                    // 刚刚读入的临时文件的字节数据
                    data,

                    // 写出结果回调函数
                    err => {
                        if(err){
                            res.json({
                                msg:"转存文件失败"
                            })
                        }else{
                            res.json({
                                msg:"文件上传成功",
                                body:req.body
                            })
                        }
                    }
                )
            }
        }
    )

})

// 导出路由处理器
module.exports = fileRouter;
