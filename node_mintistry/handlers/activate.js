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
    }else if(!params['account_addr'] || !params['api_key']){ //make sure the corract parameters are present
      utils.unprocessableEntityError(res, "Required parameters not supplied. Requires account_addr, api_key.")
    } else if(!utils.verify_key(params['api_key'])){ //verify the api key
      utils.unprocessableEntityError(res, "API Key is invalid.")
    }else{
      start();
    }
  }

  function start(){
      utils.topUp(params['account_addr'], generateResponse);
  }

  function generateResponse(error, hash){
    if(!error){
      if (!hash){
        response = {
          success : false,
          message : "The account already has enough ether to be considered active. Transactions will work and Mintistry will keep this account topped up.",
          account_addr : params['account_addr'],
        }
      }else{
        response = {
          success : true,
          message : "Successfully activated account. Funds should appear within 1 block ie. 20-30 seconds.",
          account_addr : params['account_addr'],
        }
      }
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(response));
      res.end('\n');

    }else{
      utils.internalServerError(res, error)
    }
  }
}


module.exports.handle = handle;