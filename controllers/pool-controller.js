const {
  mintTransaction,
  depositTransaction,
  withdrawTransaction,
} = require("../services/pool-service");

const mintTokenTransaction = async (req, res) => {
  const response = await mintTransaction(req);
  res.json(response).status(response.httpStatus);
};

const depositTokenTransaction = async (req, res) => {
  const response = await depositTransaction(req);
  res.json(response).status(response.httpStatus);
};

const withdrawTokenTransaction = async (req, res) => {
  const response = await withdrawTransaction(req);
  res.json(response).status(response.httpStatus);
};

module.exports = {
  mintTokenTransaction,
  depositTokenTransaction,
  withdrawTokenTransaction,
};
