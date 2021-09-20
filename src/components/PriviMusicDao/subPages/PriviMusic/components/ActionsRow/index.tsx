import React, { useContext, useEffect, useRef, useState } from "react";
import { FacebookShareButton, TwitterShareButton /*, InstapaperShareButton */ } from "react-share";
import { Popper, ClickAwayListener, Grow, Paper, MenuList, MenuItem } from "@material-ui/core";
import axios from "axios";
import { useSelector } from "react-redux";

import { actionsRowStyles } from "./index.styles";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import MusicContext from "shared/contexts/MusicContext";
import { RootState, useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";
import {
  CopyAddressIcon,
  DownloadQRIcon,
  FaceBookShareIcon,
  // InstagramShareIcon,
  SongShareIcon,
  TwitterShareIcon,
  UploadIcon,
} from "components/PriviMusicDao/components/Icons/SvgIcons";
import ArtistRRSSModal from "../../modals/ArtistRRSSModal";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import URLTraxMicroservice from "shared/functions/getURLTraxMicroservice";
import Axios from "axios";

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

export default function ActionsRow({ item, setItem }) {
  const classes = actionsRowStyles();
  const user = useTypedSelector(state => state.user);

  const { openTab, selectedSong, setSelectedSong, setShowQRCodeDownload, setQRCodeValue, setCopyLink } =
    useContext(MusicContext);
  const { showAlertMessage } = useAlertMessage();

  const [playing, setPlaying] = useState<boolean>(false);

  const [fruitOpenMenu, setFruitOpenMenu] = useState<boolean>(false);
  const anchorFruitMenuRef = useRef<any>(null);

  const [shareOpenMenu, setShareOpenMenu] = useState<boolean>(false);
  const anchorShareMenuRef = useRef<any>(null);

  const userSelector = useSelector((state: RootState) => state.user);
  const [following, setFollowing] = useState<boolean>(
    !userSelector || !item.followers ? false : item.followers.includes(userSelector.id)
  );

  const [openModalRRSS, setOpenModalRRSS] = useState<boolean>(false);
  const handleOpenModalRRSS = () => {
    setOpenModalRRSS(true);
  };
  const handleCloseModalRRSS = () => {
    setOpenModalRRSS(false);
  };

  useEffect(() => {
    setFollowing(!userSelector || !item.followers ? false : item.followers.includes(userSelector.id));
  }, [item]);

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

  const handleFollow = e => {
    e.stopPropagation();
    e.preventDefault();
    axios
      .post(`${URL()}/claimableSongs/followArtist`, {
        artist_name: item.artist_name,
        user_id: userSelector?.id,
      })
      .then(response => {
        if (response.data.success) {
          setFollowing(!following);
        } else {
          console.log(response.data.message);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const handlePlay = () => {
    if (!item.songs?.length) {
      return;
    }

    if (!playing) {
      if (item.songs && item.songs[0] && item.songs[0].url) {
        setSelectedSong({ ...item.songs[0], playing: true, Imageurl: item.Imageurl });
      } else if (item[0] && item[0].url) {
        setSelectedSong({ ...item[0], playing: true });
      }
      setPlaying(true);
    } else {
      if (item.songs && item.songs[0] && item.songs[0].url) {
        setSelectedSong({ ...item.songs[0], playing: false, Imageurl: item.Imageurl });
      } else if (item[0] && item[0].url) {
        setSelectedSong({ ...item[0], playing: false });
      }
      setPlaying(false);
    }
  };

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
  };

  const handleTrackingShare = () => {
    let urlType : string = "";
    let body : any = {};

    if(openTab && openTab.type === OpenType.Album) {
      urlType = "albums";
      body = { albumId: item.album_name || "" }
    } else if(openTab && openTab.type === OpenType.Artist) {
      urlType = "artists";
      body = { artistId: item.artist_name || "" }
    } else if(openTab && (openTab.type === OpenType.Playlist || openTab.type === OpenType.MyPlaylist)) {
      urlType = "playlists";
      body = { playlistId: item.id || "" }
    }

    Axios.post(`${URLTraxMicroservice()}/${urlType}/trackingShared`, body)
      .catch(error => {
        console.log(error);
    })
  }

  const getShareUrl = React.useMemo(() => {
    if (openTab)
      return `https://www.privi.store/#/trax/music/${
        openTab.type === OpenType.Album ? "album" : openTab.type === OpenType.Artist ? "artist" : "playlist"
      }/${
        openTab.type === OpenType.Album
          ? item.album_name
          : openTab.type === OpenType.Artist
          ? item.artist_name
          : item.Title
      }`;
    else {
      return "";
    }
  }, [item, openTab]);

  useEffect(() => {
    if (selectedSong) {
      let playingSong;

      if (item.songs) {
        playingSong = item.songs.find(s => s.url && selectedSong.url === s.url);
      } else if (item.length > 0) {
        playingSong = item.find(s => s.url && selectedSong.url === s.url);
      }

      if (
        playingSong &&
        selectedSong &&
        selectedSong.url &&
        playingSong.url &&
        selectedSong.url === playingSong.url
      ) {
        if (selectedSong.playing) {
          setPlaying(true);
        } else {
          setPlaying(false);
        }
      }
    }
  }, [selectedSong]);

  const handleFruit = type => {
    const body = {
      userId: user.id,
      podAddress:
        openTab!.type === OpenType.Album
          ? item.album_name
          : openTab!.type === OpenType.Playlist
          ? item.id
          : item.artist_name,
      fruitId: type,
    };
    axios
      .post(
        `${URLTraxMicroservice()}/${
          openTab!.type === OpenType.Album
            ? "albums"
            : openTab!.type === OpenType.Playlist
            ? "playlists"
            : "artists"
        }/fruit`,
        body
      )
      .then(res => {
        if (res.data?.success) {
          const itemCopy = { ...item };
          itemCopy.fruits = [
            ...(itemCopy.fruits || []),
            { userId: user.id, fruitId: type, date: new Date().getTime() },
          ];
          setItem(itemCopy);
        }
      });
  };

  if (openTab)
    return (
      <div className={classes.actions}>
        {openTab.type !== OpenType.Queue ? (
          <Box display="flex" alignItems="center">
            <button className={classes.play} onClick={handlePlay}>
              <img
                src={require(`assets/icons/${playing ? "pause_white" : "play_white_filled"}.png`)}
                alt="play"
                style={{ marginLeft: playing ? 0 : undefined }}
              />
            </button>
            {(openTab.type === OpenType.Album ||
              openTab.type === OpenType.Playlist ||
              openTab.type === OpenType.Artist) && (
              <>
                <button
                  className={classes.likeIcon}
                  ref={anchorFruitMenuRef}
                  onClick={() => setFruitOpenMenu(true)}
                >
                  <img src={require("assets/musicDAOImages/trending.png")} alt="trending" />
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
                      <Paper className={classes.paper}>
                        <ClickAwayListener onClickAway={handleFruitCloseMenu}>
                          <MenuList
                            autoFocusItem={fruitOpenMenu}
                            id="fruit-menu-list-grow"
                            onKeyDown={handleListKeyDownFruitMenu}
                          >
                            <MenuItem onClick={() => handleFruit(1)}>
                              🍉 {item.fruits?.filter(fruit => fruit.fruitId === 1)?.length || 0}
                            </MenuItem>
                            <MenuItem onClick={() => handleFruit(2)}>
                              🥑 {item.fruits?.filter(fruit => fruit.fruitId === 2)?.length || 0}
                            </MenuItem>
                            <MenuItem onClick={() => handleFruit(3)}>
                              🍊 {item.fruits?.filter(fruit => fruit.fruitId === 3)?.length || 0}
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </>
            )}
            {(openTab.type === OpenType.Album ||
              openTab.type === OpenType.Artist ||
              openTab.type === OpenType.Playlist) && (
              <>
                <button
                  className={classes.likeIcon}
                  ref={anchorShareMenuRef}
                  onClick={() => setShareOpenMenu(true)}
                >
                  <UploadIcon width="30" height="30" />
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
                                Copy {openTab.type === OpenType.Album ? "album" : openTab.type === OpenType.Artist ? "artist" : "playlist"} link
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
                </>
              )}
            {openTab.type === OpenType.Artist && (
              <>
                {following ? (
                  <SecondaryButton size="medium" onClick={handleFollow}>
                    Unfollow
                  </SecondaryButton>
                ) : (
                  <PrimaryButton size="medium" onClick={handleFollow}>
                    Follow
                  </PrimaryButton>
                )}
              </>
            )}
            {openTab.type === OpenType.Artist && (
              <PrimaryButton size="medium" onClick={handleOpenModalRRSS}>
                Manage RRSS
              </PrimaryButton>
            )}
          </Box>
        ) : (
          <div />
        )}
        {/* <RightItemsActions hours={5} /> */}
        {openModalRRSS && (
          <ArtistRRSSModal
            open={openModalRRSS}
            handleClose={handleCloseModalRRSS}
            artist={item}
            setArtist={art => setItem(art)}
          />
        )}
      </div>
    );
  else return null;
}

export const RightItemsActions = ({ hours }) => {
  return (
    <Box display="flex" alignItems="center" color="#181818" fontSize="14px">
      <img src={require("assets/icons/flash.png")} alt="flash" />
      <b>Privi Free Zone</b>
      {hours} hours left
      <PrimaryButton size="medium" onClick={() => {}}>
        Add Funds
      </PrimaryButton>
    </Box>
  );
};
