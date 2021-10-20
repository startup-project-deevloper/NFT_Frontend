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
    // return require('assets/tokenImages/PRIVI.png');
    return "";
  }
  if (blockchain.toLowerCase().includes("privi")) {
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
  }
  // return require("assets/tokenImages/PRIVI.png");
  return "";
};
