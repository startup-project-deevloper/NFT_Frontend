import React, { useState } from "react";

import { makeStyles } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { Color, Gradient, Modal, PrimaryButton } from "shared/ui-kit";
import { IMediaStaking } from "shared/types/Stake";
import StakingModal from "components/PriviMusicDao/modals/StakingModal";

const useStyles = makeStyles(theme => ({
  root: {
    width: "945px !important",
    padding: "64px 65px 52px 65px !important",
    [theme.breakpoints.down("xs")]: {
      padding: "32px 20px !important",
    },
  },
  container: {
    width: "100%",
    height: "100%",
  },
  header: {
    fontSize: 44,
    fontWeight: 400,
    color: "#2D3047",
    fontFamily: "Agrandir",
    "& span": {
      fontWeight: 800,
    },
    [theme.breakpoints.down("xs")]: {
      fontSize: "26px !important",
    },
  },
  bgLinear1: {
    background:
      "linear-gradient(0deg, #ADEBFF, #ADEBFF), linear-gradient(97.63deg, #A0D800 22.64%, #2FCF7A 88.18%)",
  },
  bgLinear2: {
    background:
      "linear-gradient(0deg, #B2EFA2, #B2EFA2), linear-gradient(97.63deg, #A0D800 22.64%, #2FCF7A 88.18%)",
  },
  bgLinear3: {
    background:
      "linear-gradient(0deg, #F8DC95, #F8DC95), linear-gradient(97.63deg, #A0D800 22.64%, #2FCF7A 88.18%)",
  },
  bgLinear4: {
    background:
      "linear-gradient(0deg, #BC9CFF, #BC9CFF), linear-gradient(97.63deg, #A0D800 22.64%, #2FCF7A 88.18%)",
  },
  round: {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    width: 170,
    minWidth: 170,
    height: 170,
    borderRadius: "100%",
    marginRight: 100,
    [theme.breakpoints.down("sm")]: {
      width: 150,
      minWidth: 150,
      height: 150,
      marginRight: 72,
    },
    [theme.breakpoints.down("xs")]: {
      width: 80,
      minWidth: 80,
      height: 80,
      marginRight: 12,
    },
    "& img": {
      position: "absolute",
      [theme.breakpoints.down("xs")]: {
        width: 220,
        "&.unusal": {
          width: 120,
        },
      },
    },
    "&.stack": {
      "& img": {
        width: 260,
        height: 260,
        [theme.breakpoints.down("sm")]: {
          width: 200,
          height: 200,
        },
        [theme.breakpoints.down("xs")]: {
          width: 120,
          height: 120,
        },
      },
    },
    "& span": {
      marginTop: 30,
      marginLeft: 30,
      fontSize: 52,
      color: Color.White,
      opacity: 0.6,
      [theme.breakpoints.down("sm")]: {
        fontSize: 50,
        marginTop: 30,
        marginLeft: 15,
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: 32,
        marginTop: 0,
        marginLeft: 10,
      },
    },
  },
  dot: {
    position: "relative",
    background: "#C4C4C4",
    width: 6,
    minWidth: 6,
    height: 6,
    marginRight: 24,
    borderRadius: "100%",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  hr: {
    position: "absolute",
    top: "50%",
    left: 3,
    width: 1,
    background: "#000000",
    opacity: 0.1,
    height: "calc(100% + 40px)",
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
  },
  itemBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: "100%",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column",
    },
  },
  textBox: {
    width: "50%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
      textAlign: "center",
    },
  },
  textContainer: {
    [theme.breakpoints.up("md")]: {
      width: "50%",
    },
  },
  text: {
    fontSize: 20,
    fontWeight: 500,
    color: "#2D3047",
    fontFamily: "Montserrat",
    lineHeight: "150%",
    [theme.breakpoints.down("xs")]: {
      fontSize: 16,
      textAlign: "center",
      display: "flex",
      padding: "24px 0px",
    },
  },
}));

