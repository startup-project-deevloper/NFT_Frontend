import React, { useEffect } from "react";
import Web3 from "web3";
import { Grid } from "@material-ui/core";
import { Header3, Header5, Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { WithdrawJotsModalStyles } from "./index.styles";
import { useWeb3React } from "@web3-react/core";
import { BlockchainNets } from "shared/constants/constants";
import { switchNetwork } from "shared/functions/metamask";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";
import { withdrawJots } from "shared/services/API/SyntheticFractionalizeAPI";
import { toDecimals, toNDecimals } from "shared/functions/web3";
import TransactionResultModal from "../TransactionResultModal";

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

export default function WithdrawJotsModal({
  open,
  collectionId,
  nft,
  setNft,
  handleRefresh = () => {},
  handleClose = () => {},
}) {
  const classes = WithdrawJotsModalStyles();

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
      setMaxJot(+nft.OwnerSupply);

      const jotDecimals = await web3APIHandler.Erc20["JOT"].decimals(web3, nft.JotAddress);
      const jotBalance = await web3APIHandler.Erc20["JOT"].balanceOf(web3, nft.JotAddress, { account });
      const jot = parseInt(toDecimals(jotBalance || 0, jotDecimals));
      setJotBalance(jot);
      setDisabled(false);
    })();
  }, [open, nft, selectedChain]);

  const handleWithdrawJots = async () => {
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

    const contractResponse = await web3APIHandler.SyntheticCollectionManager.withdrawJots(
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
      showAlertMessage("Failed to Withdraw Jots. Please try again", { variant: "error" });
      return;
    }

    setHash(contractResponse.data.hash);

    const response = await withdrawJots({
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
      OwnerSupply: (+nft.OwnerSupply - +jots).toString(),
    });
    showAlertMessage("You Withdraw JOTs successuflly", { variant: "success" });
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
          <Header3>Withdraw JOTs</Header3>
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
          <Box
            className={classes.rightBalance}
            display="flex"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Box onClick={() => setJOTs(maxJot)}>MAX: {maxJot.toFixed(2)}</Box>
          </Box>
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
              onClick={handleWithdrawJots}
            >
              Confirm
            </PrimaryButton>
          </Box>
        </Box>
      </Modal>
    </LoadingScreen>
  );
}
