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

export default function EditJOTsModal({ open, onClose, collectionId, nftId, syntheticId }) {
  const classes = EditJOTsSupplyModalStyles();
  const maxRef = useRef<string>("1000");
  const [nftSupply, setNFTSupply] = useState<string>("");

  const { showAlertMessage } = useAlertMessage();

  const [loading, setLoading] = React.useState<boolean>(false);
  const { account, library, chainId } = useWeb3React();

  const selectedChain = BlockchainNets[1];

  const handleEditPrice = async () => {
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

    const contractResponse = await web3APIHandler.SyntheticCollectionManager.increaseSellingSupply(
      web3,
      account!,
      {
        tokenId: +nftId,
        amount: +nftSupply,
      }
    );
    if (!contractResponse) {
      setLoading(false);
      showAlertMessage("Failed to buy Jots. Please try again", { variant: "error" });
      return;
    }

    await updateSellingSupply({
      collectionId,
      syntheticId,
      amount: +nftSupply,
      investor: account!,
      hash: contractResponse.data.hash,
    });
  };

  return (
    <LoadingScreen
      loading={loading}
      title={`Transaction \nin progress`}
      subTitle={`Transaction is proceeding on ${selectedChain.value}.\nThis can take a moment, please be patient...`}
      handleClose={onClose}
    >
      <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
        <div className={classes.title}>Edit JOTs Supply</div>
        <div className={classes.subtitle}>Set a new supply of JOTs for your NFT</div>

        <Grid container spacing={1}>
          <Grid item xs={12} md={7}>
            <InputWithLabelAndTooltip
              inputValue={nftSupply}
              onInputValueChange={e => {
                setNFTSupply(e.target.value);
              }}
              placeHolder="0.0"
              minValue={"0"}
              maxValue={maxRef.current}
              required
              type="number"
              theme="light"
              endAdornment={
                <div className={classes.purpleText} onClick={() => setNFTSupply(maxRef.current)}>
                  MAX
                </div>
              }
            />
          </Grid>
          <Grid item xs={12} md={5}>
            <div className={classes.select}>
              <Dropdown value={"jots"} menuList={[{ name: "JOTS", value: "jots" }]} onChange={() => {}} />
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
    </LoadingScreen>
  );
}
