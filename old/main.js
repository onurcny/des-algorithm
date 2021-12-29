const { User } = require("./user")

let onur = new User("Onur")
let enver = new User("Enver")

onur.sendFriendRequest(enver)

onur.sendMessage(enver, "selam kanks")
enver.sendMessage(onur, "sana da selam eyy kanks")