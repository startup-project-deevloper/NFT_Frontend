import axios from "axios";
import Web3 from "web3";
import URL from "shared/functions/getURL";
import { ContractInstance } from "shared/connectors/polygon/functions";
import config from "shared/connectors/polygon/config";
import PolygonAPI from "shared/services/API/polygon";

const pod_withdraw_manager_metadata = require("shared/connectors/polygon/contracts/PodWithdrawManager.json");

export async function returnPodTokens(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        pod_withdraw_manager_metadata.abi,
        config.CONTRACT_ADDRESSES.POD_WITHDRAW_MANAGER
      );

      console.log(contract.events);
      //   contract.events.CreateMedia(async (error, event) => {
      //     if (!error) {
      //       resolve({ success: true });
      //     }
      //   });

      const gas = await contract.methods.returnPodTokens(payload).estimateGas({ from: account });
      const response = await contract.methods.returnPodTokens(payload).send({ from: account, gas });
      console.log(response);
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}
