import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
import JOT from "shared/services/API/web3/contracts/ERC20Tokens/JOT";
import { toNDecimals } from "shared/functions/web3";

const syntheticProtocolRouter = (network: string) => {
  const metadata = require("shared/connectors/web3/contracts/SyntheticProtocolRouter.json");
  const contractAddress = config[network].CONTRACT_ADDRESSES.SYNTHETIC_PROTOCOL_ROUTER;
  const jotContractAddress = config[network].CONTRACT_ADDRESSES.JOT;

  const registerNFT = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { tokenAddress, chainId, supply, price, name, symbol } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, jotContractAddress);

        // const tPrice = toNDecimals(+price, decimals);
        const tSupply = toNDecimals(+supply, decimals);

        const gas = await contract.methods
          .registerNFT(tokenAddress, chainId, tSupply, price, name, symbol, "")
          .estimateGas({ from: account });
        const response = await contract.methods
          .registerNFT(tokenAddress, chainId, tSupply, price, name, symbol, "")
          .send({ from: account, gas });

        resolve({
          hash: response.transactionHash,
          collection: response.events?.CollectionManagerRegistered?.returnValues,
          nftInfo: response.events?.TokenRegistered?.returnValues,
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  return { registerNFT };
};

export default syntheticProtocolRouter;
