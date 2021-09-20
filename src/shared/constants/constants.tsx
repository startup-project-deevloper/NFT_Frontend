import { AbstractConnector } from "@web3-react/abstract-connector";
import { BscConnector, UserRejectedRequestError } from "@binance-chain/bsc-connector";
import { ConnectionRejectedError } from "use-wallet";
import { InjectedConnector } from "@web3-react/injected-connector";
import { injected, walletconnect, bscConnect } from "shared/connectors";
import MetaMaskLogo from "assets/walletImages/metamask.svg";
import WalletConnectLogo from "assets/walletImages/wallet_connect.svg";
import BinanceExtensionLogo from "assets/walletImages/Binance.svg";
import PriviWalletLogo from "assets/tokenImages/PRIVI.png";
import WaxWalletLogo from "assets/walletImages/waxWallet.png";
import PolkadotWalletLogo from "assets/walletImages/polkadot.svg";
import { polygonAPI, ethAPI } from "shared/services/API/web3";
import Web3Config from "shared/connectors/web3/config";

export const PRIVI_ADDRESS = "0x4c6a375e66440949149720f273d69fcd11b1564b";
export const PRIVI_ETH_ACCOUNT = "0x7d994063E2C98b2F49b13418Fc3FE58c45DdcC0D";
export const walletConnect = {
  walletconnect: { rpcUrl: process.env.REACT_APP_INFURA_URL || "" },
  bsc: {
    web3ReactConnector() {
      return new BscConnector({ supportedChainIds: [56, 97] });
    },
    handleActivationError(err) {
      if (err instanceof UserRejectedRequestError) {
        return new ConnectionRejectedError();
      }
    },
  },
};

export const priviTokenList = [
  "BAL",
  "BAT",
  "BNB",
  "COMP",
  "DAI",
  "EOS",
  "ETH",
  "LINK",
  "MKR",
  "PRIVI",
  "UNI",
  "USDT",
  "WBTC",
  "YFI",
  "TRAX",
  "PIX",
];

export const chainId = 1;

export const POLYGON_CHAIN_IDS = [137, 80001];

export const polygonConnector = new InjectedConnector({ supportedChainIds: POLYGON_CHAIN_IDS });

export type WalletInfo = {
  title: string;
  description: string;
  logo: string;
  type: "privi" | "metamask" | "walletconnect" | "binance" | "wax" | "polkadot";
  connector?: AbstractConnector;
};

export const RANDOM_MOCK_PLAYLISTS_LENGTH = 19;
export const WALLETS: WalletInfo[] = [
  {
    title: "Privi Wallet",
    description: "Connect to your Privi Wallet",
    logo: PriviWalletLogo,
    connector: injected,
    type: "privi",
  },
  {
    title: "MetaMask",
    description: "Connect to your MetaMask Wallet",
    logo: MetaMaskLogo,
    connector: injected,
    type: "metamask",
  },
  {
    title: "WalletConnect",
    description: "Connect to your WalletConnect",
    logo: WalletConnectLogo,
    connector: walletconnect,
    type: "walletconnect",
  },
  {
    title: "Binance Extension",
    description: "Connect to your Binance Wallet",
    logo: BinanceExtensionLogo,
    connector: bscConnect,
    type: "binance",
  },
  {
    title: "Wax Wallet",
    description: "Connect to your Wax Wallet",
    logo: WaxWalletLogo,
    type: "wax",
  },
  {
    title: "Polkadot Wallet",
    description: "Connect to your Polkadot Wallet",
    logo: PolkadotWalletLogo,
    type: "polkadot",
  },
];

export const erc20ToWeiUnit = {
  TRAX: "ether",
  USDT: "mwei",
  USDC: "ether",
  DAI: "ether",
  PIX: "ether",
  ETH: "ether",
  PRIVI: "ether",
};

