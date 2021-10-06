import React from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";

import { RootState } from "store/reducers/Reducer";
import { Avatar } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { wallItemStyles } from "./index.styles";

const ResponseIcon = ({ color = "#727F9A" }) => {
  return (
    <svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 1H1V13H4V18L9 13H17V1Z" stroke={color} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const arePropsEqual = (prevProps, currProps) => {
  return prevProps.item === currProps.item && prevProps.type === currProps.type;
};

const WallItem = React.memo((props: any) => {
  const classes = wallItemStyles();
  const history = useHistory();
  const usersList = useSelector((state: RootState) => state.usersInfoList);

  let userIndex;
  if (props.Creator.includes("0x")) {
    userIndex = usersList.findIndex(user => user.address === props.Creator);
  } else {
    userIndex = usersList.findIndex(user => user.id === props.Creator);
  }

  return (
    <Box
      className={classes.item}
      style={{
        background: props.item.isPinned ? "#9EACF2" : "white",
        color: props.item.isPinned ? "white" : "black",
      }}
      onClick={() => {
        history.push(`/pod_post/${props.item.id}`);
      }}
    >
      {props.item.Url && props.item.hasPhoto && (
        <Box
          className={classes.image}
          style={{
            backgroundImage: props.item.Url ? `url(${props.item.Url})` : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          onClick={() => {}}
        />
      )}
      <Box className={classes.userImage}>
        <Avatar
          size="medium"
          url={
            usersList[userIndex]?.imageURL
              ? usersList[userIndex]?.imageURL
              : usersList[userIndex]?.imageUrl
              ? usersList[userIndex]?.imageUrl
              : usersList[userIndex]?.anonAvatar
              ? require(`assets/anonAvatars/${usersList[userIndex]?.anonAvatar}`)
              : ""
          }
        />
      </Box>

      <Box display="flex" flexDirection="column" p={2} flex={1}>
        <Box className={classes.header1}>{props.item.name ? props.item.name : ""}</Box>
        {props.item.textShort && (
          <Box flex={1} className={classes.header2} mt={1}>
            {props.item.textShort} {props.index * props.index * props.index * props.index * props.index * props.index * props.index * props.index * props.index * props.index * props.index}
          </Box>
        )}
        <Box
          display="flex"
          alignItems="center"
          mt={1}
          borderTop={props.item.isPinned ? "1px solid white" : "1px solid #707582"}
          pt={1}
        >
          <ResponseIcon color={props.item.isPinned ? "white" : "#727F9A"} />
          <Box className={classes.header2} ml={1}>
            {props.item.responses && props.item.responses.length
              ? `${props.item.responses.length} Responses`
              : `0 Responses`}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}, arePropsEqual);

export default WallItem;
