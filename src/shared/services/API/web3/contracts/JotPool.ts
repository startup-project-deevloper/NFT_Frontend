import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import { StepIconClasskey } from "@material-ui/core";
import config from "shared/connectors/web3/config";
import JOT from "shared/services/API/web3/contracts/ERC20Tokens/JOT";
import { toNDecimals, toDecimals } from "shared/functions/web3";

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
        const { amount, setHash } = payload;
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

        console.log("Getting gas....", tAmount);
        const gas = await contract.methods.addLiquidity(tAmount).estimateGas({ from: account });

        const response = await contract.methods
          .addLiquidity(tAmount)
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });

        console.log("addLiquidity response.... ", response);

        const { blockNumber } = response;

        await new Promise(resolve => setTimeout(resolve, 60000));

        await contract.getPastEvents(
          "LiquidityAdded",
          {
            fromBlock: blockNumber,
            toBlock: "latest",
          },
          (error, events) => {
            console.log("LiquidityAdded events", events);
            if (events.length) {
              const { returnValues } = events[0];
              if (returnValues.mintedLiquidity) {
                resolve(true);
              } else {
                resolve(false);
              }
            }
            resolve(false);
          }
        );

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

  const removeLiquidity = async (
    web3: Web3,
    account: StepIconClasskey,
    collection: any,
    payload: any
  ): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { amount, setHash } = payload;
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

        const gas = await contract.methods.removeLiquidity(amount).estimateGas({ from: account });

        const response = await contract.methods
          .removeLiquidity(amount)
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });

        console.log("removeLiquidity response.... ", response);

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

  const getPosition = async (web3: Web3, account: StepIconClasskey, collection: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { JotPoolAddress, JotAddress } = collection;
        const contract = ContractInstance(web3, metadata.abi, JotPoolAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        const balance = await jotAPI.balanceOf(web3, JotAddress, { account });

        const position = await contract.methods.getPositionByAddress(account).call();
        const totalLiquidity = Number(await contract.methods.totalLiquidity().call());

        const shareAmount = +position.liquidity;
        const poolOwnership = totalLiquidity ? shareAmount / totalLiquidity : 0;
        const myLiquidityValue = poolOwnership * balance;

        if (position) {
          resolve({
            shareAmount,
            poolOwnership: Math.floor(poolOwnership * 100 * 100) / 100,
            myLiquidityValue: toDecimals(myLiquidityValue, decimals),
            totalLiquidity,
          });
        } else {
          resolve(null);
        }
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const getLiquidityValue = async (web3: Web3, account: string, collection: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { JotPoolAddress } = collection;
        const contract = ContractInstance(web3, metadata.abi, JotPoolAddress);

        const response = await contract.methods.getLiquidityValue(account).call();

        if (response) {
          resolve(response);
        } else {
          resolve(null);
        }
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const getTotalLiquidity = async (web3: Web3, collection: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { JotPoolAddress } = collection;
        const contract = ContractInstance(web3, metadata.abi, JotPoolAddress);

        const response = await contract.methods.totalLiquidity().call();

        if (response) {
          resolve(response);
        } else {
          resolve(null);
        }
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const getReward = async (web3: Web3, collection: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { JotPoolAddress } = collection;
        const contract = ContractInstance(web3, metadata.abi, JotPoolAddress);

        const response = await contract.methods.getReward().call();

        if (response) {
          resolve(response);
        } else {
          resolve(null);
        }
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const getTotalStake = async (web3: Web3, collection: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { JotPoolAddress, JotAddress } = collection;
        const contract = ContractInstance(web3, metadata.abi, JotPoolAddress);

        const jotAPI = JOT(network);

        const decimals = await jotAPI.decimals(web3, JotAddress);

        contract.methods.totalStaked().call((err, result) => {
          if (err) {
            console.log(err);
            resolve(null);
          } else {
            console.log("transaction succeed ", result);
            resolve(toDecimals(result, decimals));
          }
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  return {
    addLiquidity,
    removeLiquidity,
    getPosition,
    getLiquidityValue,
    getReward,
    getTotalLiquidity,
    getTotalStake,
  };
};

export default jotPool;
