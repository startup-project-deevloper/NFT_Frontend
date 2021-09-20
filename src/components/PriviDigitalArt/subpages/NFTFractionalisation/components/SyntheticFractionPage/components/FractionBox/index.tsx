import { Box, Grid, makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { getCryptosRateAsList } from "shared/services/API";
import { Color } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { formatNumber } from "shared/functions/commonFunctions";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { BuyFractionModal } from "components/PriviDigitalArt/subpages/NFTFractionalisation/modals/FractionalisationModals";

const useFractionBoxStyles = makeStyles(theme => ({
  exchangeBox: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    background: "#FFFFFF",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: "16px",
    width: "100%",
    fontFamily: "Agrandir",
    padding: "32px",

    "& > div": {
      width: "100%",
    },

    "& label": {
      color: "#1A1B1C",
      fontSize: "14px",
      lineHeight: "120%",
    },

    "& .MuiInput-root": {
      margin: "8px 0px 0px",
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
  button: {
    background: "#DDFF57",
    borderRadius: "4px",
    color: "#431AB7",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "18px",
    textAlign: "center",
    padding: "8px 32px",
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
  uniswapBox: {
    display: "flex",
    alignItems: "center",
    background: "#EFF2FD",
    borderRadius: "77px",
    marginBottom: "38px",
    color: "#431AB7",
    padding: "8px 48px",
    fontWeight: "normal",
    fontSize: "14px",
    lineHeight: "114.5%",
    width: "fit-content !important",

    "& img": {
      marginRight: "10px",
      width: "40px",
      height: "40px",
    },
  },
  offersTitle: {
    color: "#431AB7",
    fontSize: "18px",
    fontWeight: 800,
    maxWidth: 230,
  },
  offersTableContainer: {
    width: "100%",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: "16px",
    "& .MuiTableCell-head": {
      backgroundColor: "white",
      color: "#181818 !important",
      fontSize: "14px",
      lineHeight: "120%",
    },

    "& .MuiTableCell-body": {
      color: "#707582",
      borderBottom: "1px solid #17171718",
      fontSize: "14px",
      lineHeight: "120%",
    },
  },
  uniswapText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "18px",
    lineHeight: "130%",
    textAlign: "center",
    color: "#431AB7",
    "& *": {
      textAlign: "center",
    },
  },
  clickablePurple: {
    color: "#431AB7",
    fontSize: "12px",
    cursor: "pointer",
    minWidth: "55px",
  },
  fakeSelect: {
    display: "flex",
    alignItems: "center",
    margin: "8px 0px 0px",
    background: "#F7F9FE",
    color: "#431AB7",
    borderRadius: "16px",
    border: "none",
    height: "49px",
    fontFamily: "Agrandir",
    padding: "11.5px 18px",

    "& img": {
      marginRight: "15px",
      borderRadius: "50%",
      objectFit: "cover",
      width: "24px",
      height: "24px",
    },
  },
  contentPurple: {
    display: "flex",
    alignItems: "flex-end",
    color: "#431AB7",
    fontSize: "14px",
    lineHeight: "120%",
    "& :not(:nth-child(2))": {
      whiteSpace: "nowrap",
    },
    "& :last-child": {
      fontWeight: 800,
    },
  },

  dividerDotted: {
    margin: "0px 16px",
    width: "100%",
    borderBottom: "1px dotted #431AB7",
  },
  fractionTitle: {
    fontSize: 14,
    color: "#1A1B1C",
    fontWeight: 800,
    marginBottom: theme.spacing(0.5),
  },
  fractionValue: {
    fontFamily: "Agrandir Grand",
    fontWeight: 800,
    fontSize: 22,
    color: Color.Purple,
  },
  purpleSmall: {
    color: "#431AB7",
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "120%",
    "& span": {
      fontWeight: "normal",
      fontSize: "16px",
      lineHeight: "21px",
      marginLeft: "8px",
    },
  },
  barContainer: {
    margin: "8px 0px",
    backgroundColor: "#EFF2FD",
    height: "8px",
    borderRadius: "16px",
    width: "100%",
  },
  bar: {
    background: "#9EACF2",
    height: "100%",
    borderRadius: "16px",
  },
  saleBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      flexDirection: "column",
      "& > div:first-child": {
        width: "100%",
      },
      "& > div:last-child": {
        width: "100%",
      }
    },
  },
  divider: {
    border: "1px solid #EBEBEB",
    width: "1px",
    height: "100%",
    marginLeft: 64,
    marginRight: 64,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      height: "1px",
      marginTop: 24,
      marginBottom: 24,
    },
  },
  priceDetail: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    [theme.breakpoints.down(400)]: {
      width: "100%",
      flexDirection: "column",
      alignItems: "flex-start",
      justifyContent: "flex-start",

      "& button": {
        marginTop: 15,
        width: "100%",
      }
    },
  },
}));

export default function FractionBox({ media, isSale }) {
  const classes = useFractionBoxStyles();
  const [sold, setSold] = useState<number>(20);
  const [remaining, setRemaining] = useState<number>(200);

  const [openBuyModal, setOpenBuyModal] = React.useState<boolean>(false);

  return (
    <div className={classes.exchangeBox}>
      {isSale ? (
        <Box className={classes.saleBox}>
          <Box flex={1}>
            <div className={classes.purpleSmall}>SALE PROGRESS</div>
            <div className={classes.barContainer}>
              <div className={classes.bar} style={{ width: `${(sold / remaining) * 100}%` }} />
            </div>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <div className={classes.purpleSmall}>
                Sold<span>{sold}</span>
              </div>
              <div className={classes.purpleSmall}>
                Remaining<span>{remaining}</span>
              </div>
            </Box>
          </Box>
          <Box className={classes.divider} />
          <Box className={classes.priceDetail}>
            <Box>
              <div className={classes.fractionTitle}>Fraction Initial Price</div>
              <div className={classes.fractionValue}>{`${media?.Fraction?.InitialPrice ?? "N/A"} USDT`}</div>
            </Box>
            <button className={classes.button} onClick={() => setOpenBuyModal(true)}>
              Buy Fractions
            </button>
          </Box>
        </Box>
      ) : (
        <>
          <Box className={classes.saleBox}>
            <Box flex={0.4} display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" flexDirection="column">
                <Box className={classes.offersTitle}>Revenue Accrued</Box>
                <div className={classes.fractionValue}>$320</div>
              </Box>
              <button className={classes.button} onClick={() => setOpenBuyModal(true)}>
                Claim
              </button>
            </Box>
            <Box className={classes.divider} />
            <Box flex={0.6} display="flex" alignItems="center" justifyContent="space-between">
              <img src={require("assets/pixImages/exchange.png")} alt="exchange" />
              <Box className={classes.offersTitle}>Trade Fractions and Financial Derivatives on Privi Exchange!</Box>
              <button className={classes.button} onClick={() => setOpenBuyModal(true)}>
                Trade Everlasting
              </button>
            </Box>
          </Box>
        </>
      )}
      <BuyFractionModal
        open={openBuyModal}
        onClose={() => setOpenBuyModal(false)}
      />
    </div>
  );
}
