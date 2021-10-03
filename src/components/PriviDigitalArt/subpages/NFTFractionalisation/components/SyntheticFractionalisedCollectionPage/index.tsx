import React, { useState, useEffect, useMemo, useRef } from "react";
import cls from "classnames";
import { useHistory, useParams } from "react-router-dom";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";
import axios from "axios";

import { Grid, useMediaQuery } from "@material-ui/core";

import { RootState } from "store/reducers/Reducer";
import { CircularLoadingIndicator } from "shared/ui-kit";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import CollectionNFTCard from "../../../../components/Cards/CollectionNFTCard";
import AuctionCard from "../../../../components/Cards/AuctionCard";
import SyntheticFractionalisedJotPoolsPage from "../SyntheticFractionalisedJotPoolsPage";
import SyntheticFractionalisedTradeJotPage from "../SyntheticFractionalisedTradeJotPage";
import { getSyntheticCollection } from "shared/services/API/SyntheticFractionalizeAPI";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork, addJotAddress } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import {
  fractionalisedCollectionStyles,
  EthIcon,
  ShareIcon,
  PlusIcon,
  MetamaskPlusIcon,
} from "./index.styles";
import { SharePopup } from "shared/ui-kit/SharePopup";
import URL from "shared/functions/getURL";
import OrderBookModal from "../../modals/OrderBookModal";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import TransactionResultModal from "components/PriviDigitalArt/modals/TransactionResultModal";

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

