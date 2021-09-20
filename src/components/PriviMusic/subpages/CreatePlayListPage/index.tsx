import React, { useContext, useEffect, useState } from "react";

import { Table, useTheme } from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import Box from "shared/ui-kit/Box";
import { priviMusicSubPageStyles } from "../index.styles";
import { ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper } from "@material-ui/core";
import SongsRowHeader from "../../components/SongsRowHeader";
import SongRow from "../../components/SongRow";
import SubpageHeader from "../../components/SubpageHeader";
import axios from "axios";
import URL from "shared/functions/getURL";
import CreatePlaylistModal from "components/PriviMusic/modals/CreatePlaylistModal";
import { createPlayListPageStyles } from "./index.styles";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
import { useDebouncedCallback } from "use-debounce/lib";
import { ReactComponent as CloseIcon } from "assets/icons/close.svg";
import {
  AddPlayListIcon,
  EditIcon,
  HorizontalMenuIcon,
  RemovePlayListIcon,
  ShareIcon,
} from "../../components/Icons/SvgIcons";

export default function CreatePlayListPage() {
  const classes = priviMusicSubPageStyles();
  const customClasses = createPlayListPageStyles();

  const theme = useTheme();
  const simplified = useMediaQuery(theme.breakpoints.down("sm"));

  const [color, setColor] = useState<string>("#cccccc");
  const [openCreatePlaylistModal, setOpenCreatePlaylistModal] = useState<boolean>(false);
  const [playlist, setPlaylist] = useState<any>({ Title: "Playlist Name", Description: "", Songs: [] });
  const [isRecommended, setIsRecommended] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");

  const [songs, setSongs] = useState<any[]>([]);
  const [filteredSongs, setFilteredSongs] = useState<any[]>([]);

  const [shareOpenMenu, setShareOpenMenu] = useState<boolean>(false);
  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    getSongList();
  }, []);

  useEffect(() => {
    if (isRecommended) {
      setFilteredSongs(songs);
    } else {
      setFilteredSongs([]);
    }
  }, [songs, isRecommended]);

  const getSongList = () => {
    axios
      .get(`${URL()}/claimableSongs/getSongList`)
      .then(response => {
        if (response.data.success) {
          const songs = response.data.data;
          setSongs(songs);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const [onSearch] = useDebouncedCallback(() => {
    if (searchValue && searchValue !== "") {
      setFilteredSongs(
        songs.filter(a => a.song_name && a.song_name.toUpperCase().includes(searchValue.toUpperCase()))
      );
    } else {
      setFilteredSongs(songs);
    }
  }, 1000);

  const handleCloseCreatePlaylistModal = () => {
    setOpenCreatePlaylistModal(false);
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

  return (
    <div className={classes.page}>
      <SubpageHeader item={{ ...playlist, Color: color }} />
      <div className={classes.content}>
        {isRecommended ? (
          <Box>
            <button
              ref={anchorShareMenuRef}
              onClick={() => setShareOpenMenu(true)}
              className={customClasses.menuButton}
            >
              <HorizontalMenuIcon />
            </button>
            <Popper
              open={shareOpenMenu}
              anchorEl={anchorShareMenuRef.current}
              transition
              disablePortal={false}
              placement="bottom-start"
              style={{ position: "inherit" }}
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps}>
                  <Paper className={customClasses.paper}>
                    <ClickAwayListener onClickAway={handleShareCloseMenu}>
                      <MenuList
                        autoFocusItem={shareOpenMenu}
                        id="share-menu-list-grow"
                        onKeyDown={handleListKeyDownShareMenu}
                      >
                        <MenuItem>
                          <AddPlayListIcon />
                          Add to play queue
                        </MenuItem>
                        <MenuItem>
                          <EditIcon />
                          Edit
                        </MenuItem>
                        <MenuItem>
                          <RemovePlayListIcon />
                          Delete
                        </MenuItem>
                        <MenuItem>
                          <ShareIcon />
                          Share
                        </MenuItem>
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>

            <Box className={customClasses.flexBox}>
              <Box>
                <Box className={customClasses.header1} mb={1}>
                  Recommendations
                </Box>
                <Box className={customClasses.header2}>From the content of this list</Box>
              </Box>
              <Box
                className={customClasses.header3}
                onClick={() => setIsRecommended(false)}
                style={{ cursor: "pointer" }}
              >
                SEARCH MORE
              </Box>
            </Box>
          </Box>
        ) : (
          <Box>
            <Box className={customClasses.flexBox}>
              <Box className={customClasses.header1} mb={1}>
                Let's find something for your list
              </Box>
              <Box onClick={() => setIsRecommended(true)} style={{ cursor: "pointer" }}>
                <CloseIcon />
              </Box>
            </Box>
            <Box maxWidth="450px">
              <SearchWithCreate
                searchValue={searchValue}
                handleSearchChange={e => {
                  setSearchValue(e.target.value);
                  onSearch();
                }}
                searchPlaceholder="Search Privi Music"
              />
            </Box>
          </Box>
        )}
        {filteredSongs.length > 0 && (
          <Table className={classes.table}>
            <SongsRowHeader simplified={simplified} />
            {filteredSongs.map((song, index) => (
              <SongRow
                row={song}
                simplified={simplified}
                key={`song-${index}`}
                addMode
                isAdded={playlist.Songs.find(item => item.id === song.id)}
                onAdd={isAdd =>
                  setPlaylist(prev => ({
                    ...prev,
                    Songs: isAdd ? [...prev.Songs, song] : prev.Songs.filter(item => item.id !== song.id),
                  }))
                }
              />
            ))}
          </Table>
        )}
      </div>
      <CreatePlaylistModal
        open={openCreatePlaylistModal}
        handleClose={handleCloseCreatePlaylistModal}
        handleRefresh={item =>
          setPlaylist(prev => ({ ...prev, Title: item.Title, Description: item.Description }))
        }
      />
    </div>
  );
}
