import React, { useState, useEffect } from "react";
import cls from "classnames";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import Axios from "axios";
import Moment from "react-moment";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, Avatar } from "shared/ui-kit";
import { CustomTable, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import SyntheticFractionalisedTradeFractionsPage from "../SyntheticFractionalisedTradeFractionsPage";
import CollectionNFTCard from "../../../../components/Cards/CollectionNFTCard";
import AuctionDetail from "./components/AuctionDetail";
import OfferList from "./components/OfferList";
import ChangeLockedNFT from "../../modals/ChangeLockedNFT";
import ChangeNFTToSynthetic from "../../components/ChangeNFTToSynthetic";
import WithdrawNFTModel from "../../modals/WithdrawNFTModal";
import { Modal } from "shared/ui-kit";
import { getSyntheticNFT } from "shared/services/API/SyntheticFractionalizeAPI";
import FlipCoinModal from "../../modals/FlipCoinModal";
import { RootState } from "store/reducers/Reducer";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { SharePopup } from "shared/ui-kit/SharePopup";
import URL from "shared/functions/getURL";
import { fractionalisedCollectionStyles, ShareIcon, PlusIcon } from "./index.styles";
import FlipCoinInputGuessModal from "../../modals/FlipCoinInputGuessModal";
import * as API from "shared/services/API/FractionalizeAPI";
const isProd = process.env.REACT_APP_ENV === "prod";

const SyntheticFractionalisedCollectionNFTPage = ({
  goBack,
  isFlipped = false,
  match,
  withDrawn = false,
}) => {
  const params: { collectionId?: string; nftId?: string } = useParams();

  const userSelector = useSelector((state: RootState) => state.user);
  const classes = fractionalisedCollectionStyles();

  const isAuction = match.params.auction === "1";
  // const isOwner = match.params.auction === "2";

  const [selectedTab, setSelectedTab] = useState<"flip_coin" | "trade_fraction" | "auction" | "ownership">(
    "flip_coin"
  );

  const [openChangeLockedNFTModal, setOpenChangeLockedNFTModal] = useState<boolean>(false);
  const [openChangeNFTToSynthetic, setOpenChangeNFTToSynthetic] = useState<boolean>(false);
  const [openWithdrawNFTModal, setOpenWithdrawNFTModal] = useState<boolean>(false);
  const [openFlipCoinModal, setOpenFlipCoinModal] = useState<boolean>(false);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipResult, setFlipResult] = useState<boolean>(false);
  const [flipGuess, setFlipGuess] = useState<number>(0);
  const [flippingHash, setFlippingHash] = useState<string>("");

  const [nft, setNft] = useState<any>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const [openShareMenu, setOpenShareMenu] = React.useState(false);
  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);
  const [loadingData, setLoadingData] = useState<boolean>(true);
  const [OpenFlipCoinGuessModal, setOpenFlipCoinGuessModal] = useState<boolean>(false);
  const [resultState, setResultState] = useState<number>(0);

  const usersList = useSelector((state: RootState) => state.usersInfoList);
  const getUserInfo = (address: string) => usersList.find(u => u.address === address);

  const isOwner = React.useMemo(
    () => nft && userSelector && (nft.OwnerAddress === userSelector.address || nft.user === userSelector.id),
    [nft, userSelector]
  );

  useEffect(() => {
    setSelectedTab(isOwner ? "ownership" : "flip_coin");
  }, [isOwner]);

  useEffect(() => {
    (async () => {
      setLoadingData(true);

      if (!params || !params.collectionId || !params.nftId) {
        return;
      }

      const response = await getSyntheticNFT(params.collectionId, params.nftId);
      if (response?.success) {
        setNft(response.data);
        setLoadingData(false);
      }
    })();
  }, [params]);

  const handleOpenChangeLockedNFTModal = () => {
    setOpenChangeLockedNFTModal(true);
  };

  const handleCloseChangeLockedNFTModal = () => {
    setOpenChangeLockedNFTModal(false);
  };

  const handleProceedChangeLockedNFT = () => {
    setOpenChangeLockedNFTModal(false);
    setOpenChangeNFTToSynthetic(true);
  };

  const handleOpenWithdrawNFTModal = () => {
    setOpenWithdrawNFTModal(true);
  };
  const handleCloseWithdrawNFTModal = () => {
    setOpenWithdrawNFTModal(false);
  };

  const handleSetFlipGuess = async value => {
    const targetChain = BlockchainNets[1];
    setFlipGuess(value);
    setOpenFlipCoinGuessModal(false);
    setOpenFlipCoinModal(true);
    setIsFlipping(true);
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
        return;
      }
    }

    try {
      const web3APIHandler = targetChain.apiHandler;
      const web3Config = targetChain.config;
      const web3 = new Web3(library.provider);

      const contractResponse = await web3APIHandler.SyntheticCollectionManager.flipJot(web3, account!, nft, {
        tokenId: +nft.SyntheticID,
        prediction: flipGuess,
        setFlippingHash: setFlippingHash,
      });

      if (!contractResponse) {
        setOpenFlipCoinModal(false);
        setIsFlipping(false);
        showAlertMessage(`Got failed while flipping the JOT`, { variant: "error" });
        return;
      }

      console.log("contractResponse... ", contractResponse);
      const { prediction, tokenId, randomResult, hash } = contractResponse;

      await API.addFlipHistory({
        collectionAddress: params.collectionId,
        syntheticID: nft.SyntheticID,
        winnerAddress: randomResult === "0" ? nft.JotPoolAddress : nft.user,
        prediction: prediction,
        randomResult,
        tokenId,
        guess: randomResult === prediction ? "correct" : "false",
        txn: hash,
        player: account,
        id: new Date().getTime().toString(),
      });
      const histories = [...nft.flipHistory];
      histories.concat({
        collectionAddress: params.collectionId,
        syntheticID: nft.SyntheticID,
        winnerAddress: randomResult === "0" ? nft.JotPoolAddress : nft.user,
        prediction: prediction,
        randomResult,
        tokenId,
        guess: randomResult === prediction ? "correct" : "false",
        txn: hash,
        player: account,
        id: new Date().getTime().toString(),
      });

      setNft({
        ...nft,
        flipHistory: histories,
      });

      setIsFlipping(false);
      setResultState(+randomResult);
      setFlipResult(prediction === randomResult);
    } catch (err) {
      console.log("error", err);
    }
  };

  const viewOnPolygonscan = () => {
    window.open(
      `https://${!isProd ? "mumbai." : ""}polygonscan.com/address/${nft.SyntheticNFTAddress}`,
      "_blank"
    );
  };

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "WINNER",
    },
    {
      headerName: "ADDRESS",
    },
    {
      headerName: "GUESS",
    },
    {
      headerName: "DATE",
      headerAlign: "center",
    },
    {
      headerName: "EXPLORER",
      headerAlign: "center",
    },
  ];
  const dummyAuction = {
    id: 4,
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    isLive: true,
    price: 100,
    started_at: 1631747005555,
  };

  if (openChangeNFTToSynthetic) {
    return (
      <div className={classes.root}>
        <ChangeNFTToSynthetic goBack={() => setOpenChangeNFTToSynthetic(false)} />
      </div>
    );
  }

  const handleGiveFruit = type => {
    const body = {
      userId: nft.priviUser.id,
      fruitId: type,
      collectionId: match.params.collectionId,
      syntheticId: match.params.nftId,
    };

    Axios.post(`${URL()}/syntheticFractionalize/fruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = {
          ...nft,
          fruits: [...resp.fruits],
        };
        setNft(itemCopy);
      }
    });
  };

  const handleOpenShareMenu = () => {
    setOpenShareMenu(!openShareMenu);
  };

  const handleCloseShareMenu = () => {
    setOpenShareMenu(false);
  };

  const handleFollow = () => {
    const body = {
      userId: userSelector.id,
      collectionId: match.params.collectionId,
      syntheticId: match.params.nftId,
    };

    Axios.post(`${URL()}/syntheticFractionalize/followSyntheticNft`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = {
          ...nft,
          follows: [...resp.follows],
        };
        setNft(itemCopy);
      }
    });
  };

  const handleUnfollow = () => {
    const body = {
      userId: userSelector.id,
      collectionId: match.params.collectionId,
      syntheticId: match.params.nftId,
    };

    Axios.post(`${URL()}/syntheticFractionalize/unfollowSyntheticNft`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = {
          ...nft,
          follows: [...resp.follows],
        };
        setNft(itemCopy);
      }
    });
  };

  return (
    <LoadingWrapper loading={loadingData}>
      <div className={classes.root}>
        <div className={classes.nftInfoSection}>
          <Box
            display="flex"
            justifyContent="space-between"
            flexWrap="wrap"
            gridColumnGap={24}
            gridRowGap={24}
            className={`${classes.header} ${classes.backButtonContainer}`}
          >
            <BackButton purple overrideFunction={goBack} />
            <Box display="flex" alignItems="center" className={classes.topButtonContainer}>
              {isOwner ? (
                <PrimaryButton
                  size="medium"
                  onClick={() => handleOpenWithdrawNFTModal()}
                  style={{
                    background: "#431AB7",
                    boxShadow: "0px 8px 20px -12px rgba(79, 95, 17, 0.54)",
                    color: "#fff",
                    padding: "0px 40px",
                  }}
                >
                  Withdraw NFT
                </PrimaryButton>
              ) : (
                <></>
              )}
              <PrimaryButton
                size="medium"
                onClick={() => handleOpenChangeLockedNFTModal()}
                style={{
                  background: "white",
                  border: "2px solid #431ab7",
                  color: "#431ab7",
                  padding: "0px 40px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                CHANGE LOCKED NFT
                <img src={require("assets/icons/change.png")} className={classes.btnIcon} />
              </PrimaryButton>
            </Box>
          </Box>
          <div className={classes.nftInfoMainContent}>
            <span>Verified</span>
            <div className={classes.mainTitleSection}>
              <span>
                {nft.collectionName} #{nft.NftId}
              </span>
              <span>{nft.collectionName}</span>
            </div>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              flexWrap="wrap"
              mt={"30px"}
              gridColumnGap="24px"
              gridRowGap="24px"
              width="100%"
              maxWidth="800px"
            >
              <Box display="flex" flexDirection="column">
                <div className={classes.typo1}>Ownership</div>
                <div className={classes.typo2}>{nft.OwnerSupply ?? 0} JOTs</div>
              </Box>
              <Box display="flex" flexDirection="column">
                <div className={classes.typo1}>Owner</div>
                <Box display="flex" alignItems="center">
                  <Avatar size="small" url={require(`assets/anonAvatars/ToyFaces_Colored_BG_001.jpg`)} />
                  <Box ml={1}>
                    <div className={classes.typo2}>
                      {(isOwner ? getUserInfo(nft.OwnerAddress)?.name : nft.OwnerAddress) ?? ""}
                    </div>
                  </Box>
                </Box>
              </Box>
              <PrimaryButton size="medium" className={classes.polygonscanBtn} onClick={viewOnPolygonscan}>
                <img src={require("assets/priviIcons/polygon.png")} />
                View on Polygonscan
              </PrimaryButton>
            </Box>
            <Box className={classes.socialIcons}>
              <div className={classes.shareSection} onClick={handleOpenShareMenu} ref={anchorShareMenuRef}>
                <ShareIcon />
              </div>
              <div className={classes.socialSection}>
                {!isOwner && <FruitSelect fruitObject={nft} onGiveFruit={handleGiveFruit} />}
              </div>
              {nft &&
              nft.follows &&
              nft.follows.filter(item => item.userId === userSelector.id).length > 0 ? (
                <div className={classes.plusSection} style={{ cursor: "pointer" }} onClick={handleUnfollow}>
                  <span>Following</span>
                </div>
              ) : (
                <div className={classes.plusSection} onClick={handleFollow}>
                  <PlusIcon />
                  <span>Follow</span>
                </div>
              )}
            </Box>
            <SharePopup
              item={{ ...nft, Type: "SYNTHETIC_FRACTIONALISATION", CollectionId: params.collectionId }}
              openMenu={openShareMenu}
              anchorRef={anchorShareMenuRef}
              handleCloseMenu={handleCloseShareMenu}
            />
            <div className={classes.nftCard}>
              <CollectionNFTCard
                handleSelect={() => {}}
                item={{
                  image: require("assets/backgrounds/digital_art_1.png"),
                  name: "NFT NAME",
                  isVerified: true,
                  owner: 80,
                  available: 10,
                  price: 1,
                }}
                hiddenHeader
              />
            </div>
          </div>
        </div>
        <div className={classes.nftDetailSection}>
          <div className={classes.nftTabSection}>
            {isAuction && (
              <div
                className={cls(
                  { [classes.selectedTabSection]: selectedTab === "auction" },
                  classes.tabSection
                )}
                onClick={() => setSelectedTab("auction")}
              >
                <span>Auction</span>
              </div>
            )}
            {isOwner ? (
              <div
                className={cls(
                  {
                    [classes.selectedTabSection]: selectedTab === "ownership",
                    [classes.disabledTab]: isAuction,
                  },
                  classes.tabSection
                )}
                onClick={() => setSelectedTab("ownership")}
              >
                <span>OWNERSHIP</span>
              </div>
            ) : (
              <div
                className={cls(
                  {
                    [classes.selectedTabSection]: selectedTab === "flip_coin",
                    [classes.disabledTab]: isAuction,
                  },
                  classes.tabSection
                )}
                onClick={() => (isAuction ? null : setSelectedTab("flip_coin"))}
              >
                <span>FLIP A COIN</span>
              </div>
            )}

            <div
              className={cls(
                {
                  [classes.selectedTabSection]: selectedTab === "trade_fraction",
                  [classes.disabledTab]: isAuction,
                },
                classes.tabSection
              )}
              onClick={() => (isAuction ? null : setSelectedTab("trade_fraction"))}
            >
              <span>TRADE FRACTIONS</span>
            </div>
          </div>
          {selectedTab === "auction" ? (
            <>
              <AuctionDetail auction={dummyAuction} />
              <OfferList />
            </>
          ) : selectedTab === "flip_coin" ? (
            <>
              <div className={classes.flipCoinSection}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" flexDirection="column">
                    <div className={classes.typo3}>Flip a coin & win</div>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <div>
                        <div className={classes.typo4}>Guess the result of the coin flip and win JOTS.</div>
                        <div className={classes.typo4}>Increase your JOTs if you guess correctly!</div>
                      </div>
                      {isMobile && (
                        <img
                          src={require("assets/pixImages/flip_coin_presentation.png")}
                          alt="presentation"
                        />
                      )}
                    </Box>
                    <div className={classes.potentialWinSection}>
                      <div className={classes.typo4}>Your potential Win</div>
                      <Box display="flex">
                        <div className={classes.typo5}>0.1</div>
                        <div className={classes.typo6}>JOT</div>
                      </Box>
                    </div>
                  </Box>
                  {!isMobile && (
                    <img src={require("assets/pixImages/flip_coin_presentation.png")} alt="presentation" />
                  )}
                </Box>
                {isFlipped ? (
                  <div className={classes.flippedCoinButton}>rebalancing pool. Next flip in 00:30h</div>
                ) : (
                  <div className={classes.flipCoinButton} onClick={() => setOpenFlipCoinGuessModal(true)}>
                    Flip The Coin
                  </div>
                )}

                <div className={classes.typo7}>You can flip the coin once every hour</div>
              </div>
              <div className={classes.coinFlipHistorySection}>
                <div className={classes.typo8}>Coin flip history</div>
                <div className={classes.table}>
                  <CustomTable
                    headers={tableHeaders}
                    rows={(nft.flipHistory ?? []).map(item => [
                      {
                        cell:
                          item.winnerAddress === nft.JotPoolAddress
                            ? "Jot Pool"
                            : nft.userData.name || nft.userData.address,
                      },
                      {
                        cell:
                          (item.player ?? "").substr(0, 5) +
                          "..." +
                          (item.player ?? "").substr((item.player ?? "").length - 5, 5),
                      },
                      {
                        cell: (item.guess ?? "").toUpperCase(),
                      },
                      {
                        cellAlign: "center",
                        cell: <Moment format="hh:kk, DD.MM.yyyy">{item.date}</Moment>,
                      },
                      {
                        cellAlign: "center",
                        cell: (
                          <div
                            className={classes.explorerImg}
                            onClick={() =>
                              window.open(
                                `https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${item.txn}`,
                                "_blank"
                              )
                            }
                          >
                            <img src={require("assets/icons/polygon_scan.png")} />
                          </div>
                        ),
                      },
                    ])}
                    placeholderText="No history"
                  />
                </div>
              </div>
            </>
          ) : selectedTab === "trade_fraction" ? (
            <div>
              <SyntheticFractionalisedTradeFractionsPage
                isOwner={isOwner}
                collectionId={params.collectionId}
                nft={nft}
              />
            </div>
          ) : selectedTab === "ownership" ? (
            <div>
              <SyntheticFractionalisedTradeFractionsPage
                isOwner={isOwner}
                isOwnerShipTab={true}
                collectionId={params.collectionId}
                nft={nft}
              />
            </div>
          ) : (
            <></>
          )}
        </div>
        <ChangeLockedNFT
          open={openChangeLockedNFTModal}
          onClose={handleCloseChangeLockedNFTModal}
          onProceed={handleProceedChangeLockedNFT}
        />
        <WithdrawNFTModel open={openWithdrawNFTModal} onClose={handleCloseWithdrawNFTModal} />
        <Modal size="small" isOpen={withDrawn} onClose={() => {}} className={classes.withDrawnModal}>
          <img src={require("assets/icons/crystal_camera.png")} alt="" />
          <Box color={"#431AB7"} paddingLeft={1}>
            This NFT is beeing withdrawn
          </Box>
        </Modal>
        <FlipCoinInputGuessModal
          open={OpenFlipCoinGuessModal}
          onClose={() => setOpenFlipCoinGuessModal(false)}
          setResult={handleSetFlipGuess}
        />
        <FlipCoinModal
          open={openFlipCoinModal}
          onClose={() => setOpenFlipCoinModal(false)}
          isFlipping={isFlipping}
          flipResult={flipResult}
          resultState={resultState}
          hash={flippingHash}
        />
      </div>
    </LoadingWrapper>
  );
};

export default SyntheticFractionalisedCollectionNFTPage;
