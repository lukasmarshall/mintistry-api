var web3 = require('web3-custom').web3;
var http = require('http');
var url = require("url");
var utils = require('./utils.js');
var mongoose = require('mongoose');
var fs = require('fs');
var sys = require('sys');
var exec = require('child_process').exec;
var contractFactory = require('contractFactory');
var customAuth = require('customAuth');



//test request:
// http://127.0.0.1:1337/newCurrency?api_key=0123456789&issuer_addr=0x4bbc2ef7e5482b88e8c9c4bc05c5a3d3ff2b03c7&starting_amount=100&coin_name=dopecoin&

// there is no certainty that a transaction has ever been truly mined, given the possibility of forks
function handle(req, res, db){
  var contractSource;
  var tokenContract;
  var params = {};

  utils.getParams(req, validateRequest);

  function validateRequest(error, parameters){
    params = parameters;
    if(!params['api_key'] || !params['issuer_addr'] || !params['starting_amount'] || !params['coin_name']){ //make sure the corract parameters are present
      utils.unprocessableEntityError(res, "Required parameters not supplied. Requires api_key, issuer_addr, starting_amount, coin_name.");
    } else if(!utils.verify_key(params['api_key'])){ //verify the api key
      utils.unprocessableEntityError(res, "API Key is invalid.");
    }else{
      start();
    }
  }

  function start(){
    var duration = 300; //unlock the account for 300 seconds.
    web3.personal.unlockAccount(web3.eth.coinbase, customAuth.getCoinbasePassword(), duration, getContract);
  }

  function getContract(error){
    if(!error){
      contractFactory.getContract(deployContract);
    }else{
      utils.internalServerError(res, error);
    }
  }


  function deployContract(error, contractCompiled){
    if(!error){
      //define the contract object
      console.log(contractCompiled);
      var supply = 9000;
      ContractObject = web3.eth.contract(contractCompiled.customCoin.info.abiDefinition);
      var issuer = params['issuer_addr'];
      var coinName = params['coin_name'];
      //create a new instance of the contract object 
      var token = ContractObject.new(
        supply, 
        issuer,
        coinName,
        {
          from: web3.eth.accounts[0],
          data: contractCompiled.customCoin.code,
          gas: 1000000
        },
        contractSubmitted
      );

    }else{
      utils.internalServerError(res, error);
    }
  }

  function contractSubmitted(error, contract){ //callback
    if(!error){
      //TODO - it would be MUCH nicer if we just returned the transactionhash here 
      var message = 'Contract transaction sent. Mining can take up to 30 seconds. Query /checkMined with supplied transaction_hash to determine when contract has been mined / is active.'
      var response = {
        success : true,
        message : message,
        transaction_hash : contract.transactionHash
      }
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write( JSON.stringify(response) );
      res.end();
      console.log("Contract transaction sent: TransactionHash: " + contract.transactionHash + " waiting to be mined...");

      utils.topUp(params['issuer_addr'], console.log);
    }else{
      utils.internalServerError(res, error);
    }
  }
}

module.exports.handle = handle;