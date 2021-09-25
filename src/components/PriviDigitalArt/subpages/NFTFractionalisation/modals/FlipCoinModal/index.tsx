import React, { useEffect, useState } from "react";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Box from "shared/ui-kit/Box";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { FlipCoinModalStyles } from "./index.styles";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { Modal } from "shared/ui-kit";
import * as API from "shared/services/API/FractionalizeAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

declare let window: any;

export default function FlipCoinModal({ open, onClose, onCompleted, pred, selectedNFT }) {
  const classes = FlipCoinModalStyles();
  const [isFlipping, setIsFlipping] = useState<boolean>(false); // true - flipping dialog, false - result dialog (finished flipping)
  const [flipResult, setFlipResult] = useState<boolean>(false); // true - won, false - lost
  const [resultState, setResultState] = useState<number>(0); // 0 or 1

  const [hash, setHash] = useState<string>("");
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    if (open) {
      handleProceed();
      setIsFlipping(true);
    }
  }, [open]);

  const handleProceed = async () => {
    const targetChain = BlockchainNets[1];
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
        return;
      }
    }

    try {
      const web3APIHandler = targetChain.apiHandler;
      const web3Config = targetChain.config;
      const web3 = new Web3(library.provider);

      const contractResponse = await web3APIHandler.SyntheticCollectionManager.flipJot(
        web3,
        account!,
        selectedNFT,
        {
          tokenId: +selectedNFT.SyntheticID,
          prediction: pred,
        }
      );

      if (contractResponse === "not allowed") {
        showAlertMessage(`Got failed while flipping the JOT`, { variant: "error" });
        return;
      }

      console.log("response", contractResponse);

      const { requestId, tokenId, prediction, randomResult, transactionHash } = contractResponse;

      await API.addFlipHistory({
        collectionAddress: selectedNFT.collectionAddress,
        syntheticID: selectedNFT.SyntheticID,
        winnerAddress: requestId,
        prediction: prediction,
        result: randomResult,
        tokenId,
      });

      setHash(transactionHash);
    } catch (err) {
      console.log("error", err);
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
            {isFlipping ? (
              <Box className={classes.main}>
                <div className={classes.gifCoin}></div>
                <h1 className={classes.title}>Flipping a Coin</h1>
                <p className={classes.description}>
                  The coin is beeing flipped, it may take a moment to process the results of your flip. Please
                  be patient as it can last up to 30 seconds.
                </p>
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
            ) : (
              <>
                {flipResult ? (
                  <Box className={classes.main}>
                    <img
                      className={classes.imgWon}
                      src={
                        resultState === 0
                          ? require("assets/icons/won_0.png")
                          : require("assets/icons/won_1.png")
                      }
                    />
                    <Box width="100%" height="200px"></Box>
                    <h1 className={classes.title}>You have won!</h1>
                    <p className={classes.description}>
                      Congrats! You have guessed correctly and <br />
                      <span className={classes.result}>you have won 0.1 JOTS</span>
                    </p>
                    <button className={classes.checkBtn} onClick={handleLater} style={{ width: "70%" }}>
                      Claim Reward
                    </button>
                  </Box>
                ) : (
                  <Box className={classes.main}>
                    <img
                      className={classes.imgLost}
                      src={
                        resultState === 0
                          ? require("assets/icons/lost_0.png")
                          : require("assets/icons/lost_1.png")
                      }
                    />
                    <h1 className={`${classes.title} ${classes.grad}`}>You have lost!</h1>
                    <p className={classes.description}>
                      Unfortunatelly! You have guessed incorrectly <br />
                      and the result was {resultState} <br />
                      <span className={`${classes.result} ${classes.grad}`}>
                        you have lost 0.1 JOTS to the owner
                      </span>
                    </p>
                    <Box display="flex" alignItems="center" width="100%">
                      <button className={classes.plainBtn} onClick={handleLater} style={{ flex: 1 }}>
                        Close
                      </button>
                      <Box width="10px" />
                      <button className={classes.checkBtn} onClick={handleLater} style={{ flex: 1 }}>
                        Flip Again
                      </button>
                    </Box>
                  </Box>
                )}
              </>
            )}
          </div>
        </div>
      </Box>
    </Modal>
  );
}
