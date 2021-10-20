import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { makeStyles, Divider } from "@material-ui/core";
import { RootState } from "store/reducers/Reducer";
import Box from "shared/ui-kit/Box";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { Avatar, Modal, PrimaryButton } from "shared/ui-kit";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { getCryptosRateAsList, newBuyOrder, newSellOrder } from "shared/services/API";
// import { SignatureRequestModal } from "shared/ui-kit";
// import { buildJsxFromObject } from "shared/functions/commonFunctions";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";

const useStyles = makeStyles(() => ({
  modalContainer: {
    padding: "32px 16px !important",
  },
  title: {
    fontWeight: 800,
    fontSize: 14,
    lineHeight: "18px",
    fontFamily: "Agrandir",
    color: "#000000",
    borderBottom: "1px solid #EFF2F8",
    paddingBottom: 20,
  },
  digitalArt: {
    fontWeight: 400,
    fontSize: 18,
    lineHeight: "104.5%;",
    fontFamily: "Agrandir",
    margin: "16px 0",
    color: "#181818",
  },
  divider: {
    opacity: 0.2,
    background: "#707582",
    border: "1px solid #707582",
    transform: "rotate(90deg)",
  },
  currentPrice: {
    fontWeight: 800,
    fontSize: "18px",
    lineHeight: "104.5%",
    color: "#181818",
  },
  fractionaliseButton: {
    background: "#181818",
    color: "white",
    fontSize: "22.8px",
    height: "56px",
    fontWeight: 700,
    fontFamily: "Agrandir",
    lineHeight: "30px",
    borderRadius: "14px",
    width: "100%",
    marginTop: "40px",
    marginBottom: "40px",
    textTransform: "none",
  },
  roundInputBox: {
    background: "#F7F9FE",
    border: "1px solid #707582",
    boxSizing: "border-box",
    borderRadius: "11.36px",
    width: "100%",
  },
  userInfo: {
    color: "#A4A4A4",
    lineHeight: "120%",
    fontSize: 14,
    margin: 0,
  },
  contractAddress: {
    color: "#431AB7",
    lineHeight: "120%",
    fontSize: 14,
    margin: 0,
  },
  tokenName: {
    fontSize: "18px",
    lineHeight: "104.5%",
    color: "#181818",
  },
  tokenImg: {
    width: "24px",
    height: "24px",
  },
  pText: {
    fontSize: 14,
    lineHeight: "120%",
    color: "#1A1B1C",
    margin: 0,
  },
  labelTitle1: {
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "170%",
    color: "#431AB7",
    margin: 0,
  },
  labelPrice: {
    fontWeight: 800,
    fontSize: "18px",
    lineHeight: "170%",
    color: "#431AB7",
    margin: 0,
  },
  labelTitle2: {
    fontWeight: 400,
    fontSize: "18px",
    lineHeight: "18px",
    color: "#181818",
    marginBottom: "6px",
  },
  labelDescription: {
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "120%",
    color: "#707582",
    margin: 0,
  },
  orderButton: {
    background: "#431AB7 !important",
    width: "145px !important",
    height: "34px !important",
    borderRadius: "4px !important",
    fontSize: "14px !important",
    lineHeight: "34px !important",
  },
}));

