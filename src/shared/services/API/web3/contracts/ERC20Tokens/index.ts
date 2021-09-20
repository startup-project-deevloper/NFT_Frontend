// import usdt from "./USDT";
// import usdc from "./USDC";
// import eth from "./ETH";
// import privi from "./PRIVI";
// import trax from "./TRAX";
// import dai from "./DAI";
// import pix from "./PIX";
import erc20_standard from "./ERC20Standard";
import config from "shared/connectors/web3/config";
const erc20 = network => {
  //   return {
  //     USDT: usdt(network),
  //     USDC: usdc(network),
  //     ETH: eth(network),
  //     PRIVI: privi(network),
  //     TRAX: trax(network),
  //     DAI: dai(network),
  //     PIX: pix(network),
  //   };
  let instance = {};
  Object.keys(config[network].TOKEN_ADDRESSES).forEach(token => {
    instance[token] = erc20_standard(network, token);
  });
  return instance;
};

export default erc20;
