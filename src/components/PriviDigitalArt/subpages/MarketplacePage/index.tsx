import React, { useRef, useEffect, useState, useContext } from "react";

import { useTypedSelector } from "store/reducers/Reducer";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import DigitalArtContext, { initialDigitalArtFilters } from "shared/contexts/DigitalArtContext";
import Box from "shared/ui-kit/Box";
import { CircularLoadingIndicator, PrimaryButton } from "shared/ui-kit";
import { NFTModal } from "components/PriviDigitalArt/modals/NFTModal";
import { COLUMNS_COUNT_BREAK_POINTS_FOUR } from "../ExplorePage";
import DigitalArtCard from "../../components/Cards/DigitalArtCard";
import { subPageStyles } from "../index.styles";
import { getMarketplaceMedias } from "shared/services/API"

export default function MarketplacePage() {
  const classes = subPageStyles();
  const { filters, setFilters, setOpenFilters } = useContext(DigitalArtContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [isOpenSellNFTModal, setIsOpenSellNFTModal] = useState<boolean>(false);
  const [isOpenStartAuctionModal, setIsOpenStartAuctionModal] = useState<boolean>(false);
  const user = useTypedSelector(state => state.user);

  const lastIdRef = useRef<string>("");
  const hasMoreRef = useRef<boolean>(true);

  useEffect(() => {
    setOpenFilters(false);
    setFilters(initialDigitalArtFilters);
  }, []);

  useEffect(() => {
    initialLoad();
  }, [filters.Status])

  const initialLoad = () => {
    setIsLoading(true);
    getMarketplaceMedias(user.id, filters.Status, "").then(resp => {
      setIsLoading(false);
      if (resp?.success) {
        const data = resp.data;
        const medias = data.data;
        setFilteredData([...medias]);
        hasMoreRef.current = data.hasMore;
        lastIdRef.current = medias.length? medias[medias.length-1].MediaSymbol : "";
      } else {
        setFilteredData([]);
        hasMoreRef.current = false;
        lastIdRef.current = "";
      }
    })
  }

  const loadMore = () => {
    setIsLoading(true);
    getMarketplaceMedias(user.id, filters.Status, lastIdRef.current).then(resp => {
      setIsLoading(false);
      if (resp?.success) {
        const data = resp.data;
        const medias = data.data;
        setFilteredData([...filteredData, ...medias]);
        hasMoreRef.current = data.hasMore;
        lastIdRef.current = medias.length? medias[medias.length-1].MediaSymbol : "";
      } else {
        hasMoreRef.current = false;
        lastIdRef.current = "";
      }
    })
  }

  const reload = () => {
    setIsLoading(true);
    setFilteredData([]);
    hasMoreRef.current = true;
    lastIdRef.current = "";
    setTimeout(() => {
      initialLoad();
    }, 1000);
  }

  const handleOpenSellNFTModal = () => {
    setIsOpenSellNFTModal(true);
    setIsOpenStartAuctionModal(false);
  };

  const handleOpenStartAuctionModal = () => {
    setIsOpenSellNFTModal(false);
    setIsOpenStartAuctionModal(true);
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
    <div className={classes.page} onScroll={handleScroll}>
      <div className={classes.content}>
        <div className={classes.headerTitle}>
          <Box display="flex" alignItems="center">
            ✨ Marketplace
            {/* <Box
              onClick={() => {
                setOpenFilters(true);
              }}
              display="flex"
              alignItems="center"
              justifyContent="center"
              ml={2}
              mb={0.5}
              p={1}
              style={{ cursor: "pointer", borderRadius: "50%", width: "38px" }}
            >
              <img src={require("assets/icons/filters.svg")} alt="filters" title="Filters" />
            </Box> */}
          </Box>
          <Box className={classes.marketButtonBox}>
            <PrimaryButton size="small" className={classes.nftActionButton} onClick={handleOpenSellNFTModal}>
              Sell NFT
            </PrimaryButton>
            <PrimaryButton
              size="small"
              className={classes.nftActionButton}
              onClick={handleOpenStartAuctionModal}
            >
              Start Auction
            </PrimaryButton>
          </Box>
        </div>
        <div className={classes.artCards}>
          <MasonryGrid
            gutter={"24px"}
            data={filteredData}
            renderItem={(item, index) => (
              <DigitalArtCard heightFixed={false} item={item} key={`item-${index}`} />
            )}
            columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
          />
          {isLoading && (
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
          )}
        </div>
      </div>
      {isOpenSellNFTModal && (
        <NFTModal
          open={isOpenSellNFTModal}
          onClose={() => setIsOpenSellNFTModal(false)}
          type="sell-nft"
          reload={reload}
        />
      )}
      {isOpenStartAuctionModal && (
        <NFTModal
          open={isOpenStartAuctionModal}
          onClose={() => {
            setIsOpenStartAuctionModal(false);
          }}
          type="start-auction"
          reload={reload}
        />
      )}
    </div>
  );
}
