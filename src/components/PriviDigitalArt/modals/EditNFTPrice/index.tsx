import React, { useState } from "react";
import Web3 from "web3";
import { Box, Grid } from "@material-ui/core";
import { PrimaryButton, Modal, SecondaryButton, Color } from "shared/ui-kit";
import { Dropdown } from "shared/ui-kit/Select/Select";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { EditNFTPriceModalStyles } from "./index.styles";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { updatePriceFraction } from "shared/services/API/SyntheticFractionalizeAPI";
import { toNDecimals } from "shared/functions/web3";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import CopyToClipboard from "react-copy-to-clipboard";
import { CopyIcon } from "shared/ui-kit/Modal/Modals/TransactionProgressModal";

const isProd = process.env.REACT_APP_ENV === "prod";
const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

export default function EditNFTPriceModal({ open, onClose, collectionId, nft }) {
  const classes = EditNFTPriceModalStyles();

  const { showAlertMessage } = useAlertMessage();

  const [nftPrice, setNFTPrice] = useState<string>("");

  const [loading, setLoading] = React.useState<boolean>(false);
  const [openLoading, setOpenLoading] = React.useState(false);
  const { account, library, chainId } = useWeb3React();
  const [hash, setHash] = React.useState<string>("");

  const [selectedChain, setSelectedChain] = React.useState<any>(filteredBlockchainNets[0]);

  React.useEffect(() => {
    if (!open) return;

    if (selectedChain && chainId && selectedChain.chainId !== chainId) {
      (async () => {
        const changed = await switchNetwork(selectedChain.chainId);
        if (!changed) {
          setSelectedChain(filteredBlockchainNets.find(b => b.chainId === chainId));
        }
      })();
    }
  }, [chainId, selectedChain, open]);

  const handleEditPrice = async () => {
    setLoading(true);
    setOpenLoading(true);

    // For polygon chain
    const targetChain = BlockchainNets[1];
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
        return;
      }
    }
    const web3APIHandler = targetChain.apiHandler;
    const web3Config = targetChain.config;
    const web3 = new Web3(library.provider);

    const decimals = await web3APIHandler.Erc20["USDT"].decimals(web3);
    const price = toNDecimals(+nftPrice, decimals);

    const contractResponse = await web3APIHandler.SyntheticCollectionManager.updatePriceFraction(
      web3,
      account!,
      nft,
      {
        tokenId: +nft.SyntheticID,
        price: price,
        setHash,
      }
    );
    if (!contractResponse.success) {
      setLoading(false);
      setOpenLoading(false);
      showAlertMessage("Failed to update price fraction. Please try again", { variant: "error" });
      return;
    }

    const response = await updatePriceFraction({
      collectionId,
      syntheticId: nft.SyntheticID,
      price: price,
    });

    setLoading(false);
    if (!response.success) {
      showAlertMessage("Failed to update price fraction", { variant: "error" });
    }

    showAlertMessage("Successfully updated price fraction", { variant: "success" });
    onClose();
  };

  const handlePolygonScan = () => {
    window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${hash}`, "_blank");
  };

  if (openLoading) {
    return (
      <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
        <Box style={{ textAlign: "center", paddingTop: "50px", paddingBottom: "50px" }}>
          {loading && (
            <LoadingWrapper loading theme="purple" iconWidth="80px" iconHeight="80px"></LoadingWrapper>
          )}
          <Box>
            <h3
              style={{
                fontSize: "27px",
                marginTop: "10px",
                whiteSpace: "pre-wrap",
                fontWeight: "bold",
                color: "#431AB7",
              }}
            >
              {"Transaction \nin progress".toUpperCase()}
            </h3>
            <p style={{ fontSize: "18px", marginTop: "20px", whiteSpace: "pre-wrap" }}>
              <p>
                {`Transaction is proceeding on ${selectedChain.value}.\nThis can take a moment, please be patient...`}
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
            </p>
          </Box>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <div className={classes.title}>Edit NFT Price</div>
      <div className={classes.subtitle}>Set a new price for your NFT</div>

      <Grid container spacing={1}>
        <Grid item xs={12} md={7}>
          <InputWithLabelAndTooltip
            inputValue={nftPrice}
            onInputValueChange={e => {
              setNFTPrice(e.target.value);
            }}
            placeHolder="0.0"
            minValue={"0"}
            required
            type="number"
            theme="light"
          />
        </Grid>
        <Grid item xs={12} md={5}>
          <InputWithLabelAndTooltip type="text" inputValue={"USDT/JOT"} theme="privi-pix" />
        </Grid>
      </Grid>

      <Box mt={6} display="flex" alignItems="center" justifyContent="space-between">
        <SecondaryButton
          size="medium"
          onClick={onClose}
          style={{
            fontWeight: 800,
            fontSize: "14px",
            padding: "8px 26px",
            lineHeight: "18px",
            width: "fit-content",
          }}
        >
          Cancel
        </SecondaryButton>
        <PrimaryButton
          size="medium"
          onClick={handleEditPrice}
          style={{
            borderColor: Color.Purple,
            background: Color.Purple,
            color: "white",
            fontWeight: 800,
            fontSize: "14px",
            padding: "8px 26px",
            lineHeight: "18px",
            width: "fit-content",
          }}
        >
          Submit
        </PrimaryButton>
      </Box>
    </Modal>
  );
}
