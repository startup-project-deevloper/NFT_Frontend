import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { TwitterShareButton } from "react-share";
import { WalletConnectConnector } from "@web3-react/walletconnect-connector";
import QRCodeModal from "@walletconnect/qrcode-modal";

import { useAuth } from "shared/contexts/AuthContext";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Box from "shared/ui-kit/Box";
import { NoMetamaskModal } from "shared/ui-kit/Modal/Modals/NoMetamaskModal";
import { NoAuthModal } from "shared/ui-kit/Modal/Modals/NoAuthModal";
import { USDTGetModal } from "shared/ui-kit/Modal/Modals/USDTGetModal"
import { SwitchNetworkModal } from "shared/ui-kit/Modal/Modals/SwitchNetworkModal/SwitchNetworkModal";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import Web3 from "web3";
import Footer from "./components/Footer";
import Header from "./components/Header";
import { priviHomePageStyles } from "./index.styles";
import { injected } from "shared/connectors";
import * as API from "shared/services/API/WalletAuthAPI";
import { ReactComponent as YoutubeIcon } from "assets/snsIcons/youtube.svg";
import { ReactComponent as TwitterIcon } from "assets/snsIcons/twitter.svg";
import { ReactComponent as InstagramIcon } from "assets/snsIcons/instagram.svg";
import { ReactComponent as LinkedInIcon } from "assets/snsIcons/linkedin.svg";
import { ReactComponent as TiktokIcon } from "assets/snsIcons/tiktok.svg";
import { ReactComponent as MediaIcon } from "assets/snsIcons/media.svg";
import {
  handleYoutubeLink,
  handleTwitterLink,
  handleInstagramLink,
  handleLinkedinLink,
  handleTiktokLink,
  handleMediumLink,
} from "shared/constants/constants";
import { socket, setSocket } from "components/Login/Auth";
import axios from "axios";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { setUser } from "store/actions/User";
import { setLoginBool } from "store/actions/LoginBool";
import { useInterval } from "shared/hooks/useInterval";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import ConnectWalletModal from "shared/ui-kit/Modal/Modals/ConnectWalletModal";

const PriviSocialBox = () => {
  const classes = priviHomePageStyles();
  return (
    <Box className={classes.snsContainer}>
      <Box className={classes.snsBox} onClick={handleYoutubeLink}>
        <YoutubeIcon width="26px" />
      </Box>
      <Box className={classes.snsBox} onClick={handleTwitterLink}>
        <TwitterIcon />
      </Box>
      <Box className={classes.snsBox} onClick={handleInstagramLink}>
        <InstagramIcon />
      </Box>
      <Box className={classes.snsBox} onClick={handleLinkedinLink}>
        <LinkedInIcon />
      </Box>
      <Box className={classes.snsBox} onClick={handleTiktokLink}>
        <TiktokIcon />
      </Box>
      <Box className={classes.snsBox} onClick={handleMediumLink}>
        <MediaIcon />
      </Box>
    </Box>
  );
};

