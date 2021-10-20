import React from "react";

import { GreenText } from "components/PriviSocial/index.styles";
import { Avatar } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { useHistory } from "react-router-dom";
import { Skeleton } from "@material-ui/lab";

export default function FriendLabel({ friend }) {
  const history = useHistory();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={"32px"}
      style={{ cursor: "pointer" }}
      onClick={() => history.push(`/social/${friend.urlSlug}`)}
    >
      <Box display="flex" alignItems="center">
        <Avatar url={friend.ipfsImage ? friend.ipfsImage : ""} size="small" />
        <Box ml="14px">
          <Box color="#707582" fontSize="16px" mb="4px">
            {friend.name ?? <Skeleton width={120} animation="wave" />}
          </Box>
          <GreenText fontSize="14px">@{friend.urlSlug}</GreenText>
        </Box>
        {friend.connected && (
          <div
            style={{
              background:
                "conic-gradient(from 111.31deg at 50% 51.67%, #B1FF00 -118.12deg, #00FF15 110.62deg, #B1FF00 241.88deg, #00FF15 470.63deg)",
              width: "8px",
              height: "8px",
              borderRadius: "4px",
            }}
          />
        )}
      </Box>
    </Box>
  );
}
