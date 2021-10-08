import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import InfiniteScroll from "react-infinite-scroll-component";

import NFTPodCard from "components/PriviDigitalArt/components/Cards/NFTPodCard";
import CreatePodModal from "components/PriviDigitalArt/modals/CreatePodModal/CreatePodModal";
import { COLUMNS_COUNT_BREAK_POINTS_FOUR } from "components/PriviDigitalArt/subpages/ExplorePage";
import URL from "shared/functions/getURL";
import { PrimaryButton, CircularLoadingIndicator, Color } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { preloadImageAndGetDimenstions } from "shared/hooks/useMediaPreloader";
import { setTrendingPodsList } from "store/actions/PodsManager";
import useWindowDimensions from "../../../../shared/hooks/useWindowDimensions";
import { useNFTPodsPageStyles } from "./index.styles";
import DigitalArtContext from "shared/contexts/DigitalArtContext";
import { ReactComponent as GovernanceImg } from "assets/icons/governance.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { SearchIcon } from "../../components/Icons/SvgIcons";

import { useTypedSelector } from "store/reducers/Reducer";
import { getUser } from "store/selectors";
import { useDebounce } from "use-debounce/lib";
import PodProposalCard from "components/PriviDigitalArt/components/Cards/PodProposalCard";

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

const podStateOptions = ["All", "Formation", "Investment", "Released"];
const investingOptions = ["Off", "On"];
const sortByPriceOptions = ["Descending", "Ascending"];
const podTypeOptions = ["All", "Media Pods", "Fractionalised Media"];

