import { Box, makeStyles } from "@material-ui/core";
import React, { useState, useEffect, useRef } from "react";
import { getExchangeOffers } from "shared/services/API/FractionalizeAPI";
import { Color, Text } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import { CustomTable, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { OffersModal } from "components/PriviDigitalArt/subpages/NFTFractionalisation/modals/OffersModal";
import { NewOfferModal } from "components/PriviDigitalArt/subpages/NFTFractionalisation/modals/NewOfferModal";
import { BuySellFractionModal } from "components/PriviDigitalArt/subpages/NFTFractionalisation/modals/BuySellFractionsModal";

const OfferHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerName: "TOKEN",
    headerAlign: "center",
  },
  {
    headerName: "SYMBOL",
    headerAlign: "center",
  },
  {
    headerName: "PRICE",
    headerAlign: "center",
  },
  {
    headerName: "AMOUNT",
    headerAlign: "center",
  },
  {
    headerName: "",
    headerAlign: "center",
  },
];

const usePriviExchangeStyles = makeStyles(theme => ({
  button: {
    background: "#DDFF57",
    borderRadius: "4px",
    color: "#431AB7",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "18px",
    textAlign: "center",
    padding: "8px 32px",
  },
  buttonPurple: {
    alignSelf: "flex-end",
    marginTop: "60px",
    background: "#431AB7",
    borderRadius: "4px",
    color: "white",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "18px",
    textAlign: "center",
    padding: "8px 32px",
  },
  offersTitle: {
    alignSelf: "flex-start",
    display: "flex",
    alignItems: "center",
    color: "#181818",
    fontSize: "18px",
    [theme.breakpoints.down("sm")]: {
      fontSize: 14
    },
    "& span": {
      color: "#431AB7",
      cursor: "pointer",
      marginLeft: "24px",
      fontSize: "14px",
      [theme.breakpoints.down("sm")]: {
        fontSize: 12
      },
    },
  },
  offersTableContainer: {
    width: "100%",
    boxShadow: "0px 4px 8px #9EACF2",
    borderRadius: "16px",
    "& .MuiTableCell-head": {
      backgroundColor: "#F7F9FE",
      color: "#181818 !important",
      fontSize: "14px",
      lineHeight: "120%",
    },

    "& .MuiTableCell-body": {
      color: "#707582",
      borderBottom: "1px solid #17171718",
      fontSize: "14px",
      lineHeight: "120%",
    },
    [theme.breakpoints.down("md")]: {
      "& .MuiTableCell-head": {
        fontSize: 10,
        padding: "16px 8px",
      },
      "& .MuiTableCell-body": {
        fontSize: 10,
        padding: "8px",
      }
    }
  },
  clickablePurple: {
    color: "#431AB7",
    fontSize: "12px",
    cursor: "pointer",
    minWidth: "55px",
  },
  fakeSelect: {
    display: "flex",
    alignItems: "center",
    margin: "8px 0px 0px",
    background: "#F7F9FE",
    borderRadius: "16px",
    border: "none",
    height: "49px",
    fontFamily: "Agrandir",
    padding: "11.5px 18px",

    "& img": {
      marginRight: "15px",
      borderRadius: "50%",
      objectFit: "cover",
      width: "24px",
      height: "24px",
    },
  },
  contentPurple: {
    display: "flex",
    alignItems: "flex-end",
    color: "#431AB7",
    fontSize: "14px",
    lineHeight: "120%",
    "& :not(:nth-child(2))": {
      whiteSpace: "nowrap",
    },
    "& :last-child": {
      fontWeight: 800,
    },
  },
  dividerDotted: {
    margin: "0px 16px",
    width: "100%",
    borderBottom: "1px dotted #431AB7",
  },
}));

