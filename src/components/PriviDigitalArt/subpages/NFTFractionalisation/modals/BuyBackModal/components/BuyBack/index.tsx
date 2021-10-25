import React, { useState, useEffect } from "react";
import { makeStyles, Theme, createStyles } from "@material-ui/core/styles";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Box from "shared/ui-kit/Box";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import axios from "axios";
import URL from "shared/functions/getURL";
import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { toNDecimals } from "shared/functions/web3";

declare let window: any;
const isProd = process.env.REACT_APP_ENV === "prod";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      padding: 50,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      width: "100%",
      maxWidth: 540,
      textAlign: "center",
    },
    title: {
      fontSize: 20,
      fontWeight: 800,
      lineHeight: "104.5%",
      color: "#181818",
    },
    description: {
      fontSize: 16,
      lineHeight: "150%",
      color: "rgba(24, 24, 24, 0.7)",
    },
    laterBtn: {
      height: 34,
      backgroundColor: "transparent",
      color: "#431AB7",
      border: "1px solid #431AB7",
      padding: "8px 58px",
      fontSize: 14,
      fontWeight: 800,
      borderRadius: 4,
      marginRight: 10,

      [theme.breakpoints.down("sm")]: {
        width: "100%",
        marginBottom: 10,
        marginRight: 0,
      },
    },
    buttonWrapper: {
      marginTop: 30,
      display: "flex",
      justifyContent: "center",

      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
      },
    },
    btn: {
      height: 34,
      backgroundColor: "#431AB7",
      color: "white",
      padding: "8px 58px",
      fontSize: 14,
      fontWeight: 800,
      borderRadius: 4,

      [theme.breakpoints.down("sm")]: {
        width: "100%",
        marginBottom: 10,
        marginTop: 10,
      },
    },
    proceedBtn: {
      height: 34,
      backgroundColor: "#431AB7",
      color: "white",
      padding: "8px 58px",
      fontSize: 14,
      fontWeight: 800,
      borderRadius: 4,
      width: "100%",
    },
    checkBtn: {
      height: 40,
      backgroundColor: "#431AB7",
      color: "white",
      marginTop: 30,
      padding: "11px 32px",
      fontSize: 14,
      fontWeight: 700,
      borderRadius: 4,
    },
    hash: {
      cursor: "pointer",
    },
    result: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    table: {
      display: "flex",
      flexDirection: "column",
      color: "#431AB7",
      fontSize: "14px",
      marginTop: 40,
    },
    ownedRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    flexRow: {
      display: "flex",
      alignItems: "center",
    },
    status: {
      width: 13,
      height: 13,
      borderRadius: "50%",
      background: "#D9F66F",
      marginRight: 10,
    },
    detail: {
      display: "flex",
      flexDirection: "column",
      padding: "20px",
      background: "rgba(158, 172, 242, 0.2)",
      borderRadius: "12px",
      margin: "6px 0",
    },
    divider: {
      border: "1px solid #431AB7",
      opacity: 0.1,
      margin: "16px 0",
    },
    detailRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      "& p": {
        margin: 0,
      },
      "& div": {
        fontFamily: "Agrandir GrandHeavy",
      },
    },
    unit: {
      opacity: 0.5,
    },
    total: {
      display: "flex",
      flexDirection: "column",
      padding: "20px",
      background: "rgba(221, 255, 87, 0.4)",
      borderRadius: "12px",
      margin: "6px 0",
    },
  })
);

