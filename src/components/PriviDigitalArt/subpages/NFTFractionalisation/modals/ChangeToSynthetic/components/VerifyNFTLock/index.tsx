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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [isVerified, setVerified] = useState<boolean>(false);

  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  const handleVerify = () => {
    onClose()
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
            <h1 className={classes.title}>Your NFT is Locked!</h1>
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
            {!isLoading && (
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
              Almost there !<br /> Verify your new NFT lock{" "}
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
