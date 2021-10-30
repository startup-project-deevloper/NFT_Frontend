

import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";

const quickSwapAddress = (network: string) => {
  const metadata = require("shared/connectors/web3/contracts/QUICKSWAP_ROUTER_MANAGER.json");

  const addLiquidityToQuickswap = async (web3: Web3, account: string, nft: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { quickSwapAddress, SyntheticID: tokenId, amount, setHash } = nft;

        const contract = ContractInstance(web3, metadata.abi, quickSwapAddress);

        const gas = await contract.methods
          .addLiquidityToQuickswap(tokenId, amount)
          .estimateGas({ from: account });
        const response = await contract.methods
          .addLiquidityToQuickswap(tokenId, amount)
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            if (setHash) {
              setHash(hash);
            }
          });;;
        const liquidityResponse = response.events?.LiquidiyAdded?.returnValues;

        if (liquidityResponse) {
          resolve({ success: true, share: liquidityResponse.share, shareOff: liquidityResponse.shareOff, amount: liquidityResponse.amount });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  const withdrawLiquidityFromQuickswap = async (web3: Web3, account: string, nft: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { quickSwapAddress, SyntheticID: tokenId, amount, setHash } = nft;

        const contract = ContractInstance(web3, metadata.abi, quickSwapAddress);

        const gas = await contract.methods
          .withdrawLiquidityFromQuickswap(tokenId, amount)
          .estimateGas({ from: account });
        const response = await contract.methods
          .withdrawLiquidityFromQuickswap(tokenId, amount)
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            if (setHash) {
              setHash(hash);
            }
          });;;
        const liquidityResponse = response.events?.LiquidiyAdded?.returnValues;

        if (liquidityResponse) {
          resolve({ success: true, share: liquidityResponse.share, shareOff: liquidityResponse.shareOff, amount: liquidityResponse.amount });
        } else {
          resolve({ success: false });
        }
      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  return {
    addLiquidityToQuickswap,
    withdrawLiquidityFromQuickswap,
  }
}

export default quickSwapAddress;
