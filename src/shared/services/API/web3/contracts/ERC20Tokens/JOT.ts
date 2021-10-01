import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
import { toNDecimals } from "shared/functions/web3";

const jot = network => {
  const metadata = require("shared/connectors/web3/contracts/Jot.json");

  const approve = async (
    web3: Web3,
    account: string,
    contractAddress: string,
    spender: string,
    amount: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const approveAmount = amount || toNDecimals(1, 30);

        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log("Getting gas....");
        const gas = await contract.methods.approve(spender, approveAmount).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .approve(spender, approveAmount)
          .send({ from: account, gas: gas });

        if (response) {
          console.log("transaction succeed");
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (e) {
        console.log(e);
        resolve(false);
      }
    });
  };

  const allowance = async (web3: Web3, contractAddress: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        contract.methods.allowance(payload.owner, payload.spender).call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            console.log("transaction succeed ", result);
            resolve(result);
          }
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const balanceOf = async (web3: Web3, contractAddress: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        contract.methods.balanceOf(payload.account).call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            console.log("transaction succeed ", result);
            resolve(result);
          }
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const decimals = async (web3: Web3, contractAddress: string): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        contract.methods.decimals().call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            console.log("transaction succeed ", result);
            resolve(result);
          }
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  return { approve, allowance, balanceOf, decimals };
};

export default jot;
