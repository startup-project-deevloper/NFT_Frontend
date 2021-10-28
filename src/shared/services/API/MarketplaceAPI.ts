import axios from "axios";
import URL from "shared/functions/getURL";

export async function getNfts(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/marketplace/getNfts`, {
      params: payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getNft(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/marketplace/getNft`, {
      params: payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getMarketplaceMedias(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/marketplace/getMarketplaceMedias`, {
      params: payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

export async function getAuctionBidHistory(payload: any): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/marketplace/getBidHistory`, {
      params: payload,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}
