const { encrypt} = require("./aes");
const { binStringToHexString } = require('./utils')

let encrypted = encrypt("onurcan", "envercan")


console.log(binStringToHexString(encrypted));