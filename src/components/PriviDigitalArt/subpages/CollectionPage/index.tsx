import React, { useEffect, useState, useContext } from "react";
import { useHistory, useParams, useLocation } from "react-router-dom";

import { useTypedSelector } from "store/reducers/Reducer";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import DigitalArtContext, { initialDigitalArtFilters } from "shared/contexts/DigitalArtContext";
import { CircularLoadingIndicator, Color, FontSize, Text } from "shared/ui-kit";
import { useMediaPreloader } from "shared/hooks/useMediaPreloader";
import { COLUMNS_COUNT_BREAK_POINTS_FOUR } from "../ExplorePage";
import DigitalArtCard from "../../components/Cards/DigitalArtCard";
import { subPageStyles } from "../index.styles";

import { CollectionsWax, CollectionsShowTime, CollectionsOpensea } from "shared/constants/collections";
import { Box } from "@material-ui/core";
import {url} from "inspector";
const collections = [...CollectionsWax, ...CollectionsShowTime, ...CollectionsOpensea];

export default function CollectionPage() {
  const { collectionName }: { collectionName: string } = useParams();
  const history = useHistory();
  const location: any = useLocation();
  let blockChain = location.state?.blockChain ?? "Showtime";

  const classes = subPageStyles();
  const [collection, setCollection] = useState<any>();
  const { filters, setFilters } = useContext(DigitalArtContext);
  const { refresh, setRefresh } = useContext(DigitalArtContext);
  const { data, hasMore, loadMore, reload } = useMediaPreloader(filters);

  const [digitalArts, setDigitalArts] = useState<any[]>([]);
  const user = useTypedSelector(state => state.user);

  useEffect(() => {
    let collection = collections.find(col => col.name === collectionName);
    setCollection(collection);
    initialDigitalArtFilters.blockChains = [collection!.blockChain]
    setFilters({
      ...initialDigitalArtFilters,
      collection: collectionName,
      blockChains: [collection!.blockChain],
      platforms: [collection!.platform]
    });
  }, [collectionName]);


  useEffect(() => {
    if (refresh) {
      reload();
      setRefresh(false);
    }
  }, [refresh]);

  useEffect(() => {
    if (data && data.length > 0) {
      let medias = [...data.map(item => item.media)];
      if (user.uninterestedMedias) {
        medias = medias.filter(item => !user.uninterestedMedias?.includes(item.id));
      }
      setDigitalArts(medias);
    } else {
      setDigitalArts([]);
    }
  }, [data, user.uninterestedMedias]);

  const handleScroll = React.useCallback(
    async e => {
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 42) {
        if (hasMore) loadMore();
      }
    },
    [hasMore, loadMore]
  );

  return (
    <div className={classes.page}
         onScroll={handleScroll}>
      <div className={classes.content}>
        <Box display="flex" alignItems="center" style={{cursor: "pointer"}} onClick={() => history.goBack()}>
          <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
            <path d="M1 7L17 7M1 7L7 1M1 7L7 13" stroke="#181818" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <Text size={FontSize.XL} ml={1.5} color={Color.Black}>Back</Text>
        </Box>
        <Box
          className={classes.collectionBack}
          style={{
            backgroundImage: `url(${require("assets/backgrounds/background.jpeg")})`,
            backgroundSize: "cover"
          }}
          // position="relative"
        >
          {/* <img
            src={require("assets/backgrounds/collection.png")}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.7 }}
            alt="background"
          /> */}
          {/* <Box width={1} height={1} position="absolute" top={0} left={0} bgcolor="#9EACF2"/> */}
          {collection &&
            <Box width={1} height={1} display="flex" alignItems="center">
              <img className={classes.collectionImage}
                   src={require(`assets/collectionImages/${collection.imageURL}`)} alt="collection" />
              <Box ml={"35px"} display="flex" flexDirection="column">
                <span className={classes.collectionName}>{collection.label}</span>
                <Box display="flex">
                  <Box display="flex" flexDirection="row" alignItems="center" bgcolor="#DDFF57" borderRadius={48} padding="8px 32px">
                    <img src={require(`assets/chainImages/${collection.blockChain}.png`)} width={24} height={24} alt="token" />
                    <Text size={FontSize.L} ml={1.5} color={Color.Black}>{collection.blockChain === "eth" ? "Ethereum" : collection.blockChain}</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          }
        </Box>
        <div className={classes.artCards}>
          <MasonryGrid
            gutter={"24px"}
            data={digitalArts}
            renderItem={(item, index) => (
              <DigitalArtCard heightFixed={false} item={item} key={`item-${index}`} />
            )}
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
          />
          {hasMore && (
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                paddingTop: 16,
                paddingBottom: 16,
              }}
            >
              <CircularLoadingIndicator theme="blue" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
