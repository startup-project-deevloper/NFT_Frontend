import React, { useState, useEffect } from "react";
import axios from "axios";

import { useTypedSelector } from "store/reducers/Reducer";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { Modal, PrimaryButton } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { placeBuyingOfferModalStyles } from "./index.styles";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";

type PlaceBuyingOfferModalProps = {
  open: boolean;
  handleClose: () => void;
  handlePlaceBuyingOffer: (price: number) => void;
  media?: any;
};

const PlaceBuyingOfferModal: React.FunctionComponent<PlaceBuyingOfferModalProps> = ({
  open,
  handleClose,
  handlePlaceBuyingOffer,
  media = null,
}) => {
  const classes = placeBuyingOfferModalStyles();
  const { showAlertMessage } = useAlertMessage();
  const [price, setPrice] = useState<string>(media?.exchange?.price ?? 0);
  const [selectedToken, setSelectedToken] = useState<string>("PRIVI");
  const [tokenList, setTokenList] = useState<any[]>([]);
  const { convertTokenToUSD } = useTokenConversion();

  useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
      const resp = res.data;
      if (resp.success) {
        const data = resp.data;
        const newTokenList: any[] = [];
        data.forEach(obj => {
          newTokenList.push({ name: obj.name, token: obj.token });
        });
        if (newTokenList.length > 0) setSelectedToken(media.exchange.offerToken);
        setTokenList(newTokenList);
      }
    });
  }, [media]);

  const handlePlace = async () => {
    if (validate()) {
      handlePlaceBuyingOffer(+price);
    }
  };

  const validate = (): boolean => {
    if (!selectedToken) {
      showAlertMessage("No token selected", { variant: "error" });
      return false;
    } else if (!media || !media.exchange || !media.exchange.exchangeId || !media.exchange.initialAmount) {
      showAlertMessage(`Media exchange data error`, { variant: "error" });
      return false;
    }
    return true;
  };

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} className={classes.modal} showCloseIcon={true}>
      <div className={classes.modalContent}>
        <div className={classes.content}>
          <h2>Place Buying Offer</h2>
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
                <span>
                  {media && media.exchange
                    ? `$${convertTokenToUSD(media.exchange.offerToken, media.exchange.price).toFixed(4)}`
                    : ""}
                </span>
              </div>
            </div>
          </div>
          <div className={classes.divider} />
          <div className={classes.offerInputWrapper}>
            <div
              className={classes.inputPrice}
              style={{ width: "100%", marginLeft: "24px", marginRight: "24px" }}
            >
              <InputWithLabelAndTooltip
                type="number"
                inputValue={price}
                placeHolder="0.00"
                onInputValueChange={e => setPrice(e.target.value)}
                required
                style={{ marginTop: 0, marginBottom: 0, height: "50px", width: "100%" }}
              />
            </div>
            <div className={classes.tokenSelect} style={{ width: "100%" }}>
              <TokenSelect
                value={selectedToken}
                onChange={event => setSelectedToken(event.target.value)}
                tokens={tokenList}
              />
            </div>
          </div>
          <div className={classes.divider} />
          <p className={classes.nftDesc}>{media && media.MediaDescription}</p>
          <div className={classes.actionButtons}>
            <PrimaryButton
              size="medium"
              style={{ background: "#431AB7" }}
              className={classes.primary}
              onClick={handlePlace}
            >
              Place Buying Order
            </PrimaryButton>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PlaceBuyingOfferModal;
