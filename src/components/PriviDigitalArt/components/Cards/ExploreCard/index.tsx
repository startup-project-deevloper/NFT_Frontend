import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

import { getUserByAddress } from "shared/services/API/UserAPI";

import Box from "shared/ui-kit/Box";
import { Avatar } from "shared/ui-kit";
import { cardStyles } from "./index.style";

const CARD_COLORS = {
  LISTED: "rgba(31, 200, 139, 0.98)",
  RENTED: "#8D65FF",
  BLOCKED: "#FF3F84",
};

const ExploreCard = ({ nft }) => {
  const history = useHistory();
  const classes = cardStyles();

  const [owner, setOwner] = useState<any>();

  const handleRefresh = async () => {
    if (nft.OwnerAddress) {
      const data = await getUserByAddress((nft.ownerAddress || "").toLowerCase());
      setOwner(data.data);
    }
  };

  useEffect(() => {
    handleRefresh();
  }, [nft]);

  const handleOpenExplore = () => {
    history.push("/reserve/explore/" + nft.imageUrl);
  };

  const userName = React.useMemo(() => {
    if (!owner) {
      return (
        nft.ownerAddress.substr(0, 5) + "..." + nft.ownerAddress.substr(nft.ownerAddress.length - 5, 5) ?? ""
      );
    }
    let name: string = "";
    name =
      owner.firstName && owner.lastName
        ? `${owner.firstName} ${owner.lastName}`
        : owner.address.substr(0, 5) + "..." + owner.address.substr(owner.address.length - 5, 5) ?? "";

    return name;
  }, [nft, owner]);

  return (
    <div className={classes.outerCard} style={{ marginBottom: 0 }} onClick={handleOpenExplore}>
      <div className={classes.innerCardGradient}>
        <div className={classes.innerCard}>
          <div className={classes.cardImg}>
            <img src={"assets/test/" + nft.imageUrl + ".png"} style={{ width: "100%" }} />
            <span className={classes.cardOptionButton} style={{ background: CARD_COLORS[nft.type] }}>
              {nft.type}
            </span>
          </div>
          <div className={classes.cardTitle}>
            <span className={classes.cardNftName}>{nft.name}</span>
            <Box onClick={() => history.push(`/${owner?.urlSlug}/profile`)} className={classes.userName}>
              <Avatar
                size="small"
                url={owner?.urlIpfsImage ?? require(`assets/anonAvatars/ToyFaces_Colored_BG_001.jpg`)}
              />
              <span>{userName}</span>
            </Box>
          </div>
          <div className={classes.divider} />
          <div className={classes.cardContent}>
            <div className={classes.cardContentDiv}>
              <span className={classes.cardContentText}>SELLING PRICE</span>
              <span className={classes.cardContentAmount}>{nft.sellingPrice} ETH</span>
            </div>
            <div className={classes.cardContentDiv}>
              <span className={classes.cardContentText}>BLOCKING PRICE</span>
              <span className={classes.cardContentAmount}>
                {nft.blockingPrice} for {nft.blockingPeriod} for 90 days
              </span>
            </div>
            <div className={classes.cardContentDiv}>
              <span className={classes.cardContentText}>RENTAL PRICE</span>
              <span className={classes.cardContentAmount}>
                {nft.rentalPrice} ETH / {nft.rentalPriceCycle}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreCard;
