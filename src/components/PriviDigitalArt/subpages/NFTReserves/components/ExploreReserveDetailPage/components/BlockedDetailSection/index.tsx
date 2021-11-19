import React from 'react'
import Box from 'shared/ui-kit/Box'
import { Text, SecondaryButton } from "shared/ui-kit";

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
      <Box mt={4} className={classes.BlockedDetailSection}>
        <Box display="flex" justifyContent="space-between" padding="32px">
          <Box fontSize={16}>Blocked price</Box>
          <Box color="#4218B5" style={{ fontWeight: 800, fontFamily: 'Agrandir GrandHeavy' }}>2545 <span style={{ opacity: 0.6 }}>USDT</span></Box>
        </Box>
        <Box className={classes.BlockedDetailBottomSection}>
          <Box display="flex" justifyContent="space-between" padding="32px 0" marginX="32px" color="#4218B5" style={{ borderBottom: "1px solid #431AB721" }}>
            <Box fontSize={16}>Already paid</Box>
            <Box style={{ fontWeight: 800, fontFamily: 'Agrandir GrandHeavy' }}>1200 <span style={{ opacity: 0.6 }}>USDT</span></Box>
          </Box>
          <Box padding="32px 0" display="flex" alignItems="center" justifyContent="center">
            <ClockIcon /><Box ml={2} fontFamily='Agrandir GrandHeavy' color="#4218B5">Blocking Expired</Box>
          </Box>
        </Box>
      </Box>
    </>
  )
}

const ClockIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.5346 28.2435C15.3664 28.2426 16.1965 28.1666 17.0146 28.0163C17.6887 28.9218 18.5498 29.6716 19.5395 30.2146C20.5291 30.7577 21.6241 31.0812 22.75 31.1633C23.8759 31.2453 25.0062 31.084 26.0642 30.6902C27.1221 30.2964 28.0829 29.6794 28.8811 28.8812C29.6793 28.083 30.2963 27.1222 30.6901 26.0643C31.0839 25.0063 31.2452 23.876 31.1632 22.7501C31.0811 21.6242 30.7576 20.5292 30.2145 19.5396C29.6715 18.5499 28.9218 17.6888 28.0162 17.0147C28.5253 14.2435 28.1681 11.3828 26.9933 8.82184C25.8184 6.2609 23.8831 4.12415 21.4505 2.7024C19.018 1.28065 16.2064 0.642967 13.3986 0.876134C10.5907 1.1093 7.92281 2.20199 5.75809 4.0055C3.59337 5.809 2.03694 8.23571 1.30062 10.9554C0.564298 13.675 0.683858 16.5555 1.64303 19.2047C2.60219 21.854 4.35438 24.1434 6.66111 25.7613C8.96784 27.3792 11.7171 28.247 14.5346 28.2467V28.2435ZM23.309 17.3635C24.484 17.3635 25.6327 17.7119 26.6098 18.3645C27.5869 19.0172 28.3485 19.9449 28.7985 21.0304C29.2484 22.1158 29.3665 23.3103 29.1377 24.4629C28.9089 25.6154 28.3436 26.6742 27.5132 27.5056C26.6828 28.3369 25.6245 28.9033 24.4722 29.1333C23.32 29.3634 22.1253 29.2466 21.0394 28.7978C19.9534 28.349 19.0249 27.5884 18.3712 26.612C17.7175 25.6356 17.3679 24.4873 17.3666 23.3123C17.3683 21.736 17.9953 20.2247 19.1099 19.11C20.2246 17.9954 21.7359 17.3684 23.3122 17.3667L23.309 17.3635ZM8.47702 13.8083H13.7186V5.80831H15.6386V15.7283H8.47702V13.8083Z" fill="#4218B5"/>
  </svg>
)