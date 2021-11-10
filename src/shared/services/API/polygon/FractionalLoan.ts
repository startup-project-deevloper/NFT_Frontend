import Web3 from "web3";
import { ContractInstance } from "shared/connectors/polygon/functions";

const ctoken_metadata = require("shared/connectors/polygon/contracts/CToken.json");
const markets = require("shared/connectors/polygon/contracts/Markets.json");

export async function lend(
  web3: Web3,
  account: string,
  contract_address: string,
  amount: number,
  setTxnHash?: (hash: string) => void)
  : Promise<any> {

  const contract = ContractInstance(web3, ctoken_metadata.abi, contract_address);

  console.log("Getting gas....");
  const gas = await contract.methods.mint(amount).estimateGas({ from: account });
  console.log("calced gas price is.... ", gas);
  const response = await contract.methods
    .mint(amount)
    .send({ from: account, gas: gas })
    .on("transactionHash", hash => {
      setTxnHash && setTxnHash(hash);
    });
  return response;
}

export async function enter(
  web3: Web3,
  account: string,
  contract_address: string,
  asset_address: string,
  setTxnHash?: (hash: string) => void)
  : Promise<any> {

  const contract = ContractInstance(web3, markets.abi, contract_address);

  console.log("Getting gas....");
  const gas = await contract.methods.enterMarket(asset_address).estimateGas({ from: account });
  console.log("calced gas price is.... ", gas);
  const response = await contract.methods
    .enterMarket(asset_address)
    .send({ from: account, gas: gas })
    .on("transactionHash", hash => {
      setTxnHash && setTxnHash(hash);
    });
  return response;
}

export async function isEntered(
  web3: Web3,
  account: string,
  contract_address: string,
  asset_address: string)
  : Promise<any> {

  const contract = ContractInstance(web3, markets.abi, contract_address);

  const response = await contract.methods.isEntered(asset_address, account).call();
  
  return response;
}

export async function getAccountLiquidity(
  web3: Web3,
  account: string,
  contract_address: string)
  : Promise<any> {

  const contract = ContractInstance(web3, markets.abi, contract_address);

  const response = await contract.methods.getAccountLiquidity(account).call();
  
  return response;
}


export async function borrow(
  web3: Web3,
  account: string,
  contract_address: string,
  amount: number,
  setTxnHash?: (hash: string) => void)
  : Promise<any> {

  const contract = ContractInstance(web3, ctoken_metadata.abi, contract_address);

  console.log("Getting gas....");
  const gas = await contract.methods.borrow(amount).estimateGas({ from: account });
  console.log("calced gas price is.... ", gas);
  const response = await contract.methods
    .borrow(amount)
    .send({ from: account, gas: gas })
    .on("transactionHash", hash => {
      setTxnHash && setTxnHash(hash);
    });
  return response;
}
