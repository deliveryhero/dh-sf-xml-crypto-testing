var fs = require('fs');
var https = require('https');
var privateKey  = fs.readFileSync('certs/server-key.pem', 'utf8');
var certificate = fs.readFileSync('certs/server-crt.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

// your express configuration here


app.get('/', (req, res) => {
  console.log(Object.keys(req));
  console.log(req.client);
  res.send(JSON.stringify(''+req.client, 0, 4));
})
https.createServer(credentials, app).listen(8843, () => {
  console.log('im started');
});
