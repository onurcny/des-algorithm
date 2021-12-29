const { KeyDBitMap, KeyCBitMap, PC2LeftHalfBitMap, PC2RightHalfBitMap, keyBitRotation } = require("./constants")
const { textToBinaryArray, permutateWithBitMap } = require("./utils")


const generateKeyCD = (key) => {
    key = textToBinaryArray(key)
    let keyBites = ""
    for(k of key){
        keyBites += k
    }
    return [
        permutateWithBitMap(keyBites, KeyCBitMap), 
        permutateWithBitMap(keyBites, KeyDBitMap)
    ]
}

const generateRoundKey = (keyC, keyD, round) => {
    //bit rotation
    let keyCBites = keyC
    for(let i = 0; i < keyBitRotation[round]; i++){
        let firstBite = keyCBites.substring(0, 1)
        keyCBites = keyCBites.substring(1, keyCBites.length)
        keyCBites = keyCBites + firstBite
    }
    keyC = keyCBites
    
    let keyDBites = keyD
    for(let i = 0; i < keyBitRotation[round]; i++){
        let firstBite = keyDBites.substring(0, 1)
        keyDBites = keyDBites.substring(1, keyDBites.length)
        keyDBites = keyDBites + firstBite
    }
    keyD = keyDBites

    // PC2 Permutation
    let key = keyCBites + keyDBites
    let roundKey = permutateWithBitMap(key, PC2LeftHalfBitMap) + permutateWithBitMap(key, PC2RightHalfBitMap)

    return [roundKey, keyC, keyD]
}

const generateRoundKeys = (key) => {
    let [keyC, keyD] = generateKeyCD(key)
    let keys = []
    for(let i = 0; i < 16; i++){
        let [roundKey, newKeyC, newKeyD] = generateRoundKey(keyC, keyD, i)
        keys.push(roundKey)
        keyC = newKeyC
        keyD = newKeyD
    }
    return keys
}

module.exports = {
    generateRoundKeys
}