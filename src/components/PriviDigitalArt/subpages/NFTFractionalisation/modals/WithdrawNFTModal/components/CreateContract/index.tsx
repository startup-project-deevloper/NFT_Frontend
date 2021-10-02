import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Box from "shared/ui-kit/Box";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { PriceFeed_URL, PriceFeed_Token } from "shared/functions/getURL";
import axios from "axios";
import URL from "shared/functions/getURL";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";
import { toNDecimals } from "shared/functions/web3";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
import JOT from "shared/services/API/web3/contracts/ERC20Tokens/JOT";
import SyntheticProtocolRouter from "shared/connectors/web3/contracts/SyntheticProtocolRouter.json";

declare let window: any;
const isProd = process.env.REACT_APP_ENV === "prod";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      padding: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      width: "100%",
      maxWidth: 540,
      textAlign: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: 800,
      lineHeight: "104.5%",
      color: "#181818",
    },
    description: {
      fontSize: 16,
      lineHeight: "150%",
      color: "rgba(24, 24, 24, 0.7)",
    },
    icon: {
      width: 160,
      height: "100%",
      marginBottom: 30,
    },
    btn: {
      height: 34,
      backgroundColor: "#431AB7",
      color: "white",
      width: "100%",
      marginTop: 30,
      fontSize: 14,
      fontWeight: 800,
      borderRadius: 4,
    },
    checkBtn: {
      height: 40,
      backgroundColor: "#431AB7",
      color: "white",
      marginTop: 30,
      padding: "11px 32px",
      fontSize: 14,
      fontWeight: 700,
      borderRadius: 4,
    },
    hash: {
      cursor: "pointer",
    },
    result: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  })
);

export default function CreateContract({ onClose, onCompleted }) {
  const classes = useStyles();
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  const handleProceed = async () => {
    console.log("chainId", chainId);

    setIsLoading(true);
    setIsProceeding(true);

    try {

    } catch (err) {
      console.log("error", err);
      setIsProceeding(false);
      setIsLoading(false);
    }
  };

  const handleCheck = () => {
    onClose();
  };

  const handlePolygonScan = () => {
    window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${hash}`, "_blank");
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {isProceeding ? (
          <>
            <LoadingWrapper loading={true} theme="blue" iconWidth="80px" iconHeight="80px"></LoadingWrapper>
            <h1 className={classes.title}>Sending request to Polygon</h1>
            <Box className={classes.result}>
              <p className={classes.description}>
                Transaction is proceeding on Polygon Chain.
                <br />
                This can take a moment, please be patient...
              </p>
              {!isLoading && (
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
                  <button className={classes.checkBtn} onClick={handlePolygonScan}>
                    Check on Polygon Scan
                  </button>
                </>
              )}
            </Box>
          </>
        ) : (
          <>
            <img className={classes.icon} src={require("assets/icons/contract-ploygon-icon.png")} alt="" />
            <h1 className={classes.title}>Withraw real NFT</h1>
            <p className={classes.description}>
              You’ll need to send withdrawal request to Polygon network first then
              <br />
              you will need to unlock you NFT on Ethereum. This process can take a
              <br />
              while so please be patient.
            </p>
            <button className={classes.btn} onClick={handleProceed}>
              Request Withdraw
            </button>
          </>
        )}
      </div>
    </div>
  );
}
