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

const isProd = process.env.REACT_APP_ENV === "prod";
const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

export default function BuyJotsModal({
  open,
  collectionId,
  nft,
  handleRefresh = () => {},
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
  const [openLoading, setOpenLoading] = React.useState(false);

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setOpenLoading(false);
    }
  }, [open]);

  useEffect(() => {
    if (selectedChain && chainId && selectedChain.chainId !== chainId) {
      (async () => {
        const changed = await switchNetwork(selectedChain.chainId);
        if (!changed) {
          setSelectedChain(filteredBlockchainNets.find(b => b.chainId === chainId));
        }
      })();
    }
  }, [chainId, selectedChain]);

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
        setMaxJot(usdt / (+nft.Price || 1));
      }
    })();
  }, [open, nft, selectedChain]);

  const handleBuyJots = async () => {
    if (+jots > maxJot) {
      showAlertMessage(`Can't be exceed the max JOTs.`, { variant: "error" });
      return;
    }

    setLoading(true);
    setOpenLoading(true);
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
      setOpenLoading(false);
      showAlertMessage("Failed to approve. Please try again", { variant: "error" });
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
      setOpenLoading(false);
      showAlertMessage("Failed to buy Jots. Please try again", { variant: "error" });
      return;
    }

    setLoading(false);
    const response = await buyJots({
      collectionId,
      syntheticId: nft.SyntheticID,
      amount: jots,
      investor: account!,
      hash: contractResponse.data.hash,
    });

    if (!response.success) {
      showAlertMessage("Failed to save transactions.", { variant: "error" });
      return;
    }

    showAlertMessage("You bought JOTs successuflly", { variant: "success" });
    handleRefresh();
  };

  const handlePolygonScan = () => {
    window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${hash}`, "_blank");
  };

  if (openLoading) {
    return (
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.root}>
        <Box style={{ textAlign: "center", paddingTop: "50px", paddingBottom: "50px" }}>
          {loading && (
            <LoadingWrapper loading theme="purple" iconWidth="80px" iconHeight="80px"></LoadingWrapper>
          )}
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
          endAdornment={<div className={classes.purpleText}>JOTS</div>}
        />
        <Grid container>
          <Grid item md={7} xs={12}>
            <Box className={classes.leftBalance} display="flex" alignItems="center">
              <Header5 style={{ marginBottom: 0 }}>Wallet Balance</Header5>
              <Box className={classes.usdWrap} display="flex" alignItems="center" ml={2}>
                <Box className={classes.point}></Box>
                <Header5 style={{ fontWeight: 800, paddingLeft: "10px", marginBottom: 0 }}>
                  {usdtBalance.toFixed(2)} USDT
                </Header5>
              </Box>
            </Box>
          </Grid>
          <Grid item md={5} xs={12}>
            <Box
              className={classes.rightBalance}
              flexGrow={1}
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Box>MAX: {maxJot.toFixed(2)}</Box>
              <Box color="rgba(67,26, 183, 0.4)" paddingX="15px" onClick={() => setJOTs(maxJot)}>
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
