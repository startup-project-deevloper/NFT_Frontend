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

export default function BuyJotsModal({ open, handleClose = () => {} }) {
  const classes = BuyJotsModalStyles();

  const { showAlertMessage } = useAlertMessage();

  const [jots, setJOTs] = React.useState<number>(0);
  const { account, library, chainId } = useWeb3React();

  const handleBuyJots = async () => {
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

    await web3APIHandler.SyntheticCollectionManager.buyJotTokens(web3, account!, {
      tokenId: 5, // TODO: TEST ONLY
      amount: jots,
    });
  };

  return (
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
                <Header5 style={{ fontWeight: 800, paddingLeft: "10px", marginBottom: 0 }}>0.00 BUSD</Header5>
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
  );
}