const HowItWorksModal = props => {
  const classes = useStyles();

  const [selectedStake, setSelectedStake] = useState<IMediaStaking>();
  const [openStakingModal, setOpenStakingModal] = useState<boolean>(false);

  return (
    <Modal
      size="medium"
      isOpen={props.open}
      onClose={props.handleClose}
      showCloseIcon
      className={classes.root}
    >
      <Box className={classes.container}>
        <Box display="flex" flexDirection="row" justifyContent="center" mb={9}>
          <div className={classes.header}>
            <span>How</span> it works?
          </div>
        </Box>
        <Box display="flex" flexDirection="column">
          <Box className={classes.itemBox} mb={5}>
            <div className={classes.dot} />
            <div className={classes.hr} />
            <Box className={`${classes.bgLinear1} ${classes.round} ${props.isStack && "stack"}`}>
              <img
                src={require(`assets/musicDAOImages/${
                  props.isStack ? "calculator_stack" : "music-green"
                }.png`)}
                alt="music"
                style={{ top: props.isStack ? -50 : -90, left: props.isStack ? 0 : -40 }}
              />
              <span>1</span>
            </Box>
            <Box className={classes.textContainer}>
              <div className={classes.text}>
                {props.isStack
                  ? "Use our Privi stake calculator and calculate your potential rewards."
                  : "Stake Privi Tokens and get claimable songs to upload on the Music DAO."}
              </div>
            </Box>
          </Box>
          <Box className={classes.itemBox} mb={5}>
            <div className={classes.dot} />
            <div className={classes.hr} />
            <Box className={`${classes.bgLinear2} ${classes.round} ${props.isStack && "stack"}`} mr={6}>
              <img
                src={require(`assets/musicDAOImages/${props.isStack ? "clock_stack" : "yield-green"}.png`)}
                alt="music"
                style={{ top: props.isStack ? -50 : -50, left: props.isStack ? 0 : -20 }}
              />
              <span>2</span>
            </Box>
            <Box className={classes.textContainer}>
              <div className={classes.text}>
                {props.isStack
                  ? "The more time you stake the more rewards you will accumulate. Rewards are paid from Defi protocol, from LP borrowing funds."
                  : "These claimable songs generate revenue when listened by other people."}
              </div>
            </Box>
          </Box>
          {/* <Box className={classes.itemBox} mb={5}>
            <div className={classes.dot} />
            <div className={classes.hr} />
            <Box className={`${classes.bgLinear3} ${classes.round} ${props.isStack && "stack"}`} mr={6}>
              <img
                src={require(`assets/musicDAOImages/${
                  props.isStack ? "calculator_stack_1" : "distribution"
                }.png`)}
                alt="music"
                className="unusal"
                style={{ top: props.isStack ? -50 : -15, left: props.isStack ? 0 : 40 }}
              />
              <span>3.</span>
            </Box>
            <Box className={classes.textContainer}>
              <div className={classes.text}>
                {props.isStack
                  ? "You can get your staked coins back whenever you want by paying the remaining stablecoin to repay the loan."
                  : "When artist(s) claim, 1% of the revenue generated is distributed between uploaders of the song."}
              </div>
            </Box>
          </Box> */}
          <Box className={classes.itemBox}>
            <div className={classes.dot} />
            <Box className={`${classes.bgLinear4} ${classes.round} ${props.isStack && "stack"}`} mr={6}>
              <img
                src={require(`assets/musicDAOImages/${props.isStack ? "return" : "reward"}.png`)}
                alt="music"
                style={{ top: props.isStack ? -50 : -45, left: props.isStack ? 0 : -10 }}
              />
              <span>3</span>
            </Box>
            <Box className={classes.textContainer}>
              <div className={classes.text}>
                {props.isStack
                  ? "You can get your staked Privi back whenever you want by paying the remaining pUSD to repay the loan."
                  : "Fair distribution, base on a sinusoidal accumulation of rewards."}
              </div>
            </Box>
          </Box>
          {props.isStack && (
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" mt={5}>
              <PrimaryButton
                size="medium"
                onClick={() => setOpenStakingModal(true)}
                style={{
                  background: Gradient.Green1,
                  paddingLeft: "66px",
                  paddingRight: "66px",
                  height: "58px",
                }}
                isRounded
              >
                Stake Privi Coins Now
              </PrimaryButton>
            </Box>
          )}
        </Box>
      </Box>
      {openStakingModal && (
        <StakingModal
          stake={selectedStake}
          open={openStakingModal}
          handleClose={() => setOpenStakingModal(false)}
          handleStaking={() => {}}
          isStaking
        />
      )}
    </Modal>
  );
};

export default HowItWorksModal;
