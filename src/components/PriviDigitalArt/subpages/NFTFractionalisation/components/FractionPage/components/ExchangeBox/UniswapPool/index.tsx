import React, {useState, useCallback, useEffect} from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import { BlockchainNets } from "shared/constants/constants";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { useWeb3React } from "@web3-react/core";
import {switchNetwork} from "shared/functions/metamask";

const useUniswapPoolStyles = makeStyles(theme => ({
  uniswapText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "16px",
    lineHeight: "130%",
    textAlign: "center",
    color: "#431AB7",
    "& *": {
      textAlign: "center",
    },
  },

  buttonPurple: {
    alignSelf: "flex-end",
    marginTop: "60px",
    background: "#431AB7",
    borderRadius: "4px",
    color: "white",
    fontWeight: 800,
    fontSize: "14px",
    lineHeight: "18px",
    textAlign: "center",
    padding: "8px 32px",
  },

  uniswapWrapper: {
    display: "flex",
    flexDirection: "column",
  }
}));

const filteredBlockchainNets = BlockchainNets.filter(b => b.name != "PRIVI");

export default function UniswapPool({}) {
  const classes = useUniswapPoolStyles();
  const [pay, setPay] = useState("");
  const [receive, setReceive] = useState("");
  const [tokenList, setTokenList] = useState<string[]>([]);
  const [payToken, setPayToken] = useState("USDT");
  const [selectedChain, setSelectedChain] = useState<any>(filteredBlockchainNets[0]);

  const { account, library, chainId } = useWeb3React();

  const handleCreateLiquidityPool = useCallback(
    (pairFrom: string, pairTo: string) => () => {
      window.open(`https://app.uniswap.org/#/add/${pairFrom}/${pairTo}`, "__blank");
    },
    []
  );

  useEffect(() => {
    if (selectedChain.chainId !== chainId) {
      (async () => {
        const changed = await switchNetwork(selectedChain.chainId);
        if (!changed) {
          setSelectedChain(filteredBlockchainNets.find(b => b.chainId === chainId))
        }
      })();
    }
  }, [chainId, selectedChain]);

  useEffect(() => {
    setTokenList(Object.keys(selectedChain.config.TOKEN_ADDRESSES));
  }, [selectedChain])

  const isCreated = false;

  if (isCreated) {
    return (
      <div className={classes.uniswapText}>
        <div>
          The ERC20 fractions of this NFT are still not available on Uniswap. Be the first to start a liquidity
          pool by creating one on here
        </div>

        <button
          onClick={handleCreateLiquidityPool("ETH", "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984")}
          className={classes.buttonPurple}
        >
          Create
        </button>
      </div>
    );
  }

  return (
    <Grid container direction="column" spacing={6}>
      <Grid item>
        <Grid container spacing={4}>
          <Grid item xs={6} sm={6}>
              <InputWithLabelAndTooltip
                labelName="Pay"
                inputValue={pay}
                placeHolder={"0.012345678"}
                required
                type="text"
                onInputValueChange={e => setPay(e.target.value)}
                theme="light"
              />
          </Grid>
          <Grid item xs={6} sm={6}>
              <label>Balance: </label>
              <TokenSelect
                style={{margin:0}}
                tokens={tokenList}
                value={payToken}
                onChange={e => {
                  setPayToken(e.target.value as string);
                }}
              />
          </Grid>
        </Grid>
      </Grid>
      <Grid item>
        <Grid container spacing={4}>
          <Grid item xs={6} sm={6}>
              <InputWithLabelAndTooltip
                labelName="Receive"
                inputValue={receive}
                placeHolder={"3214986"}
                required
                type="text"
                onInputValueChange={e => setReceive(e.target.value)}
                theme="light"
              />
          </Grid>
          <Grid item xs={6} sm={6}>
              <Typography>Balance: </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Grid item style={{display:"flex", justifyContent:"flex-end"}}>
        <button
          onClick={() => {}}
          className={classes.buttonPurple}
        >
          Buy
        </button>
      </Grid>
    </Grid>
  );
}