export const BlockchainNets: any =
  process.env.NODE_ENV !== "development" || process.env.REACT_APP_ENV === "prod"
    ? // prod (mainnets)
      [
        {
          name: "PRIVI",
          value: "Privi Chain",
          image: "tokenImages/PRIVI2.png",
          scan: { name: "PRIVISCAN", url: "https://priviscan.io" },
        },
        {
          name: "POLYGON",
          value: "Polygon Chain",
          image: "tokenImages/POLYGON.png",
          chainId: 1,
          scan: { name: "POLYGONSCAN", url: "https://polygonscan.com" },
        },
        {
          name: "ETHEREUM",
          value: "Ethereum Chain",
          image: "tokenImages/ETH.png",
          chainId: 137,
          scan: { name: "ETHERSCAN", url: "https://etherscan.io" },
        },
      ]
    : // dev (testnets)
      [
        {
          name: "PRIVI",
          value: "Privi Chain",
          image: "tokenImages/PRIVI2.png",
          scan: { name: "PRIVISCAN", url: "https://priviscan.io" },
        },
        {
          name: "POLYGON",
          value: "Polygon Chain",
          image: "tokenImages/POLYGON.png",
          chainId: 80001,
          config: Web3Config.Polygon,
          apiHandler: polygonAPI,
          scan: { name: "POLYGONSCAN", url: "https://mumbai.polygonscan.com" },
        },
        {
          name: "ETHEREUM",
          value: "Ethereum Chain",
          image: "tokenImages/ETH.png",
          chainId: 4,
          config: Web3Config.Ethereum,
          apiHandler: ethAPI,
          scan: { name: "ETHERSCAN", url: "https://rinkeby.etherscan.io" },
        },
      ];

export const LoanBlockchainNet: any = [
  {
    name: "ETH",
    value: "Ethereum Chain",
    image: "tokenImages/ETH.png",
    chainId: 4,
    config: Web3Config.Ethereum,
    apiHandler: ethAPI,
  },
  {
    name: "POLYGON",
    value: "Polygon Chain",
    image: "tokenImages/POLYGON.png",
    chainId: 80001,
    config: Web3Config.Polygon,
    apiHandler: polygonAPI,
  },
];

export const TradeTraxTokenList = [
  { name: "USDT", value: "USDT", image: "tokenImages/USDp.svg" },
  { name: "TRAXp", value: "TRAXp", image: "tokenImages/TRAXp.svg" },
];

export function validEmail(email: string): boolean {
  return new RegExp(
    /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  ).test(email);
}

export const handleYoutubeLink = () => {
  window.open("https://youtube.com/channel/UCWRmqGO428lR-LOknsaNN9g", "_blank");
};

export const handleFacebookLink = () => {
  window.open("https://www.facebook.com/PRIVI-Protocol-104693631453856", "_blank");
};

export const handleTwitterLink = () => {
  window.open("http://www.twitter.com/priviprotocol", "_blank");
};

export const handleLinkedinLink = () => {
  window.open("https://www.linkedin.com/company/privi-protocol/", "_blank");
};

export const handleInstagramLink = () => {
  window.open("https://instagram.com/priviprotocol", "_blank");
};

export const handleTiktokLink = () => {
  window.open("https://vm.tiktok.com/ZMechVPv8/", "_blank");
};

export const handleMediumLink = () => {
  window.open("https://privi.medium.com/", "_blank");
};

export const handleHomeLink = () => {
  window.location.href = "https://www.privi.store/#/privi-home";
};

export const handleAppsLink = () => {
  window.open("https://www.privi.store/", "_blank");
};

// placeholder
export const handleTeamLink = () => {
  window.open("https://priviprotocol.io/", "_blank");
};

export const handleCreatorsLink = () => {
  window.open("https://priviprotocol.io/creators", "_blank");
};

// placeholder
export const handleCommunitiesLink = () => {
  window.open("https://priviprotocol.io/", "_blank");
};

// placeholder
export const handleMediaLink = () => {
  window.open("https://priviprotocol.io/", "_blank");
};

export const handleLightPaperLink = () => {
  window.open("https://view.flodesk.com/pages/60e823f97d8575709d8c7354", "_blank");
};

