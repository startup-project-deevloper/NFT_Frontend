import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useWeb3React, UnsupportedChainIdError } from "@web3-react/core";
import { TwitterShareButton } from "react-share";

import { useAuth } from "shared/contexts/AuthContext";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Box from "shared/ui-kit/Box";
import { NoMetamaskModal } from "shared/ui-kit/Modal/Modals/NoMetamaskModal";
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

const PriviHome = () => {
  const history = useHistory();
  const classes = priviHomePageStyles();
  const { isSignedin, setSignedin } = useAuth();
  const userSelector = useSelector((state: RootState) => state.user);
  const { showAlertMessage } = useAlertMessage();
  const { activate, account, library } = useWeb3React();
  const [status, setStatus] = useState<string>("nolist");
  const [noMetamask, setNoMetamask] = useState<boolean>(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (account && account.length > 0) {
      if (!isSignedin) {
        axios
          .post(`${URL()}/wallet/getEthAddressStatus`, {
            address: account,
            appName: "PriviZoo",
          })
          .then(async res => {
            if (res.data.success === true) {
              const data = res.data.data;
              if (data.status === "authorized") {
                setStatus("authorized");
                const web3 = new Web3(library.provider);
                API.signInWithMetamaskWallet(account, web3, "Privi Home").then(res => {
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
                    localStorage.setItem("token", res.accessToken);
                    localStorage.setItem("address", account);
                    localStorage.setItem("userId", data.id);
                    localStorage.setItem("userSlug", data.urlSlug ?? data.id);

                    axios.defaults.headers.common["Authorization"] = "Bearer " + res.accessToken;
                    dispatch(setLoginBool(true));

                    //added this last line to refresh the page, it got stuck after loging in. If there's
                    //another way to fix that feel free to change it
                    history.push("/zoo");
                  } else {
                    if (res.message) {
                      showAlertMessage(res.message, { variant: "error" });
                    } else {
                      showAlertMessage("Connect the metamask", { variant: "error" });
                    }
                  }
                });
              } else {
                setStatus(data.status);
              }
            }
          });
      } else {
        history.push("/zoo");
      }
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

  return (
    <Box className={classes.container}>
      <Box className={classes.subContainer}>
        <Box className={classes.navigationContainer}>
          <Header />
          <Box display="flex" flexDirection="column">
            <Box
              className={classes.titleContainer}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <h1 className={classes.title}>PRIVI</h1>
              <h1 className={classes.zooTitle}>ZOO</h1>
              <span className={classes.earlyAccess}>early access</span>
            </Box>
            {account ? (
              <>
                {status != "nolist" ? (
                  <>
                    {status == "authorized" ? (
                      <Box className={classes.titleDescription}>
                        <h4>🎉 Congrats! You’ve been successfully whitelisted.</h4>
                        <h3 className={classes.titleFollow}>Follow our social media for updates</h3>
                      </Box>
                    ) : (
                      <Box className={classes.titleDescription}>
                        <h4>Looks like you are already on our whitelist. Stay tuned!</h4>
                        <h3 className={classes.titleFollow}>Follow our social media for updates</h3>
                      </Box>
                    )}
                    <Box className={classes.snsContainer}>
                      <Box className={classes.snsBox} onClick={handleYoutubeLink}>
                        <YoutubeIcon />
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
                  </>
                ) : (
                  <>
                    <Box className={classes.titleDescription}>
                      You are one step closer to be whitelisted.
                      <br />
                      <span>Tweet this to enjoy early access</span>
                    </Box>
                    <Box className={classes.twitterShareContainer}>
                      <span>
                        <b>Privi Zoo</b> is now on Testnet and launching soon. Visit “
                        <a href="https://www.privi.store/#/" target="_blank">
                          https://www.privi.store/#/
                        </a>
                        ” to get on the Waitlist and get early access.
                        <p> @priviprotocol {account} </p>
                      </span>
                      <TwitterShareButton
                        title={`Privi Zoo is now on Testnet and launching soon. Visit us to get on the Waitlist and get early access. @priviprotocol ${account}`}
                        url="https://www.privi.store/#/"
                      >
                        <button className={classes.twitterShareButton}>
                          <TwitterIcon />
                          <span>Share on Twitter</span>
                        </button>
                      </TwitterShareButton>
                    </Box>
                  </>
                )}
              </>
            ) : (
              <>
                <Box className={classes.titleDescription}>
                  <h2>
                    Connect your wallet to get in to
                    <br /> the whitelist.
                  </h2>
                  <h3>Or to log into the platform if you already have access.</h3>
                </Box>
                <Box className={classes.btnConnectContainer}>
                  <button className={classes.btnConnect} onClick={handleConnectWallet}>
                    CONNECT WALLET
                  </button>
                </Box>
              </>
            )}
          </Box>
        </Box>
        <Box>
          <Footer />
        </Box>
      </Box>
      <NoMetamaskModal open={noMetamask} onClose={() => setNoMetamask(false)} />
    </Box>
  );
};

export default PriviHome;
