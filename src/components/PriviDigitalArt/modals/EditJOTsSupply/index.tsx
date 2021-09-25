import React, { useState, useRef } from "react";
import Web3 from "web3";
import { Box, Grid } from "@material-ui/core";
import { PrimaryButton, Modal, SecondaryButton, Color } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { EditJOTsSupplyModalStyles } from "./index.styles";
import { Dropdown } from "shared/ui-kit/Select/Select";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { updateSellingSupply } from "shared/services/API/SyntheticFractionalizeAPI";

export default function EditJOTsModal({ open, onClose, collectionId, nft }) {
  const classes = EditJOTsSupplyModalStyles();

  const [maxSupply, setMaxSupply] = useState<number>(0);
  const [nftSupply, setNFTSupply] = useState<number>(0);
  const [mode, setMode] = useState<boolean>(false);

  const { showAlertMessage } = useAlertMessage();

  const [loading, setLoading] = React.useState<boolean>(false);
  const { account, library, chainId } = useWeb3React();

  const selectedChain = BlockchainNets[1];

  React.useEffect(() => {
    if (!open) return;

    (async () => {
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

      const sellingSupply = await web3APIHandler.SyntheticCollectionManager.getSellingSupply(web3, nft);
      setMaxSupply(+sellingSupply);
    })();
  }, [chainId, open]);

  const handleEditSupply = async () => {
    setLoading(true);
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

    let contractResponse;

    if (!mode) {
      contractResponse = await web3APIHandler.SyntheticCollectionManager.increaseSellingSupply(
        web3,
        account!,
        nft,
        {
          tokenId: +nft.SyntheticID,
          amount: +nftSupply,
        }
      );
    } else {
      contractResponse = await web3APIHandler.SyntheticCollectionManager.decreaseSellingSupply(
        web3,
        account!,
        nft,
        {
          tokenId: +nft.SyntheticID,
          amount: +nftSupply,
        }
      );
    }

    const sellingSupply = await web3APIHandler.SyntheticCollectionManager.getSellingSupply(web3, nft);
    setMaxSupply(sellingSupply);

    if (!contractResponse) {
      setLoading(false);
      showAlertMessage("Failed to update selling supply. Please try again", { variant: "error" });
      return;
    }

    const response = await updateSellingSupply({
      collectionId,
      syntheticId: nft.SyntheticID,
      supply: sellingSupply,
    });

    setLoading(false);

    if (!response.success) {
      showAlertMessage("Failed to update selling supply.", { variant: "error" });
      return;
    }

    showAlertMessage("Successfully updated selling supply.", { variant: "success" });
    onClose();
  };

  return (
    <LoadingScreen
      loading={loading}
      title={`Transaction \nin progress`}
      subTitle={`Transaction is proceeding on ${selectedChain.value}.\nThis can take a moment, please be patient...`}
      handleClose={onClose}
    >
      <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
        <Box display="flex" justifyContent="center" mb={2}>
          <div
            className={classes.switch}
            onClick={() => {
              setMode(!mode);
            }}
          >
            <button
              style={{
                background: mode ? "transparent" : "#431AB7",
                color: mode ? "#431AB7" : "white",
                padding: mode ? "0px 12px" : "0px 16px",
              }}
            >
              Increase Supply
            </button>
            <button
              style={{
                background: !mode ? "transparent" : "#431AB7",
                color: !mode ? "#431AB7" : "white",
                padding: !mode ? "0px 12px" : "0px 16px",
              }}
            >
              Decrease Supply
            </button>
          </div>
        </Box>

        <div className={classes.subtitle}>
          {mode ? "Decrease" : "Increase"} the selling supply for your JOTs
        </div>

        <Grid container spacing={1}>
          <Grid item xs={12} md={7}>
            <InputWithLabelAndTooltip
              inputValue={nftSupply}
              onInputValueChange={e => {
                setNFTSupply(e.target.value);
              }}
              placeHolder="0.0"
              minValue={"0"}
              maxValue={maxSupply}
              required
              type="number"
              theme="light"
              endAdornment={
                <div className={classes.purpleText} onClick={() => setNFTSupply(maxSupply)}>
                  MAX
                </div>
              }
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <div className={classes.select}>
              <InputWithLabelAndTooltip type="text" inputValue={"JOTS"} theme="privi-pix" />
            </div>
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
            onClick={handleEditSupply}
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
    </LoadingScreen>
  );
}