export const handleTokenLink = () => {
  window.open("https://priviprotocol.io/token", "_blank");
};

export const handleKnowledgeHubLink = () => {
  window.open("https://medium.com/privi", "_blank");
};

export const handleTermsAndConditionsLink = () => {
  window.open("https://priviprotocol.io/terms-and-conditions-1", "_blank");
};

export const EUROPEAN_COUNTRIES = [
  {
    name: "Andorra",
    id: "AD",
  },
  {
    name: "Albania",
    id: "AL",
  },
  {
    name: "Austria",
    id: "AT",
  },
  {
    name: "Åland Islands",
    id: "AX",
  },
  {
    name: "Bosnia and Herzegovina",
    id: "BA",
  },
  {
    name: "Belgium",
    id: "BE",
  },
  {
    name: "Bulgaria",
    id: "BG",
  },
  {
    name: "Belarus",
    id: "BY",
  },
  {
    name: "Switzerland",
    id: "CH",
  },
  {
    name: "Cyprus",
    id: "CY",
  },
  {
    name: "Czech Republic",
    id: "CZ",
  },
  {
    name: "Germany",
    id: "DE",
  },
  {
    name: "Denmark",
    id: "DK",
  },
  {
    name: "Estonia",
    id: "EE",
  },
  {
    name: "Spain",
    id: "ES",
  },
  {
    name: "Finland",
    id: "FI",
  },
  {
    name: "Faroe Islands",
    id: "FO",
  },
  {
    name: "France",
    id: "FR",
  },
  {
    name: "United Kingdon",
    id: "GB",
  },
  {
    name: "Guernsey",
    id: "GG",
  },
  {
    name: "Greece",
    id: "GR",
  },
  {
    name: "Croatia",
    id: "HR",
  },
  {
    name: "Hungary",
    id: "HU",
  },
  {
    name: "Ireland",
    id: "IE",
  },
  {
    name: "Isle of Man",
    id: "IM",
  },
  {
    name: "Iceland",
    id: "IC",
  },
  {
    name: "Italy",
    id: "IT",
  },
  {
    name: "Jersey",
    id: "JE",
  },
  {
    name: "Liechtenstein",
    id: "LI",
  },
  {
    name: "Lithuania",
    id: "LT",
  },
  {
    name: "Luxembourg",
    id: "LU",
  },
  {
    name: "Latvia",
    id: "LV",
  },
  {
    name: "Monaco",
    id: "MC",
  },
  {
    name: "Moldova, Republic of",
    id: "MD",
  },
  {
    name: "Macedonia, The Former Yugoslav Republic of",
    id: "MK",
  },
  {
    name: "Malta",
    id: "MT",
  },
  {
    name: "Netherlands",
    id: "NL",
  },
  {
    name: "Norway",
    id: "NO",
  },
  {
    name: "Poland",
    id: "PL",
  },
  {
    name: "Portugal",
    id: "PT",
  },
  {
    name: "Romania",
    id: "RO",
  },
  {
    name: "Russian Federation",
    id: "RU",
  },
  {
    name: "Sweden",
    id: "SE",
  },
  {
    name: "Slovenia",
    id: "SI",
  },
  {
    name: "Svalbard and Jan Mayen",
    id: "SJ",
  },
  {
    name: "Slovakia",
    id: "SK",
  },
  {
    name: "San Marino",
    id: "SM",
  },
  {
    name: "Ukraine",
    id: "UA",
  },
  {
    name: "United States",
    id: "US",
  },
  {
    name: "Holy See (Vatican City State)",
    id: "VA",
  },
];

export const ZOO_APPS_NAMES = ["Trax", "Pix", "DAOs", "Social", "Exchange", "Metaverse"];

