import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@material-ui/core";

import { priviMusicStyles } from "./index.styles";
import Player from "./components/Player";
import Sidebar from "./components/Sidebar";
import MusicContext from "shared/contexts/MusicContext";
import AlbumPage from "./subpages/AlbumPage";
import ArtistPage from "./subpages/ArtistPage";
import HomePage from "./subpages/HomePage";
import LibraryPage from "./subpages/LibraryPage";
import LikedPage from "./subpages/LikedPage";
import PlaylistPage from "./subpages/PlaylistPage";
import MyPlaylistPage from "./subpages/MyPlaylistPage";
import QueuePage from "./subpages/QueuePage";
import SearchPage from "./subpages/SearchPage";
import FruitPage from "./subpages/Fruit";
import Box from "shared/ui-kit/Box";
import PriviFreeZone from "./components/PriviFreeZone";
import GenreListPage from "./subpages/GenreListPage";
import GenrePage from "./subpages/GenrePage";
import RecentSearchesPage from "./subpages/RecentSearchesPage";
import ExploreAllPage from "./subpages/ExploreAllPage";
import { ShareWithQRCode } from "shared/ui-kit/Modal/Modals/ShareWithQRCode";

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
  Fruit = "FRUIT",
  GenreList = "GENRELIST",
  Genre = "GENRE",
  RecentSearches = "RECENTSEARCHES",
  ExploreAll = "EXPLOREALL",
}

