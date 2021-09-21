import React from 'react';
import Box from "shared/ui-kit/Box";

import { AuctionDetailStyles, CalenderIcon, ClockIcon } from "./index.styles";

export default ({ auction }) => {
  const classes = AuctionDetailStyles();

  return (
    <Box className={classes.root} display="flex" flexDirection="column">
      <p>Auction Details</p>
      <Box display="flex" mt="2px" justifyContent="space-between" className={classes.boxWithBorder}>
        <Box display="flex" flexDirection="column" className={classes.boxInfo}>
          <span className={classes.typo1}>🔥 Top bid</span>
          <span className={classes.typo2}>12000 JOTS</span>
          <span className={classes.typo3}>$3200</span>
        </Box>
        <Box display="flex" flexDirection="column">
          <span className={classes.typo1}>⏳ Auction Ending In</span>
          <div className={classes.endingTime}>
            <span className={classes.typo2}>10</span>
            <span className={classes.typo3}>D</span>
            <span className={classes.typo2}>00</span>
            <span className={classes.typo3}>H</span>
            <span className={classes.typo2}>00</span>
            <span className={classes.typo3}>M</span>
            <span className={classes.typo2}>00</span>
            <span className={classes.typo3}>S</span>
          </div>
        </Box>
      </Box>
      <Box display="flex" className={classes.boxWithBorder}>
        <Box display="flex" alignItems="center">
          <div className={classes.blueCircle} />
          <span className={classes.bidToken}>Bidding token is JOTS</span>
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" className={classes.bottom}>
        <Box display="flex">
          <CalenderIcon />
          <span>Started 12hrs. ago (May 11, 2021 at 12:22am)</span>
        </Box>
        <Box display="flex">
          <ClockIcon />
          <span>Ends in 10 days (May 28, 2021 at 12:22pm)</span>
        </Box>
      </Box>
    </Box>
  )
}