const fs = require("fs");
const https = require("https");
const message = '<?xml version="1.0" encoding="UTF-8"?><oAuthToken xmlns="http://com.citi.citiconnect/services/types/oauthtoken/v1"><grantType>client_credentials</grantType><scope>/authenticationservices/v1</scope></oAuthToken>';

const req = https.request(
  {
    // host: "peter.com",
    host: "tts.sandbox.apib2b.citi.com",

    port: 8888,
    secureProtocol: "TLSv1_2_method",
    // key: fs.readFileSync(`${__dirname}/certs/client-key.pem`),
    // cert: fs.readFileSync(`${__dirname}/certs/client-crt.pem`),

    cert: fs.readFileSync(`${__dirname}/digicert/citi-clientside_deliveryhero_io_388738159/citi-clientside_deliveryhero_io.crt`), 
    key: fs.readFileSync(`${__dirname}/signed_certs/clientside2.key`),

    
    ca: [
      // fs.readFileSync(`${__dirname}/certs/server-ca-crt.pem`)
      // fs.readFileSync(`${__dirname}/certs/server-local-ca-crt.pem`)
      fs.readFileSync(`${__dirname}/tts.sandbox.api.citi.com.cer`)
    ],
    
    path: "/tts/api/v1/oauth2/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      // "Content-Length": Buffer.byteLength(JSON.stringify(message))
      "Authorization" : "Basic NzM2NDI3MDAtMTQwMy00MWZiLWJlYzktMjhlNzdmMTBlNGQ4OnVKM2hNNXVRMnlJNmtIM3dKMHhIN2JEMWNGNHBUOHdCMG9BMHRJNXRFMnFONXNGNGlC"
    },


  },
  function(response) {
    console.log("Response statusCode: ", response.statusCode);
    console.log("Response headers: ", response.headers);
    console.log(
      "Server Host Name: " + response.connection.getPeerCertificate().subject.CN
    );
    if (response.statusCode !== 200) {
      console.log(`Wrong status code`);
      return;
    }
    let rawData = "";
    response.on("data", function(data) {
      rawData += data;
    });
    response.on("end", function() {
      if (rawData.length > 0) {
        console.log(`Received message: ${rawData}`);
      }
      console.log(`TLS Connection closed!`);
      req.end();
      return;
    });
  }
);

req.on("socket", function(socket) {
  socket.on("secureConnect", function() {
    if (socket.authorized === false) {
      console.log(`SOCKET AUTH FAILED ${socket.authorizationError}`);
    }
    console.log("TLS Connection established successfully!");
  });
  socket.setTimeout(10000);
  socket.on("timeout", function() {
    console.log("TLS Socket Timeout!");
    req.end();
    return;
  });
});
req.on("error", function(err) {
  console.log(`TLS Socket ERROR (${err})`);
  req.end();
  return;
});
req.write(JSON.stringify(message));
req.end();
console.log('..');