export default function PriviExchange({ media, handleRefresh }) {
  const classes = usePriviExchangeStyles();
  const user = useTypedSelector(state => state.user);

  const [buyingOffersData, setBuyingOffersData] = useState<any[]>([]);
  const [sellingOffersData, setSellingOffersData] = useState<any[]>([]);

  const [openViewAllOffersModal, setOpenViewAllOffersModal] = useState<any | null>(null);
  const [openNewOfferModal, setOpenNewOfferModal] = useState<"Selling" | "Buying" | "Creating" | null>(null);
  const [openBuySellFractionModal, setOpenBuySellFractionModal] = useState<"Selling" | "Buying" | null>(null);
  const offerRef = useRef<string>('');

  useEffect(() => {
    if (media?.FractionalizeData?.vaultId) {
      getExchangeOffers(media.FractionalizeData.vaultId).then(resp => {
        if (resp?.success) {
          const buyingOffers = resp?.data?.buyingOffers ?? [];
          const sellingOffers = resp?.data?.sellingOffers ?? [];
          const newBuyingOffersData: any[] = [];
          const newSellingOffersData: any[] = [];
          buyingOffers.forEach(offer => {
            newBuyingOffersData.push([
              {
                cell: <img src={require(`assets/tokenImages/${offer.token}.png`)} width={24} height={24} />,
                cellAlign: "center",
              },
              { cell: offer.token, cellAlign: "center" },
              { cell: offer.price, cellAlign: "center" },
              { cell: offer.fractionAmount, cellAlign: "center" },
              {
                cell: (
                  <Text color={Color.Purple} onClick={() => handleOpenBuySellFractionModal("Selling", offer)}>
                    Sell
                  </Text>
                ),
                cellAlign: "center",
              },
            ]);
          });
          sellingOffers.forEach(offer => {
            newSellingOffersData.push([
              {
                cell: <img src={require(`assets/tokenImages/${offer.token}.png`)} width={24} height={24} />,
                cellAlign: "center",
              },
              { cell: offer.token, cellAlign: "center" },
              { cell: offer.price, cellAlign: "center" },
              { cell: offer.fractionAmount, cellAlign: "center" },
              {
                cell: (
                  <Text color={Color.Purple} onClick={() => handleOpenBuySellFractionModal("Buying", offer)}>
                    Buy
                  </Text>
                ),
                cellAlign: "center",
              },
            ]);
          });
          setBuyingOffersData(newBuyingOffersData);
          setSellingOffersData(newSellingOffersData);
        }
      });
    }
  }, [media?.FractionalizeData?.vaultId]);

  const handleBuy = () => {
    //TODO: BUY NFT
  };

  const handleOpenViewAllOffersModal = (type, offers) => {
    setOpenViewAllOffersModal({ type: type, list: offers });
  };

  const handleCloseViewAllOffersModal = () => {
    setOpenViewAllOffersModal(null);
  };

  const handleOpenNewOfferModal = type => {
    setOpenNewOfferModal(type);
  };

  const handleCloseNewOfferModal = () => {
    setOpenNewOfferModal(null);
  };

  const handleOpenBuySellFractionModal = (type, offer) => {
    setOpenBuySellFractionModal(type);
    offerRef.current = offer;
  };

  const handleCloseBuySellFractionModal = () => {
    setOpenBuySellFractionModal(null);
    offerRef.current = '';
  };

  return (
    <>
      {
        media?.FractionalizeData?.exchangeData ?
          (<>
            <Box className={classes.offersTitle} mb={3}>
              Selling Offers{" "}
              <span onClick={() => handleOpenViewAllOffersModal("Selling", sellingOffersData)}>View All</span>
            </Box>
            <Box className={classes.offersTableContainer} mb={3}>
              <CustomTable
                headers={OfferHeaders}
                rows={sellingOffersData}
                placeholderText="There are no Selling Offers yet"
                theme="offers blue"
              />
            </Box>
            <button className={classes.button} onClick={() => handleOpenNewOfferModal("Selling")}>
              Sell Fraction
            </button>

            <Box className={classes.offersTitle} mt={4} mb={3}>
              Buying Offers{" "}
              <span onClick={() => handleOpenViewAllOffersModal("Buying", buyingOffersData)}>View All</span>
            </Box>
            <Box className={classes.offersTableContainer} mb={3}>
              <CustomTable
                headers={OfferHeaders}
                rows={buyingOffersData}
                placeholderText="There are no Buying Offers yet"
                theme="offers blue"
              />
            </Box>
            <button className={classes.button} onClick={() => handleOpenNewOfferModal("Buying")}>
              Buy Fraction
            </button>
          </>) :
          (<>
            <button className={classes.button} onClick={() => handleOpenNewOfferModal("Creating")}>
              Create Exchange
            </button>
          </>)
      }
      {openViewAllOffersModal !== null && (
        <OffersModal
          type={openViewAllOffersModal.type}
          list={openViewAllOffersModal.list}
          open={openViewAllOffersModal !== null}
          onClose={handleCloseViewAllOffersModal}
        />
      )}
      {openNewOfferModal && (
        <NewOfferModal
          media={media}
          type={openNewOfferModal}
          onClose={handleCloseNewOfferModal}
          handleRefresh={handleRefresh}
        />
      )}
      {openBuySellFractionModal && (
        <BuySellFractionModal
          type={openBuySellFractionModal}
          onClose={handleCloseBuySellFractionModal}
          media={media}
          offer={offerRef.current}
          handleRefresh={handleRefresh}
        />
      )}
    </>
  );
}

