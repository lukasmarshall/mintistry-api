var web3 = require('web3-custom').web3;
var http = require('http');
var url = require("url");
var utils = require('./utils.js');
var mongoose = require('mongoose');
var fs = require('fs');
var sys = require('sys')
var exec = require('child_process').exec;


//test request:
// http://127.0.0.1:1337/checkMined?api_key=0123456789&transaction_hash=0x3628d9eebdc4a8ffa762749af0e93db9777d73ddcdfedc76282d4639eae86e2d?

// there is no certainty that a transaction has ever been truly mined, given the possibility of forks
function handle(req, res, db){

  var contractSource;
  var tokenContract;
  var params = {};
  utils.getParams(req, verifyRequest);

  function verifyRequest(error, parameters){
    params = parameters;
    if(error){
      utils.unprocessableEntityError(res, error);
    }if(!params['api_key'] || !params['transaction_hash']){ //make sure the corract parameters are present
      utils.unprocessableEntityError(res, "Required parameters not supplied. Requires api_key, transaction_hash.");
    } else if(!utils.verify_key(params['api_key'])){ //verify the api key
      utils.unprocessableEntityError(res, "API Key is invalid.");
    }else{
      start();
    }
  }

  function start(){
      web3.eth.getTransactionReceipt(params['transaction_hash'], checkMined);
  }

  function checkMined(error, transactionReceipt){
     if(!error){
      if(!transactionReceipt){ //no transaction receipt = contract hasn't been mined.
        var response = {
          success : true,
          mined : false,
          message : 'contract not yet mined - please try again shortly and ensure transaction hash is correct',
          contract_addr: "",
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(response));
        res.end('\n');
      }else{ //transactionr eceipt = contract mined.
        var response = {
          success : true,
          mined : true,
          message : 'contract mined - check contract_addr parameter for the contract address',
          contract_addr : transactionReceipt.contractAddress
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.write(JSON.stringify(response));
        res.end('\n');
      }
   
    }else{
      utils.internalServerError(res, e);
    }
  }
}

module.exports.handle = handle;