const PriviPixConnect = () => {
  const history = useHistory();
  const classes = priviHomePageStyles();
  const { isSignedin, setSignedin } = useAuth();
  const userSelector = useSelector((state: RootState) => state.user);
  const { showAlertMessage } = useAlertMessage();
  const { activate, account, library, chainId } = useWeb3React();
  const [status, setStatus] = useState<string>("nolist");
  const [waitlisted, setWaitlisted] = useState<boolean>(false);
  const [tweetWait, setTweetWait] = useState<boolean>(false);
  const [tweetWaitlistLoading, setTweetWaitlistLoading] = useState<boolean>(false);
  const tweetWaitRef = useRef<boolean>(false);
  const [noMetamask, setNoMetamask] = useState<boolean>(false);
  const dispatch = useDispatch();
  const twitterButton = useRef<HTMLButtonElement>(null);
  const [rightNetwork, setRightNetwork] = useState<boolean>(false);
  const [isShowNoAuth, setShowNoAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isShowUSDTGet, setShowUSDTGet] = useState<boolean>(false);
  const [freeUSDTAmount, setFreeUSDTAmount] = useState<number>(0);

  const [openConnectModal, setOpenConnectModal] = useState<boolean>(false);

  const signData = useRef();

  useEffect(() => {
    if (account && account.length > 0) {
      axios
        .post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account,
          appName: "PriviPix",
        })
        .then(async res => {
          if (res.data.success === true) {
            const data = res.data.data;

            if (data.status === "authorized") {
              setStatus("authorized");
              const isNotifiedTestnet = localStorage.getItem(`PixTestNetNotify${account}`);
              if (!isNotifiedTestnet || isNotifiedTestnet !== "true") {
                setRightNetwork(true);
                localStorage.setItem(`PixTestNetNotify${account}`, "true");
              } else {
                OnGetUSDT();
              }
            } else {
              if (data.status === "nolist") {
                twitterButton?.current?.click();
                setTweetWaitlistLoading(true);
                tweetWaitRef.current = true;
              }
              setStatus(data.status);
            }
          }
        });
    }
  }, [account]);

  const handleMetamaskConnect = () => {
    setOpenConnectModal(false);

    activate(injected, undefined, true).catch(error => {
      if (error instanceof UnsupportedChainIdError) {
        activate(injected);
      } else {
        console.info("Connection Error - ", error);
        setNoMetamask(true);
      }
    });
  };

  const handleWalletConnect = () => {
    setOpenConnectModal(false);

    const walletconnect = new WalletConnectConnector({
      rpc: { 1: process.env.REACT_APP_INFURA_URL || "" },
      bridge: "wss://wc-bridge-5qt5i.ondigitalocean.app:443",
      qrcodeModal: QRCodeModal,
    });

    activate(walletconnect, undefined, true).catch(error => {
      if (error instanceof UnsupportedChainIdError) {
        activate(walletconnect);
      } else {
        console.info("Connection Error - ", error);
      }
    });
  }

  //  blinding early access
  useEffect(() => {
    var bgColorIdx = 0;
    var colorIdx = 0;

    const intervalRef = setInterval(() => {
      var doc = document.getElementById("earlyAccessPix");
      const color = ["#ffffff", "#181818"];
      const bgColor = ["#ffa234", "#ef43c9", "#7e85ff", "#7ed1ef", "#bf7eff"];
      if (doc) {
        doc.style.backgroundColor = bgColor[bgColorIdx];
      }
      if (bgColorIdx % bgColor.length === 0) {
        if (doc) {
          doc.style.color = color[colorIdx];
        }
        colorIdx = (colorIdx + 1) % color.length;
      }
      bgColorIdx = (bgColorIdx + 1) % bgColor.length;
    }, 500);

    return () => {
      clearInterval(intervalRef);
    };
  }, []);

  useInterval(() => {
    if (tweetWaitRef.current) {
      axios
        .post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account,
          appName: "PriviPix",
        })
        .then(res => {
          if (res.data.success === true) {
            const data = res.data.data;
            if (data.status === "waitlisted") {
              setWaitlisted(true);
              setTweetWaitlistLoading(false);
              tweetWaitRef.current = false;
            } else if (data.status === "authorized") {
              history.push("/");
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, 10000);

  const handleOpenConnectModal = () => {
    setOpenConnectModal(true);
  }

  const handleCloseConnectModal = () => {
    setOpenConnectModal(false);
  }

  const handleCloseSwitchNetworkModal = () => {
    setRightNetwork(true);
  }

  const OnGetUSDT = async () => {
    try {
      setRightNetwork(false);
      if (account && library) {
        const web3 = new Web3(library.provider);
        const res = await API.signInWithMetamaskWallet(account, web3, "Privi PIX");
        if (res.isSignedIn) {
          signData.current = res;
          const data = res.userData;
          //added this last line to refresh the page, it got stuck after loging in. If there's
          //another way to fix that feel free to change it
          if (!data.isGotFreeToken) {
            setLoading(true);
            const tokenRes = await axios.post(
              `${URL()}/user/sendFreeUSDTToken`,
              { address: account },
              {
                headers: {
                  "Authorization": "Bearer " + res.accessToken,
                }
              }
            );
            setLoading(false);
            if (tokenRes.data.success) {
              setFreeUSDTAmount(tokenRes.data.amount);
              setShowUSDTGet(true);
            } else {
              setShowNoAuth(true);
              showAlertMessage(tokenRes.data.message, { variant: "error" });
            }
          } else {
            handleSignIn();
          }
        } else {
          if (res.message) {
            showAlertMessage(res.message, { variant: "error" });
          } else {
            showAlertMessage("Connect the metamask", { variant: "error" });
          }
        }
      }
    } catch (err) {

    }
  };

  const handleSignIn = async () => {
    const res: any = signData.current;
    if (res && account) {
      setSignedin(true);
      if (!socket) {
        const sock = io(URL(), {
          query: { token: res.accessToken },
          transports: ["websocket"],
        });
        sock.connect();
        setSocket(sock);
      }
      if (socket) {
        socket.emit("add user", res.userData.id);
      }
      dispatch(setUser(res.userData));
      localStorage.setItem("token", res.accessToken);
      localStorage.setItem("address", account);
      localStorage.setItem("userId", res.userData.id);
      localStorage.setItem("userSlug", res.userData.urlSlug ?? res.userData.id);

      axios.defaults.headers.common["Authorization"] = "Bearer " + res.accessToken;
      dispatch(setLoginBool(true));
      history.push("/");
    }
  }

  return (
    <Box className={classes.container}>
      <Box className={classes.navigationContainer} pt={account ? "200px !important" : undefined}>
        <Header cardHidden={!!account} />
        <Box className={classes.mainContainer} display="flex" flexDirection="column">
          <Box className={classes.titleContainer} display="flex" alignItems="center" justifyContent="center">
            <Box position="relative">
              <img
                src={require("assets/logos/privi_pix_black_3x.svg")}
                alt="Pix"
                className={classes.pixLogo}
              />
              <span id="earlyAccessPix" className={classes.earlyAccess}>
                early access
              </span>
            </Box>
          </Box>
          {account ? (
            <>
              {waitlisted ? (
                <>
                  <Box className={classes.titleDescription2}>
                    <h4 style={{ fontWeight: 400 }}>🎉 Congrats! You’ve been successfully whitelisted.</h4>
                    <h3 className={classes.titleFollow}>Follow our social media for updates</h3>
                  </Box>
                  <PriviSocialBox />
                </>
              ) : status != "nolist" ? (
                <>
                  {status == "authorized" ? (
                    <Box className={classes.titleDescription2}>
                      <h4 style={{ fontWeight: 400 }}>Connect your Wallet to Mainnet Network</h4>
                      <h3 className={classes.titleFollow}>Follow our social media for updates</h3>
                    </Box>
                  ) : (
                    <Box className={classes.titleDescription2}>
                      <h4 style={{ fontWeight: 400 }}>
                        Looks like you are already on our whitelist. Stay tuned!
                      </h4>
                      <h3 className={classes.titleFollow}>Follow our social media for updates</h3>
                    </Box>
                  )}
                  <PriviSocialBox />
                </>
              ) : (
                <>
                  <Box className={classes.titleDescription2}>
                    You're one step closer to getting on the app whitelist!
                    <br />
                    <span>Tweet this to enjoy early access</span>
                  </Box>
                  <Box className={classes.twitterShareContainer}>
                    <span>
                      I just joined the @priviprotocol waitlist for <b>Pix</b> with {account}! Join me
                      to be one of the first people on <b>Pix</b> and a chance to win up to 200 USDC!{" "}
                      <a href="https://bit.ly/3jaCBue" target="_blank">
                        https://bit.ly/3jaCBue
                      </a>
                    </span>
                    <LoadingWrapper loading={tweetWaitlistLoading}>
                      <TwitterShareButton
                        title={`I just joined the @priviprotocol waitlist for Pix with ${account}! Join me to be one of the first people on Pix and a chance to win up to 200 USDC!`}
                        url="https://bit.ly/3jaCBue"
                        style={{ height: "100%" }}
                        ref={twitterButton}
                      >
                        <button
                          className={classes.twitterShareButton}
                          onClick={() => {
                            setTweetWaitlistLoading(true);
                            tweetWaitRef.current = true;
                          }}
                        >
                          <TwitterIcon />
                          <span style={{ color: "#FFF" }}>Share on Twitter</span>
                        </button>
                      </TwitterShareButton>
                    </LoadingWrapper>
                  </Box>
                </>
              )}
            </>
          ) : (
            <>
              <Box className={classes.titleDescription}>
                Connect your wallet to get in to the whitelist, or{" "}
                <span style={{ color: "#4218B5", fontWeight: 300 }}>
                  enter the platform if you already have access
                </span>
              </Box>
              <Box className={classes.btnConnectContainer}>
                <button className={classes.btnConnect} onClick={handleOpenConnectModal}>
                  Connect Wallet
                </button>
              </Box>
            </>
          )}
        </Box>
      </Box>
      <Box>
        <Footer />
      </Box>
      <NoMetamaskModal open={noMetamask} onClose={() => setNoMetamask(false)} />
      <ConnectWalletModal
        open={openConnectModal}
        handleClose={handleCloseConnectModal}
        handleWallectConnect={handleWalletConnect}
        handleMetamaskConnect={handleMetamaskConnect}
      />
      <SwitchNetworkModal
        open={rightNetwork}
        onClose={handleCloseSwitchNetworkModal}
        onNext={OnGetUSDT}
      />
      <NoAuthModal open={isShowNoAuth} onClose={() => setShowNoAuth(false)} />
      <LoadingScreen
        loading={loading}
        TitleRender={() => (
          <span style={{ fontSize: 20, fontWeight: 800, textAlign: 'center' }}>
            We Are{" "}
            <span style={{ color: "#2D3047" }}>
              Sending You 100K Test USDT
            </span>{" "}
            To Test <br />Test PIX
          </span>
        )}
        SubTitleRender={() => (
          <span style={{ fontSize: 18, color: "#2D3047" }}>
            This will take around 30 seconds.
            <br />
            Please be patient
          </span>
        )}
        handleClose={() => null}
      >
        <USDTGetModal
          open={isShowUSDTGet}
          onClose={() => {
            setShowUSDTGet(false);
            handleSignIn();
          }}
          amount={freeUSDTAmount}
          account={account ?? ""}
        />
      </LoadingScreen>
    </Box>
  );
};

export default PriviPixConnect;
