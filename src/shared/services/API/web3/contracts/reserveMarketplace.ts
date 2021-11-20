import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
import { Account } from "ethereumjs-util";

const reserveMarketplace = (network: string) => {
  const metadata = require("shared/connectors/web3/contracts/reserve/ReserveMarketplace.json");
  const contractAddress = config[network].CONTRACT_ADDRESSES.RESERVE_MARKETPLACE;

  const cancelSaleReserveProposal = async (
    web3: Web3,
    account: string,
    collection: any,
    payload: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contractAddress = config[network].CONTRACT_ADDRESSES.RESERVE_MARKETPLACE;
        const { tokenId, price, collateralPercent, reservePeriod, buyerAddress, paymentToken, setHash } =
          payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const gas = await contract.methods
          .cancelPurchaseReserveProposal(
            tokenId,
            paymentToken,
            price,
            collateralPercent,
            reservePeriod,
            buyerAddress
          )
          .estimateGas({ from: Account });

        const response = await contract.methods
          .cancelPurchaseReserveProposal(
            tokenId,
            paymentToken,
            price,
            collateralPercent,
            reservePeriod,
            buyerAddress
          )
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });

        console.log("transaction succeed... ", response);
        resolve(response);
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const approveReserveToBuy = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log("Getting gas....");
        const gas = await contract.methods
          .approveReserveToBuy(
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
          .approveReserveToBuy(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.collateralPercent * 100,
            payload.beneficiary,
            payload.reservePeriod,
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

  const approveReserveToSell = async (
    web3: Web3,
    account: string,
    payload: any,
    setHash: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log("Getting gas....");
        console.log("payload", payload);
        const gas = await contract.methods
          .approveReserveToSell(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.beneficiary,
            payload.collateralPercent,
            payload.reservePeriod,
            payload.buyerToMatch
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .approveReserveToSell(
            payload.collection,
            payload.tokenId,
            payload.paymentToken,
            payload.price,
            payload.beneficiary,
            payload.collateralPercent,
            payload.reservePeriod,
            payload.buyerToMatch
          )
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed");
        const offer = response.events.SaleReserveProposed?.returnValues;
        resolve({ success: true, offer });
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
        });
      }
    });
  };

  return { cancelSaleReserveProposal, approveReserveToBuy, approveReserveToSell };
};

export default reserveMarketplace;
