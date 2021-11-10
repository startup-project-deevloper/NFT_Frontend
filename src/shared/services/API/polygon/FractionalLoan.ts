import Web3 from "web3";
import { ContractInstance } from "shared/connectors/polygon/functions";

const ctoken_metadata = require("shared/connectors/polygon/contracts/CToken.json");

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
