import React, { useState } from "react";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, Text } from "shared/ui-kit";

import BlockNFTModal from "components/PriviDigitalArt/modals/BlockNFTModal";
import InstantBuyModal from "components/PriviDigitalArt/modals/InstantBuyModal";
import RentNFTModal from "components/PriviDigitalArt/modals/RentNFTModal";

import EditSellingPriceModal from "components/PriviDigitalArt/modals/EditSellingPriceModal";
import EditBlockingPriceModal from "components/PriviDigitalArt/modals/EditBlockingPriceModal";
import EditRentalPriceModal from "components/PriviDigitalArt/modals/EditRentalPriceModal";

import { exploreOptionDetailPageStyles } from "../../index.styles";

export default ({ isOwnership, img_id }) => {
  const classes = exploreOptionDetailPageStyles();
  const [openEditSellingPriceModal, setOpenEditSellingPriceModal] = useState<boolean>(false);
  const [openEditBlockingPriceModal, setOpenEditBlockingPriceModal] = useState<boolean>(false);
  const [openEditRentalPriceModal, setOpenEditRentalPriceModal] = useState<boolean>(false);
  const [openReserveNftModal, setOpenReserveNftModal] = useState<boolean>(false);
  const [openRentNFTModal, setOpenRentNFTModal] = useState<boolean>(false);
  const [openInstantModal, setOpenInstantModal] = useState<boolean>(false);

  const handleConfirmReserveNft = () => {
    setOpenReserveNftModal(false);
  };
  return (
    <>
      <Box display="flex">
        <Text
          style={{
            fontSize: "18px",
            color: "#1A1B1C",
            fontWeight: 800,
            fontFamily: "Agrandir GrandHeavy",
          }}
        >
          Instant Pricing Details
        </Text>
      </Box>
      <Box display="flex" alignItems="center" my={3.5}>
        <Text className={classes.pricingText1}>Selling Price:</Text>
        <Text className={classes.pricingText2}>10ETH</Text>
        <PrimaryButton
          size="small"
          className={classes.pricingButton}
          onClick={() => {
            if (isOwnership) {
              setOpenEditSellingPriceModal(true);
            } else {
              setOpenInstantModal(true);
            }
          }}
        >
          {isOwnership ? "EDIT" : "BUY"}
        </PrimaryButton>
      </Box>
      <hr className={classes.divider} />
      <Box display="flex" alignItems="center" mb={3.5} mt={2.5}>
        <Text className={classes.pricingText1}>Blocking Price:</Text>
        <Text className={classes.pricingText2}>1ETH for 90 Days</Text>
        <PrimaryButton
          size="small"
          className={classes.pricingButton}
          onClick={() => {
            if (isOwnership) {
              setOpenEditBlockingPriceModal(true);
            } else {
              setOpenReserveNftModal(true);
            }
          }}
        >
          {isOwnership ? "MAKE NEW OFFER" : "BLOCK"}
        </PrimaryButton>
      </Box>
      <hr className={classes.divider} />
      <Box display="flex" alignItems="center" my={3.5}>
        <Text className={classes.pricingText1}>Rental Price:</Text>
        <Text className={classes.pricingText2}>0.1ETH/day</Text>
        <PrimaryButton
          size="small"
          style={{
            background: "#fff",
            color: "#431AB7",
            padding: "0px 40px",
            fontSize: "16px",
            fontWeight: 700,
            lineHeight: "37px",
            border: "1px solid #431AB7",
            height: 37,
          }}
          onClick={() => {
            if (isOwnership) {
              setOpenEditRentalPriceModal(true);
            } else {
              setOpenRentNFTModal(true);
            }
          }}
        >
          {isOwnership ? "EDIT" : "RENT"}
        </PrimaryButton>
      </Box>
      <hr className={classes.divider} />
      <BlockNFTModal
        open={openReserveNftModal}
        handleClose={() => setOpenReserveNftModal(false)}
        onConfirm={handleConfirmReserveNft}
        img_url={img_id}
      />
      <RentNFTModal
        open={openRentNFTModal}
        handleClose={() => setOpenRentNFTModal(false)}
        onConfirm={() => setOpenRentNFTModal(false)}
      />
      <InstantBuyModal
        open={openInstantModal}
        handleClose={() => setOpenInstantModal(false)}
        onConfirm={() => setOpenInstantModal(false)}
      />
      <EditSellingPriceModal
        open={openEditSellingPriceModal}
        handleClose={() => setOpenEditSellingPriceModal(false)}
        onConfirm={() => setOpenEditSellingPriceModal(false)}
      />
      <EditBlockingPriceModal
        open={openEditBlockingPriceModal}
        handleClose={() => setOpenEditBlockingPriceModal(false)}
        onConfirm={() => setOpenEditBlockingPriceModal(false)}
        nftDetailData={{ tokenId: 21, nftAddress: "0x28e041c8fdbb8ef06e638c30a833c2e97e629002" }}
      />
      <EditRentalPriceModal
        open={openEditRentalPriceModal}
        handleClose={() => setOpenEditRentalPriceModal(false)}
        onConfirm={() => setOpenEditRentalPriceModal(false)}
      />
    </>
  );
};
