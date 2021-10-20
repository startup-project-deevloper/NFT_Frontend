import React, { useEffect, useState, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useTypedSelector } from "store/reducers/Reducer";
import { formatNumber } from "shared/functions/commonFunctions";
import { Modal } from "shared/ui-kit";
import { buyFraction, sellFraction } from "shared/services/API";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#EAE8FA !important",
  },
  modalContent: {
    padding: "10px 20px",
    width: "100%",
  },
  title: {
    fontWeight: 800,
    fontSize: 22,
    color: "#181818",
    marginBottom: 8,
  },
  swapBtnSection: {
    display: "flex",
    alignItems: "center",
    marginTop: "8px",
    marginBottom: "8px",
  },
  swapButton: {
    width: "100%",
    fontSize: 16,
    margin: "16px 0px",
    height: 50,
    "& img": {
      width: 14,
      height: 14,
      marginLeft: 4,
    },
  },
  squareContainer: {
    padding: "20px 0",
    display: "flex",
    alignItems: "flex-start",
  },
  squareContainerLabel: {
    fontSize: 18,
    color: "#181818",
  },
  squareContainerInput: {
    padding: "6px 18px",
    border: "1px solid #ABB3C4",
    borderRadius: "6px",
    display: "flex",
    marginTop: "8px",
    alignItems: "center",
    "& img": {
      width: "25px",
      height: "25px",
    },
  },
  imageInput: {
    paddingLeft: 25,
  },
  balance: {
    marginTop: 8,
    fontSize: 14,
    color: "#707582",
  },
  error: {
    color: "red",
  },
  submit: {
    display: "flex",
    marginTop: 24,
    "& button": {
      width: "100%",
      padding: "9px 45px",
      fontSize: 16,
      height: 50,
    },
  },
  valueBox: {
    padding: "16px 0px",
    borderTop: "2px solid #18181822",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonSwap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: "50%",
    background: "#181818",
    border: "1.5px solid #181818",
    boxSizing: "border-box",
    margin: "5px 16px 0px",
    height: "56px",
    minWidth: "56px",
    width: "56px",
    padding: "15px 0px",

    "& img": {
      height: "10px",
      "&:first-child": {
        transform: "rotate(90deg)",
      },
      "&:last-child": {
        transform: "rotate(-90deg)",
      },
    },
  },
}));

const StablecoinRow = ({ offer, userBalances, amount, setAmount }) => {
  const classes = useStyles();
  return (
    <Box className={classes.squareContainer}>
      <Box width={1} mr={1}>
        <Box className={classes.squareContainerLabel}>Stablecoin</Box>
        <Box className={classes.squareContainerInput}>
          <img src={offer.Token ? require(`assets/tokenImages/${offer.Token}.png`) : "none"} alt="ETH" />
          <InputWithLabelAndTooltip
            type="text"
            overriedClasses={classes.imageInput}
            inputValue={offer.Token}
            disabled
          />
        </Box>
        <Box className={classes.balance}>
          {`Available ${formatNumber(
            userBalances[offer.Token] ? userBalances[offer.Token].Balance : 0,
            offer.Token,
            4
          )}`}
        </Box>
      </Box>
      <Box width={1} ml={1}>
        <Box className={classes.squareContainerLabel}>Amount</Box>
        <InputWithLabelAndTooltip
          overriedClasses=""
          type="number"
          inputValue={amount}
          placeHolder={"0"}
          onInputValueChange={v => {
            setAmount(Math.min(Number(v.target.value), offer.Amount * (offer.Price * 100)).toString());
          }}
        />
      </Box>
    </Box>
  );
};

const MediaRow = ({ offer, userBalances, amount, setAmount }) => {
  const classes = useStyles();
  return (
    <Box className={classes.squareContainer}>
      <Box width={1} mr={1}>
        <Box className={classes.squareContainerLabel}>Media Token</Box>
        <Box className={classes.squareContainerInput}>
          <img src={require("assets/icons/ETHToken.svg")} alt="BALToken" />
          <InputWithLabelAndTooltip
            type="text"
            overriedClasses={classes.imageInput}
            inputValue={offer.TokenSymbol}
            disabled
          />
        </Box>
        <Box className={classes.balance}>
          {`Available ${formatNumber(
            userBalances[offer.TokenSymbol] ? userBalances[offer.TokenSymbol].Balance : 0,
            offer.TokenSymbol,
            4
          )}`}
        </Box>
      </Box>
      <Box width={1} ml={1}>
        <Box className={classes.squareContainerLabel}>Amount</Box>
        <InputWithLabelAndTooltip
          overriedClasses=""
          type="number"
          inputValue={amount}
          placeHolder={"0"}
          onInputValueChange={v => {
            setAmount(Math.min(Number(v.target.value), offer.Amount).toString());
          }}
        />
      </Box>
    </Box>
  );
};

