const { encrypt, decrypt} = require("./aes");

let encrypted = encrypt("oo", "envercan")
console.log(encrypted);
let decrypted = decrypt(encrypted, "envercan")
console.log(decrypted);



// let encryptedString = ""
// for (let i=0; i<encrypted.length/8; i++){
//     let char = encrypted.substring(i*8,i*8+8)
//     encryptedString += String.fromCharCode(parseInt(char,2))
// }
// console.log(encryptedString);


// console.log(binStringToHexString(encrypted));

