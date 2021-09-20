import React, { useState, useRef } from "react";
import axios from "axios";
import Web3 from "web3";

import { useHistory } from "react-router-dom";
import { useWeb3React } from "@web3-react/core";

import URL from "shared/functions/getURL";
import { useTypedSelector } from "store/reducers/Reducer";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { BlockchainNets } from "shared/constants/constants";
import { buyFromOffer, IBuySellFromOffer } from "shared/services/API";
import PolygonAPI from "shared/services/API/polygon";
// import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
// import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { buyNFTModalStyles } from "./index.styles";

type BuyNFTModalProps = {
  open: boolean;
  handleClose: () => void;
  handleRefresh: () => void;
  handleSwitchPlaceOffer: () => void;
  media?: any;
  isFromExchange?: boolean;
};

const BuyNFTModal: React.FunctionComponent<BuyNFTModalProps> = ({
  open,
  handleClose,
  handleRefresh,
  handleSwitchPlaceOffer,
  media,
  isFromExchange = false,
}) => {
  const classes = buyNFTModalStyles();
  const { showAlertMessage } = useAlertMessage();
  const history = useHistory();
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);
  const { convertTokenToUSD } = useTokenConversion();

  const payloadRef = useRef<any>({});
  // const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  // const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  const { account, library, chainId } = useWeb3React();

  const handleNFTPage = () => {
    history.push(`/media/sale/${media.MediaSymbol ?? media.id}`);
  };

  const handleOpenSignatureModal = () => {
    if (validate()) {
      const payload: IBuySellFromOffer = {
        ExchangeId: media.ExchangeData.Id,
        OfferId: media.ExchangeData.Id,
        Address: user.address,
        Amount: media.ExchangeData.InitialAmount,
      };
      payloadRef.current = payload;
      
      try {
        const netType = media.BlockchainNetwork;
        if (netType === BlockchainNets[0].value) {
          // BUY FROM OFFER ON PRIVI
          buyFromOfferOnPrivi();
        } else if (netType === BlockchainNets[1].value) {
          // BUY FROM OFFER ON POLYGON
          buyFromOfferOnPolygon();
        }
      } catch (e) {
        showAlertMessage("Purchase failed: " + e, { variant: "error" });
      }
    }
  };

  const buyFromOfferOnPrivi = async () => {
    const payload = payloadRef.current;
    if (Object.keys(payload).length) {
      const resp = await buyFromOffer(user.address, payload, {
        MediaSymbol: media.MediaSymbol,
        MediaType: media?.Type,
      });
      onAfterBuyFromOffer(resp);
    }
  };
  const buyFromOfferOnPolygon = async () => {
    const web3 = new Web3(library.provider);

    const offerRequest = {
      input: {
        exchangeId: media.ExchangeData.Id,
        offerId: media.ExchangeData.InitialOfferId,
      },
      caller: account!,
    };

    PolygonAPI.Exchange.BuyERC721TokenFromOffer(web3, account!, offerRequest).then(async res => {
      if (res) {
        const tx = res.transaction;
        const blockchainRes = { output: { Transactions: {} } };
        blockchainRes.output.Transactions[tx.Id] = [tx];
        const body = {
          BlockchainRes: blockchainRes,
          AdditionalData: {
            Address: user.address,
            ExchangeId: offerRequest.input.exchangeId,
            OfferId: offerRequest.input.offerId,
          },
        };
        const response = await axios.post(`${URL()}/exchange/buyFromOffer/v2_p`, body);
        onAfterBuyFromOffer(response.data);
      }
    });
  };

  const onAfterBuyFromOffer = async resp => {
    if (resp && resp.success) {
      showAlertMessage("Purchased successfully", { variant: "success" });
      setTimeout(() => {
        handleRefresh();
        handleClose();
      }, 1000);
    } else showAlertMessage("Purchase failed", { variant: "error" });
  };
  const validate = () => {
    if (
      !media ||
      !media.ExchangeData ||
      !media.ExchangeData.Id ||
      !media.ExchangeData.InitialAmount ||
      !media.ExchangeData.OfferToken ||
      !media.ExchangeData.Price
    ) {
      showAlertMessage("Media exchange data error", { variant: "error" });
      return false;
    } else if (
      !userBalances[media.ExchangeData.OfferToken] ||
      userBalances[media.ExchangeData.OfferToken].Balance < media.ExchangeData.Price
    ) {
      showAlertMessage(`Insufficient ${media.ExchangeData.OfferToken} funds`, { variant: "error" });
      return false;
    }
    return true;
  };

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} className={classes.modal} showCloseIcon={true}>
      {/* <SignatureRequestModal
        open={openSignRequestModal}
        address={user.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={handleConfirmSign}
        handleClose={() => setOpenSignRequestModal(false)}
      /> */}
      <div className={classes.modalContent}>
        <div className={classes.content}>
          <h2>Buy NFT</h2>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <h3>Item</h3>
              <div className={classes.nftInfo}>
                <img src={media.Type === "VIDEO_TYPE" ? media.UrlMainPhoto : media.Url} />
                <h2>{media && media.MediaName}</h2>
              </div>
            </div>
            <div>
              <h3>Price</h3>
              <div className={classes.flexCol}>
                <h5>
                  {media && media.ExchangeData && !["Sold", "Cancelled"].includes(media.ExchangeData.Status)
                    ? `${convertTokenToUSD(
                        media.ExchangeData.OfferToken,
                        media.ExchangeData.Price
                      ).toFixed()}`
                    : ""}
                </h5>
                <div>
                  {media && media.ExchangeData && !["Sold", "Cancelled"].includes(media.ExchangeData.Status)
                    ? `$${convertTokenToUSD(media.ExchangeData.OfferToken, media.ExchangeData.Price).toFixed(
                        4
                      )}`
                    : ""}
                </div>
              </div>
            </div>
          </div>
          <div className={classes.divider} />
          <p className={classes.nftDesc}>{media && media.MediaDescription}</p>
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
                onClick={handleOpenSignatureModal}
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
