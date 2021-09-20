import React, { useContext, useEffect, useRef, useState } from "react";
import { FacebookShareButton, TwitterShareButton /*, InstapaperShareButton */ } from "react-share";
import axios from "axios";
import cls from "classnames";
import { useSelector } from "react-redux";

import { RootState } from "store/reducers/Reducer";

import {
  ClickAwayListener,
  createStyles,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  TableCell,
  TableRow,
  useMediaQuery,
  withStyles,
} from "@material-ui/core";

import { songRowStyles } from "./index.styles";
import MusicContext from "shared/contexts/MusicContext";
import { queueMock, albumsMock, playlistMock } from "../../mockData";
import Box from "shared/ui-kit/Box";
import {
  AddPlayListIcon,
  AddQueueIcon,
  AlbumIcon,
  ArtistIcon,
  RemovePlayListIcon,
  CopyAddressIcon,
  DownloadQRIcon,
  FaceBookShareIcon,
  // InstagramShareIcon,
  SongShareIcon,
  TwitterShareIcon,
  UploadIcon,
} from "components/PriviMusicDao/components/Icons/SvgIcons";
import { actionsRowStyles } from "../ActionsRow/index.styles";
import URLTraxMicroservice from "shared/functions/getURLTraxMicroservice";
import Axios from "axios";
import AlertMessage from "../../../../../../shared/ui-kit/Alert/AlertMessage";

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

