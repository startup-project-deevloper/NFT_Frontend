import React from "react";
import { Modal } from "shared/ui-kit";
//import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { Box, makeStyles } from "@material-ui/core";

const useClaimNFTModalStyles = makeStyles(theme => ({
  root: {
    width: "350px !important",
    display: "flex",
    flexDirection: "column",
    "& label": {
      color: "#1A1B1C",
      fontSize: "14px",
      lineHeight: "120%",
    },
    "& .MuiInput-root": {
      margin: "8px 0px 0px",
      background: "#FFFFFF",
      borderRadius: "8px",
      height: "40px !important",
      minHeight: "40px !important",
      border: "1px solid #A4A4A4",
      fontFamily: "Agrandir",
    },
  },
  title: {
    fontSize: "14px",
    lineHeight: "120%",
    fontWeight: 800,
    color: "#431AB7",
    alignSelf: "center",
    marginBottom: "24px",
    textAlign: "center",
  },
  button: {
    background: "#431AB7",
    borderRadius: "4px",
    height: "34px",
    order: 0,
    flexGrow: 1,
    margin: "24px 0px 0px",
    padding: "8px 32px",
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "18px",
    textAlign: "center",
    color: "#FFFFFF",
  },
  purpleText: {
    textAlign: "center",
    color: "#431AB7",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "21px",
    alignSelf: "center",
    marginTop: "calc(191px / 2 - 20px)",
    marginBottom: "calc(-191px / 2 - 20px)",
    zIndex: 2,
    maxWidth: "220px",
  },
  image: {
    zIndex: 1,
    height: "191px",
    width: "286px",
    alignSelf: "center",
  },
}));

export const ClaimNFTModal = ({ buyingRewards, open, onClose }) => {
  const classes = useClaimNFTModalStyles();
  //const { showAlertMessage } = useAlertMessage();

  const handleClaim = () => {
    //TODO:CLAIM
  };

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      {buyingRewards && <div className={classes.title}>Claim Buying Rewards</div>}

      <Box className={classes.purpleText} fontFamily={buyingRewards ? "Agrandir Grand" : "Agrandir"}>
        {buyingRewards
          ? `You will receive ${buyingRewards} USDT`
          : "We are sorry buy there are not Buying Rewards to be claimed."}
      </Box>
      <img className={classes.image} src={require("assets/icons3d/redeem_table.png")} alt="" />
      {buyingRewards && (
        <button className={classes.button} onClick={handleClaim}>
          Claim
        </button>
      )}
    </Modal>
  );
};
