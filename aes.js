const {
    textToBinaryArray,
    divideTo8CharArrays,
    xorBinaryStrings,
    permutateWithBitMap,
} = require("./utils")

const {
    SBoxes,
    SBoxBitMap,
    finalPermutationBitMap,
    initialPermutationBitMap,
} = require('./constants');
const { generateRoundKeys, generateKeyCD } = require("./key_utils");





const encrypt = (input, key) => {
    if(key.length > 8){
        console.log("key length must be under 9 character");
        return
    }
    let binaryArray = textToBinaryArray(input)
    let dividedBinaryArrays = divideTo8CharArrays(binaryArray)

    let enrypted = dividedBinaryArrays.map((val) => {return startEncryption(val, key)})
    return enrypted.join("")
}





const startEncryption = (binArray, key) => {
    binArray = binArray.join("")

    let initPermResult = permutateWithBitMap(binArray, initialPermutationBitMap)// initial permutation
    let des16FinalRoundResult = des16Rounds(initPermResult, generateRoundKeys(key))
    let finalPerm = permutateWithBitMap(des16FinalRoundResult, finalPermutationBitMap)// final permutation

    return finalPerm
}


const des16Rounds = (binArray, roundKeysArray) => {
    let roundInput = binArray

    // 16 Döngüleri
    for(let i = 0; i < 16; i++){

        let leftInput = roundInput.substring(0,32)
        let rightInput = roundInput.substring(32,64)
        let roundKey = roundKeysArray[i]


        // sağ tarafı sol tarafa kopyala
        let oldLeftInput = leftInput
        leftInput = rightInput


        // rightInput'un başına son elemanını, sonuna baş elemanını ekle
        let rightInputSemiExtended = rightInput[rightInput.length-1] + rightInput + rightInput[0]
        
        
        
        // rightInputu XOR'lanabilecek boyuta getir
        let rightInputExtended = ""
        for(let i=0; i<8; i++)
            for(let j=i*4; j<i*4+6; j++)
                rightInputExtended += rightInputSemiExtended[j]

                
                
                
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
    finalRoundOutput = roundInput
    
    let left32 = finalRoundOutput.substring(0,32)
    let right32 = finalRoundOutput.substring(32,64)
    finalRoundOutput = right32 + left32

    return finalRoundOutput
}



module.exports = {
    encrypt
}