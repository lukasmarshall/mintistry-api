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
    }else if(!params['account_addr'] || !params['coin_addr'] || !params['api_key']){ //make sure the corract parameters are present
      utils.unprocessableEntityError(res, "Required parameters not supplied. Requires account_addr, coin_addr, api_key.")
    }else{
      utils.verify_key(params['api_key'],start);
    }
  }


  function start(error, verified){
    if(!error){
      if(verified){
        contractFactory.getAbi(getBalance);
      }else{
        utils.unprocessableEntityError(res, "API Key is invalid.");
      }
    }else{
      utils.internalServerError(res, error);
    }
  }

  function getBalance(error, abi){
    if(!error){
      var bal = web3.eth.contract(abi).at(params['coin_addr']).balance(params['account_addr']);
      var name = web3.eth.contract(abi).at(params['coin_addr']).name();
      var issuer = web3.eth.contract(abi).at(params['coin_addr']).issuer();
      response = {
        success : true,
        message : "Successfully retrieved balance.",
        account_addr : params['account_addr'],
        coin_addr : params['coin_addr'],
        balance : parseInt(bal),
        coin_name : String(name),
      }
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(response));
      res.end('\n');
      // res.write('Looked at address '+params['account_addr']+" at coin address "+params['coin_addr']+"\n\n");
      // res.write('Balance is '+bal+'\n');
      // res.write('Coin name: '+ String(name)+'\n');
      // res.write('Issuer: '+String(issuer)+'\n');
      // res.end('\n');

    }else{
      utils.internalServerError(res, error)
    }
  }
}


module.exports.handle = handle;