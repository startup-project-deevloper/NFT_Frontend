import React, { useEffect, useState } from "react";
import axios from "axios";
import { Helmet } from "react-helmet";
import cls from "classnames";

import { Grid, Tabs } from "@material-ui/core";

import { useTypedSelector } from "store/reducers/Reducer";
import { Avatar, Text, SecondaryButton, FontSize, HeaderBold2 } from "shared/ui-kit";
import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { getMediaPod } from "shared/services/API";
import { formatNumber } from "shared/functions/commonFunctions";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { SharePopup } from "shared/ui-kit/SharePopup";
import { sumTotalViews } from "shared/functions/totalViews";
import { BackButton } from "../../components/BackButton";
import { MediaPhotoDetailsModal } from "../../modals/MediaPhotoDetailsModal";
import Media from "./components/Media";
import Investment from "./components/Investment";
import Discussion from "./components/Discussion";
import Chat from "./components/Chat";
import { usePodPageStyles } from "./index.styles";
import { useHistory, useParams } from "react-router-dom";

const PodPageIndividual = () => {
  const parmas: any = useParams();
  const history = useHistory();

  const classes = usePodPageStyles();
  const { showAlertMessage } = useAlertMessage();
  const { convertTokenToUSD } = useTokenConversion();
  const user = useTypedSelector(state => state.user);

  const [pod, setPod] = useState<any>({});
  const [creatorData, setCreatorData] = useState<any>({});

  const [bookmarked, setBookmarked] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [openOptionsMenu, setOpenOptionsMenu] = useState<boolean>(false);
  const anchorOptionsMenuRef = React.useRef<HTMLDivElement>(null);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isShowingMediaPhotoDetailModal, setIsShowingMediaPhotoDetailModal] = useState<boolean>(false);
  const [openShareMenu, setOpenShareMenu] = useState<boolean>(false);
  const [status, setStatus] = React.useState<any>("");

  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (parmas.id) {
      loadData();
    }
  }, [parmas.id]);

  useEffect(() => {
    if (pod && pod?.Bookmarks && pod?.Bookmarks.some((id: string) => id === user.id)) setBookmarked(true);

    // check if user already followed the pod
    const followers: any[] = pod?.Followers ?? [];
    if (followers) {
      let followed = false;
      followers.forEach(followerData => {
        if (followerData.id === user.id) {
          followed = true;
        }
      });
      setIsFollowing(followed);
    }
  }, [pod]);

  const loadData = async () => {
    setIsDataLoading(true);
    await getMediaPod(parmas.id)
      .then(async resp => {
        if (resp.success) {
          const data = resp.data;
          sumTotalViews(data, true);
          const creatorsData = data.CreatorsData ?? [];
          if (creatorData) {
            creatorsData.forEach(creatorData => {
              if (!creatorData.imageUrl) {
                if (creatorData.anonAvatar)
                  creatorData.imageUrl = require(`assets/anonAvatars/${creatorData.anonAvatar}`);
                else creatorData.imageUrl = getRandomAvatar();
              }
              if (creatorData.address === data.CreatorAddress) setCreatorData(creatorData);
            });
          }
          setPod(data);
        }
      })
      .finally(() => {
        setIsDataLoading(false);
      });
  };

  const handleOpenShareMenu = () => {
    setOpenShareMenu(!openShareMenu);
  };

  const handleCloseShareMenu = () => {
    setOpenShareMenu(false);
  };

  const handleFollow = e => {
    e.stopPropagation();
    e.preventDefault();

    const body = {
      userId: user.id,
      podId: pod.PodAddress,
    };

    if (!isFollowing) {
      axios.post(`${URL()}/mediaPod/followMediaPod`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "follow success",
            key: Math.random(),
            variant: "success",
          });
          const followers: any[] = pod?.Followers ?? [];
          if (followers) {
            followers.push({
              date: Date.now(),
              id: user.id,
            });
            setPod(prev => ({ ...prev, Followers: followers }));
          }
        } else {
          setStatus({
            msg: "follow failed",
            key: Math.random(),
            variant: "error",
          });
        }
      });
    } else {
      axios.post(`${URL()}/mediaPod/unFollowMediaPod`, body).then(res => {
        const resp = res.data;
        if (resp.success) {
          setStatus({
            msg: "unfollow success",
            key: Math.random(),
            variant: "success",
          });
          const followers: any[] = pod?.Followers ?? [];
          if (followers) {
            const updatedFollowers = followers.filter(item => item.id !== user.id);
            setPod(prev => ({ ...prev, Followers: updatedFollowers }));
          }
        } else {
          setStatus({
            msg: "unfollow failed",
            key: Math.random(),
            variant: "error",
          });
        }
      });
    }
  };

  const bookmarkMedia = () => {
    axios
      .post(`${URL()}/media/bookmarkMedia/${pod?.MediaSymbol ?? pod?.id}`, {
        userId: user.id,
        mediaType: pod?.Type,
      })
      .then(res => {
        showAlertMessage("Bookmarked media", { variant: "success" });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const unBookmarkMedia = () => {
    axios
      .post(`${URL()}/media/removeBookmarkMedia/${pod?.MediaSymbol ?? pod?.id}`, {
        userId: user.id,
        mediaType: pod?.Type,
      })
      .then(res => {
        showAlertMessage("Removed bookmark", { variant: "success" });
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleBookmark = React.useCallback(() => {
    if (!bookmarked) bookmarkMedia();
    else unBookmarkMedia();
  }, [bookmarked, bookmarkMedia, unBookmarkMedia]);

  const handleOptions = () => {
    setOpenOptionsMenu(!openOptionsMenu);
  };

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
      podAddress: pod?.PodAddress ?? pod?.id,
    };

    axios.post(`${URL()}/mediaPod/fruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...pod };
        itemCopy.fruits = [
          ...(itemCopy.fruits || []),
          { userId: user.id, fruitId: type, date: new Date().getTime() },
        ];
        setPod(itemCopy);
      }
    });
  };

  return (
    <div className={classes.page}>
      <Helmet>
        <title>{pod?.Name ?? "pod.name"}</title>
        <meta property="og:image" content={pod?.Type === "DIGITAL_ART_TYPE" ? pod?.Url : pod?.ImageUrl} />
        <meta name="og:image" content={pod?.mediaURL} />
        <meta property="og:image:width" content="1280" />
        <meta property="og:image:height" content="720" />
      </Helmet>
      <div className={classes.content}>
        <Box mb="24px" mt="32px">
          <BackButton dark />
        </Box>
        <LoadingWrapper loading={!pod || isDataLoading} theme={"blue"} height="calc(100vh - 100px)">
          <Box>
            <Grid className={classes.headerBlur} container spacing={2}>
              <Box className={classes.gradientImage1} />
              <Box className={classes.gradientImage2} />
              <Grid item sm={12} className={classes.headerContentMobileImage}>
                <img
                  src={pod?.Url || `https://source.unsplash.com/random/${Math.floor(Math.random() * 1000)}`}
                  className={classes.detailImg}
                  width="100%"
                  height="100%"
                />
              </Grid>
              <Grid item sm={12} md={8} lg={9} className={classes.headerContent}>
                <HeaderBold2 noMargin>{pod?.Name}</HeaderBold2>
                <Box display="flex" gridColumnGap={4} alignItems="center" mt={1}>
                  {pod?.Hashtags &&
                    pod?.Hashtags.map((item, index) => (
                      <span className={classes.hashtag} key={index}>
                        #{item}
                      </span>
                    ))}
                </Box>
                <Box className={classes.description} mt={2}>
                  <Text size={FontSize.L}>{pod?.Description}</Text>
                </Box>
                <Box display="flex" flexDirection="row" alignItems="center" mt={5}>
                  {pod.CreatorsData && pod.CreatorsData.length > 0 && (
                    <Box display="flex" alignItems="center" my={2}>
                      {pod.CreatorsData.map((creator: any) => (
                        <Avatar
                          key={`artist-${creator.id}`}
                          className={classes.artist}
                          size="small"
                          url={creator.imageUrl}
                          alt={creator.id}
                          title={`${creator.name}`}
                          onClick={() => history.push(`/pix/${creator.id}/profile`)}
                        />
                      ))}
                    </Box>
                  )}
                  <Box ml={1.5}>
                    <div onClick={handleOpenShareMenu} ref={anchorShareMenuRef} style={{ cursor: "pointer" }}>
                      <img src={require(`assets/icons/share_filled.svg`)} alt="like" />
                    </div>
                  </Box>
                  <Box ml={4} mr={3} style={{ background: "rgba(67, 26, 183, 0.32)", borderRadius: "50%" }}>
                    <FruitSelect fruitObject={pod} onGiveFruit={handleFruit} />
                  </Box>
                  {user.address !== pod.CreatorAddress && (
                    <SecondaryButton size="small" onClick={handleFollow} className={classes.followBtn}>
                      {isFollowing ? "Unfollow" : "+ Follow"}
                    </SecondaryButton>
                  )}
                </Box>
              </Grid>
              <Grid item sm={12} md={4} lg={3} className={classes.headerContentImage}>
                <img
                  src={pod?.Url || `https://source.unsplash.com/random/${Math.floor(Math.random() * 1000)}`}
                  className={classes.detailImg}
                  width="100%"
                  height="100%"
                />
              </Grid>
            </Grid>
            <div className={classes.greenBox}>
              <Box>
                <h5>Price</h5>
                <h3>{formatNumber(convertTokenToUSD(pod.FundingToken, pod?.Price ?? 0), "USD", 4)}</h3>
              </Box>
              <Box>
                <h5>Interest Rate</h5>
                <h3>{(pod?.InvestorDividend ?? 0) * 100}%</h3>
              </Box>
              <Box>
                <h5>Raised Funds</h5>
                <h3>{formatNumber(convertTokenToUSD(pod.FundingToken, pod?.RaisedFunds ?? 0), "USD", 4)}</h3>
              </Box>
              <Box>
                <h5>Market Cap</h5>
                <h3>
                  {formatNumber(
                    (pod?.SupplyReleased ?? 0) * convertTokenToUSD(pod.FundingToken, pod?.Price ?? 0),
                    "USD",
                    4
                  )}
                </h3>
              </Box>
              <Box>
                <h5>Supply Released</h5>
                <h3>{formatNumber(pod?.SupplyReleased ?? 0, pod.TokenSymbol, 4)}</h3>
              </Box>
              <Box>
                <h5>Share & Earn</h5>
                <h3>{pod?.SharingPercent ?? 0}%</h3>
              </Box>
              <Box>
                <h5>Revenue</h5>
                <h3>{pod?.Revenue ?? 0}</h3>
              </Box>
            </div>
            <SharePopup
              item={pod}
              openMenu={openShareMenu}
              anchorRef={anchorShareMenuRef}
              handleCloseMenu={handleCloseShareMenu}
            />
            <Tabs variant="scrollable" style={{ marginTop: "40px" }}>
              {["Media", "Investment", "Discussion"].map((t, i) => (
                <div
                  onClick={() => setSelectedTab(i)}
                  className={cls({ [classes.selectedTab]: i === selectedTab }, classes.tab)}
                >
                  {t}
                </div>
              ))}
            </Tabs>

            <hr className={classes.divider} style={{ margin: "24px 0px" }} />
            {selectedTab === 0 ? (
              <Media
                medias={pod?.Medias ?? []}
                pod={pod}
                creator={creatorData}
                handleRefresh={loadData}
                loading={isDataLoading}
              />
            ) : selectedTab === 1 ? (
              <Investment pod={pod} handleRefresh={loadData} />
            ) : selectedTab === 2 ? (
              <Discussion
                pod={{
                  ...pod,
                  // PostsArray: [1, 2, 3, 4, 5, 6, 7].map(item => ({
                  //   hasPhoto: item < 3,
                  //   imageUrl: require("assets/backgrounds/blog.png"),
                  //   userImageURL: getRandomAvatar(),
                  //   name: "Rallying market when providing stablecoins drop.",
                  //   textShort: "That seems to be the most risky thing to do now",
                  //   replies: [{ userId: user.id, message: "test" }],
                  //   isPinned: item === 3,
                  // })),
                  // Votings: [1, 2, 3, 4, 5, 6, 7].map(item => ({
                  //   name: "Do you think that having Cardano as collateral could benefit this pool?",
                  //   EndingDate: new Date().getTime(),
                  // })),
                }}
                handleRefresh={loadData}
              />
            ) : (
              <Chat pod={pod} />
            )}
            <MediaPhotoDetailsModal
              isOpen={isShowingMediaPhotoDetailModal}
              onClose={handleCloseMediaPhotoDetailModal}
              imageURL={pod?.Url || `https://source.unsplash.com/random/${Math.floor(Math.random() * 1000)}`}
            />
          </Box>
        </LoadingWrapper>
      </div>
    </div>
  );
};

export default React.memo(PodPageIndividual);
