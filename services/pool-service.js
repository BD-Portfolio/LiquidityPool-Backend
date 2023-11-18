const Web3 = require("web3");
const {
  createMintTransaction,
  connectToContract,
  createDepositTransaction,
  createApprovalTransaction,
  createWithdrawTransaction,
} = require("../utils/web3-transaction-utils");
const { depositTokenAbi } = require("./../utils/abis/deposit-token-abi");
const { poolContractAbi } = require("../utils/abis/pool-contract-abi");
const { EthNodeConnection } = require("../utils/eth-node-connection");

const mintTransaction = async (req) => {
  console.log("Mint transaction in progres...");
  try {
    // reads amount to mint from the body
    const { amount } = req.body;

    // check it is valid amount
    if (!parseInt(amount)) {
      return {
        httpStatus: 400,
        message: "Mint transaction failed!",
        data: null,
        error: "Amount must be a valid number",
      };
    }

    // convert it into wei
    const weiAmount = Web3.utils.toWei(amount.toString(), "ether");

    // get the web3 connetion
    const web3 = EthNodeConnection.getEthNodeConnection();

    // create contract instance
    const depositTokenContract = connectToContract(
      web3,
      depositTokenAbi,
      process.env.DEPOSIT_TOKEN_CONTRACT_ADDRESS
    );

    // execute transaction
    const result = await createMintTransaction(
      process.env.MUMBAI_MATIC_ACCOUNT_WALLET_ADDRESS,
      weiAmount.toString(),
      depositTokenContract,
      process.env.DEPOSIT_TOKEN_CONTRACT_ADDRESS,
      process.env.MUMBAI_MATIC_ACCOUNT_PRIVATE_KEY
    );

    if (result.status) {
      return {
        httpStatus: 200,
        message: "Mint transaction succcessful!",
        data: {
          hash: process.env.EXPLORER_URL.toString().concat(result.hash),
        },
        error: null,
      };
    } else {
      return {
        httpStatus: 400,
        message: "Mint transaction failed!",
        data: {
          message: result.message,
        },
        error: null,
      };
    }
  } catch (error) {
    console.log("Failed to mint deposit tokens :- ", error);
    return {
      httpStatus: 500,
      message: "Internal Server Error",
      data: null,
      error: error,
    };
  }
};

const depositTransaction = async (req) => {
  console.log("Deposit transaction in progres...");
  try {
    // reads amount to deposit in the pool from the body
    const { amount } = req.body;

    // check it is valid amount
    if (!parseInt(amount)) {
      return {
        httpStatus: 400,
        message: "Deposit transaction failed!",
        data: null,
        error: "Amount must be a valid number",
      };
    }

    // convert it into wei
    const weiAmount = Web3.utils.toWei(amount.toString(), "ether");

    // get the web3 connetion
    const web3 = EthNodeConnection.getEthNodeConnection();

    // create contract instance
    const depositTokenContract = connectToContract(
      web3,
      depositTokenAbi,
      process.env.DEPOSIT_TOKEN_CONTRACT_ADDRESS
    );

    // execute approve transaction
    const approvedTx = await createApprovalTransaction(
      process.env.MUMBAI_MATIC_ACCOUNT_WALLET_ADDRESS,
      weiAmount.toString(),
      depositTokenContract,
      process.env.DEPOSIT_TOKEN_CONTRACT_ADDRESS,
      process.env.MUMBAI_MATIC_ACCOUNT_PRIVATE_KEY
    );

    if (!approvedTx.status) {
      return {
        httpStatus: 400,
        message: "Deposit transaction failed as couldn't approve tokens!",
        data: {
          message: approvedTx.message,
        },
        error: null,
      };
    }

    // create contract instance
    const poolTokenContract = connectToContract(
      web3,
      poolContractAbi,
      process.env.LIQUIDITY_POOL_CONTRACT_ADDRESS
    );

    // execute transaction
    const result = await createDepositTransaction(
      process.env.MUMBAI_MATIC_ACCOUNT_WALLET_ADDRESS,
      weiAmount.toString(),
      poolTokenContract,
      process.env.LIQUIDITY_POOL_CONTRACT_ADDRESS,
      process.env.MUMBAI_MATIC_ACCOUNT_PRIVATE_KEY
    );

    if (result.status) {
      return {
        httpStatus: 200,
        message: "Deposit transaction succcessful!",
        data: {
          hash: process.env.EXPLORER_URL.toString().concat(result.hash),
        },
        error: null,
      };
    } else {
      return {
        httpStatus: 400,
        message: "Deposit transaction failed!",
        data: {
          message: result.message,
        },
        error: null,
      };
    }
  } catch (error) {
    console.log("Failed to deposit tokens in liquidty pool :- ", error);
    return {
      httpStatus: 500,
      message: "Internal Server Error",
      data: null,
      error: error,
    };
  }
};

const withdrawTransaction = async (req) => {
  console.log("Withdraw transaction in progres...");
  try {
    // reads amount to withdraw from the pool from the body
    const { amount } = req.body;

    // check it is valid amount
    if (!parseInt(amount)) {
      return {
        httpStatus: 400,
        message: "Withdraw transaction failed!",
        data: null,
        error: "Amount must be a valid number",
      };
    }

    // convert it into wei
    const weiAmount = Web3.utils.toWei(amount.toString(), "ether");

    // get the web3 connetion
    const web3 = EthNodeConnection.getEthNodeConnection();

    // create contract instance
    const poolTokenContract = connectToContract(
      web3,
      poolContractAbi,
      process.env.LIQUIDITY_POOL_CONTRACT_ADDRESS
    );

    // execute transaction
    const result = await createWithdrawTransaction(
      process.env.MUMBAI_MATIC_ACCOUNT_WALLET_ADDRESS,
      weiAmount.toString(),
      poolTokenContract,
      process.env.LIQUIDITY_POOL_CONTRACT_ADDRESS,
      process.env.MUMBAI_MATIC_ACCOUNT_PRIVATE_KEY
    );

    if (result.status) {
      return {
        httpStatus: 200,
        message: "Withdraw transaction succcessful!",
        data: {
          hash: process.env.EXPLORER_URL.toString().concat(result.hash),
        },
        error: null,
      };
    } else {
      return {
        httpStatus: 400,
        message: "Withdraw transaction failed!",
        data: {
          message: result.message,
        },
        error: null,
      };
    }
  } catch (error) {
    console.log("Failed to withdraw tokens from liquidty pool :- ", error);
    return {
      httpStatus: 500,
      message: "Internal Server Error",
      data: null,
      error: error,
    };
  }
};

module.exports = {
  mintTransaction,
  depositTransaction,
  withdrawTransaction
};
