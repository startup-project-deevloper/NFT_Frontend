import React, { useState } from "react";
import cls from "classnames";

import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { PrimaryButton, Avatar, Text } from "shared/ui-kit";
import { CustomTable, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import SyntheticFractionalisedTradeFractionsPage from "../SyntheticFractionalisedTradeFractionsPage";
import CollectionNFTCard from "../../../../components/Cards/CollectionNFTCard";
import { fractionalisedCollectionStyles, ShareIcon, PlusIcon } from "./index.styles";
import AuctionDetail from "./components/AuctionDetail";
import OfferList from "./components/OfferList";
import ChangeLockedNFT from "../../modals/ChangeLockedNFT";
import ChangeNFTToSynthetic from "../../components/ChangeNFTToSynthetic";

const SyntheticFractionalisedCollectionNFTPage = ({ goBack, isFlipped = false, match }) => {
  const classes = fractionalisedCollectionStyles();

  const isAuction = match.params.auction === "1";
  const isOwner = match.params.auction === "2";

  const [selectedTab, setSelectedTab] = useState<"flip_coin" | "trade_fraction" | "auction" | "ownership">(
    isAuction ? "auction" : isOwner ? "ownership" : "flip_coin"
  );
  const [openChangeLockedNFTModal, setOpenChangeLockedNFTModal] = useState<boolean>(false);
  const [openChangeNFTToSynthetic, setOpenChangeNFTToSynthetic] = useState<boolean>(false);

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
            <img src={require("assets/pixImages/EthScanIcon.png")} />
          </div>
        ),
      },
    ],

    [
      {
        cell: (
          <Box display="flex" flexDirection="row" alignItems="center">
            <Avatar size="small" url={require(`assets/anonAvatars/ToyFaces_Colored_BG_001.jpg`)} />
            <Text ml={1.5}>@user_name</Text>
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
            <img src={require("assets/pixImages/EthScanIcon.png")} />
          </div>
        ),
      },
    ],

    [
      {
        cell: (
          <Box display="flex" flexDirection="row" alignItems="center">
            <Avatar size="small" url={require(`assets/anonAvatars/ToyFaces_Colored_BG_001.jpg`)} />
            <Text ml={1.5}>@user_name</Text>
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
            <img src={require("assets/pixImages/EthScanIcon.png")} />
          </div>
        ),
      },
    ],

    [
      {
        cell: (
          <Box display="flex" flexDirection="row" alignItems="center">
            <Avatar size="small" url={require(`assets/anonAvatars/ToyFaces_Colored_BG_001.jpg`)} />
            <Text ml={1.5}>@user_name</Text>
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
            <img src={require("assets/pixImages/EthScanIcon.png")} />
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

  return (
    <div className={classes.root}>
      <div className={classes.nftInfoSection}>
        <Box display="flex" justifyContent="space-between" pl={6}>
          <BackButton purple overrideFunction={goBack} />
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
        <div className={classes.nftInfoMainContent}>
          <span>Verified</span>
          <div className={classes.mainTitleSection}>
            <span>Cryptopunk #89</span>
            <span>Cryptopunks</span>
          </div>
          <Box display="flex" mt={"30px"}>
            <Box display="flex" flexDirection="column">
              <div className={classes.typo1}>Ownership</div>
              <div className={classes.typo2}>1 JOTs</div>
            </Box>
            <PrimaryButton size="medium" className={classes.polygonscanBtn} onClick={() => {}}>
              <img src={require("assets/priviIcons/polygon.png")} />
              View on Polygonscan
            </PrimaryButton>
          </Box>
          <Box display="flex" mt="40px" alignItems="center">
            <div className={classes.shareSection}>
              <ShareIcon />
            </div>
            <div className={classes.socialSection}>
              <img src={require("assets/icons/social.png")} />
            </div>
            <div className={classes.plusSection}>
              <PlusIcon />
              <span>Follow</span>
            </div>
          </Box>
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
              className={cls({ [classes.selectedTabSection]: selectedTab === "auction" }, classes.tabSection)}
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
                  <div className={classes.typo4}>Guess the result of the coin flip and win JOTS.</div>
                  <div className={classes.typo4}>Increase your JOTs if you guess correctly!</div>
                  <div className={classes.potentialWinSection}>
                    <div className={classes.typo4}>Your potential Win</div>
                    <Box display="flex">
                      <div className={classes.typo5}>0.1</div>
                      <div className={classes.typo6}>JOT</div>
                    </Box>
                  </div>
                </Box>
                <img src={require("assets/pixImages/flip_coin_presentation.png")} alt="presentation" />
              </Box>
              {isFlipped ? (
                <div className={classes.flippedCoinButton}>rebalancing pool. Next flip in 00:30h</div>
              ) : (
                <div className={classes.flipCoinButton}>Flip The Coin</div>
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
            <SyntheticFractionalisedTradeFractionsPage isOwner={isOwner} />
          </div>
        ) : selectedTab === "ownership" ? (
          <div>
            <SyntheticFractionalisedTradeFractionsPage isOwner={isOwner} isOwnerShipTab={true} />
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
    </div>
  );
};

export default SyntheticFractionalisedCollectionNFTPage;