export const ZOO_APPS_BUNDLE = [
  {
    name: "Privi Trax",
    connect: "/trax-connect",
    type: "trax",
    count: "6531",
    description: "The New Era of Music Streaming",
    longDescription:
      "Welcome to Privi Trax, the first decentralized music streaming app of its kind, built to give the power back to the people who deserve it the most - artists and their biggest fans. Privi Trax allows artists to earn more than 3X what they do on Spotify, aims to kill piracy, and allows listeners to earn alongside their favorite artists. Privi Trax is a mix of decentralized Spotify, Axie Infinity, and DeFi functionalities.\n\n \
    Features:\n \
    Web and Mobile music player\n \
    Music DAO\n \
    High Yield options\n \
    Staking\n \
    Pods\n \
    Claimable Music\n\n \
    \
    Privi Trax is a decentralized app that is governed by holders of the Privi Trax ($TRAX) token, available for purchase in August 2021.",
    url: "trax",
    appUrl: "/privi-trax",
    photo: [require("assets/zooImages/Music-Dao.png")],
    isPublished: true,
  },
  {
    name: "Privi Pix",
    connect: "/pix-connect",
    type: "pix",
    count: "9875",
    description: "The NFT Marketplace For Your Digital Art",
    longDescription:
      "Welcome to Privi Pix, the new home for your digital art. Privi Pix allows you to earn alongside your favorite creators, and collect their digital art - from photos to videos and beyond. As a creator, you can monetize your digital art without any middleman in between. Privi Pix will be available as a web and mobile app around September 2021. Privi Pix is a decentralized app that is governed by holders of the Privi Pix ($PIX) token, available for purchase soon.",
    url: "pix",
    appUrl: "/pix",
    photo: [require("assets/zooImages/Digital-Art.png")],
    isPublished: true,
  },
  {
    name: "Privi Metaverse",
    connect: "/metaverse-connect",
    type: "metaverse",
    count: "1234",
    description: "A new world awaits your step into the Privi Metaverse ",
    longDescription:
      "Show off your NFTs and creations in a 3D world. Experience music, video and digital art in a completely different way, even play and compete with mini-games in this new virtual world. In the future even socialise and meet people, navigate around the world, form communities and build your own home, venue or even city.",
    url: "metaverse",
    appUrl: "/privi-metaverse",
    photo: [
      require("assets/zooImages/Metaverse.png"),
      require("assets/zooImages/Metaverse1.png"),
      require("assets/zooImages/Metaverse2.png"),
      require("assets/zooImages/Metaverse3.png"),
      require("assets/zooImages/Metaverse4.png"),
      require("assets/zooImages/Metaverse5.png"),
    ],
    isPublished: true,
  },
  {
    name: "Privi Flix",
    type: "flix",
    connect: "/flix-connect",
    count: "9875",
    description:
      "Stream unlimited decentralized video, tv shows and movies from your laptop, tablet or mobile device",
    longDescription:
      "Welcome to Privi Flix, the first decentralized video streaming of its kind. To compare it to what’s out there, it is like combining a decentralized Netflix with BitClout, plus adding gamified and money-making components of Axie Infinity with DeFi functionalities. To put it simply, it is an entertainment app, with a whole score of financial features built in.\n\n \
    Features:\n \
    Web and Mobile video player\n \
    Video DAO\n \
    High Yield options\n \
    Staking\n \
    Pods\n \
    Claimable Movies\n\n \
    Privi Flix is a decentralized app that is governed by the holders of the Privi Flix ($FLIX) token, available for purchase in 2021.",
    url: "flix",
    appUrl: "/privi-flix",
    photo: [require("assets/zooImages/Flix.png")],
    isPublished: false,
  },
  {
    name: "Privi DAOs",
    connect: "/daos-connect",
    type: "dao",
    count: "3654",
    description: "Discover Decentralized Communities for Groups, Brands, and Businesses.",
    longDescription:
      "Welcome to Privi DAOs, a revolutionary take on online communities. Join the DAO of your favorite creator, business, brand or individual - or create your own DAO to connect with your community in an entirely new way. \
\
\
    Features: \
    DAO Tokens \
    Social tools \
    DeFi tools \
    Developer portal",
    url: "daos",
    appUrl: "/privi-dao",
    photo: [require("assets/zooImages/Dao.png")],
    isPublished: false,
  },
  {
    name: "Privi Social",
    connect: "/social-connect",
    type: "social",
    count: "1234",
    description: "Your One Stop Shop for Everything Social in the Privi Ecosystem ",
    longDescription:
      "With Privi Social, build your profile and connect with ease. See what parts of the platform you are a part of, browse trending DAOs, create and distribute social tokens and badges, and coming out this year, attach your very own Metaverse world to your profile. \
\
      Features: \
      Feed \
      Discover \
      Social Tokens \
      Badges \
      Trust and Endorsement Scores \
      3D Metaverses",
    url: "social",
    appUrl: "/privi-social",
    photo: [require("assets/zooImages/Social.png")],
    isPublished: false,
  },
  {
    name: "Privi Exchange",
    type: "exchange",
    count: "9875",
    description: "Exchange App Tokens of the Privi Ecosystem",
    longDescription:
      "With Privi Exchange, apps can sell and exchange app tokens as well as different time-based scope tokens (sold in “G slabs”) which are then traded on Privi Exchange. This helps projects and apps protect from the dump and for investors to limit their risk. Every single application inside Privi will be a part of this exchange, even apps developed and launched by Privi.",
    url: "exchange",
    appUrl: "/exchange",
    photo: [require("assets/zooImages/Exchange.png")],
    isPublished: true,
  },
];

