import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Axios from "axios";
import Web3 from "web3";
import { InputBase, makeStyles } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { useWeb3React } from "@web3-react/core";
import { RootState } from "store/reducers/Reducer";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import URL from "shared/functions/getURL";
import { Modal, PrimaryButton, SecondaryButton, HeaderBold4, TabNavigation } from "shared/ui-kit";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { TimeInput } from "shared/ui-kit/TimeInput";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { Dropdown } from "shared/ui-kit/Select/Select";
import { BlockchainNets } from "shared/constants/constants";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";
import { getUserMedias, createAuction, createExchange } from "shared/services/API";
import PolygonAPI from "shared/services/API/polygon";
import PolygonConfig from "shared/connectors/polygon/config";
import { sellModalStyles } from "./index.styles";
import { priviTokenList } from "shared/constants/constants";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { onGetDecrypt, onGetNonDecrypt } from "shared/ipfs/get";

import { ReactComponent as AddIcon } from "assets/icons/plus-solid.svg";
const searchIcon = require("assets/icons/search.png");
const removeIcon = require("assets/icons/remove_red.png");

const getRandomImageUrl = () => {
  return require(`assets/backgrounds/digital_art_1.png`);
};


export const SellModal = (props: any) => {
  const classes = sellModalStyles();
  //store
  const user = useSelector((state: RootState) => state.user);
  const { showAlertMessage } = useAlertMessage();
  //hooks
  const [tabSelection, setTabSelection] = useState<number>(0);
  const [userMedias, setUserMedias] = useState<any[]>([]);
  const [sale, setSale] = useState<any>({
    SelectedMedia: undefined,
    Price: "",
    Token: 'BAL',
    blockchainNet: BlockchainNets[1].value,
  });
  const [auction, setAuction] = useState<any>({
    SelectedMedia: undefined,
    ReservePrice: "",
    Token: 'BAL',
    StartDateTime: new Date().getTime(),
    EndDateTime: new Date().getTime(),
    TokensAllowed: [],
    blockchainNet: BlockchainNets[1].value,
  });
  const [tokenList, setTokenList] = useState<string[]>(priviTokenList);

  const [isUserMediaLoading, setIsUserMediaLoading] = useState<boolean>(false);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(false);

  const payloadRef = useRef<any>({});

  const { account, library, chainId } = useWeb3React();

  // change token list according chain
  useEffect(() => {
    const item = props.type === "sell-nft" ? sale : props.type === "start-auction" ? auction : null;
    if (item) {
      let newTokenList;
      if (item.blockchainNet == BlockchainNets[0].value) newTokenList = priviTokenList;
      else if (item.blockchainNet == BlockchainNets[1].value)
        newTokenList = Object.keys(PolygonConfig.TOKEN_ADDRESSES);
      if (newTokenList) {
        setTokenList(newTokenList);
        setAuction({ ...auction, Token: newTokenList[0] });
        setSale({ ...sale, Token: newTokenList[0] });
      }
    }
  }, [sale.blockchainNet, auction.blockchainNet, props.type]);

  useEffect(() => {
    if (props.open === true) {
      getUserMedias(user.address)
        .then(resp => {
          if (resp && resp.success) {
            const media = [...resp.data] || [];
            if (media.length > 0) {
              media.forEach((m, index) => {
                if (m.HasPhoto) {
                  media[index].imageURL = `${URL()}/media/getMediaMainPhoto/${m.MediaSymbol.replace(
                    /\s/g,
                    ""
                  )}`;
                }
              });
            }
            setUserMedias(
              media.filter(item => !item.Auctions && !item.Exchange && (!item.PodAddress || item.IsUploaded))
            );
          }
          setIsUserMediaLoading(false);
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

  const validate = () => {
    if ((tabSelection === 0 && !sale.SelectedMedia) || (tabSelection === 1 && !auction.SelectedMedia)) {
      showAlertMessage("Please select a media", { variant: "error" });
      return false;
    } else if (
      (tabSelection === 0 && (!sale.Token || sale.Token === "")) ||
      (tabSelection === 1 && (!auction.Token || auction.Token === ""))
    ) {
      showAlertMessage("Please select a Token for the price", { variant: "error" });
      return false;
    } else if (
      (tabSelection === 0 && (!sale.Price || sale.Price <= 0)) ||
      (tabSelection === 1 && (!auction.ReservePrice || auction.ReservePrice <= 0))
    ) {
      showAlertMessage("Invalid Price. Price should be higher than 0", { variant: "error" });
      return false;
    } else if (
      tabSelection === 1 &&
      (!auction.StartDateTime ||
        new Date(auction.StartDateTime).getTime() < new Date().getTime() ||
        new Date(auction.StartDateTime).getTime() >= new Date(auction.EndDateTime).getTime())
    ) {
      showAlertMessage("Invalid Start date. Start date should be later than now and before End date", {
        variant: "error",
      });
      return false;
    } else if (
      tabSelection === 1 &&
      (!auction.EndDateTime || new Date(auction.EndDateTime).getTime() < new Date().getTime())
    ) {
      showAlertMessage("Invalid End date. End date should be later than now and Start date", {
        variant: "error",
      });
      return false;
    } else return true;
  };

  const handlePlaceSellingOrder = async () => {
    if (validate()) {
      const payload = {
        Address: sale?.SelectedMedia?.PodAddress ? sale?.SelectedMedia?.PodAddress : user.address,
        ExchangeToken: sale?.SelectedMedia?.MediaSymbol,
        InitialAmount: 1,
        OfferToken: sale.Token,
        Price: sale.Price.toString(),
      };
      payloadRef.current = payload;

      const netType = sale.SelectedMedia.BlockchainNetwork ?? sale.blockchainNet;
      if (netType === BlockchainNets[0].value) {
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
      let endDate = new Date(auction.EndDateTime);
      let startDate = new Date(auction.StartDateTime);

      let startDateTimeInMs = startDate.getTime();
      let endDateTimeInMs = endDate.getTime();
      let mediaSymbol = auction.SelectedMedia.MediaSymbol;

      const payload = {
        MediaSymbol: mediaSymbol,
        TokenSymbol: auction.Token,
        Owner: user.address,
        BidIncrement: "0",
        StartTime: Math.floor(startDateTimeInMs / 1000),
        EndTime: Math.floor(endDateTimeInMs / 1000),
        ReservePrice: auction.ReservePrice.toString(),
        IpfHash: "",
      };
      payloadRef.current = payload;

      const netType = auction.SelectedMedia.BlockchainNetwork ?? auction.blockchainNet;
      // hlf
      if (netType === BlockchainNets[0].value) {
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
        showAlertMessage("Exchange creation failed: " + error, { variant: "error" });
      });
  };

  const createExchangeOnPolygon = async () => {
    const payload = payloadRef.current;
    const web3 = new Web3(library.provider);

    // ERC20 TEST TOKEN CONTRACT DEPLOY
    // PolygonAPI.Erc20.instantiate(web3, account!).then(resp => {});

    PolygonAPI.Erc721.setApprovalForAll(web3, account!, {
      operator: PolygonConfig.CONTRACT_ADDRESSES.ERC721_TOKEN_EXCHANGE,
      approve: true,
    }).then(resp => {
      if (resp.success) {
        PolygonAPI.Erc721.mint(web3, account!, { recipients: [], royalties: [] }).then(tokenId => {
          if (tokenId) {
            const createExchangeRequest = {
              input: {
                exchangeName: "erc721exchange",
                exchangeTokenAddress: PolygonConfig.CONTRACT_ADDRESSES.ERC721_WITH_ROYALTY,
                offerTokenAddress: PolygonConfig.TOKEN_ADDRESSES[sale.Token],
                tokenId: tokenId,
                price: payload.Price,
              },
              caller: account!,
            };
            PolygonAPI.Exchange.CreateERC721TokenExchange(web3, account!, createExchangeRequest).then(
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
          }
        });
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
        showAlertMessage("Auction creation failed: " + error, { variant: "error" });
      });
  };

  const createAuctionOnPolygon = async () => {
    const payload = payloadRef.current;
    const web3 = new Web3(library.provider);

    PolygonAPI.Erc721.setApprovalForAll(web3, account!, {
      operator: PolygonConfig.CONTRACT_ADDRESSES.ERC721_AUCTION,
      approve: true,
    }).then(resp => {
      if (resp.success) {
        const createAuctionRequest = {
          tokenAddress: PolygonConfig.CONTRACT_ADDRESSES.ERC721_WITH_ROYALTY,
          tokenId: auction.SelectedMedia.BlockchainId,
          mediaSymbol: auction.SelectedMedia.MediaSymbol,
          tokenSymbol: auction.Token,
          bidToken: PolygonConfig.TOKEN_ADDRESSES[auction.Token],
          reservePrice: payload.ReservePrice,
          ipfsHash: "0x7465737400000000000000000000000000000000000000000000000000000000",
          bidIncrement: payload.BidIncrement,
          startTime: payload.StartTime,
          endTime: payload.EndTime,
        };

        PolygonAPI.Auction.createAuction(web3, account!, createAuctionRequest).then(async auction => {
          const blockchainRes = { output: { Auctions: {} } };
          blockchainRes.output.Auctions[auction.SelectedMedia.MediaSymbol] = auction;
          const body = {
            BlockchainRes: blockchainRes,
            AdditionalData: {
              MediaSymbol: auction.SelectedMedia.MediaSymbol,
              MediaType: auction.SelectedMedia.Type,
            },
          };
          const response = await Axios.post(`${URL()}/auction/createAuction/v2_p`, body);
          onAfterCreateAuction(response.data);
        });
      }
    });
  };

  const onAfterCreateExchange = async (resp: any) => {
    if (resp?.success) {
      showAlertMessage("Selling order created successfully", { variant: "success" });
      setTimeout(() => {
        props.onClose();
        if (props.handleRefresh) props.handleRefresh();
      }, 1000);
    } else showAlertMessage("Selling order failed", { variant: "error" });
  };

  const onAfterCreateAuction = async (resp: any) => {
    if (resp?.success) {
      showAlertMessage("Auction created successfully", { variant: "success" });
      setTimeout(() => {
        props.onClose();
        if (props.handleRefresh) props.handleRefresh();
      }, 1000);
    } else showAlertMessage("Auction creation failed", { variant: "error" });
  };

  return (
    <Modal size="medium" isOpen={props.open} onClose={props.onClose} showCloseIcon className={classes.root}>
      <div className={classes.modalContent}>
        <HeaderBold4>Sell</HeaderBold4>
        <div className={classes.appbarContainer}>
          <TabNavigation
            tabs={["Set a Price", "Start Auction"]}
            currentTab={tabSelection}
            variant="primary"
            theme="cyan"
            onTabChange={setTabSelection}
          />
        </div>
        <LoadingWrapper loading={isDataLoading || isUserMediaLoading} theme={"blue"}>
          <>
            {tabSelection === 0 ? (
              <>
                <MediaAndPriceSelect
                  userMedias={userMedias}
                  blockchainValue={sale.blockchainNet}
                  element={sale}
                  setter={v => setSale(v)}
                  tokensList={tokenList}
                />
                {/* <Box display="flex" width="100%" flexDirection="column" mt={3} mb={5}>
                  <Box fontSize={18} fontWeight={400} color="#000000">
                    Choose Blockchain Network
                  </Box>
                  <Dropdown
                    value={sale.blockchainNet}
                    menuList={BlockchainNets.filter((_, index) => index > 0)}
                    onChange={e => {
                      setSale({
                        ...sale,
                        SelectedMedia: undefined,
                        blockchainNet: e.target.value,
                      });
                    }}
                    hasImage
                  />
                </Box> */}
              </>
            ) : (
              <>
                <MediaAndPriceSelect
                  userMedias={userMedias}
                  blockchainValue={auction.blockchainNet}
                  element={auction}
                  setter={v => setAuction(v)}
                  tokensList={tokenList}
                />
                {/* <Box display="flex" width="100%" flexDirection="column" mt={3} mb={5}>
                  <Box fontSize={18} fontWeight={400} color="#000000">
                    Choose Blockchain Network
                  </Box>
                  <Dropdown
                    value={auction.blockchainNet}
                    menuList={BlockchainNets.filter((_, index) => index > 0)}
                    onChange={e => {
                      setAuction({
                        ...auction,
                        SelectedMedia: undefined,
                        blockchainNet: e.target.value,
                      });
                    }}
                    hasImage
                  />
                </Box> */}
                <DateAndHourSelect element={auction} setter={v => setAuction(v)} label={"Start"} />
                <DateAndHourSelect element={auction} setter={v => setAuction(v)} label={"End"} />
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
            onClick={tabSelection === 0 ? handlePlaceSellingOrder : handleStartAuction}
          >
            {tabSelection === 0 ? "Place Selling Order" : "Start Auction"}
          </PrimaryButton>
        </div>
      </div>
    </Modal>
  );
};

//////////////////////////////////////////////////////////////////////

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
}

type MediaAndPriceSelectProps = {
  userMedias: any[];
  blockchainValue: string;
  element: any;
  setter: (v) => void;
  tokensList: any[];
};

export const MediaAndPriceSelect: React.FunctionComponent<MediaAndPriceSelectProps> = ({
  userMedias,
  blockchainValue,
  element,
  setter,
  tokensList
}) => {
  const classes = sellModalStyles();
  const autocompleteStyle = useAutoCompleteStyles();

  const [searchName, setSearchName] = useState<string>("");
  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());

  const [filteredMedias, setFilteredMedias] = useState<any[]>([]);

  useEffect(() => {
    setFilteredMedias(
      userMedias.filter(
        m =>
          (blockchainValue == "Privi Chain" && !m.BlockchainNetwork) ||
          m.BlockchainNetwork === blockchainValue
      )
    );
  }, [userMedias, blockchainValue]);

  return (
    <div className={classes.mediaAndPriceSelect}>
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
              // reset search query
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
                padding: "12px 20px",
                borderBottom: "1px solid #eff2f8",
                margin: 0,
                width: "100%",
                height: "52px"
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

      <div style={{ color: "black", fontSize: 18, fontWeight: 400, marginTop: 30 }}>
        {element.Price !== undefined ? "Price" : "Starting Price"}
      </div>
      <div className={classes.row}>
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
          style={{ marginBottom: 0 }}
        />
        <div className={classes.selectorWithToken} style={{ border: "unset", height: "unset" }}>
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
      </div>
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

  const handleDateTime = (date: Date | null) => {
    const elementCopy = { ...element };
    if (label === "Start") {
      elementCopy.StartDateTime = date?.getTime();
    } else {
      elementCopy.EndDateTime = date?.getTime();
    }
    setter(elementCopy);
  };

  return (
    <div className={classes.dateHourSelect}>
      <div className="col">
        <label>{label} Time</label>
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
        <label>{label} Hour</label>
        <TimeInput
          minDate={new Date()}
          format="HH:mm"
          placeholder="Select time..."
          value={label === "Start" ? element.StartDateTime : element.EndDateTime}
          onChange={(date: Date | null) => handleDateTime(date)}
          height={40}
        />
      </div>
    </div>
  );
};
