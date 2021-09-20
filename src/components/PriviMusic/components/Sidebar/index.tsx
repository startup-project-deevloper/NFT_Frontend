import React, { useContext, useState } from "react";
import styles from "shared/ui-kit/PriviAppSidebar/index.module.css";
import MusicContext from "shared/contexts/MusicContext";
import AppSidebar from "shared/ui-kit/PriviAppSidebar";
import PriviFreeZone from "../PriviFreeZone";

const TABS = {
  Home: "Home",
  MyPlaylist: "Playlist",
  MyFruits: "My Fruits",
  Search: "Search",
};

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

export default function Sidebar(props: any) {
  return <AppSidebar child={<SidebarContent seconds={props.seconds || 0} />} theme="music" />;
}

const SidebarContent = (props: any) => {
  const { openTab, setOpenTab, history, setHistory } = useContext(MusicContext);

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
              }}
            >
              {TABS[key]}
            </li>
          ))}
        </ul>
        <ul>
          <li
            onClick={() => {
              setOpenTab({
                type: OpenType.CreatePlaylist,
                id: undefined,
                index: history.length,
              });
              setHistory([
                ...history,
                {
                  type: OpenType.CreatePlaylist,
                  id: undefined,
                  index: history.length,
                },
              ]);
            }}
          >
            <img src={require("assets/icons/create_playlist.png")} alt="create playlist" />
            Create Playlist
          </li>
          <li onClick={() => {}}>
            <img src={require("assets/icons/add_dark.png")} alt="create playlist" />
            Create Content
          </li>
        </ul>
      </div>
      <PriviFreeZone seconds={props.seconds} />
    </div>
  );
};
