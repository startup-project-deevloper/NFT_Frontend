import React, { useState } from "react";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Box from "shared/ui-kit/Box";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { LiquidityModalStyles } from "./index.styles";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import config from "shared/connectors/polygon/config";
import { ContractInstance } from "shared/connectors/web3/functions";
import JOTPoolRouter from "shared/connectors/web3/contracts/JotPool.json";
import { Modal } from "shared/ui-kit";

declare let window: any;

export default function LiquidityModal({ open, onClose, onCompleted, amount, isAdd = false }) {
  const classes = LiquidityModalStyles();
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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

      const contract = ContractInstance(web3, JOTPoolRouter.abi, contractAddress);

      let response: any;

      if (isAdd) {
        const gas = await contract.methods.addLiquidity(Number(amount)).estimateGas({ from: account });
        console.log("polygon gas", gas);

        response = await contract.methods
          .addLiquidity(parseInt(amount))
          .send({ from: account, gas })
          .on("receipt", receipt => {
            setIsLoading(false);
          })
          .on("error", error => {
            console.log("error", error);
            setIsLoading(false);
          });
      } else {
        const gas = await contract.methods.removeLiquidity(Number(amount)).estimateGas({ from: account });
        console.log("polygon gas", gas);

        response = await contract.methods
          .removeLiquidity(parseInt(amount))
          .send({ from: account, gas })
          .on("receipt", receipt => {
            setIsLoading(false);
          })
          .on("error", error => {
            console.log("error", error);
            setIsLoading(false);
          });
      }

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
                    <h1 className={classes.title}>{isAdd ? "Adding" : "Removing"} Liquidity</h1>
                    <p className={classes.description}>
                      Proceeding on Polygon Chain. <br />
                      This can take a moment, please be patient...
                    </p>
                  </>
                ) : (
                  <Box className={classes.result}>
                    <h1 className={classes.title}>{isAdd ? "Adding" : "Removing"} Liquidity</h1>
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
                <h1 className={classes.title}>{isAdd ? "Adding" : "Removing"} Liquidity</h1>
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
