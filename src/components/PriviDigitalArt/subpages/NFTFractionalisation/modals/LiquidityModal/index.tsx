import React, { useState } from "react";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Box from "shared/ui-kit/Box";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { LiquidityModalStyles } from "./index.styles";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { Modal } from "shared/ui-kit";
import TransactionResultModal from "components/PriviDigitalArt/modals/TransactionResultModal";
import { addLiquidity } from "shared/services/API/SyntheticFractionalizeAPI";

const isProd = process.env.REACT_APP_ENV === "prod";
export default function LiquidityModal({ open, onClose, onCompleted, amount, collection, isAdd = false }) {
  const classes = LiquidityModalStyles();
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleProceed = async () => {
    setIsLoading(true);
    setIsProceeding(true);

    const targetChain = BlockchainNets[1];
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
        return;
      }
    }

    try {
      if (isAdd) {
        const web3APIHandler = targetChain.apiHandler;
        const web3 = new Web3(library.provider);

        const contractResponse = await web3APIHandler.JotPool.addLiquidity(web3, account!, collection, {
          amount,
          setHash,
        });

        if (!contractResponse) {
          setIsLoading(false);
          setIsSuccess(false);
          showAlertMessage("Failed to approve. Please try again", { variant: "error" });
          return;
        }

        const totalStake = await web3APIHandler.JotPool.getTotalStake(web3, collection);
        const res = await web3APIHandler.JotPool.getPosition(web3, account!, collection);

        await addLiquidity({
          collectionId: collection.collectionAddress,
          totalLiquidity: res.totalLiquidity,
          totalStaked: totalStake,
        });

        console.log("position response ...", res, totalStake);

        setIsSuccess(true);
        showAlertMessage("You added liquidity successuflly", { variant: "success" });
        setIsLoading(false);
        onCompleted({ ...res, totalStake });
      } else {
        // const gas = await contract.methods.removeLiquidity(Number(amount)).estimateGas({ from: account });
        // console.log("polygon gas", gas);
        // response = await contract.methods
        //   .removeLiquidity(parseInt(amount))
        //   .send({ from: account, gas })
        //   .on("receipt", receipt => {
        //     setIsLoading(false);
        //   })
        //   .on("error", error => {
        //     console.log("error", error);
        //     setIsLoading(false);
        //   });
      }

      // setHash(response.transactionHash);
    } catch (err) {
      console.log("error", err);
      setIsLoading(false);
    }
  };

  const handleLater = () => {
    onClose();
  };

  if (isProceeding && !isLoading) {
    return (
      <TransactionResultModal
        open={true}
        onClose={() => {
          setIsProceeding(false);
          onClose();
        }}
        isSuccess={isSuccess}
        hash={hash}
      />
    );
  }

  const handlePolygonScan = () => {
    window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${hash}`, "_blank");
  };

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.modal}>
      <Box display="flex" flexDirection="column">
        <div className={classes.root}>
          <div className={classes.container}>
            {isProceeding ? (
              <>
                <LoadingWrapper loading={isLoading} theme="blue" iconWidth="80px" iconHeight="80px" />
                <h1 className={classes.title}>{isAdd ? "Adding" : "Removing"} Liquidity</h1>
                <p className={classes.description}>
                  Proceeding on Polygon Chain. <br />
                  This can take a moment, please be patient...
                </p>
                {hash && (
                  <Box display="flex" flexDirection="column" alignItems="center">
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
