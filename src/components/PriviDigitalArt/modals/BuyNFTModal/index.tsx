import React from "react";

import { useHistory } from "react-router-dom";

import { useTypedSelector } from "store/reducers/Reducer";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { buyNFTModalStyles } from "./index.styles";
import { roundFloat } from "shared/helpers/number";

type BuyNFTModalProps = {
  open: boolean;
  handleClose: () => void;
  handleRefresh: () => void;
  handleSwitchPlaceOffer: () => void;
  handleBuyFromSellingOffer: () => void;
  media?: any;
  isFromExchange?: boolean;
};

const BuyNFTModal: React.FunctionComponent<BuyNFTModalProps> = ({
  open,
  handleClose,
  handleSwitchPlaceOffer,
  handleBuyFromSellingOffer,
  media,
  isFromExchange = false,
}) => {
  const classes = buyNFTModalStyles();
  const { showAlertMessage } = useAlertMessage();
  const history = useHistory();
  const userBalances = useTypedSelector(state => state.userBalances);
  const { convertTokenToUSD } = useTokenConversion();

  const handleNFTPage = () => {
    history.push(`/media/sale/${media.id}`);
  };

  const handleBuy = () => {
    if (validate()) {
      handleBuyFromSellingOffer();
    }
  };

  const validate = () => {
    if (!media || !media.id || !media.initialAmount || !media.offerToken || !media.price) {
      showAlertMessage("Media exchange data error", { variant: "error" });
      return false;
    } else if (!userBalances[media.offerToken] || userBalances[media.offerToken].Balance < media.price) {
      showAlertMessage(`Insufficient ${media.offerToken} funds`, { variant: "error" });
      return false;
    }
    return true;
  };

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} className={classes.modal} showCloseIcon={true}>
      <div className={classes.modalContent}>
        <div className={classes.content}>
          <h2>Buy NFT</h2>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h3>Item</h3>
              <div className={classes.nftInfo}>
                <img src={media.media.content_url} />
                <h2>{media && media.media.metadata?.name}</h2>
              </div>
            </div>
            <div>
              <h3>Price</h3>
              <div className={classes.flexCol}>
                <h5>
                  {media &&
                    `${convertTokenToUSD(media.offerToken, media.price).toFixed()} ${media.offerToken}`}
                </h5>
                <div>{media && `($${roundFloat(convertTokenToUSD(media.offerToken, media.price), 4)})`}</div>
              </div>
            </div>
          </div>
          <div className={classes.divider} />
          <p className={classes.nftDesc}>{media && media.media.metadata?.description}</p>
          <div className={classes.actionButtons}>
            <SecondaryButton
              size="medium"
              className={classes.secondary}
              onClick={() => {
                if (isFromExchange) handleClose();
                else handleNFTPage();
              }}
            >
              NFT Page
            </SecondaryButton>
            <div>
              <PrimaryButton
                size="medium"
                onClick={handleSwitchPlaceOffer}
                className={classes.primary}
                style={{ background: "#431AB7" }}
              >
                Place a Different Offer
              </PrimaryButton>
              <PrimaryButton
                size="medium"
                onClick={handleBuy}
                className={classes.primary}
                style={{ background: "#431AB7" }}
              >
                Buy
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default BuyNFTModal;
