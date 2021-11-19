import React, { useState, useEffect, useMemo } from "react";
import Moment from "react-moment";
import { priviPodGetStaking } from "shared/services/API";
import { useMediaQuery, useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { Gradient, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { numberWithCommas } from "shared/helpers/number";
import Proposals from "../Proposals";
import { useStyles } from "./index.styles";
import PodStakingModal from "components/PriviDigitalArt/modals/PodStakingModal";
import UnstakeRedeemModal from "components/PriviDigitalArt/modals/UnstakeRedeemModal";

const Governance = ({ pod, podInfo, handleRefresh }) => {
  const classes = useStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [stakings, setStakings] = useState<any>([]);
  const [currentStaking, setCurrentStaking] = useState<any>();

  const [openStakingModal, setOpenStakingModal] = useState<boolean>(false);
  const [openUnstakeRedeemModal, setOpenUnstakeRedeemModal] = useState<"unstake" | "redeem" | boolean>(false);

  const [showMore, setShowMore] = useState<boolean>(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    // load staking positions
    const response = await priviPodGetStaking(pod.Id, "PIX");
    if (response?.success) {
      setStakings(response.data);
    }
  };

  const myTotalStaking = useMemo(() => {
    return stakings.reduce((value, current) => value + current.amount, 0);
  }, [stakings]);

  const filteredStakings = useMemo(
    () => (showMore ? stakings.filter((_, index) => index < 3) : stakings),
    [showMore, stakings]
  );

  return (
    <div className={classes.content}>
      <div className={classes.stakeSection}>
        <Box className={classes.title}>Staking</Box>
        <Box display="flex" mt={3}>
          <Box display="flex" flexDirection="column">
            <Box className={classes.typo1}>Total Staked</Box>
            <Box className={classes.typo2} mt={0.5}>
              {numberWithCommas(pod.totalStaked || 0)}
            </Box>
            <Box className={classes.typo3}>{pod.TokenSymbol}</Box>
          </Box>
          <Box
            mx={isMobile ? "30px" : "118px"}
            height={"54.6px"}
            width={"1px"}
            bgcolor="rgba(84, 101, 143, 0.3)"
          ></Box>
          <Box display="flex" flexDirection="column">
            <Box className={classes.typo1}>Total Rewards Accumulated</Box>
            <Box className={classes.typo4} mt={0.5}>
              ${numberWithCommas(pod.totalReward || 0)}
            </Box>
          </Box>
        </Box>
        <div className={classes.stakingDetailSection}>
          <Box className={classes.flexBox} justifyContent="space-between">
            <Box display="flex" flexDirection="column">
              <div className={classes.typo5}>
                {myTotalStaking} <span>{pod.TokenSymbol}</span>
              </div>
              <Box className={classes.typo6} mt={0.5}>
                My total stake
              </Box>
            </Box>
            <Box display="flex" alignItems="center">
              {!isMobile && (
                <Box className={classes.typo7} maxWidth={420} textAlign="end" mr={"21px"}>
                  Staking Media Fractions gives you revenue generated from the song and voting power on
                  governance over song NFTs
                </Box>
              )}
              <PrimaryButton
                size="small"
                onClick={() => setOpenStakingModal(true)}
                style={{
                  background: Gradient.Green1,
                  padding: isMobile ? "10px 25px" : "17px 46px",
                  borderRadius: "35px",
                  fontFamily: "Montserrat",
                  fontWeight: 600,
                  fontSize: isMobile ? 14 : 16,
                  lineHeight: "16px",
                  height: "auto",
                }}
                isRounded
              >
                Add Stake
              </PrimaryButton>
            </Box>
          </Box>
          {isMobile && (
            <Box className={classes.typo7} width={1} mt={2}>
              Staking Media Fractions gives you revenue generated from the song and voting power on governance
              over song NFTs
            </Box>
          )}
          {filteredStakings.map(staking => (
            <div className={classes.stakingActionSection}>
              {isMobile ? (
                <>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" flexDirection="column">
                      <div className={classes.typo5}>
                        {staking.amount} <span>{pod.TokenSymbol}</span>
                      </div>
                      <Box className={classes.typo6} mt={0.5}>
                        My Stake
                      </Box>
                    </Box>
                    <Box display="flex" flexDirection="column">
                      <div className={classes.typo5}>
                        {staking.rewardsAccumulated || 0} <span>{pod.FundingToken}</span>
                      </div>
                      <Box className={classes.typo6} mt={0.5}>
                        Rewards accumulated
                      </Box>
                    </Box>
                    <Box display="flex" flexDirection="column">
                      <div className={classes.typo8}>
                        <Moment format={"DD/MM/YYYY"}>{staking.timestamp}</Moment>
                      </div>
                      <Box className={classes.typo6} mt={0.5}>
                        Date
                      </Box>
                    </Box>
                  </Box>
                  <Box className={classes.flexBox} mt={2}>
                    <PrimaryButton
                      size="small"
                      onClick={() => {
                        setCurrentStaking(staking);
                        setOpenUnstakeRedeemModal("unstake");
                      }}
                      style={{
                        background: "#2D3047",
                        padding: "9px 19px",
                        borderRadius: "29px",
                        fontFamily: "Montserrat",
                        fontWeight: 600,
                        fontSize: 12,
                        height: "auto",
                        lineHeight: "19.5px",
                      }}
                      isRounded
                    >
                      Unstake
                    </PrimaryButton>
                    <SecondaryButton
                      size="small"
                      onClick={() => {
                        setCurrentStaking(staking);
                        setOpenUnstakeRedeemModal("redeem");
                      }}
                      style={{
                        border: "1px solid #2D3047",
                        padding: "9px 19px",
                        borderRadius: "29px",
                        fontFamily: "Montserrat",
                        fontWeight: 600,
                        fontSize: 12,
                        height: "auto",
                        lineHeight: "19.5px",
                        color: "#2D3047",
                      }}
                      isRounded
                    >
                      Redeem
                    </SecondaryButton>
                  </Box>
                </>
              ) : (
                <>
                  <Box display="flex" flexDirection="column">
                    <div className={classes.typo5}>
                      {staking.amount} <span>{pod.TokenSymbol}</span>
                    </div>
                    <Box className={classes.typo6} mt={0.5}>
                      My Stake
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="column">
                    <div className={classes.typo5}>
                      {staking.rewardsAccumulated || 0} <span>{pod.FundingToken}</span>
                    </div>
                    <Box className={classes.typo6} mt={0.5}>
                      Rewards accumulated
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="column">
                    <div className={classes.typo8}>
                      <Moment format={"DD/MM/YYYY"}>{staking.timestamp}</Moment>
                    </div>
                    <Box className={classes.typo6} mt={0.5}>
                      Date
                    </Box>
                  </Box>
                  <Box className={classes.flexBox}>
                    <PrimaryButton
                      size="small"
                      onClick={() => {
                        setCurrentStaking(staking);
                        setOpenUnstakeRedeemModal("unstake");
                      }}
                      style={{
                        background: "#2D3047",
                        padding: "9px 19px",
                        borderRadius: "29px",
                        fontFamily: "Montserrat",
                        fontWeight: 600,
                        fontSize: "16px",
                        height: "38px",
                        lineHeight: "19.5px",
                      }}
                      isRounded
                    >
                      Unstake
                    </PrimaryButton>
                    <SecondaryButton
                      size="small"
                      onClick={() => {
                        setCurrentStaking(staking);
                        setOpenUnstakeRedeemModal("redeem");
                      }}
                      style={{
                        border: "1px solid #2D3047",
                        padding: "9px 19px",
                        borderRadius: "29px",
                        fontFamily: "Montserrat",
                        fontWeight: 600,
                        fontSize: "16px",
                        height: "38px",
                        lineHeight: "19.5px",
                        color: "#2D3047",
                      }}
                      isRounded
                    >
                      Redeem
                    </SecondaryButton>
                  </Box>
                </>
              )}
            </div>
          ))}
          {stakings.length > 3 && (
            <Box className={classes.stakeShowMoreSection} onClick={() => setShowMore(!showMore)}>
              <Box className={classes.typo8} mr={1}>
                {showMore ? "Show more positions" : "Show less positions"}
              </Box>
              {showMore ? <DownArrowIcon /> : <UpArrowIcon />}
            </Box>
          )}
        </div>
      </div>
      <div className={classes.proposalSection}>
        <Proposals pod={pod} podInfo={podInfo} handleRefresh={handleRefresh} totalStaked={myTotalStaking} />
      </div>
      <PodStakingModal
        open={openStakingModal}
        onClose={() => setOpenStakingModal(false)}
        handleRefresh={() => {
          handleRefresh();
          loadData();
        }}
        pod={pod}
        podInfo={podInfo}
        stakings={stakings}
      />
      <UnstakeRedeemModal
        open={openUnstakeRedeemModal !== false}
        type={openUnstakeRedeemModal}
        staking={currentStaking}
        pod={pod}
        podInfo={podInfo}
        onClose={() => setOpenUnstakeRedeemModal(false)}
        handleRefresh={() => {
          handleRefresh();
          loadData();
        }}
      />
    </div>
  );
};

export default Governance;

const UpArrowIcon = () => (
  <svg width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 4L4 1L1 4"
      stroke="#77788E"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const DownArrowIcon = () => (
  <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1 1.60547L4 4.60547L7 1.60547"
      stroke="#77788E"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);
