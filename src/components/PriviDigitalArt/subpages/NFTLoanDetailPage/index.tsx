import React, { useEffect, useState, useCallback } from "react";
import Axios from "axios";
import cls from "classnames";
import Moment from "react-moment";
import { useHistory, useParams } from "react-router-dom";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import { Hidden, useMediaQuery } from "@material-ui/core";

import { Avatar, Color, FontSize, PrimaryButton, SecondaryButton, Text } from "shared/ui-kit";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import { useTypedSelector } from "store/reducers/Reducer";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import Box from "shared/ui-kit/Box";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";
import URL from "shared/functions/getURL";
import { switchNetwork } from "shared/functions/metamask";

import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import BidModal from "components/PriviDigitalArt/modals/BidModal";
import RepayLoanModal from "components/PriviDigitalArt/modals/RepayLoanModal";
import { SharePopup } from "shared/ui-kit/SharePopup";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { getUserAvatar } from "shared/services/user/getUserAvatar";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";

import { MediaPhotoDetailsModal } from "../../modals/MediaPhotoDetailsModal";
import { useLoanViewStyles } from "./index.styles";
import DefaultConfig from "./Chart/DefaultConfig";
import PrintLoanChart from "./Chart";

import { LoanBlockchainNet } from "shared/constants/constants";
import { getLoanChainImageUrl } from "shared/functions/chainFucntions";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "shared/ipfs/get";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { StyledSkeleton } from "shared/ui-kit/Styled-components/StyledComponents";

