const fs = require("fs");
const https = require("https");
const options = {
  key: fs.readFileSync(`${__dirname}/certs/server-key.pem`),
  cert: fs.readFileSync(`${__dirname}/certs/server-crt.pem`),
  ca: [
    fs.readFileSync(`${__dirname}/certs/client-ca-crt.pem`)
  ],
  // Requesting the client to provide a certificate, to authenticate.
  requestCert: true,
  // As specified as "true", so no unauthenticated traffic
  // will make it to the specified route specified
  rejectUnauthorized: true
};
https
  .createServer(options, function(req, res) {
    console.log(
      new Date() +
        " " +
        req.connection.remoteAddress +
        " " +
        req.method +
        " " +
        req.url
    );
    console.log('###### ', req.socket.getPeerCertificate(true));
    res.writeHead(200);
    res.end("OK....!\n");
  })
  .listen(8888);


/*
var fs = require('fs');
var https = require('https');
var clientCertificateAuth = require('client-certificate-auth');

var privateKey  = fs.readFileSync('certs/server-key.pem', 'utf8');
var privateKey  = fs.readFileSync('certs/server-key.pem', 'utf8');
var certificate = fs.readFileSync('certs/server-crt.pem', 'utf8');

let checkAuth = (c) => {
  console.log('#### c', c);
}

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();
app.use(clientCertificateAuth(checkAuth));

privateKey = 'xxx'
// console.log('... ' + privateKey)


app.get('/', (req, res) => {
  // console.log(Object.keys(r));
  // console.log(req.socket);
  console.log(req.socket.getPeerCertificate(true));
  res.send(JSON.stringify(''+ Math.random(), 0, 4));
})


https.createServer(credentials, app).listen(8843, () => {
  // console.log('random: ' + Math.random());
});
*/