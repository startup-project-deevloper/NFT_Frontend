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
  const [price, setPrice] = useState<string>(media?.ExchangeData?.Price ?? 0);
  const [selectedToken, setSelectedToken] = useState<string>("PRIVI");
  const [tokenList, setTokenList] = useState<any[]>([]);
  const [rateOfChange, setRateOfChange] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);

  const payloadRef = useRef<any>({});
  // const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  // const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

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

  const handleOpenSignatureModal = () => {
    if (validate()) {
      const payload: IPlaceOffer = {
        ExchangeId: media.ExchangeData.Id,
        Address: user.address,
        Amount: media.ExchangeData.InitialAmount,
        Price: price,
        OfferToken: selectedToken,
      };
      payloadRef.current = payload;

      const netType = media.BlockchainNetwork;
      if (netType === BlockchainNets[0].value) {
        // PLACE BUY OFFER ON PRIVI CHAIN
        placeOfferOnPrivi();
      } else if (netType === BlockchainNets[1].value) {
        // PLACE BUY OFFER ON POLYGON CHAIN
        placeOfferOnPolygon();
      }
    }
  };

  const placeOfferOnPrivi = async () => {
    try {
      const payload = payloadRef.current;
      if (Object.keys(payload).length) {
        setLoading(true);
        const resp = await placeBuyingOffer(user.address, payload, {});
        onAfterPlaceBuyOffer(resp);
      }
    } catch (e) {
      setLoading(false);
      showAlertMessage("Offer placing failed: " + e, { variant: "error" });
    }
  };

  const placeOfferOnPolygon = async () => {
    setLoading(true);
    const payload = payloadRef.current;
    const web3 = new Web3(library.provider);

    const placeOfferRequest = {
      input: {
        exchangeId: media.ExchangeData.Id,
        tokenId: media.ExchangeData.TokenId,
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
            ExchangeId: media.ExchangeData.Id,
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
    } else if (!media || !media.ExchangeData || !media.ExchangeData.Id || !media.ExchangeData.InitialAmount) {
      showAlertMessage(`Media exchange data error`, { variant: "error" });
      return false;
    }
    return true;
  };

  return (
    <LoadingScreen
      loading={loading}
      title={`Transaction \nin progress`}
      subTitle={`Transaction is proceeding on ${
        media.BlockchainNetwork || media.blockchain || "Polygon"
      }.\nThis can take a moment, please be patient...`}
      handleClose={() => {}}
    >
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
            <h2>Place Buying Offer</h2>
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
                      ? formatNumber(
                          media?.ExchangeData?.Price ?? 0,
                          media?.ExchangeData?.OfferToken ?? "USDT",
                          4
                        )
                      : ""}
                  </h5>
                  <span>
                    {media && media.ExchangeData && !["Sold", "Cancelled"].includes(media.ExchangeData.Status)
                      ? formatNumber(
                          Math.floor(
                            (rateOfChange[media.ExchangeData.OfferToken] ?? 1) * media?.ExchangeData?.Price ??
                              0
                          ),
                          "$",
                          4
                        )
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
                onClick={handleOpenSignatureModal}
              >
                Place Buying Order
              </PrimaryButton>
            </div>
          </div>
        </div>
      </Modal>
    </LoadingScreen>
  );
};

export default PlaceBuyingOfferModal;
