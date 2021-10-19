import Web3 from "web3";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import JOT from "shared/services/API/web3/contracts/ERC20Tokens/JOT";
import { ContractInstance } from "shared/connectors/web3/functions";

const syntheticFractionalisationAuctionsManager = (network: string) => {
  const metadata = require("shared/connectors/web3/contracts/AuctionsManager.json");

  const startAuction = async (web3: Web3, account: string, collection: any, payload: any) => {
    return new Promise(async resolve => {
      try {
        const { tokenId, price, setHash } = payload;
        const { SyntheticCollectionManagerAddress, auctionAddress, JotAddress } = collection;

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        const contract = ContractInstance(web3, metadata.abi, auctionAddress);

        const approve = await jotAPI.approve(
          web3,
          account,
          JotAddress,
          auctionAddress,
          toNDecimals(price, decimals)
        );

        if (!approve) {
          resolve({ success: false });
        }

        const gas = await contract.methods
          .startAuction(SyntheticCollectionManagerAddress, tokenId, toNDecimals(price, decimals))
          .estimateGas({ from: account });
        const response = await contract.methods
          .startAuction(SyntheticCollectionManagerAddress, tokenId, toNDecimals(price, decimals))
          .send({ from: account, gas })
          .on("transactionHash", function (hash) {
            setHash(hash);
          });

        console.log(response)
        if (response) {
          resolve({
            success: true,
            data: {
              auctionContract: response.events.AuctionStarted.returnValues.auctionContract,
              collection: response.events.AuctionStarted.returnValues.collection,
              nftId: response.events.AuctionStarted.returnValues.nftId,
              openingBid: toDecimals(response.events.AuctionStarted.returnValues.openingBid, decimals),
            },
          });
        } else {
          resolve({ success: false });
        }
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
