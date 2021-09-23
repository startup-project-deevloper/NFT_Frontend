import React from "react";
import Web3 from "web3";
import { Grid } from "@material-ui/core";
import { Header3, Header5, Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { BuyJotsModalStyles } from "./index.style";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { buyJots } from "shared/services/API/SyntheticFractionalizeAPI";

export default function BuyJotsModal({ open, handleClose = () => {}, collectionId, nft }) {
  const classes = BuyJotsModalStyles();

  const { showAlertMessage } = useAlertMessage();

  const [jots, setJOTs] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { account, library, chainId } = useWeb3React();

  const selectedChain = BlockchainNets[1];

  const handleBuyJots = async () => {
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

    const contractResponse = await web3APIHandler.SyntheticCollectionManager.buyJotTokens(
      web3,
      account!,
      nft,
      {
        tokenId: +nft.NftId,
        amount: +jots,
      }
    );
    if (!contractResponse) {
      setLoading(false);
      showAlertMessage("Failed to buy Jots. Please try again", { variant: "error" });
      return;
    }

    await buyJots({
      collectionId,
      nft,
      amount: jots,
      investor: account!,
      hash: contractResponse.data.hash,
    });
  };

  return (
    <LoadingScreen
      loading={loading}
      title={`Transaction \nin progress`}
      subTitle={`Transaction is proceeding on ${selectedChain.value}.\nThis can take a moment, please be patient...`}
      handleClose={handleClose}
    >
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.root}>
        <Box>
          <Header3>Buy JOTs</Header3>
          <InputWithLabelAndTooltip
            inputValue={jots}
            onInputValueChange={e => setJOTs(e.target.value)}
            overriedClasses={classes.inputJOTs}
            required
            type="number"
            theme="light"
            endAdornment={<div className={classes.purpleText}>JOTS</div>}
          />
          <Grid container>
            <Grid item md={8} xs={12}>
              <Box className={classes.leftBalance} display="flex" alignItems="center">
                <Header5 style={{ marginBottom: 0 }}>Wallet Balance</Header5>
                <Box className={classes.usdWrap} display="flex" alignItems="center" ml={2}>
                  <Box className={classes.point}></Box>
                  <Header5 style={{ fontWeight: 800, paddingLeft: "10px", marginBottom: 0 }}>
                    0.00 BUSD
                  </Header5>
                </Box>
              </Box>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box
                className={classes.rightBalance}
                flexGrow={1}
                display="flex"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Box>MAX: 0</Box>
                <Box color="rgba(67, 26, 183, 0.4)" paddingX="15px">
                  Buy Max
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Box display="flex" alignItems="center" mt={6} justifyContent="space-between">
            <SecondaryButton
              size="medium"
              style={{ color: Color.Purple, width: "100px", border: "2px solid #151414" }}
              onClick={handleClose}
            >
              Cancel
            </SecondaryButton>
            <PrimaryButton
              size="medium"
              style={{ background: Color.GreenLight, width: "50%", color: Color.Purple }}
              onClick={handleBuyJots}
            >
              Confirm
            </PrimaryButton>
          </Box>
        </Box>
      </Modal>
    </LoadingScreen>
  );
}
