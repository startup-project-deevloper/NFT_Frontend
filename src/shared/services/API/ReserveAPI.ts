import axios from "axios";
import URL from "shared/functions/getURL";

export async function getAllNFTs(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/reserve/getAllNFTs`, {
      params: payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}