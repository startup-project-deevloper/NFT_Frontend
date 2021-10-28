import axios from "axios";
import { AnyIfEmpty } from "react-redux";
import URL from "shared/functions/getURL";

/////////////////////////// GET //////////////////////////

export async function getSyntheticCollections(pagination): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/syntheticFractionalize/getSyntheticCollections`, {
      params: { pagination },
    });
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}
export async function getSyntheticFeaturedCollections(): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/syntheticFractionalize/getSyntheticFeaturedCollections`, {
      params: {},
    });
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

export async function getSyntheticCollection(id): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/syntheticFractionalize/getSyntheticCollection/${id}`, {
      params: {},
    });
    return response.data;
  } catch (e) {
    console.log(e.message);
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
    console.log(e.message);
  }
}

export async function getSyntheticNFTTransactions(collectionId, syntheticId): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/syntheticFractionalize/getSyntheticNFTTransactions`, {
      params: {
        collectionId,
        syntheticId,
      },
    });
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

export async function getSyntheticNFTOwnerHistory(collectionId, syntheticId): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/syntheticFractionalize/getSyntheticNFTOwnerHistory`, {
      params: {
        collectionId,
        syntheticId,
      },
    });
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

export async function getSyntheticNFTFlipHistory(collectionId, syntheticId): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/syntheticFractionalize/getSyntheticNFTFlipHistory`, {
      params: {
        collectionId,
        syntheticId,
      },
    });
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

export async function getJotPoolBalanceHistory(collectionId): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/syntheticFractionalize/getJotPoolBalanceHistory`, {
      params: {
        collectionId,
      },
    });
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

/////////////////////////// POST /////////////////////////

export async function buyJots(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/syntheticFractionalize/buyJots`, payload);
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

export async function addLiquidity(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/syntheticFractionalize/addLiquidity`, payload);
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

export async function addJots(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/syntheticFractionalize/addJots`, payload);
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

export async function withdrawJots(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/syntheticFractionalize/withdrawJots`, payload);
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

export async function updatePriceFraction(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/syntheticFractionalize/updatePriceFraction`, payload);
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

export async function updateSellingSupply(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/syntheticFractionalize/updateSellingSupply`, payload);
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

export async function getMySyntheticFractionalisedNFT(): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/syntheticFractionalize/myNFTs`);
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

export async function getLikedSyntheticCollections(userId): Promise<any> {
  try {
    const response = await axios.get(`${URL()}/syntheticFractionalize/likedSyntheticCollection`, {
      params: { userId },
    });
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

export async function setSyntheticNFTAuction(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/syntheticFractionalize/setSyntheticNFTAuction`, payload);
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

export async function startSyntheticNFTAuction(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/syntheticFractionalize/startSyntheticNFTAuction`, payload);
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

export async function bidSyntheticNFTAuction(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/syntheticFractionalize/bidSyntheticNFTAuction`, payload);
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

export async function getSyntheticNFTBidHistory(payload: any): Promise<any> {
  try {
    const config = {
      params: payload,
    };
    const response = await axios.get(`${URL()}/syntheticFractionalize/getBidHistory`, config);
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}

export async function endSyntheticNFTAuction(payload): Promise<any> {
  try {
    const response = await axios.post(`${URL()}/syntheticFractionalize/endSyntheticNFTAuction`, payload);
    return response.data;
  } catch (e) {
    console.log(e.message);
  }
}