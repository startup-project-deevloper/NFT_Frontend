import exchange from "./contracts/Exchange";
import quickswap from "./contracts/Quickswap";
import auction from "./contracts/Auction";
import loan from "./contracts/Loan";
import erc721 from "./contracts/ERC721WithRoyalty";
import erc20 from "./contracts/ERC20Tokens";
import vaultFactory from "./contracts/VaultFactory";
import tokenVault from "./contracts/TokenVault";
import erc20Exchange from "./contracts/Erc20Exchange";
import podManager from "./contracts/PodManager";
import syntheticCollectionManager from "./contracts/SyntheticCollectionManager";
import syntheticProtocolRouter from "./contracts/SyntheticProtocolRouter";
import jotPool from "./contracts/JotPool";
import syntheticFractionalisationAuctionsManager from "./contracts/SyntheticFractionalisationAuctionsManager";
import syntheticNFTAuction from "./contracts/SyntheticNFTAuction";

const api = network => {
  return {
    Exchange: exchange(network),
    Auction: auction(network),
    Loan: loan(network),
    Erc721: erc721(network),
    Erc20: erc20(network),
    VaultFactory: vaultFactory(network),
    TokenVault: tokenVault(network),
    erc20Exchange: erc20Exchange(network),
    PodManager: podManager(network),
    SyntheticCollectionManager: syntheticCollectionManager(network),
    SyntheticProtocolRouter: syntheticProtocolRouter(network),
    SyntheticFractionalisationAuctionsManager: syntheticFractionalisationAuctionsManager(network),
    SyntheticNFTAuction: syntheticNFTAuction(network),
    JotPool: jotPool(network),
    QuickSwap: quickswap(network),
  };
};

export default api;
