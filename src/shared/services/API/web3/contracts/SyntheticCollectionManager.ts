import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import JOT from "shared/services/API/web3/contracts/ERC20Tokens/JOT";
import { toDecimals, toNDecimals } from "shared/functions/web3";

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

        console.log("Getting gas....");
        const gas = await contract.methods
          .buyJotTokens(tokenId, toNDecimals(amount, decimals))
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .buyJotTokens(tokenId, toNDecimals(amount, decimals))
          .send({ from: account, gas: gas });
        console.log("transaction succeed");

        resolve({
          success: true,
          data: {
            hash: response.transactionHash,
          },
        });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const getOwnerSupply = (web3: Web3, collection: any, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId } = payload;
        const { SyntheticCollectionManagerAddress, JotAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        contract.methods.getOwnerSupply(tokenId).call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            resolve(toDecimals(result, decimals));
          }
        });
      } catch (err) {
        console.log(err);
        resolve({ success: false });
      }
    });
  };

  const flipJot = async (web3: Web3, account: string, collection: any, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, prediction } = payload;
        const { SyntheticCollectionManagerAddress } = collection;
        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        console.log("Getting gas....");
        const isAllowedToFlipGas = await contract.methods
          .isAllowedToFlip(tokenId)
          .estimateGas({ from: account });

        console.log("Estimated gas....", isAllowedToFlipGas);

        const isAllowedToFlip = await contract.methods
          .isAllowedToFlip(tokenId)
          .call({ from: account, gas: isAllowedToFlipGas });

        console.log("Is Allowed to flip? --", isAllowedToFlip);

        if (!isAllowedToFlip) {
          resolve(null);
        }

        console.log("Getting gas... ", prediction, tokenId);

        const gas = await contract.methods.flipJot(tokenId, prediction).estimateGas({ from: account });
        console.log("polygon gas...", gas);

        const response = await contract.methods
          .flipJot(tokenId, parseInt(prediction))
          .send({ from: account, gas });

        const {
          events: {
            CoinFlipped: { blockNumber },
          },
        } = response;

        console.log(" --- response ....", response);

        const res = contract.events
          .FlipProcessed({
            fromBlock: blockNumber,
            toBlock: blockNumber + 3,
          })
          .on("data", event => console.log("data", event))
          .on("changed", changed => console.log("changed", changed))
          .on("error", err => console.log("err", err))
          .on("connected", str => {
            console.log("conected", str);
          });

        console.log("flipProcessed event...", res);

        const subscription = web3.eth
          .subscribe(
            "logs",
            {
              address: SyntheticCollectionManagerAddress,
            },
            (err, result) => {
              console.log("subscribe ... ", err, result);
            }
          )
          .on("data", data => {
            console.log("data ... ", data);
          })
          .on("changed", data => {
            console.log("onChanged... ", data);
          })
          .on("error", err => console.log("err", err))
          .on("connected", str => {
            console.log("conected", str);
          });

        console.log("subscription...", subscription);
        resolve(response);
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
        const { SyntheticCollectionManagerAddress } = collection;

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

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .increaseSellingSupply(tokenId, toNDecimals(amount, decimals))
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .increaseSellingSupply(tokenId, toNDecimals(amount, decimals))
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

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .decreaseSellingSupply(tokenId, toNDecimals(amount, decimals))
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .decreaseSellingSupply(tokenId, toNDecimals(amount, decimals))
          .send({ from: account, gas: gas });
        console.log(response);
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

  const getSellingSupply = async (web3: Web3, collection: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { SyntheticCollectionManagerAddress, JotAddress, SyntheticID } = collection;
        const contract = ContractInstance(web3, metadata.abi, SyntheticCollectionManagerAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        contract.methods.getSellingSupply(SyntheticID).call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            console.log("transaction succeed ", result);
            resolve(toDecimals(result, decimals));
          }
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };
  return {
    buyJotTokens,
    updatePriceFraction,
    increaseSellingSupply,
    decreaseSellingSupply,
    flipJot,
    getSellingSupply,
    getOwnerSupply,
  };
};

export default syntheticCollectionManager;
