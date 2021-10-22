import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import clsx from "clsx";
import InfiniteScroll from "react-infinite-scroll-component";

import { getRaisedTrendingPods, getPods, getPodsProposal } from "shared/services/API/PriviPodAPI";

import NFTPodCard from "components/PriviDigitalArt/components/Cards/NFTPodCard";
import CreatePodModal from "components/PriviDigitalArt/modals/CreatePodModal/CreatePodModal";
import { COLUMNS_COUNT_BREAK_POINTS_FOUR } from "components/PriviDigitalArt/subpages/ExplorePage";
import { PrimaryButton, CircularLoadingIndicator, Color } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import useWindowDimensions from "../../../../shared/hooks/useWindowDimensions";
import { useNFTPodsPageStyles } from "./index.styles";
import { ReactComponent as GovernanceImg } from "assets/icons/governance.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { SearchIcon } from "../../components/Icons/SvgIcons";
import CustomPopup from "components/PriviDigitalArt/components/CustomPopup";

import { useTypedSelector } from "store/reducers/Reducer";
import { getUser } from "store/selectors";
import { useDebounce } from "use-debounce/lib";
import PodProposalCard from "components/PriviDigitalArt/components/Cards/PodProposalCard";

import { getPodStatus } from "shared/functions/utilsPriviPod";

const apiType = "pix";
const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

const filterTagOptions = ["Trending", "Hot", "New"];
const filterTagMorOptions = ["MoreOption1", "MoreOption2", "MoreOption3", "MoreOption4"];

const PodPage = () => {
  const classes = useNFTPodsPageStyles();
  const width = useWindowDimensions().width;

  const user = useTypedSelector(getUser);

  const [filterOption, setFilterOption] = useState<string>("Trending");
  const [filterMore, setFilterMore] = useState<string>("More");

  const [loadingTrendingPods, setLoadingTrendingPods] = useState<boolean>(false);
  const [trendingPods, setTrendingPods] = useState<any[]>([]);

  // filter and sort selections
  const [searchValue, setSearchValue] = useState<string>("");
  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);

  const [activeTab, setActiveTab] = useState<number>(0);
  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  // pods
  const [pods, setPods] = useState<any[]>([]);
  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState<boolean>(false);
  const [hasMoreProposals, setHasMoreProposals] = useState<boolean>(true);
  const [lastId, setLastId] = useState<any>();

  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const lastIdRef = useRef<string>("undefined");

  useEffect(() => {
    getTopPodsList();
  }, [filterOption, filterMore]);

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    if (user?.address && !isLoadingProposals) {
      loadMoreProposals();
    }
  }, [user?.address, debouncedSearchValue]);

  const getTopPodsList = () => {
    if (filterMore !== "More" && filterMore.length > 0) {
      // TODO: get pods by more filter option
    } else if (filterOption === "Trending") {
      getRaisedTrendingPods(apiType)
        .then(resp => {
          if (resp?.success) {
            const data = resp.data;
            const nextPagePods = data
              .filter(p => getPodStatus(p))
              .map(p => ({ ...p, status: getPodStatus(p) }));

            setTrendingPods(nextPagePods);
          }
        })
        .catch(err => console.log(err));
    } else if (filterOption === "Hot") {
      // TODO:
    } else if (filterOption === "New") {
    }
  };

  // load pods for next page
  const loadMore = (isInit = false) => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    if (isInit) lastIdRef.current = "undefined";
    getPods(lastIdRef.current, apiType)
      .then(resp => {
        setIsLoading(false);
        if (resp?.success) {
          const data = resp.data;
          const nextPagePods = data.pods
            .filter(p => getPodStatus(p))
            .map(p => ({ ...p, status: getPodStatus(p) }));
          setHasMore(data.hasMore ?? false);
          setPods([...pods, ...nextPagePods]);
          lastIdRef.current = nextPagePods.length ? nextPagePods[nextPagePods.length - 1].id : "";
          console.log(nextPagePods);
        }
      })
      .catch(err => console.log(err));
  };

  const loadMoreProposals = (isInit = false) => {
    setIsLoadingProposals(true);
    getPodsProposal(user.address, debouncedSearchValue, isInit ? undefined : lastId, apiType)
      .then(resp => {
        if (resp?.success) {
          if (isInit) {
            setProposals(resp.data);
          } else {
            setProposals(prev => [...prev, ...resp.data]);
          }
          setLastId(resp.lastId);
          setHasMoreProposals(resp.data.length === 20);
        } else setProposals([]);
      })
      .catch(_ => setProposals([]))
      .finally(() => setIsLoadingProposals(false));
  };
  const onClickFilterTag = tag => {
    setFilterOption(tag);
    setFilterMore("More");
  };
  const onChangeFilterMore = val => {
    setFilterMore(val);
    setFilterOption("");
  };

  const handleScroll = async e => {
    if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 42) {
      if (hasMore) {
        // getMediaPodsInformation(pods);
        loadMore(true);
      }
    }
  };

  const handleRefresh = () => {
    loadMore(true);
    loadMoreProposals(true);
  };

  return (
    <>
      <Ellipse />
      <div className={classes.content} onScroll={handleScroll}>
        <img src={require("assets/icons/wallet_simple.svg")} alt="wallet" className={classes.img2} />
        <div className={classes.img1}>
          <GovernanceImg />
        </div>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" width="100%">
          <h2>
            ✨ <span>NFT</span> Pods
          </h2>
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
          <img src={require("assets/pixImages/ellipse_gradient.png")} className={classes.blueEllipse} />
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
            {/* filter tags */}
            {/* <Box display="flex" alignItems="flex-end" pb={3} pt={1} flexWrap="wrap">
              {filterTagOptions.map(tag => (
                <>
                  <Box
                    className={`${classes.filterTag} ${filterOption === tag ? classes.filterActive : ""}`}
                    onClick={() => {
                      onClickFilterTag(tag);
                    }}
                  >
                    {tag}
                  </Box>
                </>
              ))}
              <Box
                className={`${classes.filterTag} ${
                  filterMore.length > 0 && filterMore !== "More" ? classes.filterActive : ""
                }`}
              >
                <CustomPopup
                  items={filterTagMorOptions}
                  onSelect={onChangeFilterMore}
                  value={filterMore}
                  theme="light"
                />
              </Box>
            </Box> */}
            <LoadingWrapper loading={loadingTrendingPods} theme={"blue"}>
              <div className={classes.artCards} style={{ marginTop: 10 }}>
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
              {isLoading && (
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
            <div style={{ zIndex: 1, width: "100%" }}>
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
