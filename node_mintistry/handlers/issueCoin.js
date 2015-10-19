var web3 = require('web3');
var http = require('http');
var url = require("url");
var utils = require('./utils.js');
var fs = require('fs');
var contractFactory = require('contractFactory');

//test request:
// http://127.0.0.1:1337/getBalance?coin_addr=0x407d73d8a49eeb85d32cf465507dd71d507100c1&account_addr=0&
function handle(req, res){
  var params = {};
  utils.getParams(req, validateRequest);

  function validateRequest(error, parameters){
    params = parameters;
    if(error){
      utils.unprocessableEntityError(req, error);
    }else if(!params['issuer_addr'] || !params['issuer_password'] || !params['coin_addr'] || !params['receiver_addr'] || !params['api_key'] || !params['amount']){ //make sure the corract parameters are present
      utils.unprocessableEntityError(res, "Required parameters not supplied. Requires issuer_addr, issuer_password, receiver_addr, coin_addr, api_key, amount.")
    }else{
      utils.verify_key(params['api_key'], start);
    }
  }


  function start(error, verified){
    if(!error){
      if(verified){
        contractFactory.getAbi(issueCoin);
      }else{
        utils.unprocessableEntityError(res, "API Key is invalid.");
      }
    }else{
      utils.internalServerError(res, error);
    }
  }

  function issueCoin(error, abi){
    var duration = 300;
    web3.personal.unlockAccount(params['issuer_addr'], params['issuer_password'], duration);
    var contract = web3.eth.contract(abi).at(params['coin_addr']);
    var cost = web3.eth.gasPrice * contract.issueCoin.estimateGas();
    //transfer the required amount of wei into the issuer account
    console.log(contract.issueCoin);
    var transaction = {
      from : params['issuer_addr'],
    }
    
    contract.issueCoin.sendTransaction(params['receiver_addr'], parseInt(params['amount']), transaction, generateResponse);
  }


  function generateResponse(error, success){
    if(!error){
      console.log('contract returned: '+success);
      if(success == 1){
        response = {
          success : true,
          message : "Successfully issued coins.",
          amount : parseInt(params['amount']),
          issuer_addr : params['issuer_addr'],
          receiver_addr : params['receiver_addr'],
          coin_addr : params['coin_addr'],
          coin_name : String(name),
          issuer : String(issuer),  
        }
      }else{
        response = {
          success : false,
          message : "Coins were not issued. Please check issuer address and password.",
          amount : parseInt(params['amount']),
          issuer_addr : params['issuer_addr'],
          receiver_addr : params['receiver_addr'],
          coin_addr : params['coin_addr'],
          coin_name : String(name),
          issuer : String(issuer),  
        }
      }
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(response));
      res.end('\n');
      utils.topUp(params['issuer_addr'], console.log);
    }else{
      utils.internalServerError(res, error)
    }
  }
}


module.exports.handle = handle;