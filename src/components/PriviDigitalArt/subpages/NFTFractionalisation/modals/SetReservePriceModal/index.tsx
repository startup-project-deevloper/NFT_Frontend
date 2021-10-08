import React, { useState, useRef, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { Box, Grid, makeStyles } from "@material-ui/core";
import { PrimaryButton, Modal, SecondaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { switchNetwork } from "shared/functions/metamask";
import { BlockchainNets } from "shared/constants/constants";
import {updateReservePrice} from "shared/services/API/FractionalizeAPI";
import {useAlertMessage} from "shared/hooks/useAlertMessage";

const useSetReservePriceModalStyles = makeStyles(theme => ({
  root: {
    width: "508px !important",
    display: "flex",
    flexDirection: "column",
    paddingTop: "44px !important",
    color: "#707582",
    "& label": {
      color: "#1A1B1C",
      fontSize: "14px",
      lineHeight: "120%",
    },

    "& .MuiInput-root": {
      width: "100%",
      margin: "8px 0px",
      background: "#F7F9FE",
      borderRadius: "16px",
      border: "none",
      height: "49px",
      fontFamily: "Agrandir",
      "& *": {
        fontFamily: "Agrandir",
      },
    },

    "& button": {
      width: "fit-content",
    },
  },
  title: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "22px",
    lineHeight: "104.5%",
    color: "#1A1B1C",
    marginBottom: "12px",
  },
  subtitle: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: "normal",
    fontSize: "14px",
    lineHeight: "21px",
    color: "#1A1B1C",
    marginBottom: "24px",
  },
  buttonPurple: {
    alignSelf: "flex-end",
    marginTop: "60px",
    background: "#431AB7",
    borderRadius: "4px",
    color: "white",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "18px",
    textAlign: "center",
    padding: "8px 32px",
  },
  fakeSelect: {
    display: "flex",
    alignItems: "center",
    margin: "8px 0px",
    background: "#F7F9FE",
    borderRadius: "16px",
    border: "none",
    height: "49px",
    fontFamily: "Agrandir",
    padding: "11.5px 18px",
    width: "100%",

    "& img": {
      marginRight: "15px",
      borderRadius: "50%",
      objectFit: "cover",
      width: "24px",
      height: "24px",
    },
  },
  purpleText: {
    cursor: "pointer",
    color: "#431AB7",
    fontSize: "12px",
    minWidth: "55px",
  },
  smallText: {
    color: "#ABB3C3",
    fontSize: "12px",
  },
}));


export default function SetReservePriceModal({ open, onClose, media, handleRefresh }) {
  const classes = useSetReservePriceModalStyles();
  const maxRef = useRef<string>("1000");
  const [reservePrice, setReservePrice] = useState<string>("");
  const [selectedChain, setSelectedChain] = useState<any>(BlockchainNets.find(b => b.chainId == media?.FractionalizeData?.chainId) ?? BlockchainNets[1]);
  const { showAlertMessage } = useAlertMessage();
  const { account, library, chainId } = useWeb3React();

  const [loading, setLoading] = useState<boolean>(false);

  // sync metamask chainId with selected chain
  useEffect(() => {
    if (chainId !== selectedChain.chainId) {
      switchNetwork(selectedChain.chainId).then(changed => {
        if (!changed) showAlertMessage(`Please change your metamask wallet to ${selectedChain.value}`);
      });
    }
  }, [selectedChain.chainId, chainId]);

  const validate = () =>{
    if (!media?.FractionalizeData?.erc20VaultTokenAddress || !media.FractionalizeData.listToken) {
      showAlertMessage("Vault information missing", { variant: "error" });
      return false;
    }
    else if (Number(reservePrice) > Number(maxRef.current)) {
      showAlertMessage("Price cant supass maximum price", { variant: "error" });
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (validate()) {
      setLoading(true);
      const web3 = new Web3(library.provider);
      const payload = {
        price: reservePrice,
        token: media?.FractionalizeData?.listToken,
      }
      const result = await selectedChain.apiHandler.TokenVault.updateReservePrice(web3, account!, payload, media.FractionalizeData.erc20VaultTokenAddress);
      if (result?.success) {
        const reservePriceRes = await selectedChain.apiHandler.TokenVault.getReservePrice(web3, account!, media.FractionalizeData.erc20VaultTokenAddress);
        if (reservePriceRes?.success) {
          const response = await updateReservePrice({
            price: reservePriceRes.data,
            mediaSymbol: media?.MediaSymbol,
          });
          if (response?.success) {
            showAlertMessage("Updated reserved price!", { variant: "success" });
            handleRefresh();
            onClose();
          }
        }
      }
      else showAlertMessage(result?.error ?? "Failed to update reserved price", { variant: "error" });
      setLoading(false);
    }
  }

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <LoadingScreen
        loading={loading}
        title={`Transaction \nin progress`}
        subTitle={`Transaction is proceeding on ${selectedChain.value}.\nThis can take a moment, please be patient...`}
        handleClose={() => setLoading(false)}
      >
        <div className={classes.title}>Set Reserve Price</div>
        <div className={classes.subtitle}>
          A reserve price is the minimum price you’d be willing to sell your fractions for, in the case of a
          buyout.
        </div>

        <Grid container spacing={1}>
          <Grid item xs={12} sm={5}>
            <div className={classes.fakeSelect}>
              <Box display="flex" alignItems="center" fontFamily="Agrandir">
                  <img src={media?.FractionalizeData?.listToken? require(`assets/tokenImages/${media.FractionalizeData.listToken}.png`):"none"}
                    alt={media.FractionalizeData.listToken}
                  />
                  {media.FractionalizeData.listToken}
                </Box>
            </div>
          </Grid>

          <Grid item xs={12} sm={7}>
            <InputWithLabelAndTooltip
              inputValue={reservePrice}
              onInputValueChange={e => {
                setReservePrice(e.target.value);
              }}
              placeHolder="0.0"
              minValue={"0"}
              maxValue={maxRef.current}
              required
              type="number"
              theme="light"
              endAdornment={
                <div
                  className={classes.purpleText}
                  onClick={() => setReservePrice(maxRef.current)}
                >
                  USE MAX
                </div>
              }
            />
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
            onClick={handleSubmit}
            style={{
              borderColor: "#431AB7",
              background: "#431AB7",
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
      </LoadingScreen>
    </Modal>
  );
}
