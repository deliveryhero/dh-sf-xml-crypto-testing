/*



no pwd key/cert pair:
openssl req  -nodes -new -x509  -keyout server.key -out server.cert

priv to p12 format
openssl pkcs12 -export -out js_sig.p12 -in js_sig.cert -inkey js_sig.key



*/
const fs = require('fs');
const xmlcrypto = require('xml-crypto');
const xmlenc = require('xml-encryption');
const xmldom = require('@xmldom/xmldom');

const ENCRYPTION_PUB_CERT_PATH = '/Users/p.tempfli/mm/citi_dotnet/cert/js1_pub.pem';
const ENCRYPTION_PUB_CERT = fs.readFileSync(ENCRYPTION_PUB_CERT_PATH);
const DECRYPTION_PRIV_KEY_PATH = '/Users/p.tempfli/mm/citi_dotnet/cert/js1_priv.pem';
const DECRYPTION_PRIV_KEY = fs.readFileSync(DECRYPTION_PRIV_KEY_PATH);

const SIGNATURE_PUBLIC_KEY_PATH = '/Users/p.tempfli/mm/citi_dotnet/cert/js_sig.cert';
const SIGNATURE_PRIVATE_KEY_PATH = '/Users/p.tempfli/mm/citi_dotnet/cert/js_sig.key';
// const DECRYPTION_PRIV_KEY = fs.readFileSync('server.key');

//const PAYLOAD = '<EncryptedData Type="http://www.w3.org/2001/04/xmlenc#Element" xmlns="http://www.w3.org/2001/04/xmlenc#"><EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#tripledes-cbc" /><KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#"><EncryptedKey xmlns="http://www.w3.org/2001/04/xmlenc#"><EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-1_5" /><CipherData><CipherValue>RWF+r+eW/qmh/0a0nIxMCfVDRiSCVd3kOo9ObhVMvPE434H75XJfOMl64ACJ4LjVzFPWYYSmq3EvCz+TBicWWrImV6rMXHpeQeUbQVRtZH0xS80tHpx7Z7Qw9fPvv6qIyGSFgt3iPTn2obA40M5wa5N65D5sovoCfl5a1Ox3BASY2ZiPbBKuF6HFUvF2usrkOrbz2DtoG2OivL2FkEFGHUSk71lAtJKmqZacCNXCYxTSJDpJ4HZ9vCSVXZ1Ko1KPIl7qJCOkryCdkBPUbNrYOBxr2XTSnLKheImbpp2s7EunrSH4Dwp9Uqq33IMBXkJkmAMvw/mJX1iPNB+bX0li1A==</CipherValue></CipherData></EncryptedKey></KeyInfo><CipherData><CipherValue>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</CipherValue></CipherData></EncryptedData>';
const PAYLOAD_SIGNED_ENCRYPTED = '<EncryptedData Type="http://www.w3.org/2001/04/xmlenc#Element" xmlns="http://www.w3.org/2001/04/xmlenc#"><EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#tripledes-cbc" /><KeyInfo xmlns="http://www.w3.org/2000/09/xmldsig#"><EncryptedKey xmlns="http://www.w3.org/2001/04/xmlenc#"><EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#rsa-1_5" /><CipherData><CipherValue>FFlNq/cWXPz7FrbXVGXYeYGs5wCiBQLEmKFhifkmGIUtqPpxVY9OTdPwkkfZK6fmtZOmG1soes86x3lHDE8a7USOv7CampcDPQ7OjIudPgi0j38zyZ5HT2G+jZOeWnHxQ/R1E1RtNiLnj08K7PQ3RAeowGGpopEZEnlt9AfqjOwXH76kZRlNRjhpYMOSwfg9GhG+/U2BwSb9rocUSFjienKRv/1kSi8bcJcwXVE2myifpqOUiNWG9qPiH9JLOANg4N6k8gustV1Sa65MyTk7gomb84y8c1JLy6scx/0RHs9mrmp5lWW3lmuXfYhCSrlOIGuXx+nMyxYAPttYBnQkrg==</CipherValue></CipherData></EncryptedKey></KeyInfo><CipherData><CipherValue>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</CipherValue></CipherData></EncryptedData>';
// const PAYLOAD2 = '<?xml version=\"1.0\" encoding=\"UTF-8\"?><html><body><h1>Hellox Peter</h1><h2>jahhha</h2></body></html>';
const PAYLOAD3 = '<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<oAuthToken\nxmlns=\"http://com.citi.citiconnect/services/types/oauthtoken/v1\" Id="myId">\n<grantType>client_credentials</grantType>\n<scope>/authenticationservices/v1</scope></oAuthToken>';

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

// console.log(DECRYPTION_PRIV_KEY.toString());
// const afterPassPhrase = crypto.privateDecrypt({ key : DECRYPTION_PRIV_KEY, passphrase : 'pass'});
// console.log(afterPassPhrase);

const verifySignature = (myDoc, publicSigKeyPath) => {
    // console.log('##################myDoc', myDoc);
    // console.log('..................................');

	// var xml = fs.readFileSync("signed.xml").toString()
	const parsedMyDoc = new xmldom.DOMParser().parseFromString(myDoc)    
    // console.log('parsedMyDoc', parsedMyDoc);
    // console.log('..................................');

	const signatureElement = xmlcrypto.xpath(parsedMyDoc, "//*[local-name(.)='Signature' and namespace-uri(.)='http://www.w3.org/2000/09/xmldsig#']")[0];
    // console.log('signature', signatureElement.toString());
    // console.log('..................................');

	const sig = new xmlcrypto.SignedXml()
	sig.keyInfoProvider = new xmlcrypto.FileKeyInfo(publicSigKeyPath);
	sig.loadSignature(signatureElement)
    // console.log('# sig', sig);
    var signatureValidation = sig.checkSignature(myDoc);
    console.log('### signatureValidation ' + signatureValidation);
}

const signDocument = (payload, privSigKeyPath, elementToSign) => {
	var SignedXml = require('xml-crypto').SignedXml	  

	var xml = "<library>" +
	            "<book>" +
	              "<name>Harry Potter</name>" +
	            "</book>" +
	          "</library>"

	var sig = new xmlcrypto.SignedXml();
    sig.canonicalizationAlgorithm = 'http://www.w3.org/TR/2001/REC-xml-c14n-20010315';
    sig.signatureAlgorithm = 'http://www.w3.org/2001/04/xmldsig-more#rsa-sha256';
	sig.addReference(
        "//*[local-name(.)='" + elementToSign + "']",
        ['http://www.w3.org/2000/09/xmldsig#enveloped-signature'
            ,'http://www.w3.org/TR/2001/REC-xml-c14n-20010315'
        ],
        ['http://www.w3.org/2001/04/xmlenc#sha256']
        );
	sig.signingKey = fs.readFileSync(privSigKeyPath)
	sig.computeSignature(payload)
    // console.log('#### sig ', sig);
    return sig.getSignedXml();
}


const main = async() => {
    // const myDoc = await decryptXml(PAYLOAD_SIGNED_ENCRYPTED, DECRYPTION_PRIV_KEY);
    // verifySignature(myDoc);

    let signedDoc = signDocument(PAYLOAD3, SIGNATURE_PRIVATE_KEY_PATH, 'oAuthToken'); //oAuthToken');
    // signedDoc = signedDoc.replace(' Id="_0"', '');
    console.log('### signedDoc', signedDoc);
    verifySignature(signedDoc, SIGNATURE_PUBLIC_KEY_PATH);
}

main();