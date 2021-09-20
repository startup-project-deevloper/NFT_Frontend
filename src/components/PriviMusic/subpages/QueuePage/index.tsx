import React, { useContext, useEffect, useState } from "react";
import { Table } from "@material-ui/core";

import { priviMusicSubPageStyles } from "../index.styles";
import MusicContext from "shared/contexts/MusicContext";
import SongRow from "../../components/SongRow";
import ActionsRow from "../../components/ActionsRow";
import SubpageHeader from "../../components/SubpageHeader";

export default function QueuePage() {
  const classes = priviMusicSubPageStyles();
  const [queue, setQueue] = useState<any>({});

  const { openTab, selectedSong, songsList } = useContext(MusicContext);

  useEffect(() => {
    //TODO: get real queue
    setQueue(songsList);
  }, [songsList]);

  if (queue)
    return (
      <div className={classes.page}>
        <SubpageHeader item={queue} />
        <div className={classes.content}>
          <ActionsRow item={queue} setItem={setQueue} />
          <Table className={classes.table}>
            {selectedSong && <h5>You're listening to</h5>}
            {selectedSong && <SongRow row={selectedSong} simplified={false} />}
            <h5>Coming up next</h5>
            {queue &&
              queue.length > 0 &&
              queue
                .filter(song => !selectedSong || song.song_name !== selectedSong.song_name)
                .map(song => <SongRow row={song} simplified={false} />)}
          </Table>
        </div>
      </div>
    );
  else return null;
}
