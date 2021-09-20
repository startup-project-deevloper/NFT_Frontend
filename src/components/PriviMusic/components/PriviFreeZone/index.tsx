import React from "react";

import Box from "shared/ui-kit/Box";
import { Text } from "components/PriviMusicDao/components/ui-kit";
import { Color, FontSize, PrimaryButton } from "shared/ui-kit";
import { priviFreeZoneStyles } from "./index.styles";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";

const PriviFreeZone = (props) => {
  const classes = priviFreeZoneStyles();
  const commonClasses = priviMusicDaoPageStyles();

  const [hoursFreeMusicTime, setHoursFreeMusicTime] = React.useState<number>(0);
  const [minutesFreeMusicTime, setMinutesFreeMusicTime] = React.useState<number>(0);
  const [secondsFreeMusicTime, setSecondsFreeMusicTime] = React.useState<number>(0);

  React.useEffect(() => {
    let hour: any = Math.floor(props.seconds / 3600);
    hour = (hour < 10) ? '0' + hour : hour;
    setHoursFreeMusicTime(hour)

    let minute: any = Math.floor((props.seconds / 60) % 60);
    minute = (minute < 10) ? '0' + minute : minute;
    setMinutesFreeMusicTime(minute)

    let second: any = props.seconds % 60;
    second = (second < 10) ? '0' + second : second;
    setSecondsFreeMusicTime(second)

  }, [props.seconds]);

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height={props.isMobile ? 91 : 130} className={classes.container}>
      <Box display="flex" flexDirection="row" alignItems="center" mb={1}>
        <img src={require("assets/icons/flash.png")} alt="flash" />
        <Text bold color={Color.White} ml={1}>Privi Free Zone</Text>
        {props.isMobile && (
          <Text size={FontSize.L} bold ml={2} color={Color.White}>
            {hoursFreeMusicTime} : {minutesFreeMusicTime} : {secondsFreeMusicTime}
          </Text>
        )}
      </Box>
      {!props.isMobile && (
        <Text size={FontSize.L} bold mt={1} mb={2} color={Color.White}>
          {hoursFreeMusicTime} : {minutesFreeMusicTime} : {secondsFreeMusicTime}
        </Text>
      )}
      <PrimaryButton size={props.isMobile ? "small" : "medium"} className={`${commonClasses.primaryButton} ${classes.moreButton}`}>
        Get more free music
      </PrimaryButton>
    </Box>
  )
};

export default PriviFreeZone;
