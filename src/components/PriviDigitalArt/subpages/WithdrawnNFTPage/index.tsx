import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import styled from "styled-components";
import InfiniteScroll from "react-infinite-scroll-component";

import Box from "shared/ui-kit/Box";
import { CircularLoadingIndicator } from "shared/ui-kit";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import MyNFTCard from "components/PriviDigitalArt/components/Cards/MyNFTCard";
import { getWithdrawnNFTs } from "shared/services/API/SyntheticFractionalizeAPI";
import { withdrawnNFTPageStyles } from "./index.styles";
import {MasonryGrid} from "shared/ui-kit/MasonryGrid/MasonryGrid";

const LoadingIndicatorWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 20px;
`;

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  400: 1,
  750: 2,
  1100: 3,
  1420: 4,
};

const WithdrawnNFTs = () => {
  const classes = withdrawnNFTPageStyles();
  const [nfts, setNFTs] = useState<any[]>([]);
  const history = useHistory();
  const { collectionId }: { collectionId: string } = useParams();

  const [loading, setLoading] = useState<boolean>(false);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState<boolean>(false);
  const [lastId, setLastId] = useState<any>();
  const [hasMoreNFTs, setHasMoreNFTs] = useState<boolean>(true);

  useEffect(() => {
    try {
      setLoading(true);
      getWithdrawnNFTs({ collectionId, lastId: undefined })
        .then(res => {
          if (res.success) {
            setNFTs(res.data);
            setHasMoreNFTs(res.hasMore);
            setLastId(res.lastId);
          }
          setLoading(false);
        })
        .catch(console.log);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }, []);

  const loadMoreNfts = (isInit = false) => {
    setIsLoadingNFTs(true);
    getWithdrawnNFTs({ collectionId, lastId: isInit ? undefined : lastId})
      .then(resp => {
        if (resp?.success) {
          if (isInit) {
            setNFTs(resp.data);
          } else {
            setNFTs(prev => [...prev, ...resp.data]);
          }
          setLastId(resp.lastId);
          setHasMoreNFTs(resp.hasMore);
        } else setNFTs([]);
      })
      .catch(_ => setNFTs([]))
      .finally(() => setIsLoadingNFTs(false));
  };
  
  return (
    <>
      <div className={classes.content}>
        <BackButton
          purple
          overrideFunction={() => {
            history.push("/fractionalise/");
          }}
        />
        <div className={classes.title}>Withdrawn NFTs</div>

        <div style={{ zIndex: 1, width: "100%", height: "100%" }}>
          <InfiniteScroll
            hasChildren={nfts.length > 0}
            dataLength={nfts.length}
            scrollableTarget={"scrollContainer"}
            next={loadMoreNfts}
            hasMore={hasMoreNFTs}
            loader={
              isLoadingNFTs && (
                <LoadingIndicatorWrapper>
                  <CircularLoadingIndicator />
                </LoadingIndicatorWrapper>
              )
            }
          >
            <Box mt={4}>
              {nfts.length > 0
                ? <MasonryGrid
                    gutter={"16px"}
                    data={nfts}
                    renderItem={(item, index) => (
                      <MyNFTCard
                        key={index}
                        item={item}
                      />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
                  />
                : !isLoadingNFTs && (
                    <Box className={classes.emptyBox}>
                      {/* <Box>😞</Box> */}
                      <img src={require("assets/pixImages/not_found_wallet.png")} />
                      <Box className={classes.detailsLabel} mt={1}>
                        Not Withdrawn NFT found.
                      </Box>
                    </Box>
                  )}
            </Box>
          </InfiniteScroll>
        </div>
      </div>
    </>
  );
};

export default WithdrawnNFTs;
