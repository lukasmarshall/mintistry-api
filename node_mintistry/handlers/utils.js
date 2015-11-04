var web3 = require('web3');
var http = require('http');
var url = require("url"); 
var qs = require('querystring');
var formidable = require('formidable')
var contractFactory = require('contractFactory');
var customAuth = require('customAuth')


function getParams(req, callback){
  var error = null;
  var params = null;
  if(req.method.toLowerCase() == 'post'){
    //parsing POST request parameters
    var form = formidable.IncomingForm();
    form.parse(req, function formParsed(err, fields, files){
      callback(err, fields);
    });
  }else{
    // parsing GET request parameters
    var parsedUrl = url.parse(req.url, true);
    var params = parsedUrl.query;
    console.log(JSON.stringify(params));
    callback(error, params);
  }
}

function unprocessableEntityError(res, message){
    var response = {
      success : false,
      message : 'Unprocessable Entity Error: '+ message
    }
    res.writeHead(422, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(response));
    res.end('\n');
}

function internalServerError(res, message){
    var response = {
      success : false,
      message : 'Error: '+ message
    }
    res.writeHead(500, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(response));
    res.end('\n');
}

function verify_key(api_key, callback){
  var unirest = require('unirest');
  
  unirest.post('http://mintistry.appspot.com/verifyKey')
  .header('Accept', 'application/json')
  .send({ "api_key": api_key })
  .end(function (response) {
    var data = JSON.parse(response.body);
    if(data){
      callback(null, data['verified']);
    }else{
      callback('Could not read API key in database. Try again in a moment.', false);
    }
    
  });
 
}

function topUp(address, callback){
  contractFactory.getAbi(sendEther);

  function sendEther(error, abi){
    if(!error){
      var duration = 300;
      web3.personal.unlockAccount(web3.eth.coinbase, customAuth.getCoinbasePassword(), duration);
      var contract = web3.eth.contract(abi).at('0x1edf23b3d74c2c083a517a29c1a21282867c59ec');
      //first number is calculated value, second is an extra 10 % for leeway.
      //value is the fixed cost of the computational steps in processing the transaction function.

      var value = 1154400000000000 + 100000000000000;
      var amount = web3.eth.gasPrice * contract.issueCoin.estimateGas() + value;

      var transfersPerBlock = 10; //maximum number of transfers we 'gift' per block. 
      amount = amount * transfersPerBlock * 2; // we double because it takes another block to do the ether transfer
      
      var balance = web3.eth.getBalance(address);
      var amountRequired = amount - balance;
      console.log('balance: '+ balance);
      console.log('amount: '+ amount);
      console.log('amount required: '+ amountRequired)
      if(amountRequired > 0){
        web3.eth.sendTransaction({from: web3.eth.coinbase, to: address, value: amountRequired}, callback);
        console.log('transaction sent to top up account');
      }else{
        console.log('account does not need topping up');
        callback('account does not need topping up');
      }
    }else{
      callback(error);
    }
  }
  
  
}

module.exports = {
  getParams: getParams,
  unprocessableEntityError: unprocessableEntityError,
  internalServerError: internalServerError,
  verify_key:verify_key,
  topUp : topUp,
}