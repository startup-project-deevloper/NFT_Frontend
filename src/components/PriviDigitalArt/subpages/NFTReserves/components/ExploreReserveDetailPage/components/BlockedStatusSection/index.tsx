import React, { useState } from 'react'
import Box from 'shared/ui-kit/Box'
import { PrimaryButton } from "shared/ui-kit";
import { exploreOptionDetailPageStyles } from '../../index.styles';
import RangeSlider from "shared/ui-kit/RangeSlider";

export default () => {
  const [range, setRange] = useState(0);
  const classes = exploreOptionDetailPageStyles();

  return (
    <Box display="flex" flexDirection="column" p={4} pl={4.5} width="100%">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" flexDirection="column" color="#4218B5">
          <Box fontFamily='Agrandir GrandHeavy' fontSize={18}>Buyer status of reservance</Box>
          <Box fontSize={14}>If buyer is collaterall is too small you can claim liquidation and cancel reservation.</Box>
        </Box>
        <PrimaryButton size="medium" className={classes.claimButton}>CLAIM LIQUIDATION</PrimaryButton>
      </Box>
      
      <Box mt={5}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <span>
            Collateral status<span style={{ color: "#431AB7", marginLeft: 6 }}>50%</span>
          </span>
          <span>
            Collateral needed<span style={{ color: "#D30401", marginLeft: 6 }}>100%</span>
          </span>
        </Box>
        <RangeSlider value={range} onChange={(event, newValue) => setRange(newValue)} />
        <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
          <span>
            <strong>0 %</strong>
          </span>
          <span>
            <strong>100 %</strong>
          </span>
        </Box>
      </Box>

      <Box color="#4218B5" fontFamily='Agrandir GrandHeavy' fontSize={18} mt={4.5}>Collateral available</Box>
      <Box
        display="flex"
        flex={1}
        alignItems="center"
        borderTop="1px solid #00000010"
        borderBottom="1px solid #00000010"
        padding="8px 50px"
        mt={3}
      >
        <Box className={classes.tableHeader} flex={0.2}>account</Box>
        <Box className={classes.tableHeader} flex={0.6}>symbol</Box>
        <Box className={classes.tableHeader} flex={0.2}>% of</Box>
        <Box className={classes.tableHeader} flex={0.2}>amount</Box>
      </Box>
      <Box display="flex" flex={1} alignItems="center" padding="15px 50px">
        <Box flex={0.2} color="#4218B5">0xeec9...82f8</Box>
        <Box flex={0.6}>
          <img src={require("assets/pixImages/usdt.png")} width={24} />
        </Box>
        <Box flex={0.2}>5 %</Box>
        <Box flex={0.2}>450 USDT</Box>
      </Box>
    </Box>
  )
}