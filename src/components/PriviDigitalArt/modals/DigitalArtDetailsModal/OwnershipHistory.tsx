import React from "react";
import Moment from "react-moment";

import { useTypedSelector } from "store/reducers/Reducer";

import { Avatar, Color, FontSize, StyledDivider, Text } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

import { ExternalLinkIcon } from "./index.styles";
import { getBidHistory } from "shared/services/API";
import { getDefaultAvatar, getRandomAvatar } from "shared/services/user/getUserAvatar";

const OwnershipHistory = ({ media }) => {
  const allUsers = useTypedSelector(state => state.usersInfoList);

  const [bidHistory, setBidHistory] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (media?.MediaSymbol) {
      getBidHistory(media.MediaSymbol, media.Type).then(resp => {
        if (resp?.success) setBidHistory(resp.data);
      });
    }
  }, [media]);

  const histories = React.useMemo(() => {
    if (!bidHistory || bidHistory.length === 0) return [];
    return bidHistory
      .map((history: any) => ({
        user: allUsers.find(user => user.address === history.bidderAddress),
        price: history.price,
        date: history.date,
      }))
      .filter(history => history && history.user);
  }, [allUsers, bidHistory]);

  return (
    <div style={{ minHeight: 400 }}>
      {histories && histories.length > 0 ? (
        histories.map((history, index) => (
          <Box key={`owner-history-${index}`}>
            <StyledDivider type="solid" margin={2} />
            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
              <Box display="flex" flexDirection="row" alignItems="center">
                <Avatar
                  size="medium"
                  url={
                    history.user?.ipfsImage || getDefaultAvatar()
                  }
                />
                <Box ml={2} display="flex" flexDirection="column">
                  <Box display="flex" flexDirection="row">
                    <Text color={Color.Black}>Bid placed by</Text>
                    <Text ml={1}>{`${history.user?.twitter || ""}`}</Text>
                  </Box>
                  <Box display="flex" flexDirection="row">
                    <Text color={Color.Black}>{`${history.price} ${media.Auctions.TokenSymbol}`}</Text>
                    <Text ml={1}>
                      <Moment format="On MMMM DD, YYYY, HH:mm a">{history.date}</Moment>
                    </Text>
                  </Box>
                </Box>
              </Box>
              <ExternalLinkIcon />
            </Box>
          </Box>
        ))
      ) : (
        <Text color={Color.GrayDark} size={FontSize.M} align="center">No history</Text>
      )}
    </div>
  );
};

export default OwnershipHistory;
