import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
const loan = network => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.ERC721_COLLATRALISE_AUCTION;
  const metadata = require("shared/connectors/web3/contracts/ERC721Auction.json");

  const createAuction = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .createAuction(
            payload.tokenContractAddress,
            payload.tokenId,
            payload.startPrice,
            payload.startTimestamp,
            payload.endTimestamp,
            payload.fee,
            payload.fundTokenAddress
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .createAuction(
            payload.tokenContractAddress,
            payload.tokenId,
            payload.startPrice,
            payload.startTimestamp,
            payload.endTimestamp,
            payload.fee,
            payload.fundTokenAddress
          )
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed ", response);
        const result = {
          data: response.events.AuctionCreated.returnValues,
          transaction: {
            From: response.from,
            To: response.to,
            Id: response.transactionHash,
            Date: new Date().getTime(),
          },
        };
        resolve(result);
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };
  const placeBid = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log("Getting gas....");
        const gas = await contract.methods
          .placeBid(payload.tokenContractAddress, payload.tokenId, payload.bidAmount)
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .placeBid(payload.tokenContractAddress, payload.tokenId, payload.bidAmount)
          .send({ from: account, gas: gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log("transaction succeed ", response);
        const result = {
          data: response.events.BidPlaced.returnValues,
          transaction: {
            From: response.from,
            To: response.to,
            Id: response.transactionHash,
            Date: new Date().getTime(),
          },
        };
        resolve(result);
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };
  const withdrawFunds = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        console.log("Getting gas....");
        const gas = await contract.methods
          .withdrawFunds(payload.tokenContractAddress, payload.tokenId, payload.withdrawAmount)
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .withdrawFunds(payload.tokenContractAddress, payload.tokenId, payload.withdrawAmount)
          .send({ from: account, gas: gas });
        console.log("transaction succeed ", response);
        const result = {
          data: response.events.FundWithdrawn.returnValues,
          transaction: {
            From: response.from,
            To: response.to,
            Id: response.transactionHash,
            Date: new Date().getTime(),
          },
        };
        resolve(result);
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };
  const returnFunds = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .returnFunds(payload.tokenContractAddress, payload.tokenId, payload.returnAmount)
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .returnFunds(payload.tokenContractAddress, payload.tokenId, payload.returnAmount)
          .send({ from: account, gas: gas });
        console.log("transaction succeed ", response);
        const result = {
          data: response.events.FundReturned.returnValues,
          transaction: {
            From: response.from,
            To: response.to,
            Id: response.transactionHash,
            Date: new Date().getTime(),
          },
        };
        resolve(result);
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };
  const endAuction = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods
          .endAuction(payload.tokenContractAddress, payload.tokenId)
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .endAuction(payload.tokenContractAddress, payload.tokenId)
          .send({ from: account, gas: gas });
        console.log("transaction succeed ", response);
        const result = {
          data: response.events.AuctionEnded.returnValues,
          transaction: {
            From: response.from,
            To: response.to,
            Id: response.transactionHash,
            Date: new Date().getTime(),
          },
        };
        resolve(result);
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };
  const getAuction = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        contract.methods.getAuction(payload.tokenContractAddress, payload.tokenId).call((err, result) => {
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
  const getBidList = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        contract.methods.getBidList(payload.tokenContractAddress, payload.tokenId).call((err, result) => {
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
  const getAvailableFunds = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);
        contract.methods
          .getAvailableFunds(payload.tokenContractAddress, payload.tokenId)
          .call((err, result) => {
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
  return {
    createAuction,
    placeBid,
    withdrawFunds,
    returnFunds,
    endAuction,
    getAuction,
    getBidList,
    getAvailableFunds,
  };
};
export default loan;
