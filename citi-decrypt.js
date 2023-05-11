const xmltools = require('./xmltools.js');
const fs = require('fs');
const PAYLOAD_FILE = './citi.response.xml';
const DECRYPTION_PRIV_KEY = '/Users/p.tempfli/prog/citi-crypto/signed_certs/encrypt2.key';
const main = async () => {
    const payload = fs.readFileSync(PAYLOAD_FILE).toString();

    // console.log('##### payload');
    // console.log(payload);

    const decryptedDoc = await xmltools.decryptXml(payload, fs.readFileSync(DECRYPTION_PRIV_KEY));


    console.log('##### decryptedDoc');
    console.log(decryptedDoc);

}  

main();