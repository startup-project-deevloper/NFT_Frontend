import React, { useRef, useEffect, useState, useContext } from "react";

import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import DigitalArtContext, { initialDigitalArtFilters } from "shared/contexts/DigitalArtContext";
import Box from "shared/ui-kit/Box";
import { CircularLoadingIndicator, PrimaryButton } from "shared/ui-kit";
import { COLUMNS_COUNT_BREAK_POINTS_FOUR } from "../ExplorePage";
import DigitalArtCard from "./components/DigitalArtCard";
import { subPageStyles } from "../index.styles";
import { getMarketplaceMedias } from "shared/services/API";
import SellNFTPage from "./components/SellNFTPage";
import NFTAuctionPage from "./components/NFTAuctionPage";

const isProd = process.env.REACT_APP_ENV === "prod";

export default function MarketplacePage() {
  const classes = subPageStyles();
  const { filters, setFilters, setOpenFilters } = useContext(DigitalArtContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const hasMoreRef = useRef<boolean>(true);

  const [openSellNFTPage, setOpenSellNFTPage] = useState<boolean>(false);
  const [openStartAuctionPage, setOpenStartAuctionPage] = useState<boolean>(false);

  useEffect(() => {
    setOpenFilters(false);
    setFilters(initialDigitalArtFilters);
  }, []);

  useEffect(() => {
    loadData();
  }, [filters.Status]);

  const loadData = async () => {
    setIsLoading(true);

    const response = await getMarketplaceMedias({
      type: "PIX",
      mode: isProd ? "main" : "test",
    });
    if (response.success) {
      setFilteredData(response.data);
    }
    setIsLoading(false);
  };

  const loadMore = () => {
    // setIsLoading(true);
    // getMarketplaceMedias(user.id, filters.Status, lastIdRef.current).then(resp => {
    //   setIsLoading(false);
    //   if (resp?.success) {
    //     const data = resp.data;
    //     const medias = data.data;
    //     setFilteredData([...filteredData, ...medias]);
    //     hasMoreRef.current = data.hasMore;
    //     lastIdRef.current = medias.length ? medias[medias.length - 1].MediaSymbol : "";
    //   } else {
    //     hasMoreRef.current = false;
    //     lastIdRef.current = "";
    //   }
    // });
  };

  const handleScroll = React.useCallback(
    async e => {
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 42) {
        if (hasMoreRef.current) loadMore();
      }
    },
    [hasMoreRef, filters?.Status]
  );

  return (
    <>
      {openSellNFTPage && (
        <SellNFTPage
          goBack={() => {
            setOpenSellNFTPage(false);
            loadData();
          }}
        />
      )}
      {openStartAuctionPage && (
        <NFTAuctionPage
          goBack={() => {
            setOpenStartAuctionPage(false);
            loadData();
          }}
        />
      )}

      {!openSellNFTPage && !openStartAuctionPage && (
        <div className={classes.page} onScroll={handleScroll}>
          <div className={classes.content}>
            <div className={classes.headerTitle}>
              <Box display="flex" alignItems="center">
                ✨ Marketplace
              </Box>
              <Box className={classes.marketButtonBox}>
                <PrimaryButton
                  size="small"
                  className={classes.nftActionButton}
                  onClick={() => setOpenSellNFTPage(true)}
                >
                  Sell NFT
                </PrimaryButton>
                <PrimaryButton
                  size="small"
                  className={classes.nftActionButton}
                  onClick={() => setOpenStartAuctionPage(true)}
                >
                  Start Auction
                </PrimaryButton>
              </Box>
            </div>
            <div className={classes.artCards}>
              {isLoading ? (
                <div
                  style={{
                    width: "100%",
                    height: "calc(100vh - 200px)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: 16,
                    paddingBottom: 16,
                  }}
                >
                  <CircularLoadingIndicator theme="blue" />
                </div>
              ) : filteredData && filteredData.length > 0 ? (
                <MasonryGrid
                  gutter={"24px"}
                  data={filteredData}
                  renderItem={(item, index) => (
                    <DigitalArtCard heightFixed={false} item={item} key={`item-${index}`} />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                />
              ) : (
                <Box display="flex" justifyContent="center" mt={5}>
                  No Data
                </Box>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
