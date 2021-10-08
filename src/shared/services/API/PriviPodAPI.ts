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