export const ZOO_APPS = [
  {
    name: "Privi Pix",
    connect: "/pix-connect",
    type: "pix",
    count: "9875",
    description: "The NFT Marketplace For Your Digital Art",
    longDescription:
      "Welcome to Privi Pix, the new home for your digital art. Privi Pix allows you to earn alongside your favorite creators, and collect their digital art - from photos to videos and beyond. As a creator, you can monetize your digital art without any middleman in between. Privi Pix will be available as a web and mobile app around September 2021.\nPrivi Pix is a decentralized app that is governed by holders of the Privi Pix ($PIX) token, available for purchase soon.",
    url: "pix",
    appUrl: "/pix",
    photo: [
      require("assets/zooImages/Digital-Art.png"),
      require("assets/zooImages/Digital-Art-1.png"),
      require("assets/zooImages/Digital-Art-2.png"),
      require("assets/zooImages/Digital-Art-3.png"),
      require("assets/zooImages/Digital-Art-4.jpg"),
    ],
    isPublished: true,
  },
  {
    name: "Privi Trax",
    connect: "/trax-connect",
    type: "trax",
    count: "6531",
    description: "The New Era of Music Streaming",
    longDescription:
      "Welcome to Privi Trax, the first decentralized music streaming app of its kind, built to give the power back to the people who deserve it the most - artists and their biggest fans. Privi Trax allows artists to earn more than 3X what they do on Spotify, aims to kill piracy, and allows listeners to earn alongside their favorite artists. Privi Trax is a mix of decentralized Spotify, Axie Infinity, and DeFi functionalities.\n\n \
    Features:\n \
    Web and Mobile music player\n \
    Music DAO\n \
    High Yield options\n \
    Staking\n \
    Pods\n \
    Claimable Music\n\n \
    \
    Privi Trax is a decentralized app that is governed by holders of the Privi Trax ($TRAX) token, available for purchase in August 2021.",
    url: "trax",
    appUrl: "/privi-trax",
    photo: [
      require("assets/zooImages/Music-Dao.png"),
      require("assets/zooImages/Music-Dao-1.png"),
      require("assets/zooImages/Music-Dao-2.png"),
    ],
    isPublished: true,
  },
  {
    name: "Privi Exchange",
    type: "exchange",

    connect: "/exchange-connect",
    count: "9875",
    description: "Exchange App Tokens of the Privi Ecosystem",
    longDescription:
      "With Privi Exchange, apps can sell and exchange app tokens as well as different time based scope tokens (sold in “G slabs”) which are then traded on Privi Exchange. This helps projects and apps protect from the dump and for investors to limit their risk. Every single application inside Privi will be a part of this exchange, even apps developed and launched by Privi.",
    url: "exchange",
    appUrl: "/exchange",
    photo: [
      require("assets/zooImages/Exchange.png"),
      require("assets/zooImages/Exchange-1.png"),
      require("assets/zooImages/Exchange-2.png"),
    ],
    isPublished: true,
  },
  {
    name: "Privi Metaverse",
    connect: "/metaverse-connect",
    type: "metaverse",
    count: "1234",
    description: "A new world awaits your step into the Privi Metaverse",
    longDescription:
      "Show off your NFTs and creations in a 3D world. Experience music, video and digital art in a completely different way, even play and compete with mini-games in this new virtual world. In the future even socialise and meet people, navigate around the world, form communities and build your own home, venue or even city.",
    url: "metaverse",
    appUrl: "/privi-metaverse",
    photo: [
      require("assets/zooImages/Metaverse.png"),
      require("assets/zooImages/Metaverse1.png"),
      require("assets/zooImages/Metaverse2.png"),
      require("assets/zooImages/Metaverse3.png"),
      require("assets/zooImages/Metaverse4.png"),
      require("assets/zooImages/Metaverse5.png"),
    ],
    isPublished: true,
  },
  {
    name: "Privi Social",
    connect: "/social-connect",
    type: "social",
    count: "1234",
    description: "Your One Stop Shop for Everything Social in the Privi Ecosystem ",
    longDescription:
      "With Privi Social, build your profile and connect with ease. See what parts of the platform you are a part of, browse trending DAOs, create and distribute social tokens and badges, and coming out this year, attach your very own Metaverse world to your profile.\n\n \
      Features:\n \
      Feed\n \
      Discover\n \
      Social Tokens\n \
      Badges\n \
      Trust and Endorsement Scores\n \
      3D Metaverses",
    url: "social",
    appUrl: "/privi-social",
    photo: [
      require("assets/zooImages/Social.png"),
      require("assets/zooImages/Social-1.png"),
      require("assets/zooImages/Social-2.png"),
    ],
    isPublished: false,
  },
  {
    name: "Privi Pay",
    connect: "/pay-connect",
    type: "pay",
    count: "9875",
    description: "Crypto payments made easy - pay, split, borrow, and receive credit",
    longDescription:
      "Welcome to Privi Pay, a non custodial multip chain crypto payments dApp in the Privi ecosystem. Privi Pay allows you to use powerful and easy crypto payment solutions. Ranging from splitting payments, borrowing crypto, receiving credit, or making payments on a second by second basis (“Payment streaming”). Privi Pay takes what works in Web2 (Ever wondered why there’s no Klarna or Splitwise for crypto?) while adding Web3 innovation.Welcome to Privi Pay, a non custodial multip chain crypto payments dApp in the Privi ecosystem. Privi Pay allows you to use powerful and easy crypto payment solutions. Ranging from splitting payments, borrowing crypto, receiving credit, or making payments on a second by second basis (“Payment streaming”). Privi Pay takes what works in Web2 (Ever wondered why there’s no Klarna or Splitwise for crypto?) while adding Web3 innovation.\n\n \
      Features:\n \
      Use your crypto wallet to make payments, either one time or “payment streaming”\n \
      Split payments using crypto, this includes stable coins, ETH and BTC\n \
      Create loans with crypto as collateral to make payments\n \
      Coming soon: get credit with your ‘Privi Credit Score’\n\n \
      Privi Pay launches Fall 2021.",
    url: "pay",
    appUrl: "/privi-pay",
    photo: [
      require("assets/zooImages/Pay-1.png"),
      require("assets/zooImages/Pay-2.png"),
      require("assets/zooImages/Pay-3.png"),
    ],
    isPublished: false,
  },
  {
    name: "Privi Flix",
    connect: "/flix-connect",
    type: "flix",
    count: "9875",
    description:
      "Stream unlimited decentralized video, tv shows and movies from your laptop, tablet or mobile device",
    longDescription:
      "Welcome to Privi Flix, the first decentralized video streaming of its kind. To compare it to what’s out there, it is like combining a decentralized Netflix with BitClout, plus adding gamified and money-making components of Axie Infinity with DeFi functionalities. To put it simply, it is an entertainment app, with a whole score of financial features built in.\n\n \
      Features:\n \
      Web and Mobile video player\n \
      Video DAO\n \
      High Yield options\n \
      Staking\n \
      Pods\n \
      Claimable Movies\n\n \
      Privi Flix is a decentralized app that is governed by the holders of the Privi Flix ($FLIX) token, available for purchase in 2021.",
    url: "flix",
    appUrl: "/privi-flix",
    photo: [
      require("assets/zooImages/Flix.png"),
      require("assets/zooImages/Flix-1.png"),
      require("assets/zooImages/Flix-2.jpg"),
    ],
    isPublished: false,
  },
  {
    name: "Privi Wallet",
    type: "wallet",

    connect: "/wallet-connect",
    count: "7865",
    description: "Non custodial multi chain wallet making transacting throughout the ecosystem a breeze",
    longDescription:
      "Generate your unique Ethereum wallet and receive your own unique public address (0x..). And since privi is multichain and interoperable with other chains, you can connect your MetaMask, WalletConnect, Binance and Polkadot Wallets and make swaps on Ethereum, Substrate, Polygon and of course, Privi blockchain.",
    url: "wallet",
    appUrl: "/privi-wallet",
    photo: [
      require("assets/zooImages/Wallet.png"),
      require("assets/zooImages/Wallet-1.png"),
      require("assets/zooImages/Wallet-2.png"),
    ],
    isPublished: false,
  },

  {
    name: "Privi Governance",
    type: "governance",
    connect: "/governance-connect",
    count: "4567",
    description: "Discuss and vote on the direction of the Privi ecosystem",
    longDescription:
      "Privi Governance allows for the community to vote, propose, and govern the \
    Privi Ecosystem. Through staking, Privi Governance participants actively partake in the direction of the decentralized app ecosystem.",
    url: "governance",
    appUrl: "/governance",
    photo: [
      require("assets/zooImages/Governance.png"),
      require("assets/zooImages/Governance-1.png"),
      require("assets/zooImages/Governance-2.png"),
    ],
    isPublished: false,
  },

  {
    name: "Privi DAOs",
    connect: "/daos-connect",
    type: "daos",
    count: "3654",
    description: "Discover Decentralized Communities for Groups, Brands, and Businesses.",
    longDescription:
      "Welcome to Privi DAOs, a revolutionary take on online communities. Join the DAO of your favorite creator, business, brand or individual - or create your own DAO to connect with your community in an entirely new way.\n\n \
      Features:\n \
      DAO Tokens\n \
      Social tools\n \
      DeFi tools\n \
      Developer portal",
    url: "daos",
    appUrl: "/privi-dao",
    photo: [
      require("assets/zooImages/Dao.png"),
      require("assets/zooImages/Dao-1.png"),
      require("assets/zooImages/Dao-2.png"),
    ],
    isPublished: false,
  },

  // {
  //   name: "Privi Music",
  //   type: "music",
  //   count: "5644",
  //   description: "Create, share and purchase Music.",
  //   url: "music",
  //   appUrl: "/privi-music",
  //   photo: require("assets/zooImages/Music.png"),
  //   isPublished: false,
  // },
  {
    name: "Privi Data",
    type: "data",
    count: "696",

    connect: "/data-connect",
    description: "Decentralized Advertising in the Privi Ecosystem",
    longDescription:
      " With Privi Data, you take back control of one of your most powerful assets - your data. Privi Data allows you to promote your content - from music to videos to tokens to DAOs - using $DATAp coins. Buy and trade this data asset class, stake for rewards and distribute to users who opt in and out of private mode, so your ads are hitting only those who are open to getting them.",
    url: "data",
    appUrl: "/data",
    photo: [require("assets/zooImages/Data.png"), require("assets/zooImages/Data-1.png")],
    isPublished: false,
  },
  {
    name: "Privi Pods",
    connect: "/pods-connect",
    type: "pods",
    count: "6877",
    description: "With Pods, any imaginable asset can be tokenized.",
    longDescription:
      "Pods are a unique tool throughout Privi Apps that allow you to tokenize any asset, customize it’s financial settings, and sell “Pod Tokens” (NFTs) to buyers. Pods are smart contracts which allow people to raise money, prefund new content, fractionalize existing content, and so much more!",
    url: "pods",
    appUrl: "/privi-pods",
    photo: [require("assets/zooImages/Pods.png"), require("assets/zooImages/Pods-1.png")],
    isPublished: false,
  },
  {
    name: "Privi Bux",
    connect: "/bux-connect",
    type: "bux",
    count: "9875",
    description: "A decentralized market for authors and their publications",
    longDescription:
      "Privi Bux is a dapp in the Privi Zoo, a decentralized App Store. The Privi Bux web and mobile application will be live in 2021. It is best described as a Kindle+Medium, with DeFi functionalities. The app uses similar mechanisms to Privi Trax and Privi Flix, where creators earn a thier fair share, and readers can actively participate in the success of their favorite books, articles or publications. Bux creates a fair medium for creators to monetize from what they write, be it books, publications or long tail articles.\n\n \
      Features:\n \
      Web and mobile reading\n \
      High yield options\n \
      Bux DAO\n \
      Single piece staking and app staking\n \
      Claimable Books\n \
      Claimable Movies\n \
      Pods\n\n \
      The Privi Bux app is fully owned and governed by Privi $Bux token holders, a token set to launch in 2021.",
    url: "bux",
    appUrl: "/privi-bux",
    photo: [
      require("assets/zooImages/Bux.jpg"),
      require("assets/zooImages/Bux-1.jpg"),
      require("assets/zooImages/Bux-2.jpg"),
      require("assets/zooImages/Bux-3.jpg"),
    ],
    isPublished: false,
  },
  {
    name: "Privi Collabs",
    type: "collabs",
    connect: "/collabs-connect",
    count: "7425",
    description: "Request and pledge to see collaborations with your favorite creators",
    longDescription:
      "Collabs allow for you to request for your favorite creators to collaborate together, and help raise funds for their project. If you’re a creator, you can request to collaborate with other creators to make your dream projects a reality, and receive funding from your community to help make it happen.",
    url: "collabs",
    appUrl: "/privi-collabs",
    photo: [
      require("assets/zooImages/Collabs.png"),
      require("assets/zooImages/Collabs-1.png"),
      require("assets/zooImages/Collabs-2.png"),
    ],
    isPublished: false,
  },
];

