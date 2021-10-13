import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";

const syntheticNFTAuction = (network: string) => {
  const metadata = require("shared/connectors/web3/contracts/NFTAuction.json");

  const bid = async (web3: Web3, account: string, collection: any, payload: any) => {
    return new Promise(async resolve => {
      try {
        const { amount, setHash } = payload;
        const {
          auctionData: { auctionAddress },
        } = collection;

        const contract = ContractInstance(web3, metadata.abi, auctionAddress);
        const gas = await contract.methods.bid(amount).estimateGas({ from: account });
        contract.methods
          .bid(amount)
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

  const withdraw = async (web3: Web3, account: string, auctionAddress: string, payload: any) => {
    return new Promise(async resolve => {
      try {
        const { setHash } = payload;

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

  const endAuction = async (web3: Web3, account: string, auctionAddress: string, payload: any) => {
    return new Promise(async resolve => {
      try {
        const { setHash } = payload;

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

  const auctionEndTime = async (web3: Web3, auctionAddress: string) => {
    return new Promise(async resolve => {
      try {
        console.log(auctionAddress);
        const contract = ContractInstance(web3, metadata.abi, auctionAddress);

        const result = await contract.methods.auctionEndTime().call();
        resolve(result);
      } catch (err) {
        console.log(err);
        resolve(null);
      }
    });
  };

  return { bid, withdraw, endAuction, auctionEndTime };
};

export default syntheticNFTAuction;
