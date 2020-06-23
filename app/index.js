const express = require('express');

const gsm = require('./gsm');

/* 

const app = express();
var port = 3000;

app.listen(port, function () {
 console.log('Example app listening on port http://0.0.0.0:' + port + '!');
}); */

gsm.receivedRing();

