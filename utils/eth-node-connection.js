const Web3 = require("web3");

class EthNodeConnection {
  static connection;

  static setEthNodeConnection(ethNodeUrl) {
    try {
      const web3 = new Web3(ethNodeUrl);
      EthNodeConnection.connection = web3;
      console.log("Connected to Mumbai matic node...");
    } catch (error) {
      console.log(`Connection with Mumbai matic node failed : ${error}`);
    }
  }

  static getEthNodeConnection() {
    return EthNodeConnection.connection;
  }
}

module.exports = { EthNodeConnection };
