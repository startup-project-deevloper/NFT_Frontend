import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { Box, Grid } from "@material-ui/core";
import { PrimaryButton, Modal, SecondaryButton, Color } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { QuickSwapModalStyles } from "./index.style";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { BlockchainNets } from "shared/constants/constants";
import { useWeb3React } from "@web3-react/core";
import { toDecimals, toNDecimals } from "shared/functions/web3";

export default function QuickSwapModal({ open, handleClose, nft, collectionId }) {
  const classes = QuickSwapModalStyles();
  const [swapAmount, setSwapAmount] = useState<number>(0);
  const [receive, setReceive] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [maxBalance, setMaxBalance] = useState<any>({balance: 0, decimals: 18});
  const { account, library, chainId } = useWeb3React();

  useEffect(() => {
    if (!open) return;

    if (nft) {
      getJotBalance();
    }
  }, [nft, open]);

  const getJotBalance = async () => {
    (async () => {
      const targetChain = BlockchainNets[1];
      const web3 = new Web3(library.provider);
      const web3APIHandler = targetChain.apiHandler;

      const decimals = await web3APIHandler.Erc20.JOT.decimals(web3, nft.JotAddress, account!);
      const balance = await web3APIHandler.Erc20.JOT.balanceOf(web3, nft.JotAddress, {
        account: account!,
      });

      console.log(decimals, balance)

      if (balance && decimals) {
        setMaxBalance({
          balance: toDecimals(balance, decimals),
          decimals: decimals,
        });
      }
    })();
  };

  const handleSwap = async () => {
    const targetChain = BlockchainNets[1];
    const web3 = new Web3(library.provider);
    const web3APIHandler = targetChain.apiHandler;
    const response = await web3APIHandler.SyntheticCollectionManager.exchangeOwnerJot(web3, account, nft, toNDecimals(swapAmount, maxBalance.decimals))
    console.log(response)
    handleClose()
  }

  return (
    <LoadingScreen
      loading={loading}
      title={`Transaction \nin progress`}
      subTitle={`Transaction is proceeding on Polycon Chain.\nThis can take a moment, please be patient...`}
      handleClose={handleClose}
    >
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.root}>
        <div className={classes.title}>
          Swap on <img src={require("assets/pixImages/swap_icon.png")} alt="swap" />
          <span>Quickswap</span>
        </div>

        <Grid container spacing={1} className={classes.inputContainer}>
          <Grid item xs={12} md={7}>
            <div className={classes.label}>Amout to swap</div>
            <InputWithLabelAndTooltip
              inputValue={swapAmount}
              onInputValueChange={e => {
                setSwapAmount(+e.target.value);
              }}
              placeHolder="0.0"
              minValue={"0"}
              required
              type="number"
              theme="light"
              endAdornment={
                <div className={classes.purpleText} onClick={() => {setSwapAmount(maxBalance.balance)}}>
                  USE MAX
                </div>
              }
            />
          </Grid>
          <Grid item xs={12} md={5} className={classes.unitInput}>
            <div className={classes.label}>Balance: {Number(maxBalance.balance).toFixed(3)} JOTs</div>
            <InputWithLabelAndTooltip type="text" inputValue={"USDT/JOT"} theme="privi-pix" />
          </Grid>
        </Grid>

        <Grid container spacing={1} className={classes.inputContainer}>
          <Grid item xs={12} md={7}>
            <div className={classes.label}>Receive</div>
            <InputWithLabelAndTooltip
              inputValue={receive}
              onInputValueChange={e => {
                setReceive(+e.target.value);
              }}
              placeHolder="0.0"
              minValue={"0"}
              required
              type="number"
              theme="light"
            />
          </Grid>
          <Grid item xs={12} md={5} className={classes.unitInput}>
            <InputWithLabelAndTooltip
              type="text"
              inputValue={"USDC"}
              theme="privi-pix"
              startAdornment={<img src={require("assets/pixImages/usdt_icon.png")} />}
            />
          </Grid>
        </Grid>

        <Box mt={6} display="flex" alignItems="center" justifyContent="space-between">
          <SecondaryButton
            size="medium"
            onClick={handleClose}
            style={{
              fontWeight: 800,
              fontSize: "14px",
              padding: "8px 26px",
              lineHeight: "18px",
              width: "fit-content",
              color: Color.Purple,
              borderColor: Color.Purple,
            }}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            onClick={handleSwap}
            style={{
              borderColor: Color.Purple,
              background: Color.Purple,
              color: "white",
              fontWeight: 800,
              fontSize: "14px",
              padding: "8px 67px",
              lineHeight: "18px",
              width: "fit-content",
            }}
          >
            Confirm Swap
          </PrimaryButton>
        </Box>
      </Modal>
    </LoadingScreen>
  );
}
