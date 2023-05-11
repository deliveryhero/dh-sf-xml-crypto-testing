// const fs = require('fs');
const xmlenc = require('xml-encryption');

const encrpytXml = async(payload, publicKey) => {
    var options = {
        rsa_pub: publicKey, //fs.readFileSync(publicKeyPath),
        pem: publicKey, //fs.readFileSync(publicKeyPath),
        encryptionAlgorithm: 'http://www.w3.org/2001/04/xmlenc#aes256-cbc',
        keyEncryptionAlgorithm: 'http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p',
        disallowEncryptionWithInsecureAlgorithm: true,
        warnInsecureAlgorithm: true
      };
      
      return new Promise((resolve, reject) => {
        xmlenc.encrypt(payload, options, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
      });
}

const decryptXml = async (payload, privateKey) => {
    return new Promise((resolve, reject) => {
        // console.log('agh');
        xmlenc.decrypt(payload, 
            {
                key : privateKey,
            },
            (err, result) => {
                if (err) reject(err);
                else resolve(result)
            }
        );
    });
};

module.exports = {
    encrpytXml : encrpytXml,
    decryptXml : decryptXml
};