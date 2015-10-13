var mongoose = require('mongoose');
mongoose.connect('127.0.0.1:27017');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
  console.log('Mongoose Connected');
});