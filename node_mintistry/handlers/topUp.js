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
    } else{
      utils.verify_key(params['api_key'], start);
    }
  }

  function start(error, verified){
    if(!error){
      if(verified){
        utils.topUp(params['account_addr'], generateResponse);
      }else{
        utils.unprocessableEntityError(res, "API Key is invalid.");
      }
    }else{
      utils.internalServerError(res, error);
    }
  }
  
  function generateResponse(error, hash){
    if(!error){
      if (!hash){
        response = {
          success : false,
          message : "The account already has enough ether.",
          account_addr : params['account_addr'],
        }
      }else{
        response = {
          success : true,
          message : "Successfully topped up account. Funds should appear within 30 seconds.",
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