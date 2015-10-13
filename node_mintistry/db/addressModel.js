var mongoose = require('mongoose');
function get(){
	var addressSchema = new mongoose.Schema({
      assigned: Boolean,
      address: String,
      assigned_to: String,
      updated_at: { type: Date, default: Date.now },
    });

    addressSchema.methods.assign = function (assign_addr) {

		this.update({assigned:true, assigned_to:assign_addr},function(err){
			if(!err){
				console.log('success, new address assigned');
			}else{
				console.log('error: '+err);
			}
		});
		
	}

	
	try{
		//as a getter
    	var AddressModel = mongoose.model('Address');
	}catch(err){
		console.log(err);
		//as a setter
		var AddressModel = mongoose.model('Address', addressSchema);
	}
	

      
    return AddressModel
}

module.exports.get = get;