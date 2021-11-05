import React, { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import Web3 from "web3";
import { Rating } from "react-simple-star-rating";
import { useHistory, useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { format } from "date-fns";
import ReactPlayer from "react-player";

import { Grid, Hidden, useMediaQuery } from "@material-ui/core";

import { sumTotalViews } from "shared/functions/totalViews";
import { useTypedSelector } from "store/reducers/Reducer";
import {
  Avatar,
  Text,
  Header3,
  PrimaryButton,
  SecondaryButton,
  Color,
  FontSize,
  Header5,
} from "shared/ui-kit";
import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { ChooseWalletModal } from "shared/ui-kit/Modal/Modals/ChooseWalletModal";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { getUser } from "store/selectors";
import {
  generateDayLabelsFromDate,
  calculateTimeFromNow,
  generateMonthLabelsFromDate,
  _arrayBufferToBase64,
} from "shared/functions/commonFunctions";
import {
  // buyFraction,
  // placeBid,
  getFractionalisedMediaOffers,
  getFractionalisedMediaTransactions,
  getFractionalisedMediaPriceHistory,
  getFractionalisedMediaSharedOwnershipHistory,
  // deleteBuyOrder,
  // deleteSellOrder,
  // cancelAuction,
  // withdrawAuction,
  getAuctionBidHistory,
  // getAuctionTransactions,
  // cancelSellingOffer,
  // buyFromOffer,
  // sellFromOffer,
  // getExchangePriceHistory,
  getBuyingOffers,
  // cancelBuyingOffer,
  getNft,
  getUsersByAddresses,
} from "shared/services/API";
import { BlockchainNets } from "shared/constants/constants";
import CreateFractionOfferModal from "components/PriviDigitalArt/modals/CreateOfferModal";
import TradeFractionOfferModal from "components/PriviDigitalArt/modals/TradeOfferModal";
import { SharePopup } from "shared/ui-kit/SharePopup";

import { BackButton } from "../../../../components/BackButton";
import { MediaPhotoDetailsModal } from "../../../../modals/MediaPhotoDetailsModal";
import DigitalArtDetailsModal from "../../../../modals/DigitalArtDetailsModal";
import { PlaceBidModal } from "../../modals/PlaceBidModal";
import BuyNFTModal from "../../../../modals/BuyNFTModal";
import PlaceBuyingOfferModal from "../../../../modals/PlaceBuyingOfferModal";
// import ConfirmPayment from "../../../../modals/ConfirmPayment";
import { marketplaceDetailPageStyles, LinkIcon } from "./index.styles";
import DigitalArtContext from "shared/contexts/DigitalArtContext";

import { getChainImageUrl } from "shared/functions/chainFucntions";
import Moment from "react-moment";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { StyledSkeleton } from "shared/ui-kit/Styled-components/StyledComponents";
import { switchNetwork } from "shared/functions/metamask";

const removeIcon = require("assets/icons/remove_red.png");
const editIcon = require("assets/icons/edit_icon.svg");
export const SaveIcon = ({ className, onClick }) => (
  <svg width="19" height="24" viewBox="0 0 19 24" fill="none" className={className} onClick={onClick}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M10.096 15.4406C9.92246 15.6177 9.71279 15.7063 9.46698 15.7063C9.22116 15.7063 9.0115 15.6177 8.83798 15.4406C8.66446 15.2635 8.57771 15.0592 8.57771 14.8279V4.40603L8.65362 2.87692L7.98124 3.62521L6.49551 5.1977C6.33645 5.37845 6.13402 5.46882 5.8882 5.46882C5.66408 5.46882 5.47429 5.39652 5.31885 5.25193C5.16341 5.10733 5.08569 4.92297 5.08569 4.69884C5.08569 4.48195 5.17245 4.29036 5.34596 4.12407L8.7946 0.783878C8.91751 0.668201 9.03138 0.588672 9.13621 0.545293C9.24104 0.501914 9.3513 0.480225 9.46698 0.480225C9.58266 0.480225 9.69291 0.501914 9.79774 0.545293C9.90258 0.588672 10.0164 0.668201 10.1394 0.783878L13.588 4.12407C13.7615 4.29036 13.8483 4.48195 13.8483 4.69884C13.8483 4.92297 13.7687 5.10733 13.6097 5.25193C13.4506 5.39652 13.2627 5.46882 13.0458 5.46882C12.7927 5.46882 12.5903 5.37845 12.4384 5.1977L10.9527 3.62521L10.2912 2.88776L10.3562 4.40603V14.8279C10.3562 15.0592 10.2695 15.2635 10.096 15.4406ZM17.8337 22.994C17.2806 23.5435 16.4546 23.8182 15.3557 23.8182H9.46187H3.56742C2.47571 23.8182 1.65151 23.5435 1.09481 22.994C0.538115 22.4445 0.259766 21.6312 0.259766 20.5539V10.4032C0.259766 9.31872 0.538115 8.50175 1.09481 7.95228C1.65151 7.40281 2.47571 7.12808 3.56742 7.12808H6.38706V8.99338H3.64334C3.15894 8.99338 2.78479 9.12171 2.5209 9.37837C2.25701 9.63503 2.12507 10.02 2.12507 10.5333V20.4238C2.12507 20.9299 2.25701 21.3112 2.5209 21.5679C2.78479 21.8246 3.15894 21.9529 3.64334 21.9529H15.2798C15.7642 21.9529 16.1401 21.8246 16.4076 21.5679C16.6751 21.3112 16.8089 20.9299 16.8089 20.4238V10.5333C16.8089 10.02 16.6751 9.63503 16.4076 9.37837C16.1401 9.12171 15.7642 8.99338 15.2798 8.99338H12.5469V7.12808H15.3557C16.4546 7.12808 17.2806 7.40462 17.8337 7.9577C18.3868 8.51078 18.6634 9.32595 18.6634 10.4032V20.5539C18.6634 21.6312 18.3868 22.4445 17.8337 22.994Z"
      fill="#2D3047"
    />
  </svg>
);

const GradientBgPlugin = {
  beforeDraw: function (chart, args, options) {
    const ctx = chart.ctx;
    const canvas = chart.canvas;
    const chartArea = chart.chartArea;

    // Chart background
    var gradientBack = canvas.getContext("2d").createLinearGradient(0, 0, 0, 250);
    gradientBack.addColorStop(0, "#9EACF2");
    gradientBack.addColorStop(1, "rgba(158, 172, 242, 0)");

    ctx.fillStyle = gradientBack;
    ctx.fillRect(
      chartArea.left,
      chartArea.bottom,
      chartArea.right - chartArea.left,
      chartArea.top - chartArea.bottom
    );
  },
};

const ChartConfig = {
  config: {
    data: {
      labels: [] as any[],
      datasets: [
        {
          type: "line",
          label: "",
          data: [] as any[],
          pointRadius: 0,
          backgroundColor: "#F9E373",
          borderColor: "#F9E373",
          pointBackgroundColor: "#F9E373",
          hoverBackgroundColor: "#F9E373",
          borderJoinStyle: "round",
          borderCapStyle: "round",
          borderWidth: 3,
          cubicInterpolationMode: "monotone",
          lineTension: 0,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartArea: {
        backgroundColor: "#F7F9FECC",
      },
      elements: {
        point: {
          radius: 0,
          hitRadius: 5,
          hoverRadius: 5,
        },
      },

      legend: {
        display: false,
      },

      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 32,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            offset: false,
            display: true,
            position: "top",
            gridLines: {
              color: "#ffffff",
              lineWidth: 50,
            },
            ticks: {
              beginAtZero: true,
              fontColor: "#6B6B6B",
              fontFamily: "Agrandir",
              display: true,
            },
          },
        ],
        yAxes: [
          {
            display: false,
            gridLines: {
              color: "#EFF2F8",
            },
            ticks: {
              display: false,
              beginAtZero: true,
            },
          },
        ],
      },

      tooltips: {
        mode: "label",
        intersect: false,
        callbacks: {
          //This removes the tooltip title
          title: function () {},
          label: function (tooltipItem, data) {
            return `$${tooltipItem.yLabel.toFixed(4)}`;
          },
        },
        //this removes legend color
        displayColors: false,
        yPadding: 10,
        xPadding: 10,
        position: "nearest",
        caretSize: 10,
        backgroundColor: "rgba(255,255,255,0.9)",
        bodyFontSize: 15,
        bodyFontColor: "#303030",
      },

      plugins: {
        datalabels: {
          display: function (context) {
            return context.dataset.data[context.dataIndex] !== 0;
          },
        },
      },
    },
  },
};

const configurer = (config: any, ref: CanvasRenderingContext2D): object => {
  for (let index = 0; index < config.data.datasets.length; index++) {
    let gradient = ref.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, config.data.datasets[index].backgroundColor);
    gradient.addColorStop(0.6, config.data.datasets[index].backgroundColor);
    gradient.addColorStop(1, `${config.data.datasets[index].backgroundColor}33`);
  }

  return config;
};

const RadialConfig = {
  config: {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [] as any,
          backgroundColor: [] as any,
          hoverOffset: 0,
          labels: [] as any,
        },
      ],
    },
    options: {
      cutoutPercentage: 80,
      animation: false,
      rotation: Math.PI / 2,
      tooltips: { enabled: false },
    },
  },
};

const OfferHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Token",
    headerAlign: "center",
  },
  {
    headerName: "SYMBOL",
    headerAlign: "center",
  },
  {
    headerName: "Price",
    headerAlign: "center",
  },
  {
    headerName: "Amount",
    headerAlign: "center",
  },
  {
    headerName: "",
    headerAlign: "center",
  },
];

const TradingTableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Event",
    headerAlign: "center",
  },
  {
    headerName: "Token",
    headerAlign: "center",
  },
  {
    headerName: "SYMBOL",
    headerAlign: "center",
  },
  {
    headerName: "Price",
    headerAlign: "center",
  },
  {
    headerName: "From",
    headerAlign: "center",
  },
  {
    headerName: "To",
    headerAlign: "center",
  },
  {
    headerName: "Date",
    headerAlign: "center",
  },
];

const ExchangeOfferTableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerName: "FROM",
    headerAlign: "center",
  },
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
    headerName: "",
  },
];

