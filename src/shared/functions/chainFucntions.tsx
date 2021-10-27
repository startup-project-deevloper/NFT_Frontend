export const getLoanChainImageUrl = (chain, blockchainNetwork) => {
  if (chain) {
    return require(`assets/tokenImages/${chain}.png`);
  } else if (blockchainNetwork?.includes("Polygon")) {
    return require("assets/tokenImages/POLYGON-SYMBOL.png");
  } else if (blockchainNetwork?.includes("Ethereum")) {
    return require("assets/tokenImages/ETH.png");
  }
  return require("assets/tokenImages/POLYGON-SYMBOL.png");
};

export const getChainImageUrl = blockchain => {
  if (!blockchain) {
    return "";
  }
  if (blockchain.toLowerCase().includes("privi")) {
    return require("assets/tokenImages/ETH.png");
    // return require('assets/tokenImages/PRIVI.png');
    return "";
  } else if (blockchain.toLowerCase().includes("polygon")) {
    return require("assets/tokenImages/POLYGON-SYMBOL.png");
  } else if (blockchain.toLowerCase().includes("ethereum")) {
    return require("assets/tokenImages/ETH.png");
  } else if (blockchain.toLowerCase().includes("wax")) {
    return require("assets/tokenImages/WAX.png");
  } else if (blockchain.toLowerCase().includes("hicetnunc")) {
    return require("assets/tokenImages/HICETNUNC.png");
  } else if (blockchain.toLowerCase().includes("binance")) {
    return require("assets/tokenImages/BNB.png");
  } else if (blockchain.toLowerCase().includes("zora")) {
    return require("assets/priviIcons/zora_icon.png");
  } else if (blockchain.toLowerCase().includes("opensea")) {
    return require("assets/priviIcons/opensea_icon.png");
  } else if (blockchain.toLowerCase().includes("mirror")) {
    return require("assets/priviIcons/mirror_icon.png");
  } else if (blockchain.toLowerCase().includes("topshot")) {
    return require("assets/priviIcons/top_shot_icon.png");
  } else if (blockchain.toLowerCase().includes("foundation")) {
    return require("assets/priviIcons/foundation_icon.png");
  }

  return require("assets/tokenImages/ETH.png");
};
