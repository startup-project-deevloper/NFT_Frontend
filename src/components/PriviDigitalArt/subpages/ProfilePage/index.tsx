import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import cls from "classnames";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import Axios from "axios";

import { Grid, useMediaQuery, useTheme } from "@material-ui/core";

import { CircularLoadingIndicator, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import { removeUndef } from "shared/helpers";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
// import PrintChart from "shared/ui-kit/Chart/Chart";
import { getOwnPixProfileItem, getPixProfileItems } from "shared/services/API";
import ProfileEditModal from "components/PriviSocial/subpages/Home/modals/ProfileEdit";
import { socket } from "components/Login/Auth";
import { getUser, getUsersInfoList } from "store/selectors";
import { sumTotalViews } from "shared/functions/totalViews";
import { setSelectedUser } from "store/actions/SelectedUser";
import { setUser } from "store/actions/User";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import DigitalArtContext from "shared/contexts/DigitalArtContext";
import CardsGrid from "./components/CardsGrid";
import MyWall from "./components/MyWall";
import InfoPane from "./components/InfoPane";
import Feed from "./components/Feed";
import SocialToken from "./components/SocialToken";
import { profilePageStyles } from "./index.styles";
import getPhotoIPFS from "../../../../shared/functions/getPhotoIPFS";
import useIPFS from "../../../../shared/utils-IPFS/useIPFS";

const profileSubTabs = ["All", "Owned", "Curated", "Liked"];

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
          backgroundColor: "#b7c2f4",
          borderColor: "#9eacf2",
          pointBorderColor: "#181818",
          pointBackgroundColor: "#181818",
          pointHoverBackgroundColor: "#181818",
          borderWidth: 2,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      chartArea: {
        backgroundColor: "#ffffff",
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
              color: "#d4dafa",
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
        backgroundColor: "#ffffff",
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

const ProfilePage = () => {
  const classes = profilePageStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useDispatch();
  const loggedUser = useSelector(getUser);
  const params: any = useParams();
  const { setOpenFilters } = useContext(DigitalArtContext);

  const [userProfile, setUserProfile] = useState<any>({});
  const [userId, setUserId] = React.useState<string>("");
  const [ownUser, setOwnUser] = useState<boolean>(false);
  const [priviUser, setPriviUser] = useState<boolean>();
  const [collections, setCollections] = useState<any[]>([]);
  const [activeCollection, setActiveColleciton] = useState<string>();

  const [openEditProfileModal, setOpenEditProfileModal] = useState<boolean>(false);

  // STORE
  const userSelector = useSelector(getUser);
  const users = useSelector(getUsersInfoList);

  // HOOKS
  const { showAlertMessage } = useAlertMessage();

  // TABS
  const [myBadges, setMyBadges] = useState<any[]>([]);
  const [subTabsValue, setSubTabsValue] = useState<number>(0);

  // PROFILE USER
  const [socialChart, setSocialChart] = useState<any>();
  const [totalBalance, setTotalBalance] = useState<any>(0);
  const [increaseValue, setIncreaseValue] = useState<any>(0);
  const [increaseRate, setIncreaseRate] = useState<any>(0);

  const [myMedia, setMyMedia] = useState<any[]>([]);
  const [lastMediaId, setLastMediaId] = useState<string>("null");

  const [paginationLastId, setPaginationLastId] = useState<any>(null);
  const [paginationHasMore, setPaginationHasMore] = useState<boolean>(true);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<number>(0);
  const scrollRef = useRef<any>();

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    setOpenFilters(false);
  }, []);

  useEffect(() => {
    setMyMedia([]);
    setPriviUser(undefined);
    setUserProfile({});
    if (params.id) {
      if (params.id && !params.id.includes("Px")) {
        Axios.get(`${URL()}/user/getIdFromSlug/${params.id}/user`)
          .then(response => {
            if (response.data.success) {
              const id = response.data.data.id;
              setUserId(id);
            } else {
              Axios.get(`${URL()}/user/getIdFromSlug/${params.id}/mediaUsers`)
                .then(response => {
                  if (response.data.success) {
                    const id = response.data.data.id;
                    setUserId(id);
                  } else {
                    setUserId(params.id);
                  }
                })
                .catch(error => {
                  console.log(error);
                });
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else if (params.id) {
        setUserId(params.id);
      }
    }
  }, [params.id]);

  useEffect(() => {
    if (userId && userId.length > 0 && userId !== loggedUser.id) {
      if (socket) {
        socket.on("user_connect_status", connectStatus => {
          if (connectStatus.userId === userId) {
            let setterUser: any = { ...userProfile };
            setterUser.connected = connectStatus.connected;
            setUserProfile(setterUser);
          }
        });
      }
    }
  }, [userId, userProfile]);

  useEffect(() => {
    setOwnUser(userId === userSelector?.id);
    if (userId !== userSelector?.id) {
      setActiveTab(1);
    } else {
      setUserProfile({ ...userSelector });
    }
  }, [userId, userSelector]);

  useEffect(() => {
    if (userId && userId.length > 0) {
      Axios.get(`${URL()}/user/checkIfUserExists/${userId}`)
        .then(response => {
          if (response.data.success) {
            if (response.data.isPrivi) {
              sumTotalViews({
                userId: userId,
                ProfileAddress: true,
              });
            } else {
              if (response.data.collections?.length > 0) {
                setCollections(response.data.collections);
                setActiveColleciton(response.data.collections[0]);
              }
            }
            setPriviUser(response.data.isPrivi);
          } else {
            showAlertMessage(`There is no found registered user.`, { variant: "error" });
          }
        })
        .catch(error => {
          console.log(error);
          showAlertMessage(error.toString(), { variant: "error" });
        });
    }
  }, [userId]);

  useEffect(() => {
    if (priviUser) {
      // BasicInfo
      getBasicInfo(userId, loggedUser.id === userId);

      getmyStats();
      getAllInfoProfile();
      getMediaArtBalances();
    } else if (priviUser === false) {
      setActiveTab(1);
    }
  }, [priviUser]);

  useEffect(() => {
    if (activeCollection) {
      setLastMediaId("null");
      setPaginationHasMore(true);
      setMyMedia([]);
      getBasicMediaUserInfo();
    }
  }, [activeCollection]);

  useEffect(() => {
    if (userId) {
      resetPagination();
      getAllInfoProfile();
    }
  }, [subTabsValue]);

  const setUserSelector = async setterUser => {
    if (setterUser.id) {
      dispatch(setSelectedUser(setterUser.id, setterUser.address));
      if (ownUser) {
        if (setterUser && setterUser.infoImage && setterUser.infoImage.newFileCID) {
          setterUser.imageIPFS = await getPhotoIPFS(
            setterUser.infoImage.newFileCID,
            downloadWithNonDecryption
          );
        }
        dispatch(setUser(setterUser));
      }
    }
  };

  const getBasicMediaUserInfo = async () => {
    if (userId) {
      setIsDataLoading(true);
      try {
        const response = await Axios.get(
          `${URL()}/user/getBasicMediaUserInfo/${userId}/${activeCollection}/${lastMediaId}`
        );
        if (response.data.success) {
          let data = response.data.data;

          const firstName = data.user;
          const lastName = "";

          let user: any = { ...data, id: userId, firstName, lastName };

          if (!user.badges) {
            user.badges = [];
          }
          if (!user.connected) {
            user.connected = false;
          }
          if (!user.urlSlug) {
            user.urlSlug = data.firstName ?? data.name;
          }

          setMyMedia(prev => [...prev, ...(user.medias || [])]);
          setLastMediaId(user.medias?.length > 0 ? user.medias[user.medias.length - 1].id : "null");
          setPaginationHasMore(user.medias?.length > 20);
          if (userProfile.id !== userId) {
            setUserSelector(user);
            setUserProfile(user);
          }
        }
        setIsDataLoading(false);
      } catch (error) {
        showAlertMessage(`Error getting basic info.`, { variant: "error" });
        setIsDataLoading(false);
      }
    }
  };

  const getBasicInfo = async (userId, ownUser) => {
    if (userId) {
      try {
        const response = await Axios.get(`${URL()}/user/getBasicInfo/${userId}`);
        if (response.data.success) {
          let data = response.data.data;
          let nameSplit = data.name.split(" ");
          let lastNameArray = nameSplit.filter((_, i) => {
            return i !== 0;
          });
          let firstName = nameSplit[0];
          let lastName = "";
          for (let i = 0; i < lastNameArray.length; i++) {
            if (lastNameArray.length === i + 1) {
              lastName = lastName + lastNameArray[i];
            } else {
              lastName = lastName + lastNameArray[i] + " ";
            }
          }

          if (ownUser) {
            let setterUser: any = { ...data, id: userId, firstName, lastName };

            if (!setterUser.badges) {
              setterUser.badges = [];
            }
            if (!setterUser.connected) {
              setterUser.connected = false;
            }
            if (!setterUser.urlSlug) {
              setterUser.urlSlug = data.firstName ?? data.name;
            }

            setUserSelector(setterUser);
            setUserProfile(setterUser);
          } else {
            let user: any = { ...data, id: userId, firstName, lastName };

            if (!user.badges) {
              user.badges = [];
            }
            if (!user.connected) {
              user.connected = false;
            }
            if (!user.urlSlug) {
              user.urlSlug = data.firstName ?? data.name;
            }

            setUserSelector(user);
            setUserProfile(user);
          }
        }
      } catch (error) {
        showAlertMessage(`Error getting basic info.`, { variant: "error" });
      }
    }
  };

  const getmyStats = () => {
    setIsDataLoading(true);
    axios
      .get(`${URL()}/user/getUserCounters/${userId}`)
      .then(response => {
        const resp = response.data;
        if (resp.success) {
          const { badges, ...others } = resp.data;
          setMyBadges(badges);
        } else {
          setMyBadges([]);
        }
      })
      .catch(_ => {
        showAlertMessage(`Error getting user stats`, { variant: "error" });
      })
      .finally(() => setIsDataLoading(false));
  };

  // now it doesnt have pagination
  const getAllInfoProfile = async () => {
    if (userId) {
      try {
        if (profileSubTabs[subTabsValue] === profileSubTabs[1]) {
          setIsDataLoading(true);
          const resp = await getOwnPixProfileItem(userId);
          setIsDataLoading(false);
          if (resp?.success) {
            const result: any[] = [];
            resp.data.map(d => {
              const metadata = JSON.parse(d.metadata);
              if (!!metadata.image) {
                result.push({ ...d, metadata: metadata });
              }
            });
            setMyMedia(result);
          }
        } else {
          setIsDataLoading(true);
          const resp = await getPixProfileItems(userId, !ownUser, subTabsValue.toString());
          setIsDataLoading(false);
          if (resp?.success) {
            setPaginationHasMore(false);
            const medias = resp.data ?? [];
            let mMedia = [] as any;
            medias.forEach((m, index) => {
              medias[index].eth = m.MediaSymbol === undefined;
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
              mMedia.push(m);
            });
            const newMyMedia = [...mMedia];
            setMyMedia(newMyMedia);
          }
        }
      } catch (error) {
        showAlertMessage(`Error getting user stats`, { variant: "error" });
      }
    }
  };

  const getMediaArtBalances = () => {
    Axios.get(`${URL()}/wallet/getArtBalanceHistory/${userId}`).then(res => {
      if (res.data.success) {
        const balanceData = res.data.data;
        const labels: any[] = [];
        const values: any[] = [];
        balanceData.map(data => {
          labels.push(data.date);
          values.push(data.balance);
        });
        const newConfig = JSON.parse(JSON.stringify(FreeHoursChartConfig));
        newConfig.config.data.labels = labels;
        newConfig.config.data.datasets[0].data = values;

        if (values.length > 0) {
          setTotalBalance(values[values.length - 1].balance);

          if (values.length > 1) {
            setIncreaseValue(values[values.length - 1].balance - values[values.length - 2].balance);
            setIncreaseRate(
              ((values[values.length - 1].balance - values[values.length - 2].balance) /
                values[values.length - 1].balance) *
                100
            );
          }
        }

        setSocialChart(newConfig);
      }
    });
  };

  const loadMore = () => {
    if (priviUser) getAllInfoProfile();
    else if (priviUser === false) {
      if (!isDataLoading) getBasicMediaUserInfo();
    }
  };

  const resetPagination = () => {
    setMyMedia([]);
    setPaginationLastId(null);
    setPaginationHasMore(true);
  };

  const renderDigitalArt = () => {
    return (
      <>
        <Box display="flex" alignItems="center" mt={"48px"} mb={"42px"}>
          {priviUser !== undefined &&
            (priviUser
              ? profileSubTabs.map((option, index) => {
                  return (
                    <div
                      className={cls({ [classes.subTabSelected]: subTabsValue === index }, classes.subTab)}
                      key={`cards-tab-${index}`}
                      onClick={() => setSubTabsValue(index)}
                    >
                      {option}
                    </div>
                  );
                })
              : collections.length > 1
              ? collections.map((option, index) => (
                  <div
                    className={cls(
                      { [classes.subTabSelected]: activeCollection === collections[index] },
                      classes.subTab
                    )}
                    key={`cards-tab-${index}`}
                    onClick={() => setActiveColleciton(collections[index])}
                  >
                    {option}
                  </div>
                ))
              : null)}
        </Box>

        <InfiniteScroll
          style={{ overflowX: "hidden" }}
          hasChildren={myMedia.length > 0}
          dataLength={myMedia.length}
          scrollableTarget="profile-infite-scroll"
          next={loadMore}
          hasMore={paginationHasMore}
          loader={
            isDataLoading && (
              <LoadingIndicatorWrapper>
                <CircularLoadingIndicator theme="blue" />
              </LoadingIndicatorWrapper>
            )
          }
        >
          <CardsGrid
            list={myMedia}
            type={"Media"}
            ownUser={ownUser}
            hasMore={paginationHasMore}
            handleRefresh={() => {
              setLastMediaId("null");
              setPaginationHasMore(true);
              setMyMedia([]);
              getBasicMediaUserInfo();
            }}
          />
        </InfiniteScroll>
      </>
    );
  };

  const handleOpenEditProfileModal = () => {
    setOpenEditProfileModal(true);
  };

  const handleCloseEditProfileModal = () => {
    setOpenEditProfileModal(false);
  };

  const toggleAnonymousMode = anonBool => {
    const body = {
      userId: userId,
      anonMode: anonBool,
    };

    axios
      .post(`${URL()}/user/changeAnonMode`, body)
      .then(response => {
        if (response.data.success) {
          //update redux user aswell
          const user = { ...userSelector };
          user.anon = anonBool;
          setUserSelector(user);
        } else {
          console.log("User change anon mode failed");
        }
      })
      .catch(error => {
        console.log(error);
        showAlertMessage("Error handling anonymous mode update");
      });
  };

  return (
    <div className={classes.mainContent} ref={scrollRef} id="profile-infite-scroll">
      <Box
        display="flex"
        color="#181818"
        alignItems="center"
        fontSize={30}
        fontWeight={400}
        mb={3}
        mr={6}
        flexWrap="wrap"
        gridRowGap={10}
        gridColumnGap={25}
      >
        <Box>
          <BackButton dark />
        </Box>
        <Box>✨ Profile</Box>
        <Box display="flex">
          {ownUser && (
            <PrimaryButton
              className={classes.editProfile}
              size="medium"
              onClick={handleOpenEditProfileModal}
              style={{ marginRight: "24px" }}
            >
              Edit Profile
            </PrimaryButton>
          )}
        </Box>
      </Box>
      <Grid container spacing={5}>
        <Grid item xs={12} md={12}>
          <InfoPane
            userProfile={userProfile}
            ownUser={ownUser}
            userId={userId}
            setStatus={() => {}}
            myBadges={myBadges}
            getUserStats={getmyStats}
          />
        </Grid>
      </Grid>
      <Box display="flex" alignItems="center" mt={4} className={classes.tabs}>
        {priviUser && ownUser && (
          <Box
            className={`${classes.tabItem} ${activeTab === 0 ? classes.tabItemActive : ""}`}
            onClick={() => setActiveTab(0)}
          >
            Feed
          </Box>
        )}

        {priviUser && (
          <>
            <Box
              className={`${classes.tabItem} ${activeTab === 1 ? classes.tabItemActive : ""}`}
              onClick={() => setActiveTab(1)}
            >
              Digital Art
            </Box>
            <Box
              className={`${classes.tabItem} ${activeTab === 2 ? classes.tabItemActive : ""}`}
              onClick={() => setActiveTab(2)}
            >
              Wall
            </Box>
            <Box
              className={`${classes.tabItem} ${activeTab === 3 ? classes.tabItemActive : ""}`}
              onClick={() => setActiveTab(3)}
            >
              Social Token
            </Box>
          </>
        )}
      </Box>

      <Box mb={4}>
        <LoadingWrapper loading={priviUser === undefined} theme={"blue"}>
          {activeTab === 0 && ownUser ? (
            <Feed userId={userId} userProfile={userProfile} scrollRef={scrollRef} ownUser={ownUser} />
          ) : activeTab === 1 ? (
            renderDigitalArt()
          ) : activeTab === 2 ? (
            <MyWall userId={userId} userProfile={userProfile} />
          ) : (
            <SocialToken userId={userId} userProfile={userProfile} />
          )}
        </LoadingWrapper>
      </Box>
      {ownUser && (
        <ProfileEditModal
          getBasicInfo={getBasicInfo}
          open={openEditProfileModal}
          toggleAnonymousMode={toggleAnonymousMode}
          onCloseModal={handleCloseEditProfileModal}
        />
      )}
    </div>
  );
};

export default ProfilePage;

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 50px;
`;