export default function BuyBack({ onClose, onCompleted, needBuyBackLaterBtn = true, nft }) {
  const classes = useStyles();
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");
  const [availableJots, setAvailableJots] = useState<number>(0);
  const [buybackRequiredAmount, setBuybackRequiredAmount] = useState<number>(0);
  const [buybackPrice, setBuybackPrice] = useState<number>(0);

  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    (async () => {
      const selectedChain = BlockchainNets.find(b => b.name === "POLYGON");
      if (!selectedChain) return;
      try {
        const web3APIHandler = selectedChain.apiHandler;
        const web3 = new Web3(library.provider);
        const payload = {
          nft,
        };
        web3APIHandler.SyntheticCollectionManager.getBuybackRequiredAmount(
          web3,
          payload
        ).then(buybackRequiredAmount => setBuybackRequiredAmount(buybackRequiredAmount));
        web3APIHandler.SyntheticCollectionManager.getAvailableBuyback(web3, payload).then(availableBuyback =>
          setAvailableJots(+availableBuyback.jots)
        );
        web3APIHandler.SyntheticCollectionManager.getBuybackPrice(web3, payload).then(price =>
          setBuybackPrice(price)
        );
      } catch (err) {}
    })();
  }, [nft]);

  const handleProceed = async () => {
    console.log("chainId", chainId);
    if (chainId !== 80001 && chainId !== 137) {
      let changed = await switchNetwork(isProd ? 137 : 80001);
      if (!changed) {
        showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
        return;
      }
    }
    setIsProceeding(true);
    const selectedChain = BlockchainNets.find(b => b.name === "POLYGON");
    if (!selectedChain) {
      setIsProceeding(false);
      return;
    }
    try {
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);
      const decimals = await web3APIHandler.Erc20["USDT"].decimals(web3);
      const amount = toNDecimals(buybackRequiredAmount, decimals);

      const approveResponse = await web3APIHandler.Erc20["USDT"].approve(
        web3,
        account!,
        nft.SyntheticCollectionManagerAddress,
        amount
      );
      if (!approveResponse) {
        setIsProceeding(false);
        return;
      }

      const setHash_ = hash => {
        setHash(hash);
      };
      const payload = {
        nft,
        setHash: setHash_,
      };
      const response = await web3APIHandler.SyntheticCollectionManager.buyBack(web3, account!, payload);
      setIsProceeding(false);
      if (response.success) {
        const params = {
          collectionAddress: nft.collection_id,
          syntheticID: nft.SyntheticID,
        };
        const { data } = await axios.post(`${URL()}/syntheticFractionalize/withdrawNFT`, params);
        if (data.success) {
          onCompleted();
        } else {
          showAlertMessage(`Got failed buyback `, { variant: "error" });
        }
      } else {
        showAlertMessage(`Got failed buyback `, { variant: "error" });
      }
    } catch (err) {
      console.log("error", err);
      setIsProceeding(false);
    }
  };

  const handleCheck = () => {
    onClose();
  };

  const handlePolygonScan = () => {
    window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${hash}`, "_blank");
  };

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {isProceeding ? (
          <>
            <LoadingWrapper loading={true} theme="blue" iconWidth="80px" iconHeight="80px"></LoadingWrapper>
            <h1 className={classes.title}>Sending request to Polygon</h1>
            <Box className={classes.result}>
              <p className={classes.description}>
                Transaction is proceeding on Polygon Chain.
                <br />
                This can take a moment, please be patient...
              </p>
              {hash && (
                <>
                  <CopyToClipboard text={hash}>
                    <Box mt="20px" display="flex" alignItems="center" className={classes.hash}>
                      Hash:
                      <Box color="#4218B5" mr={1} ml={1}>
                        {hash.substr(0, 18) + "..." + hash.substr(hash.length - 3, 3)}
                      </Box>
                      <CopyIcon />
                    </Box>
                  </CopyToClipboard>
                  <button className={classes.checkBtn} onClick={handlePolygonScan}>
                    Check on Polygon Scan
                  </button>
                </>
              )}
            </Box>
          </>
        ) : (
          <>
            <h1 className={classes.title}>Buy Back</h1>
            <p className={classes.description}>Buy back to get back ownership of Your NFT and withdraw it.</p>
            <div className={classes.table}>
              <div className={classes.ownedRow}>
                <span>Net owned JOTs</span>
                <div className={classes.flexRow}>
                  <div className={classes.status} />
                  <span>{`${availableJots} JOTs`}</span>
                </div>
              </div>
              <div className={classes.detail}>
                <div className={classes.detailRow}>
                  <p>Jots left to buy back</p>
                  <div>
                    {Math.floor((10000 - availableJots) * 10000) / 10000}&nbsp;<span className={classes.unit}>JOT</span>
                  </div>
                </div>
                <div className={classes.divider} />
                <div className={classes.detailRow}>
                  <p>Buy back price</p>
                  <div>
                    {buybackPrice}&nbsp;<span className={classes.unit}>USDT/JOT</span>
                  </div>
                </div>
              </div>
              <div className={classes.total}>
                <div className={classes.detailRow}>
                  <p>Total to pay</p>
                  <div>
                    {Math.floor(buybackRequiredAmount * 10000) / 10000}&nbsp;<span className={classes.unit}>USDT</span>
                  </div>
                </div>
              </div>
            </div>
            {needBuyBackLaterBtn ? (
              <Box className={classes.buttonWrapper}>
                <button className={classes.laterBtn} onClick={onClose}>
                  Cancel
                </button>
                <button className={classes.btn} onClick={handleProceed}>
                  Proceed
                </button>
              </Box>
            ) : (
              <button className={classes.proceedBtn} onClick={handleProceed}>
                Proceed
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
