declare const window: any;

const chainInfoMap = {
  137: {
    chainName: "Polygon Mainnet",
    rpcUrls: ["https://rpc-mumbai.matic.today/"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorerUrls: ["https://polygonscan.com/"],
  },
  80001: {
    chainName: "Mumbai Testnet",
    rpcUrls: ["https://rpc-mumbai.matic.today/"],
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    blockExplorerUrls: ["https://explorer-mumbai.maticvigil.com"],
  },
  1: {
    chainName: "Ethereum Mainnet",
    rpcUrls: ["https://main-light.eth.linkpool.io/"],
    nativeCurrency: {
      name: "ETHEREUM",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://etherscan.io/"],
  },
  3: {
    chainName: "Ropsten Testnet",
    rpcUrls: ["https://ropsten-light.eth.linkpool.io/"],
    nativeCurrency: {
      name: "ETHEREUM",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://ropsten.etherscan.io/"],
  },
  4: {
    chainName: "Rinkeby Testnet",
    rpcUrls: ["https://rinkeby-light.eth.linkpool.io/"],
    nativeCurrency: {
      name: "ETHEREUM",
      symbol: "ETH",
      decimals: 18,
    },
    blockExplorerUrls: ["https://rinkeby.etherscan.io/"],
  }
}


export const switchNetwork = (chainId: number): Promise<any> => {
  return new Promise(async resolve => {
    try {
      await (window as any).ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
      resolve(true);
    } catch (error) {
      if (error.code === 4092) {
        try {
          await (window as any).ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${chainId.toString(16)}`,
                ...chainInfoMap[chainId]
              },
            ],
          });
          resolve(true);
        } catch (error) {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    }
  });
};

export const getTokenBalances = async (chainId: number, address: string) => {
  try {
    const response = await fetch(`https://api.covalenthq.com/v1/${chainId}/address/${address}/balances_v2/`, {
      headers: {
        Authorization: "Basic Y2tleV8zYzJkMzZlZGRhYTI0Y2FmYTY0ZDRiYWEyOWI6",
      },
    });
    const json = response.json();

    return json;
  } catch (err) {
    console.log("fetching balance error: " + err.message);
  }
  return [];
}
