

/**
 * @param {String} text
 * @returns [ "", "".. ]
 */
const textToBinaryArray = (text) => {
    let output = []
    let bin = "";

    for (char of text){
        bin = char.charCodeAt().toString(2);
        output.push(Array(8-bin.length+1).join("0") + bin);
    }
    return output;
}



const binaryArrayToHexArray = (binaryArray) => {
    let hexArray = [];

    for (binary of binaryArray){
        hexArray.push(parseInt(binary,2).toString(16));
    }
    return hexArray;
}



const textToHexArray = (text) => {
    return binaryArrayToHexArray(textToBinaryArray(text));
}
/**
 * @param [ "8", '8'..]
 * 
 * 
 * @returns [ ["8","8"..8.], ["8","8"..8.]... ]
 */

const divideTo8CharArrays = (binaryArray) => {
    array = new Array(Math.ceil(binaryArray.length / 8))
    for(let i = 0; i < array.length; i++){
        array[i] = new Array(8)
        for(let j = 0; j < 8; j++){
            array[i][j] = binaryArray[i*8+j] || "00000000"
        }
    }
    return array
}


const xorBinaryStrings = (a, b) => {
    let c = ""
    for (let i = 0; i < a.length; i++) {
        c += String(Number(a[i])^Number(b[i]))
    }
    return c
}



module.exports = {
    textToHexArray,
    textToBinaryArray,
    divideTo8CharArrays,
    xorBinaryStrings,
}