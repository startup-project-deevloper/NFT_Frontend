import React, { useEffect, useState } from "react";
import axios from "axios";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";

import { handleSetStatus, _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import URL from "shared/functions/getURL";
import { switchNetwork } from "shared/functions/metamask";

import { Box, Grid, InputBase } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { DateInput } from "shared/ui-kit/DateTimeInput";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import TransactionProgressModal from "shared/ui-kit/Modal/Modals/TransactionProgressModal";

import {
  getPixUserMediasByBlockchainIds,
  savePixUserMedias,
} from "shared/services/API";
import { getNFTBalanceFromMoralis } from "shared/services/API/balances/externalAPI";

import Web3Config from "shared/connectors/web3/config";
import { toNDecimals } from "shared/functions/web3";

import { useTypedSelector } from "store/reducers/Reducer";
import { useAlertMessage } from "shared/hooks/useAlertMessage";

import { useDepositNFTStyles } from "./index.styles";
import { TimeInput } from "shared/ui-kit/TimeInput";
import { LoanBlockchainNet } from "shared/constants/constants";
import { onGetNonDecrypt } from "shared/ipfs/get";
import useIPFS from "shared/utils-IPFS/useIPFS";

const removeIcon = require("assets/icons/remove_red.png");

const getRandomImageUrl = () => {
  return require(`assets/podImages/1.png`);
};

// parse it to same format as fb collection

const polygonTokenList = Object.keys(Web3Config.Polygon.TOKEN_ADDRESSES);
const ethereumTokenList = Object.keys(Web3Config.Ethereum.TOKEN_ADDRESSES);

const DepositNFT = ({ open, onClose, reload }) => {
  const classes = useDepositNFTStyles();
  const { showAlertMessage } = useAlertMessage();
  const user = useTypedSelector(state => state.user);

  const [userMedias, setUserMedias] = useState<any[]>([]);
  const [isUserMediaLoading, setIsUserMediaLoading] = useState<boolean>(false);

  const [searchName, setSearchName] = useState<string>("");
  const [selectedMedia, setSelectedMedia] = useState<any>();
  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());

  const [hash, setHash] = useState<string>("");
  const [network, setNetwork] = useState<string>("");
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const [transactionSuccess, setTransactionSuccess] = useState<boolean | null>(null);

  const [openTransactionModal, setOpenTransactionModal] = useState<boolean>(false);

  const [chainNet, setChainNet] = useState<any>(LoanBlockchainNet[0]);
  const [chain, setChain] = useState<string>(LoanBlockchainNet[0].name);
  const [token, setToken] = useState<string>("");
  const [tokenList, setTokenList] = useState<string[]>([]);

  const [interest, setInterest] = useState<string>("");
  const [reservePrice, setReservePrice] = useState<string>("");
  const currentTime = new Date();
  currentTime.setHours(new Date().getHours() + 1);
  const [expirationDate, setExpirationDate] = useState<Date>(currentTime);

  const [status, setStatus] = useState<any>(""); // show status of the operation

  const { account, library, chainId } = useWeb3React();
  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  const getImageIPFS = async (cid: string) => {
    let files = await onGetNonDecrypt(cid, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      return "data:image/png;base64," + base64String;
    }
    return "";
  };

  useEffect(() => {
    (async () => {
      if (user && user.address) {
        setIsUserMediaLoading(true);
        setTokenList(Object.keys(chainNet.config.TOKEN_ADDRESSES));
        const { result: nfts } = await getNFTBalanceFromMoralis(account!, chainNet.chainId!);
        if (nfts) {
          let parsedNFTData = nfts.map(nft => parseMoralisData(nft, account));
          let priviNFTData = parsedNFTData.filter(
            nft =>
              nft.MediaSymbol === "PRIVIERC721" || nft.MediaSymbol === "PNR" || nft.MediaSymbol === "PNFT"
          );
          let exNFTData = parsedNFTData.filter(
            nft =>
              nft.MediaSymbol !== "PRIVIERC721" && nft.MediaSymbol !== "PNR" && nft.MediaSymbol !== "PNFT"
          );

          const priviNFTIds = priviNFTData
            .map(nft => nft.BlockchainId)
            .filter((id, index, ids) => ids.indexOf(id) == index);
          const resp = await getPixUserMediasByBlockchainIds(priviNFTIds, chainNet.value);
          if (resp && resp.success) {
            priviNFTData = resp.data.filter(
              (nft, index, nfts) => nfts.findIndex(_nft => _nft.BlockchainId === nft.BlockchainId) == index
            );
          } else {
            priviNFTData = [];
          }
          priviNFTData = await Promise.all(
            priviNFTData.map(async nft => {
              const cidUrl = nft.cid ? await getImageIPFS(nft.cid) : "";
              return { ...nft, cidUrl };
            })
          );
          savePixUserMedias(exNFTData);
          setUserMedias([...priviNFTData, ...exNFTData]);
          setIsUserMediaLoading(false);
        }        
      }
    })();
  }, [user, chainNet]);

  useEffect(() => {
    setChainNet(LoanBlockchainNet.find(net => net.name === chain));
  }, [chain]);

  useEffect(() => {
    if (tokenList.length > 0) {
      setToken(tokenList[0]);
    }
  }, [tokenList]);

  const parseMoralisData = (data, address) => {
    const metadata = data.metadata ? JSON.parse(data.metadata) : {};
    return {
      BlockchainId: data.token_id,
      BlockchainNetwork: chainNet.value,
      Collabs: {},
      CreatorAddress: address,
      CreatorId: user?.id,
      HasPhoto: metadata.image != undefined,
      Hashtags: [],
      MediaDescription: metadata.description,
      MediaName: data.name ? data.name : data.symbol,
      MediaSymbol: data.symbol ? data.symbol : data.name,
      Type: "DIGITAL_ART_TYPE",
      Url: metadata.image,
      chainId: chainNet.chainId,
      contractType: data.contract_type,
      TokenContractAddress: data.token_address,
    };
  };

  const validate = () => {
    if (!interest || Number(interest) == NaN) {
      handleSetStatus(`Please input Interest`, "error", setStatus);
      return false;
    } else if (Number(interest) > 100 || Number(interest) <= 0) {
      handleSetStatus(`Interest should be between 1 and 100%`, "error", setStatus);
      return false;
    } else if (Number(reservePrice) <= 0) {
      handleSetStatus(`Please input Reserve Price`, "error", setStatus);
      return false;
    } else if (!selectedMedia) {
      handleSetStatus(`Please select an NFT`, "error", setStatus);
      return false;
    } else if (!token) {
      handleSetStatus(`Please select a principal token`, "error", setStatus);
      return false;
    } else if (!chain) {
      handleSetStatus(`Please select a chain`, "error", setStatus);
      return false;
    } else if (expirationDate.getTime() <= new Date().getTime()) {
      handleSetStatus(
        `Invalid expiration date. Expiration date should be later than now`,
        "error",
        setStatus
      );
      return false;
    }
    return true;
  };

  const handleDeposit = async () => {
    if (validate()) {
      //TODO: place bid
      const targetChain = LoanBlockchainNet.find(net => net.name === chain);
      if (chainId && chainId !== targetChain?.chainId) {
        const isHere = await switchNetwork(targetChain?.chainId || 0);
        if (!isHere) {
          handleSetStatus(`Got failed while switching over to polygon netowrk`, "error", setStatus);
          return;
        }
      }
      const web3APIHandler = targetChain.apiHandler;
      const web3Config = targetChain.config;
      const web3 = new Web3(library.provider);

      const startTimestamp = Math.ceil(new Date().getTime() / 1000);
      const endTimestamp = Math.ceil(new Date(expirationDate).getTime() / 1000);
      const decimals = await web3APIHandler.Erc20[token].decimals(web3);
      const startPrice = toNDecimals(reservePrice, decimals);
      const mediaSymbol = selectedMedia?.MediaSymbol;

      handleOpenTransactionModal(targetChain?.value);

      const tokenContractAddress =
        selectedMedia?.TokenContractAddress || web3Config.CONTRACT_ADDRESSES.PRIVIERC721;
      const tokenId = selectedMedia?.BlockchainId;
      web3APIHandler.Erc721.setApprovalForAll(
        web3,
        account!,
        {
          operator: web3Config.CONTRACT_ADDRESSES.ERC721_COLLATRALISE_AUCTION,
          approve: true,
        },
        tokenContractAddress
      ).then(resp => {
        if (resp.success) {
          const createAuctionRequest = {
            tokenContractAddress: tokenContractAddress,
            tokenId: tokenId,
            startPrice: startPrice,
            startTimestamp: startTimestamp,
            endTimestamp: endTimestamp,
            fee: Number(interest),
            fundTokenAddress: web3Config.TOKEN_ADDRESSES[token],
          };
          web3APIHandler.Loan.createAuction(web3, account!, createAuctionRequest).then(async res => {
            if (res) {
              const tx = res.transaction;
              const blockchainRes = { output: { UpdateNftCollaterals: {}, Transactions: {} } };
              blockchainRes.output.UpdateNftCollaterals[mediaSymbol] = {
                Available: 0,
                Debt: 0,
                TokenSymbol: mediaSymbol,
                FundingToken: token,
                Duration: endTimestamp - startTimestamp,
                FeePct: Number(interest),
                Bid: Number(reservePrice),
                BidderAddress: "",
                PodAddress: "",
                Chain: chain,
                CreatorAddress: user.address,
                docType: "NftCollateral",
                CreationDate: startTimestamp,
              };
              blockchainRes.output.Transactions[tx.Id] = [tx];
              const body = {
                BlockchainRes: blockchainRes,
                AdditionalData: {
                  MediaSymbol: mediaSymbol,
                  Address: user.address,
                },
              };
              setHash(tx.Id);
              const response = await axios.post(`${URL()}/nftloan/collateralizeNFT/v2_p`, body);
              if (response.data.success) {
                showAlertMessage("NFT deposited successfully: ", { variant: "success" });
                setUserMedias(userMedias.filter(media => media.MediaSymbol !== selectedMedia?.MediaSymbol));
                reload();
              } else {
                showAlertMessage("NFT deposition failed: ", { variant: "error" });
              }
              setTransactionInProgress(false);
              setTransactionSuccess(true);
            } else {
              setTransactionInProgress(false);
              setTransactionSuccess(false);
            }
          });
        } else {
          setTransactionInProgress(false);
          setTransactionSuccess(false);
        }
      });
    }
  };

  const handleOpenTransactionModal = network => {
    setOpenTransactionModal(true);
    setTransactionInProgress(true);
    setNetwork(network);
  };

  const handleCloseTransactionModal = () => {
    setOpenTransactionModal(false);
    onClose();
  };

  const [inputDate, setInputDate] = useState(expirationDate.getTime());

  const handleDateTime = (date: Date | null, isDate = true) => {
    if (date) {
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
      setExpirationDate(new Date(newDateStr));
    }
  };

  return (
    <Modal size="medium" isOpen={open} onClose={onClose} className={classes.modal} showCloseIcon={true}>
      <h3>NFT Loan</h3>

      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <div className={classes.label}>Select your NFT</div>
          <LoadingWrapper loading={isUserMediaLoading} theme={"blue"}>
            <Autocomplete
              clearOnBlur
              id="autocomplete-media"
              key={autocompleteKey}
              onChange={(event: any, newValue: any | null) => {
                if (newValue) {
                  setSelectedMedia(newValue);
                  setAutocompleteKey(new Date().getTime());
                }
              }}
              options={userMedias}
              renderOption={(option, { selected }) => <MediaTile media={option} />}
              getOptionLabel={option => option.MediaName || option.title || ""}
              getOptionSelected={option => option.MediaSymbol === selectedMedia.MediaSymbol}
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
                  placeholder="Select the NFT that you want to deposit"
                />
              )}
            />
          </LoadingWrapper>
        </Grid>
        {selectedMedia && (
          <div className={classes.mediaDisplay}>
            <div className={classes.leftSection}>
              <div
                className={classes.mediaImage}
                style={{
                  backgroundImage: `url(${
                    selectedMedia.cidUrl
                      ? selectedMedia.cidUrl
                      : selectedMedia.Type && selectedMedia.Type !== "DIGITAL_ART_TYPE"
                      ? selectedMedia.UrlMainPhoto
                      : selectedMedia.UrlMainPhoto ??
                        selectedMedia.Url ??
                        selectedMedia.url ??
                        getRandomImageUrl()
                  })`,
                }}
              />
              {selectedMedia.MediaName ?? selectedMedia.name ?? selectedMedia.MediaSymbol}
            </div>
            <span
              onClick={() => {
                setSelectedMedia(null);
              }}
            >
              <img src={removeIcon} alt={"remove"} />
            </span>
          </div>
        )}
        <Grid item xs={12} md={6}>
          <div className={classes.label}>Chain</div>
          <TokenSelect
            tokens={LoanBlockchainNet}
            networks
            value={chain}
            onChange={e => {
              setChain(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.label}>Principal Token</div>
          <TokenSelect
            tokens={tokenList}
            value={token}
            onChange={e => {
              setToken(e.target.value);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputWithLabelAndTooltip
            overriedClasses=""
            type="number"
            minValue={0}
            onInputValueChange={e => {
              let num = Number(e.target.value);
              if (num != NaN) setReservePrice(num.toString());
            }}
            inputValue={reservePrice}
            labelName={"Reserve Price"}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <InputWithLabelAndTooltip
            overriedClasses=""
            type="number"
            minValue={0}
            maxValue={100}
            onInputValueChange={e => {
              let num = Number(e.target.value);
              if (num != NaN) setInterest(num.toString());
            }}
            inputValue={interest}
            labelName={"Interest"}
            endAdornment={<span>%</span>}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.label}>Expiration Date</div>
          <DateInput
            id="date-picker-expiration-date"
            minDate={new Date()}
            format="MM.dd.yyyy"
            placeholder="Select date..."
            value={expirationDate}
            onChange={e => {
              handleDateTime(e);
            }}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <div className={classes.label}>Expiration Time</div>
          <TimeInput
            minDate={new Date()}
            format="HH:mm"
            placeholder="Select time..."
            value={expirationDate}
            onChange={(date: Date | null) => handleDateTime(date, false)}
          />
        </Grid>
      </Grid>

      <Box display="flex" justifyContent="flex-end" mt="40px">
        <PrimaryButton className={classes.primaryBtn} onClick={handleDeposit} size="medium">
          Deposit now
        </PrimaryButton>
      </Box>
      {status && (
        <AlertMessage
          key={status.key}
          message={status.msg}
          variant={status.variant}
          onClose={() => setStatus(undefined)}
        />
      )}
      <TransactionProgressModal
        open={openTransactionModal}
        onClose={handleCloseTransactionModal}
        transactionInProgress={transactionInProgress}
        transactionSuccess={transactionSuccess}
        hash={hash}
        network={network}
      />
    </Modal>
  );
};

const MediaTile = ({ media }) => {
  const classes = useDepositNFTStyles();

  return (
    <Box width="1" display="flex" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center">
        <div
          className={classes.mediaImage}
          style={{
            backgroundImage: `url(${
              media.cidUrl
                ? media.cidUrl
                : media.Type && media.Type !== "DIGITAL_ART_TYPE"
                ? media.UrlMainPhoto
                : media.UrlMainPhoto ?? media.Url ?? media.url ?? getRandomImageUrl()
            })`,
          }}
        />
        <Box>
          <div className={classes.mediaTitle}>{media.MediaName ?? media.title}</div>
        </Box>
      </Box>

      <SecondaryButton size="medium">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path
            d="M6 1V11M1 6L11 6"
            stroke="#181818"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>{" "}
        Select
      </SecondaryButton>
    </Box>
  );
};

export default DepositNFT;