const NFTLoanDetailPage = () => {
  const classes = useLoanViewStyles();
  const user = useTypedSelector(state => state.user);
  const history = useHistory();
  const params: { id?: string } = useParams();

  const isMobileScreen = useMediaQuery("(max-width:400px)");
  const isTableScreen = useMediaQuery("(max-width:550px)");

  const { followUser, unfollowUser, isUserFollowed } = useUserConnections();
  const { convertTokenToUSD } = useTokenConversion();

  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);

  const [loan, setLoan] = useState<any>(null);
  const [loanMedia, setLoanMedia] = useState<any>(null);
  const [loadingLoan, setLoadingLoan] = useState<boolean>(false);
  const [creator, setCreator] = React.useState<any>();
  const [isFollowing, setIsFollowing] = React.useState<number>(0);
  const [loanEnded, setLoanEnded] = React.useState<boolean>(true);
  const [endTime, setEndTime] = useState<any>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [status, setStatus] = useState<any>(""); // show status of the operation
  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [config, setConfig] = useState<any>(DefaultConfig);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);
  const [totalViews, setTotalViews] = useState<any>(0);
  const [loanBidHistory, setLoanBidHistory] = useState<any>([]);

  const [openShareMenu, setOpenShareMenu] = React.useState(false);
  const [openRepayLoanModal, setOpenRepayLoanModal] = useState<any | boolean>(false);
  const [openBidModal, setOpenBidModal] = useState<boolean>(false);
  const [isShowingMediaPhotoDetailModal, setIsShowingMediaPhotoDetailModal] = useState<boolean>(false);

  const [hash, setHash] = useState<string>("");
  const [network, setNetwork] = useState<string>("");
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);

  const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);

  const { account, library, chainId } = useWeb3React();

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  const [imageIPFS, setImageIPFS] = useState({});

  useEffect(() => {
    fetchLoanDetail();
  }, []);

  const fetchLoanDetail = useCallback(() => {
    setLoadingLoan(true);
    Axios.get(`${URL()}/nftLoan/getNFTLoan/${params.id}`)
      .then(res => {
        const data = res.data;
        if (data.success) {
          setLoan(data.data);
          setLoanMedia(data.data?.media);
          setTotalViews(data.data?.totalViews ?? 0);
          const bidHistory = data.data.bidHistory;
          if (bidHistory.length) {
            const newConfig = { ...config };
            let xLabels: any = [];
            let yLabels: any = [];
            bidHistory.map(bid => {
              xLabels.unshift(0);
              yLabels.unshift(bid.amount);
            });
            if (bidHistory.length < 10) {
              const temp = new Array(10 - bidHistory.length).fill(0);
              xLabels = [...temp, ...xLabels];
              yLabels = [...temp, ...yLabels];
            }
            newConfig.config.data.labels = xLabels;
            newConfig.config.data.datasets[0].data = yLabels;
            setConfig(newConfig);
          } else {
            const newConfig = { ...config };
            newConfig.config.data.labels = new Array(10).fill(0);
            newConfig.config.data.datasets[0].data = [];
            setConfig(newConfig);
          }
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingLoan(false);
      });
  }, [params.id]);

  useEffect(() => {
    if (loan) {
      const history: any[] = [];
      loan.bidHistory.forEach(element => {
        if (!history.find(item => item.bidder === element.bidder)) {
          history.push(element);
        }
      });
      const getBidHistory = async () => {
        const newData: any = [];
        await Promise.all(
          history.map(async item => {
            const response = await Axios.get(`${URL()}/user/getBasicUserInfo/${item.bidder}`);
            if (response.data.success && response.data.data) {
              const data = response.data.data;
              const bidder: any = {
                ...data,
                name: data.name ?? `${data.firstName} ${data.lastName}`,
              };
              newData.push({ ...item, bidder });
            }
          })
        );
        setLoanBidHistory(newData);
      };
      getBidHistory();
    }
  }, [loan]);

  useEffect(() => {
    if (loanMedia && loanMedia.cid) {
      getImageIPFS(loanMedia.cid);
    }
  }, [loanMedia, ipfs]);

  const getImageIPFS = async (cid: string) => {
    let files = await onGetNonDecrypt(cid, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      setImageIPFS("data:image/png;base64," + base64String);
    }
  };

  const handleOpenRepayLoan = () => {
    setOpenRepayLoanModal(loan);
  };
  const handleCloseRepayLoan = () => {
    setOpenRepayLoanModal(false);
  };

  const handleOpenBidModal = () => {
    setOpenBidModal(true);
  };

  const handleCloseBidModal = () => {
    setOpenBidModal(false);
  };

  const handleOpenShareMenu = () => {
    setOpenShareMenu(!openShareMenu);
  };

  const handleCloseShareMenu = () => {
    setOpenShareMenu(false);
  };

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "Transaction",
      headerAlign: "center",
    },
    {
      headerName: "From",
      headerAlign: "center",
    },
    {
      headerName: "Date",
      headerAlign: "center",
    },
    {
      headerName: "Amount",
      headerAlign: "center",
    },
    {
      headerName: "Chain",
      headerAlign: "center",
    },
    {
      headerName: "Privi Scan",
      headerAlign: "center",
    },
  ];

  const handleFollow = e => {
    e.stopPropagation();
    e.preventDefault();
    if (!loanMedia) return;

    if (!isFollowing) {
      followUser(loanMedia.CreatorId).then(_ => setIsFollowing(1));
    } else {
      unfollowUser(loanMedia.CreatorId).then(_ => setIsFollowing(0));
    }
  };

  useEffect(() => {
    if (!loan || !loanMedia) return;
    const transactions = [
      ...loan.bidHistory.map((bid: any) => ({
        ...bid,
        id: bid.bidder,
        type: "Bid",
      })),
      ...loan.repayments.map((repayment: any) => ({
        ...repayment,
        id: loan.CreatorAddress,
        type: "Repayment",
      })),
      ...loan.withdrawals.map((withdrawal: any) => ({
        ...withdrawal,
        id: loan.CreatorAddress,
        type: "Withdrawal",
      })),
    ].sort((a, b) => a.date - b.date);
    const data: Array<Array<CustomTableCellInfo>> = transactions.map(row => {
      let priviScanLink = "https://priviscan.io/tx/";
      if (loanMedia.BlockchainNetwork.toLowerCase().includes("polygon")) {
        priviScanLink = "https://mumbai.polygonscan.com/tx/" + (row.txnHash ?? "");
      } else if (loanMedia.BlockchainNetwork.toLowerCase().includes("ethereum")) {
        priviScanLink = "https://rinkeby.etherscan.io/tx/" + (row.txnHash ?? "");
      }
      return [
        {
          cell: row.type,
          cellAlign: "center",
        },
        {
          cell: <Box className={cls(classes.blue, classes.ellipsis)}>{row.id}</Box>,
          cellAlign: "center",
        },
        {
          cell: <Moment format="DD/MM/YY">{row.date}</Moment>,
          cellAlign: "center",
        },
        {
          cell: `${row.amount ?? "N/A"} ${loan.FundingToken ?? "ETH"}`,
          cellAlign: "center",
        },
        {
          cell: (
            <img
              src={getLoanChainImageUrl(loan.Chain, loan.media.BlockchainNetwork)}
              alt={"chain"}
              className={classes.chain}
            />
          ),
          cellAlign: "center",
        },
        {
          cell: (
            <Box>
              <a target="_blank" rel="noopener noreferrer" href={priviScanLink}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d="M16.75 1.00001L6.74997 11M16.75 1.00001L16.75 7.00001M16.75 1.00001L10.75 1M6.75 1.00001H0.75V17H16.75V11"
                    stroke="#9EACF2"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </Box>
          ),
          cellAlign: "center",
        },
      ];
    });
    setTableData(data);
  }, [loan, loanMedia]);

  const handleFruit = type => {
    let body = {};
    if (
      (loanMedia.BlockchainNetwork && loanMedia.BlockchainNetwork.toLowerCase().includes("privi")) ||
      (loanMedia.blockchain && loanMedia.blockchain.toLowerCase().includes("privi"))
    ) {
      body = {
        userId: user.id,
        fruitId: type,
        mediaAddress: loanMedia.id,
        mediaType: loanMedia.Type,
        tag: "privi",
      };
    } else {
      body = {
        userId: user.id,
        fruitId: type,
        mediaAddress: loanMedia.id,
        mediaType: loanMedia.type,
        tag: loanMedia.tag,
        subCollection: loanMedia.collection,
      };
    }

    Axios.post(`${URL()}/media/fruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const loanCopy = { ...loanMedia };
        loanCopy.fruits = resp.fruitsArray;

        setLoanMedia(loanCopy);
      }
    });
  };

  useEffect(() => {
    if (loanMedia && loanMedia.Bookmarks && loanMedia.Bookmarks.some((id: string) => id === user.id))
      setBookmarked(true);

    if (loanMedia && user) {
      if (loan.CreatorAddress) {
        if (loan.CreatorAddress === user?.address) {
          setCreator({
            ...user,
            name: `${user.firstName} ${user.lastName}`,
          });
        } else {
          const getCreatorData = async () => {
            await Axios.get(`${URL()}/user/getBasicUserInfo/${loan.CreatorAddress}`)
              .then(response => {
                if (response.data.success && response.data.data) {
                  let data = response.data.data;

                  setCreator({
                    ...data,
                    name: data.name ?? `${data.firstName} ${data.lastName}`,
                  });
                } else {
                  setCreator({
                    imageUrl: getRandomAvatarForUserIdWithMemoization(loanMedia.creator),
                    name: "User name",
                    urlSlug: "",
                  });
                }
              })
              .catch(error => {
                console.log(error);
              });
          };

          getCreatorData();
        }
      } else {
        setCreator({
          imageUrl: getRandomAvatarForUserIdWithMemoization(loanMedia.creator),
          name: loanMedia.creator,
          urlSlug: loanMedia.creator,
        });
      }
    }
  }, [loanMedia, user]);

  useEffect(() => {
    if (loan) {
      Axios.post(`${URL()}/nftLoan/registerLoanView`, {
        loanId: loan.id,
      }).then(res => {
        const resp = res.data;
        if (resp.success) {
          setTotalViews(resp.data.totalViews ?? 0);
        }
      });
      const timerId = setInterval(() => {
        const now = new Date();
        let delta = Math.floor(loan.Duration ? loan.CreationDate + loan.Duration - now.getTime() / 1000 : 0);
        if (delta < 0) {
          setLoanEnded(true);
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
          setLoanEnded(false);
          setEndTime({
            days,
            hours,
            minutes,
            seconds,
          });
        }
      }, 1000);

      return () => clearInterval(timerId);
    } else return;
  }, [loan]);

  useEffect(() => {
    if (creator) setIsFollowing(isUserFollowed(creator.id));
  }, [creator]);

  const bookmarkMedia = () => {
    Axios.post(`${URL()}/media/bookmarkMedia/${loanMedia.MediaSymbol ?? loanMedia.id}`, {
      userId: user.id,
      mediaType: loanMedia.Type,
    })
      .then(res => {
        setStatus({
          msg: "Bookmarked media",
          key: Math.random(),
          variant: "success",
        });
        setBookmarked(true);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const unBookmarkMedia = () => {
    Axios.post(`${URL()}/media/removeBookmarkMedia/${loanMedia.MediaSymbol ?? loanMedia.id}`, {
      userId: user.id,
      mediaType: loanMedia.Type,
    })
      .then(res => {
        setStatus({
          msg: "Removed bookmark",
          key: Math.random(),
          variant: "success",
        });
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

  const handleOpenMediaPhotoDetailModal = () => {
    setIsShowingMediaPhotoDetailModal(true);
  };

  const handleCloseMediaPhotoDetailModal = () => {
    setIsShowingMediaPhotoDetailModal(false);
  };

  const handleOpenTransactionModal = network => {
    setOpenTransactionModal(true);
    setTransactionInProgress(true);
    setNetwork(network);
  };

  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
  };

  const handleEndLoan = async () => {
    const targetChain = LoanBlockchainNet.find(net => net.value === loanMedia.BlockchainNetwork);
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        setStatus({
          msg: "Got failed while switching over to polygon netowrk",
          key: Math.random(),
          variant: "error",
        });
        return;
      }
    }

    const web3APIHandler = targetChain.apiHandler;
    const web3Config = targetChain.config;
    const web3 = new Web3(library.provider);

    handleOpenTransactionModal(targetChain?.value);

    const tokenContractAddress = loanMedia.TokenContractAddress || web3Config.CONTRACT_ADDRESSES.PRIVIERC721;
    const tokenId = loanMedia.BlockchainId;
    web3APIHandler.Loan.endAuction(web3, account!, { tokenContractAddress, tokenId }).then(async res => {
      if (res) {
        const tx = res.transaction;
        const mediaSymbol = loanMedia.MediaSymbol;
        const blockchainRes = { output: { UpdateMedias: {}, Transactions: {} } };
        blockchainRes.output.UpdateMedias[mediaSymbol] = {
          HasNFTLoan: false,
          Type: loanMedia.Type,
        };
        blockchainRes.output.Transactions[tx.Id] = [tx];
        const body = {
          BlockchainRes: blockchainRes,
          AdditionalData: {
            MediaSymbol: mediaSymbol,
          },
        };
        setHash(tx.Id);
        setTransactionInProgress(false);
        setTransactionSuccess(true);
        const response = await Axios.post(`${URL()}/nftloan/endCollateralizedNFT/v2_p`, body);
        if (response.data.success) {
          setStatus({
            msg: "NFT loan has been ended successfully",
            key: Math.random(),
            variant: "success",
          });
          history.push("/loan");
        } else {
          setStatus({
            msg: "Failed to complete NFT loan",
            key: Math.random(),
            variant: "error",
          });
        }
      } else {
        setTransactionInProgress(false);
        setTransactionSuccess(false);
      }
    });
  };

  return (
    <Box style={{ position: "relative", width: "100%" }}>
      <div className={classes.content}>
        <BackButton dark overrideFunction={() => history.push("/loan")} />
        {loan && loanMedia ? (
          <LoadingWrapper loading={loadingLoan} theme={"blue"} height="calc(100vh - 100px)">
            <Box
              mt="24px"
              display="flex"
              justifyContent="space-between"
              width="100%"
              flexDirection={isTableScreen || isMobileScreen ? "column" : "row"}
            >
              <Box display="flex" alignItems="center">
                <div className={classes.mediaName}>
                  {loanMedia.MediaName ?? loanMedia.name ?? loanMedia.title ?? "Media Name"}
                </div>
                {loanMedia.blockchain ? (
                  <img
                    src={require(`assets/priviIcons/${
                      loanMedia.blockchain?.toLowerCase() ?? "privi"
                    }_icon.png`)}
                    alt={"chain"}
                    className={classes.chain}
                  />
                ) : null}
              </Box>
              {loan.CreatorAddress === user?.address && !!loan?.Debt && loan?.Debt > 0 && (
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex">
                    <div className={classes.debtTitle}>Debt</div>
                    <div className={classes.debt}>
                      {`${loan?.FundingToken} ${loan?.Debt ?? 0}`}
                      {/* <span>(${convertTokenToUSD(loan?.FundingToken, loan?.Debt ?? 0)})</span> */}
                    </div>
                  </Box>
                  <SecondaryButton
                    size="medium"
                    onClick={() => handleOpenRepayLoan()}
                    className={classes.secondary}
                  >
                    Repay loan
                  </SecondaryButton>
                </Box>
              )}
            </Box>

            <Box className={classes.greenBox} mt="16px" mb="16px" width="100%">
              <Hidden only="xs">
                {loan.BidderAddress && (
                  <Box>
                    <label>LOAN PRINCIPAL</label>
                    <h3>{`${loan?.FundingToken ?? "ETH"} ${loan.Bid || 0}`}</h3>
                  </Box>
                )}
                <Box height="53px">
                  <label>INTEREST</label>
                  <h3>{`${loan?.FeePct ?? "0"}%`}</h3>
                </Box>
                <Box height="53px">
                  <label>{!loanEnded ? "LOAN ENDING IN" : "LOAN ENDED"}</label>
                  <h3>
                    {!loanEnded &&
                      `${endTime.days ? `${String(endTime.days).padStart(2, "0")}d` : ""} ${String(
                        endTime.hours
                      ).padStart(2, "0")}h ${String(endTime.minutes).padStart(2, "0")}m ${String(
                        endTime.seconds
                      ).padStart(2, "0")}s`}
                  </h3>
                </Box>
                <Box>
                  {loan.CreatorAddress !== user?.address && !loanEnded ? (
                    <PrimaryButton
                      size="medium"
                      className={classes.detailPrimary}
                      onClick={handleOpenBidModal}
                    >
                      {loan?.BidderAddress ? "Place a higher bid" : "Place a bid"}
                    </PrimaryButton>
                  ) : null}
                </Box>
              </Hidden>
              <Hidden smUp>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
                  {loan?.BidderAddress && (
                    <Box>
                      <label>LOAN PRINCIPAL</label>
                      <h3>{`${loan?.FundingToken ?? "ETH"} ${loan?.Bid || 0}`}</h3>
                    </Box>
                  )}
                  <Box>
                    <label>INTEREST</label>
                    <h3>{`${loan?.FeePct ?? "0"}%`}</h3>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" mt={3}>
                  <Box>
                    <label>{!loanEnded ? "LOAN ENDING IN" : "LOAN ENDED"}</label>
                    <h3>
                      {!loanEnded &&
                        `${endTime.days ? `${String(endTime.days).padStart(2, "0")}d` : ""} ${String(
                          endTime.hours
                        ).padStart(2, "0")}h ${String(endTime.minutes).padStart(2, "0")}m ${String(
                          endTime.seconds
                        ).padStart(2, "0")}s`}
                    </h3>
                  </Box>
                  <Box>
                    {loan.CreatorAddress !== user?.address && !loanEnded ? (
                      <PrimaryButton
                        size="medium"
                        className={classes.detailPrimary}
                        onClick={handleOpenBidModal}
                      >
                        {loan?.BidderAddress ? "Place a higher bid" : "Place a bid"}
                      </PrimaryButton>
                    ) : null}
                  </Box>
                </Box>
              </Hidden>
            </Box>

            <Box
              display="flex"
              flexDirection={isMobileScreen || isTableScreen ? "column" : "row"}
              mt={2}
              mb={3}
              width="100%"
            >
              <Box
                width={isMobileScreen || isTableScreen ? 1 : 0.5}
                mr={isMobileScreen || isTableScreen ? 0 : "20px"}
                onClick={handleOpenMediaPhotoDetailModal}
              >
                <img
                  src={
                    loanMedia.cid
                      ? imageIPFS
                      : loanMedia.Type === "VIDEO_TYPE"
                      ? loanMedia.UrlMainPhoto
                      : loanMedia.Url || loanMedia.url || require("assets/backgrounds/digital_art_1.png")
                  }
                  className={classes.detailImg}
                  width="100%"
                />
              </Box>
              <Box
                width={isMobileScreen || isTableScreen ? 1 : 0.5}
                ml={isMobileScreen || isTableScreen ? 0 : "20px"}
                py={2}
              >
                <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
                  <Box display="flex" flexDirection={isMobileScreen ? "column" : "row"} alignItems="center">
                    <Box display="flex" flexDirection="row" alignItems="center">
                      {creator ? (
                        <div
                          className={classes.avatar}
                          style={{
                            backgroundImage: creator
                              ? `url(${getUserAvatar({
                                  id: creator.id,
                                  anon: creator.anon,
                                  hasPhoto: creator.hasPhoto,
                                  anonAvatar: creator.anonAvatar,
                                  url: creator.url,
                                })})`
                              : "none",
                          }}
                          onClick={() => creator.urlSlug && history.push(`/${creator.urlSlug}/profile`)}
                        />
                      ) : (
                        <StyledSkeleton width={40} height={40} animation="wave" variant="circle" />
                      )}
                      <Box display="flex" flexDirection="column" ml={0.25} mr={1.25}>
                        <Text color={Color.Black} className={classes.creatorName} style={{ marginBottom: 4 }}>
                          {creator?.name ?? <StyledSkeleton width={120} animation="wave" />}
                        </Text>
                        <Text className={classes.creatorName}>
                          {creator?.urlSlug ? (
                            `@${creator.urlSlug}`
                          ) : (
                            <StyledSkeleton width={80} animation="wave" />
                          )}
                        </Text>
                      </Box>
                    </Box>
                    {user && loan.CreatorAddress !== user?.address && (
                      <Hidden smDown>
                        <SecondaryButton size="medium" onClick={handleFollow} className={classes.followBtn}>
                          {isFollowing === 2 ? "Unfollow" : isFollowing === 1 ? "Requested" : "Follow"}
                        </SecondaryButton>
                      </Hidden>
                    )}
                  </Box>
                  <Box display="flex" flexDirection="row" alignItems="center">
                    <Box className={classes.fruitsContainer}>
                      <FruitSelect fruitObject={loanMedia} onGiveFruit={handleFruit} />
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
                </Box>
                {user && loan.CreatorAddress !== user?.address && (
                  <Hidden mdUp>
                    <Box display="flex" justifyContent="flex-end">
                      <SecondaryButton size="medium" onClick={handleFollow} className={classes.followBtn}>
                        {isFollowing === 2 ? "Unfollow" : isFollowing === 1 ? "Requested" : "Follow"}
                      </SecondaryButton>
                    </Box>
                  </Hidden>
                )}
                <SharePopup
                  item={{ ...loanMedia, Type: "DIGITAL_ART_TYPE_LOAN" }}
                  openMenu={openShareMenu}
                  anchorRef={anchorShareMenuRef}
                  handleCloseMenu={handleCloseShareMenu}
                />
                <Box
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={2}
                >
                  {loanBidHistory.length > 0 && (
                    <Box display="flex" flexDirection="row" alignItems="center">
                      {loanBidHistory.map((bid: any) => (
                        <Avatar
                          key={`artist-${bid.id}`}
                          className={classes.artist}
                          size="small"
                          url={getUserAvatar({
                            id: bid.bidder.urlSlug,
                            anon: bid.bidder.anon,
                            hasPhoto: !!bid.bidder.url,
                            anonAvatar: bid.bidder.anonAvatar,
                            url: bid.bidder.url,
                          })}
                        />
                      ))}
                      <Text color={Color.Purple} ml={2}>
                        Ownership History
                      </Text>
                    </Box>
                  )}
                  <Box display="flex" flexDirection="row" my={2} ml={isMobileScreen || isTableScreen ? 2 : 0}>
                    {/* <Text size={FontSize.XL} mr={5}>
                      ❤️ {loanMedia.NumLikes || 0}
                    </Text> */}
                    <Text size={FontSize.XL} mr={isMobileScreen ? 2 : isTableScreen ? 3 : 5}>
                      💾 {loanMedia.shareCount || 0}
                    </Text>
                    <div>
                      <Text size={FontSize.XL} mr={isMobileScreen ? 2 : isTableScreen ? 3 : 5}>
                        👀 {totalViews}
                      </Text>
                    </div>
                  </Box>
                </Box>
                <hr className={classes.divider} />
                {(loanMedia.description || loanMedia.MediaDescription || loanMedia.Description) && (
                  <>
                    <div className={classes.label}>Description</div>
                    <div className={classes.description}>
                      {loanMedia.description ?? loanMedia.MediaDescription ?? loanMedia.Description ?? ""}
                    </div>
                    <hr className={classes.divider} />
                  </>
                )}
                {loan.CreatorAddress === user?.address && loanEnded && loanBidHistory.length ? (
                  <PrimaryButton
                    size="medium"
                    className={classes.detailPrimary}
                    mb={3}
                    onClick={handleEndLoan}
                  >
                    End Loan
                  </PrimaryButton>
                ) : null}
                <div className={classes.label}>Bids History</div>
                {config && <PrintLoanChart config={config} loan={loan} />}
              </Box>
            </Box>

            <div className={classes.transactionsSection}>
              <div className={classes.transactionsHeader}>
                <div className={classes.label}>Transactions</div>
                {loan.CreatorAddress !== user?.address && !loanEnded ? (
                  <PrimaryButton
                    size="medium"
                    className={classes.detailSecondary}
                    onClick={handleOpenBidModal}
                  >
                    {loan?.BidderAddress ? "Place a higher bid" : "Place a bid"}
                  </PrimaryButton>
                ) : null}
              </div>
              <div className={`${classes.transactionsTable} position-table`}>
                <CustomTable
                  theme="art green"
                  headers={tableHeaders}
                  rows={tableData}
                  placeholderText="No data available"
                />
              </div>
            </div>

            {status && (
              <AlertMessage
                key={status.key}
                message={status.msg}
                variant={status.variant}
                onClose={() => setStatus(undefined)}
              />
            )}
            {openBidModal && (
              <BidModal
                loan={loan}
                setLoan={setLoan}
                refresh={() => {
                  fetchLoanDetail();
                }}
                open={openBidModal}
                onClose={handleCloseBidModal}
                previousBid={loan.Bid || 0}
              />
            )}
            {openRepayLoanModal && (
              <RepayLoanModal
                open={openRepayLoanModal !== false}
                onClose={handleCloseRepayLoan}
                loan={openRepayLoanModal}
                reload={() => {}}
              />
            )}
            {isShowingMediaPhotoDetailModal && (
              <MediaPhotoDetailsModal
                isOpen={isShowingMediaPhotoDetailModal}
                onClose={handleCloseMediaPhotoDetailModal}
                imageURL={
                  loanMedia.cid
                    ? imageIPFS
                    : loanMedia.Type === "VIDEO_TYPE"
                    ? loanMedia.UrlMainPhoto
                    : loanMedia.Url || loanMedia.url || require("assets/backgrounds/digital_art_1.png")
                }
              />
            )}
          </LoadingWrapper>
        ) : (
          <LoadingWrapper loading={true} theme={"blue"} height="calc(100vh - 100px)" />
        )}
      </div>
      <TransactionProgressModal
        open={openTransactionModal}
        onClose={handleCloseTransactionModal}
        transactionInProgress={transactionInProgress}
        transactionSuccess={transactionSuccess}
        hash={hash}
        network={network}
      />
    </Box>
  );
};

export default React.memo(NFTLoanDetailPage);
