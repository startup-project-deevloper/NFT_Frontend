import { Box, Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { BlockchainNets } from "shared/constants/constants";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { formatNumber } from "shared/functions/commonFunctions";
import { switchNetwork } from "shared/functions/metamask";
import { PrimaryButton, Modal } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { useTypedSelector } from "store/reducers/Reducer";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { startAuction } from "shared/services/API/FractionalizeAPI";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

const useBuyoutModalStyles = makeStyles(theme => ({
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
    textAlign: "end",
  },
  smallText: {
    color: "#ABB3C3",
    fontSize: "12px",
  },
}));

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

export default function BuyoutNFTModal({ open, onClose, media, handleRefresh }) {
  const userBalances = useTypedSelector(state => state.userBalances);
  const classes = useBuyoutModalStyles();
  const { convertTokenToUSD } = useTokenConversion();

  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);
  const [equivalent, setEquivalent] = useState<number>(0);
  const [buyoutAmount, setBuyoutAmount] = useState<number>(0);
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    if (!open) return;

    if (selectedChain.chainId !== chainId) {
      (async () => {
        const changed = await switchNetwork(selectedChain.chainId);
        if (!changed) {
          setSelectedChain(filteredBlockchainNets.find(b => b.chainId === chainId));
        }
      })();
    }
  }, [chainId, selectedChain, open]);

  const buyoutToken = React.useMemo(() => {
    return media?.FractionalizeData?.listToken;
  }, [media]);

  const handleBuyout = React.useCallback(async () => {
    if (buyoutAmount < media?.FractionalizeData?.listPrice) {
      showAlertMessage("Buyout Amount is too low", { variant: "error" });
      return;
    }

    if (media?.FractionalizeData?.erc20VaultTokenAddress) {
      const contractAddress = media?.FractionalizeData?.erc20VaultTokenAddress;
      const web3 = new Web3(library.provider);
      const payload = {
        price: buyoutAmount,
        token: buyoutToken,
      };
      const result = await selectedChain.apiHandler.TokenVault.startAuction(
        web3,
        account!,
        payload,
        contractAddress,
        buyoutToken
      );
      if (result?.success) {
        const auctionLength = await selectedChain.apiHandler.TokenVault.auctionLength(
          web3,
          account!,
          contractAddress
        );
        const response = await startAuction({
          mediaSymbol: media?.MediaSymbol,
          buyoutPrice: buyoutAmount,
          starterAddress: account,
          auctionLength: parseInt(auctionLength),
        });
        if (response?.success) {
          showAlertMessage("Auction is live!", { variant: "success" });
          handleRefresh();
          onClose();
          return;
        }
      }
      showAlertMessage(result?.error ?? "Failed to start auction", { variant: "error" });
    }
  }, [media, buyoutAmount, buyoutToken, account]);

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <Grid container spacing={1} style={{paddingTop:"20px"}}>
        <Grid item xs={12} sm={7} style={{ display: "flex", flexDirection: "column" }}>
          <InputWithLabelAndTooltip
            labelName={"Fractions Amount"}
            inputValue={buyoutAmount === undefined ? "" : buyoutAmount.toString()}
            onInputValueChange={e => {
              setBuyoutAmount(Number(e.target.value));
            }}
            placeHolder="0.123456"
            minValue={"0"}
            maxValue={userBalances[buyoutToken] ? userBalances[buyoutToken].Balance.toString() : "0"}
            required
            type="number"
            theme="light"
            endAdornment={
              <div
                className={classes.purpleText}
                onClick={() =>
                  setBuyoutAmount(userBalances[buyoutToken] ? userBalances[buyoutToken].Balance : 0)
                }
              >
                USE MAX
              </div>
            }
          />
          <Box className={classes.smallText} onClick={() => {}}>
            {`=$${convertTokenToUSD(buyoutToken, buyoutAmount || 0)}`}
          </Box>
        </Grid>

        <Grid
          item
          xs={12}
          sm={5}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label>
            Balance:{" "}
            {formatNumber(userBalances[buyoutToken] ? userBalances[buyoutToken].Balance : 0, buyoutToken, 4)}
          </label>
          <div className={classes.fakeSelect}>
            <img src={require(`assets/tokenImages/${buyoutToken}.png`)} alt="" />
            <div>{buyoutToken}</div>
          </div>
          <Box className={classes.purpleText} onClick={() => {}}>
            How does a buyout work?
          </Box>
        </Grid>
      </Grid>

      <Box mt={3} display={"flex"} justifyContent="flex-end">
        <PrimaryButton
          size="medium"
          onClick={handleBuyout}
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
          Start buyout
        </PrimaryButton>
      </Box>
    </Modal>
  );
}
