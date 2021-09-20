import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

import { priviMusicSubPageStyles } from "../index.styles";
import { COLUMNS_COUNT_BREAK_POINTS_SIX } from "../SearchPage";
import PlaylistCard from "../../components/Cards/PlaylistCard";
import SubpageHeader from "../../components/SubpageHeader";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import URL from "shared/functions/getURL";
import { RootState } from "store/reducers/Reducer";
import { CircularProgress } from "@material-ui/core";
import URLTraxMicroservice from "../../../../../../shared/functions/getURLTraxMicroservice";

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
}

export default function MyPlaylistPage() {
  const classes = priviMusicSubPageStyles();
  const userSelector = useSelector((state: RootState) => state.user);

  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadPlaylists = () => {
    if(userSelector && userSelector.id) {
      axios
        .get(`${URLTraxMicroservice()}/playlists/getMyPlaylists/${userSelector.id}`)
        .then(async response => {
          const resp = response.data;
          if (resp.success) {
            const data = resp.myPlayLists;
            const playlistsData = data
              .map(item => {
                return {
                  ...item,
                  Type: OpenType.Playlist,
                };
              });
            setPlaylists(playlistsData);
            setLoading(false);
          }
        })
        .catch(error => { })
        .finally(() => {
          setLoading(false);
        })
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, [userSelector]);

  return (
    <div className={classes.page}>
      <div className={classes.content}>
        <div className={classes.title}>
          Playlist
        </div>
        {loading ?
          <div className={classes.loaderDiv}>
            <CircularProgress style={{ color: "#A0D800" }} />
          </div>
          :
          (playlists && playlists.length > 0) ? (
            <div className={classes.cards}>
              <MasonryGrid
                gutter={"30px"}
                data={playlists}
                renderItem={(item, index) => <PlaylistCard item={item} key={`item-${index}`} />}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_SIX}
              />
            </div>
          ) : (
            <div className={classes.content} style={{ marginTop: "104px" }}>
              <div className={classes.empty}>You have not created any Playlist</div>
            </div>
          )
        }
      </div>
    </div>
  );
}
