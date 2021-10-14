import React, { useState, useEffect } from "react";
import { useWeb3React } from "@web3-react/core";
import { Grid, useMediaQuery, useTheme } from "@material-ui/core";
import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import { Color, StyledDivider } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import NFTSelectCard from "components/PriviDigitalArt/components/Cards/NFTSelectCard";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import { BlockchainNets } from "shared/constants/constants";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { Dropdown } from "shared/ui-kit/Select/Select";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import Web3 from "web3";
import { getNFTBalanceFromMoralis } from "shared/services/API/balances/externalAPI";
import { switchNetwork } from "shared/functions/metamask";
import { useFractionaliseStyles, PurpleSlider } from "./index.styles";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { saveExternallyFetchedNfts, getNftDataByTokenIds, mint } from "shared/services/API/FractionalizeAPI";

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
    MediaName: data.name ? data.name : data.symbol,
    MediaSymbol: data.symbol ? data.symbol : data.name,
    Type: "DIGITAL_ART_TYPE",
    Url: metadata.image,
    chainId: selectedChain.chainId,
    contractType: data.contract_type,
    tokenAddress: data.token_address,
  };
};

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");
import NormalNFTCard from "components/PriviDigitalArt/components/Cards/NormalNFTCard";

const TopNFTList = [
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    price: 492.17,
    delta: 1.72,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    price: 492.17,
    delta: -0.72,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    price: 492.17,
    delta: -0.72,
  },
  {
    image: require("assets/backgrounds/digital_art_1.png"),
    name: "NFT NAME",
    price: 492.17,
    delta: -0.72,
  },
];

