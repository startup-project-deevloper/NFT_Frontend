import axios from "axios";
import URL from "shared/functions/getURL";

/////////////////////////// GET //////////////////////////

export async function getSyntheticCollections(): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/syntheticFractionalize/getSyntheticCollections`, {
      params: {},
    });
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function getSyntheticCollection(id): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/syntheticFractionalize/getSyntheticCollection/${id}`, {
      params: {},
    });
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function getSyntheticNFT(collectionId, syntheticId): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/syntheticFractionalize/getSyntheticNFT`, {
      params: {
        collectionId,
        syntheticId,
      },
    });
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

/////////////////////////// POST /////////////////////////

export async function buyJots(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/syntheticFractionalize/buyJots`, payload);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function updatePriceFraction(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/syntheticFractionalize/updatePriceFraction`, payload);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}

export async function updateSellingSupply(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/syntheticFractionalize/updateSellingSupply`, payload);
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}
