import Web3 from "web3";
import TRAXlaunchpadVesting from "shared/contracts/PriviZoo/TRAXlaunchpadVesting.json";
import PIXlaunchpadVesting from "shared/contracts/PriviZoo/PIXlaunchpadVesting.json";
import { VESTING_CONTRACT_ADDRESS, IDOTokenSymbol } from "./const";
import { toFixedDigits } from "./utils";

const LaunchpadVestingAbis = {
  TRAX: TRAXlaunchpadVesting.abi,
  PIX: PIXlaunchpadVesting.abi,
};

export const ContractInstance = (web3: Web3, abi: any, address: string): any => {
  const contract = new web3.eth.Contract(abi, address);
  return contract;
};

export const getReleasableAmount = async (web3: Web3, account: string, token: IDOTokenSymbol = "TRAX") => {
  const contract = ContractInstance(web3, LaunchpadVestingAbis[token], VESTING_CONTRACT_ADDRESS[token]);

  const result = await contract.methods.getReleasableAmount(account).call();

  const etherAmount = web3.utils.fromWei(result, "ether").toString();

  return toFixedDigits(etherAmount);
};

type Result = {
  beneficiary: string;
  amount: number;
  lockId: number;
  txHash: string;
};

export const claimToken = async (
  web3: Web3,
  account: string,
  token: IDOTokenSymbol = "TRAX"
): Promise<Result> => {
  return new Promise(async (resolve, reject) => {
    try {
      // let txHash = "";
      const contract = ContractInstance(web3, LaunchpadVestingAbis[token], VESTING_CONTRACT_ADDRESS[token]);

      console.log("claimToken", { account, token, contract: VESTING_CONTRACT_ADDRESS[token] });

      const gas = await contract.methods.ASelfClaimToMyWallet().estimateGas({ from: account });

      contract.methods
        .ASelfClaimToMyWallet()
        .send({ from: account, type: "0x2", gas }, async (error, txHash) => {
          console.log("release txHash", txHash);

          await new Promise(resolveSleep => setTimeout(resolveSleep, 1000));
          const currentBlock = await web3.eth.getBlockNumber();

          const timerId = setInterval(() => {
            contract.getPastEvents(
              "TokenReleased",
              {
                filter: {},
                fromBlock: currentBlock * 1.0 - 1000,
                toBlock: "latest",
              },
              function (error: any, events: any) {
                try {
                  if (error) throw Error;

                  if (Array.isArray(events) && events.length > 0) {
                    for (let i = 0; i < events.length; i++) {
                      const event = events[events.length - i - 1];

                      const { beneficiary, amount, lockId } = event.returnValues;

                      if (beneficiary != account) continue;
                      if (event.transactionHash !== txHash) continue;
                      console.log("release success", event);

                      clearInterval(timerId);
                      resolve({
                        beneficiary,
                        amount: Number(amount),
                        lockId: Number(lockId),
                        txHash: event.transactionHash,
                      });
                    }
                  } else {
                    throw new Error("No events found");
                  }
                } catch (e) {
                  clearInterval(timerId);
                  reject(e);
                }
              }
            );
          }, 2000);
        });

      // Listen to the TokenReleased event
    } catch (e) {
      console.log(">>>>>>>>>>>>>>>>>", e);
      reject(e);
    }
  });
};
