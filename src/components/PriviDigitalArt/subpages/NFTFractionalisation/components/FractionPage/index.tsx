import { Box, Grid, useMediaQuery, useTheme } from "@material-ui/core";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import React, { useState, useEffect, useMemo } from "react";
import Web3 from "web3";
import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { useFractionPageStyles } from "./index.styles";
import axios from "axios";
import { useHistory, useParams } from "react-router-dom";
import { Avatar, Text, SecondaryButton, Color } from "shared/ui-kit";
import { useTypedSelector } from "store/reducers/Reducer";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";
import { useWeb3React } from "@web3-react/core";
import { CustomTable, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { SharePopup } from "shared/ui-kit/SharePopup";
import { MediaPhotoDetailsModal } from "components/PriviDigitalArt/modals/MediaPhotoDetailsModal";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import ExchangeBox from "./components/ExchangeBox";
import AuctionDetails from "./components/AuctionDetails";
import {
  ClosedIcon,
  LiveAuctionIcon,
} from "components/PriviDigitalArt/components/Cards/FractionalizedNFTCard";
import BuyoutNFTModal from "../../modals/BuyoutNFTModal";
import SetReservePriceModal from "../../modals/SetReservePriceModal";
import { getFractionalizeVault } from "shared/services/API/FractionalizeAPI";
import { formatNumber } from "shared/functions/commonFunctions";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

const FractionPage = () => {
  const classes = useFractionPageStyles();
  const history = useHistory();
  const params: { id?: string } = useParams();
  const user = useTypedSelector(state => state.user);

  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);

  const { followUser, unfollowUser, isUserFollowed } = useUserConnections();
  const { library, account, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const [media, setMedia] = useState<any>(null);

  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [creatorInfo, setCreatorInfo] = useState<any>({});
  const [isFollowing, setIsFollowing] = useState<number>(0);

  const [fractionalizeOwnershipData, setFractionalizeOwnershipData] = useState<any[]>([]);

  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);

  const [openShareMenu, setOpenShareMenu] = React.useState(false);
  const [openMediaPhotoDetailModal, setOpenMediaPhotoDetailModal] = useState<boolean>(false);
  const [openViewAllTransacions, setOpenViewAllTransacions] = useState<boolean>(false);
  const [openByoutNFT, setOpenByoutNFT] = useState<boolean>(false);
  const [openUpdateReservePrice, setOpenUpdateReservePrice] = useState<boolean>(false);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [tradingTableHeader, setTradingTableHeader] = useState<Array<CustomTableHeaderInfo>>([
    {
      headerName: "",
      headerAlign: "center",
    },
    {
      headerName: "Fraction Ownership",
      headerAlign: "center",
    },
    {
      headerName: "",
      headerAlign: "center",
    },
  ]);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (selectedChain && chainId && selectedChain.chainId !== chainId) {
      (async () => {
        const changed = await switchNetwork(selectedChain.chainId);
        if (!changed) {
          setSelectedChain(filteredBlockchainNets.find(b => b.chainId === chainId));
        }
      })();
    }
  }, [chainId, selectedChain]);

  // creator data
  useEffect(() => {
    if (media?.FractionalizeData?.ownerAddress) {
      axios
        .get(`${URL()}/user/getBasicUserInfo/${media?.FractionalizeData?.ownerAddress}`)
        .then(response => {
          const resp = response.data;
          if (resp?.success) {
            const data = resp.data;
            setCreatorInfo({
              ...data,
              name: data.name ?? `${data.firstName} ${data.lastName}`,
            });
          } else {
            setCreatorInfo({
              imageUrl: getRandomAvatarForUserIdWithMemoization(media?.FractionalizeData?.ownerAddress),
              name: "User name",
              urlSlug: "",
            });
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
    // has no creatorId, just address
    // if (media?.CreatorId) {
    //   setIsFollowing(isUserFollowed(media?.CreatorId));
    // }
  }, [media?.FractionalizeData?.ownerAddress]);

  useEffect(() => {
    if (media && media?.Bookmarks && media?.Bookmarks.some((id: string) => id === user.id))
      setBookmarked(true);
  }, [media?.Bookmarks]);

  const loadMedia = async () => {
    if (isDataLoading || !params.id) return;
    setIsDataLoading(true);
    getFractionalizeVault(params.id).then(resp => {
      setIsDataLoading(false);
      if (resp?.success) {
        let m = resp.data;
        m.eth = false;
        m.ImageUrl = m.HasPhoto
          ? `${URL()}/media/getMediaMainPhoto/${m.MediaSymbol.replace(/\s/g, "")}`
          : undefined;
        const GENERATOR_ARTBLOCK_URL = "https://generator.artblocks.io/";
        const API_ARTBLOCK_URL = "https://api.artblocks.io/image/";
        if (m.url && m.url.includes(GENERATOR_ARTBLOCK_URL)) {
          m.url = m.url.replace(GENERATOR_ARTBLOCK_URL, API_ARTBLOCK_URL);
        }
        setMedia(m);
      }
    });
  };

  const loadData = async () => {
    if (isDataLoading || !params.id) return;
    setIsDataLoading(true);
    const resp = await getFractionalizeVault(params.id);
    if (resp?.success) {
      let m = resp.data;
      m.eth = false;
      m.ImageUrl = m.HasPhoto
        ? `${URL()}/media/getMediaMainPhoto/${m.MediaSymbol.replace(/\s/g, "")}`
        : undefined;
      const GENERATOR_ARTBLOCK_URL = "https://generator.artblocks.io/";
      const API_ARTBLOCK_URL = "https://api.artblocks.io/image/";
      if (m.url && m.url.includes(GENERATOR_ARTBLOCK_URL)) {
        m.url = m.url.replace(GENERATOR_ARTBLOCK_URL, API_ARTBLOCK_URL);
      }
      setMedia(m);
    }
    setIsDataLoading(false);
    // if (media?.MediaSymbol && media?.Fraction) {
    //   getFractionalisedMediaTransactions(media.MediaSymbol, media.Type).then(resp => {
    //     if (resp?.success) {
    //       const data = resp.data ?? [{From: "0x123123123123131232131232131231212", Amount: 15, Token: "USDT", Ownership: 0.05}];
    //       const newFractionTransactionsData: any[] = [];
    //       data.forEach(txn => {
    //         newFractionTransactionsData.push([
    //           {
    //             cell: <Text color={Color.Purple}>{txn.From ? txn.From.substring(0, 8) + "..." : "-"}</Text>,
    //             cellAlign: "center",
    //           },
    //           { cell: `${txn.Amount.toFixed(4)} ${txn.Token}`, cellAlign: "center" },
    //           { cell: `${(txn.Ownership ?? 0) * 100}%`, cellAlign: "center" },
    //         ]);
    //       });
    //       setFractionalizeOwnershipData(newFractionTransactionsData);
    //     }
    //   });
    // }
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

  const bookmarkMedia = () => {
    axios
      .post(`${URL()}/media/bookmarkMedia/${media?.MediaSymbol ?? media?.id}`, {
        userId: user.id,
        mediaType: media?.Type,
      })
      .then(res => {
        showAlertMessage("Bookmarked media", { variant: "success" });
        setBookmarked(true);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const unBookmarkMedia = () => {
    axios
      .post(`${URL()}/media/removeBookmarkMedia/${media?.MediaSymbol ?? media?.id}`, {
        userId: user.id,
        mediaType: media?.Type,
      })
      .then(res => {
        showAlertMessage("Removed bookmark", { variant: "success" });
        setBookmarked(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleBookmark = React.useCallback(() => {
    if (!bookmarked) bookmarkMedia();
    else unBookmarkMedia();
  }, [bookmarked, bookmarkMedia, unBookmarkMedia]);

  const handleAddToMetamask = () => {
    //TODO: ADD TO METAMASK
  };

  const handleViewOnEtherscan = () => {
    const chainIdMap = {
      1: "https://etherscan.io/address/",
      3: "https://ropsten.etherscan.io/address/",
      4: "https://rinkeby.etherscan.io/address/",
      137: "https://polygonscan.com/address/",
      80001: "https://mumbai.polygonscan.com/address/",
    };
    window.open(
      chainIdMap[media?.FractionalizeData?.chainId] + media?.FractionalizeData?.erc20VaultTokenAddress
    );
  };

  const handleOpenShareMenu = () => {
    setOpenShareMenu(!openShareMenu);
  };

  const handleCloseShareMenu = () => {
    setOpenShareMenu(false);
  };

  const handleOpenMediaPhotoDetailModal = () => {
    setOpenMediaPhotoDetailModal(true);
  };

  const handleCloseMediaPhotoDetailModal = () => {
    setOpenMediaPhotoDetailModal(false);
  };

  const handleOpenViewAllTransacions = () => {
    setOpenViewAllTransacions(true);
  };

  const handleCloseViewAllTransacions = () => {
    setOpenViewAllTransacions(false);
  };

  const handleOpenByoutNFT = () => {
    setOpenByoutNFT(true);
  };

  const handleCloseByoutNFT = () => {
    setOpenByoutNFT(false);
  };

  const handleOpenUpdateReservePrice = () => {
    setOpenUpdateReservePrice(true);
  };

  const handleCloseUpdateReservePrice = () => {
    setOpenUpdateReservePrice(false);
  };

  const handleClaimReward = async () => {
    if (!media?.FractionalizeData?.erc20VaultTokenAddress) {
      return;
    }

    const web3 = new Web3(library.provider);
    const contractAddress = media?.FractionalizeData?.erc20VaultTokenAddress;

    const contractResponse = await selectedChain.apiHandler.TokenVault.claimFees(
      web3,
      account!,
      contractAddress
    );
    if (contractResponse.success) {
      showAlertMessage("Claimed Fees successfully", { variant: "success" });
    }
  };

  const isAuctionLive = useMemo(() => {
    return (
      Math.floor(
        (media?.FractionalizeData?.auctionData?.createdAt - new Date().getTime()) / 1000 +
        media?.FractionalizeData?.auctionData?.auctionLength
      ) >= 0
    );
  }, [media]);

  return (
    <div className={classes.root}>
      <BackButton purple />
      <LoadingWrapper loading={!media || isDataLoading} theme={"blue"}>
        <Box width="100%">
          <div className={classes.title}>{media?.FractionalizeData?.name}</div>
          <Grid className={classes.leftImage} container spacing={5} wrap="wrap">
            {/* left column */}
            <Grid item xs={12} sm={6} style={{ paddingTop: 0 }}>
              <Box
                width={1}
                mr={1}
                onClick={handleOpenMediaPhotoDetailModal}
                position="relative"
                overflow="hidden"
              >
                <img
                  src={media?.Url ?? `https://source.unsplash.com/random/${Math.floor(Math.random() * 1000)}`}
                  className={classes.detailImg}
                />
              </Box>
              {!isMobile && (
                <>
                  {media?.FractionalizeData?.status !== "Auction" && (
                    <div className={classes.tableContainer}>
                      <CustomTable
                        headers={tradingTableHeader}
                        rows={fractionalizeOwnershipData}
                        placeholderText="No History"
                        theme="offers blue"
                      />
                      {media?.FractionalizeData?.status !== "Auction" && isTablet && (
                        <div className={classes.viewAll} onClick={handleOpenViewAllTransacions} style={{ position: "absolute", right: 16, top: 16, margin: 0, fontSize: 14, color: "#DDFF57" }}>
                          View All
                        </div>
                      )}
                    </div>
                  )}
                  {media?.FractionalizeData?.status !== "Auction" && !isTablet && (
                    <div className={classes.viewAll} onClick={handleOpenViewAllTransacions}>
                      View All
                    </div>
                  )}
                </>
              )}
            </Grid>
            {/* right column */}
            <Grid
              item
              xs={12}
              sm={6}
              style={{
                paddingTop: 0,
                marginTop: "16px",
                paddingBottom: 0,
              }}
            >
              {/* first row */}
              <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                <Box display="flex" flexDirection="row" alignItems="center">
                  {/* avatar */}
                  <div
                    className={classes.avatarImg}
                    onClick={() => {
                      history.push(`/${media?.FractionalizeData?.ownerAddress}/profile`);
                    }}
                  >
                    <Avatar
                      key={`creator-${media?.FractionalizeData?.ownerAddress}`}
                      size="small"
                      url={
                        creatorInfo?.url
                          ? creatorInfo?.url
                          : creatorInfo.anonAvatar
                            ? require(`assets/anonAvatars/${creatorInfo.anonAvatar}`)
                            : "none"
                      }
                    />
                  </div>
                  {/* user name */}
                  <Box display="flex" flexDirection="column" ml={1} mr={4}>
                    <Text color={Color.Black} className={classes.creatorName} mb={0.5}>
                      {creatorInfo?.name}
                    </Text>
                    {creatorInfo?.urlSlug && (
                      <Text className={classes.creatorName} mt={0.5}>{`@${creatorInfo?.urlSlug}`}</Text>
                    )}
                  </Box>
                  {/* button - follow etc. */}
                  {user &&
                    media?.FractionalizeData?.ownerAddress &&
                    media?.FractionalizeData?.ownerAddress !== user.address && (
                      <SecondaryButton size="small" onClick={handleFollow} className={classes.followBtn}>
                        {isFollowing === 2 ? "Unfollow" : isFollowing === 1 ? "Requested" : "Follow"}
                      </SecondaryButton>
                    )}
                </Box>
                {/* bookmark */}
                <Box display="flex" flexDirection="row" alignItems="center">
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
                    <div onClick={handleOpenShareMenu} ref={anchorShareMenuRef} style={{ cursor: "pointer" }}>
                      <img src={require(`assets/icons/more.png`)} alt="like" />
                    </div>
                  </Box>
                </Box>
              </Box>
              {/* share menu */}
              <SharePopup
                item={media}
                openMenu={openShareMenu}
                anchorRef={anchorShareMenuRef}
                handleCloseMenu={handleCloseShareMenu}
              />
              {/* second row - token, meta mask, ether scan */}
              <Box
                mt={3}
                mb={3}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                color={"#431AB7"}
                fontSize="12px"
                fontWeight={800}
              >
                <Box fontSize={"16px"}>{media?.MediaSymbol ?? "TOKEN NAME"}</Box>

                <Box
                  onClick={handleAddToMetamask}
                  style={{ cursor: "pointer" }}
                  display="flex"
                  alignItems="center"
                  paddingLeft={1}
                >
                  <img
                    src={require("assets/walletImages/metamask.svg")}
                    alt=""
                    style={{ marginRight: "8px", height: "24px", width: "24px" }}
                  />
                  Add to Metamask
                </Box>

                <Box
                  onClick={handleViewOnEtherscan}
                  style={{ cursor: "pointer" }}
                  display="flex"
                  alignItems="center"
                >
                  <img
                    src={require("assets/walletImages/contract.svg")}
                    alt=""
                    style={{ marginRight: "8px", height: "24px", width: "24px" }}
                  />
                  View on Etherscan
                </Box>
              </Box>

              {/* status icon row - Live Auction, Closed */}
              {media?.FractionalizeData?.status === "Auction" &&
                (isAuctionLive ? (
                  <div className={classes.liveAuctionBtn}>
                    <LiveAuctionIcon />
                    <span>Live Auction</span>
                  </div>
                ) : (
                  <div className={classes.closedBtn}>
                    <ClosedIcon />
                    <span>Closed</span>
                  </div>
                ))}
              {/* claim or Owner address */}
              {media?.FractionalizeData?.ownerAddress === user.address ? (
                <Box display="flex" alignItems="center" justifyContent="space-between" color="#431AB7" mt={3} fontSize="14px">
                  <Box mr={3}>
                    <Box mb={0.5}>Reward accumulated</Box>
                    <Box fontSize="18px" fontWeight={800}>
                      {media?.FractionalizeData?.rewardAccumulated ?? "0"} ETH
                    </Box>
                  </Box>
                  <button className={classes.button} style={{ height: "40px" }} onClick={handleClaimReward}>
                    Claim
                  </button>
                </Box>
              ) : (
                <Box display="flex" alignItems="center" color="#1A1B1C" fontSize="16px" mt={3}>
                  Owner address
                  <Box display="flex" alignItems="center" className={classes.addressBox}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <circle cx="6" cy="6" r="6" fill="#F2C94C" />
                    </svg>
                    {media?.FractionalizeData?.ownerAddress
                      ? media.FractionalizeData.ownerAddress.substr(0, 8) +
                      " ... " +
                      media?.FractionalizeData?.ownerAddress.substr(-8)
                      : ""}
                  </Box>
                </Box>
              )}

              <hr className={classes.divider} />

              {/* price info row - reserve price, fee, total supply */}
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" flexDirection="column">
                  <span className={classes.fractionTitle}>Reserve Price</span>
                  <span className={classes.fractionValue}>
                    {formatNumber(
                      media?.FractionalizeData?.listPrice,
                      media?.FractionalizeData?.listToken,
                      4
                    )}
                  </span>
                </Box>
                <Box display="flex" flexDirection="column">
                  <span className={classes.fractionTitle}>Curator Fee</span>
                  <span className={classes.fractionValue}>{media?.FractionalizeData?.fee ?? 0}%</span>
                </Box>
                <Box display="flex" flexDirection="column">
                  <span className={classes.fractionTitle}>Total Sypply</span>
                  <span className={classes.fractionValue}>{media?.FractionalizeData?.supply ?? 0}</span>
                </Box>
              </Box>

              <hr className={classes.divider} />

              {/* button row - Buyout NFT, Update reserve price */}
              {media?.FractionalizeData?.status !== "Auction" && (
                <Box display="flex" alignItems="center" mb={3}>
                  <button
                    className={classes.button}
                    onClick={handleOpenByoutNFT}
                    style={{ marginRight: "16px" }}
                  >
                    Buyout NFT
                  </button>
                  <button className={classes.button} onClick={handleOpenUpdateReservePrice}>
                    Update reserve price
                  </button>
                </Box>
              )}

              {media?.FractionalizeData?.status === "Auction" ? (
                isAuctionLive ? (
                  //case Live Auction
                  <>
                    <Box paddingBottom={3}>
                      <AuctionDetails media={media} />
                    </Box>
                    <ExchangeBox media={media} handleRefresh={loadData} />
                  </>
                ) : (
                  //case Closed (auction ended)
                  <AuctionDetails media={media} />
                )
              ) : (
                //case Live Sale
                <ExchangeBox media={media} handleRefresh={loadData} />
              )}
            </Grid>
            {isMobile && (
              <Grid item xs={12} sm={6}>
                {media?.FractionalizeData?.status !== "Auction" && (
                  <div className={classes.tableContainer}>
                    <CustomTable
                      headers={tradingTableHeader}
                      rows={fractionalizeOwnershipData}
                      placeholderText="No History"
                      theme="offers blue"
                    />
                    {media?.FractionalizeData?.status !== "Auction" && isTablet && (
                      <div className={classes.viewAll} onClick={handleOpenViewAllTransacions} style={{ position: "absolute", right: 16, top: 16, margin: 0, fontSize: 14, color: "#DDFF57" }}>
                        View All
                      </div>
                    )}
                  </div>
                )}
                {media?.FractionalizeData?.status !== "Auction" && !isTablet && (
                  <div className={classes.viewAll} onClick={handleOpenViewAllTransacions}>
                    View All
                  </div>
                )}
              </Grid>
            )}
          </Grid>
        </Box>
        {openMediaPhotoDetailModal && (
          <MediaPhotoDetailsModal
            isOpen={openMediaPhotoDetailModal}
            onClose={handleCloseMediaPhotoDetailModal}
            imageURL={
              media?.Type === "VIDEO_TYPE"
                ? media?.UrlMainPhoto
                : media?.Url ||
                media?.url ||
                `https://source.unsplash.com/random/${Math.floor(Math.random() * 1000)}`
            }
          />
        )}
        {openByoutNFT && (
          <BuyoutNFTModal
            open={openByoutNFT}
            media={media}
            onClose={handleCloseByoutNFT}
            handleRefresh={loadData}
          />
        )}
        {openUpdateReservePrice && (
          <SetReservePriceModal
            open={openUpdateReservePrice}
            onClose={handleCloseUpdateReservePrice}
            media={media}
            handleRefresh={loadData}
          />
        )}
      </LoadingWrapper>
    </div>
  );
};

export default FractionPage;
