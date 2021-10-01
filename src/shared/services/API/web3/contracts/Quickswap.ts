import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
import { BigNumber } from "ethers";

const quickswap = (network) => {
  const factoryContractAddress = config[network].CONTRACT_ADDRESSES.QUICKSWAP_FACTORY_MANAGER;
  const factoryMetadaData = require(`shared/connectors/web3/contracts/QUICKSWAP_FACTORY_MANAGER.json`);
  const routerContractAddress = config[network].CONTRACT_ADDRESSES.QUICKSWAP_ROUTER_MANAGER;
  const routerMetadaData = require(`shared/connectors/web3/contracts/QUICKSWAP_ROUTER_MANAGER.json`);

  const swapTokensForExactTokens = async (web3: Web3, amountOut: BigNumber, amountInMax: BigNumber, path, to, deadline, account): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, routerMetadaData.abi, routerContractAddress);
        const gas = await contract.methods.swapTokensForExactTokens(amountOut, amountInMax, path, to, deadline)
            .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);

        const response = await contract.methods.swapTokensForExactTokens(amountOut, amountInMax, path, to, deadline)
            .send({ from: account, gas });
        console.log("transaction succeed");
        resolve({
          status: true,
          result: response
        });
      } catch (e) {
        console.log(e);
        resolve({
          status: false,
          message: e
        });
      }
    });
  };

  const getAmountsOut = async (web3: Web3, amountIn: BigNumber, path): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, routerMetadaData.abi, routerContractAddress);
        const response = await contract.methods.getAmountsOut(amountIn, path).call()
        resolve({
          status: true,
          result: response
        });
      } catch (e) {
        console.log(e);
        resolve({
          status: false,
          message: e
        });
      }
    });
  }
  
  return { swapTokensForExactTokens, getAmountsOut };
};

export default quickswap;
