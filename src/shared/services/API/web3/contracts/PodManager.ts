import Web3 from "web3";
import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";

const podManager = network => {
  const contractAddress = config[network].CONTRACT_ADDRESSES.POD_MANAGER;
  const metadata = require("shared/connectors/web3/contracts/PodManager.json");

  const registerPodProposal = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        const pod = {
          owners: payload.Collabs.map(collab => collab.address) || [],
          podAddress: contractAddress,
          fundingDate: payload.FundingDate,
          spread: 10,
          fundingToken: config[network].TOKEN_ADDRESSES[payload.FundingToken],
          fundingTokenPrice: payload.FundingPrice,
          fundingTarget: payload.FundingTarget,
        };
        const mediaIds = payload.Medias?.map(media => web3.utils.keccak256(media.Title)) || [];
        const royaltyPercentage = payload.Royalty;
        const podDescription = {
          podTokenName: payload.TokenName,
          podTokenSymbol: payload.TokenSymbol,
        };
        const copyrightTokenSupply = payload.CopyRightSupply;
        const copyrightAllocation = [
          ...payload.CreatorsData.map(data => data.sharingPercent),
          payload.InvestorShare,
        ];

        console.log("Getting gas....");
        const gas = await contract.methods
          .registerPodProposal(
            pod,
            mediaIds,
            royaltyPercentage,
            podDescription,
            copyrightTokenSupply,
            copyrightAllocation
          )
          .estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods
          .registerPodProposal(
            pod,
            mediaIds,
            royaltyPercentage,
            podDescription,
            copyrightTokenSupply,
            copyrightAllocation
          )
          .send({ from: account, gas: gas });
        console.log("transaction succeed");
        resolve({
          data: {
            id: response.events.PodProposalCreated.returnValues.id,
          },
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const voteForPodProposal = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { id } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods.voteForPodProposal(id).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods.voteForPodProposal(id).send({ from: account, gas: gas });
        console.log("transaction succeed");
        resolve({
          data: {
            id: response.events.ProposalVoted.returnValues.id,
            voter: response.events.ProposalVoted.returnValues.voter,
          },
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  const executePodProposal = async (web3: Web3, account: string, payload: any): Promise<any> => {
    return new Promise(async resolve => {
      try {
        const { id } = payload;
        const contract = ContractInstance(web3, metadata.abi, contractAddress);

        console.log("Getting gas....");
        const gas = await contract.methods.executePodProposal(id).estimateGas({ from: account });
        console.log("calced gas price is.... ", gas);
        const response = await contract.methods.executePodProposal(id).send({ from: account, gas: gas });
        console.log("transaction succeed");
        console.log(response);
        resolve({
          data: {
            podAddress: response.events.CreatePod.returnValues.podAddress,
          },
        });
      } catch (e) {
        console.log(e);
        resolve(null);
      }
    });
  };

  return { registerPodProposal, voteForPodProposal, executePodProposal };
};

export default podManager;

// export async function initiatePod(web3: Web3, account: string, payload: any): Promise<any> {
//   return new Promise(async resolve => {
//     try {
//       const contract = ContractInstance(
//         web3,
//         pod_manager_metadata.abi,
//         config.CONTRACT_ADDRESSES.POD_MANAGER
//       );

//       const pod = {
//         owners: [payload.main.PodInfo.Creator],
//         podAddress: config.CONTRACT_ADDRESSES.POD_MANAGER,
//         fundingDate: payload.main.PodInfo.FundingDate,
//         spread: payload.main.PodInfo.Spread * 100,
//         fundingToken: config.TOKEN_ADDRESSES[payload.main.PodInfo.FundingToken],
//         fundingTokenPrice: payload.main.PodInfo.FundingTokenPrice,
//         fundingTarget: payload.main.PodInfo.FundingTarget,
//         sharingShare: payload.main.PodInfo.SharingPercent,
//         investorShare: payload.main.PodInfo.InvestorShare,
//         royalty: payload.main.PodInfo.Royalty,
//       };

//       const mediaIds = payload.main.Medias?.map(media => web3.utils.keccak256(media.MediaSymbol)) || [];
//       const maxPrice = payload.main.PodInfo.MaxPrice;
//       const maxSupply = payload.main.PodInfo.MaxSupply;
//       const ammType = web3.utils.keccak256(payload.main.PodInfo.AMM.toLowerCase());
//       const owners = [payload.main.PodInfo.Creator];

//       const gas = await contract.methods
//         .initiatePod(pod, mediaIds, maxPrice, maxSupply, ammType, owners)
//         .estimateGas({ from: account });
//       const initiatePodRes = await contract.methods
//         .initiatePod(pod, mediaIds, maxPrice, maxSupply, ammType, owners)
//         .send({ from: account, gas: gas });

//       const podAddress = initiatePodRes.events.CreatePod.returnValues.podAddress;

//       resolve({
//         success: true,
//         data: {
//           hash: initiatePodRes.transactionHash,
//           podAddress,
//         },
//       });
//     } catch (e) {
//       console.log(e);
//       resolve(null);
//     }
//   });
// }

// export async function registerPodProposal(web3: Web3, account: string, payload: any): Promise<any> {
//   return new Promise(async resolve => {
//     try {
//       const contract = ContractInstance(
//         web3,
//         pod_manager_metadata.abi,
//         config.CONTRACT_ADDRESSES.POD_MANAGER
//       );
//       const gas = await contract.methods.registerPodProposal().estimateGas({ from: account });
//       await contract.methods.registerPodProposal().send({ from: account, gas: gas });
//       console.log("transaction succeed");
//     } catch (e) {
//       console.log(e);
//       resolve(null);
//     }
//   });
// }

// export async function registerMedia(web3: Web3, account: string, payload: any): Promise<any> {
//   return new Promise(async resolve => {
//     try {
//       const contract = ContractInstance(
//         web3,
//         pod_manager_metadata.abi,
//         config.CONTRACT_ADDRESSES.POD_MANAGER
//       );

//       const data = {};

//       contract.events.CreateMedia(async (error, event) => {
//         if (!error) {
//           console.log(event);
//           const response = await axios.post(`${URL()}/media/createMedia/p1`, payload);
//           resolve(response);
//         }
//       });
//       const gas = await contract.methods
//         .createMedia(data, "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB", [])
//         .estimateGas({ from: account });
//       await contract.methods
//         .createMedia(data, "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB", [])
//         .send({ from: account, gas: gas });
//       console.log("transaction succeed");
//     } catch (e) {
//       console.log(e);
//       resolve(null);
//     }
//   });
// }

// export async function investPod(web3: Web3, account: string, payload: any) {
//   return new Promise(async resolve => {
//     try {
//       const contract = ContractInstance(
//         web3,
//         pod_manager_metadata.abi,
//         config.CONTRACT_ADDRESSES.POD_MANAGER
//       );

//       const decimals = await PolygonAPI.Trax.decimals(web3, payload.token);
//       const weiAmount = web3.utils
//         .toBN(payload.amount)
//         .mul(web3.utils.toBN(10).pow(web3.utils.toBN(decimals)));

//       const gas = await contract.methods
//         .investPod(payload.podAddress, weiAmount)
//         .estimateGas({ from: account });
//       const investPodRes = await contract.methods
//         .investPod(payload.podAddress, weiAmount)
//         .send({ from: account, gas: gas });

//       resolve({
//         success: true,
//         data: {
//           hash: investPodRes.transactionHash,
//         },
//       });
//     } catch (e) {
//       console.log(e);
//       resolve(null);
//     }
//   });
// }

// export async function claimPodTokens(web3: Web3, account: string, payload: any) {
//   return new Promise(async resolve => {
//     try {
//       const contract = ContractInstance(
//         web3,
//         pod_manager_metadata.abi,
//         config.CONTRACT_ADDRESSES.POD_MANAGER
//       );

//       const gas = await contract.methods.claimPodTokens(payload.podAddress).estimateGas({ from: account });
//       const investPodRes = await contract.methods
//         .claimPodTokens(payload.podAddress)
//         .send({ from: account, gas: gas });

//       resolve({
//         success: true,
//         data: {
//           hash: investPodRes.transactionHash,
//         },
//       });
//     } catch (e) {
//       console.log(e);
//       resolve(null);
//     }
//   });
// }
