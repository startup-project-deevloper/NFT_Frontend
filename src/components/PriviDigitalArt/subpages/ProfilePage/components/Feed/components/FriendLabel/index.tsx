import React, { useEffect } from "react";

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
      {!friend.online && (
        <Box
          style={{
            background: "#431AB7",
            width: "8px",
            height: "8px",
            borderRadius: "4px",
          }}
        />
      )}
    </Box>
  );
}
