const { encrypt, decrypt} = require("./des");

let encrypted = encrypt("oo", "envercan")
console.log(encrypted);
let decrypted = decrypt(encrypted, "envercan")
console.log(decrypted);
