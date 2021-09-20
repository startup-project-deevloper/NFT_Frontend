import React from "react";
import { Box } from "@material-ui/core";

import Avatar from "shared/ui-kit/Avatar";
import { copyRightFractionTabStyles } from "./index.styles";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";

const CopyRightFractionTab = (props: any) => {
  const { proposal, pod } = props;

  const classes = copyRightFractionTabStyles();

  return (
    <div className={classes.generalNftMediaTab}>
      <Box className={classes.investorBox} display="flex" alignItems="center" justifyContent="space-between">
        <Box>Investors</Box>
        <Box>{proposal.InvestorShare}%</Box>
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
            <Avatar size={34} image={user.imageUrl || getRandomAvatar()} radius={25} bordered rounded />
            <Box display="flex" flexDirection="column" ml={2}>
              <Box display="flex" alignItems="center" mb={0.5}>
                <div className={classes.nameTypo}>{user.name}</div>
                {index === 0 && (
                  <Box className={classes.tabBox} ml={2.5}>
                    Proposer
                  </Box>
                )}
              </Box>
              <div className={classes.slugTypo}>{user.id}</div>
            </Box>
          </Box>
          <Box className={classes.percentageBox}>{proposal.CopyRightAllocation[index]}%</Box>
        </Box>
      ))}
    </div>
  );
};

export default CopyRightFractionTab;
