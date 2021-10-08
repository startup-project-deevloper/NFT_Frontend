import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import cls from "classnames";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";

import { Grid } from "@material-ui/core";

import { SocialPrimaryButton } from "components/PriviSocial/index.styles";
import { CircularLoadingIndicator, Header2 } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { getUser, getUsersInfoList } from "store/selectors";
import URL from "shared/functions/getURL";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { removeUndef } from "shared/helpers";
import { generateUniqueId } from "shared/functions/commonFunctions";
import { makePoints, makeLabels } from "shared/ui-kit/Chart/Chart-Utils";
import CardsGrid from "./components/CardsGrid";
import MyWall from "./components/MyWall";
import InfoPane from "./components/InfoPane";
import SocialChartConfig from "./components/ProfileChart/configs/Social-Chart-Config";
import FTChartConfig from "./components/ProfileChart/configs/FT-Chart-Config";
import { homeStyles } from "./index.styles";
import ProfileEditModal from "./modals/ProfileEdit";
import { getProfileTabsInfo } from "shared/services/API";
import CreateSocialTokenModal from "./modals/CreateSocialTokenModal";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import PrintChart from "shared/ui-kit/Chart/Chart";

const profileCardsOptions = ["Social", "Crew", "Media", "Digital NFT Pods"];
const profileSubTabs = ["All", "Owned", "Curated", "Liked"];

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.userProfile === currProps.userProfile &&
    prevProps.userId === currProps.userId &&
    prevProps.ownUser === currProps.ownUser
  );
};

