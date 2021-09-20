import React, { useContext, useEffect, useState } from "react";

import { CircularProgress, Table } from "@material-ui/core";

import { priviMusicSubPageStyles } from '../index.styles';
import MusicContext from "shared/contexts/MusicContext";
import SongsRowHeader from "../../components/SongsRowHeader";
import SongRow from "../../components/SongRow";
import ActionsRow from "../../components/ActionsRow";
import SubpageHeader from "../../components/SubpageHeader";
import getAverageColor from "get-average-color";
import axios from "axios";
import URL from "shared/functions/getURL";
import URLTraxMicroservice from "../../../../../../shared/functions/getURLTraxMicroservice";


export default function PlaylistPage() {
  const classes = priviMusicSubPageStyles();
  const [playlist, setPlaylist] = useState<any>({ ImageUrl: null });

  const { openTab } = useContext(MusicContext);

  const [color, setColor] = useState<string>("#cccccc");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    refreshPlaylist();
  }, [openTab]);

  const refreshPlaylist = () => {
    if (!openTab) {
      setLoading(false);
      return;
    }
    console.log(openTab);
    axios
      .get(`${URLTraxMicroservice()}/playlists/details/${openTab.id}`)
      .then(response => {
        if (response.data.success) {
          const a = response.data.data;
          if (a) {
            const RANDOM_MOCK_PLAYLISTS_LENGTH = 19;
            if (!a.ImageUrl) {
              a.ImageUrl = require(`assets/mediaIcons/mockup/playlist_mock_up_${Math.floor(Math.random() * RANDOM_MOCK_PLAYLISTS_LENGTH) + 1
              }.png`);
            }
          }
          getAverageColor(a.ImageUrl).then(rgb => {
            if (rgb) {
              setColor(`rgba(${rgb.r},${rgb.g},${rgb.b},1)`);
            }
          });
          if (a.Color) {
            setColor(a.Color);
          }

          if (a.Songs && a.Songs.length > 0) {
            let d = 0;
            let duration = "";
            a.Songs.forEach(s => {
              if (s.Duration) {
                d = d + s.Duration;
              }
            });
            if (d > 0) {
              let hrs = Math.floor(d / 3600);
              let min = Math.floor((d % 3600) / 60);
              let seg = Math.floor(d % 60);
              duration = `${hrs && hrs > 0 ? `${hrs} hrs ` : ""}${min ?? 0} min ${seg ? seg.toFixed(0) : 0
              } seg`;
            } else {
              duration = `0 hrs 0 min 0 seg`;
            }

            setPlaylist({ ...a, Duration: duration });
          } else {
            setPlaylist(a);
          }
        }
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);

      });
  }

  if (loading) {
    return (
      <div className={classes.loaderDiv}>
        <CircularProgress style={{ color: "#A0D800" }} />
      </div>
    );
  } else if (playlist && !playlist.ImageUrl) {
    return (
      <div className={classes.page}>
        <SubpageHeader
          item={{
            empty: true,
            Color: color,
          }}
        />
        <div className={classes.content} style={{ marginTop: "104px" }}>
          <div className={classes.empty}>Playlist not found</div>
        </div>
      </div>
    );
  } else if (playlist && ((playlist.ImageUrl !== "" && color !== "#ffffff") || playlist.ImageUrl === "")) {
    return (
      <div className={classes.page}>
        <SubpageHeader item={{ ...playlist, Color: color, count: playlist.songs?.length || 0 }} />
        <div className={classes.content}>
          <ActionsRow item={playlist}
                      setItem={setPlaylist} />
          {playlist.songs && playlist.songs.length > 0 &&
            <Table className={classes.table}>
              <SongsRowHeader page="playlist"/>
              {playlist.songs.map((song, index) => (
                <SongRow row={song}
                         simplified={false}
                         page="playlist"
                         playlist={playlist.id}
                         refreshPlaylist={() => refreshPlaylist()}
                         key={`song-${index}`} />
              ))}
            </Table>
          }
        </div>
      </div>
    );
  } else return null;
}
