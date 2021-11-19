import React from 'react'
import Box from 'shared/ui-kit/Box'
import { exploreOptionDetailPageStyles } from '../../index.styles';

export default () => {
  const classes = exploreOptionDetailPageStyles();

  return (
    <Box display="flex" flexDirection="column" p={4} pl={4.5} width="100%">
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" flexDirection="column" color="#FF253F">
          <Box fontFamily='Agrandir GrandHeavy' fontSize={18}>Manage Collateral</Box>
          <Box fontSize={14}>Make sure your’e collateral is above the liquidation level, otherwise you’ll loos your NFT and  whole collateral.</Box>
        </Box>
      </Box>

      <Box color="#4218B5" fontFamily='Agrandir GrandHeavy' fontSize={18} mt={4.5}>Collateral eposited</Box>
      <Box
        display="flex"
        flex={1}
        alignItems="center"
        borderTop="1px solid #00000010"
        borderBottom="1px solid #00000010"
        padding="8px 50px"
        mt={3}
      >
        <Box className={classes.tableHeader} flex={0.8}>token</Box>
        <Box className={classes.tableHeader} flex={0.2}>% of</Box>
        <Box className={classes.tableHeader} flex={0.2}>amount</Box>
      </Box>
      <Box display="flex" flex={1} alignItems="center" padding="15px 50px">
        <Box flex={0.8}>
          <img src={require("assets/pixImages/usdt.png")} width={24} />
        </Box>
        <Box flex={0.2}>5 %</Box>
        <Box flex={0.2}>450 USDT</Box>
      </Box>
    </Box>
  )
}