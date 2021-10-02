import React, { useState } from "react";
import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { useWithdrawNFTModelStyles } from "./index.style"
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { BlockchainNets } from "shared/constants/constants";

export default function WithdrawNFTModel({ open, onClose, nft }) {
  const classes = useWithdrawNFTModelStyles();
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const { account, library, chainId } = useWeb3React();

  const handleClose = () => {
    setIsProceeding(false);
    setIsLoading(false);
    onClose();
  }
  const handleProceed = async () => {
    setIsLoading(true);
    setIsProceeding(true);

    const targetChain = BlockchainNets[1];
    const web3 = new Web3(library.provider);
    const web3APIHandler = targetChain.apiHandler;
    await web3APIHandler.SyntheticCollectionManager.exitProtocol(web3, account, nft)
    .then((response) => {
      setIsLoading(false);
      console.log(response)
    })
    .catch(err => {
      console.log("error", err);      
      setIsLoading(false);
    })
  };

  return (
    <Modal size="small" isOpen={open} onClose={handleClose} showCloseIcon className={classes.root}>
      {isProceeding ? (
        <Box>
          {isLoading ? (
            <Box className={classes.container}>
              {/* <LoadingWrapper loading={true} theme="blue" iconWidth="80px" iconHeight="80px" /> */}
              <img className={classes.icon} src={require("assets/icons/exchange_polygon.png")} alt="" />
              <h1 className={classes.title}>Transaction in progress</h1>
              <p className={classes.description}>
                Transaction is proceeding on Polygon Chain.<br />
                This can take a moment, please be patient...
              </p>
              <button className={classes.proceedBtn} onClick={handleClose}>
                Close
              </button>
            </Box>
          ) : (
            <Box className={classes.container}>
              <img className={classes.icon} src={require("assets/icons/lock-nft-icon.png")} alt="" />
              <h1 className={classes.title}>Transaction in progress</h1>
              <p className={classes.description}>
                The confirmation is being sent to the Ethereum Network. This can take around 4-5h. The NFT will be automatically sent to your wallet. Please be patient.
              </p>
              <button className={classes.proceedBtn} onClick={handleClose}>
                Close
              </button>
            </Box>
          )}
        </Box>
      ) : (
        <Box className={classes.container}>
          <img className={classes.icon} src={require("assets/icons/icon_withdraw_nft.png")} alt="" />
          <h1 className={classes.title}>Withdraw real NFT</h1>
          <p className={classes.description}>
            Your NFT ownership reached 10k JOTs. You can Withdraw your NFT while your Synthetic NFT gets burned in the process.
          </p>
          <button className={classes.proceedBtn} onClick={handleProceed}>
            Witrhraw NFT
          </button>
        </Box>
      )}
    </Modal>
  );
}
