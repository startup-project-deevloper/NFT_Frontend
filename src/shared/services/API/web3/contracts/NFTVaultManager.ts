import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/ethereum/config";
import NFTVaultManager from "shared/connectors/ethereum/contracts/NFTVaultManager.json";

export const lockNFT = (web3: Web3, account: string, payload: any): Promise<any> => {
  return new Promise(async resolve => {
    try {
      const { tokenAddress, tokenId, setHash } = payload;
      const contractAddress = config.CONTRACT_ADDRESSES.NFT_VAULT_MANAGER;
      const contract = ContractInstance(web3, NFTVaultManager.abi, contractAddress);
      const gas = await contract.methods.lockNFT(tokenAddress, tokenId).estimateGas({ from: account });
      await contract.methods
        .lockNFT(tokenAddress, tokenId)
        .send({ from: account, gas })
        .on("transactionHash", hash => {
          setHash(hash);
        });
      resolve({ status: true });
    } catch (err) {
      resolve({ status: false });
    }
  });
};

export const requestUnlockNFT = (web3: Web3, account: string, payload: any): Promise<any> => {
  return new Promise(async resolve => {
    try {
      const { tokenAddress, tokenId, setHash } = payload;
      const contractAddress = config.CONTRACT_ADDRESSES.NFT_VAULT_MANAGER;
      const contract = ContractInstance(web3, NFTVaultManager.abi, contractAddress);
      let gas = await contract.methods.requestUnlock(tokenAddress, tokenId).estimateGas({ from: account });
      let response = await contract.methods
        .requestUnlock(tokenAddress, tokenId)
        .send({ from: account, gas })
        .on("transactionHash", hash => {
          setHash(hash);
        });
      console.log("requestUnlockNFT response", response);
      const {
        events: {
          UnlockRequested: {
            blockNumber,
            returnValues: { requestId },
          },
        },
      } = response;

      await new Promise(resolve => setTimeout(resolve, 50000));

      await contract.getPastEvents(
        "WithdrawResponseReceived",
        {
          fromBlock: blockNumber,
          toBlock: "latest",
        },
        (error, events) => {
          console.log("events", events);
          const event = events
            .map(res => ({ ...res.returnValues, hash: res.transactionHash }))
            .find(res => res.requestId === requestId);
          if (!event?.newOwner || event?.newOwner === "0x0000000000000000000000000000000000000000") {
            resolve({ status: false });
          } else {
            resolve({ status: true });
          }
        }
      );
    } catch (err) {
      resolve({ status: false });
    }
  });
};

export const withdrawNFT = (web3: Web3, account: string, payload: any): Promise<any> => {
  return new Promise(async resolve => {
    try {
      const { tokenAddress, tokenId, setHash } = payload;
      const contractAddress = config.CONTRACT_ADDRESSES.NFT_VAULT_MANAGER;
      const contract = ContractInstance(web3, NFTVaultManager.abi, contractAddress);
      const gas = await contract.methods.withdraw(tokenAddress, tokenId).estimateGas({ from: account });
      await contract.methods
        .withdraw(tokenAddress, tokenId)
        .send({ from: account, gas })
        .on("transactionHash", hash => {
          setHash(hash);
        });
      resolve({ status: true });
    } catch (err) {
      resolve({ status: false });
    }
  });
};
