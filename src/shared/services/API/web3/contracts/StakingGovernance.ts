import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";

const stakingGovernance = network => {
  const metadata = require("shared/connectors/web3/contracts/StakingGovernance.json");

  const propose = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { contractAddress, targets, values, calldatas, description } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const gas = await contract.methods
          .propose(targets, values, calldatas, description)
          .estimateGas({ from: account });

        const response = await contract.methods
          .propose(targets, values, calldatas, description)
          .send({ from: account, gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });

        resolve({
          success: true,
          data: {
            proposalId: response.events.ProposalCreated.returnValues.proposalId,
            description: response.events.ProposalCreated.returnValues.description,
            hash: response.transactionHash,
          },
        });
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
        });
      }
    });
  };

  const proposalDeadline = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { contractAddress, proposalId } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods.proposalDeadline(proposalId).call();
        resolve(response);
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const proposalVotes = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { contractAddress, proposalId } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods.proposalVotes(proposalId).call();

        resolve(response);
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const proposalSnapshot = async (web3: Web3, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { contractAddress, proposalId } = payload;

        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const response = await contract.methods.proposalSnapshot(proposalId).call();

        resolve(response);
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const castVote = async (web3: Web3, account: string, payload: any, setHash: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { contractAddress, proposalId, support } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const gas = await contract.methods.castVote(proposalId, support).estimateGas({ from: account });

        const response = await contract.methods
          .castVote(proposalId, support)
          .send({ from: account, gas })
          .on("transactionHash", hash => {
            setHash(hash);
          });
        console.log(response);
        resolve({
          success: true,
          data: {
            hash: response.transactionHash,
          },
        });
      } catch (e) {
        console.log(e);
        resolve({
          success: false,
        });
      }
    });
  };

  return { propose, proposalDeadline, proposalVotes, proposalSnapshot, castVote };
};

export default stakingGovernance;
