const { insertNftDetails } = require("../database/mongodb");
const { EthNodeConnection } = require("../utils/eth-node-connection");
const { createRewardNftMetadata } = require("../utils/web3-transaction-utils");

const getTxLogs = async (txDetails) => {

  const web3 = EthNodeConnection.getEthNodeConnection();

  // get tx receipt
  const transactionReceipt = await web3.eth.getTransactionReceipt(txDetails.hash);

  // get logs and the data from tx receipt
  const topics = transactionReceipt.logs[transactionReceipt.logs.length - 2].topics;

  // decode encoded data from topics and extract nft id
  const nftId = Number(web3.eth.abi.decodeParameter("uint256", topics[topics.length - 1]));

  // get nft object
  const nftObject = createRewardNftMetadata(txDetails.nftUuid, nftId, txDetails.userId, txDetails.hash);

  await insertNftDetails(nftObject);

}

module.exports = { getTxLogs };