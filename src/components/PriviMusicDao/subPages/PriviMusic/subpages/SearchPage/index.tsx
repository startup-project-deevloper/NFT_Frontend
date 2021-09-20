import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import cls from "classnames";
import { useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";

import { RootState } from "store/reducers/Reducer";

import {CircularProgress, Grid, Table, useMediaQuery} from "@material-ui/core";

import { priviMusicSubPageStyles } from "../index.styles";
import ArtistCard from "../../components/Cards/ArtistCard";
import MusicContext from "shared/contexts/MusicContext";
import PlaylistCard from "../../components/Cards/PlaylistCard";
import AlbumCard from "../../components/Cards/AlbumCard";
import GenreCard from "../../components/Cards/GenreCard";
import ExploreCard from "../../components/Cards/ExploreCard";
import SongRow from "../../components/SongRow";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import { useTypedSelector } from "store/reducers/Reducer";
import SongsRowHeader from "../../components/SongsRowHeader";
import URLTraxMicroservice from "../../../../../../shared/functions/getURLTraxMicroservice";
import {useHistory} from "react-router-dom";
import {Text} from "../../../../components/ui-kit";
import SongCard from "../../../../components/SongCard";
import TrendingSongCard from "../../../../components/TrendingSongCard";
import {setEthExternalWallet} from "../../../../../../store/actions/User";

enum OpenType {
  Home = "HOME",
  Playlist = "PLAYLIST",
  MyPlaylist = "MYPLAYLIST",
  Album = "ALBUM",
  Artist = "ARTIST",
  Liked = "LIKED",
  Library = "LIBRARY",
  Search = "SEARCH",
  Queue = "QUEUE",
  GenreList = "GENRELIST",
  Genre = "GENRE",
  Song = "SONG",
  RecentSearches = "RECENTSEARCHES",
  ExploreAll = "EXPLOREALL"
}

export default function SearchPage() {
  const classes = priviMusicSubPageStyles();
  const { openTab, setOpenTab } = useContext(MusicContext);
  const user = useTypedSelector(state => state.user);
  const historyUse = useHistory();

  const tabletMatch = useMediaQuery("(max-width:1280px)");
  const mobileMatch = useMediaQuery("(max-width:960px)");

  const [searchValue, setSearchValue] = useState<string>("");
  const [isSearched, setSearched] = useState<boolean>(false);
  const [changeTab, setChangeTab] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false);

  const getSearchInfo = () => {
    axios
      .get(`${URLTraxMicroservice()}/musicDao/search/getInfo`)
      .then(response => {
        if (response.data.success) {
          console.log('data', response.data.data);
          const artists = response.data.data.artists.map(item => {
            return {
              ...item,
              Type: OpenType.Artist,
            };
          });
          artists.sort((a, b) => a.artist_name.localeCompare(b.artist_name))

          const playlists = response.data.data.playlists.map(item => {
            return {
              ...item,
              Type: OpenType.Playlist,
            };
          });

          /*const songs = response.data.data.songs.map(item => {
            return {
              ...item,
              Type: OpenType.Song,
            };
          });*/

          setRecentSearches([
            // ...songs,
            ...artists,
            ...playlists
          ])

          setTopGenres(response.data.data.genres.map((item: any) => ({
            ...item,
            Type: OpenType.Genre,
          })));

          setExplore(response.data.data.trendingPlaylists || []);

          setLoading(false);
        }
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
      });
  }

  const [recentSearches, setRecentSearches] = useState<any[]>([]);

  const [topGenres, setTopGenres] = useState<any[]>([]);
  const [explore, setExplore] = useState<any[]>([]);

  const [mainResult, setMainResult] = useState<any>({});
  const [songs, setSongs] = useState<any[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<any[]>([]);
  const [withArtistName, setWithArtistName] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [filteredPlaylists, setFilteredPlaylists] = useState<any[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [filteredAlbums, setFilteredAlbums] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [filteredGenres, setFilteredGenres] = useState<any[]>([]);

  const [showMoreArtists, setShowMoreArtists] = useState<boolean>(false);
  const [showMorePlaylists, setShowMorePlaylists] = useState<boolean>(false);
  const [showMoreAlbums, setShowMoreAlbums] = useState<boolean>(false);
  const [showMoreGenres, setShowMoreGenres] = useState<boolean>(false);
  const userSelector = useSelector((state: RootState) => state.user);

  const handleClearHistory = () => {
    setRecentSearches([]);
  };

  useEffect(() => {
    getSearchInfo();
  }, []);

  useEffect(() => {
    const link = window.location.href.split("/")[7] || null;

    if(link && link !== '') {
      if(link === "recent-searches") {
        setOpenTab({ type: OpenType.RecentSearches, id: undefined, index: 0 });
      } else if(link === "genres") {

      } else if(link === "explore-all") {

      }
    }
  }, [changeTab]);

  useEffect(() => {
    if (!user) {
      return;
    }
    if (!albums.length && !artists.length && !playlists.length) {
      return;
    }
  }, [user, albums, artists, playlists]);

  useEffect(() => {
    if (!user || !genres.length) {
      return;
    }
  }, [user, genres]);

  const [onSearch] = useDebouncedCallback(() => {
    if (searchValue && searchValue !== "") {
      setLoadingSearch(true);
      if (!isSearched) setSearched(true);
      axios
        .get(`${URLTraxMicroservice()}/musicDao/search/${searchValue}`).then(res => {
          const resp = res.data;
          if (resp.success) {
            const data = resp.data;
            setMainResult(data.mainResult);
            setFilteredAlbums(data.albums);
            setFilteredArtists(data.artists);
            setFilteredGenres(data.genres);
            setFilteredPlaylists(data.playlists);
            setFilteredSongs(data.songs);
            /*setWithArtistName([
              ...albums.filter(a => a.artist_name.includes(searchValue.toUpperCase())),
              ...playlists.filter(
                a => a.Artist && a.Artist.Name && a.Artist.Name.toUpperCase().includes(searchValue.toUpperCase())
              ),
            ]);*/
            setLoadingSearch(false);
          }
        }).catch(error => {
          console.log(error);
        });
    } else {
      setFilteredAlbums(albums);
      setFilteredArtists(artists);
      setFilteredGenres(genres);
      setFilteredPlaylists(playlists);
      setFilteredSongs(songs);
      setSearched(false);
    }
  }, 1000);

  const RecentSearchGrid = () => {
    let sliceSize : number = 0;

    if(mobileMatch) {
      sliceSize = 2;
    } else if(tabletMatch) {
      sliceSize = 4
    } else {
      sliceSize = 6
    }

    return(
      <Grid container
            spacing={2}>
        {recentSearches.slice(0, sliceSize).map((item, index) => (
          <Grid
            key={`genre-card-${index}`}
            item xl={1} lg={2} md={3} xs={6}
          >
            {
              item.Type === OpenType.Playlist ? (
                <PlaylistCard item={item} key={`item-${index}`} />
              ) : item.Type === OpenType.Album ? (
                <AlbumCard item={item} key={`item-${index}`} />
              ) : (
                <ArtistCard item={item} key={`item-${index}`} />
              )
            }
          </Grid>
        ))
        }
      </Grid>
    )
  }

  return (
    <div className={classes.pageHeader}>
      {
        loading ?
          <div className={classes.loaderDiv}>
            <CircularProgress style={{ color: "#A0D800" }} />
          </div> :
          <div className={classes.content}>
            <div className={classes.searcher}>
              <SearchWithCreate
                searchValue={searchValue}
                handleSearchChange={e => {
                  setSearchValue(e.target.value);
                  onSearch();
                }}
                searchPlaceholder="Search Privi Music"
                // onSearch={onSearch}
              />
            </div>

            {
              loadingSearch ?
                <div className={classes.loaderDiv}>
                  <CircularProgress style={{ color: "#A0D800" }} />
                </div> :
                <>
                  {!isSearched ? (
                    <div>
                      {recentSearches && recentSearches.length > 0 && (
                        <div className={classes.title}>
                          Recent searches
                          {
                            recentSearches && recentSearches.length >= 6 ?
                              <span onClick={() => {
                                historyUse.push("/trax/music/search/recent-searches");
                                setOpenTab({type: OpenType.RecentSearches, id: undefined, index: 0})
                              }}>
                                VIEW MORE
                              </span> : null
                          }

                        </div>
                      )}
                      {recentSearches && recentSearches.length > 0 && (
                        <RecentSearchGrid/>
                      )}
                      {/*<div className={cls(classes.cardsHide, classes.cards)}>
                    <MasonryGrid
                      gutter={"30px"}
                      data={recentSearches}
                      renderItem={(item, index) =>
                        item.Type === OpenType.Playlist ? (
                          <PlaylistCard item={item} key={`item-${index}`} />
                        ) : item.Type === OpenType.Album ? (
                          <AlbumCard item={item} key={`item-${index}`} />
                        ) : (
                          <ArtistCard item={item} key={`item-${index}`} />
                        )
                      }
                      columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                    />
                  </div>*/}

                      {topGenres && topGenres.length > 0 && (
                        <div className={classes.title}
                             style={{marginTop: "48px"}}>
                          Genres
                          <span onClick={() => {
                            historyUse.push("/trax/music/search/genres");
                            setOpenTab({type: OpenType.GenreList, id: undefined, index: 0})
                          }}>
                            VIEW MORE
                          </span>
                        </div>
                      )}
                      {topGenres && topGenres.length > 0 && (
                        <div className={cls(classes.genreCardsHide, classes.genreCards)}>
                          <MasonryGrid
                            gutter={"30px"}
                            data={topGenres}
                            renderItem={(item, index) => <GenreCard item={item} size="large" key={`genre-${index}`} />}
                            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
                          />
                        </div>
                      )}
                      {
                        explore && explore.length > 0 &&
                        <div className={classes.title}>
                          Explore all
                          <span onClick={() => {
                            setOpenTab({type: OpenType.ExploreAll, id: undefined, index: 0})
                          }}>
                            VIEW MORE
                          </span>
                        </div>
                      }
                      {explore && explore.length > 0 && (
                        <div className={classes.exploreCards}>
                          <MasonryGrid
                            gutter={"30px"}
                            data={explore}
                            renderItem={(item, index) => (
                              <ExploreCard item={item}
                                           key={`explore-${index}`} />
                            )}
                            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div>
                      <Grid container direction="row" spacing={2} style={{ marginBottom: "48px" }}>
                        {
                          mainResult ?
                            <Grid item xs={3}>
                              <div className={classes.title}>Main result</div>
                              {mainResult ? (
                                mainResult.Type === OpenType.Playlist || mainResult.Type === OpenType.Album ? (
                                  <AlbumCard item={mainResult}/>
                                ) : (
                                  <ArtistCard item={mainResult}/>
                                )
                              ) : null}
                            </Grid> :
                            null
                        }
                        {
                          filteredSongs &&
                          filteredSongs.length > 0 ?
                            <Grid item xs={mainResult ? 9 : 12}>
                              <div className={classes.title}>
                                Songs
                                <span onClick={handleClearHistory}>
                              CLEAR SEARCH HISTORY
                            </span>
                              </div>
                              <Table className={classes.table}>
                                <SongsRowHeader page="search"/>
                                {filteredSongs &&
                                filteredSongs.length > 0 &&
                                filteredSongs
                                  .filter((s, i) => i < 4)
                                  .map((song, index) =>
                                    <SongRow row={song}
                                             simplified={false}
                                             page="search"
                                             key={`row-${index}`} />)}
                              </Table>
                            </Grid> :
                            null
                        }
                      </Grid>
                      {withArtistName && withArtistName.length > 0 && (
                        <div className={classes.title}>With artist name</div>
                      )}
                      {withArtistName && withArtistName.length > 0 && (
                        <div className={cls(classes.cardsHide, classes.cards)}>
                          <MasonryGrid
                            gutter={"30px"}
                            data={withArtistName}
                            renderItem={(item, index) => <AlbumCard item={item} key={`item-${index}`} />}
                            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                          />
                        </div>
                      )}

                      {filteredArtists && filteredArtists.length > 0 && (
                        <div className={classes.title}>
                          Artists{" "}
                          {
                            filteredArtists && filteredArtists.length >= 5 ?
                              <span onClick={() => setShowMoreArtists(!showMoreArtists)}>
                                {showMoreArtists ? "HIDE" : "VIEW MORE"}
                              </span> :
                              null
                          }
                        </div>
                      )}
                      {filteredArtists && filteredArtists.length > 0 && (
                        <div className={cls({ [classes.cardsHide]: !showMoreArtists }, classes.cards)}>
                          <MasonryGrid
                            gutter={"30px"}
                            data={filteredArtists}
                            renderItem={(item, index) => <ArtistCard item={item} key={`item-${index}`} />}
                            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                          />
                        </div>
                      )}

                      {filteredAlbums && filteredAlbums.length > 0 && (
                        <div className={classes.title}>
                          Albums{" "}
                          {
                            filteredAlbums && filteredAlbums.length >= 5 ?
                              <span onClick={() => setShowMoreAlbums(!showMoreAlbums)}>
                                {showMoreAlbums ? "HIDE" : "VIEW MORE"}
                              </span> : null
                          }
                        </div>
                      )}
                      {filteredAlbums && filteredAlbums.length > 0 && (
                        <div className={cls({ [classes.cardsHide]: !showMoreAlbums }, classes.cards)}>
                          {" "}
                          <MasonryGrid
                            gutter={"30px"}
                            data={filteredAlbums}
                            renderItem={(item, index) => <AlbumCard item={item} key={`item-${index}`} />}
                            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                          />
                        </div>
                      )}

                      {filteredPlaylists && filteredPlaylists.length > 0 && (
                        <div className={classes.title}>
                          Playlists{" "}
                          {
                            filteredPlaylists && filteredPlaylists.length >= 5 ?
                              <span onClick={() => setShowMorePlaylists(!showMorePlaylists)}>
                                {showMorePlaylists ? "HIDE" : "VIEW MORE"}
                              </span> : null
                          }
                        </div>
                      )}
                      {filteredPlaylists && filteredPlaylists.length > 0 && (
                        <div className={cls({ [classes.cardsHide]: !showMorePlaylists }, classes.cards)}>
                          <MasonryGrid
                            gutter={"30px"}
                            data={filteredPlaylists}
                            renderItem={(item, index) => <PlaylistCard item={item} key={`item-${index}`} />}
                            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
                          />
                        </div>
                      )}

                      {filteredGenres && filteredGenres.length > 0 && (
                        <div className={classes.title}>
                          Genres
                          <span onClick={() => setShowMoreGenres(!showMoreGenres)}>
                            {showMoreGenres ? "HIDE" : "VIEW MORE"}
                          </span>
                        </div>
                      )}
                      {filteredGenres && filteredGenres.length > 0 && (
                        <div className={cls({ [classes.genreCardsHide]: !showMoreGenres }, classes.genreCards)}>
                          <MasonryGrid
                            gutter={"30px"}
                            data={filteredGenres}
                            renderItem={(item, index) => <GenreCard item={item} size="large" key={`genre-${index}`} />}
                            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_THREE}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </>
            }
          </div>
      }
    </div>
  );
}

export const COLUMNS_COUNT_BREAK_POINTS_SIX = {
  400: 1,
  570: 2,
  700: 3,
  800: 4,
  1200: 5,
  1440: 6,
};

const COLUMNS_COUNT_BREAK_POINTS_THREE = {
  675: 1,
  900: 2,
  1440: 3,
};
