import React, { useState } from "react";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Box from "shared/ui-kit/Box";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { useUnlockNFTStyles } from "./index.styles";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { requestUnlockNFT, withdrawNFT } from "shared/services/API/web3/contracts/NFTVaultManager";
import axios from "axios";
import URL from "shared/functions/getURL";

declare let window: any;
const isProd = process.env.REACT_APP_ENV === "prod";

export default function UnlockNFT({ onClose, onCompleted, needLockLaterBtn = true, nft }) {
  const classes = useUnlockNFTStyles();
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [isUnlocked, setUnlocked] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  const handleProceed = async () => {
    console.log("chainId", chainId);
    if (chainId !== 1 && chainId !== 4) {
      let changed = await switchNetwork(isProd ? 1 : 4);
      if (!changed) {
        showAlertMessage(`Got failed while switching over to ethereum network`, { variant: "error" });
        return;
      }
    }
    setIsProceeding(true);

    try {
      const web3 = new Web3(library.provider);

      const payload = {
        tokenAddress: nft.collection_id,
        tokenId: nft.NftId,
        setHash,
      };
      const requestUnlockResponse = await requestUnlockNFT(web3, account!, payload);
      if (!requestUnlockResponse.status) {
        showAlertMessage(`Request Unlock is failed, please try again later`, { variant: "error" });
        setIsProceeding(false);
        return;
      }
      const withdrawResponse = await withdrawNFT(web3, account!, payload);
      if (!withdrawResponse.status) {
        showAlertMessage(`Unlock NFT is failed, please try again later`, { variant: "error" });
        setIsProceeding(false);
        return;
      }
      const params = {
        collectionAddress: nft.collection_id,
        syntheticID: nft.SyntheticID,
      };
      const { data } = await axios.post(`${URL()}/syntheticFractionalize/unlockNFT`, params);
      if (data.success) {
        onCompleted();
      } else {
        showAlertMessage(`Unlock NFT is failed, please try again later`, { variant: "error" });
      }
      onCompleted();
      setIsProceeding(false);
      setUnlocked(true);
    } catch (err) {
      console.log("error", err);
      setIsProceeding(false);
      showAlertMessage(`Unlock NFT is failed, please try again later`, { variant: "error" });
    }
  };

  const handleLater = () => {
    onClose();
  };

  const handleEtherScan = () => {
    window.open(`https://${!isProd ? "rinkeby." : ""}etherscan.io/tx/${hash}`, "_blank");
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {isUnlocked ? (
          <Box className={classes.result}>
            <img className={classes.icon} src={require("assets/icons/lock-success-icon.png")} alt="" />
            <h1 className={classes.title}>Your NFT is unlocked!</h1>
            <p className={classes.description}>
              Your NFT has been unlocked successfully. <br />
              You can see it in My NFT Panel now.
            </p>
            <button className={classes.checkBtn} onClick={handleLater}>
              Close
            </button>
          </Box>
        ) : isProceeding ? (
          <>
            <LoadingWrapper loading={true} theme="blue" iconWidth="80px" iconHeight="80px" />
            <Box className={classes.result}>
              <h1 className={classes.title}>Unlocking in progress</h1>
              <p className={classes.description}>
                Transaction is proceeding on Ethereum. <br />
                This can take a moment, please be patient...
              </p>
              {hash && (
                <>
                  <CopyToClipboard text={hash}>
                    <Box mt="20px" display="flex" alignItems="center" className={classes.hash}>
                      Hash:
                      <Box color="#4218B5" mr={1} ml={1}>
                        {hash.substr(0, 18) + "..." + hash.substr(hash.length - 3, 3)}
                      </Box>
                      <CopyIcon />
                    </Box>
                  </CopyToClipboard>
                  <button className={classes.checkBtn} onClick={handleEtherScan}>
                    Check on EtherScan
                  </button>
                </>
              )}
            </Box>
          </>
        ) : (
          <>
            <img className={classes.icon} src={require("assets/icons/lock-nft-icon.png")} alt="" />
            <h1 className={classes.title}>Unlock NFT on Ethereum</h1>
            <p className={classes.description}>
              Your NFT will be unlocked from a Vault on Ethereum smart contract. <br />
              Please keep in mind this process can take some time so be patient.
            </p>
            {needLockLaterBtn ? (
              <Box className={classes.buttonWrapper}>
                <button className={classes.laterBtn} onClick={handleLater}>
                  Unlock Later
                </button>
                <button className={classes.btn} onClick={handleProceed}>
                  Proceed
                </button>
              </Box>
            ) : (
              <button className={classes.proceedBtn} onClick={handleProceed}>
                Proceed
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