export const ZOO_CAROUSEL_APPS = [
  {
    title: "Privi Social",
    description: "Your One Stop Shop for Everything Social in the Privi Ecosystem",
    imageUrl: require("assets/zooImages/Social-carousel.png"),
  },
  {
    title: "Privi Pix",
    description: "The NFT Marketplace For Your Digital Art",
    imageUrl: require("assets/zooImages/Pix-carousel.png"),
  },
  {
    title: "Privi Trax",
    description: "The New Era of Music Streaming",
    imageUrl: require("assets/zooImages/Trax-carousel2.png"),
  },
  {
    title: "Privi DAOs",
    description: "Discover Decentralized Communities for Groups, Brands, and Businesses.",
    imageUrl: require("assets/zooImages/Dao-carousel.png"),
  },
  {
    title: "Privi Flix",
    description:
      "Stream unlimited decentralized video, tv shows and movies from your laptop, tablet or mobile device",
    imageUrl: require("assets/zooImages/Flix-carousel.png"),
  },
  {
    title: "Privi Exchange",
    description: "Exchange App Tokens of the Privi Ecosystem",
    imageUrl: require("assets/zooImages/Exchange-carousel2.png"),
  },
  // {
  //   title: "Privi Metaverse",
  //   description: "A new world awaits your step into the Privi Metaverse",
  //   imageUrl: require("assets/zooImages/Metaverse.png"),
  // },
];
