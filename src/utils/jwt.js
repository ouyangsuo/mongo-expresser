const jsonwebtoken = require("jsonwebtoken");
// const jwtSecret = "test_key";
const { jwtSecret, tokenAge } = require("../config");

class JWT {
    /* 生成token 返回token*/
    static generate(value, expires = (tokenAge || "3600s")) {
        console.log("JWT generate value",value);
        // value 为传入值， expires为过期时间，这两者都会在token字符串中题先
        try {
            return jsonwebtoken.sign(value, jwtSecret, { expiresIn: expires });
        } catch (e) {
            console.error("jwt sign error --->", e);
            return "";
        }
    }

    /* 校验token 返回载荷或false*/
    static verify(token) {
        try {
            // 如果过期将返回false
            return jsonwebtoken.verify(token, jwtSecret);
        } catch (e) {
            console.error("jwt verify error --->", e);
            return false;
        }
    }
}

module.exports = JWT;

/* 小案例 */
// (function () {
//     /* 载荷（角色/权限描述信息） */
//     const payload = {
//         // uuid: "3455445-acuya7skeasd-iue7",
//         // phone: 133409899625,
//         username:"admin",
//         password:"123456"
//     };

//     // 生成token 有效时长20s
//     const token = JWT.generate(payload, "3s");
//     console.log("token", token);

//     // 校验token 得到payload
//     const info = JWT.verify(token);
//     console.log("verifiedRet", info);

//     /* 3秒后再次校验 */
//     setTimeout(() => {
//         console.log("检验过期token");
//         const info2 = JWT.verify(token);
//         console.log("info2", info2); // false
//     }, 3000);
// })();