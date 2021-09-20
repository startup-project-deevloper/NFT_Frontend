import React, {useContext} from "react";

import { exploreCardStyles } from './index.styles';
import { exploreMock } from "../../../mockData";
import {useHistory} from "react-router-dom";
import MusicContext from "../../../../../../../shared/contexts/MusicContext";

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

export default function ExploreCard({ item }) {
  const classes = exploreCardStyles();
  const historyUse = useHistory();

  const { setOpenTab, history, setHistory } = useContext(MusicContext);

  let imageUrl;
  if (item.imageUrl) {
    imageUrl = item.imageUrl;
  } else {
    const len = exploreMock.length;
    const index = Math.floor(Math.random() * len);
    imageUrl = exploreMock[index].ImageUrl;
  }
  return (
    <div
      className={classes.card}
      onClick={() => {
        historyUse.push(`/trax/music/playlist/${item.id}`)
        setOpenTab({type: OpenType.Playlist, id: item.id, index: history.length});
        setHistory([...history, { type: OpenType.Playlist, id: item.id, index: history.length }]);
      }}
      style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}
    >
      <div className={classes.filter}>
        <div className={classes.name}>
          {item.title}
        </div>
      </div>
    </div>
  );
}
