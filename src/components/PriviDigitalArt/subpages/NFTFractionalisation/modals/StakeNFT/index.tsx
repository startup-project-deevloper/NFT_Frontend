import React from "react";
import { Modal } from "shared/ui-kit";
//import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { makeStyles } from "@material-ui/core/styles";

const useStakeModalStyles = makeStyles(theme => ({
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
    order: 0,
    height: "34px",
    flexGrow: 1,
    margin: "16px 0px 0px",
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
    marginTop: "8px",
    marginBottom: "8px",
  },
  gradientText: {
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    background:
      "linear-gradient(222.67deg, #418DFF 7.42%, #4541FF 36.62%, #4541FF 45.74%, #EF41CB 72.7%, #EF41CB 76.71%, #EFA941 94.91%)",
    fontFamily: "Agrandir Grand",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "16px",
    lineHeight: "120%",
    textAlign: "center",
    textTransform: "uppercase",
  },
  image: {
    height: "180px",
    width: "180px",
    margin: "-45px 0px",
    alignSelf: "center",
  },
}));

export const StakeModal = ({ isOwner, stakingInterest, open, onClose }) => {
  const classes = useStakeModalStyles();
  //const { showAlertMessage } = useAlertMessage();

  const handleStake = () => {
    //TODO:STAKE
  };

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <img className={classes.image} src={require("assets/icons3d/PIX.png")} alt="" />

      {isOwner && <div className={classes.purpleText}>Stake your real NFT and</div>}
      <div className={classes.gradientText}>
        {isOwner ? `Start earning ${((stakingInterest ?? 0) * 100).toFixed()}%` : "We are sorry,"}
      </div>
      <div className={classes.purpleText}>
        {isOwner
          ? `of all the trading fees of the NFT derivates.`
          : ` but you need to be the owner of the original NFT to stake it.
          Make sure you connected the right wallet.`}
      </div>
      {isOwner && (
        <button className={classes.button} onClick={handleStake}>
          Stake
        </button>
      )}
    </Modal>
  );
};
