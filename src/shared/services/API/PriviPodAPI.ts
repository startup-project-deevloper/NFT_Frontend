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

export async function getPod(podAddress: string, type: string): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/priviPod/getPod?podAddress=${podAddress}&&type=${type}`);
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
