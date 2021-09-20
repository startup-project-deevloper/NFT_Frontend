import React, { useState } from "react";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Box from "shared/ui-kit/Box";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { useLockNFTStyles } from "./index.styles";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import EthBase from "shared/contracts/EthBase.sol/EthBase.json";
import config from "shared/connectors/web3/config";
import { ContractInstance } from "shared/connectors/web3/functions";
import { BlockchainNets } from "shared/constants/constants";

export default function LockNFT({ onClose, onCompleted, needLockLaterBtn = true, selectedNFT }) {
  const classes = useLockNFTStyles();
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const { account, library, chainId } = useWeb3React();

  const handleProceed = async () => {
    setIsLoading(true);
    setIsProceeding(true);

    try {
      const targetChain = BlockchainNets.find(net => net.value === "Ethereum Chain");
      const web3APIHandler = targetChain.apiHandler;
      const web3Config = targetChain.config;

      const web3 = new Web3(library.provider);
      const contractAddress = config.Ethereum.CONTRACT_ADDRESSES.ETH_BASE;
      let response = await web3APIHandler.Erc721.setApprovalForToken(
        web3,
        account!,
        {
          to: contractAddress,
          tokenId: selectedNFT.BlockchainId,
        },
        selectedNFT.TokenContractAddress
      );
      if (!response.success) {
        setIsLoading(false);
        return;
      }
      const contract = ContractInstance(web3, EthBase.abi, contractAddress);
      const gas = await contract.methods
        .depositNFT(selectedNFT.tokenAddress, selectedNFT.BlockchainId)
        .estimateGas({ from: account });
      response = await contract.methods
        .depositNFT(selectedNFT.tokenAddress, selectedNFT.BlockchainId)
        .send({ from: account, gas })
        .on("receipt", receipt => {
          onCompleted();
          setIsLoading(false);
        })
        .on("error", error => {
          console.log("error", error);
          setIsLoading(false);
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
    <div className={classes.root}>
      <div className={classes.container}>
        {isProceeding ? (
          <>
            <LoadingWrapper loading={isLoading} theme="blue" iconWidth="80px" iconHeight="80px" />
            {isLoading ? (
              <>
                <h1 className={classes.title}>Locking in progress</h1>
                <p className={classes.description}>
                  Transaction is proceeding on Polygon Chain. <br />
                  This can take a moment, please be patient...
                </p>
              </>
            ) : (
              <Box className={classes.result}>
                <h1 className={classes.title}>Lock NFT on Ethereum</h1>
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
            <h1 className={classes.title}>Lock NFT on Ethereum</h1>
            <p className={classes.description}>
              Your NFT will be locked in a Vault on Ethereum smart contract. <br />
              Please keep in mind this process can take x time so be patient.
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
