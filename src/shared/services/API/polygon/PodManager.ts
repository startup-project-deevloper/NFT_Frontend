import axios from "axios";
import Web3 from "web3";
import URL from "shared/functions/getURL";
import { ContractInstance } from "shared/connectors/polygon/functions";
import config from "shared/connectors/polygon/config";
import PolygonAPI from "shared/services/API/polygon";

const pod_manager_metadata = require("shared/connectors/polygon/contracts/PodManager.json");

export async function initiatePod(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        pod_manager_metadata.abi,
        config.CONTRACT_ADDRESSES.POD_MANAGER
      );

      const pod = {
        owners: [payload.main.PodInfo.Creator],
        podAddress: config.CONTRACT_ADDRESSES.POD_MANAGER,
        fundingDate: payload.main.PodInfo.FundingDate,
        spread: payload.main.PodInfo.Spread * 100,
        fundingToken: config.TOKEN_ADDRESSES[payload.main.PodInfo.FundingToken],
        fundingTokenPrice: payload.main.PodInfo.FundingTokenPrice,
        fundingTarget: payload.main.PodInfo.FundingTarget,
        sharingShare: payload.main.PodInfo.SharingPercent,
        investorShare: payload.main.PodInfo.InvestorShare,
        royalty: payload.main.PodInfo.Royalty,
      };

      const mediaIds = payload.main.Medias?.map(media => web3.utils.keccak256(media.MediaSymbol)) || [];
      const maxPrice = payload.main.PodInfo.MaxPrice;
      const maxSupply = payload.main.PodInfo.MaxSupply;
      const ammType = web3.utils.keccak256(payload.main.PodInfo.AMM.toLowerCase());
      const owners = [payload.main.PodInfo.Creator];

      const gas = await contract.methods
        .initiatePod(pod, mediaIds, maxPrice, maxSupply, ammType, owners)
        .estimateGas({ from: account });
      const initiatePodRes = await contract.methods
        .initiatePod(pod, mediaIds, maxPrice, maxSupply, ammType, owners)
        .send({ from: account, gas: gas });

      const podAddress = initiatePodRes.events.CreatePod.returnValues.podAddress;

      resolve({
        success: true,
        data: {
          hash: initiatePodRes.transactionHash,
          podAddress,
        },
      });
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

export async function registerPodProposal(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        pod_manager_metadata.abi,
        config.CONTRACT_ADDRESSES.POD_MANAGER
      );
      const gas = await contract.methods.registerPodProposal().estimateGas({ from: account });
      await contract.methods.registerPodProposal().send({ from: account, gas: gas });
      console.log("transaction succeed");
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

export async function registerMedia(web3: Web3, account: string, payload: any): Promise<any> {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        pod_manager_metadata.abi,
        config.CONTRACT_ADDRESSES.POD_MANAGER
      );

      const data = {};

      contract.events.CreateMedia(async (error, event) => {
        if (!error) {
          console.log(event);
          const response = await axios.post(`${URL()}/media/createMedia/p1`, payload);
          resolve(response);
        }
      });
      const gas = await contract.methods
        .createMedia(data, "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB", [])
        .estimateGas({ from: account });
      await contract.methods
        .createMedia(data, "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB", [])
        .send({ from: account, gas: gas });
      console.log("transaction succeed");
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

export async function investPod(web3: Web3, account: string, payload: any) {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        pod_manager_metadata.abi,
        config.CONTRACT_ADDRESSES.POD_MANAGER
      );

      const decimals = await PolygonAPI.Trax.decimals(web3, payload.token);
      const weiAmount = web3.utils
        .toBN(payload.amount)
        .mul(web3.utils.toBN(10).pow(web3.utils.toBN(decimals)));

      const gas = await contract.methods
        .investPod(payload.podAddress, weiAmount)
        .estimateGas({ from: account });
      const investPodRes = await contract.methods
        .investPod(payload.podAddress, weiAmount)
        .send({ from: account, gas: gas });

      resolve({
        success: true,
        data: {
          hash: investPodRes.transactionHash,
        },
      });
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}

export async function claimPodTokens(web3: Web3, account: string, payload: any) {
  return new Promise(async resolve => {
    try {
      const contract = ContractInstance(
        web3,
        pod_manager_metadata.abi,
        config.CONTRACT_ADDRESSES.POD_MANAGER
      );

      const gas = await contract.methods.claimPodTokens(payload.podAddress).estimateGas({ from: account });
      const investPodRes = await contract.methods
        .claimPodTokens(payload.podAddress)
        .send({ from: account, gas: gas });

      resolve({
        success: true,
        data: {
          hash: investPodRes.transactionHash,
        },
      });
    } catch (e) {
      console.log(e);
      resolve(null);
    }
  });
}