const FreeHoursChartConfig = {
  config: {
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
      datasets: [
        {
          type: "line",
          data: [
            { x: "Jan", y: 1 },
            { x: "Feb", y: 10 },
            { x: "Mar", y: 20 },
            { x: "Apr", y: 15 },
            { x: "May", y: 13 },
            { x: "Jun", y: 15 },
            { x: "Jul", y: 10 },
          ],
          backgroundColor: "rgba(0, 255, 21, 0.3)",
          borderColor: "#03CD94",
          pointBorderColor: "#F2FAF6",
          pointBackgroundColor: "#03CD94",
          pointHoverBackgroundColor: "#0FCEA6",
          borderWidth: 2,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartArea: {
        backgroundColor: "#F5FCF8",
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
          top: 50,
          bottom: -10,
        },
      },

      scales: {
        xAxes: [
          {
            display: true,
            gridLines: {
              color: "rgba(177, 255, 0, 0.3)",
              lineWidth: 100,
              drawBorder: false,
            },
            ticks: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            display: false,
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

const Home = React.memo(
  ({
    userProfile,
    userId,
    ownUser,
    getBasicInfo,
    toggleAnonymousMode,
  }: {
    userProfile: any;
    userId: string;
    ownUser: boolean;
    getBasicInfo: any;
    toggleAnonymousMode: any;
  }) => {
    const classes = homeStyles();

    // STORE
    const userSelector = useSelector(getUser);
    const users = useSelector(getUsersInfoList);

    // HOOKS
    const { showAlertMessage } = useAlertMessage();

    // TABS
    const [myBadges, setMyBadges] = useState<any[]>([]);
    const [subTabsValue, setSubTabsValue] = useState<number>(0);

    // PROFILE USER
    const [profileUserId, setProfileUserId] = useState<string>("");
    /* --------------- Balance History Graph --------------- */
    const [socialChart, setSocialChart] = useState<any>(SocialChartConfig);
    const [ftChart, setFtChart] = useState<any>(FTChartConfig);

    const [mySocials, setMySocials] = useState<any[]>([]); // only Privi
    const [socialList, setSocialList] = useState<any[]>([]); // Privi + external tokens
    const [myCommunities, setMyCommunities] = useState<any[]>([]);
    const [myPodsMedia, setMyPodsMedia] = useState<any[]>([]); // only Privi
    const [podList, setPodList] = useState<any[]>([]); // Privi + external tokens
    const [myMedia, setMyMedia] = useState<any[]>([]);
    const [myPlaylists, setMyPlaylists] = useState<any[]>([]);

    const [paginationLastId, setPaginationLastId] = useState<any>(null);
    const [isLastNFT, setIsLastNFT] = useState<boolean>(true);
    const [pagination, setPagination] = useState<number>(1);
    const [paginationHasMore, setPaginationHasMore] = useState<boolean>(true);
    const [paginationLastLikedMedia, setPaginationLastLikedMedia] = useState<string>("owner");
    const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

    //wall (ownUser only)
    const [displayWall, setDisplayWall] = useState<boolean>(false);

    //modals
    const [openEditProfileModal, setOpenEditProfileModal] = useState<boolean>(false);
    const [openCreateSocialTokenModal, setOpenCreateSocialTokenModal] = useState<boolean>(false);

    const handleOpenEditProfileModal = () => {
      setOpenEditProfileModal(true);
    };

    const handleCloseEditProfileModal = () => {
      setOpenEditProfileModal(false);
    };

    const handleCloseCreateSocialTokenModal = () => {
      setOpenCreateSocialTokenModal(false);
    };

    useEffect(() => {
      if (users && users.length > 0) {
        let url = window.location.href.split("/");
        const usrSlug = url[url.length - 1] === "" ? url[url.length - 2] : url[url.length - 1];
        const id = users.find(u => u.urlSlug === usrSlug)?.id || usrSlug;
        setProfileUserId(id);
      }
    }, [window.location.href, users]);

    useEffect(() => {
      if (profileUserId) {
        getmyStats();
        getAllInfoProfile();
        getAllBalanceHistoryInfo();
      }
    }, [profileUserId]);

    const getmyStats = () => {
      setIsDataLoading(true);
      axios
        .get(`${URL()}/user/getUserCounters/${profileUserId}`)
        .then(response => {
          const resp = response.data;
          if (resp.success) {
            const { badges, ...others } = resp.data;
            setMyBadges(badges);
          } else {
            setMyBadges([]);
          }
          setIsDataLoading(false);
        })
        .catch(_ => {
          showAlertMessage(`Error getting user stats`, { variant: "error" });
          setIsDataLoading(false);
        });
    };

    const getAllBalanceHistoryInfo = () => {
      if (ownUser) {
        const config = {
          params: {
            userId: profileUserId,
          },
        };
        setIsDataLoading(true);
        axios
          .get(`${URL()}/wallet/getUserTokenTypeBalanceHistory`, config)
          .then(response => {
            const resp = response.data;
            if (resp.success) {
              const data = resp.data;
              const socialHistory = data.socialHistory;
              const ftHistory = data.ftHistory;
              const nftHistory = data.nftHistory;
              const xSocial: number[] = [];
              const ySocial: number[] = [];
              const xFT: number[] = [];
              const yFT: number[] = [];
              const xNFT: number[] = [];
              const yNFT: number[] = [];
              socialHistory.forEach(point => {
                // const date = new Date(point.date);
                ySocial.push(point.price);
                // xSocial.push(formatDate(date));
                xSocial.push(point.date);
              });
              ftHistory.forEach(point => {
                // const date = new Date(point.date);
                yFT.push(point.price);
                // xFT.push(formatDate(date));
                xFT.push(point.date);
              });
              nftHistory.forEach(point => {
                // const date = new Date(point.date);
                yNFT.push(point.price);
                // xNFT.push(formatDate(date));
                xNFT.push(point.date);
              });
              const newSocialChart = { ...socialChart };
              newSocialChart.config.data.labels = makeLabels(xSocial, 10);
              newSocialChart.config.data.datasets[0].data = makePoints(xSocial, ySocial, 10);
              setSocialChart(newSocialChart);
              const newFtChart = { ...ftChart };
              newFtChart.config.data.labels = makeLabels(xFT, 10);
              newFtChart.config.data.datasets[0].data = makePoints(xFT, yFT, 10);
              setFtChart(newFtChart);
            }
            setIsDataLoading(false);
          })
          .catch(() => {
            setIsDataLoading(false);
          });
      }
    };

    const getAllInfoProfile = async (
      lastId = "",
      isLastNFT = true,
      pagination = 1,
      lastLikedMedia = "owner"
    ) => {
      if (userId && profileUserId) {
        try {
          setIsDataLoading(true);
          const resp = await getProfileTabsInfo(
            profileUserId,
            !profileUserId || profileUserId != userSelector.id,
            profileCardsOptions[2],
            profileSubTabs[subTabsValue],
            lastId,
            isLastNFT,
            pagination,
            lastLikedMedia
          );
          setIsDataLoading(false);
          if (resp.success && resp?.data?.myMedias) {
            setPaginationHasMore(false);
            const data = resp.data;

            const newMedias = data?.myMedias?.data ?? [];
            let medias = [...newMedias];
            let mMedia = [] as any;
            medias.forEach((m, index) => {
              if (m.State?.Curated) {
                medias[index].curatedMedia = true;
              }
              if (m.State?.Owned) {
                medias[index].ownedMedia = true;
              }
              if (m.State?.Liked) {
                medias[index].likedMedia = true;
              }
              m.ImageUrl = m.HasPhoto
                ? `${URL()}/media/getMediaMainPhoto/${m.MediaSymbol.replace(/\s/g, "")}`
                : undefined;

              const artistUser = users.find(
                user =>
                  (m.Creator && m.Creator !== "" && user.id === m.Creator) ||
                  (m.CreatorId && m.CreatorId !== "" && user.id === m.CreatorId) ||
                  (m.Requester && m.Requester !== "" && user.id === m.Requester)
              );
              if (artistUser) {
                m.Artist = {
                  name: artistUser.name ?? "",
                  imageURL: artistUser.imageURL ?? "",
                  urlSlug: artistUser.urlSlug ?? "",
                  id: artistUser.id ?? "",
                };
              } else if (m.creator) {
                m.randomAvatar = getRandomAvatarForUserIdWithMemoization(m.creator);
              } else {
                m.Artist = undefined;
              }
              medias[index].eth = m.MediaSymbol !== undefined ? false : true;

              const SavedCollabs =
                m.SavedCollabs && m.SavedCollabs.length > 0
                  ? m.SavedCollabs.map(collaborator => {
                      const collaboratorUser = users.find(user => user.id === collaborator.id);
                      return collaboratorUser
                        ? {
                            ...collaborator,
                            name: collaboratorUser.name ?? "",
                            imageURL: collaboratorUser.imageURL ?? "",
                            urlSlug: collaboratorUser.urlSlug ?? "",
                            id: collaboratorUser.id ?? "",
                          }
                        : undefined;
                    }).filter(removeUndef)
                  : undefined;

              medias[index].SavedCollabs = SavedCollabs;

              if (!m.price) {
                if (
                  m.QuickCreation &&
                  m.ViewConditions &&
                  m.ViewConditions.Price > 0 &&
                  m.ViewConditions.ViewingToken
                ) {
                  medias[index].price = `${m.ViewConditions.ViewingToken.toUpperCase()} ${
                    m.ViewConditions.Price
                  }${m.ViewConditions.ViewingType === "DYNAMIC" ? "/per sec" : ""}`;
                } else if (m.PaymentType === "FIXED" && m.FundingToken) {
                  medias[index].price = `${m.FundingToken.toUpperCase() ?? ""} ${
                    m.Price && m.Price !== 0 ? m.Price : ""
                  }`;
                } else if (m.PaymentType === "DYNAMIC" && m.FundingToken) {
                  medias[index].price = `${m.FundingToken.toUpperCase() ?? ""} ${
                    medias[index].PricePerSecond && m.PricePerSecond !== 0
                      ? m.PricePerSecond + "/per sec."
                      : ""
                  }`;
                } else medias[index].price = "";
              } else {
                if (m.price && m.price.includes("($")) {
                  //separate price from usd price
                  let price = m.price.split("(")[0];
                  let usdPrice = "(" + m.price.split("(")[1];

                  m.price = price;
                  m.usdPrice = usdPrice;
                }
              }
              mMedia.push(m);
            });

            if (data.myMedias) {
              const newMyMedia = [...mMedia];
              setMyMedia(newMyMedia);
            }
          }
        } catch (error) {
          showAlertMessage(`Error getting user stats`, { variant: "error" });
        }
      }
    };

    const dataInfo = () => {
      return {
        title: "My Media",
        data: myMedia,
      };
    };

    // add Social and NFT from external wallet, NOT COMPLETED!
    useEffect(() => {
      const newSocialList: any[] = [...mySocials];
      const newMyPodList: any[] = [...myPodsMedia];

      const ethWallet = userSelector.ethExternalWallet;

      ethWallet.forEach(extWalletObj => {
        const tokens = extWalletObj.tokens ?? [];
        tokens.forEach((tokenObj: any) => {
          const tokenType = tokenObj.tokenType ?? "";
          let imgUrl = "none";
          if (tokenObj.isOpenSea && tokenObj.openSeaImage && tokenObj.openSeaImage.includes("http"))
            imgUrl = tokenObj.openSeaImage;
          else if (tokenObj.images && tokenObj.images.large && tokenObj.images.large.includes("http"))
            imgUrl = tokenObj.images.large;
          const token = tokenObj.tokenSymbol;
          const tokenName = tokenObj.tokenName;
          // calculate balance
          const decimalPos = Number(tokenObj.tokenDecimal) ?? 0;
          const balanceStr: string = tokenObj.balance;
          const balanceStrWithDecimal =
            balanceStr.slice(0, -decimalPos) + "." + balanceStr.slice(-decimalPos + 1);
          const balance = Number(balanceStrWithDecimal);

          switch (tokenType) {
            case "SOCIAL":
              newSocialList.push({
                Token: token,
                TokenName: tokenName,
                Balance: balance,
                Type: tokenType,
                ImageUrl: imgUrl,
                IsEthWallet: true,
                DailyChange: 0,
                _priviUniqueId: token._priviUniqueId || generateUniqueId(),
              });
              break;
            case "NFTPOD":
              newMyPodList.push({
                Token: token,
                TokenName: tokenName,
                Balance: balance,
                Type: tokenType,
                ImageUrl: imgUrl,
                IsEthWallet: true,
                DailyChange: 0,
                _priviUniqueId: token._priviUniqueId || generateUniqueId(),
              });
              break;
          }
        });

        const catalogs = extWalletObj.catalog ?? [];
        catalogs.forEach((catalog: any) => {
          newSocialList.push({
            Token: "",
            TokenName: "",
            Balance: catalog.price,
            Type: "",
            ImageUrl: catalog.mediaUrl,
            IsEthWallet: true,
            DailyChange: 0,
            _priviUniqueId: generateUniqueId(),
          });
        });
      });

      setSocialList(newSocialList);
      setPodList(newMyPodList);
    }, [userSelector.ethExternalWallet, mySocials, myPodsMedia]);

    useEffect(() => {
      if (userId) {
        resetPagination();
        getAllInfoProfile();
      }
    }, [subTabsValue]);

    const loadMore = () => {
      getAllInfoProfile(paginationLastId, isLastNFT, pagination, paginationLastLikedMedia);
    };

    const resetPagination = () => {
      setSocialList([]);
      setPodList([]);
      setMyPodsMedia([]);
      setMyMedia([]);
      setMyCommunities([]);
      setMySocials([]);
      setMyPlaylists([]);
      setPaginationLastId(null);
      setIsLastNFT(true);
      setPagination(1);
      setPaginationHasMore(true);
      setPaginationLastLikedMedia("owner");
    };

    // const handleMainTab = index => {
    //   setTabsCardsValue(index);
    //   resetPagination();
    //   setSubTabsValue(0);
    // };

    return (
      <div className={classes.home}>
        <Grid container>
          <Grid item>
            <Box mb={4} mr={6}>
              <Header2Bold noMargin>Profile</Header2Bold>
            </Box>
          </Grid>
          <Grid item>
            <Box display="flex" mb={2}>
              {ownUser && (
                <SocialPrimaryButton onClick={handleOpenEditProfileModal} style={{ marginRight: "24px" }}>
                  Edit Profile
                </SocialPrimaryButton>
              )}
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={5}>
          <Grid item xs={12} md={12}>
            <InfoPane
              userProfile={userProfile}
              ownUser={ownUser}
              userId={userId}
              setStatus={() => {}}
              myBadges={myBadges}
              getUserStats={getmyStats}
              setDisplayWall={setDisplayWall}
            />
          </Grid>
        </Grid>

        <Box mb={"30px"}>
          {(ownUser && !displayWall) || !ownUser ? (
            <>
              <Box className={classes.chartContainer} display="flex" flexDirection="row" mt={8}>
                <Box width={1} px={3} py={3}>
                  <Box display="flex" flexDirection="row" justifyContent="space-between">
                    <Box display="flex" flexDirection="row" alignItems="center">
                      <h3>Digital Art</h3>
                    </Box>
                  </Box>
                  <Box className={classes.chartWrapper}>
                    <Box display="flex" flexDirection="column" className={classes.chartInfo}>
                      <span>Estimated Balance</span>
                      <p>
                        <h4>28.034 ETH</h4> +2.544 (+7%)
                      </p>
                    </Box>
                    {FreeHoursChartConfig && <PrintChart config={FreeHoursChartConfig} />}
                  </Box>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" mt={"48px"} mb={"42px"}>
                {profileSubTabs.map((option, index) => (
                  <div
                    className={cls({ [classes.subTabSelected]: subTabsValue === index }, classes.subTab)}
                    key={`cards-tab-${index}`}
                    onClick={() => setSubTabsValue(index)}
                  >
                    {option}
                  </div>
                ))}
              </Box>

              <InfiniteScroll
                style={{ overflowX: "hidden" }}
                hasChildren={dataInfo().data.length > 0}
                dataLength={dataInfo().data.length}
                scrollableTarget="profile-infite-scroll"
                next={loadMore}
                hasMore={paginationHasMore}
                loader={
                  isDataLoading && (
                    <LoadingIndicatorWrapper>
                      <CircularLoadingIndicator theme="green" />
                    </LoadingIndicatorWrapper>
                  )
                }
              >
                <CardsGrid
                  list={dataInfo().data}
                  type={"Media"}
                  ownUser={ownUser}
                  hasMore={paginationHasMore}
                />
              </InfiniteScroll>
            </>
          ) : (
            <>
              <MyWall handleBack={() => setDisplayWall(false)} userId={userId} userProfile={userProfile} />
            </>
          )}
        </Box>
        {ownUser && (
          <ProfileEditModal
            getBasicInfo={getBasicInfo}
            open={openEditProfileModal}
            toggleAnonymousMode={toggleAnonymousMode}
            onCloseModal={handleCloseEditProfileModal}
          />
        )}
        {ownUser && (
          <CreateSocialTokenModal
            handleRefresh={() => getAllInfoProfile()}
            open={openCreateSocialTokenModal}
            handleClose={handleCloseCreateSocialTokenModal}
          />
        )}
      </div>
    );
  },
  arePropsEqual
);

export default Home;

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 50px;
`;

const Header2Bold = styled(Header2)`
  font-weight: 800;
`;
