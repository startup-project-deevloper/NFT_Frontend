import React, { useContext, useState } from "react";

import { subpageHeaderStyles } from "./index.styles";
import MusicContext from "shared/contexts/MusicContext";
import Box from "shared/ui-kit/Box";
import { Gradient } from "shared/ui-kit";
import CreatePlaylistModal from "components/PriviMusic/modals/CreatePlaylistModal";
import { useTypedSelector } from "store/reducers/Reducer";
import { getUser } from "store/selectors";

enum OpenType {
  Home = "HOME",
  Playlist = "PLAYLIST",
  MyPlaylist = "MYPLAYLIST",
  Album = "ALBUM",
  Artist = "ARTIST",
  Liked = "LIKED",
  Library = "LIBRARY",
  Search = "SEARCH",
  CreatePlaylist = "CREATEPLAYLIST",
  Queue = "QUEUE",
}

export default function SubpageHeader({ item }) {
  const classes = subpageHeaderStyles();
  const { openTab, setOpenTab, history, setHistory } = useContext(MusicContext);
  const user = useTypedSelector(getUser);

  const [openPlaylistModal, setOpenPlaylistModal] = useState<boolean>(false);

  const handleOpenEditPlaylistModal = () => {
    setOpenPlaylistModal(true);
  };
  const handleCloseEditPlaylistModal = () => {
    setOpenPlaylistModal(false);
  };

  if (openTab && item)
    return (
      <div className={classes.headerContainer}>
        {!item.empty && (
          <div
            className={classes.header}
            style={
              openTab.type === OpenType.Artist
                ? {
                    height: "310px",
                    minHeight: "310px",
                    maxHeight: "310px",
                    background: `linear-gradient(360deg, #ffffff -100%, ${item.Color} 100%)`,
                  }
                : openTab.type === OpenType.Playlist
                ? {
                    height: "236px",
                    minHeight: "236px",
                    maxHeight: "236px",
                    background: Gradient.Green1,
                  }
                : openTab.type === OpenType.Album
                ? {
                    height: "310px",
                    minHeight: "310px",
                    maxHeight: "310px",
                    backgroundImage: item.album_image ? `url(${item.album_image})` : "none",
                  }
                : openTab.type === OpenType.MyPlaylist
                ? {
                    height: "auto",
                    minHeight: "auto",
                    maxHeight: "auto",
                  }
                : openTab.type === OpenType.CreatePlaylist
                ? {
                    height: "236px",
                    minHeight: "236px",
                    maxHeight: "236px",
                    background: "rgba(84, 101, 143, 0.3)",
                  }
                : {
                    background: `linear-gradient(90deg, #43CEA2 -20%, #185A9D 100%)`,
                  }
            }
          >
            <div
              className={openTab.type === OpenType.MyPlaylist ? classes.filterMyPlayList : classes.filter}
              style={{
                backgroundColor:
                  openTab.type === OpenType.Album ||
                  openTab.type === OpenType.Playlist ||
                  openTab.type === OpenType.CreatePlaylist ||
                  openTab.type === OpenType.Artist
                    ? "rgba(0,0,0, 0.2)"
                    : "transparent",
                cursor:
                  (openTab.type === OpenType.Playlist && user.id === item.Creator) ||
                  openTab.type === OpenType.CreatePlaylist
                    ? "pointer"
                    : "inherit",
              }}
              onClick={() => {
                if (
                  (openTab.type === OpenType.Playlist && user.id === item.Creator) ||
                  openTab.type === OpenType.CreatePlaylist
                ) {
                  handleOpenEditPlaylistModal();
                }
              }}
            >
              {
                openTab.type === OpenType.Artist && (
                  <div
                    className={classes.albumImage}
                    style={{
                      backgroundImage: item.artist_image ? `url(${item.artist_image})` : "none",
                    }}
                  />
                )
                // : openTab.type === OpenType.Playlist &&  user.id !== item.Creator? (
                //   <div
                //     className={classes.albumImage}
                //     style={{
                //       backgroundImage: item.ImageUrl ? `url(${item.ImageUrl})` : "none",
                //     }}
                //   />
                // ) : null
              }
              <Box display="flex" flexDirection="column" color="white">
                {(openTab.type === OpenType.Album ||
                  openTab.type === OpenType.Playlist ||
                  openTab.type === OpenType.Artist) && (
                  <label>
                    {openTab.type === OpenType.Artist && item.verified && `VERIFIED `}
                    {openTab.type}
                    {openTab.type === OpenType.Artist && item.verified && (
                      <img src={require("assets/icons/check_white.png")} alt="check" />
                    )}
                  </label>
                )}
                {openTab.type === OpenType.Playlist && item.artist_name && (
                  <Box
                    display="flex"
                    alignItems="center"
                    color="white"
                    fontSize="14px"
                    marginBottom="16px"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setOpenTab({type: OpenType.Artist, id: item.artist_name, index: history.length});
                      setHistory([
                        ...history,
                        { type: OpenType.Artist, id: item.artist_name, index: history.length },
                      ]);
                    }}
                  >
                    <div
                      className={classes.avatar}
                      style={{
                        backgroundImage: item.artist_image !== "" ? `url(${item.artist_image})` : "none",
                      }}
                    />
                    <b>{item.artist_name ?? "Artist Name"}</b>
                  </Box>
                )}
                {openTab.type === OpenType.CreatePlaylist && (
                  <Box className={classes.titleMyPlayList} style={{ color: "white" }} mb={2}>
                    PLAYLIST
                  </Box>
                )}
                <Box display="flex" alignItems="center">
                  <div
                    className={openTab.type === OpenType.MyPlaylist ? classes.titleMyPlayList : classes.title}
                    style={{
                      color:
                        openTab.type === OpenType.CreatePlaylist
                          ? "white"
                          : openTab.type === OpenType.MyPlaylist
                          ? "black"
                          : "white",
                    }}
                  >
                    {openTab.type === OpenType.Album
                      ? item.album_name ?? "Album Title"
                      : openTab.type === OpenType.Playlist || openTab.type === OpenType.CreatePlaylist
                      ? item.Title ?? "Playlist Name"
                      : openTab.type === OpenType.Artist
                      ? item.artist_name ?? "Artist Name"
                      : openTab.type === OpenType.Liked
                      ? "Liked Content"
                      : openTab.type === OpenType.Library
                      ? "Library"
                      : openTab.type === OpenType.MyPlaylist
                      ? "Playlist"
                      : "Queued"}
                  </div>
                  {(openTab.type === OpenType.Playlist || openTab.type === OpenType.CreatePlaylist) && (
                    <Box className={classes.flashBox}>
                      <Box className={classes.header1} mr={1}>
                        3
                      </Box>
                      <img src={require("assets/icons/flash.png")} alt="flash" />
                    </Box>
                  )}
                </Box>
                {openTab.type === OpenType.Album || openTab.type === OpenType.Artist ? (
                  <Box
                    display="flex"
                    alignItems="center"
                    color="white"
                    fontSize="14px"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setOpenTab({type: OpenType.Artist, id: item.artist_name, index: history.length});
                      setHistory([
                        ...history,
                        { type: OpenType.Artist, id: item.artist_name, index: history.length },
                      ]);
                    }}
                  >
                    <div
                      className={classes.avatar}
                      style={{
                        backgroundImage: item.artist_image ? `url(${item.artist_image})` : "none",
                      }}
                    />
                    {openTab.type === OpenType.Album ? (
                      <Box display="flex" alignItems="center">
                        <b>{item.artist_name ?? "Artist Name"}</b>
                        <span>·</span>
                        <span>{item.year ?? "unknown"}</span>
                        <span>·</span>
                        <span>{item.songs ? item.songs.length : "0"} songs</span>
                        <span>·</span>
                        <span>{item.duration}</span>
                      </Box>
                    ) : openTab.type === OpenType.Artist ? (
                      `${item.followers ? item.followers.length : 0} followers`
                    ) : null}
                  </Box>
                ) : openTab.type === OpenType.Library ||
                  openTab.type === OpenType.Liked ||
                  openTab.type === OpenType.Queue ? (
                  <span>{`${item.length ?? 0} songs`}</span>
                ) : openTab.type === OpenType.Playlist ? (
                  // <button className={classes.transparentButton} onClick={handleOpenEditPlaylistModal}>
                  //   Edit Playlist
                  // </button>
                  <Box className={classes.header1}>{item.Songs?.length || 0} Songs</Box>
                ) : null}
              </Box>
            </div>
            {openPlaylistModal && (
              <CreatePlaylistModal
                list={item}
                open={openPlaylistModal}
                handleClose={handleCloseEditPlaylistModal}
                handleRefresh={itm => {
                  //if (setItem) {
                  // TODO: fix this
                  //setItem(itm);
                  //}
                }}
              />
            )}
          </div>
        )}
      </div>
    );
  else return null;
}
