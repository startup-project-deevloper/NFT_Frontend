import { Box, CircularProgress } from "@material-ui/core";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import Bottom from "components/PriviZoo/components/Bottom";
import React, { useState, useEffect } from "react";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import QRCodeModal from "@walletconnect/qrcode-modal";

import axios from "axios";
import URL from "shared/functions/getURL";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getUserAvatar } from "shared/services/user/getUserAvatar";
import { getUser } from "store/selectors";
import { useClaimStyles } from "./index.styles";
import { injected } from "shared/connectors";
import TransactionProgressModal from "./modal";
import { NoMetamaskModal } from "shared/ui-kit/Modal/Modals/NoMetamaskModal";
import useWindowDimensions from "shared/hooks/useWindowDimensions";
import { getReleasableAmount, claimToken } from "./contracts";
import { useInterval } from "shared/hooks/useInterval";
import { ClaimTokenCard } from "./components/ClaimCard";
import { IDO_TOKENS, TOKEN_ASSET_URL, IDOTokenSymbol, VESTING_CONTRACT_ADDRESS } from "./const";

require("dotenv").config();
const isDev = process.env.REACT_APP_ENV === "dev";
import Web3 from "web3";
import Transactions from "./components/Transactions";
import ConnectWalletModal from "shared/ui-kit/Modal/Modals/ConnectWalletModal";

declare let window: any;

