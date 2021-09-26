import React, { useState, useEffect, useMemo } from "react";
import cls from "classnames";
import { useHistory, useParams } from "react-router-dom";
import Web3 from "web3";

import { Grid } from "@material-ui/core";

import { CircularLoadingIndicator } from "shared/ui-kit";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { fractionalisedCollectionStyles, EthIcon, ShareIcon, PlusIcon } from "./index.styles";
import CollectionNFTCard from "../../../../components/Cards/CollectionNFTCard";
import AuctionCard from "../../../../components/Cards/AuctionCard";
import SyntheticFractionalisedJotPoolsPage from "../SyntheticFractionalisedJotPoolsPage";
import SyntheticFractionalisedTradeJotPage from "../SyntheticFractionalisedTradeJotPage";
import { getSyntheticCollection } from "shared/services/API/SyntheticFractionalizeAPI";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork, addJotAddress } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import JOT from "shared/services/API/web3/contracts/ERC20Tokens/JOT";

const NFTList = [
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    isVerified: true,
    owner: 80,
    available: 10,
    price: 1,
    isLive: false,
    started_at: null,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    isVerified: true,
    owner: 80,
    available: 10,
    price: 1,
    isLive: false,
    started_at: null,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    isVerified: true,
    owner: 80,
    available: 10,
    price: 1,
    isLive: false,
    started_at: null,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    isVerified: true,
    owner: 80,
    available: 10,
    price: 1,
    isLive: true,
    started_at: 1631747005555,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    isVerified: true,
    owner: 80,
    available: 10,
    price: 1,
    isLive: true,
    started_at: 1631747005555,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    isVerified: true,
    owner: 80,
    available: 10,
    price: 1,
    isLive: true,
    started_at: 1631747005555,
  },
];

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

