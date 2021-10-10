import React from "react";
import {
  makeStyles,
  Slider,
  withStyles,
  Box,
} from "@material-ui/core";
import ReactPlayer from "react-player";

const MusicPlayer = ({ media }) => {
  const classes = useStyles();

  const playerAudio: any = React.useRef();
  const [playerState, setPlayerState] = React.useState({
    url: null,
    pip: false,
    playing: false,
    validated: false,
    controls: false,
    light: false,
    volume: 100,
    muted: false,
    played: 0,
    loaded: 0,
    duration: 0,
    playbackRate: 1.0,
    loop: false,
    volumeOpen: false,
    dropdownOpen: false,
    fullscreen: false,
    seeking: false,
    playedSeconds: 0,
  });
  const [selectedSong, setSelectedSong] = React.useState<any>();

  React.useEffect(() => {
    if (media.newFileCID) {
      setSelectedSong({
        url: `https://ipfs.io/ipfs/${media.newFileCID}`
      })
    }
  }, [media.newFileCID]);

  const handleSeekChange = (_, v) => {
    setPlayerState({ ...playerState, seeking: true, played: Number(v) });
  };

  const handleSeekMouseUp = (_, v) => {
    setPlayerState({ ...playerState, seeking: false });

    if (playerAudio?.current) {
      playerAudio.current.seekTo(parseFloat(v));
    }
  };

  const handleProgress = stateIn => {
    if (!playerState.seeking) {
      setPlayerState({ ...playerState, ...stateIn });
    }
  };

  const handlePlay = () => {
    if (selectedSong && selectedSong.url) {
      setPlayerState({ ...playerState, playing: !playerState.playing });
    }
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.playButton} onClick={handlePlay}>
        <svg width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.5241 0.937906C0.857828 0.527894 0 1.00724 0 1.78956V14.2104C0 14.9928 0.857827 15.4721 1.5241 15.0621L11.6161 8.85166C12.2506 8.46117 12.2506 7.53883 11.6161 7.14834L1.5241 0.937906Z" fill="#181818" />
        </svg>
      </Box>
      <Box className={classes.slider}>
        <Box display="flex" justifyContent="space-between">
          <span>
            {playerState.playedSeconds
              ? `${Math.floor((playerState.playedSeconds % 3600) / 60)}:${Math.floor(playerState.playedSeconds % 60) < 10 ? "0" : ""
              }${Math.floor(playerState.playedSeconds % 60).toFixed(0)}`
              : "0:00"}
          </span>
          <span>
            {selectedSong && selectedSong.duration
              ? `${Math.floor((selectedSong.duration % 3600) / 60)}:${Math.floor(selectedSong.duration % 60) < 10 ? "0" : ""
              }${Math.floor(selectedSong.duration % 60).toFixed(0)}`
              : "0:00"}
          </span>
        </Box>
        <PlayerSlider
          defaultValue={0}
          min={0}
          max={0.999999}
          step={0.0000001}
          value={playerState.played}
          onChange={handleSeekChange}
          onChangeCommitted={handleSeekMouseUp}
        />
      </Box>
      {selectedSong && (
        <ReactPlayer
          height={0}
          width={0}
          config={{ file: { forceAudio: true, attributes: { controlsList: "nodownload" } } }}
          onContextMenu={e => e.preventDefault()}
          url={selectedSong.url}
          volume={playerState.volume / 100}
          className="react-player"
          ref={playerAudio}
          playing={playerState.playing && playerState.validated}
          onPause={() => setPlayerState({ ...playerState, playing: false })}
          onPlay={() => setPlayerState({ ...playerState, playing: true })}
          onProgress={handleProgress}
          onDuration={(duration) => setSelectedSong({ ...selectedSong, duration })}
        />
      )}
    </Box>
  )
}

export default MusicPlayer;

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    alignItems: "center",
    background: "#65CB63",
    borderRadius: 32,
    padding: "12px 45px 12px 14px",
  },
  playButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#FFFFFF",
    borderRadius: "100%",
    width: 40,
    height: 40,
    cursor: "pointer",
  },
  slider: {
    flex: 1,
    marginLeft: 30,
    "& > div:first-child": {
      "& span": {
        fontSize: 11,
        color: "#FFFFFF",
      }
    }
  }
}));

const PlayerSlider = withStyles({
  root: {
    width: "100%",
    flexGrow: 1,
    color: "#707582",
    height: 4,
    borderRadius: 2,
    padding: 0,
  },
  thumb: {
    height: 4,
    width: 4,
    background: "#FFFFFF",
    border: "none",
    margin: 0,
  },
  track: {
    background: "#FFFFFF",
    height: 4,
    borderRadius: 3,
  },
  rail: {
    background: "#707582",
    height: 4,
    borderRadius: 3,
  },
})(Slider);