const PodPage = () => {
  const classes = useNFTPodsPageStyles();
  const dispatch = useDispatch();
  const width = useWindowDimensions().width;

  const user = useTypedSelector(getUser);

  const { setOpenFilters } = useContext(DigitalArtContext);

  const [loadingTrendingPods, setLoadingTrendingPods] = useState<boolean>(false);
  const [trendingPods, setTrendingPods] = useState<any[]>([]);

  // filter and sort selections
  const [podStateSelection, setPodStateSelection] = useState<string>(podStateOptions[0]);
  const [investingSelection, setInvestingSelection] = useState<string>(investingOptions[0]);
  const [sortByPriceSelection, setSortByPriceSelection] = useState<string>(sortByPriceOptions[0]);
  const [podTypeSelection, setPodTypeSelection] = useState<string>(podTypeOptions[0]); // all, media pod, fractionalized
  const [searchValue, setSearchValue] = useState<string>("");
  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<number>(0);
  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  // pods
  const [pods, setPods] = useState<any[]>([]);
  const [hasMorePods, setHasMorePods] = useState<boolean>(true);
  const [lastIdx, setLastIdx] = useState<string>("null");
  const [pagination, setPagination] = useState<number>(1);

  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState<boolean>(false);
  const [hasMoreProposals, setHasMoreProposals] = useState<boolean>(true);

  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);

  useEffect(() => {
    setOpenFilters(false);
    getMediaTrendingPods(true);
    getMediaPodsInformation([]);
  }, []);

  useEffect(() => {
    setLastIdx("null");
    if (user?.address && !isLoadingProposals) {
      loadMoreProposals();
    }
  }, [user?.address, debouncedSearchValue]);

  const loadMoreProposals = (isInit = false) => {
    // setIsLoadingProposals(true);
    // musicDaoGetPodsProposal(user.address, debouncedSearchValue, isInit ? undefined : lastId)
    //   .then(resp => {
    //     if (resp?.success) {
    //       if (isInit) {
    //         setProposals(resp.data);
    //       } else {
    //         setProposals(prev => [...prev, ...resp.data]);
    //       }
    //       setLastId(resp.lastId);
    //       setHasMoreProposals(resp.data.length === 20);
    //     } else setProposals([]);
    //   })
    //   .catch(_ => setProposals([]))
    //   .finally(() => setIsLoadingProposals(false));
  };

  const getMediaTrendingPods = (forceRefreshCache?: boolean) => {
    setLoadingTrendingPods(true);

    axios
      .get(
        `${URL()}/mediaPod/getTrendingMediaPods`,
        forceRefreshCache
          ? {
            params: {
              forceRefreshCache: true,
            },
          }
          : undefined
      )
      .then(res => {
        const resp = res.data;
        console.log("res", res);
        if (resp.success) {
          const data = resp.data;
          let trendingMediaPods = [...(data.trending || [])];
          trendingMediaPods = trendingMediaPods.reduce(
            (unique, pod) => (unique.some(u => u.PodAddress === pod.PodAddress) ? unique : [...unique, pod]),
            []
          );
          dispatch(setTrendingPodsList(trendingMediaPods));
          setTrendingPods(trendingMediaPods.filter((_, index) => index < 8));
        } else {
          console.log("error getting trending Media Pods");
        }
      })
      .finally(() => {
        setLoadingTrendingPods(false);
      });
  };

  const getMediaPodsInformation = async currMediaPods => {
    const config = {
      params: {
        podStateSelection: podStateSelection,
        investingSelection: investingSelection,
        sortByPriceSelection: sortByPriceSelection,
        podTypeSelection: podTypeSelection,
        searchValue: searchValue,
      },
    };
    const response = await axios.get(`${URL()}/mediaPod/getMediaPods/${pagination}/${lastIdx}`, config);
    const resp = response.data;
    if (resp.success) {
      const data = resp.data;
      const mediaPods = data.mediaPods ?? [];
      const hasMore = data.hasMore ?? false;
      const lastId = data.lastId ?? "null";

      for (let index = 0; index < mediaPods.length; index++) {
        const mediaPod = mediaPods[index];
        if (mediaPod.PodAddress && !mediaPod.dimensions) {
          let dimensions;
          const mediaUrl = `${mediaPod.Url}?${Date.now()}`;
          if (mediaUrl) {
            try {
              dimensions = await preloadImageAndGetDimenstions(mediaUrl);
            } catch (e) { }
          }
          mediaPods[index].dimensions = dimensions;
        }
      }
      const newMediaPods = [...currMediaPods, ...mediaPods];

      setPods(newMediaPods);
      setHasMorePods(hasMore);
      setLastIdx(lastId);
      setPagination(prevState => prevState + 1);
    }
  };

  const handleScroll = async e => {
    if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 42) {
      if (hasMorePods) {
        getMediaPodsInformation(pods);
      }
    }
  };

  const handleRefresh = React.useCallback(() => { }, []);

  return (
    <>
      <Ellipse />
      <div className={classes.content} onScroll={handleScroll}>
        <img src={require("assets/icons/wallet_simple.svg")} alt="wallet" className={classes.img2} />
        <div className={classes.img1}>
          <GovernanceImg />
        </div>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%">
          <h2>✨ NFT Pods</h2>
          <h5
            style={
              width < 1100
                ? { textAlign: "center", zIndex: 1, width: "75%", marginBottom: "49px" }
                : { textAlign: "center", zIndex: 1, width: "75%" }
            }
          >
            Stake privi and earn a share of the funds when the NFT is claimed by artist
          </h5>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" width="100%" mb="40px" zIndex={1}>
          <PrimaryButton
            size="medium"
            className={classes.greenButton}
            onClick={() => setOpenCreateModal(true)}
          >
            Create new Pod
          </PrimaryButton>
        </Box>
        <Box
          className={classes.flexBox}
          justifyContent="space-between"
          width={1}
          mt={4}
          zIndex={1}
          borderBottom="1px solid #00000022"
        >
          <div className={classes.flexBox}>
            <div
              className={clsx(classes.tabItem, { [classes.tabItemActive]: activeTab === 0 })}
              onClick={() => setActiveTab(0)}
            >
              <div className={classes.header5}>Explore Trending</div>
            </div>
            <Box
              className={clsx(classes.tabItem, { [classes.tabItemActive]: activeTab === 1 })}
              ml={2}
              onClick={() => setActiveTab(1)}
            >
              <div className={classes.header5}>Pod Proposals</div>
            </Box>
          </div>
          <div className={classes.optionSection}>
            <div className={classes.filterButtonBox}>
              {showSearchBox && (
                <InputWithLabelAndTooltip
                  type="text"
                  inputValue={searchValue}
                  placeHolder="Search"
                  onInputValueChange={e => {
                    setSearchValue(e.target.value);
                  }}
                  style={{
                    background: "transparent",
                    margin: 0,
                    marginRight: 8,
                    padding: 0,
                    border: "none",
                    height: "auto",
                  }}
                  theme="music dao"
                />
              )}
              <Box
                onClick={() => setShowSearchBox(prev => !prev)}
                display="flex"
                alignItems="center"
                justifyContent="center"
                style={{ cursor: "pointer" }}
              >
                <SearchIcon color={Color.MusicDAODark} />
              </Box>
            </div>
          </div>
        </Box>
        {activeTab === 0 ? (
          <>
            <Box display="flex" alignItems="flex-end">
              <h3>✨ Trending</h3>
            </Box>
            <LoadingWrapper loading={loadingTrendingPods} theme={"blue"}>
              <div className={classes.artCards}>
                <MasonryGrid
                  gutter={"24px"}
                  data={trendingPods}
                  renderItem={(item, index) => <NFTPodCard item={item} key={`item-${index}`} />}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                />
              </div>
            </LoadingWrapper>
            <h3>✨ All</h3>
            <div className={classes.artCards}>
              <MasonryGrid
                gutter={"24px"}
                data={pods}
                renderItem={(item, index) => <NFTPodCard item={item} key={`item-${index}`} />}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
              {hasMorePods && (
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 16,
                    paddingBottom: 16,
                  }}
                >
                  <CircularLoadingIndicator theme="blue" />
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div style={{ zIndex: 1 }}>
              <InfiniteScroll
                hasChildren={proposals.length > 0}
                dataLength={proposals.length}
                scrollableTarget={"scrollContainer"}
                next={loadMoreProposals}
                hasMore={hasMoreProposals}
                loader={
                  isLoadingProposals && (
                    <LoadingIndicatorWrapper>
                      <CircularLoadingIndicator />
                    </LoadingIndicatorWrapper>
                  )
                }
              >
                <Box mt={4}>
                  {proposals.length > 0
                    ? proposals.map((pod, index) => (
                      <Box key={index} width={1} mb={2}>
                        <PodProposalCard pod={pod} />
                      </Box>
                    ))
                    : !isLoadingProposals && (
                      <Box className={classes.header5} textAlign="center" width={1}>
                        You are not a collab in any pod.
                      </Box>
                    )}
                </Box>
              </InfiniteScroll>
            </div>
          </>
        )}
      </div>
      {openCreateModal && (
        <CreatePodModal
          onClose={() => setOpenCreateModal(false)}
          type={"Digital NFT"}
          handleRefresh={handleRefresh}
          open={openCreateModal}
        />
      )}
    </>
  );
};

export default React.memo(PodPage);

const Ellipse = () => {
  const classes = useNFTPodsPageStyles();

  return (
    <svg
      className={classes.ellipse}
      xmlns="http://www.w3.org/2000/svg"
      width="564"
      height="420"
      viewBox="0 0 564 420"
      fill="none"
    >
      <g filter="url(#filter0_f)">
        <ellipse cx="-120" cy="83" rx="504" ry="157" fill="#DDFF57" />
      </g>
      <defs>
        <filter
          id="filter0_f"
          x="-804"
          y="-254"
          width="1368"
          height="674"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="90" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  );
};
