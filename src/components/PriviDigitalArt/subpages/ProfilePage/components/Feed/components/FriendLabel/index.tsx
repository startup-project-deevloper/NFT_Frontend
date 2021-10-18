import React from "react";

import { Avatar } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { useHistory } from "react-router-dom";
import { StyledSkeleton } from "shared/ui-kit/Styled-components/StyledComponents";

export default function FriendLabel({ friend }) {
  const history = useHistory();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={4}
      style={{ cursor: "pointer" }}
      onClick={() => history.push(`/${friend.urlSlug}/profile`)}
    >
      <Box display="flex" alignItems="flex-start" width="95%">
        <Avatar url={friend.ipfsImage ? friend.ipfsImage : ""} size="small" />
        <Box ml="14px" maxWidth="70%">
          <Box color="#181818" fontSize="16px" mb="4px">
            {friend.name ?? <StyledSkeleton width={120} animation="wave" />}
          </Box>
          <Box fontSize="14px" color="#431AB7">
            @{friend.urlSlug}
          </Box>
        </Box>
      </Box>
      {friend.connected && (
        <Box
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
  );
}
