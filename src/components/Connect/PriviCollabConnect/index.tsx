import React, { useEffect, useState, useRef } from "react";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { TwitterShareButton } from "react-share";
import { useHistory } from "react-router-dom";
import Web3 from "web3";
import axios from "axios";
import io from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";

import { useAuth } from "shared/contexts/AuthContext";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Box from "shared/ui-kit/Box";
import { NoMetamaskModal } from "shared/ui-kit/Modal/Modals/NoMetamaskModal";
import { injected } from "shared/connectors";
import * as API from "shared/services/API/WalletAuthAPI";
import {
  handleTwitterLink,
  handleInstagramLink,
  handleLinkedinLink,
  handleTiktokLink,
  handleMediumLink,
  handleYoutubeLink,
} from "shared/constants/constants";
import { socket, setSocket } from "components/Login/Auth";
import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { setUser } from "store/actions/User";
import { setLoginBool } from "store/actions/LoginBool";
import Footer from "./components/Footer";
import { priviSocialConnectPageStyles } from "./index.styles";

import { ReactComponent as YoutubeIcon } from "assets/snsIcons/youtube.svg";
import { ReactComponent as TwitterIcon } from "assets/snsIcons/twitter.svg";
import { ReactComponent as InstagramIcon } from "assets/snsIcons/instagram.svg";
import { ReactComponent as LinkedInIcon } from "assets/snsIcons/linkedin.svg";
import { ReactComponent as TiktokIcon } from "assets/snsIcons/tiktok.svg";
import { ReactComponent as MediaIcon } from "assets/snsIcons/media.svg";
import { ChevronIconLeft } from "shared/ui-kit/Icons";

import { useInterval } from "shared/hooks/useInterval";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

