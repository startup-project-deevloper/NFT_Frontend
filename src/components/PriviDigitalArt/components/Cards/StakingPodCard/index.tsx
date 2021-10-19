import React, { useState } from "react";
import Box from "shared/ui-kit/Box";
import { makeStyles } from "@material-ui/core/styles";
import { Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Moment from "react-moment";
import UnstakeRedeemModal from "components/PriviDigitalArt/modals/UnstakeRedeemModal";

const useStyles = makeStyles(theme => ({
  card: {
    background: "#EFF2FD",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: "20px",
    padding: "40px 24px 30px",
    fontFamily: "Montserrat",
  },
  title: {
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "20px",
    lineHeight: "24px",
    color: "#2D3047",
  },
  flexSpaceBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
  },
  header1: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: "14px",
    lineHeight: "17px",
    color: Color.Purple,
  },
  header2: {
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "14px",
    lineHeight: "17px",
    textAlign: "right",
    color: Color.Violet,
  },
  divider: {
    margin: "19px 0px 14px",
    width: "calc(100% + 24px * 2)",
    marginLeft: "-24px",
    height: "1px",
    opacity: 0.1,
    background: "#000000",
  },
}));

export default function StakingPodCard({
  staking,
  pod,
  podInfo,
  handleRefresh,
}: {
  staking: any;
  pod: any;
  podInfo: any;
  handleRefresh: any;
}) {
  const classes = useStyles();

  const [openUnstakeRedeemModal, setOpenUnstakeRedeemModal] = useState<"unstake" | "redeem" | boolean>(false);

  return (
    <div className={classes.card}>
      <Box className={classes.title} mb={5}>
        {staking.position}
      </Box>
      <Box className={classes.flexSpaceBox}>
        <Box className={classes.header1}>Amount</Box>
        <Box className={classes.header2}>
          {staking.amount.toLocaleString()}&nbsp;{pod.TokenSymbol}&nbsp;
          {staking.type === "copyright" && "Copyright"}
        </Box>
      </Box>
      <div className={classes.divider} />
      <Box className={classes.flexSpaceBox}>
        <Box className={classes.header1}>Date</Box>
        <Box className={classes.header2}>
          <Moment format={"DD/MM/YYYY"}>{staking.timestamp}</Moment>
        </Box>
      </Box>
      <div className={classes.divider} />
      <Box className={classes.flexSpaceBox}>
        <Box className={classes.header1}>Rewards Accumulated</Box>
        <Box className={classes.header2}>
          {staking.rewardsAccumulated ?? 0}&nbsp;{pod.TokenSymbol}&nbsp;
          {staking.type === "copyright" && "Copyright"}
        </Box>
      </Box>

      <Box mt={8} display="flex" justifyContent="space-between">
        <SecondaryButton
          size="small"
          onClick={() => setOpenUnstakeRedeemModal("unstake")}
          style={{
            background: "transparent",
            padding: "11px",
            fontFamily: "Montserrat",
            fontWeight: 600,
            fontSize: "14px",
            flex: 1,
            lineHeight: "18px",
            color: Color.Purple,
            border: `1px solid ${Color.Purple}`,
            height: "auto",
          }}
        >
          Unstake
        </SecondaryButton>
        <PrimaryButton
          size="small"
          onClick={() => setOpenUnstakeRedeemModal("redeem")}
          style={{
            background: Color.Purple,
            padding: "11px",
            fontFamily: "Montserrat",
            fontWeight: 600,
            fontSize: "14px",
            lineHeight: "18px",
            flex: 1,
            marginLeft: "15px",
            color: Color.GreenLight,
            border: "none",
            height: "auto",
          }}
        >
          Redeem
        </PrimaryButton>
      </Box>

      <UnstakeRedeemModal
        open={openUnstakeRedeemModal !== false}
        type={openUnstakeRedeemModal}
        staking={staking}
        pod={pod}
        podInfo={podInfo}
        onClose={() => setOpenUnstakeRedeemModal(false)}
        handleRefresh={handleRefresh}
      />
    </div>
  );
}
