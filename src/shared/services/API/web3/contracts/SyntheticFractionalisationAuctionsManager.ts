import Web3 from "web3";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import { ContractInstance } from "shared/connectors/web3/functions";

const syntheticFractionalisationAuctionsManager = (network: string) => {
  const metadata = require("shared/connectors/web3/contracts/AuctionsManager.json");

  const startAuction = async (web3: Web3, account: string, collection: any, payload: any) => {
    return new Promise(async resolve => {
      try {
        const { tokenId, price, setHash } = payload;
        const { SyntheticCollectionManagerAddress, auctionAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, auctionAddress);
        const gas = await contract.methods
          .startAuction(SyntheticCollectionManagerAddress, tokenId, price)
          .estimateGas({ from: account });
        contract.methods
          .startAuction(SyntheticCollectionManagerAddress, tokenId, price)
          .send({ from: account, gas })
          .on("transactionHash", function (hash) {
            setHash(hash);
          })
          .on("receipt", function (receipt) {
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

  const getRecoverableTill = (web3: Web3, collection: any, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId } = payload;
        const { SyntheticCollectionManagerAddress, auctionAddress } = collection;
        const contract = ContractInstance(web3, metadata.abi, auctionAddress);

        const result = await contract.methods
          .isRecoverableTill(SyntheticCollectionManagerAddress, tokenId)
          .call();
        resolve({ success: true, endTime: result });
      } catch (err) {
        console.log(err);
        resolve({ success: false });
      }
    });
  };
  return { startAuction, getRecoverableTill };
};

export default syntheticFractionalisationAuctionsManager;
