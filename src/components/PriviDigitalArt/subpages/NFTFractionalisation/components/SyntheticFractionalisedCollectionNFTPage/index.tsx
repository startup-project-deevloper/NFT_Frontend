import React, { useState, useEffect } from "react";
import cls from "classnames";
import { useParams } from "react-router";
import { useSelector } from "react-redux";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import Axios from "axios";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, Avatar, Text } from "shared/ui-kit";
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
  const [ownershipJot, setOwnershipJot] = useState<number>(0);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [flipResult, setFlipResult] = useState<boolean>(false);
  const [hashFlipping, setHashFlipping] = useState<string>("");

  const [nft, setNft] = useState<any>({});
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();
  const [openShareMenu, setOpenShareMenu] = React.useState(false);
  const anchorShareMenuRef = React.useRef<HTMLDivElement>(null);
  const [loadingData, setLoadingData] = useState<boolean>(true);

  /// TODO This is wrong
  const isOwner = React.useMemo(
    () => nft && userSelector && nft.priviUser && nft.priviUser.id === userSelector.id,
    [nft, userSelector]
  );

  useEffect(() => {
    (async () => {
      setLoadingData(true);

      if (!params || !params.collectionId || !params.nftId) {
        return;
      }

      const response = await getSyntheticNFT(params.collectionId, params.nftId);
      if (response.success) {
        setNft(response.data);
        setLoadingData(false);

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

        const contractResponse = await web3APIHandler.SyntheticCollectionManager.getOwnerSupply(
          web3,
          response.data,
          {
            tokenId: +response.data.SyntheticID,
          }
        );

        if (contractResponse) {
          setOwnershipJot(contractResponse);
        }
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

  const handleFlipCoin = async () => {
    const targetChain = BlockchainNets[1];
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
        prediction: 1,
      });

      if (!contractResponse) {
        showAlertMessage(`Got failed while flipping the JOT`, { variant: "error" });
        return;
      }

      console.log("response", contractResponse);

      // const {
      //   returnValues: { prediction, tokenId, requestId, randomResult }, transactionHash
      // } = contractResponse;

      // await API.addFlipHistory({
      //   collectionAddress: selectedNFT.collectionAddress,
      //   syntheticID: selectedNFT.SyntheticID,
      //   winnerAddress: requestId,
      //   prediction: prediction,
      //   randomResult,
      //   tokenId,
      // });

      // setHash(transactionHash);
    } catch (err) {
      console.log("error", err);
    }
  };

  const dummyTableData = [
    [
      {
        cell: "JOT Pool",
      },
      {
        cell: "",
      },
      {
        cell: "False",
      },
      {
        cell: "12:09pm April 23, 2021",
      },
      {
        cell: (
          <div className={classes.explorerImg}>
            <img src={require("assets/icons/polygon_scan.png")} />
          </div>
        ),
      },
    ],

    [
      {
        cell: (
          <Box className={classes.userField} display="flex" flexDirection="row" alignItems="center">
            <Avatar size="small" url={require(`assets/anonAvatars/ToyFaces_Colored_BG_001.jpg`)} />
            <Text>@user_name</Text>
          </Box>
        ),
      },
      {
        cell: "0xas3....1231s",
      },
      {
        cell: "Correct",
      },
      {
        cell: "12:09pm April 23, 2021",
      },
      {
        cell: (
          <div className={classes.explorerImg}>
            <img src={require("assets/icons/polygon_scan.png")} />
          </div>
        ),
      },
    ],

    [
      {
        cell: (
          <Box className={classes.userField} display="flex" flexDirection="row" alignItems="center">
            <Avatar size="small" url={require(`assets/anonAvatars/ToyFaces_Colored_BG_001.jpg`)} />
            <Text>@user_name</Text>
          </Box>
        ),
      },
      {
        cell: "0xas3....1231s",
      },
      {
        cell: "Correct",
      },
      {
        cell: "12:09pm April 23, 2021",
      },
      {
        cell: (
          <div className={classes.explorerImg}>
            <img src={require("assets/icons/polygon_scan.png")} />
          </div>
        ),
      },
    ],

    [
      {
        cell: (
          <Box className={classes.userField} display="flex" flexDirection="row" alignItems="center">
            <Avatar size="small" url={require(`assets/anonAvatars/ToyFaces_Colored_BG_001.jpg`)} />
            <Text>@user_name</Text>
          </Box>
        ),
      },
      {
        cell: "0xas3....1231s",
      },
      {
        cell: "Correct",
      },
      {
        cell: "12:09pm April 23, 2021",
      },
      {
        cell: (
          <div className={classes.explorerImg}>
            <img src={require("assets/icons/polygon_scan.png")} />
          </div>
        ),
      },
    ],
  ];
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
    },
    {
      headerName: "EXPLORER",
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
      userAddress: nft.priviUser.id,
      communityAddress: match.params.collectionId,
    };

    Axios.post(`${URL()}/community/follow`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...nft };
        itemCopy.Followers = [...(itemCopy.Followers ?? []), nft.priviUser.id];

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
              flexWrap="wrap"
              mt={"30px"}
              pr="10%"
              gridColumnGap="24px"
              gridRowGap="24px"
            >
              <Box display="flex" flexDirection="column" mr={"87px"}>
                <div className={classes.typo1}>Ownership</div>
                <div className={classes.typo2}>{ownershipJot} JOTs</div>
              </Box>
              <Box display="flex" flexDirection="column" mr={"75px"}>
                <div className={classes.typo1}>Owner</div>
                <Box display="flex" alignItems="center">
                  <Avatar size="small" url={require(`assets/anonAvatars/ToyFaces_Colored_BG_001.jpg`)} />
                  <Box ml={1}>
                    <div className={classes.typo2}>User name</div>
                  </Box>
                </Box>
              </Box>
              <PrimaryButton size="medium" className={classes.polygonscanBtn} onClick={() => {}}>
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
              <div className={classes.plusSection} onClick={handleFollow}>
                <PlusIcon />
                <span>Follow</span>
              </div>
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
                customHeight="100%"
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
                  <div className={classes.flipCoinButton} onClick={handleFlipCoin}>
                    Flip The Coin
                  </div>
                )}

                <div className={classes.typo7}>You can flip the coin once every hour</div>
              </div>
              <div className={classes.coinFlipHistorySection}>
                <div className={classes.typo8}>Coin flip history</div>
                <div className={classes.table}>
                  <CustomTable headers={tableHeaders} rows={dummyTableData} placeholderText="No history" />
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
        <FlipCoinModal
          open={openFlipCoinModal}
          onClose={() => setOpenFlipCoinModal(false)}
          isFlipping={isFlipping}
          flipResult={flipResult}
          hash={hashFlipping}
          resultState={0}
        />
      </div>
    </LoadingWrapper>
  );
};

export default SyntheticFractionalisedCollectionNFTPage;
