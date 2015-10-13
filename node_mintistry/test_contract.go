init{
	this.store[this.original] = 10**20
}

main{
	// temporarily store to-address and value in a big integer. 
	// it has been written in as an argument to the contract request and is accessed with this.data[0]
	big to = this.data[0]
	big value = this.data[1]

	//temporarily store the address of the sender (the origin of the request)
	big from = this.origin()
	
	//we want to make absolutely sure the person has enough money to send.
	if this.store[from] >= value {
		//if so, subtract the value amount from the sender's account in the data store
		this.store[from] = this.store[from] - value
		//and add the value amount to the recipient's account in the data store
		this.store[to] = this.store[to] + value
	}
}