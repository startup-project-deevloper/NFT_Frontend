import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";

const copyrightNFT = network => {
  const metadata = require("shared/connectors/web3/contracts/CopyrightNFT.json");

  const setApprovalForToken = async (
    web3: Web3,
    account: string,
    tokenAddress: string,
    payload: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, tokenAddress);
        const gas = await contract.methods
          .approve(payload.to, payload.tokenId)
          .estimateGas({ from: account });
        await contract.methods.approve(payload.to, payload.tokenId).send({ from: account, gas: gas });
        resolve({ success: true });
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };
  return { setApprovalForToken };
};
export default copyrightNFT;
