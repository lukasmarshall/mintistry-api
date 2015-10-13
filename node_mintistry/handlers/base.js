var web3 = require('web3');
var http = require('http');
var url = require("url");
var utils = require('./utils.js');



function handle(req, res){
  //writes response
  var isConnected = web3.isConnected();
  var coinbase = web3.eth.coinbase;
  var balance = web3.eth.getBalance(coinbase);
  var hashed_hello = web3.sha3('hello');
  var hello_to_hex = web3.toHex('hello');
  var hex_back_to_ascii = web3.toAscii(hello_to_hex);

  //.net methods
  var listening = web3.net.listening;
  var peer_count = web3.net.peerCount;

  //.eth methods
  var default_account = web3.eth.defaultAccount;
  var default_block = web3.eth.defaultBlock;
  var mining = web3.eth.mining;
  var gasPrice = web3.eth.gasPrice;
  var accounts = web3.eth.accounts;
  var block_number = web3.eth.blockNumber;
  
  var storage_at_address = web3.eth.getStorageAt("0x407d73d8a49eeb85d32cf465507dd71d507100c1", 0);
  var code_at_address = web3.eth.getCode("0xd5677cf67b5aa051bb40496e68ad359eb97cfbf8");

  var solidity_source = "" + 
    "contract test {\n" +
    "   function multiply(uint a) returns(uint d) {\n" +
    "       return a * 7;\n" +
    "   }\n" +
    "}\n";
  var code = web3.eth.compile.solidity(solidity_source);
  var current_provider = web3.currentProvider;

  //.db methods


  //page printing stuff
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.write(':\n'+JSON.stringify()+'\n');
  res.write('Connected:\n'+isConnected+'\n');
  res.write('Listening:\n'+JSON.stringify(listening)+'\n');
  res.write('Peer Count:\n'+JSON.stringify(peer_count)+'\n');
  res.write('Default Account (undefined if default, can be set):\n'+JSON.stringify(default_account)+'\n');
  res.write('Default Block:\n'+JSON.stringify(default_block)+'\n');
  res.write('Mining:\n'+JSON.stringify(mining)+'\n');
  res.write('Gas Price:\n'+JSON.stringify(gasPrice)+'\n');
  res.write('Accounts:\n'+JSON.stringify(accounts)+'\n');
  res.write('Block Number:\n'+JSON.stringify(block_number)+'\n');
  res.write('Balance:\n'+JSON.stringify(balance)+'\n');
  res.write('Storage at Address:\n'+JSON.stringify(storage_at_address)+'\n');
  res.write('Code at Address:\n'+JSON.stringify(code_at_address)+'\n');
  res.write('Compiled Solidity Code:\n'+JSON.stringify(code)+'\n');


  res.write('Current Provider: \n'+JSON.stringify(current_provider)+'\n');
  res.write('Coin Base: \n'+JSON.stringify(coinbase)+'\n');
  res.write('Hashed Hello:\n'+JSON.stringify(hashed_hello)+'\n');
  res.write('Hello to Hex:\n'+JSON.stringify(hello_to_hex)+'\n');
  res.write('Hex back to ascii (should be hello):\n'+JSON.stringify(hex_back_to_ascii)+'\n');
  res.end('\n');
}

module.exports.handle = handle;