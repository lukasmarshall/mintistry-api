// start geth with:
// geth --rpc --rpcaddr "localhost" --rpcport "8545" --rpcapi "db,eth,net,web3"

//imports
var web3 = require('web3-custom').web3;
var http = require('http');
var url = require("url");

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
result = web3.setProvider(new web3.providers.HttpProvider('http://127.0.0.1:8545'));
console.log('Ethereum Connected');

//start node server
http.createServer(function (req, res) {
  handleRequest(req, res)
  //print the request to the console.
  console.log(req.url);
}).listen(80, '127.0.0.1');


console.log('Server running at http://127.0.0.1:80/');

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
  }else{
    require('./handlers/base.js').handle(req, res);
  }
}



function handleIssueCoins(req, res){
  //writes response
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Issuing Coins');
  res.end('\n');
}

function handleTransfer(req, res){
  //writes response
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write('Transferring');
  res.end('\n');
}

//inspiration here from geth tutorial 3 https://www.youtube.com/watch?v=9WNyupn8pvw
function createTransaction(my_addr, to_addr, coin_addr, amount){
  //pad to make the address and data 32 bytes long
  
  data = data.pad(32);
  addr = to_addr.pad(32);
  //unbins the data so that it can be sent to the contract
  var data = (addr+amount).unbin();
  

  var transactionObject= {
    from : my_addr,
    to : coin_addr,
    value : 0,
    gas : 10000000,
    gasPrice : 250,
    data : data.pad(32),

  }

  // The value transferred for the transaction in Wei, also the endowment if it's a contract-creation transaction.
  
  var gas = "10000000";
  // The price of gas for this transaction in wei, defaults to the mean network gas price.
  var gasPrice = "250";
  // Either a byte string containing the associated data of the message, or in the case of a contract-creation transaction, the initialisation code.
  // pad to make the address and data 32 bytes long


  //this sends the transaction request containing from, to, gas/gasprice data and the data 
  web3.eth.sendTransaction(from, to, 0, "10000000", "250" ,data, function(receipt){
    console.log("received tx hashL"+ receipt.address);
  });
}

function initialiseContract(coin_addr, my_addr){
  //first we need to GET your private key to sign the contract - we pass it the callback which is called when the key is found and variable sec holds the key.
  eth.getKey(function(sec){
    //some code here to temporarily store the current secret key of the address
    my_addr = sec;
    //converts the secret key to an address, callback gets the address and then gets the storage at the coin's address
    eth.getSecretToAddress(sec, function(addr){
      //gets the storage for the current user at the given coin
      eth.getStorageAt(coin_addr, my_addr, function(storage){
        console.log(storage);
      });
    });
  })
}