///////////////////////////// UI CODE FOR UNISWAP POOL ///////////////////////////////

// const [payAmount, setPayAmount] = useState<number>(0);
// const [token, setToken] = useState<string>("PRIVI");
// const [receiveAmount, setReceiveAmount] = useState<number>(0);
// const [estimatedFees, setEstimatedFees] = useState<number>(0);
// const [minReceived, setMinReceived] = useState<number>(0);
// const [impliedValuation, setImpliedValuation] = useState<number>(0);
// const [tokenList, setTokenList] = useState<string[]>([]);

{/* <>
  <Grid container spacing={2} style={{ display: "flex", alignItems: "flex-end" }}>
    <Grid item xs={12} md={6}>
      <InputWithLabelAndTooltip
        labelName="Pay"
        inputValue={payAmount === undefined ? "" : payAmount.toString()}
        placeHolder={"Amount to pay"}
        required
        type="number"
        onInputValueChange={e => setPayAmount(Number(e.target.value))}
        theme="light"
        endAdornment={
          <div
            className={classes.clickablePurple}
            onClick={() => setPayAmount(userBalances[token] ? userBalances[token].Balance : 0)}
          >
            USE MAX
          </div>
        }
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <label>
        Balance: {formatNumber(userBalances[token] ? userBalances[token].Balance : 0, token, 4)}
      </label>
      <TokenSelect
        tokens={tokenList}
        value={token}
        onChange={e => {
          setToken(e.target.value as string);
        }}
      />
    </Grid>
    <Grid item xs={12} md={6} style={{ paddingTop: "38px" }}>
      <InputWithLabelAndTooltip
        labelName="Recieve"
        inputValue={receiveAmount === undefined ? "" : receiveAmount.toString()}
        placeHolder={"Amount to receive"}
        minValue={0}
        required
        type="number"
        onInputValueChange={e => setReceiveAmount(Number(e.target.value))}
        theme="light"
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <label>
        Balance:{" "}
        {formatNumber(
          userBalances[media?.MediaSymbol] ? userBalances[media?.MediaSymbol].Balance : 0,
          media?.MediaSymbol,
          4
        )}
      </label>
      <div className={classes.fakeSelect}>
        <img
          src={
            media?.Type === "VIDEO_TYPE"
              ? media?.UrlMainPhoto
              : media?.Url ||
                media?.url ||
                `https://source.unsplash.com/random/${Math.floor(Math.random() * 1000)}`
          }
          alt=""
        />
        <div>{media?.MediaName ?? media?.title ?? "Fraction title"}</div>
      </div>
    </Grid>

    <Grid item xs={12} md={12} style={{ paddingTop: "38px" }}>
      <div className={classes.contentPurple}>
        <div>Estimated fees</div>
        <div className={classes.dividerDotted} />
        <div>${estimatedFees}</div>
      </div>
    </Grid>
    <Grid item xs={12} md={12} style={{ paddingTop: "14px" }}>
      <div className={classes.contentPurple}>
        <div>Min. received</div>
        <div className={classes.dividerDotted} />
        <div>
          {minReceived?.toFixed()} {media?.MediaSymbol}
        </div>
      </div>
    </Grid>
    <Grid item xs={12} md={12} style={{ paddingTop: "14px" }}>
      <div className={classes.contentPurple}>
        <div>Implied valuation</div>
        <div className={classes.dividerDotted} />
        <div>
          {impliedValuation} {token}
        </div>
      </div>
    </Grid>
  </Grid>

  <button className={classes.buttonPurple} onClick={handleBuy}>
    Buy
  </button>
</> */}
