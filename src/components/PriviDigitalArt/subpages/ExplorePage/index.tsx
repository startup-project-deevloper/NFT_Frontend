import React, { useEffect, useState, useCallback, useContext } from "react";
import { useDebounce } from "use-debounce";
import cls from "classnames";
import axios from "axios";

import { useTypedSelector } from "store/reducers/Reducer";
import ArtistCard from "../../components/Cards/ArtistCard";
import CollectionCard from "../../components/Cards/CollectionCard";
import DigitalArtCard from "../../components/Cards/DigitalArtCard";
import DigitalArtContext from "shared/contexts/DigitalArtContext";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import URL from "shared/functions/getURL";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
import { useMediaPreloader } from "shared/hooks/useMediaPreloader";
import { CircularLoadingIndicator } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { subPageStyles } from "../index.styles";
import { getCollectionsForPlatforms } from "../../components/Filters/CollectionsSelect";

// const Tabs = ["Featured", "Artists", "Top Artists", "Collections", "Top Collections"];
const Tabs = ["Featured", "Top Artists", "Top Collections"];

export default function ExplorePage() {
  const classes = subPageStyles();

  const [value, setValue] = useState<string>();
  const [searchValue] = useDebounce(value, 400);
  const user = useTypedSelector(state => state.user);
  const { refresh, filters, setRefresh, setFilters, setOpenFilters } = useContext(DigitalArtContext);
  const { data, hasMore, loadMore, reload, isLoading } = useMediaPreloader(filters);

  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [digitalArts, setDigitalArts] = useState<any[]>([]);
  const [topSellers, setTopSellers] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);

  const [loadingTopSellers, setLoadingTopSellers] = useState<boolean>(false);
  const [loadingArtists, setLoadingArtists] = useState<boolean>(false);
  const [lastId, setLastId] = useState<string>("null");

  const [filteredCollections, setFilteredCollections] = useState<any[]>(() =>
    getCollectionsForPlatforms(filters.platforms, filters.blockChains)
  );

  useEffect(() => {
    setOpenFilters(false);
    setFilters({
      ...filters,
      collection: undefined,
      status: undefined,
    });
  }, []);

  useEffect(() => {
    const collections = getCollectionsForPlatforms(filters.platforms, filters.blockChains);
    setFilteredCollections(collections);
  }, [filters]);

  useEffect(() => {
    if (refresh) {
      reload();
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    getTopSellers();
  }, []);

  useEffect(() => {
    const collections = getCollectionsForPlatforms(filters.platforms, filters.blockChains);
    const searched = collections.filter(collection =>
      collection?.label?.toLowerCase().includes(searchValue?.toLowerCase() || "")
    );
    searched.sort((a, b) => {
      if ((a.label || "") > (b.label || "")) return 1;
      if ((a.label || "") < (b.label || "")) return -1;
      return 0;
    });

    const filtered: any[] = [];
    searched.map(item => {
      const index = filtered.findIndex(collection => collection.name === item.name);

      if (index < 0) {
        filtered.push(item);
      } else if (filtered[index].blockChain === "Showtime") {
        filtered.splice(index, 1);
        filtered.push(item);
      }
    });

    setFilteredCollections(filtered);

    if (searchValue || searchValue === "") {
      setFilters({ ...filters, searchValue });
      if (selectedTab === 1) {
        if (searchValue) {
          setLastId("null");
          getArtists(true);
        } else {
          setArtists(topSellers);
        }
      }
    }
  }, [searchValue]);

  useEffect(() => {
    let medias = [...data.map(item => item.media)];
    if (user.uninterestedMedias) {
      medias = medias.filter(item => !user.uninterestedMedias?.includes(item.id));
    }
    setDigitalArts(medias);
  }, [data, user.uninterestedMedias]);

  const getArtists = useCallback(
    (isNew: boolean) => {
      if ((!isNew && !lastId) || !searchValue || loadingArtists) return;
      setLoadingArtists(true);
      axios
        .get(`${URL()}/artwork/getArtists?lastId=${isNew ? "null" : lastId}&searchValue=${searchValue}`)
        .then(res => {
          if (res.data.success) {
            setArtists(isNew ? res.data.data : artists.concat([...res.data.data]));
            setLastId(res.data.lastId);
          }
        })
        .catch(err => console.log(err))
        .finally(() => setLoadingArtists(false));
    },
    [lastId, searchValue, loadingArtists, setArtists, setLastId, setLoadingArtists]
  );

  const getTopSellers = useCallback(() => {
    setLoadingTopSellers(true);
    axios
      .get(`${URL()}/artwork/topsellers`)
      .then(res => {
        if (res.data.success) {
          const sortedData = res.data.userList;
          sortedData.sort((a, b) => b.myMediasCount - a.myMediasCount);
          setTopSellers(sortedData);
          if (!searchValue) {
            setArtists(sortedData);
          }
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoadingTopSellers(false));
  }, []);

  const handleScroll = React.useCallback(
    async e => {
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 100) {
        if (hasMore && selectedTab === 0) {
          loadMore();
        } else if (selectedTab === 1) getArtists(false);
      }
    },
    [hasMore, loadMore, getArtists]
  );

  return (
    <div className={classes.page} onScroll={handleScroll}>
      <div className={classes.content}>
        <Box className={classes.filters} display="flex" alignItems="center" mb={5} width={1}>
          <Box display="flex" alignItems="center">
            <div className={classes.headerTitle} style={{ marginBottom: 0 }}>
              ✨ All Digital Art
            </div>
            <Box
              onClick={() => {
                setOpenFilters(true);
              }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              ml={2}
              mb={0.5}
              p={1}
              style={{ cursor: "pointer", borderRadius: "50%", width: "38px" }}
            >
              <img src={require("assets/icons/filters.svg")} alt="filters" title="Filters" />
            </Box>
          </Box>
          <div className={classes.searcher}>
            <SearchWithCreate
              searchValue={value}
              handleSearchChange={e => {
                setValue(e.target.value);
              }}
              searchPlaceholder="Search Pix"
              autoFocus={false}
            />
          </div>
        </Box>
        <Box>
          <Box style={{ overflowX: "scroll" }} mb={2}>
            <Box display="flex" width="600px">
              {Tabs.map((tab, index) => (
                <div
                  key={`tab-${index}`}
                  className={cls({ [classes.selectedTab]: index === selectedTab }, classes.tab)}
                  onClick={() => {
                    setSelectedTab(index);
                  }}
                >
                  {tab}
                </div>
              ))}
            </Box>
          </Box>
          {selectedTab === 0 ? (
            <div className={classes.artCards}>
              {digitalArts && digitalArts.length ? (
                <>
                  <MasonryGrid
                    gutter={"24px"}
                    data={digitalArts}
                    renderItem={(item, index) => (
                      <DigitalArtCard heightFixed={false} item={item} key={`item-${index}`} />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                  {hasMore && (
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
                </>
              ) : isLoading || (!digitalArts.length && hasMore) ? (
                <div
                  style={{
                    width: "100%",
                    height: "calc(100vh - 280px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 16,
                    paddingBottom: 16,
                  }}
                >
                  <CircularLoadingIndicator theme="blue" />
                </div>
              ) : (
                <div className={classes.empty}>No results found</div>
              )}
            </div>
          ) : selectedTab === 1 ? (
            <div className={classes.artistCards}>
              {artists && artists.length ? (
                <>
                  <MasonryGrid
                    gutter={"24px"}
                    data={artists}
                    renderItem={(item, index) => (
                      <ArtistCard item={item} key={`item-${index}`} currentIndex={index} />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                  {(loadingArtists || loadingTopSellers) && (
                    <div
                      style={{
                        width: "100%",
                        height: "calc(100vh - 280px)",
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
                </>
              ) : (
                <div className={classes.empty}>No results found</div>
              )}
            </div>
          ) : selectedTab === 2 ? (
            <div className={classes.collectionCards}>
              {filteredCollections && filteredCollections.length ? (
                <>
                  <MasonryGrid
                    gutter={"24px"}
                    data={filteredCollections}
                    renderItem={(item, index) => (
                      <CollectionCard heightFixed={true} item={item} key={`item-${index}`} />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                </>
              ) : (
                <div className={classes.empty}>No results found</div>
              )}
            </div>
          ) : (
            <div className={classes.empty}>No results found</div>
          )}
        </Box>
      </div>
    </div>
  );
}

export const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  600: 2,
  1200: 3,
  1420: 4,
};
