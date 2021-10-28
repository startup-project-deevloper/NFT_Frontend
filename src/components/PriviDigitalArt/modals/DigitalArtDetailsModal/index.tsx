import React from "react";

import AuctionInfo from "./AuctionInfo";
import MarketActivity from "./MarketActivity";
import OwnershipHistory from "./OwnershipHistory";
import ProofAuthenticity from "./ProofAuthenticity";
import PriceHistory from "./PriceHistory";

import { Header4, Modal, TabNavigation } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

const AuctionTabs = [
  "Auction Info",
  "Price History",
  "Market activity",
  "Ownership History",
  "Proof of authenticity",
];

const ExchangeTabs = ["Price History", "Market activity", "Proof of authenticity"];

export default function DigitalArtDetailsModal({ open, handleClose, media, makeOffer }) {
  const [tabIndex, setTabIndex] = React.useState<number>(0);

  if (media?.auction)
    return (
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
        <Box>
          <Header4>Details</Header4>
          <TabNavigation
            tabs={AuctionTabs}
            currentTab={tabIndex}
            variant="primary"
            onTabChange={setTabIndex}
            size="small"
          />
          <Box mt={4}>
            {tabIndex === 0 && <AuctionInfo media={media} makeOffer={makeOffer} />}
            {tabIndex === 1 && <PriceHistory media={media} makeOffer={makeOffer} />}
            {tabIndex === 2 && <MarketActivity media={media} />}
            {tabIndex === 3 && <OwnershipHistory media={media} />}
            {tabIndex === 4 && <ProofAuthenticity media={media} />}
          </Box>
        </Box>
      </Modal>
    );
  else if (media?.exchange)
    return (
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
        <Box>
          <Header4>Details</Header4>
          <TabNavigation
            tabs={ExchangeTabs}
            currentTab={tabIndex}
            variant="primary"
            onTabChange={setTabIndex}
            size="small"
          />
          <Box mt={4}>
            {tabIndex === 0 && <PriceHistory media={media} makeOffer={makeOffer} />}
            {tabIndex === 1 && <MarketActivity media={media} />}
            {tabIndex === 2 && <ProofAuthenticity media={media} />}
          </Box>
        </Box>
      </Modal>
    );
  else return null;
}
