import React, { useState, useEffect } from "react";
import { Grid, useMediaQuery, useTheme } from "@material-ui/core";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { getNFTBalanceFromMoralis } from "shared/services/API/balances/externalAPI";
import { saveExternallyFetchedNfts, getNftDataByTokenIds, mint } from "shared/services/API/FractionalizeAPI";

import { useFractionaliseStyles } from "./index.styles";
import NFTCard from "./NFTCard";
import ChangeToSyntheticModal from "../../modals/ChangeToSynthetic";
import { useWeb3React } from "@web3-react/core";

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

const ChangeNFTToSynthetic = ({ goBack, nft }) => {
  const classes = useFractionaliseStyles();
  const [loadingnNFTS, setLoadingnNFTS] = useState<boolean>(false);
  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<any>();
  const { account, library, chainId } = useWeb3React();
  const [walletConnected, setWalletConnected] = useState<boolean>(!!account);
  const [openChangeToSyntheticModal, setOpenChangeToSyntheticModal] = useState<boolean>(false);
  const isMobileScreen = useMediaQuery("(max-width:586px)");
  const [prevSelectedChain, setPrevSelectedChain] = useState<any>(filteredBlockchainNets[1]);
  const [chainIdCopy, setChainIdCopy] = useState<number>(chainId!);
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[1]);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.between(769, 960));
  const isMiniTablet = useMediaQuery(theme.breakpoints.between(700, 769));
  const isMobile = useMediaQuery(theme.breakpoints.down(700));

  // parse it to same format as fb collection
  const parseMoralisData = (data, address, selectedChain) => {
    const metadata = data.metadata ? JSON.parse(data.metadata) : {};
    return {
      BlockchainId: data.token_id,
      BlockchainNetwork: selectedChain.value,
      Collabs: {},
      CreatorAddress: address,
      HasPhoto: metadata.image != undefined,
      Hashtags: [],
      MediaDescription: metadata.description,
      MediaName: metadata.name ? metadata.name : data.name ? data.name : data.symbol,
      MediaSymbol: data.symbol ? data.symbol : data.name,
      Type: "DIGITAL_ART_TYPE",
      Url: metadata.image,
      chainId: selectedChain.chainId,
      contractType: data.contract_type,
      tokenAddress: data.token_address,
    };
  };

  // sync selected chain with metamask chain
  const handleSyncChain = async () => {
    if (chainId != selectedChain.chainId) {
      const changed = await switchNetwork(selectedChain.chainId);
      if (!changed) setSelectedChain(prevSelectedChain);
      else setChainIdCopy(selectedChain.chainId);
      return changed;
    }
    return true;
  };

  // sync metamask chain with dropdown chain selection and load nft balance from wallet
  const loadNFT = async () => {
    if (walletConnected) {
      const changed = await handleSyncChain();
      if (changed) {
        setLoadingnNFTS(true);
        const { result } = await getNFTBalanceFromMoralis(account!, selectedChain.chainId!);
        if (result) {
          const pixCreatedNftMap = {};
          const externallyCreatedNft: any[] = [];
          for (let obj of result) {
            const data = parseMoralisData(obj, account, selectedChain);
            if (["PRIVIERC721", "PNR"].includes(data.MediaSymbol)) pixCreatedNftMap[data.BlockchainId] = data;
            else externallyCreatedNft.push(data);
          }
          // get pix created nft data from backend
          if (Object.keys(pixCreatedNftMap).length) {
            const resp = await getNftDataByTokenIds(Object.keys(pixCreatedNftMap));
            if (resp?.success) {
              let data = resp.data;
              Object.keys(data).forEach(k => {
                pixCreatedNftMap[k] = {
                  ...data[k],
                  tokenAddress: selectedChain.config.CONTRACT_ADDRESSES.PRIVIERC721,
                };
              });
            }
          }
          // save externally created nft to backend
          saveExternallyFetchedNfts(externallyCreatedNft);
          // set user nfts
          setUserNFTs([...Object.values(pixCreatedNftMap), ...externallyCreatedNft].filter((item) => item.BlockchainId !== nft.NftId));
        }
        setLoadingnNFTS(false);
      } else {
        setUserNFTs([]);
      }
    }
  };

  useEffect(() => {
    loadNFT();
  }, [chainIdCopy, selectedChain, account, walletConnected]);

  const handleConnectWallet = () => {
    setWalletConnected(true);
  };

  const handleProceed = () => {
    setOpenChangeToSyntheticModal(true);
  };
  
  const fractionaliseSuccess = () => { };

  return (
    <div className={classes.root}>
      <BackButton purple overrideFunction={goBack} />
      {walletConnected ? (
        <Box className={classes.titleContainer}>
          <Box display="flex" flexDirection="column">
            <div className={classes.title}>Synthetic Fractionalise your NFT</div>
            <div className={classes.text}>You will create a synthetic copy of the NFT you are selecting.</div>
          </Box>
          {userNFTs && userNFTs.length > 0 && (
            <button disabled={!walletConnected || !selectedNFT} className={classes.nftsButton} onClick={handleProceed}>
              Continue
            </button>
          )}
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" className={classes.titleContainer}>
          <div className={classes.title}>Change NFT to Synthetic</div>
          <div className={classes.text}>You can change your NFT to another NFT from the same collection.</div>
        </Box>
      )}
      <Grid container spacing={5}>
        <Grid item xs={12} md={12}>
          {!walletConnected && (
            <div className={classes.walletRow}>
              <button onClick={handleConnectWallet}>Connect Your Wallet</button>
            </div>
          )}

          {walletConnected && (
            <LoadingWrapper loading={loadingnNFTS} theme={"blue"}>
              {userNFTs && userNFTs.length > 0 ? (
                <Box
                  width={1}
                  borderRadius={20}
                  bgcolor="#EFF2FD"
                  border="1px solid rgba(67, 26, 183, 0.24)"
                  boxSizing="border-box"
                  padding={isTablet || isMiniTablet || isMobile ? "41px 12px" : "41px 29px"}
                >
                  <MasonryGrid
                    gutter={"12px"}
                    data={userNFTs}
                    renderItem={(item, index) => (
                      <NFTCard
                        item={item}
                        key={`item-${index}`}
                        handleSelect={() => {
                          if (userNFTs) {
                            let nftsCopy = [...userNFTs];
                            const selected = !userNFTs[index].selected;
                            nftsCopy[index] = {
                              ...userNFTs[index],
                              selected: !userNFTs[index].selected,
                            };
                            // only need one selected
                            if (selected) {
                              for (let i = 0; i < nftsCopy.length; i++) {
                                if (i != index) nftsCopy[i].selected = false;
                              }
                            }
                            setSelectedNFT({ index, ...nftsCopy[index] });
                            setUserNFTs(nftsCopy);
                          }
                        }}
                      />
                    )}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_TWO}
                  />
                </Box>
              ) : (
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Box className={classes.emptyBox}>
                    <Box className={classes.emptyIcon}>😞</Box>
                    <Box className={classes.detailsLabel} mt={1}>
                      Not NFT found on your wallet.
                    </Box>
                  </Box>
                </Box>
              )}
            </LoadingWrapper>
          )}
        </Grid>
      </Grid>
      {openChangeToSyntheticModal && (
        <ChangeToSyntheticModal
          open={openChangeToSyntheticModal}
          onClose={() => setOpenChangeToSyntheticModal(false)}
          selectedNFT={selectedNFT}
          currentNFT={nft}
          onSuccess={fractionaliseSuccess}
        />
      )}
    </div>
  );
};

const COLUMNS_COUNT_BREAK_POINTS_TWO = {
  586: 2,
  800: 3,
  1440: 5,
};

export default ChangeNFTToSynthetic;
