const { encrypte } = require("./aes").default;

let en = encrypte("onurcan", "envercan")
console.log(en);