export default function PriviMusic() {
  const classes = priviMusicStyles();

  const [openTab, setOpenTab] = useState<any>({ type: OpenType.Home, id: undefined, index: 0 });
  const [selectedSong, setSelectedSong] = useState<any>(null);
  const [songsList, setSongsList] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([{ type: OpenType.Home, id: undefined, index: 0 }]);

  const mobileMatch = useMediaQuery("(max-width:750px)");
  const [freeMusicTime, setFreeMusicTime] = useState<number>(14400);

  const [openQrCodeModal, setOpenQrCodeModal] = useState<boolean>(false);
  const [qrCodeValue, setQRCodeValue] = useState<string>('');

  useEffect(() => {
    const link = window.location.href.split("/") || null;

    console.log(link, link[5], link[6], link[7]);
    if (link && link.length > 0 && link[5] === "music") {
      if (link[6] && link[6] === "genre" && link[7] && link[7] !== "") {
        setOpenTab({ type: OpenType.Genre, id: link[7], index: 0 });
        setHistory([...history, { type: OpenType.Genre, id: link[7], index: 0 }]);
      } else if (link[6] && link[6] === "playlist" && link[7] && link[7] !== "") {
        setOpenTab({ type: OpenType.Playlist, id: link[7], index: 0 });
        setHistory([...history, { type: OpenType.Playlist, id: link[7], index: 0 }]);
      } else if (link[6] && link[6] === "album" && link[7] && link[7] !== "") {
        setOpenTab({ type: OpenType.Album, id: link[7], index: 0 });
        setHistory([...history, { type: OpenType.Playlist, id: link[7], index: 0 }]);
      } else if (link[6] && link[6] === "artist" && link[7] && link[7] !== "") {
        setOpenTab({ type: OpenType.Artist, id: link[7], index: 0 });
        setHistory([...history, { type: OpenType.Playlist, id: link[7], index: 0 }]);
      } else if (link[6] && link[6] === "search" && link[7] && link[7] === "genres") {
        setOpenTab({ type: OpenType.GenreList, id: undefined, index: 0 });
        setHistory([...history, { type: OpenType.GenreList, id: undefined, index: 0 }]);
      } else if (link[6] && link[6] === "search" && link[7] && link[7] === "recent-searches") {
        setOpenTab({ type: OpenType.RecentSearches, id: undefined, index: 0 });
        setHistory([...history, { type: OpenType.RecentSearches, id: undefined, index: 0 }]);
      }
    }
  }, []);

  const goBack = () => {
    let currentIndex = history.findIndex(h => h.index === openTab.index);
    if (currentIndex !== -1) {
      setOpenTab(history[currentIndex - 1]);
    }
  };

  const goNext = () => {
    let currentIndex = history.findIndex(h => h.index === openTab.index);
    if (currentIndex !== -1) {
      setOpenTab(history[currentIndex + 1]);
    }
  };

  const handleCopyAddress = (link: string) => {
    navigator.clipboard.writeText(link);
  }

  return (
    <MusicContext.Provider
      value={{
        openTab: openTab,
        setOpenTab: setOpenTab,
        selectedSong: selectedSong,
        setSelectedSong: setSelectedSong,
        songsList: songsList,
        setSongsList: setSongsList,
        history: history,
        setHistory: setHistory,
        goBack: goBack,
        goNext: goNext,
        setShowQRCodeDownload: setOpenQrCodeModal,
        showQRCodeDownload: openQrCodeModal,
        setQRCodeValue: setQRCodeValue,
        qrCodeValue: qrCodeValue,
        setCopyLink: handleCopyAddress,
      }}
    >
      <Box display="flex" flexDirection="column" height="100%">
        <Box flex={1} overflow="auto" className={classes.contentContainer}>
          <Sidebar seconds={freeMusicTime} />
          <div className={classes.mainContainer}>
            {/* <div className={classes.arrows}>
              <button
                onClick={() => {
                  let currentIndex = history.findIndex(h => h.index === openTab.index);
                  if (currentIndex !== -1) {
                    setOpenTab(history[currentIndex - 1]);
                  }
                }}
                disabled={history.length === 0 || history.findIndex(h => h.index === openTab.index) - 1 < 0}
              >
                <img src={require(`assets/icons/arrow.png`)} />
              </button>

              <button
                onClick={() => {
                  let currentIndex = history.findIndex(h => h.index === openTab.index);
                  if (currentIndex !== -1) {
                    setOpenTab(history[currentIndex + 1]);
                  }
                }}
                disabled={
                  history.length === 0 ||
                  history.findIndex(h => h.index === openTab.index) + 1 >= history.length
                }
              >
                <img src={require(`assets/icons/arrow.png`)} />
              </button>
            </div> */}
            <div className={classes.content}>
              {openTab && openTab.type && openTab.type === OpenType.Home ? (
                <HomePage />
              ) : openTab && openTab.type ? (
                openTab.type === OpenType.Album ? (
                  <AlbumPage />
                ) : openTab.type === OpenType.Artist ? (
                  <ArtistPage />
                ) : openTab.type === OpenType.Library ? (
                  <LibraryPage />
                ) : openTab.type === OpenType.Search ? (
                  <SearchPage />
                ) : openTab.type === OpenType.Liked ? (
                  <LikedPage />
                ) : openTab.type === OpenType.Playlist ? (
                  <PlaylistPage />
                ) : openTab.type === OpenType.MyPlaylist ? (
                  <MyPlaylistPage />
                ) : openTab.type === OpenType.Fruit ? (
                  <FruitPage />
                ) : openTab.type === OpenType.GenreList ? (
                  <GenreListPage />
                ) : openTab.type === OpenType.Genre ? (
                  <GenrePage />
                ) : openTab.type === OpenType.RecentSearches ? (
                  <RecentSearchesPage />
                ) : openTab.type === OpenType.ExploreAll ? (
                  <ExploreAllPage />
                ) : (
                  <QueuePage />
                )
              ) : null}
            </div>
          </div>
        </Box>
        {mobileMatch && <PriviFreeZone seconds={freeMusicTime} isMobile={true} />}
        <Player seconds={freeMusicTime} setSeconds={scnds => setFreeMusicTime(scnds)} />
        <ShareWithQRCode
          isOpen={openQrCodeModal}
          onClose={() => setOpenQrCodeModal(false)}
          shareLink={qrCodeValue}
        />
      </Box>
    </MusicContext.Provider>
  );
}
