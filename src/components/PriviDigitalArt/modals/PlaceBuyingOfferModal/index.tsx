import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Web3 from "web3";

import { useWeb3React } from "@web3-react/core";
import { useTypedSelector } from "store/reducers/Reducer";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { Modal, PrimaryButton } from "shared/ui-kit";
import { formatNumber /* handleSetStatus, buildJsxFromObject */ } from "shared/functions/commonFunctions";
import URL from "shared/functions/getURL";
// import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { placeBuyingOffer, IPlaceOffer } from "shared/services/API";
import PolygonAPI from "shared/services/API/polygon";
import PolygonConfig from "shared/connectors/polygon/config";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { BlockchainTokenSelect } from "shared/ui-kit/Select/BlockchainTokenSelect";
import { BlockchainNets } from "shared/constants/constants";
import { placeBuyingOfferModalStyles } from "./index.styles";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";

type PlaceBuyingOfferModalProps = {
  open: boolean;
  handleClose: () => void;
  handleRefresh: () => void;
  media?: any;
};

const PlaceBuyingOfferModal: React.FunctionComponent<PlaceBuyingOfferModalProps> = ({
  open,
  handleClose,
  handleRefresh,
  media = null,
}) => {
  const classes = placeBuyingOfferModalStyles();
  const { showAlertMessage } = useAlertMessage();
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);
  const [price, setPrice] = useState<string>(media?.exchange?.price ?? 0);
  const [selectedToken, setSelectedToken] = useState<string>("PRIVI");
  const [tokenList, setTokenList] = useState<any[]>([]);
  const [rateOfChange, setRateOfChange] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const { convertTokenToUSD } = useTokenConversion();

  const payloadRef = useRef<any>({});

  const [blockChain, setBlockChain] = useState<any>(BlockchainNets[0].name);

  const { account, library, chainId } = useWeb3React();

  useEffect(() => {
    axios.get(`${URL()}/wallet/getCryptosRateAsList`).then(res => {
      const resp = res.data;
      if (resp.success) {
        const data = resp.data;
        const newRateOfChange: any = {};
        const newTokenList: any[] = [];
        data.forEach(obj => {
          newTokenList.push({ name: obj.name, token: obj.token });
          newRateOfChange[obj.token] = obj.rate;
        });
        if (newTokenList.length > 0) setSelectedToken(newTokenList[0].token);
        setRateOfChange(newRateOfChange);
        setTokenList(newTokenList);
      }
    });
  }, []);

  const handlePlaceBuyingOffer = async () => {
    setLoading(true);
    const payload = payloadRef.current;
    const web3 = new Web3(library.provider);

    const placeOfferRequest = {
      input: {
        exchangeId: media.exchange.exchangeId,
        tokenId: media.token_id,
        price: price,
      },
      caller: account!,
    };

    PolygonAPI.Exchange.PlaceERC721TokenBuyingOffer(web3, account!, placeOfferRequest).then(async res => {
      if (res) {
        const offerId = res.data.offerId;
        const tx = res.transaction;
        const blockchainRes = { output: { UpdateOffers: {}, Transactions: {} } };
        blockchainRes.output.UpdateOffers[offerId] = { ...payload, Id: offerId };
        blockchainRes.output.Transactions[tx.Id] = [tx];
        const body = {
          BlockchainRes: blockchainRes,
          AdditionalData: {
            ExchangeId: media.exchange.exchangeId,
          },
        };

        const response = await axios.post(`${URL()}/exchange/placeBuyingOffer/v2_p`, body);
        onAfterPlaceBuyOffer(response.data);
      }
    });
  };

  const onAfterPlaceBuyOffer = (resp: any) => {
    setLoading(false);
    if (resp && resp.success) {
      showAlertMessage("Offer placed successfully", { variant: "success" });
      setTimeout(() => {
        handleRefresh();
        handleClose();
      }, 1000);
    } else showAlertMessage("Offer placing failed", { variant: "error" });
  };

  const validate = (): boolean => {
    if (!selectedToken) {
      showAlertMessage("No token selected", { variant: "error" });
      return false;
    } else if (!userBalances[selectedToken] || userBalances[selectedToken].Balance < Number(price)) {
      showAlertMessage(`Insufficient ${selectedToken} balance`, { variant: "error" });
      return false;
    } else if (!media || !media.exchange || !media.exchange.Id || !media.exchange.initialAmount) {
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
            <div className={classes.borderBox} style={{ width: "100%" }}>
              <BlockchainTokenSelect
                network={blockChain}
                setNetwork={setBlockChain}
                BlockchainNets={BlockchainNets}
                isReverse
              />
            </div>
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
              onClick={handlePlaceBuyingOffer}
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
