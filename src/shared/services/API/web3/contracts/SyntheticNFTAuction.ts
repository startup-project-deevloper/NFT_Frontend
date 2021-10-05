import Web3 from "web3";
import { toNDecimals } from "shared/functions/web3";
import JOT from "shared/services/API/web3/contracts/ERC20Tokens/JOT";
import { ContractInstance } from "shared/connectors/web3/functions";

const syntheticNFTAuction = (network: string) => {
  const metadata = require("shared/connectors/web3/contracts/NFTAuction.json");

  const bid = async (web3: Web3, account: string, collection: any, payload: any) => {
    return new Promise(async resolve => {
      try {
        const { amount, setHash } = payload;
        const { auctionAddress, JotAddress } = collection;

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        const contract = ContractInstance(web3, metadata.abi, auctionAddress);
        const gas = await contract.methods.bid(toNDecimals(amount, decimals)).estimateGas({ from: account });
        contract.methods
          .bid(toNDecimals(amount, decimals))
          .send({ from: account, gas })
          .on("transactionHash", function (hash) {
            setHash(hash);
          })
          .on("receipt", function (receipt) {
            console.log(receipt);
            resolve({
              success: true,
              data: {
                hash: receipt.transactionHash,
              },
            });
          })
          .on("error", e => {
            console.log(e);
            resolve({ success: false });
          });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const withdraw = async (web3: Web3, account: string, collection: any, payload: any) => {
    return new Promise(async resolve => {
      try {
        const { setHash } = payload;
        const { auctionAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, auctionAddress);
        const gas = await contract.methods.withdraw().estimateGas({ from: account });
        contract.methods
          .withdraw()
          .send({ from: account, gas })
          .on("transactionHash", function (hash) {
            setHash(hash);
          })
          .on("receipt", function (receipt) {
            console.log(receipt);
            resolve({
              success: true,
              data: {
                hash: receipt.transactionHash,
              },
            });
          })
          .on("error", e => {
            console.log(e);
            resolve({ success: false });
          });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const endAuction = async (web3: Web3, account: string, collection: any, payload: any) => {
    return new Promise(async resolve => {
      try {
        const { setHash } = payload;
        const { auctionAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, auctionAddress);
        const gas = await contract.methods.endAuction().estimateGas({ from: account });
        contract.methods
          .endAuction()
          .send({ from: account, gas })
          .on("transactionHash", function (hash) {
            setHash(hash);
          })
          .on("receipt", function (receipt) {
            console.log(receipt);
            resolve({
              success: true,
              data: {
                hash: receipt.transactionHash,
              },
            });
          })
          .on("error", e => {
            console.log(e);
            resolve({ success: false });
          });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  return { bid, withdraw, endAuction };
};

export default syntheticNFTAuction;
