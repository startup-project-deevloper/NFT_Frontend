import React, { useEffect, useState } from "react";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Box from "shared/ui-kit/Box";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { FlipCoinModalStyles } from "./index.styles";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import config from "shared/connectors/polygon/config";
import { ContractInstance } from "shared/connectors/web3/functions";
import SyntheticCollectionManager from "shared/connectors/polygon/contracts/pix/SyntheticCollectionManager.json";
import { Modal } from "shared/ui-kit";
import * as API from "shared/services/API/FractionalizeAPI";

declare let window: any;

export default function FlipCoinModal({ open, onClose, onCompleted, pred, selectedNFT }) {
  const classes = FlipCoinModalStyles();
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const { account, library, chainId } = useWeb3React();

  const isProduction = process.env.REACT_APP_ENV === "Prod";

  useEffect(() => {
    if (!open) {
      setIsProceeding(false);
    }
  }, [open]);

  const handleProceed = async () => {
    if ((!isProduction && chainId !== 80001) || (isProduction && chainId !== 137)) {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: isProduction ? "0x89" : "0x13881" }],
      });
    }

    setIsLoading(true);
    setIsProceeding(true);

    try {
      const web3 = new Web3(library.provider);
      const contractAddress = config.CONTRACT_ADDRESSES.Pix.JOT_POOL;

      const contract = ContractInstance(web3, SyntheticCollectionManager.abi, contractAddress);

      await API.addFlipHistory("0x06012c8cf97bead5deae237070f9587f8e7a266d", "5", {
        winnerAddress: "requestId",
        prediction: "prediction",
        result: "randomResult",
        tokenId: "tokenId",
      });

      const gas = await contract.methods
        .flipJot(selectedNFT.tokenId, parseInt(pred))
        .estimateGas({ from: account });
      console.log("polygon gas", gas);

      const response = await contract.methods
        .flipJot(selectedNFT.tokenId, parseInt(pred))
        .send({ from: account, gas })
        .on("error", error => {
          console.log("error", error);
          setIsLoading(false);
        });

      console.log(" --- response ---", response);
      const { requestId, tokenId, prediction, randomResult } = response.FlipProcessed;

      await API.addFlipHistory("0x06012c8cf97bead5deae237070f9587f8e7a266d", "5", {
        winnerAddress: "requestId",
        prediction: "prediction",
        result: "randomResult",
        tokenId: "tokenId",
      });

      setHash(response.transactionHash);
    } catch (err) {
      console.log("error", err);
      setIsLoading(false);
    }
  };

  const handleLater = () => {
    onClose();
  };

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.modal}>
      <Box display="flex" flexDirection="column">
        <div className={classes.root}>
          <div className={classes.container}>
            {isProceeding ? (
              <>
                <LoadingWrapper loading={isLoading} theme="blue" iconWidth="80px" iconHeight="80px" />
                {isLoading ? (
                  <>
                    <h1 className={classes.title}>Flip a coin</h1>
                    <p className={classes.description}>
                      Proceeding on Polygon Chain. <br />
                      This can take a moment, please be patient...
                    </p>
                  </>
                ) : (
                  <Box className={classes.result}>
                    <h1 className={classes.title}>Flip a coin</h1>
                    <CopyToClipboard text={hash}>
                      <Box mt="20px" display="flex" alignItems="center" className={classes.hash}>
                        Hash:
                        <Box color="#4218B5" mr={1} ml={1}>
                          {hash.substr(0, 18) + "..." + hash.substr(hash.length - 3, 3)}
                        </Box>
                        <CopyIcon />
                      </Box>
                    </CopyToClipboard>
                    <button className={classes.checkBtn} onClick={handleLater}>
                      Check on Polygon Scan
                    </button>
                  </Box>
                )}
              </>
            ) : (
              <>
                <img className={classes.icon} src={require("assets/icons/lock-nft-icon.png")} alt="" />
                <h1 className={classes.title}>Flip a coin</h1>
                <p className={classes.description}>
                  You will add liquidity to the JOT pool and earn on that liquidity.
                </p>
                <button className={classes.proceedBtn} onClick={handleProceed}>
                  Proceed
                </button>
              </>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
}
