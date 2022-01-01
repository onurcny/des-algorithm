const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

const isPrime = (n) => {
    let res = true
    for(let i = 2; i < n; i++){
        if(n%i==0){
            res = false
            break
        }
    }
    return res
}

const getRandomPrimeNumber = (min, max) => {
    let prime
    do{
        prime = getRndInteger(min, max)
    }while(!isPrime(prime))
    return prime
}

const calcE = (phiN) => {
    let e
    do {
        e = getRndInteger(2, phiN)
    } while (!isPrime(e))
    return e
}

const calcD = (phiN, e) => {
    for(let i = 1; i < phiN; i++){
        if(((phiN * i + 1) % e) == 0){
            return ((phiN * i) + 1) / e
        }
    }
    return 0
}

module.exports = {
    getRndInteger,
    isPrime,
    calcE,
    calcD,
    getRandomPrimeNumber
}