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

/////////////////////////// POST /////////////////////////

export async function buyJots(): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/syntheticFractionalize/buyJots`, { params: {} });
    return response.data;
  } catch (e) {
    throw new Error(e.message);
  }
}