const MarketplaceDetailPage = () => {
  const history = useHistory();
  const params: { tokenAddress?: string; tokenId?: string } = useParams();

  const isMobileScreen = useMediaQuery("(max-width:375px)");
  const isTableScreen = useMediaQuery("(max-width:768px)");
  const loggedUser = useSelector(getUser);
  const { setOpenFilters } = useContext(DigitalArtContext);

  const classes = marketplaceDetailPageStyles();
  const { showAlertMessage } = useAlertMessage();
  const { followUser, unfollowUser, isUserFollowed } = useUserConnections();
  const [openDetailModal, setOpenDetailModal] = React.useState<boolean>(false);
  const [chooseWalletModal, setChooseWalletModal] = React.useState<boolean>(false);
  const [openShareMenu, setOpenShareMenu] = React.useState(false);
  // const [liked, setLiked] = React.useState<boolean>(false);
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);
  const { convertTokenToUSD } = useTokenConversion();
  const [endTime, setEndTime] = useState<any>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [media, setMedia] = useState<any>(null);
  const [openPlaceOffer, setOpenPlaceOffer] = React.useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [mediaImageLoaded, setMediaImageLoaded] = useState<boolean>(false);

  const payloadRef = useRef<any>();
  const operationRef = useRef<number>();

  // fractionalise
  const [distributionRadialConfig, setDistributionRadialConfig] = useState<any>();
  const [fractionHistoryConfig, setFractionHistoryConfig] = useState<any>();
  const [fractionPrice, setFractionPrice] = useState<number>(0); // in usd
  const [fractionPriceChange, setFractionPriceChange] = useState<number>(0);
  const [ownershipHistoryConfig, setOwnershipHistoryConfig] = useState<any>();
  const [ownershipFraction, setOwnershipFraction] = useState<number>(0);
  const [ownershipFractionChange, setOwnershipFractionChange] = useState<number>(0);
  const selectedOfferRef = useRef<any>({});
  const [openPlaceFractionOfferModal, setOpenPlaceFractionOfferModal] = useState<boolean>(false);
  const [openTraderFracctionOfferModal, setOpenTradeFractionOfferModadl] = useState<boolean>(false);
  const fractionOfferTypeRef = useRef<string>("buy");
  const [buyingOffersData, setBuyingOffersData] = useState<any[]>([]);
  const [sellingOffersData, setSellingOffersData] = useState<any[]>([]);
  const [fractionTransactionsData, setFractionTransactionsData] = useState<any[]>([]);

  // auction
  const [auctionEnded, setAuctionEnded] = React.useState<boolean>(false);
  const [openBidModal, setOpenBidModal] = React.useState<boolean>(false);
  const priceRef = useRef<number>(0);
  // const [openConfirmPaymentModal, setOpenConfirmPaymentModal] = useState<boolean>(false);
  const [bidPriceInfo, setBidPriceInfo] = React.useState<any>({
    lastPrice: 0,
    priceChange: 0,
    priceChangePct: 0,
  });
  const [bidHistoryConfig, seBidHistoryConfig] = React.useState<any>();
  const [auctionHistoryData, setAuctionHistoryData] = React.useState<any[]>([]);

  // exchange
  const [openBuyNFTModal, setOpenBuyNFTModal] = React.useState<boolean>(false);
  // const [exchangePriceInfo, setExchangePriceInfo] = React.useState<any>({
  //   lastPrice: 0,
  //   priceChange: 0,
  //   priceChangePct: 0,
  // });
  // const [exchangeHistoryConfig, setExchangeHistoryConfig] = React.useState<any>();
  const [exchangeTableData, setExchangeTableData] = React.useState<Array<Array<CustomTableCellInfo>>>([]);

  // general stuff
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<number>(0);
  const [comments, setComments] = useState<any[]>([]);
  const [isViewComments, setIsViewComments] = useState<boolean>(false);
  const [isShowingMediaPhotoDetailModal, setIsShowingMediaPhotoDetailModal] = useState<boolean>(false);
  const [mediaRatings, setRatings] = useState<any[]>([
    {
      key: "like",
      feedback: "I like it",
      myRate: 0,
      average: 0,
    },
    {
      key: "beautiful",
      feedback: "Beautiful",
      myRate: 0,
      average: 0,
    },
    {
      key: "buy",
      feedback: "A must buy",
      myRate: 0,
      average: 0,
    },
    {
      key: "priced",
      feedback: "Over priced",
      myRate: 0,
      average: 0,
    },
    {
      key: "dontLike",
      feedback: "Don't like it",
      myRate: 0,
      average: 0,
    },
    {
      key: "innovative",
      feedback: "Innovative",
      myRate: 0,
      average: 0,
    },
  ]);

  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);

  const { account, library, chainId } = useWeb3React();
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [editedCommentId, setEditedCommentId] = useState<any>(null);
  const [editedComment, setEditedComment] = useState<any>(null);
  const isEditingComment = useRef<boolean>(false);

  const [disableBidBtn, setDisableBidBtn] = useState<boolean>(false);

  useEffect(() => {
    setOpenFilters(false);
  }, []);

  // set fraction ownership graph
  useEffect(() => {
    if (media?.fraction?.fraction) {
      const creatorFraction = userBalances[media.symbol] ? userBalances[media.symbol].Balance * 100 : 0;
      const fractionForSale = media.fraction.fraction * 100;
      const newDistrubtionRadial = JSON.parse(JSON.stringify(RadialConfig));
      newDistrubtionRadial.config.data.datasets[0].labels = [
        "Creator Fraction",
        "Fractions For Sale",
        "Sold Fractions",
      ];
      newDistrubtionRadial.config.data.datasets[0].data = [
        creatorFraction,
        fractionForSale,
        100 - creatorFraction,
      ];
      newDistrubtionRadial.config.data.datasets[0].backgroundColor = ["#431AB7", "#DDFF57", "#9EACF2"];
      setDistributionRadialConfig(newDistrubtionRadial);
    }
  }, [media?.fraction?.fraction, userBalances]);

  useEffect(() => {
    loadData();
  }, [params?.tokenAddress]);

  useEffect(() => {
    if (media?.tokenAddress) {
      sumTotalViews(media);
    }
  }, [media?.tokenAddress]);

  useEffect(() => {
    if (media?.CreatorId) {
      setIsFollowing(isUserFollowed(media?.CreatorId));
    }
  }, [media?.CreatorId]);

  useEffect(() => {
    if (media?.symbol) {
      // FRACTIONALISE
      if (media?.fraction) {
        getFractionalisedMediaPriceHistory(media.symbol, media.Type).then(resp => {
          const data = resp.data;
          let labels = data.map(p => "");
          const values = data.map(p => p.price);
          if (data.length > 180) labels = generateMonthLabelsFromDate(data.map(p => p.date));
          else
            labels = generateDayLabelsFromDate(
              data.map(p => p.date),
              Math.min(10, data.length)
            );
          if (data.length > 1)
            setFractionPrice(convertTokenToUSD(media.fraction.FundingToken, data[data.length - 1].price));
          if (data.length > 2)
            setFractionPriceChange(
              (data[data.length - 1].price - data[data.length - 2].price) / data[data.length - 2].price
            );

          const newFractionHistoryConfig = JSON.parse(JSON.stringify(ChartConfig));
          newFractionHistoryConfig.configurer = configurer;
          newFractionHistoryConfig.config.data.labels = labels;
          newFractionHistoryConfig.config.data.datasets[0].data = values;
          newFractionHistoryConfig.config.data.datasets[0].backgroundColor = "#FFD705";
          newFractionHistoryConfig.config.data.datasets[0].borderColor = "#FFD70500";
          newFractionHistoryConfig.config.data.datasets[0].pointBackgroundColor = "#FFD705";
          newFractionHistoryConfig.config.data.datasets[0].hoverBackgroundColor = "#FFD705";
          newFractionHistoryConfig.config.data.datasets[0].type = "line";
          newFractionHistoryConfig.config.options.scales.xAxes[0].offset = true;
          newFractionHistoryConfig.config.options.scales.yAxes[0].ticks.display = true;
          setFractionHistoryConfig(newFractionHistoryConfig);
        });
        // load ownership graph
        getFractionalisedMediaSharedOwnershipHistory(media.symbol, media.Type).then(resp => {
          const data = resp.data;
          let labels = data.map(p => "");
          const values = data.map(p => p.ownership);
          if (data.length > 180) labels = generateMonthLabelsFromDate(data.map(p => p.date));
          else
            labels = generateDayLabelsFromDate(
              data.map(p => p.date),
              Math.min(10, data.length)
            );

          if (data.length > 1) setOwnershipFraction(data[data.length - 1].ownership);
          if (data.length > 2)
            setOwnershipFractionChange(
              (data[data.length - 1].ownership - data[data.length - 2].ownership) /
                data[data.length - 2].ownership
            );

          const newOwnershipHistoryConfig = JSON.parse(JSON.stringify(ChartConfig));
          newOwnershipHistoryConfig.configurer = configurer;
          newOwnershipHistoryConfig.config.data.labels = labels;
          newOwnershipHistoryConfig.config.data.datasets[0].data = values;
          newOwnershipHistoryConfig.config.data.datasets[0].backgroundColor = "#FFD705";
          newOwnershipHistoryConfig.config.data.datasets[0].borderColor = "#FFD70500";
          newOwnershipHistoryConfig.config.data.datasets[0].pointBackgroundColor = "#FFD705";
          newOwnershipHistoryConfig.config.data.datasets[0].hoverBackgroundColor = "#FFD705";
          newOwnershipHistoryConfig.config.data.datasets[0].type = "line";
          newOwnershipHistoryConfig.config.options.scales.xAxes[0].offset = true;
          newOwnershipHistoryConfig.config.options.scales.yAxes[0].ticks.display = true;
          setOwnershipHistoryConfig(newOwnershipHistoryConfig);
        });
        // load buying and selling offers
        getFractionalisedMediaOffers(media.symbol, media.Type).then(resp => {
          if (resp?.success) {
            const buyingOffers = resp?.data?.buyingOffers ?? [];
            const sellingOffers = resp?.data?.sellingOffers ?? [];
            const newBuyingOffersData: any[] = [];
            const newSellingOffersData: any[] = [];
            buyingOffers.forEach(offer => {
              newBuyingOffersData.push([
                {
                  cell: <img src={require(`assets/tokenImages/${offer.Token}.png`)} width={24} height={24} />,
                  cellAlign: "center",
                },
                { cell: offer.Token, cellAlign: "center" },
                { cell: offer.Price, cellAlign: "center" },
                { cell: offer.Amount, cellAlign: "center" },
                {
                  cell:
                    offer.BAddress === user.address ? (
                      <Text color={Color.Purple} onClick={() => handleOpenSignatureDeleteBuyOffer(offer)}>
                        Delete
                      </Text>
                    ) : (
                      <Text
                        color={Color.Purple}
                        onClick={() => {
                          selectedOfferRef.current = offer;
                          fractionOfferTypeRef.current = "sell";
                          setOpenTradeFractionOfferModadl(true);
                        }}
                      >
                        Sell
                      </Text>
                    ),
                  cellAlign: "center",
                },
              ]);
            });
            sellingOffers.forEach(offer => {
              if (offer.OrderId != media.fraction.OrderId) {
                newSellingOffersData.push([
                  {
                    cell: (
                      <img src={require(`assets/tokenImages/${offer.Token}.png`)} width={24} height={24} />
                    ),
                    cellAlign: "center",
                  },
                  { cell: offer.Token, cellAlign: "center" },
                  { cell: offer.Price, cellAlign: "center" },
                  { cell: offer.Amount, cellAlign: "center" },
                  {
                    cell:
                      offer.SAddress === user.address ? (
                        <Text color={Color.Purple} onClick={() => handleOpenSignatureDeleteSellOffer(offer)}>
                          Delete
                        </Text>
                      ) : (
                        <Text
                          color={Color.Purple}
                          onClick={() => {
                            selectedOfferRef.current = offer;
                            fractionOfferTypeRef.current = "buy";
                            setOpenTradeFractionOfferModadl(true);
                          }}
                        >
                          Buy
                        </Text>
                      ),
                    cellAlign: "center",
                  },
                ]);
              }
            });
            setBuyingOffersData(newBuyingOffersData);
            setSellingOffersData(newSellingOffersData);
          }
        });
        getFractionalisedMediaTransactions(media.symbol, media.Type).then(resp => {
          if (resp?.success) {
            const data = resp.data;
            const newFractionTransactionsData: any[] = [];
            data.forEach(txn => {
              newFractionTransactionsData.push([
                { cell: "Event", cellAlign: "center" },
                {
                  cell: <img src={require(`assets/tokenImages/${txn.Token}.png`)} width={24} height={24} />,
                  cellAlign: "center",
                },
                { cell: txn.Token, cellAlign: "center" },
                { cell: txn.Amount.toFixed(4), cellAlign: "center" },
                {
                  cell: <Text color={Color.Purple}>{txn.From ? txn.From.substring(0, 8) + "..." : "-"}</Text>,
                  cellAlign: "center",
                },
                {
                  cell: <Text color={Color.Purple}>{txn.To ? txn.To.substring(0, 8) + "..." : "-"}</Text>,
                  cellAlign: "center",
                },
                {
                  cell: <Text color={Color.Purple}>{calculateTimeFromNow(txn.Date)}</Text>,
                  cellAlign: "center",
                },
              ]);
            });
            setFractionTransactionsData(newFractionTransactionsData);
          }
        });
      }
      // AUCTION
      else if (media.auction) {
        getAuctionBidHistory({
          id: media.auction.id,
          type: "PIX",
        }).then(resp => {
          if (resp?.success) {
            const data = resp.data;
            // set graph data
            let config = ChartConfig;
            config.config.options.scales.xAxes[0].display = false;
            const newConfig = JSON.parse(JSON.stringify(ChartConfig));
            newConfig.plugins = [GradientBgPlugin];
            newConfig.configurer = configurer;
            newConfig.config.data.labels = data.map(history => history.date);
            newConfig.config.data.datasets[0].data = data.map(history => history.price.toFixed(4));
            newConfig.config.data.datasets[0].backgroundColor = "#27E8D9";
            newConfig.config.data.datasets[0].borderColor = "#27E8D9";
            newConfig.config.data.datasets[0].pointBackgroundColor = "#27E8D9";
            newConfig.config.data.datasets[0].hoverBackgroundColor = "#27E8D9";
            seBidHistoryConfig(newConfig);
            // set price change
            if (data.length > 1) {
              const p1 = data[data.length - 1].price;
              const p2 = data[data.length - 2].price;
              setBidPriceInfo({
                lastPrice: p1.toFixed(2),
                priceChange: (p1 - p2).toFixed(2),
                priceChangePct: ((100 * (p1 - p2)) / p2).toFixed(2),
              });
            }

            setAuctionHistoryData(resp.data.filter((_, index) => index < 6) || []);
          }
        });
      }
      // EXCHANGE
      else if (media.exchange) {
        // getExchangePriceHistory(media.exchange.exchangeId).then(resp => {
        //   if (resp?.success) {
        //     const data = resp.data;
        //     // set graph data
        //     let config = ChartConfig;
        //     config.config.options.scales.xAxes[0].display = false;
        //     const newConfig = JSON.parse(JSON.stringify(ChartConfig));
        //     newConfig.plugins = [GradientBgPlugin];
        //     newConfig.configurer = configurer;
        //     newConfig.config.data.labels = data.map(history => history.date);
        //     newConfig.config.data.datasets[0].data = data.map(history => history.price.toFixed(4));
        //     newConfig.config.data.datasets[0].backgroundColor = "#27E8D9";
        //     newConfig.config.data.datasets[0].borderColor = "#27E8D9";
        //     newConfig.config.data.datasets[0].pointBackgroundColor = "#27E8D9";
        //     newConfig.config.data.datasets[0].hoverBackgroundColor = "#27E8D9";
        //     setExchangeHistoryConfig(newConfig);
        //     // set price change
        //     if (data.length > 1) {
        //       const p1 = data[data.length - 1].price;
        //       const p2 = data[data.length - 2].price;
        //       setExchangePriceInfo({
        //         lastPrice: p1.toFixed(2),
        //         priceChange: (p1 - p2).toFixed(2),
        //         priceChangePct: ((100 * (p1 - p2)) / p2).toFixed(2),
        //       });
        //     }
        //   }
        // });
        // Get buying offers depends on chain net
        const netType = media.BlockchainNetwork;
        if (netType === BlockchainNets[0].value) {
          getBuyingOffers(media.exchange.exchangeId).then(resp => {
            if (resp?.success) {
              const data = resp.data;
              const newExchangeTableData: any[] = [];
              data.forEach(offer => {
                newExchangeTableData.push([
                  {
                    cell: (
                      <Box display="flex" flexDirection="row" alignItems="center">
                        <Avatar size="medium" url={offer.creatorInfo.imageUrl ?? getDefaultAvatar()} />
                        <Box display="flex" flexDirection="column" alignItems="center">
                          <Text ml={1.5}>{offer.creatorInfo?.name}</Text>
                          <Text ml={1.5}>@{offer.creatorInfo?.urlSlug}</Text>
                        </Box>
                      </Box>
                    ),
                  },
                  {
                    cell: (
                      <img
                        src={require(`assets/tokenImages/${offer.OfferToken}.png`)}
                        width={24}
                        height={24}
                      />
                    ),
                  },
                  { cell: offer.OfferToken },
                  { cell: offer.Price },
                  {
                    cell:
                      offer.CreatorAddress === user.address ? (
                        <Text
                          onClick={() => {
                            handleOpenSignatureCancelBuyingOffer(offer);
                          }}
                        >
                          {" "}
                          Cancel{" "}
                        </Text>
                      ) : media?.exchange?.CreatorAddress === user.address ? (
                        <Text
                          onClick={() => {
                            handleOpenSignatureSellFromBuyingOffer(offer);
                          }}
                        >
                          {" "}
                          Sell{" "}
                        </Text>
                      ) : null,
                  },
                ]);
              });
              setExchangeTableData(newExchangeTableData);
            }
          });
        } else if (netType === BlockchainNets[1].value) {
          if (!web3) return;
          const web3APIHandler = BlockchainNets[1].apiHandler;
          web3APIHandler.Exchange.getErc721OfferAll(web3, account!).then(offers => {
            const newExchangeTableData: any[] = [];
            const buyOffers =
              offers
                ?.map((offer, index) => ({ ...offer, id: index + 1 }))
                .filter(offer => offer.offerType === "BUY" && offer.exchangeId === media.exchange.exchangeId)
                .map(offer => ({
                  Id: offer.id, // This value should be returned from contract
                  CreatorAddress: offer.creatorAddress,
                  ExchangeId: offer.exchangeId,
                  Price: offer.price,
                  OfferToken: "BAL", // This value should be returned from contract
                })) || [];
            getUsersByAddresses(buyOffers.map(b => b.CreatorAddress)).then(res => {
              if (res.success) {
                const userList = res.data;
                buyOffers.forEach(offer => {
                  const u = userList[offer.CreatorAddress];
                  newExchangeTableData.push([
                    {
                      cell: (
                        <Box display="flex" flexDirection="row" alignItems="center">
                          <Avatar size="medium" url={u?.imageUrl ?? getDefaultAvatar()} />
                          <Box display="flex" flexDirection="column" alignItems="center">
                            <Text ml={1.5}>{u?.name}</Text>
                            <Text ml={1.5}>@{u?.urlSlug}</Text>
                          </Box>
                        </Box>
                      ),
                    },
                    {
                      cell: (
                        <img
                          src={require(`assets/tokenImages/${offer.OfferToken}.png`)}
                          width={24}
                          height={24}
                        />
                      ),
                    },
                    { cell: offer.OfferToken },
                    { cell: offer.Price },
                    {
                      cell:
                        offer.CreatorAddress === user.address ? (
                          <Text
                            onClick={() => {
                              handleOpenSignatureCancelBuyingOffer(offer);
                            }}
                          >
                            {" "}
                            Cancel{" "}
                          </Text>
                        ) : media?.exchange?.CreatorAddress === user.address ? (
                          <Text
                            onClick={() => {
                              handleOpenSignatureSellFromBuyingOffer(offer);
                            }}
                          >
                            {" "}
                            Sell{" "}
                          </Text>
                        ) : null,
                    },
                  ]);
                });
                setExchangeTableData(newExchangeTableData);
              }
            });
          });
        }
      }
    }
    if (media && media?.Bookmarks && media?.Bookmarks.some((id: string) => id === user.id))
      setBookmarked(true);
    if (media && media?.auction) {
      const timerId = setInterval(() => {
        const now = new Date();
        let delta = Math.floor(media?.auction.endTime - now.getTime() / 1000);
        if (delta < 0) {
          setAuctionEnded(true);
          setEndTime({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          });
          clearInterval(timerId);
        } else {
          let days = Math.floor(delta / 86400);
          delta -= days * 86400;

          // calculate (and subtract) whole hours
          let hours = Math.floor(delta / 3600) % 24;
          delta -= hours * 3600;

          // calculate (and subtract) whole minutes
          let minutes = Math.floor(delta / 60) % 60;
          delta -= minutes * 60;

          // what's left is seconds
          let seconds = delta % 60;
          setAuctionEnded(false);
          setEndTime({
            days,
            hours,
            minutes,
            seconds,
          });
        }
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [media?.symbol]);

  useEffect(() => {
    if (library) setWeb3(new Web3(library.provider));
  }, [library]);

  useEffect(() => {
    if (media && media.Comments && media.Comments.length) {
      setComments(media.Comments.reverse());
    }
  }, [media]);

  const loadMedia = async () => {
    if (isDataLoading || !params.tokenAddress || !params.tokenId) return;
    setIsDataLoading(true);
    getNft({ tokenAddress: params.tokenAddress, tokenId: params.tokenId }).then(resp => {
      setIsDataLoading(false);
      if (resp && resp.success) {
        let m = resp.data;
        setMedia(m);
        if (m.Rating) handleRatings(m.Rating);
      }
    });
  };

  const loadData = () => {
    loadMedia();
  };

  const handleOpenDetailModal = React.useCallback(() => {
    setOpenDetailModal(true);
  }, [setOpenDetailModal]);

  const handleCloseDetailModal = React.useCallback(() => {
    setOpenDetailModal(false);
  }, [setOpenDetailModal]);

  const handleOpenBidModal = React.useCallback(() => {
    setDisableBidBtn(false);
    setOpenBidModal(true);
  }, [setOpenBidModal]);

  const handleCloseBidModal = React.useCallback(() => {
    setDisableBidBtn(false);
    setOpenBidModal(false);
  }, [setOpenBidModal]);

  const handleOpenPlaceOffer = React.useCallback(() => {
    setOpenPlaceOffer(true);
  }, [setOpenPlaceOffer]);

  const handleClosePlaceOffer = React.useCallback(() => {
    setOpenPlaceOffer(false);
  }, [setOpenPlaceOffer]);

  const handleOpenShareMenu = () => {
    setOpenShareMenu(!openShareMenu);
  };

  const handleCloseShareMenu = () => {
    setOpenShareMenu(false);
  };

  const handleFollow = e => {
    e.stopPropagation();
    e.preventDefault();
    if (media?.CreatorId) {
      if (isFollowing === 0) {
        followUser(media?.CreatorId).then(_ => setIsFollowing(1));
      } else {
        unfollowUser(media?.CreatorId).then(_ => setIsFollowing(0));
      }
    }
  };

  const handleCloseWalletModal = () => {
    setChooseWalletModal(false);
  };

  const topBidPrice = React.useMemo(() => {
    if (!media || !media?.auction || !media?.BidHistory || media?.BidHistory.length === 0) return "N/A";
    return Math.max(...media?.BidHistory.map((history: any) => parseInt(history.price)));
  }, [media]);

  const owners = React.useMemo(() => {
    // if (!media || !media?.auction || !media?.BidHistory || media?.BidHistory.length === 0) return [];
    // return [
    //   ...new Set(
    //     media?.BidHistory.map((history: any) =>
    //       usersList.find(user => user.address === history.bidderAddress)
    //     ).filter(history => !!history)
    //   ),
    // ];
    return [];
  }, [media]);

  const handleChangeComment = e => {
    setComment(e.target.value);
  };

  const addComment = () => {
    if (!comment) return;
    axios
      .post(`${URL()}/marketplace/addComment`, {
        tokenAddress: media?.token_address,
        tokenId: media?.token_id,
        userId: user.id,
        comment: {
          user: {
            id: user.id,
            name: `${user.firstName || ""} ${user.lastName || ""}`,
          },
          comment,
          date: new Date(),
        },
      })
      .then(res => {
        if (res.data.success) {
          showAlertMessage("Comment added successfully!", { variant: "success" });
          setComments([
            {
              user: {
                id: user.id,
                name: `${user.firstName || ""} ${user.lastName || ""}`,
                imageUrl: user.ipfsImage,
              },
              comment,
              date: new Date(),
            },
            ...comments,
          ]);
          setComment("");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  const saveComment = comment => {
    if (isEditingComment.current) return;
    if (editedComment === comment) {
      setEditedCommentId(null);
      setEditedComment(null);
    } else {
      editComment();
    }
  };

  const editComment = () => {
    if (isEditingComment.current) return;
    if (!editedCommentId || !editedComment) {
      setEditedCommentId(null);
      setEditedComment(null);
      return;
    }
    isEditingComment.current = true;
    const newComments = [...comments];
    newComments[editedCommentId - 1].comment = editedComment;
    const bodyComments = [...media.Comments];
    bodyComments[bodyComments.length - editedCommentId].comment = editedComment;

    axios
      .post(`${URL()}/marketplace/editComment`, {
        tokenAddress: media?.token_address,
        tokenId: media?.token_id,
        userId: user.id,
        comments: bodyComments.map(c => ({
          user: {
            id: c.user.id,
            name: c.name,
          },
          comment: c.comment,
          date: c.date,
        })),
      })
      .then(res => {
        if (res.data.success) {
          showAlertMessage("Comment edited successfully!", { variant: "success" });
          setComments(newComments);
        }
        setEditedCommentId(null);
        setEditedComment(null);
        isEditingComment.current = false;
      })
      .catch(err => {
        console.log(err);
        setEditedCommentId(null);
        setEditedComment(null);
        isEditingComment.current = false;
      });
  };

  const removeComment = removedCommentId => {
    if (!removedCommentId) {
      return;
    }
    isEditingComment.current = true;
    const newComments = comments.filter((_, index) => index !== removedCommentId - 1);
    const bodyComments = media.Comments.filter(
      (_, index) => index !== media.Comments.length - removedCommentId
    );

    axios
      .post(`${URL()}/marketplace/editComment`, {
        tokenAddress: media?.token_address,
        tokenId: media?.token_id,
        userId: user.id,
        comments: bodyComments.map(c => ({
          user: {
            id: c.user.id,
            name: c.name,
          },
          comment: c.comment,
          date: c.date,
        })),
      })
      .then(res => {
        if (res.data.success) {
          showAlertMessage("Comment removed successfully!", { variant: "success" });
          setComments(newComments);
        }
        isEditingComment.current = false;
      })
      .catch(err => {
        console.log(err);
        isEditingComment.current = false;
      });
  };

  const bookmarkMedia = () => {
    axios
      .post(`${URL()}/media/bookmarkMedia/${media?.symbol ?? media?.id}`, {
        userId: user.id,
        mediaType: media?.Type,
      })
      .then(res => {
        showAlertMessage("Bookmarked media", { variant: "success" });
        setBookmarked(true);
        setComment("");
      })
      .catch(err => {
        console.log(err);
      });
  };

  const unBookmarkMedia = () => {
    axios
      .post(`${URL()}/media/removeBookmarkMedia/${media?.symbol ?? media?.id}`, {
        userId: user.id,
        mediaType: media?.Type,
      })
      .then(res => {
        showAlertMessage("Removed bookmark", { variant: "success" });
        setBookmarked(false);
        setComment("");
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleBookmark = React.useCallback(() => {
    if (!bookmarked) bookmarkMedia();
    else unBookmarkMedia();
  }, [bookmarked, bookmarkMedia, unBookmarkMedia]);

  const handleRatings = (ratings: any) => {
    let rates = [...mediaRatings];
    const count = ratings.length;

    const sumLike = ratings.reduce((prev, current) => (prev + current.like ? current.like : 0), 0);
    const sumBeautiful = ratings.reduce(
      (prev, current) => (prev + current.beautiful ? current.beautiful : 0),
      0
    );
    const sumBuy = ratings.reduce((prev, current) => (prev + current.buy ? current.buy : 0), 0);
    const sumPriced = ratings.reduce((prev, current) => (prev + current.priced ? current.priced : 0), 0);
    const sumDontLike = ratings.reduce(
      (prev, current) => (prev + current.dontLike ? current.dontLike : 0),
      0
    );
    const sumInnovative = ratings.reduce(
      (prev, current) => (prev + current.innovative ? current.innovative : 0),
      0
    );

    rates[0].average = sumLike / count;
    rates[1].average = sumBeautiful / count;
    rates[2].average = sumBuy / count;
    rates[3].average = sumPriced / count;
    rates[4].average = sumDontLike / count;
    rates[5].average = sumInnovative / count;

    // My rate
    const myRate = ratings.filter(item => item.userId === user.id)[0];
    if (myRate) {
      rates[0].myRate = myRate.like ? myRate.like : rates[0].myRate;
      rates[1].myRate = myRate.beautiful ? myRate.beautiful : rates[1].myRate;
      rates[2].myRate = myRate.buy ? myRate.buy : rates[2].myRate;
      rates[3].myRate = myRate.priced ? myRate.priced : rates[3].myRate;
      rates[4].myRate = myRate.dontLike ? myRate.dontLike : rates[4].myRate;
      rates[5].myRate = myRate.innovative ? myRate.innovative : rates[5].myRate;
    }
    setRatings([...rates]);
  };

  const handleRateMedia = React.useCallback(
    (rating: any, newRating: number) => {
      const ratingType = rating.key;
      if (newRating >= 0) {
        axios
          .post(`${URL()}/media/rateMedia`, {
            mediaId: media?.id,
            mediaType: media?.Type,
            mediaTag: media?.tag ?? "privi",
            userId: user.id,
            ratingType,
            ratingValue: newRating,
          })
          .then(response => {
            if (response.data.success) {
              handleRatings(response.data.ratings);
            }
          })
          .catch(error => console.log(error));
      }
    },
    [handleRatings]
  );

  const handleOpenMediaPhotoDetailModal = () => {
    setIsShowingMediaPhotoDetailModal(true);
  };

  const handleCloseMediaPhotoDetailModal = () => {
    setIsShowingMediaPhotoDetailModal(false);
  };

  const handleFruit = type => {
    const body = {
      userId: user.id,
      fruitId: type,
      mediaAddress: media.id,
      mediaType: media.Type || media.type,
      tag: media.tag,
      subCollection: media.collection,
    };
    axios.post(`${URL()}/media/fruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...media };
        itemCopy.fruits = resp.fruitsArray;
        setMedia(itemCopy);
      }
    });
  };

  const handleOpenSignatureDeleteBuyOffer = offer => {
    const payload = {
      OrderId: offer.OrderId,
      RequesterAddress: user.address,
      TokenSymbol: offer.TokenSymbol,
    };
    payloadRef.current = payload;
    operationRef.current = 4;
    interactOnChain();
  };

  const handleOpenSignatureDeleteSellOffer = offer => {
    const payload = {
      OrderId: offer.OrderId,
      RequesterAddress: user.address,
      TokenSymbol: offer.TokenSymbol,
    };
    payloadRef.current = payload;
    operationRef.current = 5;
    interactOnChain();
  };

  // AUCTION: bid nft with own wallet
  const handlePlaceBid = (price: number) => {
    const topBidPrice =
      (media.auction.topBidInfo?.price || media.auction.reservePrice) + media.auction.bidIncrement;
    if (price >= topBidPrice) {
      setDisableBidBtn(true);
      priceRef.current = price;
      operationRef.current = 6;
      interactOnChain();
    } else {
      showAlertMessage(`Bid should be greater than ${topBidPrice} ${media?.auction?.bidTokenSymbol}`, {
        variant: "error",
      });
      setDisableBidBtn(false);
    }
  };

  // AUCTION: cancel auction
  const handleCancelAuction = () => {
    operationRef.current = 7;
    interactOnChain();
  };

  // AUCTION: withdraw auction
  const handleOpenSignatureWithdrawAuction = () => {
    operationRef.current = 8;
    interactOnChain();
  };

  // EXCHANGE: cancel selling offer (cancel exchange)
  const handleOpenSignatureCancelSellingOffer = () => {
    const payload = {
      ExchangeId: media.exchange.exchangeId,
      OfferId: media.exchange.exchangeId,
    };
    payloadRef.current = payload;
    operationRef.current = 9;
    interactOnChain();
  };

  // EXCHANGE: buy from selling offer
  const handleOpenSignatureBuyFromSellingOffer = () => {
    const payload = {
      ExchangeId: media.exchange.exchangeId,
      OfferId: media.exchange.exchangeId,
      Address: user.address,
      Amount: "1",
    };
    payloadRef.current = payload;
    operationRef.current = 10;
    interactOnChain();
  };

  // EXCHANGE: sell
  const handleOpenSignatureSellFromBuyingOffer = offer => {
    const payload = {
      ExchangeId: offer.ExchangeId,
      OfferId: offer.Id,
      Address: user.address,
      Amount: offer.Amount,
    };
    payloadRef.current = payload;
    operationRef.current = 11;
    interactOnChain();
  };

  // EXCHANGE: cancel buying Offer
  const handleOpenSignatureCancelBuyingOffer = offer => {
    const payload = {
      ExchangeId: offer.ExchangeId,
      OfferId: offer.Id,
    };
    payloadRef.current = payload;
    operationRef.current = 12;
    interactOnChain();
  };

  const approveToken = async (apiHandler, spender, token, amount) => {
    let balance = await apiHandler.Erc20[token].balanceOf(web3, { account });
    let decimals = await apiHandler.Erc20[token].decimals(web3);
    balance = Number(toDecimals(balance, decimals));
    if (balance < amount) {
      setLoading(false);
      showAlertMessage(`Insufficient balance to place bid`, { variant: "error" });
      return;
    }

    const approved = await apiHandler.Erc20[token].approve(
      web3,
      account!,
      spender,
      toNDecimals(amount, decimals)
    );
    if (!approved) {
      setLoading(false);
      showAlertMessage(`Can't proceed to approve Token`, { variant: "error" });
      return;
    }
  };

  // media relevant contract interaction on polygon chain
  const interactOnChain = async () => {
    const targetChain = BlockchainNets.find(n => n.chainName === media.chainsFullName);

    if (chainId != targetChain.chainId) {
      const changed = await switchNetwork(targetChain.chainId);
      if (!changed) {
        showAlertMessage(`Got failed while switching over to taret network`, { variant: "error" });
        return;
      }
    }

    const payload = payloadRef.current;
    const operation = operationRef.current;

    const web3APIHandler = targetChain.apiHandler;
    const web3Config = targetChain.config;

    if (operation) {
      setLoading(true);
      if (!web3) return;
      let request;
      let contractParams;
      switch (operation) {
        case 1:
          break;
        case 2: // FRACTIONALISE: Buy from offer
          break;
        case 3: // FRACTIONALISE: Sell from offer
          break;
        case 4: // FRACTIONALISE: Delete buy offer
          break;
        case 5: // FRACTIONALISE: Delete sell offer
          break;
        case 6: // AUCTION: Place bid
          let decimals = await web3APIHandler.Erc20[media.auction.bidTokenSymbol].decimals(web3);

          contractParams = {
            tokenAddress: media.auction.tokenAddress,
            tokenId: media.auction.tokenId,
            _address: user.address,
            amount: toNDecimals(priceRef.current, decimals),
            fromAddress: user.address,
          };

          await approveToken(
            web3APIHandler,
            web3Config.CONTRACT_ADDRESSES.ERC721_AUCTION,
            media.auction.bidTokenSymbol,
            priceRef.current
          );

          web3APIHandler.Auction.placeBid(web3, account!, contractParams).then(async res => {
            if (res) {
              request = {
                id: media.auction.id,
                amount: priceRef.current,
                bidder: user.id,
                hash: res.transaction.Id,
                transaction: {
                  ...res.transaction,
                  Event: "Bid",
                  Price: priceRef.current,
                },
                type: "PIX",
              };
              const response = await axios.post(`${URL()}/marketplace/placeBid`, request);
              if (response?.data?.success) {
                showAlertMessage("Bid placed successfully", { variant: "success" });
                handleCloseBidModal();
                loadData();
              } else {
                showAlertMessage("Failed to Place a Bid", { variant: "error" });
              }
              setLoading(false);
              setDisableBidBtn(false);
            } else {
              setLoading(false);
              setDisableBidBtn(false);
              showAlertMessage("Failed to Place a Bid", { variant: "error" });
            }
          });
          break;
        case 7: // AUCTION: Cancel auction
          contractParams = {
            tokenAddress: media.auction.tokenAddress,
            tokenId: media.auction.tokenId,
          };
          web3APIHandler.Auction.cancelAuction(web3, account!, contractParams).then(async res => {
            if (res) {
              request = {
                id: media.auction.id,
                type: "PIX",
              };
              const response = await axios.post(`${URL()}/marketplace/cancelAuction`, request);
              if (response?.data?.success) {
                showAlertMessage("Auction cancelled successfully", { variant: "success" });
                loadData();
              } else {
                showAlertMessage("Failed to cancel the auction", { variant: "error" });
              }
              setLoading(false);
            } else {
              setLoading(false);
              setDisableBidBtn(false);
              showAlertMessage("Failed to Cancel the auction", { variant: "error" });
            }
          });
          break;
        case 8: // AUCTION: Withdraw auction
          contractParams = {
            tokenAddress: media.auction.tokenAddress,
            tokenId: media.auction.tokenId,
          };
          web3APIHandler.Auction.withdrawAuction(web3, account!, contractParams).then(async res => {
            if (res) {
              request = {
                id: media.auction.id,
                type: "PIX",
              };
              const response = await axios.post(`${URL()}/marketplace/withdrawAuction`, request);
              if (response?.data?.success) {
                showAlertMessage("Auction withdrawn successfully", { variant: "success" });
                loadData();
              } else {
                showAlertMessage("Failed to Withdraw the auction", { variant: "error" });
              }
              setLoading(false);
            } else {
              setLoading(false);
              setDisableBidBtn(false);
              showAlertMessage("Failed to Withdraw the auction", { variant: "error" });
            }
          });
          break;
        case 9: // EXCHANGE: Cancel selling offer
          request = {
            input: {
              exchangeId: media.exchange.exchangeId,
              offerId: media.exchange.initialOfferId,
            },
            caller: account!,
          };
          web3APIHandler.Exchange.CancelERC721TokenSellingOffer(web3, account!, request).then(async res => {
            if (res) {
              const tx = res.transaction;
              const blockchainRes = { output: { Transactions: {} } };
              blockchainRes.output.Transactions[tx.Id] = [tx];
              const body = {
                BlockchainRes: blockchainRes,
                AdditionalData: {
                  ExchangeId: media.exchange.exchangeId,
                  OfferId: media.exchange.initialOfferId,
                  MediaSymbol: media.symbol,
                  MediaType: media.Type,
                },
              };
              console.log(body);
              const response = await axios.post(`${URL()}/exchange/cancelSellingOffer/v2_p`, body);
              if (response?.data?.success) {
                showAlertMessage("Exchange cancelled successfully", { variant: "success" });
                loadData();
              } else {
                showAlertMessage("Failed to cancel the exchange", { variant: "error" });
              }
              setLoading(false);
            } else {
              setLoading(false);
              setDisableBidBtn(false);
              showAlertMessage("Failed to cancel the exchange", { variant: "error" });
            }
          });
          break;
        case 10: // EXCHANGE: Buy from selling offer
          request = {
            input: {
              exchangeId: media.exchange.exchangeId,
              offerId: media.exchange.initialOfferId,
            },
            caller: account!,
          };

          await approveToken(
            web3APIHandler,
            web3Config.CONTRACT_ADDRESSES.ERC721_TOKEN_EXCHANGE,
            media?.exchange?.offerToken ?? "USDT",
            media?.exchange?.price
          );

          web3APIHandler.Exchange.BuyERC721TokenFromOffer(web3, account!, request).then(async res => {
            if (res) {
              const tx = res.transaction;
              const blockchainRes = { output: { Transactions: {} } };
              blockchainRes.output.Transactions[tx.Id] = [tx];
              const body = {
                BlockchainRes: blockchainRes,
                AdditionalData: {
                  Address: user.address,
                  ExchangeId: request.input.exchangeId,
                  OfferId: request.input.offerId,
                  MediaSymbol: media.symbol,
                  MediaType: media.Type,
                },
              };
              const response = await axios.post(`${URL()}/exchange/buyFromOffer/v2_p`, body);
              if (response?.data?.success) {
                showAlertMessage("NFT bought successfully", { variant: "success" });
                loadData();
              } else {
                showAlertMessage("Failed to buy NFT", { variant: "error" });
              }
              setLoading(false);
            } else {
              setLoading(false);
              setDisableBidBtn(false);
              showAlertMessage("Failed to buy NFT", { variant: "error" });
            }
          });
          break;
        case 11: // EXCHANGE: Sell from buying offer
          request = {
            input: {
              exchangeId: payload.ExchangeId,
              offerId: payload.OfferId,
            },
            caller: account!,
          };
          web3APIHandler.Exchange.SellERC721TokenFromOffer(web3, account!, request).then(async res => {
            if (res) {
              const tx = res.transaction;
              const blockchainRes = { output: { Transactions: {} } };
              blockchainRes.output.Transactions[tx.Id] = [tx];
              const body = {
                BlockchainRes: blockchainRes,
                AdditionalData: {
                  ExchangeId: request.input.exchangeId,
                  MediaSymbol: media.symbol,
                  MediaType: media.Type,
                },
              };
              const response = await axios.post(`${URL()}/exchange/sellFromOffer/v2_p`, body);
              if (response?.data?.success) {
                showAlertMessage("NFT sold successfully", { variant: "success" });
                loadData();
              } else {
                showAlertMessage("Failed to sell NFT", { variant: "error" });
              }
              setLoading(false);
            } else {
              setLoading(false);
              setDisableBidBtn(false);
              showAlertMessage("Failed to sell NFT", { variant: "error" });
            }
          });
          break;
        case 12: // EXCHANGE: Cancel buying offer
          request = {
            input: {
              exchangeId: payload.ExchangeId,
              offerId: payload.OfferId,
            },
            caller: account!,
          };
          web3APIHandler.Exchange.CancelERC721TokenBuyingOffer(web3, account!, request).then(async res => {
            if (res) {
              const tx = res.transaction;
              const blockchainRes = { output: { Transactions: {} } };
              blockchainRes.output.Transactions[tx.Id] = [tx];
              const body = {
                BlockchainRes: blockchainRes,
                AdditionalData: {
                  ExchangeId: request.input.exchangeId,
                  OfferId: request.input.offerId,
                },
              };
              const response = await axios.post(`${URL()}/exchange/cancelBuyingOffer/v2_p`, body);
              if (response?.data?.success) {
                showAlertMessage("Cancelled successfully", { variant: "success" });
                loadData();
              } else {
                showAlertMessage("Failed to cancel offer", { variant: "error" });
              }
              setLoading(false);
            } else {
              setLoading(false);
              setDisableBidBtn(false);
              showAlertMessage("Failed to cancel offer", { variant: "error" });
            }
          });
          break;
      }
    } else {
      setDisableBidBtn(false);
    }
  };

  const isValidBidHistory = () => {
    if (bidHistoryConfig) {
      const values = bidHistoryConfig.config.data.datasets[0].data;

      return Boolean(values.find(value => parseFloat(value) > 0));
    }

    return false;
  };

  return (
    <div className={classes.page}>
      <Helmet>
        <title>{media?.name}</title>
        <meta name="description" content={media?.metadata?.description} />
        <meta property="og:image" content={media?.content_url} />
        <meta name="og:image" content={media?.content_url} />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="720" />
      </Helmet>
      <div className={classes.content}>
        <Box mb="24px" mt="32px" display="flex">
          <BackButton dark />
        </Box>
        <LoadingWrapper loading={!media || isDataLoading} theme={"blue"} height="calc(100vh - 100px)">
          <Box mt={2}>
            <Header3 noMargin>{media?.name}</Header3>
            {media?.fraction ? (
              <Box
                className={classes.fraction}
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" flexDirection="column">
                  <span className={classes.fractionTitle}>Interest Rate</span>
                  <span className={classes.fractionValue}>{media.fraction.InterestRate * 100}%</span>
                </Box>
                <Box display="flex" flexDirection="column">
                  <span className={classes.fractionTitle}>Creator Royalty</span>
                  <span className={classes.fractionValue}>{media.Royalty ?? 1}%</span>
                </Box>
                <Box display="flex" flexDirection="column">
                  <span className={classes.fractionTitle}>Fraction Price</span>
                  <span className={classes.fractionValue}>
                    {media.fraction.FundingToken} {media.fraction.InitialPrice}
                  </span>
                </Box>
                <Box display="flex" flexDirection="column">
                  <span className={classes.fractionTitle}>Buy Back Price</span>
                  <span className={classes.fractionValue}>
                    {media.fraction.FundingToken} {media.fraction.BuyBackPrice}
                  </span>
                </Box>
                <Box display="flex" flexDirection="column">
                  {media?.fraction?.OwnerAddress != user.address && (
                    <PrimaryButton size="small" className={classes.fractionBuy}>
                      Buy Fraction
                    </PrimaryButton>
                  )}
                </Box>
              </Box>
            ) : null}
            <Grid className={classes.leftImage} container spacing={2} wrap="wrap">
              <Grid item xs={12} sm={6}>
                {media?.content_url.endsWith("mp4") ? (
                  <Box onClick={() => setIsPlaying(prev => !prev)}>
                    <ReactPlayer
                      url={media?.content_url}
                      className={classes.reactPlayer}
                      muted={true}
                      loop={true}
                      playing={isPlaying}
                    />
                  </Box>
                ) : (
                  <Box
                    width={1}
                    mr={1}
                    onClick={handleOpenMediaPhotoDetailModal}
                    position="relative"
                    overflow="hidden"
                    height={1}
                  >
                    {!mediaImageLoaded && (
                      <Box my={1} position="absolute" top="0" left="0" width={1} maxWidth="450px">
                        <StyledSkeleton
                          width="100%"
                          style={{ minHeight: isMobileScreen ? "280px" : "180px" }}
                          variant="rect"
                        />
                      </Box>
                    )}
                    <img
                      src={media?.content_url}
                      className={classes.detailImg}
                      onLoad={() => setMediaImageLoaded(true)}
                    />
                  </Box>
                )}
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                style={{
                  marginTop: "8px",
                  paddingTop: media?.auction ? 0 : 2,
                  paddingBottom: media?.auction ? 0 : 2,
                }}
              >
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                  <Box
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    className={classes.mediaUserInfo}
                  >
                    <Box display="flex" alignItems="center">
                      <div
                        className={classes.avatarImg}
                        onClick={() => {
                          history.push(`/${media?.CreatorUrlSlug || media?.CreatorId}/profile`);
                        }}
                      >
                        <Avatar size="small" url={media?.CreatorImageUrl ?? getDefaultAvatar()} />
                      </div>
                      <Box display="flex" flexDirection="column" ml={1} mr={4}>
                        <Text color={Color.Black} className={classes.creatorName} mb={0.5}>
                          {media?.CreatorName}
                        </Text>
                        {media?.CreatorUrlSlug && (
                          <Text className={classes.creatorName} mt={0.5}>{`@${media?.CreatorUrlSlug}`}</Text>
                        )}
                      </Box>
                    </Box>
                    {user && !media?.tag && media?.owner_of !== user.address && (
                      <SecondaryButton size="small" onClick={handleFollow} className={classes.followBtn}>
                        {isFollowing === 2 ? "Unfollow" : isFollowing === 1 ? "Requested" : "Follow"}
                      </SecondaryButton>
                    )}
                  </Box>
                  <Hidden smDown>
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <Box mr={2} style={{ background: "rgba(67, 26, 183, 0.32)", borderRadius: "50%" }}>
                        <FruitSelect fruitObject={media} onGiveFruit={handleFruit} />
                      </Box>
                      <Box mr={2}>
                        <img
                          src={require(bookmarked
                            ? "assets/priviIcons/bookmark-filled-gray.svg"
                            : "assets/priviIcons/bookmark-gray.svg")}
                          alt="Bookmark"
                          onClick={handleBookmark}
                          style={{ cursor: "pointer", width: "24px", height: "24px" }}
                        />
                      </Box>
                      <Box mb={1}>
                        <div
                          onClick={handleOpenShareMenu}
                          ref={anchorShareMenuRef}
                          style={{ cursor: "pointer" }}
                        >
                          <img src={require(`assets/icons/more.png`)} alt="like" />
                        </div>
                      </Box>
                    </Box>
                  </Hidden>
                </Box>
                <SharePopup
                  item={{ ...media, Type: "MARKETPLACE" }}
                  openMenu={openShareMenu}
                  anchorRef={anchorShareMenuRef}
                  handleCloseMenu={handleCloseShareMenu}
                />
                <Box display="flex" alignItems="center" my={2}>
                  {owners.length > 0 && (
                    <Box display="flex" alignItems="center">
                      {owners.map((owner: any) => (
                        <div
                          className={classes.avatarImg}
                          onClick={() => {
                            history.push(`/${owner.urlSlug}/profile`);
                          }}
                        >
                          <Avatar
                            key={`artist-${owner.id}`}
                            className={classes.artist}
                            size="small"
                            url={owner.ipfsImage ? owner.ipfsImage : getDefaultAvatar()}
                          />
                        </div>
                      ))}
                      <Text color={Color.Purple} ml={2}>
                        Ownership History
                      </Text>
                    </Box>
                  )}
                  <Box className={classes.mediaInfo}>
                    <Box display="flex" alignItems="center">
                      <Text size={FontSize.XL} mr={5}>
                        💾 {media?.shareCount || 0}
                      </Text>
                      <div>
                        <Text size={FontSize.XL} mr={5}>
                          👀 {(media?.TotalViews ?? 0) + 1}
                        </Text>
                      </div>
                    </Box>
                    <Hidden mdUp>
                      <Box display="flex" flexDirection="row" alignItems="center">
                        <Box mr={2} style={{ background: "rgba(67, 26, 183, 0.32)", borderRadius: "50%" }}>
                          <FruitSelect fruitObject={media} onGiveFruit={handleFruit} />
                        </Box>
                        <Box mr={2}>
                          <img
                            src={require(bookmarked
                              ? "assets/priviIcons/bookmark-filled-gray.svg"
                              : "assets/priviIcons/bookmark-gray.svg")}
                            alt="Bookmark"
                            onClick={handleBookmark}
                            style={{ cursor: "pointer", width: "24px", height: "24px" }}
                          />
                        </Box>
                        <Box mb={1}>
                          <div
                            onClick={handleOpenShareMenu}
                            ref={anchorShareMenuRef}
                            style={{ cursor: "pointer" }}
                          >
                            <img src={require(`assets/icons/more.png`)} alt="like" />
                          </div>
                        </Box>
                      </Box>
                    </Hidden>
                  </Box>
                </Box>
                <hr className={classes.divider} />
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mb={2}
                >
                  <Box display="flex" alignItems="center" width={"50%"}>
                    <img
                      src={getChainImageUrl(media?.chainsFullName)}
                      width="32px"
                      style={{ borderRadius: "50%" }}
                    />
                  </Box>
                  {(media?.metadata?.external_link || media?.metadata?.external_url) && (
                    <PrimaryButton
                      className={classes.primaryBtn}
                      size="small"
                      onClick={() => {
                        window.open(media?.metadata?.external_link || media?.metadata?.external_url);
                      }}
                    >
                      Link
                    </PrimaryButton>
                  )}
                  {!!media?.fraction && (
                    <Box
                      display="flex"
                      flexDirection="column"
                      borderRadius={8}
                      bgcolor={Color.GreenLight}
                      width={"50%"}
                      padding={2}
                    >
                      <span className={classes.fractionTitle}>Fractionalised</span>
                      <span className={classes.fractionValue}>{media.fraction.fraction * 100}%</span>
                    </Box>
                  )}
                </Box>
                {media?.price && <Box>{`Price ${media?.price}`}</Box>}
                {media?.fraction ? (
                  <>
                    <hr className={classes.divider} />
                    <Box>
                      <Text size={FontSize.XL} color={Color.Black}>
                        Ownership Distribution
                      </Text>
                      <Grid container style={{ marginTop: "16px" }}>
                        <Grid item xs={12} sm={3}>
                          {distributionRadialConfig && (
                            <PrintChart config={distributionRadialConfig} canvasHeight={250} />
                          )}
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <Box style={{ marginLeft: "12px" }}>
                            {distributionRadialConfig &&
                              distributionRadialConfig.config.data.datasets[0].labels.map((item, index) => (
                                <Box key={"labels-" + index}>
                                  <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box display="flex" flexDirection="row" alignItems="center">
                                      <Box
                                        width={12}
                                        height={12}
                                        style={{
                                          background:
                                            distributionRadialConfig.config.data.datasets[0].backgroundColor[
                                              index
                                            ],
                                        }}
                                      />
                                      <Box ml={1} className={classes.radialText}>
                                        {item}
                                      </Box>
                                    </Box>
                                    <Box className={classes.radialText}>
                                      ${distributionRadialConfig.config.data.datasets[0].data[index]}%
                                    </Box>
                                  </Box>
                                  <hr className={classes.divider} style={{ margin: "12px 0" }} />
                                </Box>
                              ))}
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  </>
                ) : media?.exchange ? (
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Text color={Color.Black} size={FontSize.XL}>
                      Price
                    </Text>
                    <Text color={Color.Purple} size={FontSize.XXL} ml={1} mr={1}>
                      {`${media?.exchange?.offerToken ?? "ETH"} ${media?.exchange?.price ?? 0}`}
                    </Text>
                    <Text color={Color.Black} size={FontSize.S}>
                      {`$(${convertTokenToUSD(
                        media?.exchange?.offerToken ?? "USDT",
                        media?.exchange?.price ?? 0
                      ).toFixed(6)})`}
                    </Text>
                  </Box>
                ) : media?.auction ? (
                  <>
                    <>
                      {topBidPrice !== "N/A" && (
                        <Box display="flex" flexDirection="row" alignItems="center">
                          <Text color={Color.Black} size={FontSize.XL}>
                            Top bid
                          </Text>
                          <Text color={Color.Purple} size={FontSize.XXL} ml={1} mr={1}>
                            {`${media?.auction.bidTokenSymbol} ${topBidPrice}`}
                          </Text>
                          <Text color={Color.Black} size={FontSize.S}>
                            {`$(${convertTokenToUSD(media?.auction.bidTokenSymbol, topBidPrice).toFixed(6)})`}
                          </Text>
                        </Box>
                      )}
                      <Box mb={1}>
                        <Text size={FontSize.S} color={Color.Black}>
                          {`Bidding token is ${media?.auction.bidTokenSymbol}`}
                        </Text>
                      </Box>
                    </>
                    {media?.auction && (
                      <Box
                        display="flex"
                        flexDirection="row"
                        justifyContent="space-between"
                        bgcolor={Color.GreenLight}
                        borderRadius={8}
                        px={2}
                        py={1}
                      >
                        <Box
                          display="flex"
                          flexDirection="column"
                          alignItems="flex-start"
                          width="50%"
                          overflow="hidden"
                        >
                          <Text color={Color.Purple} mb={0.5}>
                            Reserve Price
                          </Text>
                          <Text
                            color={Color.Purple}
                            size={FontSize.XL}
                            bold
                            style={{ width: "100%", overflow: "hidden", textOverflow: "ellipsis" }}
                          >{`${media.auction.reservePrice ?? 0} ${media.auction.bidTokenSymbol}`}</Text>
                        </Box>
                        <Box display="flex" flexDirection="column" alignItems="flex-end" width="50%">
                          <Text color={Color.Purple} mb={0.5}>
                            {!auctionEnded ? "Auction Ending In" : "Auction Ended"}
                          </Text>
                          {!auctionEnded && (
                            <Text color={Color.Purple} size={FontSize.XL} bold>
                              {`${endTime.days ? `${String(endTime.days).padStart(2, "0")}d` : ""} ${String(
                                endTime.hours
                              ).padStart(2, "0")}h ${String(endTime.minutes).padStart(2, "0")}m ${String(
                                endTime.seconds
                              ).padStart(2, "0")}s`}
                            </Text>
                          )}
                        </Box>
                      </Box>
                    )}
                    <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                      {media.auction.TopBidInfo && (
                        <Box className={classes.bidBox} style={{ background: "#9EACF2" }} width={1} mr={1}>
                          <Avatar
                            size="medium"
                            url={
                              media?.auction?.TopBidInfo?.ImageUrl ||
                              require(`assets/anonAvatars/${media?.auction?.TopBidInfo?.AnonAvatar}`)
                            }
                          />
                          <Box ml={2}>
                            <Box className={classes.header2} style={{ color: "#431AB7" }}>
                              Top Bid Placed By
                            </Box>
                            <Box className={classes.header2} style={{ color: "white" }} mt={0.5}>
                              {media?.auction.TopBidInfo?.Name}
                            </Box>
                          </Box>
                        </Box>
                      )}
                      {media.auction.ReplacedBidInfo && (
                        <Box
                          className={classes.bidBox}
                          style={{ border: "1px solid #9EACF2" }}
                          width={1}
                          ml={1}
                        >
                          <Avatar
                            size="medium"
                            url={
                              media?.auction?.ReplacedBidInfo?.ImageUrl ||
                              require(`assets/anonAvatars/${media?.auction?.ReplacedBidInfo?.AnonAvatar}`)
                            }
                          />
                          <Box ml={2}>
                            <Box className={classes.header2} style={{ color: "#431AB7" }}>
                              Displaced Bidder
                            </Box>
                            <Box className={classes.header2} style={{ color: "#9EACF2" }} mt={0.5}>
                              {media?.auction.ReplacedBidInfo?.Name}
                            </Box>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </>
                ) : null}
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  mt={3}
                  gridRowGap={12}
                >
                  {media?.auction ? (
                    media.auction.owner !== user.id ? (
                      !auctionEnded && (
                        <PrimaryButton
                          size="medium"
                          onClick={handleOpenBidModal}
                          className={classes.primaryBtn}
                          style={{
                            background: "#DDFF57",
                            color: "#431AB7",
                            marginBottom: `${isTableScreen ? "5px" : "0px"}`,
                          }}
                        >
                          Place a Bid
                        </PrimaryButton>
                      )
                    ) : (
                      <div>
                        {media.auction.gathered ? (
                          <PrimaryButton
                            size="medium"
                            onClick={handleOpenSignatureWithdrawAuction}
                            className={classes.primaryBtn}
                            style={{
                              background: "#DDFF57",
                              color: "#431AB7",
                              marginBottom: `${isTableScreen ? "5px" : "0px"}`,
                            }}
                          >
                            Withdraw
                          </PrimaryButton>
                        ) : null}
                        {!media.auction.cancelled && (
                          <PrimaryButton
                            size="medium"
                            onClick={handleCancelAuction}
                            className={classes.primaryBtn}
                            style={{
                              background: "#DDFF57",
                              color: "#431AB7",
                              marginBottom: `${isTableScreen ? "5px" : "0px"}`,
                            }}
                          >
                            Stop Auction
                          </PrimaryButton>
                        )}
                      </div>
                    )
                  ) : null}
                  {media?.exchange ? (
                    media?.exchange.creatorAddress === user.address ? (
                      <PrimaryButton
                        size="medium"
                        onClick={() => handleOpenSignatureCancelSellingOffer()}
                        className={classes.primaryBtn}
                        style={{
                          background: "#DDFF57",
                          color: "#431AB7",
                          marginBottom: `${isTableScreen ? "5px" : "0px"}`,
                        }}
                      >
                        Remove Selling Offer
                      </PrimaryButton>
                    ) : (
                      <PrimaryButton
                        size="medium"
                        onClick={() => handleOpenSignatureBuyFromSellingOffer()}
                        className={classes.primaryBtn}
                        style={{
                          background: "#DDFF57",
                          color: "#431AB7",
                          marginBottom: `${isTableScreen ? "5px" : "0px"}`,
                        }}
                      >
                        Buy NFT
                      </PrimaryButton>
                    )
                  ) : null}
                  {media?.exchange && media.exchange.creatorAddress !== user.address && (
                    <PrimaryButton
                      size="medium"
                      onClick={() => setOpenBuyNFTModal(true)}
                      className={classes.primaryBtn}
                      style={{
                        background: "#DDFF57",
                        color: "#431AB7",
                        marginBottom: `${isTableScreen ? "5px" : "0px"}`,
                        marginLeft: `${isTableScreen ? "0px" : "8px"}`,
                      }}
                    >
                      Place Buying Offer
                    </PrimaryButton>
                  )}
                  {(media?.auction || media?.exchange) && (
                    <SecondaryButton
                      size="medium"
                      onClick={handleOpenDetailModal}
                      className={classes.transparentBtn}
                      style={{
                        marginBottom: `${isTableScreen ? "5px" : "0px"}`,
                      }}
                    >
                      View More Details
                    </SecondaryButton>
                  )}
                </Box>
              </Grid>
            </Grid>
            {media?.fraction ? (
              <Box display="flex" flexDirection="column">
                {/* <Text size={FontSize.XL} color={Color.Black}>
                  History
                </Text>
                <hr className={classes.divider} />
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box className={classes.card}>
                      <Text>Fraction Price (1%)</Text>
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box display="flex" flexDirection="row" alignItems="center">
                          <Text size={FontSize.XXL} color={Color.Black}>
                            {formatNumber(fractionPrice, "USD", 2)}
                          </Text>
                          <Text size={FontSize.L} color={Color.Black} ml={1}>
                            per fraction
                          </Text>
                        </Box>
                        <Text size={FontSize.XXL} color={Color.Violet}>
                          {fractionPriceChange > 0 ? "+" : ""}
                          {fractionPriceChange * 100}%
                        </Text>
                      </Box>
                      <hr className={classes.divider} />
                      {fractionHistoryConfig && (
                        <Box height="250px">
                          <PrintChart config={fractionHistoryConfig} />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box className={classes.card}>
                      <Text>Shared Ownership History</Text>
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <Box display="flex" flexDirection="row" alignItems="center">
                          <Text size={FontSize.XXL} color={Color.Black}>
                            {ownershipFraction * 100}
                          </Text>
                          <Text size={FontSize.L} color={Color.Black} ml={1}>
                            fractions
                          </Text>
                        </Box>
                        <Text size={FontSize.XXL} color={Color.Violet}>
                          {ownershipFractionChange > 0 ? "+" : ""}
                          {ownershipFractionChange * 100}%
                        </Text>
                      </Box>
                      <hr className={classes.divider} />
                      {ownershipHistoryConfig && (
                        <Box height="250px">
                          <PrintChart config={ownershipHistoryConfig} />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
                <hr className={classes.divider} /> */}
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box>
                        <Text size={FontSize.XL} color={Color.Black}>
                          Buying Offers
                        </Text>
                        <Text
                          color={Color.Purple}
                          onClick={() => {
                            fractionOfferTypeRef.current = "buy";
                            setOpenPlaceFractionOfferModal(true);
                          }}
                          ml={1}
                        >
                          Place Buying Offer
                        </Text>
                      </Box>
                      <Text color={Color.Purple}>View All</Text>
                    </Box>
                    <Box className={classes.table}>
                      <CustomTable
                        headers={OfferHeaders}
                        rows={buyingOffersData}
                        placeholderText="No Offers"
                        theme="offers blue"
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Box
                      display="flex"
                      flexDirection="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Box>
                        <Text size={FontSize.XL} color={Color.Black}>
                          Selling Offers
                        </Text>
                        <Text
                          color={Color.Purple}
                          onClick={() => {
                            if (userBalances[media.symbol]) {
                              fractionOfferTypeRef.current = "sell";
                              setOpenPlaceFractionOfferModal(true);
                            } else
                              showAlertMessage("You dont have any ownership of this media", {
                                variant: "error",
                              });
                          }}
                          ml={1}
                        >
                          Place Selling Offer
                        </Text>
                      </Box>
                      <Text color={Color.Purple}>View All</Text>
                    </Box>
                    <Box className={classes.table}>
                      <CustomTable
                        headers={OfferHeaders}
                        rows={sellingOffersData}
                        placeholderText="No Offers"
                        theme="offers blue"
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Box
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  justifyContent="space-between"
                  mt={3}
                >
                  <Text size={FontSize.XL} color={Color.Black}>
                    Trading History
                  </Text>
                  <Text color={Color.Purple}>View All</Text>
                </Box>
                <Box className={classes.table} mb={5}>
                  <CustomTable
                    headers={TradingTableHeaders}
                    rows={fractionTransactionsData}
                    placeholderText="No Offers"
                    theme="offers blue"
                  />
                </Box>
              </Box>
            ) : media?.auction ? (
              <>
                {isValidBidHistory() && (
                  <>
                    <Box my={3}>Bid History</Box>
                    <Box className={classes.graphBox} height="200px" mb={3}>
                      <Box display="flex" style={{ position: "absolute", left: "16px", top: "8px" }}>
                        <Box mt={2}>
                          <Box style={{ fontSize: 18 }}>
                            {convertTokenToUSD(
                              media?.auction?.bidTokenSymbol ?? "USDT",
                              bidPriceInfo.lastPrice ?? 0
                            ).toFixed(1)}{" "}
                            $
                          </Box>
                          <Box
                            color={bidPriceInfo.priceChange ?? 0 >= 0 ? "#65CB63" : "#F2A07E"}
                            style={{ fontSize: 14 }}
                            mt={1}
                          >
                            {bidPriceInfo.priceChange ?? 0 > 0 ? "+" : ""}
                            {convertTokenToUSD(
                              media?.auction?.bidTokenSymbol ?? "USDT",
                              bidPriceInfo.priceChange ?? 0
                            ).toFixed(4)}
                            {"$"}
                            {/* ({bidPriceInfo.priceChangePct ?? 0 > 0 ? "+" : ""}
                        {bidPriceInfo.priceChangePct}%) */}
                          </Box>
                        </Box>
                      </Box>
                      {bidHistoryConfig && <PrintChart config={bidHistoryConfig} />}
                    </Box>
                  </>
                )}

                <Grid container>
                  {auctionHistoryData &&
                    auctionHistoryData.length > 0 &&
                    auctionHistoryData.map(row => {
                      const bidder = row.bidderInfo;
                      const token = media.auction.bidTokenSymbol;
                      return (
                        <Grid item sm={12} md={6} lg={4} className={classes.bidderInfoItem}>
                          <Avatar size="small" url={bidder?.imageUrl ?? getDefaultAvatar()} />
                          <Box
                            display="flex"
                            flexDirection="column"
                            ml={2}
                            mr={isTableScreen || isMobileScreen ? "18px" : "104px"}
                          >
                            <Box fontSize={14} fontWeight={400} color="#181818" mb={1}>
                              Bid placed by <span className={classes.text1}>@{bidder?.name}</span>
                            </Box>
                            <Box fontSize={14} fontWeight={800} color="#9EACF2">
                              {`${row.price?.toFixed(4)} ${token}`}{" "}
                              <span className={classes.text2}>{`On ${format(
                                new Date(row.date),
                                "MMMM dd, yyyy"
                              )} at ${format(new Date(row.date), "p")}`}</span>
                            </Box>
                          </Box>
                          <Box
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              window.open(
                                `${
                                  BlockchainNets.find(net => net.chainName === media.chainsFullName)?.scan
                                    .url || "https://priviscan.io"
                                }/tx/${row.hash}`,
                                "_blank",
                                "noopener,noreferrer"
                              );
                            }}
                          >
                            <LinkIcon />
                          </Box>
                        </Grid>
                      );
                    })}
                </Grid>
              </>
            ) : media?.exchange ? (
              <>
                <Box my={3}>Offers</Box>
                <Box className={classes.table} mb={5}>
                  <CustomTable
                    headers={ExchangeOfferTableHeaders}
                    rows={exchangeTableData}
                    placeholderText="No available data"
                    theme="offers blue"
                  />
                </Box>
              </>
            ) : null}
            {media?.metadata?.description && (
              <>
                <Header5>Description</Header5>
                <Text style={{ overflowWrap: "anywhere" }}>{media?.metadata?.description}</Text>
              </>
            )}
            <hr className={classes.divider} />
            <Header5>Rate this Digital Art</Header5>
            <Grid container spacing={2}>
              {mediaRatings.map((rating, index) => (
                <Grid item={true} key={`rating - ${index}`} xs={6} md={4} lg={2}>
                  <Box mb={2}>
                    <Header5 noMargin>{rating.average}</Header5>
                    <Text mt={1.5}>{rating.feedback}</Text>
                  </Box>
                  <Rating
                    onClick={newRating => handleRateMedia(rating, newRating)}
                    ratingValue={rating.average}
                    size={15}
                    fillColor="#FFD43E"
                    emptyColor="#E0E4F3"
                  />
                </Grid>
              ))}
            </Grid>
            <hr className={classes.divider} />
            {!media?.fraction ? (
              <>
                <Header5>Comments</Header5>
                <Box
                  className={classes.message}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  mb={2}
                >
                  <Avatar size="medium" url={user && user.ipfsImage ? user.ipfsImage : getDefaultAvatar()} />
                  <InputWithLabelAndTooltip
                    transparent
                    overriedClasses=""
                    type="text"
                    inputValue={comment}
                    onInputValueChange={handleChangeComment}
                    onKeyDown={e => {
                      if (e.key === "Enter") addComment();
                    }}
                    placeHolder="Add comment..."
                    style={{ marginBottom: 4, flex: "1", width: "auto" }}
                  />
                  <Text
                    size={FontSize.S}
                    mr={isMobileScreen ? 1 : 2}
                    onClick={() => setComment(`${comment}😍`)}
                    style={{ cursor: "pointer" }}
                  >
                    😍
                  </Text>
                  <Text
                    size={FontSize.S}
                    mr={isMobileScreen ? 1 : 2}
                    onClick={() => setComment(`${comment}😭`)}
                    style={{ cursor: "pointer" }}
                  >
                    😭
                  </Text>
                  <img
                    src={require("assets/icons/+.png")}
                    onClick={addComment}
                    style={{ cursor: "pointer" }}
                  />
                </Box>

                {comments.length ? (
                  !isViewComments ? (
                    <Text className={classes.link} size={FontSize.S} onClick={() => setIsViewComments(true)}>
                      View all {comments.length} comments
                    </Text>
                  ) : (
                    comments.map((comment, index) => (
                      <Box
                        key={`comment-${index}`}
                        mt={2}
                        display="flex"
                        alignContent="center"
                        gridColumnGap={8}
                      >
                        <div
                          className={classes.avatarImg}
                          onClick={() => {
                            history.push(`/${comment.user.urlSlug}/profile`);
                          }}
                        >
                          <Avatar size="medium" url={comment.user && comment.user.imageUrl} />
                        </div>
                        <Box
                          display="flex"
                          flexDirection="column"
                          justifyContent="center"
                          gridRowGap={4}
                          maxWidth="70%"
                          flex={1}
                        >
                          <span className={classes.commentUername}>{comment.user?.name}</span>
                          {index === editedCommentId - 1 ? (
                            <input
                              className={classes.editComment}
                              value={editedComment}
                              onChange={e => {
                                setEditedComment(e.target.value);
                              }}
                              onKeyDown={e => {
                                if (e.key === "Enter") {
                                  saveComment(comment.comment);
                                }
                              }}
                              onBlur={() => saveComment(comment.comment)}
                              autoFocus
                            />
                          ) : (
                            <span className={classes.commentDescription}>{comment.comment}</span>
                          )}
                        </Box>
                        <Box display="flex" alignItems="center" style={{ marginLeft: "auto", fontSize: 12 }}>
                          <Box display="flex" alignItems="center" gridColumnGap={8} onClick={() => {}}>
                            {loggedUser?.id === comment.user?.id && (
                              <>
                                {editedCommentId ? (
                                  <SaveIcon
                                    className={classes.commentIcon}
                                    onClick={() => saveComment(comment.comment)}
                                  />
                                ) : (
                                  <img
                                    src={editIcon}
                                    className={classes.commentIcon}
                                    alt={"edit"}
                                    onClick={() => {
                                      if (isEditingComment.current) return;
                                      setEditedCommentId(index + 1);
                                      setEditedComment(comment.comment);
                                    }}
                                  />
                                )}
                                <img
                                  src={removeIcon}
                                  className={classes.commentIcon}
                                  alt={"remove"}
                                  onClick={() => {
                                    if (isEditingComment.current) return;
                                    setEditedCommentId(null);
                                    setEditedComment(null);
                                    removeComment(index + 1);
                                  }}
                                />
                              </>
                            )}
                            <Moment fromNow>{comment.date}</Moment>
                          </Box>
                        </Box>
                      </Box>
                    ))
                  )
                ) : null}
              </>
            ) : null}
          </Box>
          {openDetailModal && (
            <DigitalArtDetailsModal
              open={openDetailModal}
              handleClose={handleCloseDetailModal}
              media={media}
              makeOffer={() => {
                handleCloseDetailModal();
                handleOpenBidModal();
              }}
            />
          )}
          {openBidModal && (
            <PlaceBidModal
              isOpen={openBidModal}
              onClose={handleCloseBidModal}
              placeBid={handlePlaceBid}
              viewDetails={() => {
                handleCloseBidModal();
                handleOpenDetailModal();
              }}
              media={media}
              disableBidBtn={disableBidBtn}
            />
          )}
          {openBuyNFTModal && (
            <BuyNFTModal
              open={openBuyNFTModal}
              handleClose={() => setOpenBuyNFTModal(false)}
              handleRefresh={() => null}
              handleSwitchPlaceOffer={() => {
                handleCloseBidModal();
                handleOpenPlaceOffer();
              }}
              media={media}
              isFromExchange={true}
            />
          )}
          {openPlaceOffer && (
            <PlaceBuyingOfferModal
              open={openPlaceOffer}
              handleClose={() => {
                handleClosePlaceOffer();
                setOpenBuyNFTModal(false);
              }}
              handleRefresh={loadData}
              media={media}
            />
          )}
          {chooseWalletModal && (
            <ChooseWalletModal
              isOpen={chooseWalletModal}
              onClose={handleCloseWalletModal}
              onAccept={() => {}}
            />
          )}
          {/* {openConfirmPaymentModal && (
            <ConfirmPayment
              open={openConfirmPaymentModal}
              handleClose={() => setOpenConfirmPaymentModal(false)}
              payWithOwnWallet={handlePlaceBid}
              payWithCommunity={() => {}}
            />
          )} */}
          {isShowingMediaPhotoDetailModal && (
            <MediaPhotoDetailsModal
              isOpen={isShowingMediaPhotoDetailModal}
              onClose={handleCloseMediaPhotoDetailModal}
              imageURL={media?.content_url}
            />
          )}
          {openPlaceFractionOfferModal && (
            <CreateFractionOfferModal
              open={openPlaceFractionOfferModal}
              handleClose={() => setOpenPlaceFractionOfferModal(false)}
              handleRefresh={loadData}
              offerType={fractionOfferTypeRef.current}
              media={media}
            />
          )}
          {openTraderFracctionOfferModal && (
            <TradeFractionOfferModal
              open={openTraderFracctionOfferModal}
              handleClose={() => setOpenTradeFractionOfferModadl(false)}
              handleRefresh={loadData}
              offerType={fractionOfferTypeRef.current}
              offer={selectedOfferRef.current}
              media={media}
            />
          )}
          {media && (
            <LoadingScreen
              loading={loading}
              title={`Transaction \nin progress`}
              subTitle={`Transaction is proceeding on ${media.chainsFullName} Chain.\nThis can take a moment, please be patient...`}
              handleClose={() => setLoading(false)}
            />
          )}
        </LoadingWrapper>
      </div>
    </div>
  );
};

export default React.memo(MarketplaceDetailPage);
