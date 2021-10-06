import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { format } from "date-fns";

import Waveform from "shared/ui-kit/Page-components/Discord/DiscordAudioWavesurfer/Waveform";
import Box from "shared/ui-kit/Box";
import { useTypedSelector } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import { getUsersInfoList } from "store/selectors";

const useStyles = makeStyles(theme => ({
  container: {
    background: "#FFFFFF",
    boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.12)",
    borderRadius: 20,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    rowGap: 16,
    marginBottom: 16,
    marginTop: 16,
  },
  header: {
    fontWeight: "bold",
    fontSize: 23,
    lineHeight: "24px",
    color: "#FF5954",
    "& > span": {
      marginLeft: 4,
      fontSize: 14,
    },
  },
  footer: {
    fontSize: 12,
    color: " #1A1B1CAA",
    fontWeight: "bold",
    lineHeight: "24px",
  },
}));

export const SharedVoiceItem = ({ voice }) => {
  const classes = useStyles();
  const users = useTypedSelector(getUsersInfoList);

  const voiceUser = React.useMemo(() => {
    return users?.find(user => user.id === voice.userId);
  }, [users, voice]);

  return (
    <Box className={classes.container}>
      <Box display="flex" alignItems="center" className={classes.header}>
        🎤{` `}
        <span>{voiceUser?.name} has shared a voice memo.</span>
      </Box>
      <Waveform
        url={`${URL()}/chat/getSharedAudioURL/${voice.id}`}
        mine={false}
        showTime={false}
        onPauseFunction={null}
        onPlayFunction={null}
        onReadyFunction={null}
        fullWidth={true}
      />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box className={classes.footer}>{format(voice.created, "yyyy.MM.dd")}</Box>
        <Box></Box>
      </Box>
    </Box>
  );
};
