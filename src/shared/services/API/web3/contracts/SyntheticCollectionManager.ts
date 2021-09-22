import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";

const syntheticCollectionManager = (network: string) => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.SYNTHETIC_COLLECTION_MANAGER;
  const metadata = require("shared/connectors/polygon/contracts/pix/SyntheticCollectionManager.json");

  const buyJotTokens = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenId, amount } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods.BuyJotTokens(tokenId, amount).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .BuyJotTokens(tokenId, amount)
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

  return { buyJotTokens };
};

export default syntheticCollectionManager;
