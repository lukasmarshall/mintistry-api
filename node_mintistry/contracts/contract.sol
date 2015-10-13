/*This is an untested contract, for loading/testing purposes only*/
contract customCoin { 
  mapping (address => uint) public balance;
  event CoinTransfer(address from_address, address to_address, uint amount);
  event CoinIssue(address issuer, address to_address, uint amount);
  address public issuer;
  bytes32 public name;

  /* Initialize contract with initial supply tokens to the coin issuer */
  function customCoin(uint supply, address coin_issuer, bytes32 coin_name) {
    balance[coin_issuer] = supply;
    issuer = coin_issuer;
    name = coin_name;
  }

  /* Simple coin sending function */
  function send(address to_address, uint amount) returns(uint success) {
    if (balance[msg.sender] < amount) return 0;
    balance[msg.sender] -= amount;
    balance[to_address] += amount;
    CoinTransfer(msg.sender, to_address, amount);
    return 1;
  }

  /* Simple coin sending function again but with a from address, to comply with metacoin standard. */
  function send(address to_address, uint amount, address from_address) returns(uint success) {
    if (msg.sender != from_address) return 0;
    if (balance[from_address] < amount) return 0;
    balance[from_address] -= amount;
    balance[to_address] += amount;
    CoinTransfer(from_address, to_address, amount);
    return 1;
  }

  /*Allows the issuer to create new coins in an individual's account. */
  function issueCoin(address to_address, uint amount) returns(bool success) {
    if (msg.sender != issuer) return 0;
    balance[to_address] += amount;
    CoinIssue(msg.sender, to_address, amount);
    return 1;
  }

  /*Allows the coin to be decoupled from any mintistry-linked addresses.*/
  function changeIssuer(address newIssuer) returns(bool success){
    if(msg.sender != issuer) return 0;
    issuer = newIssuer;
    return 1;
  }

}