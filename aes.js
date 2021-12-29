const { textToHexArray, textToBinaryArray, divideTo8CharArrays, xorBinaryStrings } = require("./utils")
const {
    SBoxes,
    initialPermutationBitMap,
    KeyCBitMap,
    KeyDBitMap,
    keyBitRotation,
    PC2RightHalfBitMap,
    PC2LeftHalfBitMap
} = require('./constants')

const encrypte = (input, key) => {
    if(key.length > 8){
        console.log("key length must be under 9 character");
        return
    }
    let binaryArray = textToBinaryArray(input)
    let dividedBinaryArrays = divideTo8CharArrays(binaryArray)

    let enrypted = dividedBinaryArrays.map((val) => {return startEncrypt(val, key)})
    return enrypted
}


const startEncrypt = (binArray, key) => {
    // binArray => ["8","8"... {8}]
    let step1 = initialPermutation(binArray)
    let step2 = des16Rounds(step1, key)
    
    return 1
}

const des16Rounds = (binArray, key) => {
    // binArray => ["8","8"... {8}]

    let [keyC, keyD] = generateKeyCD(key)
    let roundInput = binArray.join("")

    // TODO: 1'i 16 yap
    for(let i = 0; i < 16; i++){
        //  ["8","8","8","8"]
        let leftInput = roundInput.substring(0,32)
        let rightInput = roundInput.substring(32,64)
        let [roundKey, newKeyC, newKeyD] = generateRoundKey(keyC, keyD, i)
        keyC = newKeyC
        keyD = newKeyD

        // sağ tarafı sol tarafa yaz
        let oldLeftInput = leftInput
        leftInput = rightInput



        // rightInput'u anahtarla XOR'lanabilecek boyuta getir
        rightInput = rightInput[rightInput.length-1] + rightInput + rightInput[0]
        // console.log("54",rightInput);

        // rightInput'u 6 bitlik 8 gruba ayir
        let rightInput6li = []
        for(let i=0; i<8; i++){
            let temp6li = []
            for(let j=i*4; j<i*4+6; j++){
                temp6li.push(rightInput[j])
            }
            rightInput6li.push(temp6li)
        }
        // console.log("65", rightInput6li);



        rightInput6li = rightInput6li.join("").replace(/,/g,'')
        // console.log("70", rightInput6li);
        
        // XOR RoundKey rightInput
        xorResult = xorBinaryStrings(rightInput6li, roundKey)
        // console.log("74", xorResult);



        // S BOX
        let sBoxValuesAll = ""
        for(let i=0; i<8; i++){
            let rowBits = xorResult[i*6] + xorResult[i*6+5]
            let columnBits = xorResult.slice(i*6+1,i*6+5)
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



        // Permutation after sBoxes
        let sBoxBitMap = [
            16, 7, 20, 21, 29, 12, 28, 17,
            1, 15, 23, 26, 5, 18, 31, 10,
            2, 8, 24, 14, 32, 27, 3, 9,
            19, 13, 30, 6, 22, 11, 4, 25
        ]

        let sBoxPermutationResult = ""
        for(let i of sBoxBitMap){
            sBoxPermutationResult += sBoxValuesAll[i-1]
        }


        rightInput = xorBinaryStrings(sBoxPermutationResult,oldLeftInput)
        roundInput = leftInput + rightInput

        console.log("115", roundInput);
        10010101
        00011011
        00110100
        11111110
        01001011
        11100110
        00101101
        01010101


        00000000
        01111111
        01000011
        01011011
        10110111
        00001101
        11000110
        10011110
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

// mangled = ringht -> mangler function & round key
// right output = left & mangled -> xor
// left output = right
// left output + right output
















const initialPermutation = (binArray) => {
    let text = ""
    for(t of binArray){text += t}
    // text = binArray.join("")
    
    tempOutput = []
    for (n of initialPermutationBitMap){
        tempOutput.push(text[n-1])
    }
    
    let output = []
    for(let i = 0; i < 8; i++){
        let row = ""
        for(let j = 0; j < 8; j++){
            row += tempOutput[i*8+j]
        }   
        output.push(row)
    }
    return output
}

const finalPermutation = (binArray) => {
    text = binArray.join("")

    let finalPermutationBitMap = [
        [40,8,48,16,56,24,64,32],
        [39,7,47,15,55,23,65,31],
        [38,6,46,14,54,22,62,30],
        [37,5,45,13,53,21,61,29],
        [36,4,44,12,52,20,60,28],
        [35,3,43,11,51,19,59,27],
        [34,2,42,10,50,18,58,26],
        [33,1,41,9,49,17,57,25],
    ]

    let tempOutput = []
    for (n of finalPermutationBitMap)
        tempOutput.push(text[n-1])

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
    encrypte
}