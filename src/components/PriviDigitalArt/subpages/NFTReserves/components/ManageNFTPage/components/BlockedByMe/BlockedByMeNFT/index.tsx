import React from 'react'
import { SecondaryGradientSlider } from 'shared/ui-kit';
import Box from 'shared/ui-kit/Box'

import { blockedByMeNFTStyles } from './index.styles'

export default ({ item }) => {
  const classes = blockedByMeNFTStyles();
  
  const SlideMarks = [
    {
      value: 0,
      label: "Liquidation",
    },
    {
      value: 33.0,
      label: "High Risk",
    },
    {
      value: 66.0,
      label: "Medium Risk",
    },
    {
      value: 100,
      label: "Low Risk",
    },
  ];

  return (
    <Box
      display="flex"
      alignItems="center"
      color="#fff"
      width="100%"
      className={classes.container}
    >
      <img
        src={item?.imageUrl ?? require(`assets/backgrounds/digital_art_1.png`)}
        className={classes.nftImage}
        alt={item.nftName}
      />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        ml={4}
        flex={1}
        height="150px"
      >
        <Box className={classes.nftName}>{item.nftName}</Box>
        <Box display="flex" alignItems="center" flex={1}>
          <Box display="flex" flexDirection="column" flex={0.25} className={classes.section}>
            <Box className={classes.header}>Future Price</Box>
            <Box>
              {item.futurePrice} USDT
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" flex={0.25} pl={6} className={classes.section}>
            <Box className={classes.header}>Collateral</Box>
            <Box>
              {item.collateral} USDT
            </Box>
          </Box>
          <Box flex={0.5} pl={6} display="flex" alignItems="center">
            <Box className={classes.header} mr={3}>Payment In</Box>
            <span className={classes.time}>4 Days</span>
            <span className={classes.time}>22 h</span>
            <span className={classes.time}>12 mi</span>
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box display="flex" flexDirection="column" mr={8}>
            <Box className={classes.header}>Collateral Pct.</Box>
            <Box>
              {item.collateralPct}%
            </Box>
          </Box>
          <Box flex={1} mr={4}>
            <SecondaryGradientSlider
              marks={SlideMarks}
              step={1}
              value={45}
              valueLabelDisplay="off"
              style={{ width: "100%" }}
            />
          </Box>
        </Box>
      </Box>
      <img
        src={require(`assets/icons/arrow_white_right.png`)}
        style={{ cursor: "pointer" }}
      />
    </Box>
  )
}