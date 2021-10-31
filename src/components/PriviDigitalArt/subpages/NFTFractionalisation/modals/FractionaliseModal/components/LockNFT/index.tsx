import React, { useState } from "react";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Box from "shared/ui-kit/Box";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { useLockNFTStyles } from "./index.styles";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import config from "shared/connectors/ethereum/config";
import { BlockchainNets } from "shared/constants/constants";
import axios from "axios";
import URL from "shared/functions/getURL";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { lockNFT } from "shared/services/API/web3/contracts/NFTVaultManager";

declare let window: any;
const isProd = process.env.REACT_APP_ENV === "prod";

export default function LockNFT({ onClose, onCompleted, needLockLaterBtn = true, selectedNFT, syntheticID }) {
  const classes = useLockNFTStyles();
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [isLocked, setLocked] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  const handleProceed = async () => {
    console.log("chainId", chainId);
    if (chainId !== 1 && chainId !== 4) {
      let changed = await switchNetwork(isProd ? 1 : 4);
      if (!changed) {
        showAlertMessage(`Got failed while switching over to ethereum network`, { variant: "error" });
        return;
      }
    }
    setIsProceeding(true);

    try {
      const targetChain = BlockchainNets.find(net => net.value === "Ethereum Chain");
      const web3APIHandler = targetChain.apiHandler;

      const web3 = new Web3(library.provider);
      const contractAddress = config.CONTRACT_ADDRESSES.NFT_VAULT_MANAGER;
      let response = await web3APIHandler.Erc721.setApprovalForToken(
        web3,
        account!,
        {
          to: contractAddress,
          tokenId: selectedNFT.BlockchainId,
        },
        selectedNFT.tokenAddress
      );
      if (!response.success) {
        setIsProceeding(false);
        showAlertMessage(`Lock NFT is failed, please try again later`, { variant: "error" });
        return;
      }

      const payload = {
        tokenAddress: selectedNFT.tokenAddress,
        tokenId: selectedNFT.BlockchainId,
        setHash,
      };

      const lockResponse = await lockNFT(web3, account!, payload);
      if (!lockResponse.status) {
        setIsProceeding(false);
        showAlertMessage(`Lock NFT is failed, please try again later`, { variant: "error" });
        return;
      }
      await axios.post(`${URL()}/syntheticFractionalize/lockNFT`, {
        collectionAddress: selectedNFT.tokenAddress,
        syntheticID,
      });
      onCompleted();
      setLocked(true);
      setIsProceeding(false);
    } catch (err) {
      console.log("error", err);
      setIsProceeding(false);
      showAlertMessage(`Lock NFT is failed, please try again later`, { variant: "error" });
    }
  };

  const handleLater = () => {
    onClose();
  };

  const handleEtherScan = () => {
    window.open(`https://${!isProd ? "rinkeby." : ""}etherscan.io/tx/${hash}`, "_blank");
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {isLocked ? (
          <Box className={classes.result}>
            <img className={classes.icon} src={require("assets/icons/lock-success-icon.png")} alt="" />
            <h1 className={classes.title}>Your NFT is locked!</h1>
            <p className={classes.description}>
              Your NFT has been locked successfully. <br />
            </p>
            <button className={classes.checkBtn} onClick={handleLater}>
              Close
            </button>
          </Box>
        ) : isProceeding ? (
          <>
            <LoadingWrapper loading={true} theme="blue" iconWidth="80px" iconHeight="80px" />
            <Box className={classes.result}>
              <h1 className={classes.title}>Locking in progress</h1>
              <p className={classes.description}>
                Transaction is proceeding on Ethereum. <br />
                This can take a moment, please be patient...
              </p>
              {hash && (
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
                  <button className={classes.checkBtn} onClick={handleEtherScan}>
                    Check on Etherscan
                  </button>
                </>
              )}
            </Box>
          </>
        ) : (
          <>
            <img className={classes.icon} src={require("assets/icons/lock-nft-icon.png")} alt="" />
            <h1 className={classes.title}>Lock NFT on Ethereum</h1>
            <p className={classes.description}>
              Your NFT will be locked in a Vault on Ethereum smart contract. <br />
              Please keep in mind this process can take some time so be patient.
            </p>
            {needLockLaterBtn ? (
              <Box className={classes.buttonWrapper}>
                <button className={classes.laterBtn} onClick={handleLater}>
                  Lock Later
                </button>
                <button className={classes.btn} onClick={handleProceed}>
                  Proceed
                </button>
              </Box>
            ) : (
              <button className={classes.proceedBtn} onClick={handleProceed}>
                Proceed
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
