import React from "react";
import { Box } from "@material-ui/core";

import Avatar from "shared/ui-kit/Avatar";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { Color } from "shared/ui-kit";

import { copyRightFractionTabStyles } from "./index.styles";

const CopyRightFractionTab = (props: any) => {
  const { proposal, pod } = props;

  const classes = copyRightFractionTabStyles();

  return (
    <div className={classes.generalNftMediaTab}>
      <Box className={classes.investorBox} display="flex" alignItems="center" justifyContent="space-between">
        <Box>Investors</Box>
        <Box>{proposal.CopyrightInvestorShare}%</Box>
      </Box>
      {pod.CreatorsData?.map((user, index) => (
        <Box
          key={`distrib-${index}`}
          className={classes.distribBox}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Box display="flex">
            <Avatar size={34} image={user.imageUrl ?? getDefaultAvatar()} radius={25} bordered rounded />
            <Box display="flex" flexDirection="column" ml={2}>
              <Box display="flex" alignItems="center" mb={0.5}>
                <Box className={classes.nameTypo}>{user.name}</Box>
                {index === 0 && (
                  <Box className={classes.tabBox} ml={2.5}>
                    Proposer
                  </Box>
                )}
              </Box>
              <Box className={classes.slugTypo}>@{user.urlSlug}</Box>
            </Box>
          </Box>
          <Box textAlign="end">
            <Box>
              {proposal.Votes && proposal.Votes[user.id] === true ? (
                <Box
                  display="flex"
                  alignItems="center"
                  style={{ color: Color.MusicDAOGreen, fontSize: 14, lineHeight: "15px" }}
                >
                  Accepted&nbsp;
                  <img src={require("assets/icons/accepted_green.png")} />
                </Box>
              ) : proposal.Votes && proposal.Votes[user.id] === false ? (
                <Box
                  display="flex"
                  alignItems="center"
                  style={{ color: Color.Red, fontSize: 14, lineHeight: "15px" }}
                >
                  Declined&nbsp;
                  <img src={require("assets/icons/declined_red.png")} />
                </Box>
              ) : (
                <></>
              )}
            </Box>
            <Box className={classes.percentageBox}>{`${
              proposal.Distribution ? proposal.Distribution[index] : "0"
            }%`}</Box>
          </Box>
        </Box>
      ))}
    </div>
  );
};

export default CopyRightFractionTab;
