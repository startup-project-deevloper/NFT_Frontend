import { BlockchainType, PlatformType } from "shared/services/API/MediaAPI";
import { CollectionsOpensea, CollectionsShowTime, CollectionsWax } from "shared/constants/collections";


type Collection = {
  name: string;
  imageURL: string;
  label:string;
  blockChain: BlockchainType,
  platform: PlatformType
};

const COLLECTIONS_FOR_PLATFORMS: Partial<Record<PlatformType, Array<Collection>>> = {
  [PlatformType.Wax]: CollectionsWax,
  [PlatformType.Opensea]: CollectionsOpensea,
  [PlatformType.Showtime]: CollectionsShowTime,
};

export const getCollectionsForPlatforms = (platforms: PlatformType[], blockchains: BlockchainType[]) => {
  let allCollections: Collection[] = [];
  if (platforms && platforms.length) {
    for (const platform of platforms) {
      const collections = COLLECTIONS_FOR_PLATFORMS[platform];

      if (collections) {
        allCollections = [...allCollections, ...collections];
      }
    }
  } else {
    allCollections = [...CollectionsWax, ...CollectionsOpensea, ...CollectionsShowTime];
  }

  if (blockchains && blockchains.length) {
    allCollections = allCollections.filter(item => blockchains.includes(item.blockChain));
  }

  return allCollections;
};
