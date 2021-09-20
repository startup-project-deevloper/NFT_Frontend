import React, { useEffect, useState, useRef, useCallback } from "react";
import styled from "styled-components";
import clsx from "clsx";
import InfiniteScroll from "react-infinite-scroll-component";

import { Grid, useMediaQuery, useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { Color, PrimaryButton } from "shared/ui-kit";
import PodCard from "components/PriviMusicDao/components/Cards/PodCard";
import CreatePodModal from "components/PriviMusicDao/modals/CreatePodModal/CreatePodModal";
import { CircularLoadingIndicator } from "shared/ui-kit";
import { musicDaoGetTrendingPods, musicDaoGetPods, musicDaoGetPodsProposal } from "shared/services/API";
import { podsPageStyles } from "./index.styles";
import { SearchIcon } from "../../components/Icons/SvgIcons";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import CustomPopup from "components/PriviMusicDao/components/CustomPopup";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { useTypedSelector } from "store/reducers/Reducer";
import { getUser } from "store/selectors";
import { useDebounce } from "use-debounce/lib";
import PodProposalCard from "components/PriviMusicDao/components/Cards/PodProposalCard";

const FILTEROPTIONS = ["Trending", "Hot", "New"];
const ALLMOREOPTIONS = ["Newest pods"]
const MOREOPTONS = ["More"];

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

export default function PodsPage() {
  const classes = podsPageStyles();
  const user = useTypedSelector(getUser);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [selectedFilterOptions, setSelectedFilterOptions] = useState<string>(FILTEROPTIONS[0]);

  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [trendingPods, setTrendingPods] = useState<any[]>();
  const [pods, setPods] = useState<any[]>([]);
  const [selectedAllMoreOption, setSelectedAllMoreOption] = useState<string>(ALLMOREOPTIONS[0]);

  const [proposals, setProposals] = useState<any[]>([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState<boolean>(false);
  const [lastId, setLastId] = useState<any>();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedMoreOption, setSelectedMoreOption] = useState<string>(MOREOPTONS[0]);
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [showSearchBox, setShowSearchBox] = React.useState<boolean>(false);
  const [isNewSelected, setIsNewSelected] = React.useState<boolean>(true);

  const [debouncedSearchValue] = useDebounce(searchValue, 500);

  // pagination
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [hasMoreProposals, setHasMoreProposals] = useState<boolean>(true);
  const lastIdRef = useRef<string>("");

  // load trending pods
  useEffect(() => {
    handleRefresh();
  }, []);

  useEffect(() => {
    setLastId(undefined);
    if (user?.address && !isLoadingProposals) {
      loadMoreProposals();
    }
  }, [user?.address, debouncedSearchValue, isNewSelected]);

  const loadMoreProposals = () => {
    setIsLoadingProposals(true);
    musicDaoGetPodsProposal(user.address, isNewSelected, debouncedSearchValue, lastId)
      .then(resp => {
        if (resp?.success) {
          setProposals(resp.data);
          setLastId(resp.lastId);
          setHasMoreProposals(resp.data.length === 20);
        } else setProposals([]);
      })
      .catch(_ => setProposals([]))
      .finally(() => setIsLoadingProposals(false));
  };

  // load pods for next page
  const loadMore = () => {
    if (isLoading) return;
    setIsLoading(true);
    musicDaoGetPods(lastIdRef.current).then(resp => {
      setIsLoading(false);
      if (resp?.success) {
        const data = resp.data;
        const nextPagePods = data.pods;
        setHasMore(data.hasMore ?? false);
        setPods([...pods, ...nextPagePods]);
        lastIdRef.current = nextPagePods.length ? nextPagePods[nextPagePods.length - 1].Id : "";
      }
    });
  };

  const handleRefresh = useCallback(() => {
    musicDaoGetTrendingPods()
      .then(resp => {
        if (resp?.success) setTrendingPods(resp.data);
        else setTrendingPods([]);
      })
      .catch(_ => setTrendingPods([]));
    loadMore();
  }, []);

  return (
    <Box className={classes.content} id={"scrollContainer"}>
      <div className={classes.gradient} />
      <img src={require("assets/musicDAOImages/music-green1.png")} className={classes.green1} />
      <img src={require("assets/musicDAOImages/music-green2.png")} className={classes.green2} />
      <Box
        className={classes.flexBox}
        width={1}
        justifyContent="center"
        flexDirection="column"
        mt={2}
        zIndex={1}
      >
        <div className={classes.headerTitle}>
          <span>Music</span> Pods
        </div>
        <div className={classes.header2}>
          {isMobile ? (
            <Box textAlign="center">
              <span>Stake privi</span>, get songs to upload and earn a share of the funds when the song is
              claimed by artist.
            </Box>
          ) : (
            <>
              <span>Stake privi</span>, get songs to upload and earn a share
              <br /> of the funds when the song is claimed by artist.
            </>
          )}
        </div>
        <PrimaryButton
          size="medium"
          onClick={() => setOpenCreateModal(true)}
          isRounded
          style={{ background: "#2D3047", paddingLeft: "58px", paddingRight: "58px", height: 52 }}
        >
          Create new Pod
        </PrimaryButton>
      </Box>
      <Box className={classes.flexBox} width={1} mt={4} zIndex={1} borderBottom="1px solid #00000022">
        <Box
          className={clsx(classes.tabItem, { [classes.tabItemActive]: activeTab === 0 })}
          onClick={() => setActiveTab(0)}
        >
          <Box className={classes.header5}>Explore Trending</Box>
        </Box>
        <Box
          className={clsx(classes.tabItem, { [classes.tabItemActive]: activeTab === 1 })}
          ml={2}
          onClick={() => setActiveTab(1)}
        >
          <Box className={classes.header5}>Pod Proposals</Box>
        </Box>
      </Box>
      {activeTab === 0 ? (
        <>
          <Box mt={2} zIndex={1}>
            <Box className={classes.filterContainer}>
              <Box display="flex" alignItems="center">
                {FILTEROPTIONS.map((item, index) => (
                  <Box className={classes.optionSection}>
                    <Box
                      className={
                        selectedFilterOptions === FILTEROPTIONS[index]
                          ? classes.selectedFilterButtonBox
                          : classes.filterButtonBox
                      }
                      mr={1}
                      onClick={() => setSelectedFilterOptions(item)}
                      height="37px"
                    >
                      <Box className={classes.header3}>{item}</Box>
                    </Box>
                  </Box>
                ))}
                <Box className={classes.filterButtonBox}>
                  <CustomPopup
                    items={MOREOPTONS}
                    value={selectedMoreOption}
                    onSelect={value => setSelectedMoreOption(value)}
                    theme="dark"
                  />
                </Box>
              </Box>
              <Box className={classes.optionSection}>
                <Box className={classes.filterButtonBox} ml={1} style={{ cursor: "auto" }}>
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
                </Box>
              </Box>
            </Box>
            <LoadingWrapper loading={!trendingPods || trendingPods.length === 0}>
              <Box mt={4}>
                <Grid container spacing={2} wrap="wrap">
                  {trendingPods?.map((pod, index) => (
                    <Grid key={`trending-pods-${index}`} item xs={12} sm={6} md={4} lg={3}>
                      <PodCard pod={pod} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </LoadingWrapper>
            <Box className={classes.flexBox} justifyContent="space-between" mt={6} mb={2}>
              <Box className={classes.header1} color="#2D3047">
                All
              </Box>
              <Box className={classes.flexBox}>
                <Box color={Color.MusicDAODark} fontSize={12} fontWeight={500} mr="10px">
                  Sort by
                </Box>
                <CustomPopup
                  items={ALLMOREOPTIONS}
                  value={selectedAllMoreOption}
                  onSelect={value => setSelectedAllMoreOption(value)}
                  theme="dark"
                />
              </Box>
            </Box>
          </Box>
          <InfiniteScroll
            hasChildren={pods.length > 0}
            dataLength={pods.length}
            scrollableTarget={"scrollContainer"}
            next={loadMore}
            hasMore={hasMore}
            loader={
              isLoading && (
                <LoadingIndicatorWrapper>
                  <CircularLoadingIndicator />
                </LoadingIndicatorWrapper>
              )
            }
          >
            <Box mt={4}>
              <Grid container spacing={2} wrap="wrap">
                {pods.map((pod, index) => (
                  <Grid key={`pods-${index}`} item xs={12} sm={6} md={4} lg={3}>
                    <PodCard pod={pod} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </InfiniteScroll>
        </>
      ) : (
        <Box style={{ zIndex: 1 }}>
          <Box className={classes.filterContainer}>
            <Box className={classes.optionSection}>
              <Box
                className={isNewSelected ? classes.selectedFilterButtonBox : classes.filterButtonBox}
                mr={1}
                onClick={() => setIsNewSelected(prev => !prev)}
                height="37px"
              >
                <Box className={classes.header3}>New</Box>
              </Box>
              <Box className={classes.filterButtonBox}>
                <CustomPopup
                  items={MOREOPTONS}
                  value={selectedMoreOption}
                  onSelect={value => setSelectedMoreOption(value)}
                  theme="dark"
                />
              </Box>
            </Box>
            <Box className={classes.optionSection}>
              <Box className={classes.filterButtonBox} ml={1} style={{ cursor: "auto" }}>
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
              </Box>
            </Box>
          </Box>
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
        </Box>
      )}
      {openCreateModal && (
        <CreatePodModal
          onClose={() => setOpenCreateModal(false)}
          type={"Digital NFT"}
          handleRefresh={handleRefresh}
          open={openCreateModal}
        />
      )}
    </Box>
  );
}
