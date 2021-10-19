import React, { useState } from "react";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import Box from "shared/ui-kit/Box";
import { CopyToClipboard } from "react-copy-to-clipboard";

import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { useVerifyNFTLockStyles } from "./index.styles";

import axios from "axios";
import URL from "shared/functions/getURL";

import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

const isProd = process.env.REACT_APP_ENV === "prod";

export default function VerifyNFTLock({ onClose, onCompleted, nft }) {
  const classes = useVerifyNFTLockStyles();
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [isVerified, setVerified] = useState<boolean>(false);

  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  const handleVerify = async () => {
    console.log("chainId", chainId);
    if (chainId !== 80001 && chainId !== 137) {
      let changed = await switchNetwork(isProd ? 137 : 80001);
      if (!changed) {
        showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
        return;
      }
    }
    const selectedChain = BlockchainNets.find(b => b.name === "POLYGON");
    if (!selectedChain) return;
    setIsProceeding(true);
    try {
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      const setHash_ = hash => {
        setHash(hash);
      };
      const response = await web3APIHandler.SyntheticCollectionManager.verifyToken(web3, account!, nft, {
        tokenId: nft.SyntheticID,
        setHash: setHash_,
      });
      if (!response.success) {
        setIsProceeding(false);
        showAlertMessage(`Got failed while verify NFT`, { variant: "error" });
        return;
      }
      const params = {
        collectionAddress: nft.collection_id,
        syntheticID: nft.SyntheticID,
      };
      const { data } = await axios.post(`${URL()}/syntheticFractionalize/verifyNFT`, params);
      if (!data.success) {
        setIsProceeding(false);
        showAlertMessage(`Got failed while verify NFT`, { variant: "error" });
        return;
      }
      onCompleted();
      setVerified(true);
      setIsProceeding(false);
    } catch (err) {
      console.log("error", err);
      setIsProceeding(false);
      showAlertMessage(`Got failed while verify NFT`, { variant: "error" });
    }
  };

  const handleLater = () => {
    onClose();
  };

  const handlePolygonScan = () => {
    window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${hash}`, "_blank");
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {isVerified ? (
          <Box className={classes.result}>
            <img className={classes.icon} src={require("assets/icons/lock-success-icon.png")} alt="" />
            <h1 className={classes.title}>Your NFT is verified!</h1>
            <p className={classes.description}>
              Your NFT has been verified successfully. <br />
              You can see it in My NFT Panel now.
            </p>
            <button className={classes.checkBtn} onClick={handleLater}>
              Close
            </button>
          </Box>
        ) : isProceeding ? (
          <>
            <LoadingWrapper loading={true} theme="blue" iconWidth="80px" iconHeight="80px" />
            <h1 className={classes.title}>Verifying...</h1>
            <p className={classes.description}>
              Transaction is proceeding on Polygon Chain. <br />
              This can take a moment, please be patient...
            </p>
            {hash && (
              <CopyToClipboard text={hash}>
                <Box
                  mt="20px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  className={classes.hash}
                >
                  Hash:
                  <Box color="#4218B5" mr={1} ml={1}>
                    {hash.substr(0, 18) + "..." + hash.substr(hash.length - 3, 3)}
                  </Box>
                  <CopyIcon />
                </Box>
              </CopyToClipboard>
            )}
            <button className={classes.checkBtn} onClick={handlePolygonScan}>
              Check on Polygon Scan
            </button>
          </>
        ) : (
          <>
            <img className={classes.icon} src={require("assets/icons/verify-nft-icon.png")} alt="" />
            <h1 className={classes.title}>
              Almost there !<br /> Verify your NFT lock{" "}
            </h1>
            <p className={classes.description}>
              Please verify if your NFT has been locked <br />
              by clicking the button below.
            </p>
            <button className={classes.btn} onClick={handleVerify}>
              Verify
            </button>
          </>
        )}
      </div>
    </div>
  );
}
