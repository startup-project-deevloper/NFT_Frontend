import React, { useEffect } from "react";
import Web3 from "web3";
import { Grid } from "@material-ui/core";
import { Header3, Header5, Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { AddJotsModalStyles } from "./index.styles";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { addJots } from "shared/services/API/SyntheticFractionalizeAPI";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import TransactionResultModal from "../TransactionResultModal";
import {typeUnitValue} from "shared/helpers/utils";

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

export default function AddJotsModal({
  open,
  collectionId,
  nft,
  setNft,
  handleRefresh = () => {},
  handleClose = () => {},
}) {
  const classes = AddJotsModalStyles();

  const { showAlertMessage } = useAlertMessage();

  const [jots, setJOTs] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [result, setResult] = React.useState<number>(0);
  const [disabled, setDisabled] = React.useState<boolean>(false);
  const { account, library, chainId } = useWeb3React();

  const [selectedChain, setSelectedChain] = React.useState<any>(filteredBlockchainNets[0]);

  const [jotBalance, setJotBalance] = React.useState<number>(0);
  const [maxJot, setMaxJot] = React.useState<number>(0);
  const [hash, setHash] = React.useState<string>("");

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
    if (!open) return;

    (async () => {
      setDisabled(true);
      const web3APIHandler = selectedChain.apiHandler;
      const web3 = new Web3(library.provider);

      const jotDecimals = await web3APIHandler.Erc20["JOT"].decimals(web3, nft.JotAddress);
      const jotBalance = await web3APIHandler.Erc20["JOT"].balanceOf(web3, nft.JotAddress, { account });
      const jot = parseInt(toDecimals(jotBalance || 0, jotDecimals));

      setMaxJot(jot);
      setJotBalance(jot);
      setDisabled(false);
    })();
  }, [open, nft, selectedChain]);

  const handleAddJots = async () => {
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
        setLoading(false);
        setResult(-1);
        showAlertMessage(`Got failed while switching over to polygon network`, { variant: "error" });
        return;
      }
    }
    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);

    const decimals = await web3APIHandler.Erc20["JOT"].decimals(web3, nft.JotAddress);
    const amount = toNDecimals(+jots * (+nft.Price || 1), decimals);
    const approveResponse = await web3APIHandler.Erc20["JOT"].approve(
      web3,
      account!,
      nft.JotAddress,
      nft.SyntheticCollectionManagerAddress,
      amount
    );

    if (!approveResponse) {
      setLoading(false);
      setResult(-1);
      showAlertMessage("Failed to approve. Please try again", { variant: "error" });
      return;
    }

    const contractResponse = await web3APIHandler.SyntheticCollectionManager.depositJots(
      web3,
      account!,
      nft,
      {
        tokenId: +nft.SyntheticID,
        amount: +jots,
      }
    );
    if (!contractResponse.success) {
      setLoading(false);
      setResult(-1);
      showAlertMessage("Failed to add Jots. Please try again", { variant: "error" });
      return;
    }

    setHash(contractResponse.data.hash);

    const response = await addJots({
      collectionId,
      syntheticId: nft.SyntheticID,
      amount: +jots,
    });

    setResult(1);
    setLoading(false);
    if (!response.success) {
      showAlertMessage("Failed to save transactions.", { variant: "error" });
      return;
    }

    setNft({
      ...nft,
      OwnerSupply: (+nft.OwnerSupply + +jots).toString(),
    });
    showAlertMessage("You added JOTs successuflly", { variant: "success" });
    handleRefresh();
    handleClose();
  };

  if (result !== 0) {
    return (
      <TransactionResultModal open={true} onClose={() => setResult(0)} isSuccess={result === 1} hash={hash} />
    );
  }

  return (
    <LoadingScreen
      loading={loading}
      title={`Transaction \nin progress`}
      subTitle={`Transaction is proceeding on ${selectedChain.value}.\nThis can take a moment, please be patient...`}
      handleClose={handleClose}
    >
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon className={classes.root}>
        <Box>
          <Header3>Add JOTs</Header3>
          <InputWithLabelAndTooltip
            inputValue={jots}
            onInputValueChange={e => setJOTs(e.target.value)}
            overriedClasses={classes.inputJOTs}
            maxValue={maxJot}
            required
            type="number"
            theme="light"
            endAdornment={<div className={classes.purpleText}>JOTs</div>}
            disabled={disabled}
          />
          <Grid container>
            <Grid item md={7} xs={12}>
              <Box className={classes.leftBalance} display="flex" alignItems="center">
                <Header5 style={{ marginBottom: 0 }}>Wallet Balance</Header5>
                <Box className={classes.usdWrap} display="flex" alignItems="center" ml={2}>
                  <Box className={classes.point}></Box>
                  <Header5 style={{ fontWeight: 800, paddingLeft: "10px", marginBottom: 0 }}>
                    {typeUnitValue(jotBalance, 1)} JOTs
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
                <Box onClick={() => setJOTs(maxJot)}>MAX: {typeUnitValue(maxJot, 1)}</Box>
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
              onClick={handleAddJots}
              disabled={jotBalance <= 0}
            >
              Confirm
            </PrimaryButton>
          </Box>
        </Box>
      </Modal>
    </LoadingScreen>
  );
}