const CreateOfferModal = ({ open, handleClose, handleRefresh, media, offerType }) => {
  const classes = useStyles();

  const user = useSelector((state: RootState) => state.user);
  const userBalances = useSelector((state: RootState) => state.userBalances);
  const { showAlertMessage } = useAlertMessage();
  const [tokenList, setTokenList] = useState<string[]>([]);
  const [selectedToken, setSelectedToken] = useState("");
  const [selectedFraction, setSelectedFraction] = useState<number>(0.5);
  const [selectedPrice, setSelectedPrice] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  // const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);
  const payloadRef = useRef<any>();

  useEffect(() => {
    getCryptosRateAsList().then(resp => {
      const tokenList: string[] = []; // list of tokens
      resp.forEach(rateObj => {
        tokenList.push(rateObj.token);
      });
      setSelectedToken(tokenList[0]);
      setTokenList(tokenList);
    });
  }, []);

  const handleOpenSignatureModal = () => {
    if (selectedFraction && selectedToken && selectedPrice && media.MediaSymbol && user.address) {
      let payload;
      if (offerType == "buy") {
        payload = {
          Amount: selectedFraction,
          Price: selectedPrice,
          Token: selectedToken,
          TokenSymbol: media.MediaSymbol,
          BAddress: user.address,
        };
      } else {
        payload = {
          Amount: selectedFraction,
          Price: selectedPrice,
          Token: selectedToken,
          TokenSymbol: media.MediaSymbol,
          SAddress: user.address,
        };
      }
      if (payload) {
        payloadRef.current = payload;
        // setSignRequestModalDetail(buildJsxFromObject(payload));
        // setOpenSignRequestModal(true);
        handleOk();
      }
    } else showAlertMessage("Some data is incorrect", { variant: "error" });
  };

  const handleOk = () => {
    const payload = payloadRef.current;
    if (payload) {
      if (offerType == "buy") {
        setLoading(true);
        newBuyOrder(user.address, payload, { MediaType: media.Type })
          .then(resp => {
            setLoading(false);
            if (resp?.success) {
              showAlertMessage("Buy order placed", { variant: "success" });
              handleRefresh();
              handleClose();
            } else showAlertMessage("Buy order failed", { variant: "error" });
          })
          .finally(() => {
            setLoading(false);
          });
      } else {
        newSellOrder(user.address, payload, { MediaType: media.Type })
          .then(resp => {
            setLoading(false);
            if (resp?.success) {
              showAlertMessage("Sell order placed", { variant: "success" });
              handleRefresh();
              handleClose();
            } else showAlertMessage("Sell order failed", { variant: "error" });
          })
          .finally(() => {
            setLoading(false);
          });
      }
    }
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
      <Modal
        className={classes.modalContainer}
        size="small"
        isOpen={open}
        onClose={() => handleClose()}
        showCloseIcon
      >
        {/* <SignatureRequestModal
        open={openSignRequestModal}
        address={user.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={handleOk}
        handleClose={() => setOpenSignRequestModal(false)}
      /> */}
        <Box>
          <Box className={classes.title}>Create {offerType == "buy" ? "Buying" : "Selling"} Offer</Box>
          <Box className={classes.digitalArt}>{media.MediaName}</Box>
          <Box display="flex" alignItems="center">
            <Avatar
              size="medium"
              url={
                media.CreatorAddress == user.address
                  ? user.url ?? getRandomAvatarForUserIdWithMemoization("1")
                  : media.CreatorImageUrl ?? getRandomAvatarForUserIdWithMemoization("1")
              }
              alt=""
            />
            <Box display="flex" flexDirection="column" justifyContent="center" ml={1}>
              <p className={classes.pText}>Owned by</p>
              <p className={classes.userInfo}>
                {media.CreatorAddress == user.address ? "You" : media.CreatorName}
              </p>
            </Box>
          </Box>
          <Box display="flex" gridColumnGap={5} mt={2}>
            <p className={classes.pText}>Contract Address:</p>
            <p className={classes.contractAddress}>{media.FundsAddress}</p>
          </Box>
          <Box display="flex" gridColumnGap={5} mt={2} mb={2}>
            <p className={classes.pText}>Token ID:</p>
            <p className={classes.contractAddress}>{media.MediaSymbol}</p>
          </Box>
          <Divider />
          {offerType == "sell" && (
            <Box display="flex" mt={2} mb={2}>
              <Box width={1}>
                <Box flexDirection="row" gridRowGap={16}>
                  <p className={classes.labelTitle1}>Fraction Ownership</p>
                  <p className={classes.labelPrice}>
                    {userBalances[media.MediaSymbol] ? userBalances[media.MediaSymbol].Balance * 100 : 0}%
                  </p>
                </Box>
              </Box>
            </Box>
          )}
          {offerType == "sell" && <Divider />}
          <Box mt={2} display="flex" justifyContent="space-between" gridColumnGap={8}>
            <Box width={1}>
              <Box flexDirection="row">
                <p className={classes.pText}>Fractions To {offerType == "buy" ? "Buy" : "Sell"}</p>
                <p className={classes.labelDescription}>Fraction of the token expressed as %</p>
              </Box>
            </Box>
            <Box width={1}>
              <InputWithLabelAndTooltip
                type="text"
                inputValue={`${selectedFraction * 100}%`}
                onInputValueChange={e => {
                  let str: any = e.target.value;
                  str = str.replaceAll("%", "");
                  let newFraction = Math.min(1, Number(str) / 100);
                  if (offerType == "sell") {
                    const userOwnership = userBalances[media.MediaSymbol]
                      ? userBalances[media.MediaSymbol].Balance
                      : 0;
                    newFraction = Math.min(userOwnership, newFraction);
                  }
                  setSelectedFraction(newFraction);
                }}
                style={{ marginBottom: 0, marginTop: 0, height: "50px" }}
              />
            </Box>
          </Box>
          <Box mt={2} display="flex" justifyContent="space-between" gridColumnGap={8}>
            <Box width={1}>
              <Box flexDirection="row">
                <p className={classes.pText}>Fraction Price</p>
                <p className={classes.labelDescription}>Initial price per 1% of the token</p>
              </Box>
            </Box>
            <Box width={1}>
              <Box display="flex" style={{ textAlign: "center", alignItems: "center" }}>
                <Box width={1} mr={1}>
                  <InputWithLabelAndTooltip
                    type="number"
                    inputValue={selectedPrice}
                    onInputValueChange={e => setSelectedPrice(Number(e.target.value))}
                    style={{ marginBottom: 0, marginTop: 0, height: "50px" }}
                  />
                </Box>
                <Box width={1}>
                  <TokenSelect
                    tokens={tokenList}
                    value={selectedToken}
                    onChange={e => {
                      setSelectedToken(e.target.value as string);
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <Box width="1" display="flex" justifyContent="flex-end" mt={4}>
            <PrimaryButton size="medium" className={classes.orderButton} onClick={handleOpenSignatureModal}>
              Place Order
            </PrimaryButton>
          </Box>
        </Box>
      </Modal>
    </LoadingScreen>
  );
};

export default CreateOfferModal;
