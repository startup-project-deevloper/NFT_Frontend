import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import cls from "classnames";

import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, withStyles } from "@material-ui/core";

import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import Box from "shared/ui-kit/Box";
import { COLUMNS_COUNT_BREAK_POINTS_FOUR } from "../ExplorePage";
import DigitalArtCard from "../../components/Cards/DigitalArtCard";
import { subPageStyles } from "../index.styles";
import { likedPageStyles } from "./index.styles";
import PodCard from "components/PriviDigitalArt/components/Cards/PodCard";
import DigitalArtContext from "shared/contexts/DigitalArtContext";
import { getPixProfileItems } from "shared/services/API";
import SyntheticCollectionCard from "components/PriviDigitalArt/components/Cards/SyntheticCollectionCard";
import { getLikedSyntheticCollections } from "shared/services/API/SyntheticFractionalizeAPI";

const Tabs = ["Art", "Synthetic Collections", ""];
const sortOptions = ["Most Relevant", "Recently Added", "Alphabetical Order"];

export default function LikedPage() {
  const classes = subPageStyles();
  const likedClasses = likedPageStyles();
  const { setOpenFilters } = useContext(DigitalArtContext);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [menuItem, setMenuItem] = useState<number>(0);
  const user = useTypedSelector(state => state.user);
  const userId = React.useMemo(() => (user ? user.id : null), [user]);
  const [mediaPods, setMediaPods] = useState<any[]>([]);
  const [sortedLikedMedias, setSortedLikedMedias] = useState<any[]>([]);
  const [sortedLikedMediaPods, setSortedLikedMediaPods] = useState<any[]>([]);
  const [sortedLikedSynthetics, setSortedLikedSynthetics] = useState<any[]>([]);

  const [digitalArts, setDigitalArts] = useState<any[]>([]);
  const [syntheticCollections, setSyntheticCollections] = useState<any[]>([]);

  // const [artists, setArtists] = useState<any[]>([]);
  const [loadingMediaPods, setLoadingMediaPods] = useState<boolean>(true);
  const [loadingCollections, setLoadingCollections] = useState<boolean>(true);
  const [loadingDigitalArts, setLoadingDigitalArts] = useState<boolean>(true);
  // const [loadingArtists, setLoadingArtists] = useState<boolean>(false);

  const [openMenu, setOpenMenu] = React.useState(false);
  const anchorMenuRef = React.useRef<HTMLImageElement>(null);

  // const getLikedUsers = React.useCallback(() => {
  //   if (!userId) return;
  //   setLoadingArtists(true);
  //   axios
  //     .get(`${URL()}/user/getLikedUsers/${userId}`)
  //     .then(res => {
  //       if (res.data.success) setArtists(res.data.data);
  //     })
  //     .catch(err => console.log(err))
  //     .finally(() => {
  //       setLoadingArtists(false);
  //     });
  // }, [userId, setArtists, setLoadingArtists]);

  // useEffect(() => {
  //   getLikedUsers();
  // }, [getLikedUsers]);

  useEffect(() => {
    setOpenFilters(false);
  }, []);

  useEffect(() => {
    if (!userId) return;
    setLoadingDigitalArts(true);

    // 3 is referred to art tab
    getPixProfileItems(userId, true, "3")
      .then(resp => {
        if (resp?.success) {
          let medias = resp.data;
          if (user.uninterestedMedias) {
            medias = medias.filter(item => !user.uninterestedMedias?.includes(item.MediaSymbol || item.id));
          }

          setDigitalArts(medias);
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingDigitalArts(false);
      });

    // setLoadingMediaPods(true);
    // axios
    //   .get(`${URL()}/mediaPod/getMyLikedPods/${userId}`)
    //   .then(res => {
    //     if (res.data.success) {
    //       setMediaPods(res.data.data);
    //     }
    //   })
    //   .catch(err => console.log(err))
    //   .finally(() => {
    //     setLoadingMediaPods(false);
    //   });

    setLoadingCollections(true);
    getLikedSyntheticCollections(userId)
      .then(resp => {
        if (resp?.success) {
          setSyntheticCollections(resp.data);
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingCollections(false);
      });
  }, [userId]);

  useEffect(() => {
    let medias = [...digitalArts];
    if (user.uninterestedMedias) {
      medias = medias.filter(item => !user.uninterestedMedias?.includes(item.MediaSymbol || item.id));
    }
    setDigitalArts(medias);
  }, [user.uninterestedMedias]);

  useEffect(() => {
    let sorted: any[] = [];
    if (menuItem === 2) {
      sorted = digitalArts.sort((a, b) =>
        a.MediaName && b.MediaName ? a.MediaName.localeCompare(b.MediaName) : 0
      );
      setSortedLikedMedias(sorted);
    } else if (menuItem === 1) {
      sorted = digitalArts.sort((a, b) => b.StartingTime - a.StartingTime);
      setSortedLikedMedias(sorted);
    } else if (menuItem === 0) {
      sorted = digitalArts.sort((a, b) => b.TotalViews - a.TotalViews);
      setSortedLikedMedias(sorted);
    } else {
      setSortedLikedMedias(digitalArts);
    }
  }, [digitalArts, menuItem]);

  useEffect(() => {
    /*if (menuItem === 2) return mediaPods.sort((a, b) => a.MediaName.localeCompare(b.MediaName));
    else if (menuItem === 1) return mediaPods.sort((a, b) => b.ReleaseDate - a.ReleaseDate);
    return mediaPods;*/

    let sorted: any[] = [];
    if (menuItem === 2) {
      sorted = mediaPods.sort((a, b) => a.Name.localeCompare(b.Name));
      setSortedLikedMediaPods(sorted);
    } else if (menuItem === 1) {
      sorted = mediaPods.sort((a, b) => b.Date - a.Date);
      setSortedLikedMediaPods(sorted);
    } else if (menuItem === 0) {
      sorted = mediaPods.sort((a, b) => b.TotalViews - a.TotalViews);
      setSortedLikedMediaPods(sorted);
    } else {
      setSortedLikedMediaPods(digitalArts);
    }
  }, [mediaPods, menuItem]);

  // const sortedArtists = React.useMemo(() => {
  //   if (menuItem === 2) return artists.sort((a, b) => a.firstName.localeCompare(b.firstName));
  //   else if (menuItem === 1) return artists;
  //   return artists;
  // }, [artists, menuItem]);

  const handleToggleMenu = e => {
    e.stopPropagation();
    e.preventDefault();
    setOpenMenu(prevMenuOpen => !prevMenuOpen);
  };

  const handleCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorMenuRef.current && anchorMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpenMenu(false);
  };

  function handleListKeyDownMenu(e: React.KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      setOpenMenu(false);
    }
  }

  return (
    <div className={classes.page}>
      <div className={classes.content}>
        <div className={likedClasses.headerTitle}>✨ Saved Content</div>
        <Box display="flex" marginBottom="16px">
          {Tabs.map((tab, index) =>
            index !== Tabs.length - 1 ? (
              <div
                key={`tab-${index}`}
                className={cls({ [classes.selectedTab]: index === selectedTab }, classes.tab)}
                onClick={() => {
                  setSelectedTab(index);
                }}
              >
                {tab}
              </div>
            ) : (
              <div>
                <img
                  src={require("assets/icons/filters.svg")}
                  alt="sort"
                  onClick={handleToggleMenu}
                  ref={anchorMenuRef}
                  style={{ cursor: "pointer" }}
                />
                <Popper
                  open={openMenu}
                  anchorEl={anchorMenuRef.current}
                  transition
                  disablePortal
                  style={{ position: "inherit", zIndex: 3 }}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                        position: "inherit",
                      }}
                    >
                      <Paper className={likedClasses.paper}>
                        <ClickAwayListener onClickAway={handleCloseMenu}>
                          <MenuList
                            autoFocusItem={openMenu}
                            id="menu-list-grow"
                            onKeyDown={handleListKeyDownMenu}
                          >
                            {sortOptions.map((option, index) => (
                              <CustomMenuItem
                                key={`option-${index}`}
                                onClick={e => {
                                  setSortedLikedMedias([]);
                                  setSortedLikedMediaPods([]);
                                  setLoadingDigitalArts(true);
                                  setMenuItem(index);
                                  handleCloseMenu(e);
                                }}
                              >
                                <Box
                                  display="flex"
                                  alignItems="center"
                                  color={index === menuItem ? "#181818" : "#707582"}
                                >
                                  {option}
                                  {index === menuItem && (
                                    <img src={require("assets/icons/check_dark.png")} alt="check" />
                                  )}
                                </Box>
                              </CustomMenuItem>
                            ))}
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </div>
            )
          )}
        </Box>

        {
          selectedTab === 0 ? (
            <LoadingWrapper
              loading={loadingDigitalArts /*&& !sortedLikedMedias.length*/}
              theme={"blue"}
              height="calc(100vh - 250px)"
            >
              <div className={cls(classes.artCards)}>
                {sortedLikedMedias && sortedLikedMedias.length ? (
                  <MasonryGrid
                    gutter={"24px"}
                    data={sortedLikedMedias}
                    renderItem={(item, index) => (
                      <DigitalArtCard heightFixed={false} item={item} key={`item-${index}`} />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                ) : (
                  <div className={classes.empty}>No results</div>
                )}
              </div>
            </LoadingWrapper>
          ) : (
            selectedTab === 1 && (
              <LoadingWrapper loading={loadingCollections /*&& !sortedLikedMediaPods.length*/} theme={"blue"}>
                <div className={cls(classes.artCards)}>
                  {syntheticCollections && syntheticCollections.length ? (
                    <MasonryGrid
                      gutter={"24px"}
                      data={syntheticCollections}
                      renderItem={(item, index) => <SyntheticCollectionCard item={item} />}
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                    />
                  ) : (
                    <div className={classes.empty}>No results</div>
                  )}
                </div>
              </LoadingWrapper>
            )
          )
          // : (
          // <LoadingWrapper loading={loadingArtists}>
          //   <div className={cls(classes.artistCards)}>
          //     {sortedArtists && sortedArtists.length ? (
          //       <MasonryGrid
          //         gutter={"24px"}
          //         data={sortedArtists}
          //         renderItem={(item, index) => (
          //           <ArtistCard item={item} key={`item-${index}`}/>
          //         )}
          //         columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
          //       />
          //     ) : (
          //       <div className={classes.empty}>No results</div>
          //     )}
          //   </div>
          // </LoadingWrapper>
          // )
        }
      </div>
    </div>
  );
}

const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "& img": {
      width: "10px",
      height: "7px",
      marginLeft: "15px",
    },
  },
})(MenuItem);
