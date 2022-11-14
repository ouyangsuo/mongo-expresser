class Response {
  constructor(msg = "", err = null, data = null) {
    this.msg = msg;
    this.err = err;
    this.data = data;
  }
}

module.exports = Response
