
    var AddressModel = require('./AddressModel.js').get();
    AddressModel.find({ assigned: false }, function(err, addresses){

      res.writeHead(200, {'Content-Type': 'text/plain'});

      res.write('Unassigned Addresses:'+addresses.length+'\n');
      // res.write(String(addresses));

      for(var i = 0; i < addresses.length; i++) {
        addresses[i].assign('E____'+i);
        res.write(String(addresses[i]));
        console.log('LOOP');
        console.log(i);
      }

      AddressModel.find({ assigned: true }, function(err, assigned_addresses){
        res.write('\n\n\n\nAssigned Addresses:\n');
        res.write(String(assigned_addresses))
        res.end('\n');
      });
    });




    