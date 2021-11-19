import React from 'react'
import Box from 'shared/ui-kit/Box'
import { Text } from "shared/ui-kit";

import { exploreOptionDetailPageStyles } from '../../index.styles';

export default () => {
  const classes = exploreOptionDetailPageStyles();

  return (
    <>
      <Box display="flex" justifyContent="space-between">
        <Text
          style={{
            fontSize: "18px",
            color: "#1A1B1C",
            fontWeight: 800,
            fontFamily: "Agrandir GrandHeavy",
          }}
        >
          Rented NFT Details
        </Text>
        <Text
          style={{
            fontSize: "14px",
            color: "#181818",
            fontWeight: 600,
            fontFamily: "Agrandir",
          }}
        >
          Unitlll 15.11.2021 <span style={{ opacity: 0.6 }}>(25 days)</span>
        </Text>
      </Box>
      <Box display="flex" flexDirection="column" className={classes.RentedDetailSection} mt={3}>
        <Box display="flex" flexDirection="column" className={classes.RentedDetailSectionOne} >
          <Box
            ml={3}
            padding="28px 24px 28px 0"
            display="flex"
            justifyContent="space-between"
            style={{ borderBottom: "1px solid #E9E9F2"}}
          >
            <span>Price per Second</span>
            <Box color="#4218B5" style={{ fontWeight: 800, fontFamily: 'Montserrat' }}>0.000053 <span style={{ opacity: 0.6 }}>USDT</span></Box>
          </Box>
          <Box
            ml={3}
            padding="28px 24px 28px 0"
            display="flex"
            justifyContent="space-between"
            style={{ borderBottom: "1px solid #E9E9F2"}}
          >
            <span>Remaining rental time</span>
            <Box color="#4218B5" style={{ fontWeight: 800, fontFamily: 'Montserrat' }}>
              <span>2 <span style={{ opacity: 0.6 }}>days </span></span>
              <span>20 <span style={{ opacity: 0.6 }}>h </span></span>
              <span>21 <span style={{ opacity: 0.6 }}>min</span></span>
            </Box>
          </Box>
          <Box ml={3} padding="28px 24px 28px 0" display="flex" justifyContent="space-between">
            <span>Total cost</span>
            <Box color="#4218B5" style={{ fontWeight: 800, fontFamily: 'Montserrat' }}>22455 <span style={{ opacity: 0.6 }}>USDT</span></Box>
          </Box>
        </Box>
        <Box padding="30px 24px 30px 24px" display="flex" justifyContent="space-between" color="#4218B5">
          <span>Revenue to date</span>
          <span style={{ fontWeight: 800, fontFamily: 'Montserrat' }}>424 <span style={{ opacity: 0.6 }}>USDT</span></span>
        </Box>
      </Box>
    </>
  )
}