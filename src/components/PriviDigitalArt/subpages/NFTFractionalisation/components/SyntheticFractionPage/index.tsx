import React, { useState, useEffect } from "react";
import { Box, ClickAwayListener, Grid, Grow, Hidden, MenuItem, MenuList, Paper, Popper } from "@material-ui/core";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import cls from "classnames";
import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { useFractionPageStyles } from "./index.styles";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import queryString from "query-string";
import { Avatar, Text, Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";
import { getMedia, getMediaOtherBlockchains, getFractionalisedMediaTransactions } from "shared/services/API";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import FractionBox from "./components/FractionBox";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import { withStyles } from "@material-ui/styles";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import { AcceptBidModal, BuyFractionModal, PlaceBidModal, WithDrawBidModal } from "../../modals/FractionalisationModals";
import PrintChart from "shared/ui-kit/Chart/Chart";

const CHAINCOLLECTIONS = ["wax", "showtime", "opensea"];

const BidTableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerName: "FROM",
    headerAlign: "center",
  },
  {
    headerName: "AMOUNT",
    headerAlign: "center",
  },
  {
    headerName: "DATE",
    headerAlign: "center",
  },
  {
    headerName: "STATUS",
    headerAlign: "center",
  },
  {
    headerName: "",
    headerAlign: "center",
  },
  {
    headerName: "",
    headerAlign: "center",
  }
];

const TxTableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Swaps",
    headerAlign: "center",
  },
  {
    headerName: "Token Amount",
    headerAlign: "center",
  },
  {
    headerName: "Token Amount",
    headerAlign: "center",
  },
  {
    headerName: "Account",
    headerAlign: "center",
  },
  {
    headerName: "Time",
    headerAlign: "center",
  },
  {
    headerName: "Poligon Scan",
    headerAlign: "center",
  }
];

