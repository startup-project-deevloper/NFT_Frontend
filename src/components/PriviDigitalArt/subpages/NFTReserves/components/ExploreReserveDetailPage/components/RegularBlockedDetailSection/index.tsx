import React, { useState } from "react";
import Box from "shared/ui-kit/Box";
import { Text, SecondaryButton, PrimaryButton } from "shared/ui-kit";
import PayRemainingAmountModal from "components/PriviDigitalArt/modals/PayRemainingAmountModal";

import { exploreOptionDetailPageStyles } from "../../index.styles";

export default () => {
  const classes = exploreOptionDetailPageStyles();
  const [openPayRemainingAmountModal, setOpenPayRemainingAmountModal] = useState(false);

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
        <Box
          display="flex"
          flexDirection="column"
          flex={0.4}
          style={{ borderRight: "1px solid #9EACF220", fontSize: 14 }}
        >
          <Box color="#431AB7">Block Time</Box>
          <Box style={{ fontSize: 18 }}>20 days (15.11.2021)</Box>
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          flex={0.3}
          pl={5}
          style={{ borderRight: "1px solid #9EACF220", fontSize: 14 }}
        >
          <Box color="#431AB7">Collateral</Box>
          <Box style={{ fontSize: 18 }}>20 %</Box>
        </Box>
        <Box flex={0.3} pl={5}>
          <SecondaryButton size="medium">Check Orderbook</SecondaryButton>
        </Box>
      </Box>
      <Box mt={4} className={classes.BlockedDetailSection} padding="20px">
        <Box fontFamily="Agrandir GrandHeavy" fontSize={14}>
          Blocking payment:
        </Box>
        <Box mt={1} fontSize={14}>
          Your offer was accepted by the owner. You need to{" "}
          <b>pay remaining amount to buy the NFT at Future price before end of countdown</b> otherwise you
          will loose your collateral.
        </Box>
        <Box flex={1} mt="27px" display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" flexDirection="column" flex={0.3}>
            <Box fontSize={14}>Future price</Box>
            <Box color="#431AB7" fontFamily="Agrandir GrandHeavy" fontSize={18}>
              2545 USDT
            </Box>
          </Box>
          <Box display="flex" alignItems="center" flex={0.5} justifyContent="flex-end">
            <Box fontSize={14} textAlign="center" width="48px" mr="11px">
              Time to pay
            </Box>
            <Box className={classes.time}>4 Days</Box>
            <Box className={classes.time}>22 h</Box>
            <Box className={classes.time}>12 min</Box>
          </Box>
        </Box>
        <PrimaryButton
          size="medium"
          style={{
            width: "100%",
            height: 52,
            backgroundColor: "#431AB7",
            marginTop: 14,
            textTransform: "uppercase",
          }}
          onClick={() => {
            setOpenPayRemainingAmountModal(true);
          }}
        >
          PAY REMAINING AMOUNT
        </PrimaryButton>
        <PayRemainingAmountModal
          open={openPayRemainingAmountModal}
          handleClose={() => setOpenPayRemainingAmountModal(false)}
          onConfirm={() => {}}
        />
      </Box>
    </>
  );
};
