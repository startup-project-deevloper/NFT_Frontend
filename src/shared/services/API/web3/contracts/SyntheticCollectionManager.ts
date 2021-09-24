import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
import JOT from "shared/services/API/web3/contracts/ERC20Tokens/JOT";
import { toNDecimals } from "shared/functions/web3";

const syntheticCollectionManager = (network: string) => {
  const metadata = require("shared/connectors/web3/contracts/SyntheticCollectionManager.json");

  const buyJotTokens = async (web3: Web3, account: string, collection: any, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, amount } = payload;
        const { SyntheticCollectionManagerAddress, JotAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);
        const allowance = await jotAPI.allowance(web3, JotAddress, {
          owner: account,
          spender: SyntheticCollectionManagerAddress,
        });
        console.log(allowance);
        const approve1 = await jotAPI.approve(
          web3,
          account,
          JotAddress,
          SyntheticCollectionManagerAddress,
          toNDecimals(amount, decimals)
        );

        const approve2 = await jotAPI.approve(
          web3,
          account,
          JotAddress,
          config[network].CONTRACT_ADDRESSES.JOT_POOL,
          toNDecimals(amount, decimals)
        );

        if (!approve1 || !approve2) {
          resolve(null);
          return;
        }

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

  const updatePriceFraction = async (
    web3: Web3,
    account: string,
    collection: any,
    payload: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, price } = payload;
        const { SyntheticCollectionManagerAddress, JotAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

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

  const increaseSellingSupply = async (
    web3: Web3,
    account: string,
    collection: any,
    payload: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, amount } = payload;
        const { SyntheticCollectionManagerAddress, JotAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

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

  const decreaseSellingSupply = async (
    web3: Web3,
    account: string,
    collection: any,
    payload: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, amount } = payload;
        const { SyntheticCollectionManagerAddress, JotAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

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
