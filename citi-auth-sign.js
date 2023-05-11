const fs = require('fs');
const xmlcrypto = require('xml-crypto');

const PAYLOAD = '<?xml version="1.0" encoding="UTF-8"?><oAuthToken xmlns="http://com.citi.citiconnect/services/types/oauthtoken/v1"><grantType>client_credentials</grantType><scope>/authenticationservices/v1</scope><sourceApplication>CCF</sourceApplication></oAuthToken>';
const SIGNATURE_PRIVATE_KEY_PATH = '/Users/p.tempfli/prog/citi-crypto/signed_certs/sign2.key';
// const ENCRYPTION_PUB_CERT_PATH = '/Users/p.tempfli/prog/citi-crypto/digicert/citi-encrypt_deliveryhero_io_388736536/citi-encrypt_deliveryhero_io_COPY_AS_PEM.pem';
const ENCRYPTION_PUB_CERT_PATH = '/Users/p.tempfli/prog/citi-crypto/citi-own-certs/Citi-Certificates/citigroupsoauat.xenc.citigroup.com.cer';

const signDocument = (payload, privSigKeyPath, elementToSign) => {
	var sig = new xmlcrypto.SignedXml();
    sig.canonicalizationAlgorithm = 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315';
    // sig.signatureAlgorithm = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
    sig.signatureAlgorithm = 'http://www.w3.org/2000/09/xmldsig#rsa-sha1';
	sig.addReference(
        "//*[local-name(.)='" + elementToSign + "']",
        ['http://www.w3.org/2000/09/xmldsig#enveloped-signature'
            ,'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
        ],
        ['http://www.w3.org/2000/09/xmldsig#sha1']
        );
	sig.signingKey = fs.readFileSync(privSigKeyPath)
	sig.computeSignature(payload, {prefix : 'ds'})
    // console.log('#### sig ', sig);
    return sig.getSignedXml();
}



const encrpytXml = async(payload, publicKey) => {
    const xmlenc = require('xml-encryption');
    var options = {
        rsa_pub: publicKey, //fs.readFileSync(publicKeyPath),
        pem: publicKey, //fs.readFileSync(publicKeyPath),
        // encryptionAlgorithm: 'http://www.w3.org/2001/04/xmlenc#tripledes-cbc',
        // encryptionAlgorithm: 'http://www.w3.org/2001/04/xmlenc#aes256-cbc',

        encryptionAlgorithm: 'http://www.w3.org/2009/xmlenc11#aes256-gcm',

        keyEncryptionAlgorithm : 'http://www.w3.org/2001/04/xmlenc#rsa-1_5',
        // keyEncryptionAlgorithm: 'http://www.w3.org/2001/04/xmlenc#rsa-oaep-mgf1p',
        disallowEncryptionWithInsecureAlgorithm: false,
        warnInsecureAlgorithm: true
      };
      
      return new Promise((resolve, reject) => {
        xmlenc.encrypt(payload, options, (err, result) => {
            if (err) reject(err);
            else resolve(result);
        });
      });
}


const main = async () => {

    let signedDoc = signDocument(PAYLOAD, SIGNATURE_PRIVATE_KEY_PATH, 'oAuthToken');

    console.log('################ signedDoc: ');
    console.log(signedDoc);

    let encryptedDoc = await encrpytXml(signedDoc, fs.readFileSync(ENCRYPTION_PUB_CERT_PATH));

    console.log('################ encryptedDoc: ');
    encryptedDoc = encryptedDoc.replace(/e:/g, 'xenc:')
    encryptedDoc = encryptedDoc.replace(/KeyInfo/g, 'ds:KeyInfo')
    encryptedDoc = encryptedDoc.replace(/ds\:KeyInfo xmlns/g, 'ds:KeyInfo xmlns:ds')

    
    encryptedDoc = '<?xml version="1.0" encoding="UTF-8"?>' + encryptedDoc;
    console.log(encryptedDoc);




}
main();