const Fractionalise = ({ goBack, isSynthetic = false }) => {
  const classes = useFractionaliseStyles();
  const { showAlertMessage } = useAlertMessage();

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const [loadingnNFTS, setLoadingnNFTS] = useState<boolean>(false);
  const [userNFTs, setUserNFTs] = useState<any[]>([]);
  const [selectedNFT, setSelectedNFT] = useState<any>();

  const [walletConnected, setWalletConnected] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [prevSelectedChain, setPrevSelectedChain] = useState<any>(filteredBlockchainNets[0]);
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);
  const [supply, setSupply] = useState<string>("");
  const [symbol, setSymbol] = useState<string>("");
  const [reservePriceToken, setReservePriceToken] = useState<string>("ETH");
  const [reservePrice, setReservePrice] = useState<string>("");
  const [managementFee, setManagementFee] = useState<number>(1);

  const [tokenList, setTokenList] = useState<string[]>(Object.keys(selectedChain.config.TOKEN_ADDRESSES));

  const { account, library, chainId } = useWeb3React();
  const [chainIdCopy, setChainIdCopy] = useState<number>(chainId!);
  const [loading, setLoading] = useState<boolean>(false);

  // set token list according chain
  useEffect(() => {
    setTokenList(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
    setReservePriceToken(Object.keys(selectedChain.config.TOKEN_ADDRESSES)[0]);
  }, [selectedChain]);

  useEffect(() => {
    loadNFT();
  }, [chainIdCopy, selectedChain.chainId, account, walletConnected]);

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
          setUserNFTs([...Object.values(pixCreatedNftMap), ...externallyCreatedNft]);
        }
        setLoadingnNFTS(false);
      } else {
        setUserNFTs([]);
      }
    }
  };

  const handleConnectWallet = () => {
    setWalletConnected(true);
  };

  const validate = () => {
    if (!name) {
      showAlertMessage("enter a valid name", { variant: "error" });
      return false;
    } else if (!symbol) {
      showAlertMessage("enter a valid symbol", { variant: "error" });
      return false;
    } else if (!selectedNFT) {
      showAlertMessage("select a NFT", { variant: "error" });
      return false;
    } else if (!supply || !Number(supply)) {
      showAlertMessage("enter a valid supply", { variant: "error" });
      return false;
    } else if (!reservePrice || !Number(reservePrice)) {
      showAlertMessage("enter a valid list price", { variant: "error" });
      return false;
    }
    return true;
  };

  const handleFractionalise = async () => {
    if (!walletConnected) {
      showAlertMessage("Please connect your wallet first", { variant: "error" });
      return;
    }
    if (validate()) {
      setLoading(true);
      await handleSyncChain();
      const web3 = new Web3(library.provider);
      const payload = {
        name,
        symbol,
        token: selectedNFT.tokenAddress,
        id: Number(selectedNFT.BlockchainId),
        supply,
        asset: selectedChain.config.TOKEN_ADDRESSES[reservePriceToken],
        listPrice: reservePrice,
        fee: managementFee,
        // extra data
        ownerAddress: account,
        listToken: reservePriceToken,
        MediaSymbol: selectedNFT.MediaSymbol,
        chainId: chainId,
      };
      const resp = await selectedChain.apiHandler.Erc721.setApprovalForAll2(
        web3,
        account!,
        "ERC721_VAULT_FACTORY",
        selectedNFT.tokenAddress
      );
      if (resp?.success) {
        const mintResp = await selectedChain.apiHandler.VaultFactory.mint(web3, account!, payload);
        if (mintResp?.success) {
          const data = {
            ...payload,
            ...mintResp.data,
          };
          const backendResp = await mint(data);
          if (backendResp?.success) {
            showAlertMessage("NFT successfully fractionalized", { variant: "success" });
            goBack();
          }
        } else {
          showAlertMessage("NFT failed to be fractionalized", { variant: "error" });
        }
      }
      setLoading(false);
    }
  };

  return (
    <LoadingScreen
      loading={loading}
      title={`Transaction \nin progress`}
      subTitle={`Transaction is proceeding on ${selectedChain.value}.\nThis can take a moment, please be patient...`}
      handleClose={() => setLoading(false)}
    >
      <div className={classes.root}>
        <BackButton purple overrideFunction={goBack} />
        <div className={classes.title}>
          {isSynthetic ? "Synthetic Fractionalise your NFT" : "FRACTIONALISE"}
        </div>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={isTablet ? 5 : 6}>
            <div className={classes.text}>
              Select one or more NFTs for your vault and then set your vault’s details to continue. Be aware
              you cannot add to the NFTs in a vault once they have been fractionalized.
            </div>
            {!walletConnected && (
              <div className={classes.walletRow}>
                <div>
                  <img src={require("assets/emojiIcons/icon_bell.png")} alt="bell" />
                  To Fractionalise your NFTs you need first to connect your wallet.
                </div>
                <button onClick={handleConnectWallet}>Connect Your Wallet</button>
              </div>
            )}

            {isSynthetic ? (
              <LoadingWrapper loading={loadingnNFTS} theme={"blue"}>
                {TopNFTList && TopNFTList.length > 0 ? (
                  <MasonryGrid
                    gutter={"24px"}
                    data={TopNFTList}
                    renderItem={(item, index) => <NormalNFTCard item={item} index={index} />}
                    columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_TWO}
                  />
                ) : (
                  <Box display="flex" alignItems="center" justifyContent="center">
                    <Box className={classes.emptyBox}>
                      <Box>😞</Box>
                      <Box className={classes.detailsLabel} mt={1}>
                        Not NFT found on your wallet.
                      </Box>
                    </Box>
                  </Box>
                )}
              </LoadingWrapper>
            ) : (
              <LoadingWrapper loading={loadingnNFTS} theme={"blue"}>
                <MasonryGrid
                  gutter={"24px"}
                  data={userNFTs}
                  renderItem={(item, index) => (
                    <NFTSelectCard
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
                          setSelectedNFT(nftsCopy[index]);
                          setUserNFTs(nftsCopy);
                        }
                      }}
                    />
                  )}
                  columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_TWO}
                />
              </LoadingWrapper>
            )}

            {isMobile && (
              <Grid item xs={12} sm={6}>
                <div className={classes.nftsBox}>
                  <div className={classes.nftsTitle}>
                    {isSynthetic ? "SELECTED NFT" : "SELECTED NFTS"}{" "}
                    {!isSynthetic && <span>{userNFTs?.filter(n => n.selected)?.length ?? 0}</span>}
                  </div>
                  {isSynthetic && (
                    <div className={classes.text} style={{ textAlign: "center" }}>
                      You can only select one NFT
                    </div>
                  )}
                  <StyledDivider type="solid" color={Color.GrayLight} margin={2} />
                  <div className={classes.detailsLabel}>Vault details</div>
                  <Grid container spacing={isMobile ? 1 : 2} style={{ display: "flex", alignItems: "flex-end" }}>
                    <Grid item xs={6} sm={6}>
                      <InputWithLabelAndTooltip
                        labelName="Name"
                        inputValue={name}
                        placeHolder={"Name..."}
                        required
                        type="text"
                        onInputValueChange={e => setName(e.target.value)}
                        theme="light"
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <label>Blockchain</label>
                      <Dropdown
                        value={selectedChain.value}
                        menuList={filteredBlockchainNets}
                        onChange={e => {
                          setPrevSelectedChain(selectedChain);
                          setSelectedChain(filteredBlockchainNets.find(c => c.value === e.target.value));
                        }}
                        hasImage
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <InputWithLabelAndTooltip
                        labelName="Supply"
                        inputValue={supply === undefined ? "" : supply.toString()}
                        placeHolder={"2"}
                        minValue={0}
                        required
                        type="number"
                        onInputValueChange={e => setSupply(e.target.value)}
                        theme="light"
                      />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                      <InputWithLabelAndTooltip
                        labelName="Symbol"
                        inputValue={symbol}
                        placeHolder={"Symbol..."}
                        required
                        type="text"
                        onInputValueChange={e => setSymbol(e.target.value)}
                        theme="light"
                      />
                    </Grid>
                    {!isSynthetic && (
                      <Grid item xs={6} sm={6}>
                        <label>Reserve Price</label>
                        <TokenSelect
                          tokens={tokenList}
                          value={reservePriceToken}
                          onChange={e => {
                            setReservePriceToken(e.target.value as string);
                          }}
                        />
                      </Grid>
                    )}
                    {!isSynthetic && (
                      <Grid item xs={6} sm={6}>
                        <InputWithLabelAndTooltip
                          inputValue={reservePrice === undefined ? "" : reservePrice.toString()}
                          placeHolder={"0"}
                          minValue={0}
                          required
                          type="number"
                          onInputValueChange={e => setReservePrice(e.target.value)}
                          theme="light"
                        />
                      </Grid>
                    )}
                    {!isSynthetic && (
                      <Grid item xs={12} sm={12}>
                        <Box className={classes.purpleLabel} mb="1px">
                          Annual management Fee
                        </Box>

                        <div className={classes.sliderContainer}>
                          <PurpleSlider
                            defaultValue={managementFee}
                            value={managementFee}
                            valueLabelDisplay="auto"
                            step={1}
                            min={0}
                            max={10}
                            onChange={(event, newValue) => setManagementFee(newValue as number)}
                          />
                        </div>

                        <Box
                          className={classes.purpleLabel}
                          mt="1px"
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <div>0%</div>
                          <div>10%</div>
                        </Box>
                      </Grid>
                    )}
                    {isSynthetic && (
                      <Grid item xs={12} sm={12}>
                        <Box className={classes.borderBox}>
                          The <span>Staking Interest</span> you will earn for staking your original NFT is{" "}
                          <span>0.5%</span>
                        </Box>
                      </Grid>
                    )}
                  </Grid>

                  <Box mt="40px" p={"24px 0px 0px"} display="flex" justifyContent="flex-end">
                    <button
                      disabled={!walletConnected}
                      className={classes.nftsButton}
                      onClick={handleFractionalise}
                    >
                      Continue
                    </button>
                  </Box>
                </div>
              </Grid>
            )}

          </Grid>
          {/* right form */}
          {!isMobile && (
            <Grid item xs={12} sm={isTablet ? 7 : 6}>
              <div className={classes.nftsBox}>
                <div className={classes.nftsTitle}>
                  {isSynthetic ? "SELECTED NFT" : "SELECTED NFTS"}{" "}
                  {!isSynthetic && <span>{userNFTs?.filter(n => n.selected)?.length ?? 0}</span>}
                </div>
                {isSynthetic && (
                  <div className={classes.text} style={{ textAlign: "center" }}>
                    You can only select one NFT
                  </div>
                )}
                <StyledDivider type="solid" color={Color.GrayLight} margin={2} />
                <div className={classes.detailsLabel}>Vault details</div>
                <Grid container spacing={2} style={{ display: "flex", alignItems: "flex-end" }}>
                  <Grid item xs={12} sm={6}>
                    <InputWithLabelAndTooltip
                      labelName="Name"
                      inputValue={name}
                      placeHolder={"Name..."}
                      required
                      type="text"
                      onInputValueChange={e => setName(e.target.value)}
                      theme="light"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <label>Blockchain</label>
                    <Dropdown
                      value={selectedChain.value}
                      menuList={filteredBlockchainNets}
                      onChange={e => {
                        setPrevSelectedChain(selectedChain);
                        setSelectedChain(filteredBlockchainNets.find(c => c.value === e.target.value));
                      }}
                      hasImage
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputWithLabelAndTooltip
                      labelName="Supply"
                      inputValue={supply === undefined ? "" : supply.toString()}
                      placeHolder={"2"}
                      minValue={0}
                      required
                      type="number"
                      onInputValueChange={e => setSupply(e.target.value)}
                      theme="light"
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputWithLabelAndTooltip
                      labelName="Symbol"
                      inputValue={symbol}
                      placeHolder={"Symbol..."}
                      required
                      type="text"
                      onInputValueChange={e => setSymbol(e.target.value)}
                      theme="light"
                    />
                  </Grid>
                  {!isSynthetic && (
                    <Grid item xs={12} sm={6}>
                      <label>Reserve Price</label>
                      <TokenSelect
                        tokens={tokenList}
                        value={reservePriceToken}
                        onChange={e => {
                          setReservePriceToken(e.target.value as string);
                        }}
                      />
                    </Grid>
                  )}
                  {!isSynthetic && (
                    <Grid item xs={12} sm={6}>
                      <InputWithLabelAndTooltip
                        inputValue={reservePrice === undefined ? "" : reservePrice.toString()}
                        placeHolder={"0"}
                        minValue={0}
                        required
                        type="number"
                        onInputValueChange={e => setReservePrice(e.target.value)}
                        theme="light"
                      />
                    </Grid>
                  )}
                  {!isSynthetic && (
                    <Grid item xs={12} sm={12}>
                      <Box className={classes.purpleLabel} mb="1px">
                        Annual management Fee
                      </Box>

                      <div className={classes.sliderContainer}>
                        <PurpleSlider
                          defaultValue={managementFee}
                          value={managementFee}
                          valueLabelDisplay="auto"
                          step={1}
                          min={0}
                          max={10}
                          onChange={(event, newValue) => setManagementFee(newValue as number)}
                        />
                      </div>
                      <Box
                        className={classes.purpleLabel}
                        mt="1px"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <div>0%</div>
                        <div>10%</div>
                      </Box>
                    </Grid>
                  )}
                  {isSynthetic && (
                    <Grid item xs={12} sm={12}>
                      <Box className={classes.borderBox}>
                        The <span>Staking Interest</span> you will earn for staking your original NFT is{" "}
                        <span>0.5%</span>
                      </Box>
                    </Grid>
                  )}
                </Grid>

                <Box mt="40px" p={"24px 0px 0px"} display="flex" justifyContent="flex-end">
                  <button className={classes.nftsButton} onClick={handleFractionalise}>
                    Continue
                  </button>
                </Box>
              </div>
            </Grid>
          )}
        </Grid>
      </div>
    </LoadingScreen>
  );
};

const COLUMNS_COUNT_BREAK_POINTS_TWO = {
  800: 1,
  1440: 2,
};

export default Fractionalise;