const PriviSocialBox = () => {
  const classes = priviSocialConnectPageStyles();
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

const PriviCollabsConnect = () => {
  const history = useHistory();
  const classes = priviSocialConnectPageStyles();
  const { isSignedin, setSignedin } = useAuth();
  const userSelector = useSelector((state: RootState) => state.user);
  const { showAlertMessage } = useAlertMessage();
  const { activate, account, library } = useWeb3React();
  const [status, setStatus] = useState<string>("nolist");
  const [waitlisted, setWaitlisted] = useState<boolean>(false);
  const [tweetWait, setTweetWait] = useState<boolean>(false);
  const [tweetWaitlistLoading, setTweetWaitlistLoading] = useState<boolean>(false);
  const tweetWaitRef = useRef<boolean>(false);
  const [noMetamask, setNoMetamask] = useState<boolean>(false);
  const dispatch = useDispatch();
  const twitterButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (account && account.length > 0) {
      axios
        .post(`${URL()}/wallet/getEthAddressStatus`, {
          address: account,
          appName: "PriviCollabs",
        })
        .then(async res => {
          if (res.data.success === true) {
            const data = res.data.data;
            if (data.status === "authorized") {
              setStatus("authorized");
              const web3 = new Web3(library.provider);
              API.signInWithMetamaskWallet(account, web3, "Privi Collabs").then(res => {
                if (res.isSignedIn) {
                  setSignedin(true);
                  const data = res.userData;
                  if (!socket) {
                    const sock = io(URL(), { query: { token: res.accessToken } });
                    sock.connect();
                    setSocket(sock);
                  }
                  if (socket) {
                    socket.emit("add user", data.id);
                  }
                  dispatch(setUser(data));
                  sessionStorage.setItem("token", res.accessToken);
                  sessionStorage.setItem("address", account);
                  sessionStorage.setItem("userId", data.id);
                  sessionStorage.setItem("userSlug", data.urlSlug ?? data.id);

                  axios.defaults.headers.common["Authorization"] = "Bearer " + res.accessToken;
                  dispatch(setLoginBool(true));

                  //added this last line to refresh the page, it got stuck after loging in. If there's
                  //another way to fix that feel free to change it
                  history.push("/collabs");
                } else {
                  if (res.message) {
                    showAlertMessage(res.message, { variant: "error" });
                  } else {
                    showAlertMessage("Connect the metamask", { variant: "error" });
                  }
                }
              });
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

  const handleConnectWallet = () => {
    activate(injected, undefined, true).catch(error => {
      if (error instanceof UnsupportedChainIdError) {
        activate(injected);
      } else {
        console.info("Connection Error - ", error);
        setNoMetamask(true);
      }
    });
  };

  //  blinding early access
  useEffect(() => {
    var bgColorIdx = 0;
    var colorIdx = 0;

    const intervalRef = setInterval(() => {
      var doc = document.getElementById("earlyAccessCollab");
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
          appName: "PriviCollabs",
        })
        .then(res => {
          if (res.data.success === true) {
            const data = res.data.data;
            if (data.status === "waitlisted") {
              setWaitlisted(true);
              setTweetWaitlistLoading(false);
              tweetWaitRef.current = false;
            } else if (data.status === "authorized") {
              history.push("/collabs");
            }
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  }, 10000);

  return (
    <Box className={classes.container}>
      <img
        src={require("assets/collabImages/connectBackground.png")}
        className={classes.backgroundImage}
        alt="Privi Collab"
      />
      <img
        src={require("assets/collabImages/connectLogo.png")}
        className={classes.backgroundLogo}
        alt="Privi Collab"
      />
      <img src={require("assets/logos/privi_collab.png")} className={classes.logo} alt="Privi Collab" />
      <Box className={classes.navigationContainer}>
        <Box
          className={classes.backBox}
          onClick={() => {
            history.goBack();
          }}
        >
          <Box mr={3}>
            <ChevronIconLeft />
          </Box>
          <span className={classes.backButton}>Back</span>
        </Box>
        <Box className={classes.mainContainer} display="flex" flexDirection="column">
          <Box className={classes.titleContainer} display="flex" alignItems="center" justifyContent="center">
            <Box position="relative">
              <img src={require("assets/logos/privi_collab.png")} alt="Privi Collab" />
              <span id="earlyAccessCollab" className={classes.earlyAccess}>
                early access
              </span>
            </Box>
          </Box>
          {account ? (
            <>
              {waitlisted ? (
                <>
                  <Box className={classes.titleDescription2}>
                    Congrats! You’ve been successfully whitelisted.
                    <h3 className={classes.titleFollow}>Follow our social media for updates</h3>
                  </Box>
                  <PriviSocialBox />
                </>
              ) : status !== "nolist" ? (
                <>
                  {status === "authorized" ? (
                    <Box className={classes.titleDescription2}>
                      Connect your Wallet to Mainnet Network
                      <h3 className={classes.titleFollow}>Follow our social media for updates</h3>
                    </Box>
                  ) : (
                    <Box className={classes.titleDescription2}>
                      Looks like you are already on our whitelist. Stay tuned!
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
                      I just joined the @priviprotocol waitlist for <b>Privi Collabs</b> with {account}! Join
                      me to be one of the first people on <b>Privi Collabs</b> and a chance to win up to 200
                      USDC!{" "}
                      <a href="https://bit.ly/3xfg8S2" target="_blank">
                        https://bit.ly/3xfg8S2
                      </a>
                    </span>
                    <LoadingWrapper loading={tweetWaitlistLoading}>
                      <TwitterShareButton
                        title={`I just joined the @priviprotocol waitlist for Privi Collabs with ${account}! Join me to be one of the first people on Privi Collabs and a chance to win up to 200 USDC!`}
                        url="https://bit.ly/3xfg8S2"
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
                          <span>Share on Twitter</span>
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
                <span>enter the platform if you already have access</span>
              </Box>
              <Box className={classes.btnConnectContainer}>
                <button className={classes.btnConnect} onClick={handleConnectWallet}>
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
    </Box>
  );
};

export default PriviCollabsConnect;
