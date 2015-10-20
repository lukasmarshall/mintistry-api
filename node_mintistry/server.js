// start geth with:
// geth --rpc --rpcaddr "localhost" --rpcport "8545" --rpcapi "db,eth,net,web3"

//imports
var web3 = require('web3-custom').web3;
var http = require('http');
var url = require("url");
var config = require('./config.js').params;
var https = require('https')
var fs = require('fs')

// var mongoose = require('mongoose');
// mongoose.connect('127.0.0.1:27017');
var db;
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function (callback) {
//   // yay!
//   console.log('Mongoose Connected');
// }); //

//set up communication with geth instance
result = web3.setProvider(new web3.providers.HttpProvider(config.geth_url));
console.log('Ethereum Connected');

if(config.https){
  // HTTPS STUFF
  console.log('HTTPS Mode');
  var options = {
    key: fs.readFileSync(config.ssl_key_location),
    cert: fs.readFileSync(config.ssl_cert_location)
  };

  https.createServer(options, function (req, res) {
    handleRequest(req, res)
    console.log(req.url);
  }).listen(config.port, config.ip_address);

}else{
  console.log('HTTP Mode');
  //start node server
  http.createServer(function (req, res) {
    handleRequest(req, res)
    console.log(req.url);
  }).listen(config.port, config.ip_address);
}






console.log('Server running at '+config.ip_address+' at port '+config.port);

function handleRequest(req, res){
  //gets request params and converts them to a json object..
  if(req.url.match('^/newCurrency')){
    require('./handlers/newCurrency.js').handle(req, res, db);
  }else if(req.url.match('^/checkMined')){
    require('./handlers/checkMined.js').handle(req, res, db);
  }else if(req.url.match('^/issueCoin')){
    require('./handlers/issueCoin.js').handle(req, res, db);
  }else if(req.url.match('^/transfer')){
    require('./handlers/transferCoin.js').handle(req, res, db);
  }else if(req.url.match('^/viewAddresses')){ 
    require('./handlers/viewAddresses.js').handle(req, res, db);
  }else if(req.url.match('^/newAddress')){ 
    require('./handlers/newAddress.js').handle(req, res, db);
  }else if(req.url.match('^/getBalance')){
    require('./handlers/getBalance.js').handle(req, res);
  }else if(req.url.match('^/topUp')){
    require('./handlers/topUp.js').handle(req, res);
  }else if(req.url.match('^/activate')){
    require('./handlers/activate.js').handle(req, res);
  }else{
    require('./handlers/base.js').handle(req, res);
  }
}

