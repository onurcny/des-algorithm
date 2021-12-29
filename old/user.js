const { generateKeyPairSync, generateKeySync, publicEncrypt, privateDecrypt, Cipher } = require('crypto')
const { RSA_PKCS1_OAEP_PADDING } = require('constants')

const uuid = require('uuid')

class User {
    constructor(name){
        this.name = name
        const { publicKey, privateKey } = generateKeyPairSync("rsa", {
            modulusLength: 2048,
        })
        this.publicKey = publicKey
        this.privateKey = privateKey
        this.uuid = uuid.v4()
        this.friends = new Map()
    }

    sendFriendRequest = (user) => {
        let key = generateKeySync("aes", { length: 256 })
        this.friends.set(user.uuid, {...user, key: key.export().toString()})
        let enkey = publicEncrypt(
            {
              key: user.publicKey,
              padding: RSA_PKCS1_OAEP_PADDING,
              oaepHash: "sha256",
            },
            Buffer.from(key.toString())
        )
        user.getFriendRequest(this, enkey)
    }

    getFriendRequest = (user, enkey) => {
        let dekey = privateDecrypt(
            {
              key: this.privateKey,
              padding: RSA_PKCS1_OAEP_PADDING,
              oaepHash: "sha256",
            },
            enkey
        )
        console.log(Buffer.from(dekey))
        this.friends.set(user.uuid, {...user, key: dekey.toString()})
    }

    sendMessage = (user, message) => {
        if(!user.friends.has(this.uuid)){
            console.log("Önce bu kişiyi arkadaş olarak eklemelisin.")
            return
        }
        let key = this.friends.get(user.uuid).key
        console.log("send msg:" + key.toString());
        user.receiveMessage(this, message)
    } 

    receiveMessage = (user, message) => {
        console.log(user.name + " -> " + this.name + ": " + message);
    }
}

module.exports = {
    User
}