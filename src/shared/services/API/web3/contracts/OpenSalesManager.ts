import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";

const openSalesManager = network => {
  const metadata = require("shared/connectors/web3/contracts/OpenSalesManager.json");
  const contractAddress = config[network].CONTRACT_ADDRESSES.OPEN_SALES_MANAGER;

  const approvePurchase = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log("Getting gas....");
        const gas = await contract.methods
          .approvePurchase(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.beneficiary,
            payload.sellerToMatch
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .approvePurchase(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.beneficiary,
            payload.sellerToMatch
          )
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");

        resolve({ success: true });
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
        });
      }
    });
  };

  const approveSale = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log("Getting gas....");
        const gas = await contract.methods
          .approveSale(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.beneficiary,
            payload.buyerToMatch
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .approveSale(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.beneficiary,
            payload.buyerToMatch
          )
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");

        resolve({ success: true });
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
        });
      }
    });
  };

  const cancelSaleProposal = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log("Getting gas....");
        const gas = await contract.methods
          .cancelSaleProposal(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.owner
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .cancelSaleProposal(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.owner
          )
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");

        resolve({ success: true });
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
        });
      }
    });
  };

  const cancelPurchaseProposal = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log("Getting gas....");
        const gas = await contract.methods
          .cancelPurchaseProposal(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.beneficiary
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .cancelPurchaseProposal(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.beneficiary
          )
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");

        resolve({ success: true });
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
        });
      }
    });
  };

  return { approvePurchase, approveSale, cancelSaleProposal, cancelPurchaseProposal };
};

export default openSalesManager;
