import * as React from "react";
import { format } from "date-fns";

import { useTypedSelector } from "store/reducers/Reducer";

import { Color, Header5, SecondaryButton, StyledDivider, Text } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";

import { useStyles } from "./index.styles";
import { getChainImageUrl } from "shared/functions/chainFucntions";

const ProofAuthenticity = ({ media }) => {
  const classes = useStyles();
  const allUsers = useTypedSelector(state => state.usersInfoList);

  const creator = React.useMemo(() => {
    return allUsers.find(user => user.id === media.CreatorId);
  }, [allUsers, media]);

  if (!creator) return <div style={{ minHeight: 400 }}></div>;
  return (
    <div style={{ minHeight: 400 }}>
      <Header5>Creator</Header5>
      <StyledDivider type="solid" mb={3} />
      <Box display="flex" flexDirection="row" mb={1}>
        <Text color={Color.Black}>User:</Text>
        <Text ml={1} className={classes.mintGradient}>
          {creator.name}
        </Text>
      </Box>
      <Box display="flex" flexDirection="row" mb={1}>
        <Text color={Color.Black}>Edition:</Text>
        <Text ml={1}>1 of 1</Text>
      </Box>
      <Box display="flex" flexDirection="row" mb={5}>
        <Text color={Color.Black}>Created:</Text>
        {media.ReleaseDate && (
          <Text ml={1}>{format(new Date(media.ReleaseDate * 1000), "MMMM dd, yyyy")}</Text>
        )}
      </Box>
      <Header5>Chain</Header5>
      <StyledDivider type="solid" mb={3} />
      <Box display="flex" flexDirection="row" mb={1}>
        <Text color={Color.Black}>Token name:</Text>
        <Text ml={1}>
          {media.Auctions
            ? media.Auctions.TokenSymbol
            : media.ExchangeData
            ? media.ExchangeData.OfferToken
            : media.NftConditions
            ? media.NftConditions.NftToken
            : "N/A"}
        </Text>
      </Box>
      <Box display="flex" flexDirection="row" mb={1}>
        <Text color={Color.Black}>ID:</Text>
        <Text ml={1}>#{media.MediaSymbol ?? media.id}</Text>
      </Box>
      <Box display="flex" flexDirection="row" mb={1}>
        <Text color={Color.Black}>Contract ID:</Text>
        <Text ml={1} className={classes.mintGradient}>
          {creator.id || ""}
        </Text>
      </Box>
      <Box display="flex" flexDirection="row" mb={5}>
        <Text color={Color.Black}>Creator’s Blockchain ID:</Text>
        <Text ml={1} className={classes.mintGradient}>
          {creator.address || ""}
        </Text>
      </Box>
      {media.BlockchainNetwork && (
        <>
          <Box display="flex" alignItems="center" width={"50%"}>
            {media?.BlockchainNetwork && (
              <img
                src={getChainImageUrl(media?.BlockchainNetwork)}
                width="32px"
                style={{ borderRadius: "50%" }}
              />
            )}
            <Box ml={2}>{media?.tag?.toUpperCase() || media?.BlockchainNetwork || media?.blockchain}</Box>
          </Box>
        </>
        // <SecondaryButton size="medium" className={classes.transparentBtn}>
        //   <img
        //     src={getChainImageUrl(media?.chain ?? media?.BlockchainNetwork ?? media?.blockchain)}
        //     width="32px"
        //     style={{ borderRadius: "50%" }}
        //   />
        // </SecondaryButton>
      )}
    </div>
  );
};

export default ProofAuthenticity;
