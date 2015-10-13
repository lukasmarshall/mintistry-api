var web3 = require('web3');
var http = require('http');
var url = require("url");
var utils = require('./utils.js');
var mongoose = require('mongoose');




//test request:
// http://127.0.0.1:1337/viewAddresses?api_key=0123456789&
function handle(req, res, db){
  var params = {};
  utils.getParams(req, verifyRequest);
  
  function verifyRequest(error, parameters){
    params = parameters;
    if(!params['api_key']){ //make sure the correct parameters are present
      utils.unprocessableEntityError(res, "Required parameters not supplied. Requires api_key.")
    } else if(!utils.verify_key(params['api_key'])){ //verify the api key
      utils.unprocessableEntityError(res, "API Key is invalid.")
    }else{
      var accounts = web3.eth.accounts;
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.write(String(accounts));
      res.end('\n');
    }   
  }
}


module.exports.handle = handle;