### 概述
- 工程主干框架基于express + mongodb；
- 不需要MVC，不需要写代码，一分钟生成项目服务端；
- 一个简简单单的项目配置文件，全自动生成工程所有模块的增删改查接口！
- 支持批量插入、批量查询，支持登录鉴权/管理员鉴权、支持静态文件服务、上传服务，全部零代码！
- 可能是目前最好用mock服务解决方案！

### 源码地址
- [码云地址](https://gitee.com/steveouyang/mongo-expresser)
- [github地址](https://github.com/ouyangsuo/mongo-expresser)

### 使用方式
#### 下载源代码
```js
# 源码地址任选其一
git clone https://gitee.com/steveouyang/mongo-expresser.git
git clone https://github.com/ouyangsuo/mongo-expresser.git
```
#### 安装依赖

```js
cd mongo-expresser
npm install
```
#### 修改配置文件
**配置实例：src/project.config.json**

```js
{
    "dbName": "mydb",//自动生成的数据库名称
    "port": 8002,//项目运行端口
    "jwtSecret": "jinwandalaohu",//jwtToken秘钥
    "tokenAge": "3600s",//登录token有效期

    // 模块接口
    "routes": [
        {
            "name": "film", //模块名称电影 = 数据库中的collection名称 = RESTful风格的接口前缀

            // 接口中间件配置
            "middlewares": {
                "create": ["adminCheck"], // 为单个添加接口【POST:/film/0】配置管理员校验中间件
                "createMany": ["adminCheck"], // 为批量添加接口【POST:/film/-1】配置管理员校验中间件
                "retrieve": [], // 详情查询接口【GET:/film/:id】无需登录鉴权
                "retrieveMany": [], // 批量查询接口【GET:/film/0】无需登录鉴权
                "update": ["adminCheck"], // 为数据更新接口【PUT:/film/:id】配置管理员校验中间件
                "delete": ["adminCheck"] // 为数据删除接口【DELETE:/film/:id】配置管理员校验中间件
            }
        },

        {
            "name": "city", //模块名称城市 = 数据库中的collection名称 = RESTful风格的接口前缀

            // 接口中间件配置
            "middlewares": {
                "middlewares": {
                    "create": ["adminCheck"], // 为单个添加接口【POST:/city/0】配置管理员校验中间件
                    "createMany": ["adminCheck"], // 为批量添加接口【POST:/city/-1】配置管理员校验中间件
                    "retrieve": ["loginCheck"], // 详情查询接口【GET:/city/:id】配置登录校验中间件
                    "retrieveMany": ["loginCheck"], // 批量查询接口【GET:/city/0】配置登录校验中间件
                    "update": ["adminCheck"], // 为数据更新接口【PUT:/city/:id】配置管理员校验中间件
                    "delete": ["adminCheck"] // 为数据删除接口【DELETE:/city/:id】配置管理员校验中间件
                }
            }
        }
    ]
}
```
#### 运行项目
```js
npm run start
```
**此时工程所有模块的增删改查接口已经全部生成完毕！**

### 接口一览
#### 静态资源服务
```js
GET: baseUrl/<public下的文件路径>
```
#### 文件上传服务
```js
POST: baseUrl/file/upload

# 上传文件页面
baseUrl/page/file_upload.html
```
#### 用户管理模块

```js
# 用户注册
POST: baseUrl/user/register + form或json格式的请求体

# 用户登录
POST: baseUrl/user/login + form或json格式的请求体
```
#### 业务模块
此处以电影为例：
```js
# 添加单个电影
POST： baseUrl/film/0 + form或json格式的请求体

# 批量添加
POST： baseUrl/film/-1 + json数组格式的请求体

# 删除电影
DELETE： baseUrl/film/:id

# 修改电影
PUT: baseUrl/film/:id + form或json格式的请求体

# 查询电影详情
GET: baseUrl/film/:id

# 查询所有电影
GET: baseUrl/film/0
```
- 以上所有接口皆可配置登录鉴权/管理员鉴权；
- public/json目录下携带了`films.json`、`cities.json`、`cinemas.json`三个测试数据，各位看官可以此快速测试部署效果；
- 2.0中将会添加分页查询功能，敬请期待！

### 使用身份鉴权
- 用户模块默认检测三个字段：username,password,admin；
- 后续通过admin字段的true或false判断是否以管理员身份登录；
- 登录成功后的返回信息会携带jwtToken，其秘钥即为配置文件中配置的秘钥；
- 对后续模块接口的访问需要按需在请求头中携带token
```js
    headers:{
        "authorization":登录时发放的token值
    }
```
### 运行效果

![Video_2022-11-15_025607 00_00_00-00_00_30.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b0366e2364684ce9bfb9d1e7142f5ebd~tplv-k3u1fbpfcp-watermark.image?)

**不要忘记程序员三连哦：star! follow! fork!**
