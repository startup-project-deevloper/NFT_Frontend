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
            <span>Synthetic NFT Owned</span>
          </div>
          <div
            className={cls({ [classes.selectedTabSection]: selectedTab === "synthetic" }, classes.tabSection)}
            onClick={() => setSelectedTab("synthetic")}
          >
            <span>Synthetic NFT proposal</span>
          </div>
          <div
            className={cls({ [classes.selectedTabSection]: selectedTab === "withdraw" }, classes.tabSection)}
            onClick={() => setSelectedTab("withdraw")}
          >
            <span>NFT withdrawals</span>
          </div>
        </div>
        <div className={classes.cardsGroup}>
          {selectedTab === "owned" && (
            <LoadingWrapper theme={"blue"} loading={loading}>
              <div className={classes.cardsGrid}>
                {myNFTs
                  .filter(nft => nft.isVerified)
                  .map((item, index) => (
                    <MyNFTCard key={index} item={item} />
                  ))}
              </div>
            </LoadingWrapper>
          )}
          {selectedTab === "synthetic" && (
            <Box display="flex" flexDirection="column" gridRowGap={50}>
              <Box className={classes.syntheticContent} display="flex" flexDirection="column" gridRowGap={18}>
                <Box className={classes.sectionTitle} color="#431AB7">
                  NFT To Lock
                </Box>
                <LoadingWrapper theme={"blue"} loading={loading}>
                  <div className={classes.cardsGrid}>
                    {myNFTs
                      .filter(nft => !nft.isLocked)
                      .map((item, index) => (
                        <MyNFTCard key={index} item={item} onLockCompleted={() => onMyNFTLocked(item)} />
                      ))}
                  </div>
                </LoadingWrapper>
              </Box>
              <Box className={classes.syntheticContent} display="flex" flexDirection="column" gridRowGap={18}>
                <Box className={classes.sectionTitle} color="#F2604C">
                  NFT To Verify
                </Box>
                <LoadingWrapper theme={"blue"} loading={loading}>
                  <div className={classes.cardsGrid}>
                    {myNFTs
                      .filter(nft => nft.isLocked && !nft.isVerified)
                      .map((item, index) => (
                        <MyNFTCard key={index} item={item} onVerifyCompleted={() => onMyNFTVerified(item)} />
                      ))}
                  </div>
                </LoadingWrapper>
              </Box>
            </Box>
          )}
          {selectedTab === "withdraw" && (
            <Box display="flex" flexDirection="column" gridRowGap={50}>
              <Box className={classes.syntheticContent} display="flex" flexDirection="column" gridRowGap={18}>
                <Box className={classes.sectionTitle} color="#1DCC00">
                  NFT To Unlock
                </Box>
                <LoadingWrapper theme={"blue"} loading={loading}>
                  <div className={classes.cardsGrid}>
                    {myNFTs
                      .filter(nft => nft.isWithdrawn && !nft.isUnlocked)
                      .map((item, index) => (
                        <MyNFTCard key={index} item={item} onUnLockCompleted={() => onMyNFTUnlocked(item)} />
                      ))}
                  </div>
                </LoadingWrapper>
              </Box>
            </Box>
          )}
        </div>
      </div>
    </>
  );
};

export default MyNFT;
