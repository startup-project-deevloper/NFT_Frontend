import React, {useContext, useEffect, useState} from "react";

import FreeZoneIndicator from "../FreeZoneIndicator";
import { subpageHeaderStyles } from "./index.styles";
import MusicContext from "shared/contexts/MusicContext";
import EditPlaylistModal from "../../modals/EditPlaylistModal";
import Box from "shared/ui-kit/Box";
import { Color, FontSize } from "shared/ui-kit";
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { BackDesktopIcon, BackMobileIcon } from "components/PriviMusicDao/components/Icons/SvgIcons";
import { useMediaQuery } from "@material-ui/core";

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
  Genre = "GENRE",
}

export default function SubpageHeader({ item }) {
  const classes = subpageHeaderStyles();
  const { openTab, setOpenTab, history, setHistory, goBack } = useContext(MusicContext);

  const mobileMatch = useMediaQuery("(max-width:600px)")
  const [openPlaylistModal, setOpenPlaylistModal] = useState<boolean>(false);

  const handleOpenEditPlaylistModal = () => {
    setOpenPlaylistModal(true);
  };
  const handleCloseEditPlaylistModal = () => {
    setOpenPlaylistModal(false);
  };

  useEffect(() => {
    console.log('item', item)
  }, [item]);

  if (openTab && item)
    return (
      <div className={classes.headerContainer}>
        {!item.empty && (
          <div
            className={classes.header}
            style={
              openTab.type === OpenType.Album ? {
                height: mobileMatch ? undefined : 310,
                minHeight: mobileMatch ? undefined : 310,
                maxHeight: mobileMatch ? undefined : 310,
                background: item.ImageUrl ? `url(${item.ImageUrl})` : `linear-gradient(360deg, #ffffff -100%, ${item.Color} 100%)`,
              } : openTab.type === OpenType.Playlist ?
                {
                  height: 235,
                  minHeight: 235,
                  maxHeight: 235,
                  background: item.ImageUrl ? `url(${item.ImageUrl})` : `linear-gradient(97.63deg, #A0D800 26.36%, #0DCC9E 80%)`,
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                } : openTab.type === OpenType.Artist ? {
                  height: 310,
                  minHeight: 310,
                  maxHeight: 310,
                  backgroundImage: item.artist_image ? `url(${item.artist_image})` : "none",
                } : openTab.type === OpenType.Genre ? {
                  height: 310,
                  minHeight: 310,
                  maxHeight: 310,
                  backgroundImage: item.artist_image ? `url(${item.artist_image})` : "none",
                }
                  : {
                    height: 225,
                    minHeight: 225,
                    maxHeight: 225,
                    background: `linear-gradient(90deg, #43CEA2 -20%, #185A9D 100%)`,
                  }
            }
          >
            {mobileMatch ? (
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                style={{
                  backgroundColor:
                    openTab.type === OpenType.Album ||
                      openTab.type === OpenType.Playlist ||
                      openTab.type === OpenType.Artist
                      ? "rgba(0,0,0, 0.2)"
                      : "transparent",
                  height: "100%"
                }}
                py={2.5}
                px={2}
              >
                <Box display="flex" flexDirection="row" justifyContent="flex-start" width={1} mb={3} style={{ cursor: "pointer" }} onClick={goBack}>
                  <BackMobileIcon />
                </Box>
                <Box display="flex" flexDirection="column" alignItems="center" justifyContent={openTab.type === OpenType.Artist ? "flex-end" : "flex-start"} flex={1}>
                  {openTab.type === OpenType.Album && (
                    <div
                      className={classes.albumImage}
                      style={{
                        backgroundImage: item.album_image ? `url(${item.album_image})` : "none",
                        position: "relative",
                        marginTop: 16,
                        marginBottom: 8,
                        marginRight: 0
                      }}
                    />
                  )}
                  {(openTab.type === OpenType.Album ||
                    openTab.type === OpenType.Artist) && (
                      <label style={{ color: Color.White }}>
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
                  <Box display="flex"
                       alignItems="center"
                       justifyContent="center"
                       mb={2}
                       style={{flexWrap: "wrap"}}>
                    <div className={classes.title} style={{ fontSize: 32, color: Color.White }}>
                      {openTab.type === OpenType.Album
                        ? item.album_name ?? "Album Title"
                        : openTab.type === OpenType.Playlist
                          ? item.Title ?? "Playlist Name"
                          : openTab.type === OpenType.Artist
                            ? item.artist_name ?? "Artist Name"
                            : openTab.type === OpenType.Liked
                              ? "Liked Content"
                              : openTab.type === OpenType.Library
                                ? "Library"
                                : openTab.type === OpenType.MyPlaylist
                                  ? "My Playlist"
                                  : "Queued"}
                    </div>
                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" borderRadius="100%" width={40} height={40} bgcolor="rgba(255, 255, 255, 0.3)" ml={2}>
                      <span style={{ marginLeft: 0, marginRight: 4, color: Color.White }}>3</span>
                      <img src={require("assets/icons/flash.png")} alt="flash" />
                    </Box>
                  </Box>
                  {openTab.type === OpenType.Album || openTab.type === OpenType.Artist ? (
                    <Box
                      display="flex"
                      flexDirection="column"
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
                      <Box display="flex" alignItems="center">
                        <div
                          className={classes.avatar}
                          style={{
                            backgroundImage: item.artist_image ? `url(${item.artist_image})` : "none",
                          }}
                        />
                        <b>{openTab.type === OpenType.Artist ? `${item.followers ? item.followers.length : 0} followers` : (item.artist_name ?? "Artist Name")}</b>
                      </Box>
                      {openTab.type === OpenType.Album ? (
                        <Box display="flex" alignItems="center" mt={1}>
                          {/*<span>{item.year ?? "unknown"}</span>
                          <span>·</span>*/}
                          <span>{item.songs ? item.songs.length : "0"} songs</span>
                          <span>·</span>
                          <span>{item.Duration}</span>
                        </Box>
                      ) : openTab.type === OpenType.Artist ? (
                        <Box display="flex" alignItems="center" mt={1}>
                          <span>{`43.752.138 Monthly listeners`}</span>
                        </Box>
                      ) : null}
                    </Box>
                  ) : openTab.type === OpenType.Library ||
                    openTab.type === OpenType.Liked ||
                    openTab.type === OpenType.Queue ? (
                    <span>{`${item.length ?? 0} songs`}</span>
                  ) : openTab.type === OpenType.Playlist ? (
                    <Text color={Color.White} bold>{item.count || 0} Songs</Text>
                  ) : null}
                </Box>
              </Box>
            ) : (
              <div
                className={classes.filter}
                style={{
                  backgroundColor:
                    openTab.type === OpenType.Album ||
                      openTab.type === OpenType.Playlist ||
                      openTab.type === OpenType.Artist
                      ? "rgba(0,0,0, 0.2)"
                      : "transparent",
                }}
              >
                {openTab.type === OpenType.Artist && (
                  <Box display="flex" flexDirection="row" alignItems="center" position="absolute" left={20} top={20} style={{ cursor: "pointer" }} onClick={goBack}>
                    <BackDesktopIcon />
                    <Text color={Color.White} ml={1}>Back</Text>
                  </Box>
                )}
                {openTab.type === OpenType.Album ? (
                  <div
                    className={classes.albumImage}
                    style={{
                      backgroundImage: item.album_image ? `url(${item.album_image})` : "none",
                      position: "relative",
                    }}
                  >
                    <Box display="flex" flexDirection="row" alignItems="center" position="absolute" left={20} top={20} style={{ cursor: "pointer" }} onClick={goBack}>
                      <BackDesktopIcon />
                      <Text color={Color.White} ml={1}>Back</Text>
                    </Box>
                  </div>
                ) : null}
                <Box display="flex" flexDirection="column" color="white">
                  {(openTab.type === OpenType.Album ||
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
                  <Box display="flex" alignItems="center" mb={8}>
                    <div className={classes.title}>
                      {openTab.type === OpenType.Album
                        ? item.album_name ?? "Album Title"
                        : openTab.type === OpenType.Playlist
                          ? item.Title ?? "Playlist Name"
                          : openTab.type === OpenType.Artist
                            ? item.artist_name ?? "Artist Name"
                            : openTab.type === OpenType.Liked
                              ? "Liked Content"
                              : openTab.type === OpenType.Library
                                ? "Library"
                                : openTab.type === OpenType.MyPlaylist
                                  ? "My Playlist"
                                  : "Queued"}
                    </div>
                    <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" borderRadius="100%" width={40} height={40} bgcolor="rgba(255, 255, 255, 0.3)" ml={2}>
                      <span style={{ marginLeft: 0, marginRight: 4 }}>3</span>
                      <img src={require("assets/icons/flash.png")} alt="flash" />
                    </Box>
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
                          <span>{item.Duration}</span>
                        </Box>
                      ) : openTab.type === OpenType.Artist ? (
                        <Box display="flex" alignItems="center" mt={1}>
                          <span>{`${item.followers ? item.followers.length : 0} followers`}</span>
                          <span>·</span>
                          <span>{`${item.totalReproductions} reproductions`}</span>
                        </Box>
                      ) : null}
                    </Box>
                  ) : openTab.type === OpenType.Library ||
                    openTab.type === OpenType.Liked ||
                    openTab.type === OpenType.Queue ? (
                    <span>{`${item.length ?? 0} songs`}</span>
                  ) : openTab.type === OpenType.Playlist ? (
                    <Text color={Color.White} bold>{item.count || 0} Songs</Text>
                  ) : null}
                </Box>
              </div>
            )}
            {openTab.type === OpenType.Playlist && (
              <EditPlaylistModal
                playlist={item}
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