const DefaultConfig = {
  config: {
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "June"],
      datasets: [
        {
          type: "line",
          label: "$",
          data: [],
          pointRadius: 2,
          backgroundColor: "#FFFFFF",
          borderColor: "#9EACF2",
          pointBackgroundColor: "#9EACF2",
          hoverBackgroundColor: "#9EACF2",
          borderJoinStyle: "round",
          borderCapStyle: "round",
          borderWidth: 2,
          cubicInterpolationMode: "monotone",
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartArea: {
        backgroundColor: "#FFFFFF",
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
          top: 0,
          bottom: 0,
        },
      },

      scales: {
        xAxes: [
          {
            gridLines: {
              color: "rgba(158, 172, 242, 0.09)",
              lineWidth: 60,
            },
            ticks: {
              display: false,
              beginAtZero: false,
              fontColor: "#707582",
              fontFamily: "Agrandir",
            },
          },
        ],
        yAxes: [
          {
            display: false,
            gridLines: {
              color: "#9caaf233",
              lineWidth: 1,
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
          title: function () { },
          label: function (tooltipItem, data) {
            return `Bid: ${tooltipItem.yLabel}`;
          },
        },
        //this removes legend color
        displayColors: false,
        yPadding: 10,
        xPadding: 10,
        position: "nearest",
        caretSize: 10,
        backgroundColor: "#00FF15",
        bodyFontSize: 15,
        bodyFontColor: "white",
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
  configurer: (config: any, ref: CanvasRenderingContext2D): object => {
    let gradient = ref.createLinearGradient(0, 0, 0, ref.canvas.clientHeight + 300);
    gradient.addColorStop(0, "#9EACF2");
    gradient.addColorStop(0.3, "rgba(158, 152, 252, 0.3)");
    gradient.addColorStop(0.6, "rgba(158, 172, 242, 0)");
    config.data.datasets[0].backgroundColor = gradient;

    return config;
  },
};

const SyntheticFractionPage = ({ }) => {
  const classes = useFractionPageStyles();

  const history = useHistory();
  const params: { id?: string } = useParams();
  const user = useTypedSelector(state => state.user);

  const { followUser, unfollowUser, isUserFollowed } = useUserConnections();
  const { showAlertMessage } = useAlertMessage();

  const query: { blockchainTag?: string; collectionTag?: string } = queryString.parse(location.search);
  const tag = query.blockchainTag ?? "privi";
  const collectionTag = query.collectionTag;

  const [media, setMedia] = useState<any>(null);

  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [creatorInfo, setCreatorInfo] = useState<any>({});
  const [isFollowing, setIsFollowing] = useState<number>(0);

  const [fractionTransactionsData, setFractionTransactionsData] = useState<any[]>([]);

  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);

  const [openShareMenu, setOpenShareMenu] = React.useState(false);
  const { shareMediaToSocial, shareMediaWithQrCode } = useShareMedia();

  const [randomImage, setRandomImage] = useState<string>("");

  const [openAcceptModal, setOpenAcceptModal] = React.useState<boolean>(false);
  const [openPlaceModal, setOpenPlaceModal] = React.useState<boolean>(false);
  const [openWithdrawModal, setOpenWithdrawModal] = React.useState<boolean>(false);

  const [chartConfig, setChartConfig] = React.useState<any>(DefaultConfig);
  const [isSale, setIsSale] = React.useState<boolean>(false);

  const [selectedTab, setSelectedTab] = useState<"buying" | "trading">("buying");

  useEffect(() => {
    loadData();

  }, []);

  useEffect(() => {
    if (media) {
      getCreatorData();
      if (media?.CreatorId) {
        setIsFollowing(isUserFollowed(media?.CreatorId));
      }

      setRandomImage(
        media?.Type === "VIDEO_TYPE"
          ? media?.UrlMainPhoto
          : media?.Url ||
          media?.url ||
          `https://source.unsplash.com/random/${Math.floor(Math.random() * 1000)}`
      );
    }

  }, [media?.MediaSymbol]);

  const loadMedia = async () => {
    if (isDataLoading || !params.id) return;
    setIsDataLoading(true);
    if (tag && CHAINCOLLECTIONS.includes(tag) && collectionTag) {
      getMediaOtherBlockchains(params.id, tag, collectionTag).then(resp => {
        setIsDataLoading(false);
        if (resp && resp.success) {
          let m = resp.data;
          // Auction: set if auction ended

          m.eth = tag === "privi" ? false : true;
          m.ImageUrl = m.HasPhoto
            ? `${URL()} / media / getMediaMainPhoto / ${m.MediaSymbol.replace(/\s/g, "")}`
            : undefined;
          const GENERATOR_ARTBLOCK_URL = "https://generator.artblocks.io/";
          const API_ARTBLOCK_URL = "https://api.artblocks.io/image/";
          if (m.url && m.url.includes(GENERATOR_ARTBLOCK_URL)) {
            m.url = m.url.replace(GENERATOR_ARTBLOCK_URL, API_ARTBLOCK_URL);
          }
          setMedia(m);
        }
      });
    } else {
      getMedia(params.id, tag).then(resp => {
        setIsDataLoading(false);
        if (resp && resp.success) {
          let m = resp.data;

          m.eth = tag === "privi" ? false : true;
          m.ImageUrl = m.HasPhoto
            ? `${URL()} / media / getMediaMainPhoto / ${m.MediaSymbol.replace(/\s/g, "")}`
            : undefined;
          const GENERATOR_ARTBLOCK_URL = "https://generator.artblocks.io/";
          const API_ARTBLOCK_URL = "https://api.artblocks.io/image/";
          if (m.url && m.url.includes(GENERATOR_ARTBLOCK_URL)) {
            m.url = m.url.replace(GENERATOR_ARTBLOCK_URL, API_ARTBLOCK_URL);
          }
          setMedia(m);
        }
      });
    }
  };

  const loadData = () => {
    loadMedia();
    if (media?.MediaSymbol && media?.Fraction) {
      getFractionalisedMediaTransactions(media.MediaSymbol, media.Type).then(resp => {
        if (resp?.success) {
          const data = resp.data;
          const newFractionTransactionsData: any[] = [];
          data.forEach(txn => {
            newFractionTransactionsData.push([
              {
                cell: <Text color={Color.Purple}>{txn.From ? txn.From.substring(0, 8) + "..." : "-"}</Text>,
                cellAlign: "center",
              },
              { cell: `${txn.Amount.toFixed(4)} ${txn.Token}`, cellAlign: "center" },
              { cell: `${(txn.Ownership ?? 0) * 100}% `, cellAlign: "center" },
            ]);
          });
          setFractionTransactionsData(newFractionTransactionsData);
        }
      });
    }
  };

  const handleFollow = e => {
    e.stopPropagation();
    e.preventDefault();
    if (media && media.CreatorId) {
      if (isFollowing === 0) {
        followUser(media.CreatorId).then(_ => setIsFollowing(1));
      } else {
        unfollowUser(media.CreatorId).then(_ => setIsFollowing(0));
      }
    }
  };

  const getCreatorData = async () => {
    if (media.CreatorId || media.CreatorAddress) {
      if (media.CreatorId === user?.id) {
        setCreatorInfo({
          ...user,
          name: `${user.firstName} ${user.lastName} `,
        });
      } else {
        await axios
          .get(`${URL()} /user/getBasicUserInfo / ${media.CreatorId ?? media.CreatorAddress} `)
          .then(response => {
            if (response.data.success) {
              let data = response.data.data;
              setCreatorInfo({
                ...data,
                name: data.name ?? `${data.firstName} ${data.lastName} `,
              });
            } else {
              setCreatorInfo({
                imageUrl: getRandomAvatarForUserIdWithMemoization(media.creator),
                name: "User name",
                urlSlug: "",
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    } else {
      setCreatorInfo({
        imageUrl: getRandomAvatarForUserIdWithMemoization(media.creator),
        name: media.creator,
        urlSlug: media.creator,
      });
    }
  };

  const handleCloseShareMenu = () => {
    setOpenShareMenu(false);
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const handleOpenQRCodeModal = () => {

  };

  const handleOpenShareModal = () => {

  };

  const handleFruit = type => {

  };

  const getBidTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    [1, 2, 3, 4, 5, 6, 6].map((item, index) => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box display="flex" alignItems="center">
            <Avatar
              key={`creator-${media?.CreatorAddress}`}
              size="small"
              url={
                media?.CreatorImageUrl ?? media?.CreatorAnonAvatar
                  ? require(`assets/anonAvatars/${media.CreatorAnonAvatar}`)
                  : media?.url ?? "none"
              }
            />
            <Box ml={1}>0xas3....1231s</Box>
          </Box>
        ),
        cellAlign: "center",
      });
      row.push({
        cell: (
          "ETH 1.256"
        ),
        cellAlign: "center",
      });
      row.push({
        cell: (
          "07.24.2021"
        ),
        cellAlign: "center",
      });
      row.push({
        cell: (
          <Box display="flex" alignItems="center">
            <Box width={16} height={16} borderRadius="100%" bgcolor={index % 2 === 0 ? "#65CB63" : "#F43E5F"} mr={1} />
            {index % 2 === 0 ? "Active" : "Withdrawn"}
          </Box>
        ),
        cellAlign: "center",
      });
      row.push({
        cell: (
          <Box display="flex" alignItems="center">
            {index % 2 === 0 && <button className={classes.headerBtn} style={{ margin: 0 }} onClick={() => setOpenWithdrawModal(true)}>
              Withdraw
            </button>}
          </Box>
        ),
        cellAlign: "center",
      });
      row.push({
        cell: (
          <Box display="flex" alignItems="center">
            <button className={classes.etherBtn}>
              <img src={require("assets/walletImages/etherscan.png")} alt="etherscan" />
            </button>
          </Box>
        ),
        cellAlign: "center",
      });

      tableData.push(row);
    });

    return tableData;
  };

  const getTxTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    [1, 2, 3, 4, 5, 6, 6].map((item, index) => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box color={"#431AB7"}>
            AAVE to WETH
          </Box>
        ),
        cellAlign: "center",
      });
      row.push({
        cell: (
          "0 AAVE"
        ),
        cellAlign: "center",
      });
      row.push({
        cell: (
          "O WETH"
        ),
        cellAlign: "center",
      });
      row.push({
        cell: (
          <Box color={"#431AB7"}>
            0xeec9...82f8
          </Box>
        ),
        cellAlign: "center",
      });
      row.push({
        cell: (
          "2 minutes ago"
        ),
        cellAlign: "center",
      });
      row.push({
        cell: (
          <Box display="flex" alignItems="center" justifyContent="center">
            <img width={24} height={24} src={require("assets/tokenImages/POLYGON-SYMBOL.png")} alt="polygon" />
          </Box>
        ),
        cellAlign: "center",
      });

      tableData.push(row);
    });

    return tableData;
  };

  return (
    <div className={classes.root}>
      <BackButton purple />
      <LoadingWrapper loading={!media || isDataLoading} theme={"blue"}>
        <Box className={classes.headerBox} style={{ backgroundImage: `url(${randomImage})` }}>
          <Box py={4} className={classes.backgroundBox}>
            <Grid container spacing={3}>
              <Hidden mdUp>
                <Grid item xs={12}>
                  <Box overflow={"hidden"}>
                    <img
                      src={randomImage}
                      style={{
                        objectFit: "fill",
                        borderRadius: "10px",
                      }}
                      width="100%"
                    />
                  </Box>
                </Grid>
              </Hidden>
              <Grid item md={8} sm={6} xs={12}>
                <Box display="flex">
                  {isSale ? (
                    <Box className={classes.badgeBox}>Live Sale</Box>
                  ) : (
                    <Box className={classes.badgeBox1}>Live Trading</Box>
                  )}
                </Box>
                <Box display="flex" my={2}>
                  <Box className={classes.title}>
                    {media?.MediaName || "Untitled Media"}
                  </Box>
                  <Box display="flex" flexDirection="column">
                    <Box ml={2} className={classes.badgeBox2}>Cryptopunks</Box>
                  </Box>
                </Box>
                <Box className={classes.ownerBox}>
                  <Box display="flex">
                    <span>Owner</span>
                    <Box display="flex" alignItems="center" mt={0.5}>
                      <Avatar
                        key={`creator-${media?.CreatorAddress}`}
                        size="small"
                        url={
                          media?.CreatorImageUrl ?? media?.CreatorAnonAvatar
                            ? require(`assets/anonAvatars/${media.CreatorAnonAvatar}`)
                            : media?.url ?? "none"
                        }
                      />
                      <span>User name</span>
                    </Box>
                  </Box>
                  <Box className={classes.ownerButtons}>
                    <button className={classes.headerBtn}>
                      <img src={require("assets/walletImages/etherscan.png")} alt="etherscan" /> View Synthetic NFT
                    </button>
                    <button className={classes.headerBtn}>
                      <img src={require("assets/walletImages/etherscan.png")} alt="etherscan" /> View NFT Fractions
                    </button>
                  </Box>
                </Box>
                {!isSale && (
                  <Box display="flex" alignItems="center" className={classes.unlockingBox} mt={4}>
                    <span>Minimum Unlocking date: </span>
                    <div>
                      09.18.2021
                    </div>
                  </Box>
                )}
                <Box display="flex" alignItems="center" justifyContent="space-between" mt={2} flexWrap="wrap">
                  <Box display="flex" alignItems="center" mb={1} mr={1}>
                    <div
                      ref={anchorShareMenuRef}
                      className={classes.svgBox}
                      onClick={() => setOpenShareMenu(true)}
                      style={{ height: "fit-content" }}
                    >
                      <ShareIcon />
                    </div>
                    {openShareMenu && (
                      <Popper
                        open={openShareMenu}
                        anchorEl={anchorShareMenuRef.current}
                        transition
                        disablePortal={false}
                        style={{ position: "inherit" }}
                      >
                        {({ TransitionProps, placement }) => (
                          <Grow
                            {...TransitionProps}
                            style={{
                              transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                              position: "inherit",
                            }}
                          >
                            <Paper className={classes.paper}>
                              <ClickAwayListener onClickAway={handleCloseShareMenu}>
                                <MenuList
                                  autoFocusItem={openShareMenu}
                                  id="menu-list-grow"
                                  onKeyDown={handleListKeyDownShareMenu}
                                >
                                  <CustomMenuItem onClick={handleOpenShareModal}>
                                    <img
                                      src={require("assets/icons/butterfly.png")}
                                      alt={"spaceship"}
                                      style={{ width: 20, height: 20, marginRight: 5 }}
                                    />
                                    Share on social media
                                  </CustomMenuItem>
                                  <CustomMenuItem onClick={handleOpenQRCodeModal}>
                                    <img
                                      src={require("assets/icons/qrcode_small.png")}
                                      alt={"spaceship"}
                                      style={{ width: 20, height: 20, marginRight: 5 }}
                                    />
                                    Share With QR Code
                                  </CustomMenuItem>
                                </MenuList>
                              </ClickAwayListener>
                            </Paper>
                          </Grow>
                        )}
                      </Popper>
                    )}
                    <Box ml={2}>
                      <FruitSelect fruitObject={{}} members={[]} onGiveFruit={handleFruit} />
                    </Box>
                    <Box ml={2} display="flex" alignItems="center" style={{ cursor: "pointer" }}>
                      {!isFollowing ? <PlusIcon /> : <MinusIcon />}
                      <Box ml={1} onClick={handleFollow} fontSize="14px" color="white" fontWeight={"bold"}>
                        {isFollowing ? "Unfollow" : "Follow"}
                      </Box>
                    </Box>
                  </Box>
                  {!isSale && (
                    <button className={classes.headerBtn}>
                      Withdraw Real NFT
                    </button>
                  )}
                </Box>
              </Grid>
              <Hidden xsDown>
                <Grid item md={4} sm={6}>
                  <Box height={240} overflow={"hidden"}>
                    <img
                      src={media?.url ?? randomImage}
                      style={{
                        objectFit: "fill",
                        borderRadius: "10px",
                      }}
                      height="100%"
                      width="100%"
                    />
                  </Box>
                </Grid>
              </Hidden>
            </Grid>
          </Box>
        </Box>
        {isSale && (
          <Box className={classes.valueBox} width={1}>
            <Box display="flex" flexDirection="column">
              <span>Price</span>
              <span>1.827 ETH</span>
            </Box>
            <Box display="flex" flexDirection="column">
              <span>Fraction</span>
              <span>SFTN</span>
            </Box>
            <Box display="flex" flexDirection="column">
              <span>Total Supply</span>
              <span>$320</span>
            </Box>
            <Box display="flex" flexDirection="column">
              <span>Circulating Supply</span>
              <span>$12K</span>
            </Box>
            <button
              className={classes.headerBtn}
            >
              <img
                src={require("assets/walletImages/metamask.svg")}
                alt=""
                style={{ marginRight: "8px", height: "24px", width: "24px" }}
              />
              Add to Metamask
            </button>
          </Box>
        )}
        <FractionBox media={media} isSale={isSale} />
        {!isSale && (
          <div className={classes.subTitleSection}>
            <div
              className={cls({ [classes.selectedTabSection]: selectedTab === "buying" }, classes.tabSection)}
              onClick={() => setSelectedTab("buying")}
            >
              <span>Buying offers</span>
            </div>
            <div
              className={cls(
                { [classes.selectedTabSection]: selectedTab === "trading" },
                classes.tabSection
              )}
              onClick={() => setSelectedTab("trading")}
            >
              <span>Trading Fractions</span>
            </div>
          </div>
        )}
        {((!isSale && selectedTab === "buying") || isSale) ? (
          <>
            <Grid container spacing={6} style={{ marginTop: 40 }}>
              <Grid item md={4} sm={12} xl={12}>
                <Box display="flex" justifyContent="flex-end" mb={2}>
                  <PrimaryButton size="medium" className={classes.bidBtn} onClick={() => setOpenPlaceModal(true)}>
                    Place an Offer
                  </PrimaryButton>
                </Box>
                <Box width={1} className={classes.bidBox}>
                  <Box>BEST OFFER</Box>
                  <Box>
                    <span>locked till</span>
                    <span>36h 20m 00s</span>
                  </Box>
                  <Box>
                    <span>Amount</span>
                    <span style={{ color: "#431AB7" }}>ETH 1.256</span>
                  </Box>
                  <Box>
                    <span>Address</span>
                    <span>0xas3....1231s</span>
                  </Box>
                  <PrimaryButton size="medium" className={classes.bidBtn} onClick={() => setOpenAcceptModal(true)}>
                    Accept Offer
                  </PrimaryButton>
                </Box>
              </Grid>
              <Grid item md={8} sm={12} xl={12}>
                <PrintChart config={chartConfig} />
              </Grid>
            </Grid>
            <Box display="flex" alignItems="center" justifyContent="space-between" height={34} mt={8} mb={2}>
              <Box fontSize={24} color={"#431AB7"}>Buying Offers</Box>
              <Box fontSize={12} color={"#431AB7"} fontWeight={800} style={{ cursor: "pointer" }}>SEE ALL</Box>
            </Box>
            <CustomTable
              headers={BidTableHeaders}
              rows={getBidTableData()}
              placeholderText="No Slot"
              theme="bid"
              radius={20}
            />
          </>
        ) : (
          <>
            <Box className={classes.valueBox} mt={5} width={1}>
              <Box display="flex" flexDirection="column">
                <span>Price</span>
                <span>1.827 ETH</span>
              </Box>
              <Box display="flex" flexDirection="column">
                <span>Fraction</span>
                <span>SFTN</span>
              </Box>
              <Box display="flex" flexDirection="column">
                <span>Total Supply</span>
                <span>$320</span>
              </Box>
              <Box display="flex" flexDirection="column">
                <span>Circulating Supply</span>
                <span>$12K</span>
              </Box>
              <button
                className={classes.headerBtn}
              >
                <img
                  src={require("assets/walletImages/metamask.svg")}
                  alt=""
                  style={{ marginRight: "8px", height: "24px", width: "24px" }}
                />
                Add to Metamask
              </button>
            </Box>
            <Grid container wrap="wrap" spacing={6} style={{ marginTop: 40, marginBottom: 40 }}>
              <Grid item md={6} sm={12} xl={12}>
                <Box height="100%" className={classes.tokenBox} padding="24px 48px">
                  <Box display="flex" flexDirection="column" alignItems="center" className={classes.tokenSubBox} py={3} mb={3}>
                    <Box>
                      <Box fontSize={24} color="#431AB7" fontWeight={800} mb={2} width={1}>Total Tokens Locked</Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" width={1} mb={2}>
                        <Box display="flex" alignItems="center">
                          <Box className={classes.tokenRound}>
                            <img src={require("assets/tokenImages/ETH.png")} alt="eth" />
                          </Box>
                          <Box fontSize={16} color="#431AB7" ml={1}>WETH</Box>
                        </Box>
                        <Box fontSize={16} color="#431AB7" mr={1}>0.20</Box>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" width={1}>
                        <Box display="flex" alignItems="center">
                          <Box className={classes.tokenRound}>
                            <img src={require("assets/tokenImages/question.png")} alt="eth" />
                          </Box>
                          <Box fontSize={16} color="#431AB7" ml={1}>GMX</Box>
                        </Box>
                        <Box fontSize={16} color="#431AB7" mr={1}>1.mm</Box>
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="center" className={classes.tokenSubBox} py={2} mb={3}>
                    <Box fontSize={18} color="#431AB7" mb={1}>TVL</Box>
                    <Box fontSize={18} color="#431AB7" fontWeight={800}>$0.28</Box>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="center" className={classes.tokenSubBox} py={2} mb={3}>
                    <Box fontSize={18} color="#431AB7" mb={1}>Volume 24h</Box>
                    <Box fontSize={18} color="#431AB7" fontWeight={800}>$0.00</Box>
                  </Box>
                  <Box display="flex" flexDirection="column" alignItems="center" className={classes.tokenSubBox} py={2}>
                    <Box fontSize={18} color="#431AB7" mb={1}>24h fees</Box>
                    <Box fontSize={18} color="#431AB7" fontWeight={800}>$0.00</Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item md={6} sm={12} xl={12}>
                <Box display="flex" flexDirection="column" justifyContent="space-between" height="100%" className={classes.tokenBox} padding="44px 16px 24px 16px">
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <img src={require("assets/pixImages/quickswap.png")} alt="swap" />
                    <Box fontSize={24} color="#431AB7" fontWeight={800} ml={2}>Total Tokens Locked</Box>
                  </Box>
                  <Box display="flex" className={classes.tokenSubBox} padding="16px 24px">
                    <Box width={1} pr={1}>
                      <Box fontSize={14} color="#431AB7" mb={1}>Pay</Box>
                      <Box className={classes.inputBox}>
                        <input />
                      </Box>
                      <Box fontSize={12} color="#431AB7" mt={1}>Use Max</Box>
                    </Box>
                    <Box width={1} pl={1}>
                      <Box fontSize={14} color="#431AB7" mb={1}>Balance</Box>
                      <Box className={classes.inputBox}>
                        <img src={require("assets/tokenImages/ETH.png")} width={30} height={30} alt="token" />
                        <input />
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" justifyContent="center">
                    <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8 15.9714L8 0.794922M8 15.9714L1.25 10.2802M8 15.9714L14.75 10.2802" stroke="#431AB7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Box>
                  <Box display="flex" alignItems="flex-end" className={classes.tokenSubBox} padding="16px 24px">
                    <Box width={1} pr={1}>
                      <Box fontSize={14} color="#431AB7" mb={1}>Receive</Box>
                      <Box className={classes.inputBox}>
                        <input />
                      </Box>
                    </Box>
                    <Box width={1} pl={1}>
                      <Box className={classes.inputBox}>
                        <img src={require("assets/tokenImages/ETH.png")} width={30} height={30} alt="token" />
                        <input />
                      </Box>
                    </Box>
                  </Box>
                  <Box display="flex" className={classes.buttons}>
                    <SecondaryButton size="medium">
                      View on Quickswap
                    </SecondaryButton>
                    <PrimaryButton size="medium">
                      Swap
                    </PrimaryButton>
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <CustomTable
              headers={TxTableHeaders}
              rows={getTxTableData()}
              placeholderText="No Slot"
              theme="bid"
              radius={20}
            />
          </>
        )}
      </LoadingWrapper>
      <PlaceBidModal
        open={openPlaceModal}
        onClose={() => setOpenPlaceModal(false)}
      />
      <AcceptBidModal
        open={openAcceptModal}
        onClose={() => setOpenAcceptModal(false)}
      />
      <WithDrawBidModal
        open={openWithdrawModal}
        onClose={() => setOpenWithdrawModal(false)}
      />
    </div>
  );
};

