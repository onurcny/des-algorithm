const { calcE, calcD, getRandomPrimeNumber } = require("./utils");

const createPublicAndPrivateKey = () => {
    let p = 61, q = 53
    let n = p * q
    let phiN = (p-1)*(q-1)
    let e = calcE(phiN)
    let d = calcD(phiN, e)
    return [e, d]
}

console.log(createPublicAndPrivateKey());



