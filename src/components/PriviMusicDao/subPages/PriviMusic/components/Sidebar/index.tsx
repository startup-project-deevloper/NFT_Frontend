import React, {useContext, useEffect, useState} from "react";
import styles from "shared/ui-kit/PriviAppSidebar/index.module.css";
import MusicContext from "shared/contexts/MusicContext";
import AppSidebar from "shared/ui-kit/PriviAppSidebar";
import CreatePlaylistModal from "../../modals/CreatePlaylistModal";
import PriviFreeZone from "../PriviFreeZone";
import {useHistory} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store/reducers/Reducer";

const TABS = {
  Home: "Home",
  MyPlaylist: "Playlist",
  Fruit: "My Fruits",
  Search: "Search",
};

const URL = {
  Home: "home",
  MyPlaylist: "playlists",
  Fruit: "my-fruits",
  Search: "search",
};

enum OpenType {
  Home = "HOME",
  Playlist = "PLAYLIST",
  Fruit = "FRUIT",
  MyPlaylist = "MYPLAYLIST",
  Album = "ALBUM",
  Artist = "ARTIST",
  Liked = "LIKED",
  Library = "LIBRARY",
  Search = "SEARCH",
  Queue = "QUEUE",
}

export default function Sidebar(props: any) {
  return <AppSidebar child={<SidebarContent seconds={props.seconds || 0} />} theme="dao-music" />;
}

const SidebarContent = (props: any) => {
  const { openTab, setOpenTab, history, setHistory } = useContext(MusicContext);
  const historyUse = useHistory();
  const userSelector = useSelector((state: RootState) => state.user);

  const [openCreatePlaylistModal, setOpenCreatePlaylistModal] = useState<boolean>(false);

  const handleOpenCreatePlaylistModal = () => {
    setOpenCreatePlaylistModal(true);
  };
  const handleCloseCreatePlaylistModal = () => {
    setOpenCreatePlaylistModal(false);
  };

  useEffect(() => {
    const link = window.location.href.split("/")[6] || null;

    if(link && link !== '') {
      let key : string = capitalize(link);
      console.log('url', key);

      if(key === "Playlists") {
        key = "MyPlaylist"
      } else if(key === "My-fruits") {
        key = "Fruit"
      } else if(key === "Queued") {
        key = "Queue"
      }

      setOpenTab({
        type: OpenType[key],
        id: userSelector.id || '',
        index: history.length,
      });
      setHistory([
        ...history,
        {
          type: OpenType[key],
          id: userSelector.id,
          index: history.length,
        },
      ]);
    }
    console.log('url', link);
  }, []);

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className={styles.content}>
      <div className={styles.options}>
        <ul>
          {Object.keys(TABS).map((key, index) => (
            <li
              key={`option-${index}`}
              className={
                (index === 0 && openTab === null) || (openTab && OpenType[key] === openTab.type)
                  ? styles.selected
                  : undefined
              }
              onClick={() => {
                setOpenTab({
                  type: OpenType[key],
                  id: undefined,
                  index: history.length,
                });
                setHistory([
                  ...history,
                  {
                    type: OpenType[key],
                    id: undefined,
                    index: history.length,
                  },
                ]);
                historyUse.push(`/trax/music/${URL[key]}`)
              }}
            >
              {TABS[key]}
            </li>
          ))}
        </ul>
        <ul>
          <li onClick={handleOpenCreatePlaylistModal}>
            <img src={require("assets/icons/create_playlist.png")} alt="create playlist" />
            Create Playlist
          </li>
        </ul>
      </div>
      <PriviFreeZone seconds={props.seconds} />
      <CreatePlaylistModal open={openCreatePlaylistModal} handleClose={handleCloseCreatePlaylistModal} />
    </div>
  );
};
