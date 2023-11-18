const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { EthNodeConnection } = require("./utils/eth-node-connection");
const { router } = require("./routes/pool-route");
require("dotenv").config();

const app = express();

// cors setting for frontend application
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  methods: "GET, PUT, POST, DELETE, PATCH",
};

// handles resource not found
const resourceNotFound = (req, res) => {
  res.status(404).json({ message: "Resource not found!" });
  res.data = { message: "Resource not found!" };
  return res;
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/app", router);

// handles resource not found
app.use(resourceNotFound);

app.listen(`${process.env.PORT}`, async () => {
  try {
    console.log(`Listening on port : ${process.env.PORT}`);
    EthNodeConnection.setEthNodeConnection(
      `${process.env.MUMBAI_MATIC_RPC_URL}`
    );
  } catch (error) {
    console.log(`Listening on port ${process.env.PORT} failed : ${error}`);
  }
});
