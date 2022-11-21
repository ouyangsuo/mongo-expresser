/* 通用服务端响应类 new Response(msg,err,data) */
class Response {
  constructor(msg = "", err = null, data = null) {
    this.msg = msg;
    this.err = err;
    this.data = data;
  }
}

module.exports = Response
