import React from "react";

import { Avatar } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { useHistory } from "react-router-dom";
import { StyledSkeleton } from "shared/ui-kit/Styled-components/StyledComponents";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import useIPFS from "shared/utils-IPFS/useIPFS";
import getPhotoIPFS from "shared/functions/getPhotoIPFS";

export default function FriendLabel({ friend }) {
  const history = useHistory();

  const { downloadWithNonDecryption } = useIPFS();

  const [imageIPFS, setImageIPFS] = React.useState<any>(null);

  React.useEffect(() => {
    if (friend) {
      getImageIpfs();
    }
  }, [friend]);

  const getImageIpfs = async () => {
    if (friend?.infoImage?.newFileCID && friend?.infoImage?.metadata?.properties?.name) {
      let imageUrl = await getPhotoIPFS(friend.infoImage.newFileCID, friend.infoImage.metadata.properties.name, downloadWithNonDecryption);
      setImageIPFS(imageUrl);
    } else {
      setImageIPFS(getDefaultAvatar());
    }
  };

  const userSlug = React.useMemo(() => {
    const slug = friend.urlSlug;
    return slug.length > 15 ? slug.substr(0, 11) + "..." + slug.substr(slug.length - 3, 3) : slug;
  }, [friend]);

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
        <Avatar url={imageIPFS ? imageIPFS : ""} size="small" />
        <Box ml="14px" maxWidth="70%">
          <Box color="#181818" fontSize="16px" mb="4px">
            {friend.name ?? <StyledSkeleton width={120} animation="wave" />}
          </Box>
          <Box fontSize="14px" color="#431AB7">
            @{userSlug}
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
