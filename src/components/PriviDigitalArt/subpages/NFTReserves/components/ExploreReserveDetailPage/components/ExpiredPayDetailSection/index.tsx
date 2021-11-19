import React from 'react'
import Box from 'shared/ui-kit/Box'
import { Text, SecondaryButton, PrimaryButton } from "shared/ui-kit";

import { exploreOptionDetailPageStyles } from '../../index.styles';

export default ({ isSuccess }) => {
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
          Details
        </Text>
      </Box>
      <Box display="flex" mt={2} flex={1}>
        <Box display="flex" flexDirection="column" flex={0.4} style={{ borderRight: '1px solid #9EACF220', fontSize: 14}}>
          <Box color="#431AB7" >Option Time</Box>
          <Box style={{ fontSize: 18 }}>20 days (15.11.2021)</Box>
        </Box>
        <Box display="flex" flexDirection="column" flex={0.3} pl={5} style={{ borderRight: '1px solid #9EACF220', fontSize: 14 }}>
          <Box color="#431AB7">Collateral</Box>
          <Box style={{ fontSize: 18 }}>20 %</Box>
        </Box>
        <Box flex={0.3} pl={5}>
          <SecondaryButton size="medium">Check Orderbook</SecondaryButton>
        </Box>
      </Box>
      <Box mt={4} className={isSuccess ? classes.ExpiredPaySuccess : classes.ExpiredPayFailed} padding="20px">
        <Box fontFamily="Agrandir GrandHeavy" fontSize={14} color={isSuccess ? "#431AB7" : "#FF8E3C"}>{isSuccess ? "Offer Paid" : "Offer Expired"}</Box>
        <Box mt={1} >You didn’t manage to pay full amount necessary to buy out your NFT. You can withdraw your funds and NFT will be returned to it’s owner. </Box>
        <Box flex={1} mt="27px" display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" flexDirection="column" flex={0.5} style={{ borderRight: "1px solid #A4A4A420" }}>
            <Box fontSize={16}>Future price</Box>
            <Box color="#431AB7" fontFamily="Agrandir GrandHeavy" fontSize={18}>2545 USDT</Box>
          </Box>
          <Box display="flex" flexDirection="column" flex={0.5} pl={8}>
            <Box fontSize={16}>Paid amount to withdraw</Box>
            <Box color="#431AB7" fontFamily="Agrandir GrandHeavy" fontSize={18}>1200 USDT</Box>
          </Box>
        </Box>
        <PrimaryButton
          size="medium"
          style={{
            width: '100%',
            height: 52,
            backgroundColor: "#431AB7",
            marginTop: 14,
            textTransform: 'uppercase'
          }}
          onClick={() => {}}
        >
          { isSuccess ? "WITHDRAW YOUR FUNDS" : "Claim NFT & Collateral" }
        </PrimaryButton>
      </Box>
    </>
  )
}