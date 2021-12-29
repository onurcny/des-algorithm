const {
    textToHexArray,
    textToBinaryArray,
    divideTo8CharArrays,
    xorBinaryStrings,
    permutateWithBitMap
} = require("./utils")

const {
    SBoxes,
    SBoxBitMap,
    KeyCBitMap,
    KeyDBitMap,
    keyBitRotation,
    PC2RightHalfBitMap,
    PC2LeftHalfBitMap,
    finalPermutationBitMap,
    initialPermutationBitMap,
} = require('./constants')

const encrypt = (input, key) => {
    if(key.length > 8){
        console.log("key length must be under 9 character");
        return
    }
    let binaryArray = textToBinaryArray(input)
    let dividedBinaryArrays = divideTo8CharArrays(binaryArray)

    let enrypted = dividedBinaryArrays.map((val) => {return startEncryption(val, key)})
    return enrypted
}


const startEncryption = (binArray, key) => {
    // binArray => ["8","8"... {8}]

    binArray = binArray.join("")
    // initial permutation
    let step1 = permutateWithBitMap(binArray, initialPermutationBitMap)
    let step2 = des16Rounds(step1, key)
    return 1
}

const des16Rounds = (binArray, key) => {
    let [keyC, keyD] = generateKeyCD(key)
    let roundInput = binArray

    // TODO: 1'i 16 yap
    for(let i = 0; i < 16; i++){

        let leftInput = roundInput.substring(0,32)
        let rightInput = roundInput.substring(32,64)
        let [roundKey, newKeyC, newKeyD] = generateRoundKey(keyC, keyD, i)
        keyC = newKeyC
        keyD = newKeyD


        // sağ tarafı sol tarafa kopyala
        let oldLeftInput = leftInput
        leftInput = rightInput


        // rightInput'un başına ve sonuna eleman ekle
        rightInput = rightInput[rightInput.length-1] + rightInput + rightInput[0]
        
        
        // rightInputu XOR'lanabilecek boyuta getir
        let rightInputExtended = ""
        for(let i=0; i<8; i++)
            for(let j=i*4; j<i*4+6; j++)
                rightInputExtended += rightInput[j]


        
        // XOR RoundKey rightInput
        rightInputXOR = xorBinaryStrings(rightInputExtended, roundKey)



        // S BOX işlemleri
        let sBoxValuesAll = ""
        for(let i=0; i<8; i++){
            let rowBits = rightInputXOR[i*6] + rightInputXOR[i*6+5]
            let columnBits = rightInputXOR.slice(i*6+1,i*6+5)
            let row = parseInt(rowBits,2)
            let column = parseInt(columnBits,2)
            
            let sValue = SBoxes[i][row][column]
            sValue = sValue.toString(2)

            let length = sValue.length
            for(let i=0; i<(4-length); i++){
                sValue = '0' + sValue
            }
            sBoxValuesAll += sValue
        }



        // S-Box işlemleri sonrası permütasyon
        let sBoxPermutationResult = permutateWithBitMap(sBoxValuesAll, SBoxBitMap)



        // sonraki adımın girişini ayarla
        rightInput = xorBinaryStrings(sBoxPermutationResult,oldLeftInput)
        roundInput = leftInput + rightInput

    }
}

const generateKeyCD = (key) => {
    key = textToBinaryArray(key)
    let keyC = [], keyD = [], keyCBites = [], keyDBites = []
    // console.log("key", key);
    let keyBites = ""
    for(k of key){
        keyBites += k
    }
    for(n of KeyCBitMap){
        keyCBites.push(keyBites[n-1])
    }
    keyC = keyCBites.join("")
    // for(let i = 0; i < 4; i++){
    //     let row = ""
    //     for(let j = 0; j < 7; j++){
    //         row += keyCBites[i*7+j]
    //     }   
    //     keyC.push(row)
    // }
    for(n of KeyDBitMap){
        keyDBites.push(keyBites[n-1])
    }
    keyD = keyDBites.join("")
    // for(let i = 0; i < 4; i++){
    //     let row = ""
    //     for(let j = 0; j < 7; j++){
    //         row += keyDBites[i*7+j]
    //     }   
    //     keyD.push(row)
    // }
    return [keyC, keyD]
}

const generateRoundKey = (keyC, keyD, round) => {
    //bit rotation
    let keyCBites = keyC
    // for(k of keyC){
    //     keyCBites += k
    // }
    for(let i = 0; i < keyBitRotation[round]; i++){
        let firstBite = keyCBites.substring(0, 1)
        keyCBites = keyCBites.substring(1, keyCBites.length)
        keyCBites = keyCBites + firstBite
    }
    keyC = keyCBites
    
    let keyDBites = keyD
    // for(k of keyD){
    //     keyDBites += k
    // }
    for(let i = 0; i < keyBitRotation[round]; i++){
        let firstBite = keyDBites.substring(0, 1)
        keyDBites = keyDBites.substring(1, keyDBites.length)
        keyDBites = keyDBites + firstBite
    }
    keyD = keyDBites
    // PC2 Permutation
    let key = keyCBites + keyDBites
    let leftKeyHalf = []
    for(n of PC2LeftHalfBitMap){
        leftKeyHalf.push(key[n-1])
    }
    let RightKeyHalf = []
    for(n of PC2RightHalfBitMap){
        RightKeyHalf.push(key[n-1])
    }
    return [leftKeyHalf.join("") + RightKeyHalf.join(""), keyC, keyD]
}




const initialPermutation = (binArray) => {    
    outputBinArray = []
    for (n of initialPermutationBitMap){
        outputBinArray.push(binArray[n-1])
    }
    return outputBinArray
}

const finalPermutation = (binArray) => {
    let tempOutput = []
    for (n of finalPermutationBitMap)
        tempOutput.push(binArray[n-1])

    for(let i = 0; i < 8; i++){
        let row = ""
        for(let j = 0; j < 8; j++){
            row += tempOutput[i*8+j]
        }   
        output.push(row)
    }
    let output = []
}

module.exports = {
    encrypt
}