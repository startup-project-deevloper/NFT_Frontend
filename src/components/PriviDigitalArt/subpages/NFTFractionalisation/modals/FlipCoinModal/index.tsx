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
import SyntheticCollectionManager from "shared/connectors/web3/contracts/SyntheticCollectionManager.json";
import { Modal } from "shared/ui-kit";
import * as API from "shared/services/API/FractionalizeAPI";

declare let window: any;

export default function FlipCoinModal({ open, onClose, onCompleted, pred, selectedNFT }) {
  const classes = FlipCoinModalStyles();
  const [isFlipping, setIsFlipping] = useState<boolean>(true) // true - flipping dialog, false - result dialog (finished flipping)
  const [flipResult, setFlipResult] = useState<boolean>(false) // true - won, false - lost
  const [resultState, setResultState] = useState<number>(0) // 0 or 1
  const [isProceeding, setIsProceeding] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hash, setHash] = useState<string>("");
  const { account, library, chainId } = useWeb3React();
  const isProduction = process.env.REACT_APP_ENV === "Prod";
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
            {isFlipping ? (
              <Box className={classes.main}>
                <div className={classes.gifCoin}></div>
                <h1 className={classes.title}>Flipping a Coin</h1>
                <p className={classes.description}>
                  The coin is beeing flipped, it may take a moment to process the results of your flip. Please be patient as it can last up to 30 seconds.
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
                    <img className={classes.imgWon} src={resultState === 0 ? require('assets/icons/won_0.png') : require('assets/icons/won_1.png')} />
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
                    <img className={classes.imgLost} src={resultState === 0 ? require('assets/icons/lost_0.png') : require('assets/icons/lost_1.png')} />
                    <h1 className={`${classes.title} ${classes.grad}`}>You have lost!</h1>
                    <p className={classes.description}>
                      Unfortunatelly! You have guessed incorrectly <br />and the result was {resultState} <br />
                      <span className={`${classes.result} ${classes.grad}`}>you have lost 0.1 JOTS to the owner</span>
                    </p>
                    <Box display="flex" alignItems="center" width="100%">
                      <button className={classes.plainBtn} onClick={handleLater} style={{flex:1}}>
                        Close
                      </button>
                      <Box width="10px" />
                      <button className={classes.checkBtn} onClick={handleLater} style={{flex:1}}>
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
