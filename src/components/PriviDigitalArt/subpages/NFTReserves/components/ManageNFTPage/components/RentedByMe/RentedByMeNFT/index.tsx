import React from 'react'
import Box from 'shared/ui-kit/Box'

import { RentedByMeNFTStyles } from './index.styles'
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon-white.svg";

const isProd = process.env.REACT_APP_ENV === "prod";
export default ({ item }) => {
  const classes = RentedByMeNFTStyles();
  
  const handleOpenAddress = () => {
    window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${item.address}`, "_blank");
  }

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
        pt={1}
        height="96px"
      >
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box className={classes.nftName}>{item.nftName}</Box>
          <Box
            className={classes.address}
          >
            Address: {item.address.substr(0, 18) + "..." + item.address.substr(item.address.length - 3, 3)}
            <span onClick={handleOpenAddress}>
              <CopyIcon />
            </span>
          </Box>
        </Box>
        
        <Box display="flex" alignItems="center" flex={1}>
          <Box display="flex" flexDirection="column" flex={0.25} className={classes.section}>
            <Box className={classes.header}>Rental Price</Box>
            <Box>
              {item.rentalPrice} USDT
            </Box>
          </Box>
          <Box display="flex" flexDirection="column" flex={0.25} pl={6} className={classes.section}>
            <Box className={classes.header}>Total Paid</Box>
            <Box>
              {item.totalPaid} USDT
            </Box>
          </Box>
          <Box flex={0.5} pl={6} display="flex" alignItems="center">
            <Box className={classes.header} mr={3}>Remaining Rental Time</Box>
            <span className={classes.time}>4 Days</span>
            <span className={classes.time}>22 h</span>
            <span className={classes.time}>12 mi</span>
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