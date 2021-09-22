import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";

const syntheticCollectionManager = (network: string) => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.SYNTHETIC_COLLECTION_MANAGER;
  const jotContractAddress = config[network].CONTRACT_ADDRESSES.JOT;

  const metadata = require("shared/connectors/polygon/contracts/pix/SyntheticCollectionManager.json");
  const jotMetadata = require("shared/connectors/polygon/contracts/pix/Jot.json");
  const buyJotTokens = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, amount } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods.buyJotTokens(tokenId, amount).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .buyJotTokens(tokenId, amount)
          .send({ from: account, gas: gas });
        console.log("transaction succeed");
        resolve({
          data: {
            hash: response.transactionHash,
          },
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const updatePriceFraction = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, price } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods.updatePriceFraction(tokenId, price).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .updatePriceFraction(tokenId, price)
          .send({ from: account, gas: gas });
        console.log("transaction succeed");
        resolve({
          data: {
            hash: response.transactionHash,
          },
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const increaseSellingSupply = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, amount } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .increaseSellingSupply(tokenId, amount)
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .increaseSellingSupply(tokenId, amount)
          .send({ from: account, gas: gas });
        console.log("transaction succeed");
        resolve({
          data: {
            hash: response.transactionHash,
          },
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const decreaseSellingSupply = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, amount } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .decreaseSellingSupply(tokenId, amount)
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .decreaseSellingSupply(tokenId, amount)
          .send({ from: account, gas: gas });
        console.log("transaction succeed");
        resolve({
          data: {
            hash: response.transactionHash,
          },
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  return { buyJotTokens, updatePriceFraction, increaseSellingSupply, decreaseSellingSupply };
};

export default syntheticCollectionManager;
