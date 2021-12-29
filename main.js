const { encrypt } = require("./aes");

let en = encrypt("onurcan", "envercan")
console.log(en);