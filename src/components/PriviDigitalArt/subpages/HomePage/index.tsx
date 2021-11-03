import React, { useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
import cls from "classnames";

import ArtistCard from "../../components/Cards/ArtistCard";
import CollectionCard from "../../components/Cards/CollectionCard";
import DigitalArtCard from "../../components/Cards/DigitalArtCard";
import { COLUMNS_COUNT_BREAK_POINTS_FOUR } from "../ExplorePage/index";

import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import URL from "shared/functions/getURL";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import Box from "shared/ui-kit/Box";
import DigitalArtContext from "shared/contexts/DigitalArtContext";
import { CollectionsWax, CollectionsShowTime, CollectionsOpensea } from "shared/constants/collections";

import { subPageStyles } from "../index.styles";

export default function HomePage() {
  const classes = subPageStyles();
  const { setOpenFilters } = useContext(DigitalArtContext);
  const [showMoreArtists, setShowMoreArtists] = useState<boolean>(false);
  const [loadingDigitalArts, setLoadingDigitalArts] = useState<boolean>(false);
  const [showMoreCollections, setShowMoreCollections] = useState<boolean>(false);
  const [loadingArtists, setLoadingArtists] = useState<boolean>(false);
  const [digitalArts, setDigitalArts] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([
    ...CollectionsWax,
    ...CollectionsShowTime,
    ...CollectionsOpensea,
  ]);

  useEffect(() => {
    setOpenFilters(false);
    getArtists();
    getDigitalArts();
  }, []);

  useEffect(() => {
    collections.sort((a, b) => {
      if ((a.name || "") > (b.name || "")) return 1;
      if ((a.name || "") < (b.name || "")) return -1;
      return 0;
    });

    const filtered: any[] = [];
    collections.map(item => {
      if (!filtered.find(collection => collection.name === item.name)) {
        filtered.push(item);
      }
    });
    setCollections(filtered);
  }, []);

  const getArtists = useCallback(() => {
    if (loadingArtists) return;
    setLoadingArtists(true);
    axios
      .get(`${URL()}/artwork/topSellers`)
      .then(res => {
        if (res.data.success) {
          const sortedData = res.data.userList;
          sortedData.sort((a, b) => b.myMediasCount - a.myMediasCount);
          setArtists(sortedData);
        }
      })
      .catch(err => console.log(err))
      .finally(() => setLoadingArtists(false));
  }, []);

  const getDigitalArts = useCallback(() => {
    setLoadingDigitalArts(true);
    axios
      .post(`${URL()}/artwork/recentMedias`, {
        limit: 4,
      })
      .then(res => {
        if (res.data.success) {
          const newData = res.data.data.map(item => {
            if (item?.url) {
              return {
                ...item,
                url: item.url.replace("https://ipfs.atomichub.io/ipfs/", "https://cloudflare-ipfs.com/ipfs/"),
              };
            } else {
              return item;
            }
          });
          setDigitalArts(newData);
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingDigitalArts(false);
      });
  }, []);



  return (
    <div
      className={classes.page}
      style={{
        justifyContent: loadingArtists || loadingDigitalArts ? "center" : "flex-start",
      }}
    >
      <LoadingWrapper loading={loadingArtists || loadingDigitalArts} theme={"blue"}>
        <div className={classes.content}>
          <div className={classes.headerTitle}>
            ✨ Top Artists
            {!loadingArtists && artists && artists.length > 4 && (
              <span
                onClick={() => {
                  setShowMoreArtists(!showMoreArtists);
                }}
                className={classes.viewMore}
              >
                {showMoreArtists ? "HIDE" : "VIEW MORE"}
              </span>
            )}
          </div>
          {artists && artists.length > 0 ? (
            <div className={cls({ [classes.artistCardsHide]: !showMoreArtists }, classes.artistCards)}>
              <MasonryGrid
                gutter={"24px"}
                data={artists}
                renderItem={(item, index) => (
                  <ArtistCard item={item} key={`item-${index}`}/>
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
            </div>
          ) : (
            <div className={classes.artistCardsHide}>
              <Box display="flex" justifyContent="center" mb={3}>
                No items found
              </Box>
            </div>
          )}
          <div className={classes.headerTitle}>
            ✨ Top Collections
            {collections && collections.length > 0 && (
              <span
                onClick={() => {
                  setShowMoreCollections(!showMoreCollections);
                }}
                className={classes.viewMore}
              >
                {showMoreCollections ? "HIDE" : "VIEW MORE"}
              </span>
            )}
          </div>
          {collections && collections.length > 0 ? (
            <div
              className={cls(
                { [classes.collectionCardsHide]: !showMoreCollections },
                classes.collectionCards
              )}
            >
              <MasonryGrid
                gutter={"24px"}
                data={collections}
                renderItem={(item, index) => (
                  <CollectionCard heightFixed={true} item={item} key={`item-${index}`} />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
            </div>
          ) : (
            <div className={classes.collectionCardsHide}>
              <Box display="flex" justifyContent="center" mb={3}>
                No items found
              </Box>
            </div>
          )}

          <div className={classes.headerTitle}>
            ✨ Created
          </div>
          {digitalArts && digitalArts.length > 0 ? (
            <div className={classes.artCards}>
              <MasonryGrid
                gutter={"24px"}
                data={digitalArts}
                renderItem={(item, index) => (
                  <DigitalArtCard heightFixed={true} item={item} key={`item-${index}`} index={index + 1} />
                )}
                columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
              />
            </div>
          ) : (
            <Box display="flex" justifyContent="center" mt={2} mb={3}>
              No items found
            </Box>
          )}
        </div>
      </LoadingWrapper>
    </div>
  );
}