export default function TradePodTokenModal({ open, offerType, offer, media, handleClose, handleRefresh }) {
  const classes = useStyles();
  const { showAlertMessage } = useAlertMessage();
  const { convertTokenToUSD } = useTokenConversion();
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);

  const [loading, setLoading] = useState<boolean>(false);

  const [fundingTokenAmount, setFundingTokenAmount] = useState<string>("");
  const [mediaAmount, setMediaAmount] = useState<string>("");

  const [fee, setFee] = useState<number>(0);

  const payloadRef = useRef<any>({});

  useEffect(() => {
    setFundingTokenAmount((Number(mediaAmount) * (offer.Price * 100)).toString());
  }, [mediaAmount]);

  useEffect(() => {
    setMediaAmount((Number(fundingTokenAmount) / (offer.Price * 100)).toString());
  }, [fundingTokenAmount]);

  const closeAndRefresh = () => {
    setTimeout(() => {
      handleClose();
      handleRefresh();
    }, 1000);
  };

  const handleBuyOrSell = async () => {
    if (true) {
      try {
        if (offerType === "buy") {
          setLoading(true);
          const payload = {
            TokenSymbol: offer.TokenSymbol,
            SAddress: offer.SAddress,
            OrderId: offer.OrderId,
            Amount: Number(mediaAmount),
            BuyerAddress: user.address,
          };
          const buyResponse = await buyFraction(user.address, payload, { MediaType: media.Type });
          setLoading(false);
          if (buyResponse.success) {
            showAlertMessage(`buy success`, { variant: "success" });
            closeAndRefresh();
          } else {
            showAlertMessage(`buy failed`, { variant: "error" });
          }
        } else if (offerType == "sell") {
          setLoading(true);
          const payload = {
            TokenSymbol: offer.TokenSymbol,
            BAddress: offer.BAddress,
            OrderId: offer.OrderId,
            Amount: Number(mediaAmount),
            SellerAddress: user.address,
          };
          const buyResponse = await sellFraction(user.address, payload, { MediaType: media.Type });
          setLoading(false);
          if (buyResponse.success) {
            showAlertMessage(`sell success`, { variant: "success" });
            closeAndRefresh();
          } else {
            showAlertMessage(`sell failed`, { variant: "error" });
          }
        }
      } catch (e) {
        setLoading(false);
      }
    }
  };

  return (
    <LoadingScreen
      loading={loading}
      title={`Transaction \nin progress`}
      subTitle={`Transaction is proceeding on ${
        media.BlockchainNetwork || media.blockchain || "Polygon"
      }.\nThis can take a moment, please be patient...`}
      handleClose={() => {}}
    >
      <Modal size="medium" isOpen={open} onClose={handleClose} className={classes.root} showCloseIcon>
        <Box className={classes.modalContent}>
          <Box className={classes.title}>
            {offerType.charAt(0).toUpperCase() + offerType.slice(1)} Media Token
          </Box>
          {offerType === "buy" ? (
            <StablecoinRow
              offer={offer}
              userBalances={userBalances}
              amount={fundingTokenAmount}
              setAmount={setFundingTokenAmount}
            />
          ) : (
            <MediaRow
              offer={offer}
              userBalances={userBalances}
              amount={mediaAmount}
              setAmount={setMediaAmount}
            />
          )}
          {offerType === "buy" ? (
            <MediaRow
              offer={offer}
              userBalances={userBalances}
              amount={mediaAmount}
              setAmount={setMediaAmount}
            />
          ) : (
            <StablecoinRow
              offer={offer}
              userBalances={userBalances}
              amount={fundingTokenAmount}
              setAmount={setFundingTokenAmount}
            />
          )}
          <Box className={classes.valueBox}>
            <Box className={classes.squareContainerLabel}>Estimated fee</Box>
            <Box textAlign="end">
              <Box className={classes.squareContainerLabel}>{`0 USDT`}</Box>
              <Box className={classes.balance}>({formatNumber(0, "USDT", 4)})</Box>
            </Box>
          </Box>
          <Box className={classes.valueBox} style={{ borderBottom: "2px solid #18181822" }}>
            <Box className={classes.squareContainerLabel}>Total</Box>
            <Box textAlign="end">
              <Box className={classes.squareContainerLabel}>{`${offer.Token} ${
                fee + Number(fundingTokenAmount)
              }`}</Box>
              <Box className={classes.balance}>
                ({formatNumber(convertTokenToUSD(offer.Token, fee + Number(fundingTokenAmount)), "USD", 4)})
              </Box>
            </Box>
          </Box>

          <Box className={classes.submit}>
            <button onClick={handleBuyOrSell} style={{ background: "#431AB7" }}>
              {offerType == "buy" ? "Buy To Invest" : "Sell Position"}
            </button>
          </Box>
        </Box>
      </Modal>
    </LoadingScreen>
  );
}
