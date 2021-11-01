import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import { StepIconClasskey } from "@material-ui/core";
import config from "shared/connectors/web3/config";
import JOT from "shared/services/API/web3/contracts/ERC20Tokens/JOT";
import { toNDecimals, toDecimals } from "shared/functions/web3";

const redemptionPool = (network: string) => {
  const metadata = require("shared/connectors/web3/contracts/RedemptionPool.json");

  const getTotalLiquidityToRedeem = async (
    web3: Web3,
    collection: any,
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { RedemptionPoolAddress, JotAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, RedemptionPoolAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        const response = await contract.methods.totalLiquidityToRedeeem().call();
        console.log("transaction succeed... ", response);
        resolve(response);
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const getJotsToRedeem = async (
    web3: Web3,
    collection: any,
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { RedemptionPoolAddress, JotAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, RedemptionPoolAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        const response = await contract.methods.jotsToRedeem().call();
        console.log("transaction succeed... ", response);
        resolve(response);
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const redeem = async (
    web3: Web3,
    account: StepIconClasskey,
    collection: any,
    payload: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { RedemptionPoolAddress, JotAddress } = collection;
        const { amount, setHash } = payload;

        const contract = ContractInstance(web3, metadata.abi, RedemptionPoolAddress);

        const jotAPI = JOT(network);
        const decimals = await jotAPI.decimals(web3, JotAddress);
        const tAmount = toNDecimals(amount, decimals);

        const gas = await contract.methods.redeem(amount).estimateGas({ from: account });
        console.log('estimated gas... ', gas);
        const response = await contract.methods
          .redeem(amount)
          .send({ from: account, gas: gas })
          .on("transactionHash", function (hash) {
            if (setHash) {
              setHash(hash);
            }
          });

        console.log('redeem repsonse... ', response);

      } catch (e) {
        console.log(e);
        resolve({ success: false });
      }
    });
  };

  return {
    getTotalLiquidityToRedeem,
    getJotsToRedeem,
    redeem
  };
}

export default redemptionPool;