import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import { StepIconClasskey } from "@material-ui/core";
import config from "shared/connectors/web3/config";
import JOT from "shared/services/API/web3/contracts/ERC20Tokens/JOT";
import { toNDecimals } from "shared/functions/web3";

const jotPool = (network: string) => {
  const metadata = require("shared/connectors/web3/contracts/JotPool.json");

  const addLiquidity = async (
    web3: Web3,
    account: StepIconClasskey,
    collection: any,
    payload: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { amount } = payload;
        const { JotPoolAddress, JotAddress } = collection;

        const contract = ContractInstance(web3, metadata.abi, JotPoolAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);
        const tAmount = toNDecimals(amount, decimals);

        const approve = await jotAPI.approve(web3, account, JotAddress, JotPoolAddress, tAmount);

        console.log("approve.... ", approve);
        if (!approve) {
          resolve(null);
        }

        console.log("Getting gas....", amount);
        const gas = await contract.methods.addLiquidity(tAmount).estimateGas({ from: account });

        console.log("calced gas price is.... ", gas);
        const response = await contract.methods.addLiquidity(tAmount).send({ from: account, gas: gas });
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

  return {
    addLiquidity,
  };
};

export default jotPool;
