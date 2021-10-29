import React, { useEffect } from "react";
import Web3 from "web3";
import { Grid } from "@material-ui/core";
import { Header3, Header5, Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { BuyJotsModalStyles } from "./index.style";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { buyJots } from "shared/services/API/SyntheticFractionalizeAPI";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import CopyToClipboard from "react-copy-to-clipboard";
import { ReactComponent as CopyIcon } from "assets/icons/copy-icon.svg";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import TransactionResultModal from "../TransactionResultModal";
import {typeUnitValue} from "shared/helpers/utils";

const isProd = process.env.REACT_APP_ENV === "prod";
const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

export default function BuyJotsModal({
  open,
  collectionId,
  nft,
  handleRefresh,
  handleClose = () => {},
}) {
  const classes = BuyJotsModalStyles();

  const { showAlertMessage } = useAlertMessage();

  const [jots, setJOTs] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { account, library, chainId } = useWeb3React();

  const [selectedChain, setSelectedChain] = React.useState<any>(filteredBlockchainNets[0]);

  const [usdtBalance, setUsdtBalance] = React.useState<number>(0);
  const [maxJot, setMaxJot] = React.useState<number>(0);
  const [hash, setHash] = React.useState<string>("");

  const [result, setResult] = React.useState<number>(0);

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setResult(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (selectedChain && chainId && selectedChain.chainId !== chainId) {
      (async () => {
        const changed = await switchNetwork(selectedChain.chainId);
        if (!changed) {
          setSelectedChain(filteredBlockchainNets.find(b => b.chainId === chainId));
        }
      })();
    }
  }, [chainId, selectedChain, open]);

  useEffect(() => {
    if (!open) {
      setJOTs(0)
    }
  }, [open])

  useEffect(() => {
    if (!open) return;

    (async () => {
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);

      const decimals = await web3APIHandler.Erc20["USDT"].decimals(web3);
      const balance = await web3APIHandler.Erc20["USDT"].balanceOf(web3, { account });
      if (balance) {
        const usdt = parseInt(toDecimals(balance, decimals));
        setUsdtBalance(usdt);
        setMaxJot(Math.max(nft.SellingSupply - nft.SoldSupply, 0));
      }
    })();
  }, [open, nft, selectedChain]);

  const handleBuyJots = async () => {
    if (+jots > maxJot) {
      showAlertMessage(`Can't be exceed the max JOTs.`, { variant: "error" });
      return;
    }

    setLoading(true);
    // For polygon chain
    const targetChain = BlockchainNets[1];
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
        return;
      }
    }
    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    const decimals = await web3APIHandler.Erc20["USDT"].decimals(web3);
    const amount = toNDecimals(+jots * (+nft.Price || 1), decimals);

    const approveResponse = await web3APIHandler.Erc20["USDT"].approve(
      web3,
      account!,
      nft.SyntheticCollectionManagerAddress,
      amount
    );

    if (!approveResponse) {
      setLoading(false);
      setResult(-1);
      return;
    }

    const contractResponse = await web3APIHandler.SyntheticCollectionManager.buyJotTokens(
      web3,
      account!,
      nft,
      {
        tokenId: +nft.SyntheticID,
        amount: +jots,
        setHash,
      }
    );
    if (!contractResponse.success) {
      setLoading(false);
      setResult(-1);
      return;
    }

    const { sellingSupply, soldSupply } = await handleRefresh();
    console.log('sellingsupply, soldsupply... ', sellingSupply, soldSupply)

    setLoading(false);
    const response = await buyJots({
      collectionId,
      syntheticId: nft.SyntheticID,
      amount: jots,
      investor: account!,
      sellingSupply,
      soldSupply,
      hash: contractResponse.data.hash,
    });

    if (!response.success) {
      setResult(-1);
      return;
    }

    setResult(1);
  };

  const handlePolygonScan = () => {
    window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${hash}`, "_blank");
  };

  if (loading) {
    return (
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.root}>
        <Box style={{ textAlign: "center", paddingTop: "50px", paddingBottom: "50px" }}>
          <LoadingWrapper loading theme="purple" iconWidth="80px" iconHeight="80px"></LoadingWrapper>
          <Box>
            <h3
              style={{
                fontSize: "27px",
                marginTop: "10px",
                whiteSpace: "pre-wrap",
                fontWeight: "bold",
                color: "#431AB7",
              }}
            >
              {"Transaction \nin progress".toUpperCase()}
            </h3>
            <p style={{ fontSize: "18px", marginTop: "20px", whiteSpace: "pre-wrap" }}>
              <p>
                {`Transaction is proceeding on ${selectedChain.value}.\nThis can take a moment, please be patient...`}
              </p>
              {hash && (
                <Box display="flex" flexDirection="column" alignItems="center">
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
                </Box>
              )}
            </p>
          </Box>
        </Box>
      </Modal>
    );
  }

  if (result !== 0) {
    return (
      <TransactionResultModal
        open={true}
        onClose={() => {
          setResult(0);
          handleClose();
        }}
        isSuccess={result === 1}
        hash={hash}
      />
    );
  }

  return (
    <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.root}>
      <Box>
        <Header3>Buy JOTs</Header3>
        <InputWithLabelAndTooltip
          inputValue={jots}
          onInputValueChange={e => setJOTs(e.target.value)}
          overriedClasses={classes.inputJOTs}
          maxValue={maxJot}
          required
          type="number"
          theme="light"
          endAdornment={<div className={classes.purpleText}>JOTs</div>}
        />
        <Grid container>
          <Grid item md={7} xs={5}>
            <Box className={classes.leftBalance} display="flex" alignItems="center">
              <Header5 style={{ marginBottom: 0 }}>Wallet Balance</Header5>
              <Box className={classes.usdWrap} display="flex" alignItems="center" ml={2}>
                <Box className={classes.point}></Box>
                <Header5 style={{ fontWeight: 800, paddingLeft: "10px", marginBottom: 0 }}>
                  {typeUnitValue(usdtBalance, 1)} USDT
                </Header5>
              </Box>
            </Box>
          </Grid>
          <Grid item md={5} xs={7}>
            <Box
              className={classes.rightBalance}
              flexGrow={1}
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Box>MAX: {typeUnitValue(maxJot, 1)}</Box>
              <Box color="rgba(67,26, 183, 0.4)" pl="15px" onClick={() => setJOTs(maxJot)} style={{ cursor: "pointer" }}>
                Buy Max
              </Box>
            </Box>
          </Grid>
        </Grid>
        <Box display="flex" alignItems="center" mt={6} justifyContent="space-between">
          <SecondaryButton
            size="medium"
            style={{ color: Color.Purple, width: "100px", border: "2px solid #151414" }}
            onClick={handleClose}
          >
            Cancel
          </SecondaryButton>
          <PrimaryButton
            size="medium"
            style={{ background: Color.GreenLight, width: "50%", color: Color.Purple }}
            onClick={handleBuyJots}
          >
            Confirm
          </PrimaryButton>
        </Box>
      </Box>
    </Modal>
  );
}