export default function Claim() {
  const classes = useClaimStyles();
  const history = useHistory();
  const userSelector = useSelector(getUser);
  const { activate, account, chainId, library } = useWeb3React();

  const width = useWindowDimensions().width;

  const [startConnect, setStartConnect] = useState<boolean>(false);
  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);
  const [noMetamask, setNoMetamask] = useState<boolean>(false);
  const [network, setNetwork] = useState<string>("");
  const [transactionsList, setTransactionsList] = useState<any>([]);

  const [traxAvailable, setTraxAvailable] = useState<Record<string, number>>({});
  const [hash, setHash] = useState<string>("");
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);

  const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);
  const [openConnectModal, setOpenConnectModal] = useState<boolean>(false);

  const [isWC, setIsWC] = useState<boolean>(false);
  const [currentChain, setCurrentChain] = useState<number>();

  useEffect(() => {
    if(chainId) {
      setCurrentChain(chainId);
    }
  }, [chainId]);

  useEffect(() => {
    if (currentChain) {
      if (isDev && currentChain === 3) {
        setWrongNetwork(false);
      } else if (!isDev && currentChain === 56) {
        setWrongNetwork(false);
      } else {
        setWrongNetwork(true);
      }
    }
  }, [currentChain]);

  useEffect(() => {
    const sessionAddress = localStorage.getItem("address");

    if (account) {
      if (!sessionAddress) {
        localStorage.setItem("address", account);
      }
      setStartConnect(true);
      axios
        .get(`${URL()}/priviZoo/getIdoClaimTransactions/${account}`)
        .then(res => {
          if (res.data.success) {
            setTransactionsList(res.data.transactions);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, [account]);

  useEffect(() => {
    const sessionAddress = localStorage.getItem("address");

    if (!account && sessionAddress) {
      injected.isAuthorized().then(isAuthorized => {
        if (isAuthorized) {
          activate(injected);
        }
      });
    }
  }, []);

  const fetchReleasableAmount = async () => {
    if (!account || !library) return;

    try {
      const web3 = new Web3(library.provider);
      const amounts = await Promise.all(
        IDO_TOKENS.map(token => getReleasableAmount(web3, account, token).catch(err => 0))
      );

      const obj = {};
      amounts.map((amount, index) => {
        obj[IDO_TOKENS[index]] = amount;
      });

      setTraxAvailable(obj);

      console.log("Success trax available", obj);
    } catch (e) {
      console.log("Error getting trax available", e);
    }
  };

  useInterval(() => {
    fetchReleasableAmount();
  }, 15000);

  useEffect(() => {
    if (account && library) {
      fetchReleasableAmount();
       // check provider from extension or wallectconnect
      if (library.provider.wc) {
        setIsWC(true);
        library.provider.on("chainChanged", setCurrentChain);
      }
    }
  }, [account, library]);

  const handleOpenTransactionModal = () => {
    setOpenTransactionModal(true);
  };
  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
    fetchReleasableAmount();
  };

  const handleMetamaskExtension = () => {
    setOpenConnectModal(false);

    if (!account && injected) {
      activate(injected, undefined, true).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(injected);
        } else {
          setNoMetamask(true);
          console.info("Connection Error - ", error);
        }
      });
    } else {
      if (account) {
        localStorage.setItem("address", account);
        setStartConnect(true);
      }
    }
  };

  const handleWalletConnect = () => {
    setOpenConnectModal(false);

    const walletconnect = new WalletConnectConnector({
      rpc: {
        1: process.env.REACT_APP_INFURA_URL || "",
        3: "https://ropsten.infura.io/v3/eda1216d6a374b3b861bf65556944cdb",
        56: "https://bsc-dataseed.binance.org",
      },
      supportedChainIds: [1, 3, 4, 5, 42, 56, 97, 137, 80001],
      bridge: "wss://wc-bridge-5qt5i.ondigitalocean.app:443",
      qrcodeModal: QRCodeModal,
    });

    if (!account) {
      activate(walletconnect, undefined, true).catch(error => {
        if (error instanceof UnsupportedChainIdError) {
          activate(walletconnect);
        } else {
          console.info("Connection Error - ", error);
        }
      });
    } else {
      localStorage.setItem("address", account);
      setStartConnect(true);
    }
  };

  const handleOpenMetamask = async () => {
    if (!library) {
      return;
    }

    const requestChainId = isDev ? "0x3" : "0x38";
    const rpcUrl = isDev
      ? "https://ropsten.infura.io/v3/eda1216d6a374b3b861bf65556944cdb/"
      : "https://bsc-dataseed.binance.org/";

    (library.provider as any).sendAsync(
      {
        method: "wallet_switchEthereumChain",
        params: [{ chainId: requestChainId }],
        from: account,
      },
      function (err, result) {
        console.log("err", err);
        console.log("result", result);
        if (err && err.code === 4902) {
          (library.provider as any).sendAsync(
            {
              method: "wallet_addEthereumChain",
              params: [{ chainId: requestChainId, rpcUrl }],
              from: account,
            },
            function (err, result) {
              console.log("err", err);
              console.log("result", result);
            }
          );
        }
      }
    );
  };

  const handleClaim = async (token: IDOTokenSymbol) => {
    if (account && library) {
      setTransactionInProgress(true);
      handleOpenTransactionModal();

      try {
        const web3 = new Web3(library.provider);
        console.log("before claim", { hash });
        const result = await claimToken(web3, account, token);

        setHash(result.txHash);
        console.log("Claim result:", result);

        const { data } = await axios.post(`${URL()}/priviZoo/idoClaims`, {
          address: account,
          amount: result.amount, // in Wei
          tokenSymbol: token,
          contractAddress: VESTING_CONTRACT_ADDRESS[token],
          txHash: result.txHash,
          chainId: currentChain,
          claimedAt: new Date().getTime(),
        });

        console.log("saved record", data);
        setTransactionsList([data.data, ...transactionsList]);
        setTransactionSuccess(true);
      } catch (e) {
        console.log("Error claiming token", e);
        setTransactionSuccess(false);
      } finally {
        setTransactionInProgress(false);
      }
    }
  };

  const handleOpenConnectModal = () => {
    setOpenConnectModal(true);
  };

  const handleCloseConnectModal = () => {
    setOpenConnectModal(false);
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.navigationContainer}>
        <>
          <img
            src={require("assets/zooImages/gradient-frame-2.svg")}
            width="100%"
            className={classes.gradientFrame}
          />
          <a href="https://www.privi.store">
            <img src={require("assets/zooImages/logo.svg")} width="100%" className={classes.logo} />
          </a>
          <img src={require("assets/icons3d/logo3.png")} width="100%" className={classes.backLogo} />
          <img src={require("assets/icons3d/logo2.png")} width="100%" className={classes.backLogo2} />

          {!account ? (
            <Box className={classes.btnConnectContainer}>
              {/* <button className={classes.btnConnect} onClick={handleMetamaskExtension}>
                  Connect Wallet
                </button> */}
            </Box>
          ) : userSelector?.id ? (
            <img
              className={classes.avatar}
              src={getUserAvatar({
                id: userSelector.id,
                anon: userSelector.anon,
                hasPhoto: userSelector.hasPhoto,
                anonAvatar: userSelector.anonAvatar,
                url: userSelector.url,
              })}
            />
          ) : null}
        </>
      </Box>

      <div className={classes.contentContainer}>
        <Box
          className={classes.flexBox}
          alignItems="center"
          color="#707582"
          fontSize="14px"
          style={{ cursor: "pointer" }}
          onClick={() => {
            history.goBack();
          }}
        >
          <Box mr={"5px"}>
            <svg xmlns="http://www.w3.org/2000/svg" width="57" height="15" viewBox="0 0 57 15" fill="none">
              <path
                d="M7.28329 0.85612L7.13905 0.716853L7.00015 0.861441L0.840148 7.27344L0.707035 7.412L0.840148 7.55056L7.00015 13.9626L7.13655 14.1045L7.28066 13.9704L8.09266 13.2144L8.24099 13.0763L8.10094 12.9298L3.55228 8.172H55.7404H55.9404V7.972V6.852V6.652H55.7404H3.55407L8.10056 1.92261L8.23886 1.77874L8.09529 1.64012L7.28329 0.85612Z"
                fill="#707582"
                stroke="#707582"
                strokeWidth="0.4"
              />
            </svg>
          </Box>
          <span>BACK</span>
        </Box>

        <Box mt={5} mb={5} className={classes.title} style={{ textAlign: width < 960 ? "center" : "left" }}>
          Claim IDO Tokens
        </Box>

        <div className={classes.cardContent}>
          {!startConnect || wrongNetwork || noMetamask ? (
            <Box display="flex" alignItems="center" flexDirection="column">
              {!startConnect ? (
                <img
                  src={require("assets/icons3d/rewards1.png")}
                  alt=""
                  style={{
                    filter: "drop-shadow(0px 19.8027px 25.5728px rgba(15, 0, 106, 0.18))",
                    width: "132px",
                    height: "132px",
                    marginBottom: "-35px",
                  }}
                />
              ) : wrongNetwork || noMetamask ? (
                <div className={classes.topImageContainer}>
                  {noMetamask ? <img src={require("assets/walletImages/metamask.svg")} /> : <WarningIcon />}

                  {wrongNetwork ? <img src={require("assets/walletImages/metamask.svg")} /> : null}
                </div>
              ) : null}

              <Box
                mt="20px"
                mb="20px"
                className={classes.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                  textAlign: "center",
                }}
              >
                {!startConnect
                  ? "Claim TRAX and PIX for the launchpad events on Ignition, BSCpad, Trustpad, Safelaunch and/or Zendit"
                  : wrongNetwork
                  ? "Wrong network"
                  : "Install Metamsk"}
              </Box>

              <div className={classes.description}>
                {!startConnect
                  ? "If you participated in any of the Privi launchpads, you can connect your wallet to track and claim your vested tokens"
                  : wrongNetwork
                  ? `Seems like you are connected Metamask through wrong network. Please change it to BSC Mainnet to claim your tokens.`
                  : `We’ve discovered that you don’t have Metamask wallet installed.
                  Please follow the link below in order to cpnnect and acces your IDO tokens.`}
              </div>
            </Box>
          ) : (
            <>
              {IDO_TOKENS.map((token, index) => (
                <ClaimTokenCard
                  key={token}
                  title={`Available ${token}`}
                  imgUrl={TOKEN_ASSET_URL[token]}
                  scanAddress={VESTING_CONTRACT_ADDRESS[token]}
                  claimableAmount={traxAvailable[token] || 0}
                  scanUrl={`${
                    isDev ? "https://ropsten.etherscan.io/address/" : "https://bscscan.com/address/"
                  }${VESTING_CONTRACT_ADDRESS[token]}`}
                  tokenSymbol={token}
                  buttonTitle={`Claim ${token}`}
                  handleClaim={() => handleClaim(token)}
                />
              ))}
            </>
          )}

          {(!startConnect || (wrongNetwork && !isWC) || noMetamask) && (
            <button
              className={classes.button}
              style={{
                background: wrongNetwork || noMetamask ? "black" : "#4218B5",
                marginTop: "64px",
              }}
              disabled={startConnect && transactionInProgress}
              onClick={
                !startConnect
                  ? handleOpenConnectModal
                  : wrongNetwork
                  ? handleOpenMetamask
                  : () => window.open("https://metamask.io/download.html")
              }
            >
              {!startConnect
                ? "Connect Wallet"
                : wrongNetwork
                ? "Open Metamask"
                : noMetamask
                ? "Install Metamask"
                : ""}
            </button>
          )}

          {startConnect && account && (transactionInProgress || transactionSuccess === false) ? (
            <div className={classes.status}>
              {transactionInProgress ? (
                <CircularProgress style={{ color: "#4218B5", width: "12px", height: "12px" }} />
              ) : (
                <FailIcon />
              )}

              {transactionInProgress ? (
                <Box ml={2} color={"#4218B5"}>
                  Transaction in progress
                </Box>
              ) : (
                <Box ml={1} color={"#F43E5F"}>
                  Recent transaction failed
                </Box>
              )}
            </div>
          ) : null}
        </div>

        <Transactions transactionsList={transactionsList} />
      </div>

      <Box>
        <Bottom />
      </Box>

      <TransactionProgressModal
        open={openTransactionModal}
        onClose={handleCloseTransactionModal}
        transactionInProgress={transactionInProgress}
        transactionSuccess={transactionSuccess}
        hash={hash}
        network={network}
      />
      <NoMetamaskModal open={noMetamask} onClose={() => setNoMetamask(false)} />
      <ConnectWalletModal
        open={openConnectModal}
        handleClose={handleCloseConnectModal}
        handleWallectConnect={handleWalletConnect}
        handleMetamaskConnect={handleMetamaskExtension}
      />
    </Box>
  );
}

const WarningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="38" height="37" viewBox="0 0 38 37" fill="none">
    <path
      d="M19.0002 0.0742188C8.80361 0.0742188 0.573486 8.30434 0.573486 18.501C0.573486 28.6976 8.80361 36.9277 19.0002 36.9277C29.1969 36.9277 37.427 28.6976 37.427 18.501C37.427 8.30434 29.1969 0.0742188 19.0002 0.0742188ZM16.4205 8.79671C16.4205 7.40464 17.5261 6.29903 18.9182 6.29903C19.6552 6.29903 20.3102 6.58551 20.7608 7.07642C21.2517 7.56731 21.5382 8.22234 21.5382 8.9191V19.893C21.5382 21.3268 20.3506 22.513 18.9182 22.513C17.5261 22.513 16.4205 21.3671 16.4205 20.0154V8.79671ZM22.1125 27.9189C21.9484 29.393 20.7607 30.5807 19.3283 30.7031C17.3216 30.9075 15.643 29.2289 15.8474 27.2221C16.0115 25.7883 17.1992 24.5603 18.6316 24.438C20.6787 24.2335 22.3571 25.9121 22.1125 27.9189Z"
      fill="#FF8B32"
    />
  </svg>
);

const FailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle opacity="0.2" cx="8.02762" cy="7.76151" r="7.38651" fill="#F43E5F" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.77334 4.87531L5.22394 4.42471C5.32147 4.32718 5.47975 4.32718 5.56502 4.42471L8.11082 6.95857L10.6447 4.42471C10.7422 4.32718 10.9005 4.32718 10.998 4.42471L11.4486 4.87531C11.5461 4.97283 11.5461 5.13111 11.4486 5.21638L8.90281 7.76218L11.4486 10.296C11.5461 10.3936 11.5461 10.5519 11.4486 10.6494L10.998 11.1C10.9005 11.1975 10.7422 11.1975 10.6447 11.1L8.11082 8.55418L5.56502 11.1C5.47975 11.1975 5.32147 11.1975 5.22394 11.1L4.77334 10.6494C4.67581 10.5519 4.67581 10.3936 4.77334 10.296L7.3072 7.76218L4.77334 5.21638C4.67581 5.13111 4.67581 4.97283 4.77334 4.87531Z"
      fill="#F43E5F"
    />
  </svg>
);
