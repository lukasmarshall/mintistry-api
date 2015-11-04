var web3 = require('web3-custom').web3;
var http = require('http');
var url = require("url");
var utils = require('./utils.js');
var mongoose = require('mongoose');
var sys = require('sys')
var exec = require('child_process').exec;


//test request:
// http://127.0.0.1:1337/newAddress?api_key=0123456789&password=password&

function handle(req, res, db){
  var new_address = '';
  var params = {};
  utils.getParams(req, verifyRequest);

  function verifyRequest(error, parameters){
    params = parameters;
    if(error){
      utils.unprocessableEntityError(res, error);
    }if(!params['api_key'] || !params['password']){ //make sure the correct parameters are present
      console.log('Unprocessable Entity - params: ');
      console.log(params);
      utils.unprocessableEntityError(res, "Required parameters not supplied. Requires api_key, password.")
    } else{
      utils.verify_key(params['api_key'], start);
    }   
  }

  function start(error, verified){
    if(!error){
      if(verified){
        web3.personal.newAccount(params['password'], accountCreated);
      }else{
        utils.unprocessableEntityError(res, "API Key is invalid.");
      }
    }else{
      utils.internalServerError(res, error);
    }
  }

  function accountCreated(error, address){ 
    var response = {
      success : true,
      message : 'address successfully created',
      new_addr : address
    }
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(response));
    res.end('\n');
  }

}






module.exports.handle = handle;