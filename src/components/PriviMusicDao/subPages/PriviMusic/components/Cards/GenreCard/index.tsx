import React, { useContext } from "react";

import { genreCardStyles } from "./index.styles";
import URL from "shared/functions/getURL";
import MusicContext from "shared/contexts/MusicContext";
import {useHistory} from "react-router-dom";

const RANDOM_MOCK_PLAYLISTS_LENGTH = 19;

export default function GenreCard({ item, size }) {
  const classes = genreCardStyles();
  const { setOpenTab, history, setHistory } = useContext(MusicContext);
  const historyUse = useHistory();

  if (size === "large") {
    const imageUrl = encodeURI(`${URL()}/genres/${item.genres.replace("/", " ")}.jpeg`);
    return (
      <div
        className={classes.card}
        onClick={() => {
          setOpenTab({type: item.Type, id: item.id, index: history.length});
          setHistory([...history, { type: item.Type, id: item.id, index: history.length }]);
          historyUse.push(`/trax/music/genre/${item.id}`);
        }}
        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : "none" }}
      >
        <div className={classes.filter}>
          <div className={classes.name}>{item.genres}</div>
        </div>
      </div>
    )
  } else {
    return (
      <div
        className={classes.smallCard}
        onClick={() => {
          setOpenTab({type: item.Type, id: item.id, index: history.length});
          setHistory([...history, { type: item.Type, id: item.id, index: history.length }]);
        }}
      >
        <div
          className={classes.album}
          style={{
            backgroundImage: item.genre_image
              ? `url(${item.genre_image})`
              : `url(${require(`assets/mediaIcons/mockup/playlist_mock_up_${Math.floor(Math.random() * RANDOM_MOCK_PLAYLISTS_LENGTH) + 1
                }.png`)})`,
          }}
        />
        <div className={classes.title}>{item.genres ?? "Title"}</div>
        <div className={classes.description}>{item.genre_description ?? "Description or creator name"}</div>
      </div>
    )
  }
}
