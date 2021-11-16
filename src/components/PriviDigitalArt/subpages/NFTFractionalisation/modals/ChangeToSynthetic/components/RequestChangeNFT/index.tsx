import React, { useState } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Box from "shared/ui-kit/Box";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import axios from "axios";
import URL from "shared/functions/getURL";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

import { ContractInstance } from "shared/connectors/web3/functions";
import config from "shared/connectors/web3/config";
import SyntheticProtocolRouter from "shared/connectors/web3/contracts/SyntheticProtocolRouter.json";
import { sanitizeIfIpfsUrl } from "shared/helpers/utils";

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

export default function RequestChangeNFT({ onClose, onCompleted, selectedNFT, currentNFT }) {
  const classes = useStyles();
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  const handleProceed = async () => {
    console.log("chainId", chainId);
    if (chainId !== 80001 && chainId !== 137) {
      let changed = await switchNetwork(isProd ? 137 : 80001);
      if (!changed) {
        showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
        return;
      }
    }
    setIsLoading(true);
    setIsProceeding(true);

    try {
      const web3 = new Web3(library.provider);
      const targetChain = BlockchainNets[1];

      const web3APIHandler = targetChain.apiHandler;
      const network = "Polygon";
      const contractAddress = config[network].CONTRACT_ADDRESSES.SYNTHETIC_PROTOCOL_ROUTER;

      const contract = ContractInstance(web3, SyntheticProtocolRouter.abi, contractAddress);
      const tokenURI = selectedNFT.nftTokenUrl || "";

      const gas = await contract.methods
        .changeNFT(currentNFT.collection_id, currentNFT.SyntheticID, selectedNFT.nftTokenId, tokenURI)
        .estimateGas({ from: account });
      const response = await contract.methods
        .changeNFT(currentNFT.collection_id, currentNFT.SyntheticID, selectedNFT.nftTokenId, tokenURI)
        .send({ from: account, gas })
        .on("transactionHash", hash => {
          setHash(hash);
          setIsLoading(false);
        });

      const sellingSupply = await web3APIHandler.SyntheticCollectionManager.getSellingSupply(
        web3,
        currentNFT,
        {
          tokenId: currentNFT.SyntheticID,
        }
      );

      const soldSupply = await web3APIHandler.SyntheticCollectionManager.getSoldSupply(web3, currentNFT, {
        tokenId: currentNFT.SyntheticID,
      });

      if (!response) {
        setIsProceeding(false);
        setIsLoading(false);
      } else {
        setIsLoading(false);
        let params = {
          collectionAddress: selectedNFT.nftCollection.address,
          SyntheticID: currentNFT.SyntheticID,
          NFTId: selectedNFT.nftTokenId,
          NFTName: selectedNFT.nftName,
          NFTImageUrl: sanitizeIfIpfsUrl(selectedNFT.nftPictureUrl),
          isAddCollection: false,
          Price: currentNFT.Price,
          OwnerSupply: currentNFT.OwnerSupply,
          SellingSupply: sellingSupply,
          SoldSupply: soldSupply,
          OwnerAddress: account!,
        };

        const { data } = await axios.post(`${URL()}/syntheticFractionalize/registerNFT`, params);
        if (data.success) {
          onCompleted(data.nft);
        } else {
          showAlertMessage(`Got failed while registering NFT`, { variant: "error" });
        }
      }
    } catch (err) {
      console.log("error", err);
      setIsProceeding(false);
      setIsLoading(false);
    }
  };

  const handlePolygonScan = () => {
    window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${hash}`, "_blank");
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {isProceeding ? (
          <>
            <LoadingWrapper loading={true} theme="blue" iconWidth="80px" iconHeight="80px"></LoadingWrapper>
            <h1 className={classes.title}>Request in progress</h1>
            <Box className={classes.result}>
              <p className={classes.description}>
                Transaction is proceeding on Polygon Chain.
                <br />
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
                  <button className={classes.checkBtn} onClick={handlePolygonScan}>
                    Check on Polygon Scan
                  </button>
                </>
              )}
            </Box>
          </>
        ) : (
          <>
            <img className={classes.icon} src={require("assets/icons/contract-ploygon-icon.png")} alt="" />
            <h1 className={classes.title}>Request changing NFT</h1>
            <p className={classes.description}>
              To change your NFT to Synthetic you’ll need to claim in on Polygin,
              <br />
              then lock it on Ethereum and at the end, Verify the transaction
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
