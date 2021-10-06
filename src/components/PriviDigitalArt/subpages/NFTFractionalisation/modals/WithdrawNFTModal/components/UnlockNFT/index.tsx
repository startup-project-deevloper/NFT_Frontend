import React, { useState } from "react";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Box from "shared/ui-kit/Box";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { useUnlockNFTStyles } from "./index.styles";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import NFTVaultManager from "shared/connectors/ethereum/contracts/NFTVaultManager.json";
import config from "shared/connectors/ethereum/config";
import { ContractInstance } from "shared/connectors/web3/functions";
import { BlockchainNets } from "shared/constants/constants";
import axios from "axios";
import URL from "shared/functions/getURL";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

declare let window: any;
const isProd = process.env.REACT_APP_ENV === "prod";

export default function UnlockNFT({ onClose, onCompleted, needLockLaterBtn = true, nft }) {
  const classes = useUnlockNFTStyles();
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    setIsLoading(true);
    setIsProceeding(true);

    try {
      const web3 = new Web3(library.provider);
      const contractAddress = config.CONTRACT_ADDRESSES.NFT_VAULT_MANAGER;

      const contract = ContractInstance(web3, NFTVaultManager.abi, contractAddress);
      console.log(nft);
      let gas = await contract.methods
        .requestUnlock(nft.collection_id, nft.NftId)
        .estimateGas({ from: account });
      let response = await contract.methods
        .requestUnlock(nft.collection_id, nft.NftId)
        .send({ from: account, gas })
        .on("transactionHash", hash => {
          setHash(hash);
        })
        .on("error", error => {
          console.log("error... ", error);
          showAlertMessage(`Request Unlock is failed, please try again later`, { variant: "error" });
          setIsProceeding(false);
          setIsLoading(false);
        });
      gas = await contract.methods.withdraw(nft.collection_id, nft.NftId).estimateGas({ from: account });
      response = await contract.methods
        .withdraw(nft.collection_id, nft.NftId)
        .send({ from: account, gas })
        .on("transactionHash", hash => {
          setHash(hash);
        })
        .on("error", error => {
          console.log("error... ", error);
          showAlertMessage(`Unlock NFT is failed, please try again later`, { variant: "error" });
          setIsProceeding(false);
          setIsLoading(false);
        });
      onCompleted();
      setIsLoading(false);

      // await axios.post(`${URL()}/syntheticFractionalize/lockNFT`, {
      //   collectionAddress: selectedNFT.tokenAddress,
      //   syntheticID,
      // });
    } catch (err) {
      console.log("error", err);
      setIsProceeding(false);
      setIsLoading(false);
      showAlertMessage(`Unlock NFT is failed, please try again later`, { variant: "error" });
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
        {isProceeding ? (
          <>
            <LoadingWrapper loading={true} theme="blue" iconWidth="80px" iconHeight="80px" />
            <Box className={classes.result}>
              <h1 className={classes.title}>Locking in progress</h1>
              <p className={classes.description}>
                Transaction is proceeding on Ethereum. <br />
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
                  <button className={classes.checkBtn} onClick={handleEtherScan}>
                    Check on Ethereum Scan
                  </button>
                </>
              )}
            </Box>
          </>
        ) : (
          <>
            <img className={classes.icon} src={require("assets/icons/lock-nft-icon.png")} alt="" />
            <h1 className={classes.title}>Unlock NFT on Ethereum</h1>
            <p className={classes.description}>
              Your NFT will be locked in a Vault on Ethereum smart contract. <br />
              Please keep in mind this process can take some time so be patient.
            </p>
            {needLockLaterBtn ? (
              <Box className={classes.buttonWrapper}>
                <button className={classes.laterBtn} onClick={handleLater}>
                  Unlock Later
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