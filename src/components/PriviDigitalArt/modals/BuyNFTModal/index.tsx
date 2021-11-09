import React from "react";

import { useHistory } from "react-router-dom";

import { useTypedSelector } from "store/reducers/Reducer";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { buyNFTModalStyles } from "./index.styles";

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
    history.push(`/media/sale/${media.MediaSymbol ?? media.id}`);
  };

  const handleBuy = () => {
    if (validate()) {
      handleBuyFromSellingOffer();
    }
  };

  const validate = () => {
    if (
      !media ||
      !media.exchange ||
      !media.exchange.id ||
      !media.exchange.initialAmount ||
      !media.exchange.offerToken ||
      !media.exchange.price
    ) {
      showAlertMessage("Media exchange data error", { variant: "error" });
      return false;
    } else if (
      !userBalances[media.exchange.offerToken] ||
      userBalances[media.exchange.offerToken].Balance < media.exchange.price
    ) {
      showAlertMessage(`Insufficient ${media.exchange.offerToken} funds`, { variant: "error" });
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
                <img src={media.content_url} />
                <h2>{media && media.metadata?.name}</h2>
              </div>
            </div>
            <div>
              <h3>Price</h3>
              <div className={classes.flexCol}>
                <h5>
                  {media && media.exchange
                    ? `${convertTokenToUSD(media.exchange.offerToken, media.exchange.price).toFixed()}`
                    : ""}
                </h5>
                <div>
                  {media && media.exchange
                    ? `$${convertTokenToUSD(media.exchange.offerToken, media.exchange.price).toFixed(4)}`
                    : ""}
                </div>
              </div>
            </div>
          </div>
          <div className={classes.divider} />
          <p className={classes.nftDesc}>{media && media.metadata?.description}</p>
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
