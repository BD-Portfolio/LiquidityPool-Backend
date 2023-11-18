const { EthNodeConnection } = require("./eth-node-connection");

// returns buffered gas limit
const getBufferedGasLimit = (gasLimit) => {
  return Math.round(Number(gasLimit) + Number(gasLimit) * Number(0.2));
};

// executes blockchain transaction
const executeTransaction = async (
  web3,
  sender,
  bufferedGasLimit,
  contractAddress,
  encodedData,
  privateKey
) => {
  try {
    // fetch current gas price
    const gasPrice = await web3.eth.getGasPrice();

    // calculating total transaction fee
    const transactionFee = Number(gasPrice) * Number(bufferedGasLimit);

    // fetch MATIC balance of user account
    const balanceInWei = await web3.eth.getBalance(sender);

    if (transactionFee <= Number(balanceInWei)) {
      // create transaction object
      const tx = {
        gas: web3.utils.toHex(bufferedGasLimit),
        to: contractAddress,
        data: encodedData,
        from: sender,
      };

      // sign transaction using private key
      const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);

      console.log("Transaction hash: ", signedTx.transactionHash);
      console.log("Waiting for transaction to get confirmed...");

      // send the signed transaction
      await web3.eth.sendSignedTransaction(signedTx.rawTransaction);

      console.log("Transaction confirmed...");

      return {
        status: true,
        hash: signedTx.transactionHash,
      };
    } else {
      return {
        status: false,
        message:
          "User account doesn't have enough MATIC to pay transaction fee",
      };
    }
  } catch (error) {
    console.log("Error in executing transaction: ", error);
    return {
      status: false,
      message: "Exception occured",
    };
  }
};

// creates a mint transaction
const createMintTransaction = async (
  sender,
  amount,
  contract,
  contractAddress,
  privateKey
) => {
  try {
    const web3 = EthNodeConnection.getEthNodeConnection();

    // calculate gas limit for the mint transaction
    const gasLimit = await contract.methods
      .mintTokens(sender, amount)
      .estimateGas({
        from: sender,
      });

    // adding 20% buffer to the gas limit for executing transaction fast
    const bufferedGasLimit = getBufferedGasLimit(gasLimit);

    // encode the function with abi
    const encodedData = contract.methods.mintTokens(sender, amount).encodeABI();

    // execute the transaction
    return await executeTransaction(
      web3,
      sender,
      bufferedGasLimit,
      contractAddress,
      encodedData,
      privateKey
    );
  } catch (error) {
    console.log("Error in executing transaction: ", error);
    return {
      status: false,
      message: "Exception occured",
    };
  }
};

// creates a deposit transaction
const createDepositTransaction = async (
  sender,
  amount,
  contract,
  contractAddress,
  privateKey
) => {
  try {
    const web3 = EthNodeConnection.getEthNodeConnection();

    // calculate gas limit for the mint transaction
    const gasLimit = await contract.methods.deposit(amount).estimateGas({
      from: sender,
    });

    // adding 20% buffer to the gas limit for executing transaction fast
    const bufferedGasLimit = getBufferedGasLimit(gasLimit);

    // encode the function with abi
    const encodedData = contract.methods.deposit(amount).encodeABI();

    // execute the transaction
    return await executeTransaction(
      web3,
      sender,
      bufferedGasLimit,
      contractAddress,
      encodedData,
      privateKey
    );
  } catch (error) {
    console.log("Error in executing transaction: ", error);
    return {
      status: false,
      message: "Exception occured",
    };
  }
};

// creates a approval transaction
const createApprovalTransaction = async (
  sender,
  amount,
  contract,
  contractAddress,
  privateKey
) => {
  try {
    const web3 = EthNodeConnection.getEthNodeConnection();

    // calculate gas limit for the approve transaction
    const gasLimit = await contract.methods.approve(
      process.env.LIQUIDITY_POOL_CONTRACT_ADDRESS,
      amount).estimateGas({
        from: sender,
      });

    // adding 20% buffer to the gas limit for executing transaction fast
    const bufferedGasLimit = getBufferedGasLimit(gasLimit);

    // encode the function with abi
    const encodedData = contract.methods.approve(
      process.env.LIQUIDITY_POOL_CONTRACT_ADDRESS,
      amount).encodeABI();

    // execute the transaction
    return await executeTransaction(
      web3,
      sender,
      bufferedGasLimit,
      contractAddress,
      encodedData,
      privateKey
    );
  } catch (error) {
    console.log("Error in executing transaction: ", error);
    return {
      status: false,
      message: "Exception occured",
    };
  }
};

// creates a withdraw transaction
const createWithdrawTransaction = async (
  sender,
  amount,
  contract,
  contractAddress,
  privateKey
) => {
  try {
    const web3 = EthNodeConnection.getEthNodeConnection();

    // calculate gas limit for the mint transaction
    const gasLimit = await contract.methods.withdraw(amount).estimateGas({
      from: sender,
    });

    // adding 20% buffer to the gas limit for executing transaction fast
    const bufferedGasLimit = getBufferedGasLimit(gasLimit);

    // encode the function with abi
    const encodedData = contract.methods.withdraw(amount).encodeABI();

    // execute the transaction
    return await executeTransaction(
      web3,
      sender,
      bufferedGasLimit,
      contractAddress,
      encodedData,
      privateKey
    );
  } catch (error) {
    console.log("Error in executing transaction: ", error);
    return {
      status: false,
      message: "Exception occured",
    };
  }
};

// function to connect to smart contract
const connectToContract = (web3, abi, contractAddress) => {
  try {
    return new web3.eth.Contract(abi, contractAddress);
  } catch (error) {
    console.log("Error in creating instance of contract: ", error);
    return null;
  }
};

module.exports = {
  connectToContract,
  createMintTransaction,
  createDepositTransaction,
  createWithdrawTransaction,
  createApprovalTransaction
};
