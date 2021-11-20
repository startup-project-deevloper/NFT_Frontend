import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
import { Account } from "ethereumjs-util";

const reserveMarketplace = (network: string) => {
  const metadata = require("shared/connectors/web3/contracts/reserve/ReserveMarketplace.json");

  const cancelSaleReserveProposal = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contractAddress = config[network].CONTRACT_ADDRESSES.RESERVE_MARKETPLACE;
        const { tokenId, price, collateralPercent, reservePeriod, buyerAddress, paymentToken, setHash } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const gas = await contract.methods.cancelPurchaseReserveProposal(
          tokenId,
          paymentToken,
          price,
          collateralPercent,
          reservePeriod,
          buyerAddress
        ).estimateGas({ from: Account });

        const response = await contract.methods.cancelPurchaseReserveProposal(
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
  
  return { cancelSaleReserveProposal };
}

export default reserveMarketplace;