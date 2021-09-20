import React from "react";

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
      mb={4}
      style={{ cursor: "pointer" }}
      onClick={() => history.push(`/flix/profile/${friend.urlSlug}`)}
    >
      <Box display="flex" alignItems="flex-start" width="95%">
        <Avatar url={friend.imageURL ?? ""} size="small" />
        <Box ml="14px" maxWidth="70%">
          <Box fontSize={16} fontWeight={400} fontFamily="Agrandir" mb="4px">
            {friend.name ?? <Skeleton width={120} animation="wave" />}
          </Box>
          <Box fontSize={14} fontWeight={400} fontFamily="Agrandir" color="#FF5954">
            @{friend.urlSlug}
          </Box>
        </Box>
      </Box>
      {!friend.online && (
        <Box
          style={{
            background: "#65CB63",
            width: "8px",
            height: "8px",
            borderRadius: "4px",
          }}
        />
      )}
    </Box>
  );
}
