import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Axios from "axios";
import Web3 from "web3";
import URL from "shared/functions/getURL";

import { InputBase, makeStyles, useMediaQuery, useTheme } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useWeb3React } from "@web3-react/core";

import { RootState } from "store/reducers/Reducer";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { TimeInput } from "shared/ui-kit/TimeInput";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Dropdown } from "shared/ui-kit/Select/Select";
import { BlockchainNets } from "shared/constants/constants";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";
import { getPixUserMediasToSell, createAuction, createExchange } from "shared/services/API";
import { sellModalStyles } from "./index.styles";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { ReactComponent as AddIcon } from "assets/icons/plus-solid.svg";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { priviTokenList } from "shared/constants/constants";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { onGetDecrypt, onGetNonDecrypt } from "shared/ipfs/get";
import { switchNetwork } from "shared/functions/metamask";

const searchIcon = require("assets/icons/search.png");
const removeIcon = require("assets/icons/remove_red.png");

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const getRandomImageUrl = () => {
  return require(`assets/backgrounds/digital_art_1.png`);
};

export const NFTModal = (props: any) => {
  const classes = sellModalStyles();
  //store
  const user = useSelector((state: RootState) => state.user);
  //hooks
  const [userMedias, setUserMedias] = useState<any[]>([]);
  const [filteredMedias, setFilteredMedias] = useState<any[]>([]);
  const [sale, setSale] = useState<any>({
    SelectedMedia: undefined,
    Price: "",
    Token: "PRIVI",
    blockchainNet: BlockchainNets[1].value,
  });
  const [auction, setAuction] = useState<any>({
    SelectedMedia: undefined,
    ReservePrice: "",
    Token: "PRIVI",
    StartDateTime: new Date().getTime(),
    EndDateTime: tomorrow.getTime(),
    TokensAllowed: [],
    blockchainNet: BlockchainNets[1].value,
  });
  const [tokenList, setTokenList] = useState<string[]>(priviTokenList);

  const { showAlertMessage } = useAlertMessage();
  const [isUserMediaLoading, setIsUserMediaLoading] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const payloadRef = useRef<any>({});

  const { account, library, chainId } = useWeb3React();

  // change token list according chain
  useEffect(() => {
    const item = props.type === "sell-nft" ? sale : props.type === "start-auction" ? auction : null;
    if (item) {
      let newTokenList;

      const targetChain = BlockchainNets.find(net => net.value === auction.blockchainNet);

      const web3Config = targetChain.config;

      if (item.blockchainNet == BlockchainNets[0].value) newTokenList = priviTokenList;
      else if (item.blockchainNet == BlockchainNets[1].value)
        newTokenList = Object.keys(web3Config.TOKEN_ADDRESSES);

      if (newTokenList) {
        setTokenList(newTokenList);
        setAuction({ ...auction, Token: newTokenList[0] });
        setSale({ ...sale, Token: newTokenList[0] });
      }
    }
  }, [sale.blockchainNet, auction.blockchainNet, props.type]);

  useEffect(() => {
    if (props.open === true) {
      setIsUserMediaLoading(true);
      getPixUserMediasToSell(user.address)
        .then(resp => {
          if (resp?.success) {
            setUserMedias(resp.data);
            setIsUserMediaLoading(false);
          }
        })
        .catch(() => {
          setIsUserMediaLoading(false);
        });
    } else {
      setSale({
        SelectedMedia: undefined,
        Price: 0,
        Token: "PRIVI",
        blockchainNet: BlockchainNets[0].value,
      });
      setAuction({
        SelectedMedia: undefined,
        ReservePrice: 0,
        Token: "PRIVI",
        StartDateTime: new Date().getTime(),
        EndDateTime: new Date().getTime(),
        TokensAllowed: [],
        blockchainNet: BlockchainNets[0].value,
      });
    }
  }, [props.open]);

  useEffect(() => {
    const blockchainNet = props.type === "sell-nft" ? sale.blockchainNet : auction.blockchainNet;
    setFilteredMedias(
      userMedias.filter(
        m =>
          (blockchainNet === BlockchainNets[0].value && !m.BlockchainNetwork) ||
          m.BlockchainNetwork === blockchainNet
      )
    );
  }, [userMedias, props.type, sale.blockchainNet, auction.blockchainNet]);

  const validate = () => {
    if (
      (props.type === "sell-nft" && !sale.SelectedMedia) ||
      (props.type === "start-auction" && !auction.SelectedMedia)
    ) {
      showAlertMessage("Please select a media", { variant: "error" });
      return false;
    } else if (
      (props.type === "sell-nft" && (!sale.Token || sale.Token === "")) ||
      (props.type === "start-auction" && (!auction.Token || auction.Token === ""))
    ) {
      showAlertMessage("Please select a Token for the price", { variant: "error" });
      return false;
    } else if (
      (props.type === "sell-nft" && (!sale.Price || sale.Price <= 0)) ||
      (props.type === "start-auction" && (!auction.ReservePrice || auction.ReservePrice <= 0))
    ) {
      showAlertMessage("Invalid Price. Price should be higher than 0", { variant: "error" });
      return false;
    } else if (
      isNaN(new Date(auction.StartDateTime).getTime()) ||
      isNaN(new Date(auction.EndDateTime).getTime())
    ) {
      showAlertMessage("Invalid time format.", { variant: "error" });
      return false;
    } else if (
      props.type === "start-auction" &&
      (!auction.StartDateTime ||
        new Date(auction.StartDateTime).getTime() >= new Date(auction.EndDateTime).getTime())
    ) {
      showAlertMessage("Invalid Start date. Start date should be later than now and before End date", {
        variant: "error",
      });
      return false;
    } else if (
      props.type === "start-auction" &&
      (!auction.EndDateTime || new Date(auction.EndDateTime).getTime() < new Date().getTime())
    ) {
      showAlertMessage("Invalid End date. End date should be later than now and Start date", {
        variant: "error",
      });
      return false;
    }
    return true;
  };

  const handlePlaceSellingOrder = async () => {
    if (validate()) {
      setLoading(true);
      const payload = {
        Address: sale?.SelectedMedia?.PodAddress ? sale?.SelectedMedia?.PodAddress : user.address,
        ExchangeToken: sale?.SelectedMedia?.MediaSymbol,
        InitialAmount: 1,
        OfferToken: sale.Token,
        Price: sale.Price.toString(),
      };
      payloadRef.current = payload;
      const netType = sale.SelectedMedia.BlockchainNetwork ?? sale.blockchainNet;
      /// Some old Privi Chain NFTs don't have netType
      if (netType === BlockchainNets[0].value || !netType) {
        // CREATE EXCHANGE ON PRIVI CHAIN
        createExchangeOnPrivi();
      } else if (netType === BlockchainNets[1].value) {
        // CREATE EXCHANGE ON POLYGON CHAIN
        createExchangeOnPolygon();
      }
    }
  };

  const handleStartAuction = async () => {
    if (validate()) {
      setLoading(true);
      const now = new Date().getTime();
      let endDate = new Date(auction.EndDateTime);
      let startDate = new Date(auction.StartDateTime);

      let startDateTimeInMs = startDate.getTime();
      if(startDateTimeInMs < now + 15 * 60 * 1000) {
        startDateTimeInMs = now + 15 * 60 * 1000;
      }
      let endDateTimeInMs = endDate.getTime();
      let mediaSymbol = auction.SelectedMedia.MediaSymbol;

      const payload = {
        MediaSymbol: mediaSymbol,
        TokenSymbol: auction.Token,
        Owner: auction?.SelectedMedia?.PodAddress ? auction?.SelectedMedia?.PodAddress : user.address,
        BidIncrement: "0",
        StartTime: Math.floor(startDateTimeInMs / 1000),
        EndTime: Math.floor(endDateTimeInMs / 1000),
        ReservePrice: auction.ReservePrice.toString(),
        IpfHash: "",
      };
      payloadRef.current = payload;
      const netType = auction.SelectedMedia.BlockchainNetwork ?? auction.blockchainNet;
      /// Some old Privi Chain NFTs don't have netType
      if (netType === BlockchainNets[0].value || !netType) {
        // CREATE AUCTION ON PRIVI CHAIN
        createAuctionOnPrivi();
      } else if (netType === BlockchainNets[1].value) {
        // CREATE AUCTION ON POLYGON CHAIN
        createAuctionOnPolygon();
      }
    }
  };

  const createExchangeOnPrivi = async () => {
    const payload = payloadRef.current;
    createExchange(
      sale?.SelectedMedia?.PodAddress ? sale?.SelectedMedia?.PodAddress : user.address,
      payload,
      { MediaType: sale.SelectedMedia.Type }
    )
      .then(resp => {
        onAfterCreateExchange(resp);
      })
      .catch(error => {
        setLoading(false);
        showAlertMessage("Exchange creation failed: " + error, { variant: "error" });
      });
  };

  const createExchangeOnPolygon = async () => {
    const payload = payloadRef.current;

    const targetChain = BlockchainNets.find(net => net.value === auction.blockchainNet);
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
        return;
      }
    }

    const web3APIHandler = targetChain.apiHandler;
    const web3Config = targetChain.config;
    const web3 = new Web3(library.provider);

    web3APIHandler.Erc721.setApprovalForAll(web3, account!, {
      operator: web3Config.CONTRACT_ADDRESSES.ERC721_TOKEN_EXCHANGE,
      approve: true,
    }).then(resp => {
      if (resp.success) {
        const tokenId = sale?.SelectedMedia?.BlockchainId;
        const createExchangeRequest = {
          input: {
            exchangeName: "erc721exchange",
            exchangeTokenAddress: web3Config.CONTRACT_ADDRESSES.PRIVIERC721,
            offerTokenAddress: web3Config.TOKEN_ADDRESSES[sale.Token],
            tokenId: tokenId,
            price: payload.Price,
          },
          caller: account!,
        };
        web3APIHandler.Exchange.CreateERC721TokenExchange(web3, account!, createExchangeRequest).then(
          async res => {
            if (res) {
              const exchange = res.data;
              const tx = res.transaction;
              const blockchainRes = { output: { Exchanges: {}, Transactions: {} } };
              blockchainRes.output.Exchanges[exchange.exchangeId] = {
                ...payload,
                CreatorAddress: user.address,
                Id: exchange.exchangeId,
                TokenId: tokenId,
                InitialOfferId: exchange.initialOfferId,
              };
              blockchainRes.output.Transactions[tx.Id] = [tx];
              const body = {
                BlockchainRes: blockchainRes,
                AdditionalData: {
                  MediaType: sale?.SelectedMedia?.Type,
                  MediaSymbol: sale?.SelectedMedia?.MediaSymbol,
                },
              };
              const response = await Axios.post(`${URL()}/exchange/createExchange/v2_p`, body);
              onAfterCreateExchange(response.data);
            }
          }
        );
      } else {
        onAfterCreateAuction(resp);
      }
    });
  };

  const createAuctionOnPrivi = async () => {
    const payload = payloadRef.current;
    createAuction(
      auction?.SelectedMedia?.PodAddress ? auction?.SelectedMedia?.PodAddress : user.address,
      payload,
      { MediaType: auction.SelectedMedia.Type }
    )
      .then(resp => {
        onAfterCreateAuction(resp);
      })
      .catch(error => {
        setLoading(false);
        showAlertMessage("Auction creation failed", { variant: "error" });
      });
  };

  const createAuctionOnPolygon = async () => {
    const payload = payloadRef.current;

    const targetChain = BlockchainNets.find(net => net.value === auction.blockchainNet);
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
        return;
      }
    }

    const web3APIHandler = targetChain.apiHandler;
    const web3Config = targetChain.config;
    const web3 = new Web3(library.provider);

    web3APIHandler.Erc721.setApprovalForAll(web3, account!, {
      operator: web3Config.CONTRACT_ADDRESSES.ERC721_AUCTION,
      approve: true,
    }).then(resp => {
      if (resp.success) {
        const createAuctionRequest = {
          tokenAddress: web3Config.CONTRACT_ADDRESSES.PRIVIERC721,
          tokenId: auction.SelectedMedia.BlockchainId,
          mediaSymbol: payload.MediaSymbol,
          tokenSymbol: payload.TokenSymbol,
          bidToken: web3Config.TOKEN_ADDRESSES[auction.Token],
          reservePrice: payload.ReservePrice,
          ipfsHash: "0x7465737400000000000000000000000000000000000000000000000000000000",
          bidIncrement: payload.BidIncrement,
          startTime: payload.StartTime,
          endTime: payload.EndTime,
        };
        web3APIHandler.Auction.createAuction(web3, account!, createAuctionRequest).then(async res => {
          if (res) {
            const tx = res.transaction;
            const blockchainRes = { output: { Auctions: {}, Transactions: {} } };
            blockchainRes.output.Auctions[auction.SelectedMedia.MediaSymbol] = payload;
            blockchainRes.output.Transactions[tx.Id] = [tx];
            const body = {
              BlockchainRes: blockchainRes,
              AdditionalData: {
                MediaSymbol: auction.SelectedMedia.MediaSymbol,
                MediaType: auction.SelectedMedia.Type,
              },
            };
            const response = await Axios.post(`${URL()}/auction/createAuction/v2_p`, body);
            onAfterCreateAuction(response.data);
          }
        });
      } else {
        onAfterCreateAuction(resp);
      }
    });
  };

  const onAfterCreateExchange = async (resp: any) => {
    setLoading(false);
    if (resp?.success) {
      showAlertMessage("Selling order created successfully", { variant: "success" });
      props.onClose();
      if (props.reload) props.reload();
    } else showAlertMessage("Selling order failed. Please try again", { variant: "error" });
  };

  const onAfterCreateAuction = async (resp: any) => {
    setLoading(false);
    if (resp?.success) {
      showAlertMessage("Auction created successfully", { variant: "success" });
      props.onClose();
      if (props.reload) props.reload();
    } else showAlertMessage("Auction creation failed. Please try again", { variant: "error" });
  };

  return (
    <LoadingScreen
      loading={loading}
      title={`Transaction \nin progress`}
      subTitle={`Transaction is proceeding on ${
        sale?.SelectedMedia?.BlockchainNetwork || auction?.SelectedMedia?.BlockchainNetwork
      }.\nThis can take a moment, please be patient...`}
      handleClose={props.onClose}
    >
      <Modal size="medium" isOpen={props.open} onClose={props.onClose} showCloseIcon className={classes.root}>
        <div className={classes.modalContent}>
          <div className={classes.headerTitle}>{props.type === "sell-nft" ? "Sell NFT" : "NFT Auction"}</div>
          <LoadingWrapper loading={isDataLoading || isUserMediaLoading} theme={"blue"}>
            <>
              {props.type === "sell-nft" && (
                <MediaAndPriceSelect
                  title="Select Media to Sell"
                  filteredMedias={filteredMedias}
                  element={sale}
                  setter={v => setSale(v)}
                  tokensList={tokenList}
                  blockchainValue={sale.blockchainNet}
                  handleChangeBlockchain={e => {
                    setSale({
                      ...sale,
                      SelectedMedia: undefined,
                      blockchainNet: e.target.value,
                    });
                  }}
                />
              )}
              {props.type === "start-auction" && (
                <>
                  <MediaAndPriceSelect
                    title="Select Media to Auction"
                    filteredMedias={filteredMedias}
                    element={auction}
                    setter={v => setAuction(v)}
                    tokensList={tokenList}
                    blockchainValue={auction.blockchainNet}
                    handleChangeBlockchain={e => {
                      setAuction({
                        ...auction,
                        SelectedMedia: undefined,
                        blockchainNet: e.target.value,
                      });
                    }}
                  />
                  <Box mt={3}>
                    <DateAndHourSelect element={auction} setter={v => setAuction(v)} label={"Start"} />
                    <DateAndHourSelect element={auction} setter={v => setAuction(v)} label={"End"} />
                  </Box>
                </>
              )}
            </>
          </LoadingWrapper>
          <div className={classes.buttons}>
            <SecondaryButton size="medium" onClick={props.onClose}>
              Cancel
            </SecondaryButton>
            <PrimaryButton
              className={classes.primaryBtn}
              size="medium"
              onClick={props.type === "sell-nft" ? handlePlaceSellingOrder : handleStartAuction}
            >
              {props.type === "sell-nft" ? "Place Selling Order" : "Start Auction"}
            </PrimaryButton>
          </div>
        </div>
      </Modal>
    </LoadingScreen>
  );
};