export default function SongRow({ row, simplified, page, playlist = null, refreshPlaylist = () => {} }) {
  const userSelector = useSelector((state: RootState) => state.user);
  const classes = songRowStyles();
  const actionRowClasses = actionsRowStyles();
  const [song, setSong] = useState<any>(row);
  const [status, setStatus] = useState<any>("");

  const {
    setSelectedSong,
    selectedSong,
    openTab,
    setOpenTab,
    setSongsList,
    songsList,
    history,
    setHistory,
    setQRCodeValue,
    setShowQRCodeDownload,
    setCopyLink,
  } = useContext(MusicContext);

  const mobileMatch = useMediaQuery("(max-width:600px)");
  const tabletMatch = useMediaQuery("(max-width:980px)");

  const [duration, setDuration] = useState<string>("");
  const [playing, setPlaying] = useState<boolean>(false);

  const [fruitOpenMenu, setFruitOpenMenu] = useState<boolean>(false);
  const anchorFruitMenuRef = useRef<HTMLButtonElement>(null);

  const [shareOpenMenu, setShareOpenMenu] = useState<boolean>(false);
  const anchorShareMenuRef = useRef<HTMLButtonElement>(null);

  const [openSettingMenu, setOpenSettingMenu] = useState(false);
  const anchorSettingMenuRef = useRef<HTMLButtonElement>(null);

  const handleFruit = type => {
    const body = {
      userId: userSelector.id,
      podAddress: song.song_name,
      fruitId: type,
    };
    axios.post(`${URLTraxMicroservice()}/songs/fruit`, body).then(res => {
      if (res.data?.success) {
        const itemCopy = { ...song };
        itemCopy.fruits = [
          ...(itemCopy.fruits || []),
          { userId: userSelector.id, fruitId: type, date: new Date().getTime() },
        ];
        setSong(itemCopy);
      }
    });
  };

  const handleFruitCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorFruitMenuRef.current && anchorFruitMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setFruitOpenMenu(false);
  };

  const handleListKeyDownFruitMenu = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setFruitOpenMenu(false);
    }
  };

  const handleShareCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setShareOpenMenu(false);
  };

  const handleListKeyDownShareMenu = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setShareOpenMenu(false);
    }
  };

  const handleCloseSettingMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorSettingMenuRef.current && anchorSettingMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenSettingMenu(false);
  };

  function handleListKeyDownSettingMenu(e: React.KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      setOpenSettingMenu(false);
    }
  }

  useEffect(() => {
    if (song.duration) {
      let hrs = Math.floor(song.duration / 3600);
      let min = Math.floor((song.duration % 3600) / 60);
      let sec = Math.floor(song.duration % 60);
      let strDur = "";
      if (hrs) {
        if (hrs < 10) strDur += "0";
        strDur += hrs.toString();
        strDur += ":";
      }
      if (min < 10) strDur += "0";
      strDur += min.toString();
      strDur += ":";
      if (sec < 10) strDur += "0";
      strDur += sec.toString();
      setDuration(strDur);
    }

    /*const fetchAlbumData = async () => {
      try {
        const response = await axios.get(`${URL()}/claimableSongs/getAlbumDetail?albumId=${song.album_name}`);
        if (response.data.success) {
          let albumData = response.data.data;
          setAlbum(albumData);
        } else {
          console.log(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAlbumData();*/
  }, [song]);

  useEffect(() => {
    if (selectedSong && selectedSong.url && song.url) {
      if (selectedSong.url !== song.url) {
        setPlaying(false);
      } else {
        if (selectedSong.playing) {
          setPlaying(true);
        } else {
          setPlaying(false);
        }
      }
    }
  }, [selectedSong]);

  const handleSelectSong = () => {
    //find list where this song is stored
    //TODO: find album and load songs
    let album = albumsMock.find(a => openTab && a.id === openTab.id);
    if (openTab && openTab.type === OpenType.Liked) {
      //TODO: load liked songs
      setSongsList(queueMock);
    } else if (openTab && openTab.type === OpenType.Queue) {
      //TODO: load songs in queue
      if (!playing) {
        setSongsList(songsList.filter(item => item.song_name !== song.song_name));
      }
    } else if (openTab && openTab.type === OpenType.Album) {
      if (album) {
        setSongsList(album.songs);
      }
    } else if (openTab && openTab.type === OpenType.Playlist) {
      //TODO: find album and load songs
      let playlist = playlistMock.find(p => p.id === openTab.id);
      if (playlist) setSongsList(playlist.Songs);
    }

    console.log("playlist", playlist)
    //set song
    if (!playing) {
      setSelectedSong({ ...song, ImageUrl: album?.ImageUrl ?? "", playing: true, playlist: playlist });
      setPlaying(true);
    } else {
      setSelectedSong({ ...song, ImageUrl: album?.ImageUrl ?? "", playing: false, playlist: playlist });
      setPlaying(false);
    }
  };

  const onAddToQueue = () => {
    if (!song) {
      return;
    }
    setSongsList([song, ...songsList]);
    setOpenTab({ type: OpenType.Queue, id: song.id, index: history.length });
    setHistory([...history, { type: OpenType.Queue, id: song.id, index: history.length }]);
  };

  const onGoToArtist = () => {
    if (!song) {
      return;
    }

    setOpenTab({
      type: OpenType.Artist,
      id: song.artists && song.artists[0] ? song.artists[0].name : song.artist_name,
      index: history.length,
    });
    setHistory([...history, { type: OpenType.Artist, id: song.artist_name, index: history.length }]);
  };

  const onGoToAlbum = () => {
    if (!song) {
      return;
    }
    setOpenTab({ type: OpenType.Album, id: song.album_name, index: history.length });
    setHistory([...history, { type: OpenType.Album, id: song.album_name, index: history.length }]);
  };

  const removeFromThisPlaylist = (playlist: any) => {
    axios
      .post(`${URLTraxMicroservice()}/playlists/removeSongsFromPlaylist`, {
        id: playlist,
        songs: [song.song_name],
      })
      .then(response => {
        if (response.data.success) {
          setStatus({
            msg: "Song removed from Playlist",
            key: Math.random(),
            variant: "success",
          });
          refreshPlaylist();
        } else {
          setStatus({
            msg: "Error removing song from Playlist",
            key: Math.random(),
            variant: "error",
          });
        }
      })
      .catch(error => {
        console.log(error);
        setStatus({
          msg: "Error removing song from Playlist",
          key: Math.random(),
          variant: "error",
        });
      });
  };

  const getShareUrl = React.useMemo(() => {
    return `https://www.privi.store/#/trax/music/album/${song.album_name}/${song.song_name}`;
  }, [song]);

  const handleDownloadQRShow = () => {
    setShareOpenMenu(false);
    setQRCodeValue(getShareUrl);
    setShowQRCodeDownload(true);
    handleTrackingShare();
  };

  const handleCopyLink = () => {
    setShareOpenMenu(false);
    setCopyLink(getShareUrl);
    handleTrackingShare();
  }

  const handleTrackingShare = () => {
    Axios.post(`${URLTraxMicroservice()}/songs/trackingShared`, {
      songId: song.song_name || song.MediaName || ""
    }).catch(error => {
      console.log(error);
    })
  }

  return (
    <StyledTableRow className={cls({ selected: selectedSong && song.id === selectedSong.id }, classes.row)}>
      <StyledTableCell align="left">
        <Box display="flex" flexDirection="row" alignItems="center">
          <button
            onClick={handleSelectSong}
            className={classes.buttonPlaySong}
            style={
              tabletMatch
                ? {
                  marginRight: 15,
                }
                : {}
            }
          >
            <img
              src={require(`assets/icons/${playing ? "pause_dark" : "play_dark_filled"}.png`)}
              alt="play"
            />
          </button>
          <div
            className={classes.songImage}
            style={
              tabletMatch
                ? {
                  backgroundImage: song.album_image ? `url(${song.album_image})` : "none",
                  width: 36,
                  height: 36,
                  minWidth: 36,
                  minHeight: 36,
                  marginRight: 15,
                }
                : {
                  backgroundImage: song.album_image ? `url(${song.album_image})` : "none",
                }
            }
          />
          <Box display="flex" flexDirection="column" color="#181818">
            <Box className={classes.songNameLabel} fontSize={mobileMatch ? 14 : tabletMatch ? 16 : 18}>
              {song.song_name ?? "Song Name"}
            </Box>
            <Box className={classes.artistNameLabel} fontSize={mobileMatch ? 10 : tabletMatch ? 12 : 14}>
              {song.artist_name ?? "Artist"}
            </Box>
          </Box>
        </Box>
      </StyledTableCell>
      {!mobileMatch && (
        <>
          <StyledTableCell
            align="center"
            style={
              mobileMatch
                ? {
                  fontSize: 14,
                }
                : tabletMatch
                  ? {
                    fontSize: 16,
                    padding: 8,
                    height: 55,
                  }
                  : {
                    fontSize: 18,
                  }
            }
            className={classes.albumNameLabel}
          >
            {song.album_name}
          </StyledTableCell>

          {!simplified && page !== "search" && (
            <StyledTableCell
              align="center"
              style={
                mobileMatch
                  ? {
                    fontSize: 14,
                  }
                  : tabletMatch
                    ? {
                      fontSize: 16,
                      padding: 8,
                    }
                    : {
                      fontSize: 18,
                    }
              }
            >
              {song.totalReproductions
                ? `${song.totalReproductions > 1000000
                  ? (song.totalReproductions / 1000000).toFixed(1)
                  : song.totalReproductions > 1000
                    ? (song.totalReproductions / 1000).toFixed(1)
                    : song.totalReproductions
                } ${song.totalReproductions > 1000000 ? "M" : song.totalReproductions > 1000 ? "K" : ""}`
                : "0"}
            </StyledTableCell>
          )}
          <StyledTableCell
            align="center"
            style={
              mobileMatch
                ? {
                  fontSize: 14,
                }
                : tabletMatch
                  ? {
                    fontSize: 16,
                    padding: 8,
                  }
                  : {
                    fontSize: 18,
                  }
            }
          >
            {duration}
          </StyledTableCell>
        </>
      )}
      {!simplified && (
        <StyledTableCell align="right" style={{ width: "100px" }}>
          <Box display="flex" flexDirection="row" alignItems="center">
            <button
              className={actionRowClasses.likeIcon}
              ref={anchorShareMenuRef}
              onClick={() => setShareOpenMenu(true)}
            >
              <UploadIcon width={tabletMatch ? "20" : "25"} height={tabletMatch ? "20" : "25"} />
            </button>
            <Popper
              open={shareOpenMenu}
              anchorEl={anchorShareMenuRef.current}
              transition
              disablePortal={false}
              placement="bottom"
              style={{ position: "inherit" }}
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps}>
                  <Paper className={classes.paper}>
                    <ClickAwayListener onClickAway={handleShareCloseMenu}>
                      <MenuList
                        autoFocusItem={shareOpenMenu}
                        id="share-menu-list-grow"
                        onKeyDown={handleListKeyDownShareMenu}
                      >
                        <MenuItem onClick={() => handleTrackingShare()}>
                          <TwitterShareButton url={getShareUrl} className={classes.shareButton}>
                            <TwitterShareIcon />
                            <span>Share on Twitter</span>
                          </TwitterShareButton>
                        </MenuItem>
                        <MenuItem onClick={() => handleTrackingShare()}>
                          <FacebookShareButton url={getShareUrl} className={classes.shareButton}>
                            <FaceBookShareIcon />
                            <span>Share on Facebook</span>
                          </FacebookShareButton>
                        </MenuItem>
                        {/* <MenuItem>
                          <InstapaperShareButton url={getShareUrl} className={classes.shareButton}>
                            <InstagramShareIcon />
                            <span> Share on Instagram</span>
                          </InstapaperShareButton>
                        </MenuItem> */}
                        <MenuItem onClick={handleCopyLink}>
                          <SongShareIcon />
                          Copy song link
                        </MenuItem>
                        <MenuItem onClick={handleDownloadQRShow}>
                          <DownloadQRIcon />
                          Download QR code
                        </MenuItem>
                        <MenuItem>
                          <CopyAddressIcon />
                          Copy address
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            <button
              className={actionRowClasses.likeIcon}
              ref={anchorFruitMenuRef}
              onClick={() => setFruitOpenMenu(true)}
            >
              <img
                src={require(`assets/musicDAOImages/trending.png`)}
                style={{ width: 30, height: 30 }}
                alt="like"
              />
            </button>
            <Popper
              open={fruitOpenMenu}
              anchorEl={anchorFruitMenuRef.current}
              transition
              disablePortal={false}
              placement="bottom"
              style={{ position: "inherit" }}
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps}>
                  <Paper className={classes.paper1}>
                    <ClickAwayListener onClickAway={handleFruitCloseMenu}>
                      <MenuList
                        autoFocusItem={fruitOpenMenu}
                        id="fruit-menu-list-grow"
                        onKeyDown={handleListKeyDownFruitMenu}
                      >
                        <MenuItem onClick={() => handleFruit(1)}>🍉 {song.fruits?.filter(fruit => fruit.fruitId === 1)?.length || 0}</MenuItem>
                        <MenuItem onClick={() => handleFruit(2)}>🥑 {song.fruits?.filter(fruit => fruit.fruitId === 2)?.length || 0}</MenuItem>
                        <MenuItem onClick={() => handleFruit(3)}>🍊 {song.fruits?.filter(fruit => fruit.fruitId === 3)?.length || 0}</MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
            <button ref={anchorSettingMenuRef} onClick={() => setOpenSettingMenu(true)}>
              <img src={require("assets/icons/menu_dots.png")} alt="open menu" />
            </button>
            <Popper
              open={openSettingMenu}
              anchorEl={anchorSettingMenuRef.current}
              transition
              disablePortal={false}
              placement="bottom"
              style={{ position: "inherit" }}
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps}>
                  <Paper className={classes.paper}>
                    <ClickAwayListener onClickAway={handleCloseSettingMenu}>
                      <MenuList
                        autoFocusItem={openSettingMenu}
                        id="setting-menu-list-grow"
                        onKeyDown={handleListKeyDownSettingMenu}
                      >
                        <MenuItem onClick={onAddToQueue}>
                          <AddQueueIcon />
                          Add to play queue
                        </MenuItem>
                        {
                          page !== "artist" ?
                            <MenuItem onClick={onGoToArtist}>
                              <ArtistIcon />
                              Go to Artist
                            </MenuItem> : null
                        }
                        {
                          page !== "album" ?
                            <MenuItem onClick={onGoToAlbum}>
                              <AlbumIcon />
                              Go to Album
                            </MenuItem> : null
                        }
                        {
                          page === "playlist" ?
                            <MenuItem onClick={() => removeFromThisPlaylist(playlist)}>
                              <RemovePlayListIcon />
                              Remove from this Playlist
                            </MenuItem> : null
                        }

                        <MenuItem>
                          <AddPlayListIcon />
                          Add to Playlist
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Box>
        </StyledTableCell>
      )}
      {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}

    </StyledTableRow>
  );
}

const StyledTableCell = withStyles(() =>
  createStyles({
    root: {
      borderBottom: "none",
      fontFamily: "Agrandir",
      fontSize: "18px",
      color: "#181818",
      margin: "16px 0px",
      "&.selected": {
        background: "#f7f9fe",
      },
    },
  })
)(TableCell);

const StyledTableRow = withStyles(() =>
  createStyles({
    root: {
      borderBottom: "none",
      padding: "0px 16px",
      fontFamily: "Agrandir",
      "&.selected": {
        background: "#f7f9fe",
      },
    },
  })
)(TableRow);
