import exchange from "./contracts/Exchange";
import auction from "./contracts/Auction";
import loan from "./contracts/Loan";
import erc721 from "./contracts/PriviERC721";
import erc20 from "./contracts/ERC20Tokens";
import vaultFactory from "./contracts/VaultFactory";
import tokenVault from "./contracts/TokenVault";
import erc20Exchange from "./contracts/Erc20Exchange";
import podManager from "./contracts/PodManager";

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
  };
};

export default api;
