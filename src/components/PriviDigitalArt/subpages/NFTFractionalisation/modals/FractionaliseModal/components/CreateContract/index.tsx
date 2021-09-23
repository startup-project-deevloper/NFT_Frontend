import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Box from "shared/ui-kit/Box";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { PriceFeed_URL, PriceFeed_Token } from "shared/functions/getURL";
import axios from "axios";
import URL from "shared/functions/getURL";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import config from "shared/connectors/polygon/config";
import { ContractInstance } from "shared/connectors/web3/functions";
import { BlockchainNets } from "shared/constants/constants";
import SyntheticProtocolRouter from "shared/connectors/polygon/contracts/pix/SyntheticProtocolRouter.json";
import { useTypedSelector } from "store/reducers/Reducer";

declare let window: any;
const isProd = process.env.REACT_APP_ENV === "prod";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      padding: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      width: "100%",
      maxWidth: 540,
      textAlign: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: 800,
      lineHeight: "104.5%",
      color: "#181818",
    },
    description: {
      fontSize: 16,
      lineHeight: "150%",
      color: "rgba(24, 24, 24, 0.7)",
    },
    icon: {
      width: 160,
      height: "100%",
      marginBottom: 30,
    },
    btn: {
      height: 34,
      backgroundColor: "#431AB7",
      color: "white",
      width: "100%",
      marginTop: 30,
      fontSize: 14,
      fontWeight: 800,
      borderRadius: 4,
    },
    checkBtn: {
      height: 40,
      backgroundColor: "#431AB7",
      color: "white",
      marginTop: 30,
      padding: "11px 32px",
      fontSize: 14,
      fontWeight: 700,
      borderRadius: 4,
    },
    hash: {
      cursor: "pointer",
    },
    result: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  })
);

export default function CreateContract({ onClose, onCompleted, selectedNFT, supplyToKeep, priceFraction }) {
  const classes = useStyles();
  const user = useTypedSelector(state => state.user);
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const { account, library, chainId } = useWeb3React();

  const handleProceed = async () => {
    console.log("chainId", chainId);
    if (chainId !== 80001 && chainId !== 137) {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: isProd ? "0x89" : "0x13881" }],
        });
      } catch (err) {
        console.log("err", err);
        return;
      }
    }
    setIsLoading(true);
    setIsProceeding(true);

    try {
      const { data: collectionInfo } = await axios.get(
        `${PriceFeed_URL()}/nft/collection-address?contract=${selectedNFT.tokenAddress}${
          !isProd ? "&network=rinkeby" : ""
        }`,
        {
          headers: {
            Authorization: `Basic ${PriceFeed_Token()}`,
          },
        }
      );

      const web3 = new Web3(library.provider);
      const contractAddress = config.CONTRACT_ADDRESSES.Pix.SYNTHETIC_PROTOCOL_ROUTER;

      const contract = ContractInstance(web3, SyntheticProtocolRouter.abi, contractAddress);
      const gas = await contract.methods
        .registerNFT(
          selectedNFT.tokenAddress,
          selectedNFT.BlockchainId,
          supplyToKeep,
          priceFraction,
          collectionInfo.data.name,
          collectionInfo.data.symbol
        )
        .estimateGas({ from: account });
      const response = await contract.methods
        .registerNFT(
          selectedNFT.tokenAddress,
          selectedNFT.BlockchainId,
          supplyToKeep,
          priceFraction,
          collectionInfo.data.name,
          collectionInfo.data.symbol
        )
        .send({ from: account, gas })
        .on("receipt", receipt => {
          setIsLoading(false);
        })
        .on("error", error => {
          console.log("error", error);
          setIsLoading(false);
        });
      setHash(response.transactionHash);
      const collection = response.events?.CollectionManagerRegistered?.returnValues;
      const nftInfo = response.events?.TokenRegistered?.returnValues;

      let params = {};
      if (collection) {
        params = {
          collectionAddress: selectedNFT.tokenAddress,
          SyntheticID: nftInfo.syntheticTokenId,
          NftId: selectedNFT.BlockchainId,
          JotName: `Privi Jot ${selectedNFT.MediaName}`,
          JotSymbol: `JOT_${selectedNFT.MediaSymbol}`,
          JotAddress: collection.jotAddress,
          JotPoolAddress: collection.jotStakingAddress,
          SyntheticCollectionManagerAddress: collection.collectionManagerAddress,
          SyntheticNFTAddress: collection.syntheticNFTAddress,
          collectionName: collectionInfo.data.name,
          collectionSymbol: collectionInfo.data.symbol,
          description: collectionInfo.data.description,
          imageUrl: collectionInfo.data.imageUrl,
          quickSwapAddress: collection.quickSwapAddress,
          collectionManagerID: collection.collectionManagerID,
          isAddCollection: true,
          userId: user.id,
        };
      } else {
        params = {
          collectionAddress: selectedNFT.tokenAddress,
          SyntheticID: nftInfo.syntheticTokenId,
          NftId: selectedNFT.BlockchainId,
          isAddCollection: false,
          userId: user.id,
        };
      }
      await axios.post(`${URL()}/syntheticFractionalize/registerNFT`, params);
      onCompleted(nftInfo.syntheticTokenId);
    } catch (err) {
      console.log("error", err);
      setIsLoading(false);
    }
  };

  const handleCheck = () => {
    onClose();
  };

  const handlePolygonScan = () => {
    window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${hash}`, "_blank");
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {isProceeding ? (
          <>
            <LoadingWrapper
              loading={isLoading}
              theme="blue"
              iconWidth="80px"
              iconHeight="80px"
            ></LoadingWrapper>
            <h1 className={classes.title}>Create contract on Polygon</h1>
            {isLoading ? (
              <p className={classes.description}>
                Transaction is proceeding on Polygon Chain.
                <br />
                This can take a moment, please be patient...
              </p>
            ) : (
              <Box className={classes.result}>
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
            <img className={classes.icon} src={require("assets/icons/contract-ploygon-icon.png")} alt="" />
            <h1 className={classes.title}>Create contract on Polygon</h1>
            <p className={classes.description}>
              The synthetic fractionalisation of your NFT requires 2 steps.
              <br />
              First, contract for your NFT will be created on Polygon.
              <br />
              Second, your NFT will be locked in a Vault on Ethereum smart contract.
            </p>
            <button className={classes.btn} onClick={handleProceed}>
              Proceed
            </button>
          </>
        )}
      </div>
    </div>
  );
}
