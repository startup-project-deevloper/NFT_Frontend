import axios from "axios";
import URL from "shared/functions/getURL";

export async function getRaisedTrendingPods(type: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/priviPod/getRaisedTrendingPods/${type}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getPods(lastId: string, type: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/priviPod/getPods/${lastId}/${type}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getPodsProposal(userAddress, searchStr, lastId, type): Promise<any> {
  try {
    const config = {
      params: {
        userAddress,
        searchStr,
        lastId,
      },
    };
    const response = await axios.get(`${URL()}/priviPod/getMediaPodProposals/${type}`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getPod(podId: string, type: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/priviPod/getPod?podId=${podId}&&type=${type}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodAcceptInvitation(payload: Object): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/priviPod/acceptInvitation`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodDeclineInvitation(payload: Object): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/priviPod/declineInvitation`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

/// POD LOGIC
export async function priviPodInitiatePod(payload: Object): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/priviPod/initiatePod`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodRegisterPodProposal(payload: any) {
  try {
    const response = await axios.post(`${URL()}/priviPod/registerPodProposal`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodVoteForPodProposal(payload: any) {
  try {
    const response = await axios.post(`${URL()}/priviPod/voteForPodProposal`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodExecutePod(payload: any) {
  try {
    const response = await axios.post(`${URL()}/priviPod/executePod`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodInvestPod(payload: any) {
  try {
    const response = await axios.post(`${URL()}/priviPod/invest`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodClaimPodTokens(payload: any) {
  try {
    const response = await axios.post(`${URL()}/priviPod/claimPodTokens`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodStakeTokens(payload: any) {
  try {
    const response = await axios.post(`${URL()}/priviPod/stakeTokens`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodUnstakeTokens(payload: any) {
  try {
    const response = await axios.post(`${URL()}/priviPod/unstakeTokens`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodClaimReward(payload: any) {
  try {
    const response = await axios.post(`${URL()}/priviPod/claimReward`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodCreateWithdrawProposal(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/priviPod/createWithdrawProposal`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodGetWithdrawProposals(payload: any): Promise<any> {
  try {
    const config = {
      params: payload,
    };
    const response = await axios.get(`${URL()}/priviPod/getWithdrawProposals`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodVoteForWithdrawProposal(payload: any): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/priviPod/voteForWithdrawProposals`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodFollowPod(userId: string, podId: string): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/priviPod/followPod`, { userId, podId });
    return response.data;
  } catch (e) {
    console.log(e);
  }
}

export async function priviPodUnfollowPod(userId: string, podId: string): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/priviPod/unfollowPod`, { userId, podId });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodGetPriceHistory(payload: any): Promise<any> {
  try {
    const config = {
      params: payload,
    };
    const response = await axios.get(`${URL()}/priviPod/getPriceHistory`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodGetInvestmentsTransactions(podId, type): Promise<any> {
  try {
    const response = await axios.get(
      `${URL()}/priviPod/getInvestmentTransactions?podId=${podId}&&type=${type}`
    );
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodGetDistributionInfo(payload): Promise<any> {
  try {
    const config = {
      params: payload,
    };
    const response = await axios.get(`${URL()}/priviPod/getDistributionInfo`, config);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodCreatePoll(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/priviPod/polls/create`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodVotePoll(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/priviPod/polls/vote`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodGetCopyrightNFTsByPod(podId, type): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/priviPod/copyrightNFTsByPod?podId=${podId}&&type=${type}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodCreateCopyrightNFT(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/priviPod/createCopyrightNFT`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodGetStaking(podId, type): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/priviPod/staking?podId=${podId}&&type=${type}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodGetSellingProposals(podId, type): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/priviPod/sellProposals?podId=${podId}&&type=${type}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodCreateSellingProposal(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/priviPod/sellProposal`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function priviPodVoteSellingProposal(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/priviPod/voteSellProposal`, payload);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
