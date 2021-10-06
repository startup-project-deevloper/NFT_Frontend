import React from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "shared/contexts/AuthContext";

import Box from "shared/ui-kit/Box";
import { topNFTCardStyles } from "./index.styles";

export default function TopNFTCard({ item }) {
  const classes = topNFTCardStyles();
  const history = useHistory();

  const { isSignedin } = useAuth();

  const handleOpenDigitalArtModal = () => {
    if (isSignedin && item) {
      let queryParam = "";
      if (item.tag) queryParam += (queryParam ? "&" : "") + `blockchainTag=${item.tag}`;
      if (item.collection) queryParam += (queryParam ? "&" : "") + `collectionTag=${item.collection}`;
      history.push(
        `/fractionalisation/synthetic/${encodeURIComponent(item.MediaSymbol ?? item.id)}?${queryParam}`
      );
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" onClick={handleOpenDigitalArtModal}>
      <div className={classes.card}>
        <div className={classes.innerBox}>
          <img src={item.image} alt="nft image" />
          <div className={classes.starGroup}>
            <Box fontSize={10.5} mr={"2px"}>
              🌟{" "}
            </Box>
            <Box fontSize={15.74} mr={"2px"} pb={1}>
              🌟{" "}
            </Box>
            <Box fontSize={10.5}>🌟 </Box>
          </div>
          <div className={classes.ntfName}>{item.name}</div>
          <div className={classes.priceSection}>
            <div>{`$${item.price}`}</div>
            <div
              style={{
                marginLeft: 8,
                color: item.delta > 0 ? "#DDFF57" : "#F43E5F",
              }}
            >
              {item && item.delta > 0 ? <UpIcon /> : <DownIcon />}
              {` ${Math.abs(item.delta)}%`}
            </div>
          </div>
        </div>
      </div>
      <div className={classes.shadow} />
    </Box>
  );
}

const UpIcon = () => (
  <svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.58262 0.461069C5.56552 0.445558 5.54937 0.43177 5.53228 0.419705C5.52373 0.412811 5.51423 0.406779 5.50473 0.399885C5.49998 0.396439 5.49618 0.393852 5.49048 0.390406C5.3537 0.297338 5.18368 0.242188 4.99941 0.242188C4.81513 0.242188 4.64606 0.297338 4.50833 0.390406C4.50263 0.394714 4.49598 0.398162 4.49028 0.403332C4.48268 0.408503 4.47509 0.413673 4.46749 0.419705C4.45039 0.432631 4.43234 0.446416 4.41524 0.46279L0.742212 3.79346C0.419263 4.08644 0.419263 4.56127 0.742212 4.85425C1.06516 5.14724 1.58855 5.14724 1.9115 4.85425L4.17315 2.80247L4.17315 11.4925C4.17315 11.907 4.54359 12.2422 4.99953 12.2422C5.45641 12.2422 5.8259 11.907 5.8259 11.4925L5.8259 2.80335L8.08755 4.85514C8.4105 5.14812 8.93389 5.14812 9.25779 4.85514C9.58074 4.56215 9.58074 4.08733 9.25779 3.79434L5.58548 0.46279L5.58262 0.461069Z"
      fill="#DDFF57"
    />
  </svg>
);

const DownIcon = () => (
  <svg width="9" height="13" viewBox="0 0 9 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.91738 12.0233C3.93448 12.0388 3.95063 12.0526 3.96772 12.0647C3.97627 12.0716 3.98577 12.0776 3.99527 12.0845C4.00002 12.0879 4.00382 12.0905 4.00952 12.094C4.1463 12.187 4.31632 12.2422 4.50059 12.2422C4.68486 12.2422 4.85394 12.187 4.99167 12.094C4.99737 12.0897 5.00402 12.0862 5.00972 12.081C5.01732 12.0759 5.02491 12.0707 5.03251 12.0647C5.04961 12.0517 5.06766 12.038 5.08475 12.0216L8.75779 8.69091C9.08074 8.39793 9.08074 7.9231 8.75779 7.63012C8.43484 7.33714 7.91145 7.33714 7.5885 7.63012L5.32685 9.68191L5.32685 0.991886C5.32685 0.577394 4.95641 0.242187 4.50047 0.242187C4.04359 0.242187 3.6741 0.577394 3.6741 0.991886L3.6741 9.68103L1.41245 7.62924C1.0895 7.33625 0.56611 7.33625 0.242212 7.62924C-0.0807374 7.92222 -0.0807375 8.39705 0.242212 8.69003L3.91452 12.0216L3.91738 12.0233Z"
      fill="#F43E5F"
    />
  </svg>
);