const SyntheticFractionalisedCollectionPage = ({ goBack, match }) => {
  const classes = fractionalisedCollectionStyles();
  const history = useHistory();
  const params: { id?: string } = useParams();
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  const [selectedTab, setSelectedTab] = useState<"nft" | "jots_pool" | "trade_jots" | "auctions">("nft");

  const [collection, setCollection] = useState<any>({});
  const [selectedChain, setSelectedChain] = React.useState<any>(filteredBlockchainNets[0]);

  useEffect(() => {
    if (!params.id) return;

    (async () => {
      const response = await getSyntheticCollection(params.id);
      if (response.success) {
        setCollection(response.data);
      }
    })();
  }, [params.id]);

  useEffect(() => {
    if (selectedChain && chainId && selectedChain.chainId !== chainId) {
      (async () => {
        const changed = await switchNetwork(selectedChain.chainId);
        if (!changed) {
          setSelectedChain(filteredBlockchainNets.find(b => b.chainId === chainId));
        }
      })();
    }
  }, [chainId, selectedChain]);

  const handleAddToMetamask = async () => {
    const targetChain = BlockchainNets[1];
    const web3 = new Web3(library.provider);
    const web3APIHandler = targetChain.apiHandler;

    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
        return;
      }
    }

    const { JotAddress, JotSymbol } = collection;

    const decimals = await web3APIHandler.Erc20["JOT"].decimals(web3, JotAddress);

    await addJotAddress({
      address: JotAddress,
      symbol: JotSymbol,
      decimals,
    });
  };

  /// Circulating Supply = Locked NFTs * 10000
  const circulatingSupply = useMemo(() => {
    const lockedCount = collection.SyntheticNFT?.filter(nft => nft.isLocked).length || 0;
    if (lockedCount >= 100) return `$${lockedCount / 100}M`;
    return `$${lockedCount * 10}K`;
  }, [collection]);

  return (
    <div className={classes.root}>
      <div className={classes.collectionInfoSection}>
        <Box display="flex" justifyContent="space-between" className={classes.backButtonContainer}>
          <BackButton
            purple
            overrideFunction={() => history.push("/pix/fractionalise/synthetic-derivative")}
          />
          <Box display="flex">
            <div className={classes.tradeDerivativeButton} onClick={() => {}}>
              <div>
                <span>TRADE DERIVATIVES</span>
              </div>
            </div>
            <Box
              onClick={handleAddToMetamask}
              className={classes.metaMaskBtn}
              display="flex"
              alignItems="center"
              marginLeft={1}
            >
              <img
                src={require("assets/walletImages/metamask.svg")}
                alt=""
                style={{ marginRight: "8px", height: "24px", width: "24px" }}
              />
              Add to Metamask
            </Box>
          </Box>
        </Box>
        <div className={classes.collectionMainContent}>
          <img
            src={collection.imageUrl ?? require("assets/backgrounds/digital_art_1.png")}
            alt="collction image"
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            gridColumnGap="20px"
            flexWrap="wrap"
            gridRowGap="30px"
          >
            <div className={classes.typo1}>✨ Collection</div>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box display="flex" mr={"10px"}>
                <EthIcon />
              </Box>
              <div className={classes.typo2}>Ethereum</div>
              <div className={classes.shareSection}>
                <ShareIcon />
              </div>
              <div className={classes.plusSection}>
                <PlusIcon />
              </div>
              <div className={classes.typo2}>Follow</div>
            </Box>
          </Box>
          <div className={classes.mainTitleSection}>
            <span>{collection.collectionName}</span>
          </div>
          <Box className={classes.collectionInfos}>
            <Box display="flex" flexDirection="column">
              <div className={classes.typo3}>1.827 ETH</div>
              <div className={classes.typo4}>fraction Price</div>
            </Box>
            <Box display="flex" flexDirection="column">
              <div className={classes.typo3}>
                {collection.SyntheticNFT?.filter(nft => nft.isLocked).length}
              </div>
              <div className={classes.typo4}>locked NFTs in</div>
            </Box>
            <Box display="flex" flexDirection="column">
              <div className={classes.typo3}>$12 456.54</div>
              <div className={classes.typo4}>ACRRUED REWARD</div>
            </Box>
            <Box display="flex" flexDirection="column">
              <div className={classes.typo3}>{circulatingSupply}</div>
              <div className={classes.typo4}>Circulating Supply</div>
            </Box>
          </Box>
        </div>
      </div>
      <div className={classes.nftSection}>
        <Box width="100%" mb={4} style={{ overflowX: "auto" }}>
          <div className={classes.nftTabSection}>
            <div
              className={cls({ [classes.selectedTabSection]: selectedTab === "nft" }, classes.tabSection)}
              onClick={() => setSelectedTab("nft")}
            >
              <span>NFTS IN COLLECTION</span>
            </div>
            <div
              className={cls(
                { [classes.selectedTabSection]: selectedTab === "jots_pool" },
                classes.tabSection
              )}
              onClick={() => setSelectedTab("jots_pool")}
            >
              <span>JOTS POOL</span>
            </div>
            <div
              className={cls(
                { [classes.selectedTabSection]: selectedTab === "trade_jots" },
                classes.tabSection
              )}
              onClick={() => setSelectedTab("trade_jots")}
            >
              <span>TRADE JOTS</span>
            </div>
            <div
              className={cls(
                { [classes.selectedTabSection]: selectedTab === "auctions" },
                classes.tabSection
              )}
              onClick={() => setSelectedTab("auctions")}
            >
              <span>AUCTIONS</span>
            </div>
          </div>
        </Box>
        {selectedTab === "nft" ? (
          <div className={classes.allNFTSection}>
            {collection.SyntheticNFT && collection.SyntheticNFT.length ? (
              <Grid container spacing={2}>
                {collection.SyntheticNFT.map((item, idx) => (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <CollectionNFTCard
                      item={item}
                      handleSelect={() => {
                        history.push(
                          `/pix/fractionalisation/collection/${params.id}/nft/${item.SyntheticID}`
                        );
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
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
        ) : selectedTab === "jots_pool" ? (
          <div className={classes.jotPoolSection}>
            <SyntheticFractionalisedJotPoolsPage
              collection={{
                ...collection,
                collectionAddress: params.id,
              }}
            />
          </div>
        ) : selectedTab === "auctions" ? (
          <div className={classes.allNFTSection}>
            {NFTList && NFTList.length ? (
              <Grid container spacing={2}>
                {NFTList.map((item, idx) => (
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <AuctionCard
                      auction={item}
                      onClick={() => {
                        history.push(`/pix/fractionalisation/collection/${match.params.id}/nft/:nftId/1`);
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            ) : (
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
        ) : (
          <div>
            <SyntheticFractionalisedTradeJotPage />
          </div>
        )}
      </div>
    </div>
  );
};

export default SyntheticFractionalisedCollectionPage;