///////////////////////////////////////////////////////////////////////

const useAutoCompleteStyles = makeStyles({
  root: {
    width: "100%",
  },
  listbox: {
    maxHeight: 168,
  },
  option: {
    height: 52,
  },
});

type MediaAndPriceSelectProps = {
  title: string;
  filteredMedias: any[];
  element: any;
  setter: (v) => void;
  tokensList: string[];
  blockchainValue?: any;
  handleChangeBlockchain?: any;
};

const MediaImage = ({ media }) => {
  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();
  const [imageIPFS, setImageIPFS] = useState({});
  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);
  useEffect(() => {
    if (media.cid) {
      getImageIPFS(media.cid);
    }
  }, [ipfs]);

  const getImageIPFS = async (cid: string) => {
    let files = await onGetNonDecrypt(cid, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      setImageIPFS("data:image/png;base64," + base64String);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${
          media.cid
            ? imageIPFS
            : media.Type && media.Type !== "DIGITAL_ART_TYPE"
            ? media.UrlMainPhoto
            : media.UrlMainPhoto ?? media.Url ?? media.url ?? getRandomImageUrl()
        })`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "6px",
        width: "40px",
        height: "40px",
        marginRight: "21px",
      }}
    />
  );
};

export const MediaAndPriceSelect: React.FunctionComponent<MediaAndPriceSelectProps> = ({
  title,
  filteredMedias,
  element,
  setter,
  tokensList,
  blockchainValue,
  handleChangeBlockchain,
}) => {
  const classes = sellModalStyles();
  const autocompleteStyle = useAutoCompleteStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [searchName, setSearchName] = useState<string>("");
  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());

  return (
    <div className={classes.mediaAndPriceSelect}>
      <Box className={classes.fieldTitle}>{title}</Box>
      <div className={classes.inputContainer}>
        <Autocomplete
          clearOnBlur
          id="autocomplete-share-media"
          freeSolo
          classes={autocompleteStyle}
          key={autocompleteKey}
          onChange={(event: any, newValue: any | null) => {
            if (newValue) {
              const elementCopy = { ...element };
              elementCopy.SelectedMedia = newValue;
              setter(elementCopy);
              setAutocompleteKey(new Date().getTime());
            }
          }}
          options={filteredMedias}
          renderOption={(option, { selected }) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 20px",
                borderBottom: "1px solid #eff2f8",
                margin: 0,
                width: "100%",
                height: "52px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <MediaImage media={option} />
                <div
                  style={{
                    fontStyle: "normal",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "#181818",
                    fontFamily: "Agrandir",
                  }}
                >
                  {option.MediaName ?? option.name ?? option.MediaSymbol}
                </div>
              </div>
              <AddIcon style={{ color: "#431AB7", width: "16px" }} />
            </div>
          )}
          getOptionLabel={option => option.MediaName}
          getOptionSelected={option => option.MediaSymbol === element.SelectedMedia.MediaSymbol}
          renderInput={params => (
            <InputBase
              value={searchName}
              onChange={event => {
                setSearchName(event.target.value);
              }}
              ref={params.InputProps.ref}
              inputProps={params.inputProps}
              style={{ width: "100%" }}
              autoFocus
              placeholder="Search Media by Title or Address"
            />
          )}
        />
        <img src={searchIcon} alt={"search"} />
      </div>

      {element && element.SelectedMedia && (
        <MediaDisplay selectedMedia={element.SelectedMedia} element={element} setter={setter} />
      )}
      <Box
        display="flex"
        flexDirection={isMobile ? "column" : "row"}
        justifyContent="space-between"
        gridColumnGap={16}
        mt={3}
        flexWrap="wrap"
        gridRowGap={16}
      >
        {/* <Box minWidth="140px" display="flex" flexDirection="column" flex="1">
          <Box className={classes.fieldTitle}>Blockchain</Box>
          <Box className={classes.blockchainContainer}>
            <Dropdown
              value={blockchainValue}
              menuList={BlockchainNets}
              onChange={handleChangeBlockchain}
              hasImage
            />
          </Box>
        </Box> */}
        <Box minWidth="140px" display="flex" flexDirection="column" flex="1">
          <Box className={classes.fieldTitle}>Price</Box>
          <InputWithLabelAndTooltip
            inputValue={element.Price || element.ReservePrice}
            placeHolder="0"
            onInputValueChange={e => {
              const elementCopy = { ...element };
              if (elementCopy.Price !== undefined) {
                elementCopy.Price = e.target.value;
              } else if (elementCopy.ReservePrice !== undefined) {
                elementCopy.ReservePrice = e.target.value;
              }
              setter(elementCopy);
            }}
            type="number"
            minValue="0"
            style={{ marginBottom: 0, marginTop: 0, height: 40, borderRadius: 6, width: "100%" }}
          />
        </Box>
        <div className={classes.selectorWithToken}>
          <TokenSelect
            tokens={tokensList}
            value={element.Token}
            onChange={e => {
              const elementCopy = { ...element };
              elementCopy.Token = e.target.value;
              setter(elementCopy);
            }}
          />
        </div>
      </Box>
    </div>
  );
};

const MediaDisplay = ({ selectedMedia, element, setter }) => {
  const classes = sellModalStyles();

  return (
    <div className={classes.mediaDisplay}>
      <div className={classes.leftSection}>
        <MediaImage media={selectedMedia} />
        {selectedMedia.MediaName ?? selectedMedia.name ?? selectedMedia.MediaSymbol}
      </div>
      <span
        onClick={() => {
          if (element) {
            const elementCopy = { ...element };
            elementCopy.SelectedMedia = null;
            setter(elementCopy);
          }
        }}
      >
        <img src={removeIcon} alt={"remove"} />
      </span>
    </div>
  );
};

type DateAndHourSelectProps = {
  element: any;
  setter: (v) => void;
  label: string;
};

const DateAndHourSelect: React.FunctionComponent<DateAndHourSelectProps> = ({ element, setter, label }) => {
  const classes = sellModalStyles();
  const [inputDate, setInputDate] = useState(label === "Start" ? element.StartDateTime : element.EndDateTime);

  const handleDateTime = (date: Date | null, isDate = true) => {
    if (date) {
      const elementCopy = { ...element };
      const existingDate = new Date(inputDate);
      let newDateStr;
      if (isDate) {
        newDateStr = `${date?.toLocaleDateString()} ${existingDate?.getHours()}:${existingDate?.getMinutes()}`;
        if (!isNaN(new Date(newDateStr).getTime())) {
          setInputDate(new Date(newDateStr).getTime());
        }
      } else {
        newDateStr = `${existingDate?.toLocaleDateString()} ${date?.getHours()}:${date?.getMinutes()}`;
        if (!isNaN(new Date(newDateStr).getTime())) {
          setInputDate(new Date(newDateStr).getTime());
        }
      }
      if (label === "Start") {
        elementCopy.StartDateTime = new Date(newDateStr).getTime();
      } else {
        elementCopy.EndDateTime = new Date(newDateStr).getTime();
      }
      setter(elementCopy);
    }
  };

  return (
    <div className={classes.dateHourSelect}>
      <div className="col">
        <Box className={classes.fieldTitle}>{label} Date</Box>
        <DateInput
          minDate={new Date()}
          format="MM.dd.yyyy"
          placeholder="Select date..."
          value={label === "Start" ? element.StartDateTime : element.EndDateTime}
          onChange={(date: Date | null) => handleDateTime(date)}
          height={40}
        />
      </div>

      <div className="col">
        <Box className={classes.fieldTitle}>{label} Time</Box>
        <TimeInput
          minDate={new Date()}
          format="HH:mm"
          placeholder="Select time..."
          value={label === "Start" ? element.StartDateTime : element.EndDateTime}
          onChange={(date: Date | null) => handleDateTime(date, false)}
          height={40}
        />
      </div>
    </div>
  );
};