const SyntheticFractionalisedCollectionPage = ({ goBack, match }) => {
  const classes = fractionalisedCollectionStyles();
  const history = useHistory();
  const params: { id?: string } = useParams();
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const userSelector = useSelector((state: RootState) => state.user);

  const [selectedTab, setSelectedTab] = useState<"nft" | "jots_pool" | "trade_jots" | "auctions">("nft");

  const [collection, setCollection] = useState<any>({});
  const [syntheticNFTs, setSyntheticNFTs] = useState<any>([]);
  const lastIdRef = useRef<string>("");
  const hasMoreRef = useRef<boolean>(true);

  const [openShareMenu, setOpenShareMenu] = React.useState(false);
  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery("(max-width:599px)");

  const [loadingNFTs, setLoadingNFTs] = useState<boolean>(false);
  const [showOrderBookModal, setShowOrderBookModal] = useState<boolean>(false);

  const [loading, setLoading] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<number>(0);
  const [hash, setHash] = useState<string>("");

  useEffect(() => {
    if (!params.id) return;

    (async () => {
      try {
        const response = await getSyntheticCollection(params.id);
        if (response.success) {
          setCollection(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    })();
    loadNFTs(params.id);
  }, [params.id]);

  const loadNFTs = id => {
    if (!id) return;
    setLoadingNFTs(true);

    const config = {
      lastId: lastIdRef.current,
    };

    axios
      .post(`${URL()}/syntheticFractionalize/getSyntheticCollectionNFTs/${id}`, config)
      .then(res => {
        const data = res.data;
        if (data.success) {
          const newNFTs = data.data;
          const newData = [...newNFTs];
          setSyntheticNFTs(newData);
          lastIdRef.current = data.lastId;
          hasMoreRef.current = data.hasMore;
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingNFTs(false);
      });
  };

  const loadMore = (id, syntheticNFTs) => {
    if (!hasMoreRef.current || !id) return;
    setLoadingNFTs(true);

    const config = {
      lastId: lastIdRef.current,
    };

    axios
      .post(`${URL()}/syntheticFractionalize/getSyntheticCollectionNFTs/${id}`, config)
      .then(res => {
        const data = res.data;
        if (data.success) {
          const newNFTs = data.data;
          const newData = [...syntheticNFTs, ...newNFTs];
          setSyntheticNFTs(newData);
          lastIdRef.current = data.lastId;
          hasMoreRef.current = data.hasMore;
        }
      })
      .catch(err => console.log(err))
      .finally(() => {
        setLoadingNFTs(false);
      });
  };

  const handleScroll = React.useCallback(
    async e => {
      if (e.target.scrollTop + e.target.clientHeight >= e.target.scrollHeight - 42) {
        if (hasMoreRef.current) loadMore(params.id, syntheticNFTs);
      }
    },
    [hasMoreRef.current, syntheticNFTs]
  );

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

  const handleOpenShareMenu = () => {
    setOpenShareMenu(!openShareMenu);
  };

  const handleCloseShareMenu = () => {
    setOpenShareMenu(false);
  };

  /// Circulating Supply = Locked NFTs * 10000
  const circulatingSupply = useMemo(() => {
    const lockedCount = syntheticNFTs?.filter(nft => nft.isLocked).length || 0;
    if (lockedCount >= 100) return `$${lockedCount / 100}M`;
    return `$${lockedCount * 10}K`;
  }, [syntheticNFTs]);

  const handleFollow = () => {
    const body = {
      userId: userSelector.id,
      collectionId: params.id,
    };

    axios.post(`${URL()}/syntheticFractionalize/followSyntheticCollection`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = {
          ...collection,
          follows: [...resp.follows],
        };
        setCollection(itemCopy);
      }
    });
  };

  const handleUnfollow = () => {
    const body = {
      userId: userSelector.id,
      collectionId: params.id,
    };

    axios.post(`${URL()}/syntheticFractionalize/unfollowSyntheticCollection`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = {
          ...collection,
          follows: [...resp.follows],
        };
        setCollection(itemCopy);
      }
    });
  };

  const handleOrderBook = () => {
    setShowOrderBookModal(true);
  };

  const hideOrderBookModal = () => {
    setShowOrderBookModal(false);
  };

  const handleStartAuction = async nft => {
    setLoading(true);
    try {
      const targetChain = BlockchainNets[1];

      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
          return;
        }
      }
      const web3APIHandler = targetChain.apiHandler;
      const web3Config = targetChain.config;
      const web3 = new Web3(library.provider);

      const contractResponse = await web3APIHandler.SyntheticFractionalisationAuctionsManager.startAuction(
        web3,
        account!,
        collection,
        {
          tokenId: +nft.SyntheticID,
          price: +nft.Price,
          setHash: setHash,
        }
      );

      if (contractResponse.success) {
        setHash(contractResponse.data.hash);
        setResult(1);
        setLoading(false);

        history.push(`/pix/fractionalisation/collection/${params.id}/nft/${nft.SyntheticID}`);
      } else {
        setLoading(false);
        setResult(-1);
        showAlertMessage("Failed to start auction", { variant: "error" });
        return;
      }
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <div className={classes.root} onScroll={handleScroll}>
      <div className={classes.collectionInfoSection}>
        <Box display="flex" justifyContent="space-between" className={classes.backButtonContainer}>
          <BackButton
            purple
            overrideFunction={() => history.push("/pix/fractionalise/synthetic-derivative")}
          />
          <Box display="flex" className={classes.buttonWrapper}>
            <Box
              onClick={handleOrderBook}
              className={classes.orderBookBtn}
              display="flex"
              alignItems="center"
            >
              <img
                src={require("assets/icons/order-book.svg")}
                alt=""
                style={{ marginRight: "8px", height: "24px", width: "24px" }}
              />
              Order Book
            </Box>
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
              justifyContent={isMobile ? "center" : "flex-start"}
              marginLeft={1}
            >
              {!isMobile && <MetamaskPlusIcon />}
              <img
                src={require("assets/walletImages/metamask.svg")}
                alt=""
                style={{ marginRight: isMobile ? "8px" : "0", height: "24px", width: "24px" }}
              />
              {isMobile && "Add to Metamask"}
            </Box>
          </Box>
        </Box>
        <div className={classes.collectionMainContent}>
          <img
            src={collection?.imageUrl ?? require("assets/backgrounds/digital_art_1.png")}
            alt="collction image"
          />
          <Box
            display="flex"
            flexDirection={isMobile ? "column" : "row"}
            alignItems={isMobile ? "flex-start" : "center"}
            justifyContent="space-between"
            gridColumnGap="20px"
            flexWrap="wrap"
            gridRowGap="30px"
          >
            {isMobile && (
              <Box
                className={classes.mobileEthContainer}
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Box display="flex" mr={"10px"}>
                  <EthIcon />
                </Box>
                <div className={classes.typo2}>Ethereum</div>
                <div className={classes.shareSection} onClick={handleOpenShareMenu} ref={anchorShareMenuRef}>
                  <ShareIcon />
                </div>
                <div>
                  {collection &&
                  collection.follows &&
                  collection.follows.filter(item => item.userId === userSelector.id).length > 0 ? (
                    <div className={classes.typo2}>Following</div>
                  ) : (
                    <div className={classes.plusSection} onClick={handleFollow}>
                      <div className={classes.plusIcon}>
                        <PlusIcon />
                      </div>
                      <div style={{ marginTop: 4 }} className={classes.typo2}>
                        Follow
                      </div>
                    </div>
                  )}
                </div>
              </Box>
            )}
            <div className={classes.typo1}>✨ Collection</div>
            {!isMobile && (
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" mr={"10px"}>
                  <EthIcon />
                </Box>
                <div className={classes.typo2}>Ethereum</div>
                <div className={classes.shareSection} onClick={handleOpenShareMenu} ref={anchorShareMenuRef}>
                  <ShareIcon />
                </div>
                <div>
                  {collection &&
                  collection.follows &&
                  collection.follows.filter(item => item.userId === userSelector.id).length > 0 ? (
                    <div className={classes.typo2} style={{ cursor: "pointer" }} onClick={handleUnfollow}>
                      Following
                    </div>
                  ) : (
                    <div onClick={handleFollow} className={classes.plusSection}>
                      <div className={classes.plusIcon}>
                        <PlusIcon />
                      </div>
                      <div style={{ marginTop: 2 }} className={classes.typo2}>
                        Follow
                      </div>
                    </div>
                  )}
                </div>
              </Box>
            )}
          </Box>
          <SharePopup
            item={{ ...collection, Type: "SYNTHETIC_COLLECTION", CollectionId: params.id }}
            openMenu={openShareMenu}
            anchorRef={anchorShareMenuRef}
            handleCloseMenu={handleCloseShareMenu}
          />
          <div className={classes.mainTitleSection}>
            <span>{collection?.collectionName}</span>
          </div>
          <Box className={classes.collectionInfos}>
            <Box display="flex" flexDirection="column">
              <div className={classes.typo3}>1.827 ETH</div>
              <div className={classes.typo4}>fraction Price</div>
            </Box>
            <Box display="flex" flexDirection="column">
              <div className={classes.typo3}>{syntheticNFTs?.filter(nft => nft.isLocked).length}</div>
              <div className={classes.typo4}>locked NFTs in</div>
            </Box>
            <Box display="flex" flexDirection="column">
              <div className={classes.typo3}>${collection.CumulativeRevenue ?? 0}</div>
              <div className={classes.typo4}>ACCRUED REWARD</div>
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
            <Grid container spacing={2}>
              {syntheticNFTs.map((item, idx) => (
                <Grid item xs={6} sm={4} md={4} lg={3}>
                  <CollectionNFTCard
                    item={item}
                    handleSelect={() => {
                      history.push(`/pix/fractionalisation/collection/${params.id}/nft/${item.SyntheticID}`);
                    }}
                  />
                </Grid>
              ))}
            </Grid>
            {hasMoreRef.current && (
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
            {syntheticNFTs && syntheticNFTs.length ? (
              <Grid container spacing={2}>
                {syntheticNFTs.map((item, idx) => (
                  <Grid item xs={6} sm={4} md={4} lg={3}>
                    <AuctionCard auction={item} onClick={() => handleStartAuction(item)} />
                  </Grid>
                ))}
              </Grid>
            ) : syntheticNFTs && syntheticNFTs.length === 0 ? (
              <Box className={classes.noAuction}>
                <img src={require("assets/icons/no_auctions.png")} />
                <span>No active auctions right now.</span>
              </Box>
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
            <SyntheticFractionalisedTradeJotPage collection={collection} />
          </div>
        )}
      </div>
      {showOrderBookModal && <OrderBookModal open={showOrderBookModal} onClose={hideOrderBookModal} />}
      <LoadingScreen
        loading={loading}
        title={`Transaction \nin progress`}
        subTitle={`Transaction is proceeding on ${BlockchainNets[1].value}.\nThis can take a moment, please be patient...`}
        handleClose={() => setLoading(false)}
      />
      <TransactionResultModal
        open={result !== 0}
        onClose={() => setResult(0)}
        isSuccess={result === 1}
        hash={hash}
      />
    </div>
  );
};

export default SyntheticFractionalisedCollectionPage;
