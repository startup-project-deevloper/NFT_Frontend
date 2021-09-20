import React from "react";
import { Box, Grid } from "@material-ui/core";

import { tokenomicsTabStyles } from "./index.styles";
import { formatDDMMYY } from "shared/helpers";

const TokenomicsTab = (props: any) => {
  const { proposal } = props;
  const classes = tokenomicsTabStyles();

  return (
    <div className={classes.tokenomicsTab}>
      <Box className={classes.headerBox}>
        <img
          src={
            "http://bsmedia.business-standard.com/_media/bs/img/article/2017-05/22/full/1495395416-6262.jpg"
          }
          alt="image"
        />
        <Box>
          <Box className={classes.headerTitle}>
            <Box>
              <p>Pod Token Name</p>
              <p>{proposal.TokenName}</p>
            </Box>
            <Box>
              <p>Symbol</p>
              <p>{proposal.TokenSymbol}</p>
            </Box>
          </Box>
          <span>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean egestas tempor urna, vitae auctor
            eros. Morbi scelerisque rhoncus purus, ut gravida est aliquam eget. Etiam aliquet tellus ac nunc
            iaculis, nec venenatis massa feugiat. Ut sed odio felis. Nunc venenatis lacinia diam vel dapibus.
          </span>
        </Box>
      </Box>
      <Grid className={classes.valueBox} container spacing={2} wrap={"wrap"}>
        <Grid item md={4} sm={6}>
          <p>Funding Target Supply</p>
          <span>
            {proposal.FundingTarget}&nbsp;{proposal.FundingToken}
          </span>
        </Grid>
        <Grid item md={4} sm={6}>
          <p>Total Supply</p>
          <span>{proposal.CopyRightSupply}</span>
        </Grid>
        <Grid item md={4} sm={6}>
          <p>Funding Price</p>
          <span>
            {proposal.FundingPrice}&nbsp;{proposal.FundingToken}
          </span>
        </Grid>
        <Grid item md={4} sm={6}>
          <p>Investor share</p>
          <span>{proposal.InvestorShare}%</span>
        </Grid>
        <Grid item md={4} sm={6}>
          <p>Sharing percentage</p>
          <span>{proposal.SharingPercentage}%</span>
        </Grid>
        <Grid item md={4} sm={6}>
          <p>Royalty share</p>
          <span>{proposal.Royalty}%</span>
        </Grid>
      </Grid>
      <Box className={classes.footerBox}>
        <span>Funding Date</span>
        <span>{formatDDMMYY(proposal.FundingDate * 1000)}</span>
      </Box>
    </div>
  );
};

export default TokenomicsTab;
