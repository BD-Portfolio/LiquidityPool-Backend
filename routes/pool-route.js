const express = require("express");
const {
  mintTokenTransaction,
  depositTokenTransaction,
  withdrawTokenTransaction,
} = require("../controllers/pool-controller");

const router = express.Router();

router.post("/mint", mintTokenTransaction);

router.post("/deposit", depositTokenTransaction);

router.post("/withdraw", withdrawTokenTransaction);

module.exports = { router };
