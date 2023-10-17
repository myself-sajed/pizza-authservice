import crypto from 'crypto';
import fs from 'fs';

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
    },
    publicKeyEncoding: {
        type: 'pkcs1',
        format: 'pem'
    }
})

console.log('Public key:', publicKey)
console.log('Private key:', privateKey)

// writing the keys into .pem files

fs.writeFileSync('certs/privateKey.pem', privateKey)
fs.writeFileSync('certs/publicKey.pem', publicKey)