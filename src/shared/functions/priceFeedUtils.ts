import Axios from "axios";
import { PriceFeed_URL, PriceFeed_Token } from "shared/functions/getURL";

export const getPrice = async (token1: string, token2: string) => {
  try {
    const { data } = await Axios.get(`${PriceFeed_URL()}/quickswap/pair_price`, {
      headers: {
        Authorization: `Basic ${PriceFeed_Token()}`,
      },
      params: {
        token1: token1.toLowerCase(),
        token0: token2.toLowerCase(),
      },
    });
    if (!data?.success) {
      return null;
    }
    const { direction, token0Price, token1Price } = data.data;
    return direction === 1 ? token1Price : token0Price;
  } catch (err) {
    return null;
  }
};
