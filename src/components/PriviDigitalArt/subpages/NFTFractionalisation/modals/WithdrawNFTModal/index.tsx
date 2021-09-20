import React, { useState } from "react";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { useWithdrawNFTModelStyles } from "./index.style"
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import EthBase from "shared/contracts/EthBase.sol/EthBase.json";
import config from "shared/connectors/web3/config";
import { ContractInstance } from "shared/connectors/web3/functions";
import { BlockchainNets } from "shared/constants/constants";

export default function WithdrawNFTModel({ open, onClose = () => { } }) {
  const classes = useWithdrawNFTModelStyles();
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const { account, library, chainId } = useWeb3React();

  const handleProceed = async () => {
    setIsLoading(true);
    setIsProceeding(true);

    try {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } catch (err) {
      console.log("error", err);
      setIsLoading(false);
    }
  };

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      {isProceeding ? (
        <Box>
          {isLoading ? (
            <Box display="flex" flexDirection="column" alignItems="center" p="86px 38px 13px">
              {/* <LoadingWrapper loading={true} theme="blue" iconWidth="80px" iconHeight="80px" /> */}
              <img className={classes.icon} src={require("assets/icons/exchange_polygon.png")} alt="" />
              <h1 className={classes.title}>Transaction in progress</h1>
              <p className={classes.description}>
                Transaction is proceeding on Polygon Chain.<br />
                This can take a moment, please be patient...
              </p>
              <button className={classes.proceedBtn} onClick={onClose}>
                Close
              </button>
            </Box>
          ) : (
            <Box display="flex" flexDirection="column" alignItems="center" p="86px 38px 13px">
              <img className={classes.icon} src={require("assets/icons/lock-nft-icon.png")} alt="" />
              <h1 className={classes.title}>Transaction in progress</h1>
              <p className={classes.description}>
                The confirmation is being sent to the Ethereum Network. This can take around 4-5h. The NFT will be automatically sent to your wallet. Please be patient.
              </p>
              <button className={classes.proceedBtn} onClick={onClose}>
                Close
              </button>
            </Box>
          )}
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" p="86px 38px 13px">
          <img className={classes.icon} src={require("assets/icons/icon_withdraw_nft.png")} alt="" />
          <h1 className={classes.title}>Withraw real NFT</h1>
          <p className={classes.description}>
            Your NFT ownership reached 10k JOTs. You can withraw your NFT while your Synthetic NFT gets burned in the process.
          </p>
          <button className={classes.proceedBtn} onClick={handleProceed}>
            Witrhraw NFT
          </button>
        </Box>
      )}
    </Modal>

    // <div className={classes.root}>
    //   <div className={classes.container}>
    //     {isProceeding ? (
    //       <>
    //         <LoadingWrapper loading={isLoading} theme="blue" iconWidth="80px" iconHeight="80px" />
    //         {isLoading ? (
    //           <>
    //             <h1 className={classes.title}>Transaction in progress</h1>
    //             <p className={classes.description}>
    //               Transaction is proceeding on Polygon Chain. <br />
    //               This can take a moment, please be patient...
    //             </p>
    //           </>
    //         ) : (
    //           <>
    //             <h1 className={classes.title}>Transaction in progress</h1>
    //             <p className={classes.description}>
    //               The confirmation is being sent to the Ethereum Network. This can take around 4-5h. The NFT will be automatically sent to your wallet. Please be patient.
    //             </p>
    //           </>
    //         )}
    //         <button className={classes.checkBtn} onClick={handleLater}>
    //           Close
    //         </button>
    //       </>
    //     ) : (
    //       <>
    //         <img className={classes.icon} src={require("assets/icons/lock-nft-icon.png")} alt="" />
    //         <h1 className={classes.title}>Withraw real NFT</h1>
    //         <p className={classes.description}>
    //           Your NFT ownership reached 10k JOTs. You can withraw your NFT while your Synthetic NFT gets burned in the process.
    //         </p>
    //         <button className={classes.proceedBtn} onClick={handleProceed}>
    //           Witrhraw NFT
    //         </button>
    //       </>
    //     )}
    //   </div>
    // </div>
  );
}
