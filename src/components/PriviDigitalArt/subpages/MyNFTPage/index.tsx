import React, { useState, useEffect } from "react";
import cls from "classnames";
import { useHistory } from "react-router-dom";

import { useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import MyNFTCard from "components/PriviDigitalArt/components/Cards/MyNFTCard";
import { getMySyntheticFractionalisedNFT } from "shared/services/API/SyntheticFractionalizeAPI";
import { myNFTStyles } from "./index.styles";
import { LoadingWrapper } from "shared/ui-kit/Hocs";

const MyNFT = () => {
  const classes = myNFTStyles();
  const [myNFTs, setMyNFTs] = useState<any[]>([]);
  const history = useHistory();

  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState<"owned" | "synthetic" | "withdraw">("synthetic");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    try {
      setLoading(true);
      getMySyntheticFractionalisedNFT()
        .then(res => {
          if (res.success) {
            setMyNFTs(
              res.nfts.map(nft => {
                return {
                  ...nft,
                  BlockchainId: nft.NftId,
                  tokenAddress: nft.collection_id,
                };
              }) ?? []
            );
          }
          setLoading(false);
        })
        .catch(console.log);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  }, []);

  const onMyNFTLocked = item => {
    const newNFTs: any[] = myNFTs.map(nft => {
      if (nft.collection_id !== item.collection_id || nft.NftId !== item.NftId) {
        return nft;
      }
      return {
        ...nft,
        isLocked: true,
      };
    });
    setMyNFTs(newNFTs);
  };

  const onMyNFTUnlocked = item => {
    const newNFTs: any[] = myNFTs.map(nft => {
      if (nft.collection_id !== item.collection_id || nft.NftId !== item.NftId) {
        return nft;
      }
      return {
        ...nft,
        isUnlocked: true,
      };
    });
    setMyNFTs(newNFTs);
  };

  const onMyNFTVerified = item => {
    const newNFTs: any[] = myNFTs.map(nft => {
      if (nft.collection_id !== item.collection_id || nft.NftId !== item.NftId) {
        return nft;
      }
      return {
        ...nft,
        isVerified: true,
      };
    });
    setMyNFTs(newNFTs);
  };

  const ownedNFTs = myNFTs.filter(nft => nft.isVerified && !nft.isWithdrawn)
  const toLockNFTs = myNFTs.filter(nft => !nft.isLocked)
  const toVerifyNFTs = myNFTs.filter(nft => nft.isLocked && !nft.isVerified)
  const toUnlockNFTs = myNFTs.filter(nft => nft.isWithdrawn && !nft.isUnlocked)

  const EmptySection = () => (
    <Box className={classes.emptyBox}>
      {/* <Box>😞</Box> */}
      <img src={require("assets/pixImages/not_found_wallet.png")} />
      <Box className={classes.detailsLabel} mt={1}>
        Not NFT found on your wallet.
      </Box>
    </Box>
  )

  return (
    <>
      <div className={classes.content}>
        <BackButton
          purple
          overrideFunction={() => {
            history.push("/fractionalise/");
          }}
        />
        <div className={classes.title}>Manage your NFT</div>
        <div className={classes.subTitleSection}>
          <div
            className={cls({ [classes.selectedTabSection]: selectedTab === "owned" }, classes.tabSection)}
            onClick={() => setSelectedTab("owned")}
          >
            <span>Owned NFT</span>
          </div>
          <div
            className={cls({ [classes.selectedTabSection]: selectedTab === "synthetic" }, classes.tabSection)}
            onClick={() => setSelectedTab("synthetic")}
          >
            <span>Synthetic NFT proposal</span>
          </div>
        </div>
        <div className={classes.cardsGroup}>
          {selectedTab === "owned" && (
            <LoadingWrapper theme={"blue"} loading={loading}>
              {
                !loading && !ownedNFTs.length ? (
                  <EmptySection />
                ) : (
                  <div className={classes.cardsGrid}>
                    {ownedNFTs
                      .map((item, index) => (
                        <MyNFTCard key={index} item={item} />
                    ))}
                  </div> 
                )
              }
            </LoadingWrapper>
          )}
          {selectedTab === "synthetic" && (
            <Box display="flex" flexDirection="column" gridRowGap={50}>
              {
                !loading && !toVerifyNFTs.length && !toLockNFTs.length && !toUnlockNFTs.length
                  ? <EmptySection />
                  : (
                    <>
                      {
                        (loading || !!toLockNFTs.length) && (
                          <Box className={classes.syntheticContent} display="flex" flexDirection="column" gridRowGap={18}>
                            <Box className={classes.sectionTitle} color="#431AB7">
                              NFT To Lock
                            </Box>
                            <LoadingWrapper theme={"blue"} loading={loading}>
                              <div className={classes.cardsGrid}>
                                {toLockNFTs
                                  .map((item, index) => (
                                    <MyNFTCard
                                      key={index}
                                      item={item}
                                      onLockCompleted={() => onMyNFTLocked(item)}
                                      onVerifyCompleted={() => onMyNFTVerified(item)}
                                    />
                                  ))}
                              </div>
                            </LoadingWrapper>
                          </Box>
                        )
                      }
                      {
                        (loading || !!toVerifyNFTs.length) && (
                          <Box className={classes.syntheticContent} display="flex" flexDirection="column" gridRowGap={18}>
                            <Box className={classes.sectionTitle} color="#F2604C">
                              NFT To Verify
                            </Box>
                            <LoadingWrapper theme={"blue"} loading={loading}>
                              <div className={classes.cardsGrid}>
                                {toVerifyNFTs
                                  .map((item, index) => (
                                    <MyNFTCard key={index} item={item} onVerifyCompleted={() => onMyNFTVerified(item)} />
                                  ))}
                              </div>
                            </LoadingWrapper>
                          </Box>
                        )
                      }
                      {
                        (loading || !!toUnlockNFTs.length) && (
                          <Box className={classes.syntheticContent} display="flex" flexDirection="column" gridRowGap={18}>
                            <Box className={classes.sectionTitle} color="#1DCC00">
                              NFT To Unlock
                            </Box>
                            <LoadingWrapper theme={"blue"} loading={loading}>
                              <div className={classes.cardsGrid}>
                                {toUnlockNFTs
                                  .map((item, index) => (
                                    <MyNFTCard key={index} item={item} onUnLockCompleted={() => onMyNFTUnlocked(item)} />
                                  ))}
                              </div>
                            </LoadingWrapper>
                          </Box>
                        )
                      }
                    </>
                  )
                }
            </Box>
          )}
        </div>
      </div>
    </>
  );
};

export default MyNFT;