export default SyntheticFractionPage;

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
    <path
      d="M5.97949 1.10547V11.1055M0.979492 6.10547L10.9795 6.10547"
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 11.5 1.5" fill="none">
    <path
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M1,6.11H11"
      transform="translate(-0.23 -5.36)"
    />
    <path
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M-10.52,1.93"
      transform="translate(-0.23 -5.36)"
    />
  </svg>
);

const ShareIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
    <path
      d="M12.839 14.0074L6.46241 10.8192M6.45335 8.22965L12.8359 5.03836M18.3128 15.2999C18.3128 16.8954 17.0194 18.1888 15.4239 18.1888C13.8284 18.1888 12.535 16.8954 12.535 15.2999C12.535 13.7044 13.8284 12.411 15.4239 12.411C17.0194 12.411 18.3128 13.7044 18.3128 15.2999ZM18.3128 3.74436C18.3128 5.33985 17.0194 6.63325 15.4239 6.63325C13.8284 6.63325 12.535 5.33985 12.535 3.74436C12.535 2.14887 13.8284 0.855469 15.4239 0.855469C17.0194 0.855469 18.3128 2.14887 18.3128 3.74436ZM6.75727 9.52214C6.75727 11.1176 5.46387 12.411 3.86838 12.411C2.27289 12.411 0.979492 11.1176 0.979492 9.52214C0.979492 7.92665 2.27289 6.63325 3.86838 6.63325C5.46387 6.63325 6.75727 7.92665 6.75727 9.52214Z"
      stroke="white"
      strokeWidth="1.5"
    />
  </svg>
);
