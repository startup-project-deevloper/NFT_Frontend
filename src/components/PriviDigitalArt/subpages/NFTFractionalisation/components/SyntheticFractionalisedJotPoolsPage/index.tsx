import React, { useState } from "react";
import Moment from "react-moment";
import Web3 from "web3";
import { Grid } from "@material-ui/core";
import Box from "shared/ui-kit/Box";
import { Color, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { Avatar, Text } from "shared/ui-kit";
import { getJotPoolBalanceHistory } from "shared/services/API/SyntheticFractionalizeAPI";
import { SyntheticFractionalisedJotPoolsPageStyles } from "./index.styles";
import AddLiquidityModal from "components/PriviDigitalArt/modals/AddLiquidityModal";
import RemoveLiquidityModal from "components/PriviDigitalArt/modals/RemoveLiquidityModal";
import { ReactComponent as ArrowUp } from "assets/icons/arrow_up.svg";
import { ReactComponent as ArrowDown } from "assets/icons/arrow_down.svg";
import LiquidityModal from "../../modals/LiquidityModal";
import { BlockchainNets } from "shared/constants/constants";
import { useWeb3React } from "@web3-react/core";
import PriceGraph from "../../../../components/PriceGraph";

const isProd = process.env.REACT_APP_ENV === "prod";

const tempHistory = [
  {
    nft: "NFT Name",
    amount: "0.1 JOTs",
    date: "2021-09-18 03:45:24",
    user: { imageUrl: "", name: "JOT Pool" },
  },
  {
    nft: "NFT Name",
    amount: "0.1 JOTs",
    date: "2021-09-18 03:45:24",
    user: { imageUrl: require(`assets/icons/explorer.png`), name: "@user_name" },
  },
  {
    nft: "NFT Name",
    amount: "0.1 JOTs",
    date: "2021-09-18 03:45:24",
    user: { imageUrl: require(`assets/icons/explorer.png`), name: "JOT Pool" },
  },
  {
    nft: "NFT Name",
    amount: "0.1 JOTs",
    date: "2021-09-18 03:45:24",
    user: { imageUrl: "", name: "@user_name" },
  },
  {
    nft: "NFT Name",
    amount: "0.1 JOTs",
    date: "2021-09-18 03:45:24",
    user: { imageUrl: require(`assets/icons/explorer.png`), name: "JOT Pool" },
  },
  {
    nft: "NFT Name",
    amount: "0.1 JOTs",
    date: "2021-09-18 03:45:24",
    user: { imageUrl: "", name: "JOT Pool" },
  },
];

export const CoinFlipHistoryTable = ({ datas, nfts }) => {
  const classes = SyntheticFractionalisedJotPoolsPageStyles();
  // const usersList = useSelector((state: RootState) => state.usersInfoList);
  // const getUserInfo = (address: string) => usersList.find(u => u.address === address);

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "NFT",
      headerAlign: "center",
    },
    {
      headerName: "WINNER",
      headerAlign: "center",
    },
    {
      headerName: "AMOUNT",
      headerAlign: "center",
    },
    {
      headerName: "DATE",
      headerAlign: "center",
    },
    {
      headerName: "EXPLORER",
      headerAlign: "center",
    },
  ];
  const [tableData, setTableData] = React.useState<Array<Array<CustomTableCellInfo>>>([]);
  React.useEffect(() => {
    let data: Array<Array<CustomTableCellInfo>> = [];
    if (datas && datas.length) {
      data = datas.map(item => {
        const nft = nfts.find(n => n.SyntheticID === item.tokenId) ?? {};
        return [
          {
            cell: nft.NftId,
            cellAlign: "center",
          },
          {
            cell: (
              <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="center"
                className={classes.userField}
              >
                {/* <Avatar size="medium" url={user?.imageUrl ? user?.imageUrl: user?.anonAvatar ? require(`assets/anonAvatars/${user.anonAvatar}`) : "none"} /> */}
                <Avatar size="tiny" url={"none"} />
                <Text>{item.winnerAddress === nft.JotPoolAddress ? "Jot Pool" : nft.user}</Text>
              </Box>
            ),
            cellAlign: "center",
          },
          {
            cell: "0.1 Jots",
            cellAlign: "center",
          },
          {
            cell: <Moment format="hh:kk, DD.MM.yyyy">{item.date}</Moment>,
            cellAlign: "center",
          },
          {
            cell: (
              <SecondaryButton
                size="medium"
                className={classes.exploreButton}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: Color.Purple,
                  border: "0.7px solid #9EACF2",
                  borderRadius: "4px",
                  margin: "auto",
                }}
                onClick={() =>
                  window.open(`https://${!isProd ? "mumbai." : ""}polygonscan.com/tx/${item.txn}`, "_blank")
                }
              >
                <img src={require(`assets/icons/explorer.png`)} style={{ width: "24px", height: "24px" }} />
              </SecondaryButton>
            ),
            cellAlign: "center",
          },
        ];
      });
    }
    setTableData(data);
  }, [datas]);

  return (
    <div className={classes.table}>
      <CustomTable headers={tableHeaders} rows={tableData} placeholderText="No history" />
    </div>
  );
};

export default function SyntheticFractionalisedJotPoolsPage(props: any) {
  const { collection } = props;
  const classes = SyntheticFractionalisedJotPoolsPageStyles();
  const [rewardConfig, setRewardConfig] = React.useState<any>();
  const PERIODS = ["1D", "7D", "1M", "YTD"];
  const [period, setPeriod] = React.useState<string>(PERIODS[0]);

  const [flipHistory, setFlipHistory] = React.useState<any[]>(tempHistory);
  const [openLiquidityModal, setOpenLiquidityModal] = React.useState<boolean>(false);
  const [openRemoveLiquidityModal, setOpenRemoveLiquidityModal] = React.useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [openProceedModal, setOpenProceedModal] = useState<boolean>(false);
  const [totalLiquidity, setTotalLiquidity] = useState<number>(collection.totalLiquidity ?? 0);

  const { account, library, chainId } = useWeb3React();

  const [shareAmount, setShareAmount] = React.useState(1);
  const [poolOwnership, setPoolOwnership] = React.useState(0);
  const [liquidityValue, setLiquidityValue] = React.useState(0);
  const [rewardValue, setRewardValue] = React.useState(0);
  const [jotPoolBalanceHistory, setJotPoolBalanceHistory] = React.useState([]);

  React.useEffect(() => {
    (async () => {
      const resp = await getJotPoolBalanceHistory(collection.collectionAddress);
      if (resp?.success) {
        setJotPoolBalanceHistory(resp.data);
      }
    })();
  }, [period]);

  React.useEffect(() => {
    (async () => {
      const targetChain = BlockchainNets[1];
      const web3 = new Web3(library.provider);
      const web3APIHandler = targetChain.apiHandler;

      const position = await web3APIHandler.JotPool.getPosition(web3, collection);
      if (position) {
        setPoolOwnership(position.poolOwnership);
      }
    })();
  }, [library]);

  React.useEffect(() => {
    (async () => {
      const targetChain = BlockchainNets[1];
      const web3 = new Web3(library.provider);
      const web3APIHandler = targetChain.apiHandler;

      const liquidity = await web3APIHandler.JotPool.getLiquidityValue(web3, account, collection);
      if (liquidity) {
        setLiquidityValue(liquidity);
      }
    })();
  }, [library]);

  React.useEffect(() => {
    (async () => {
      const targetChain = BlockchainNets[1];
      const web3 = new Web3(library.provider);
      const web3APIHandler = targetChain.apiHandler;

      const reward = await web3APIHandler.JotPool.getReward(web3, collection);
      if (reward) {
        setRewardValue(reward);
      }
    })();
  }, [library]);

  const handleConfirmAddLiquidity = async (amount: string) => {
    setIsAdd(true);
    setAmount(Number(amount));
    setOpenProceedModal(true);

    setOpenLiquidityModal(false);
  };

  const handleConfirmRemoveLiquidity = async (amount: string) => {
    setIsAdd(false);
    setAmount(Number(amount));
    setOpenProceedModal(true);

    setOpenRemoveLiquidityModal(false);
  };

  const handleClaimRewards = async () => {
    const targetChain = BlockchainNets[1];
    const web3 = new Web3(library.provider);
    const web3APIHandler = targetChain.apiHandler;
    // WIP: Claim Rewards
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.outBox}>
        <Box className={classes.boxBody}>
          <Box className={classes.infoWrap} display="flex" flexDirection="column">
            <Grid container spacing={4}>
              <Grid item md={3} xs={12}>
                <Box className={classes.leftJots}>
                  <Box className={classes.hWrap1}>
                    <Box className={classes.h1}>{totalLiquidity ?? 0} JOTS</Box>
                    <Box className={classes.h5} paddingY={1}>
                      POOL TOTAL LIQUIDITY
                    </Box>
                  </Box>
                  <Box className={classes.hWrap2}>
                    <Box className={classes.h1}>{collection.totalAccuredReward ?? 0} JOTS</Box>
                    <Box className={classes.h5} paddingY={1}>
                      POOL TOTAL ACCRUED REWARD
                    </Box>
                  </Box>
                  <Box className={classes.hWrap2}>
                    <Box className={classes.h1}>{collection.totalShares ?? 0} JOTS</Box>
                    <Box className={classes.h5} paddingY={1}>
                      LIQUIDITY SHARE VALUE
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid item md={9} xs={12}>
                <PriceGraph data={jotPoolBalanceHistory} title="4245,24 USDC" subTitle="12 Sep 2021" filterDisable />
              </Grid>
            </Grid>
            {shareAmount === 0 && (
              <Box className={classes.addButtonWrapper}>
                <PrimaryButton
                  size="large"
                  onClick={() => setOpenLiquidityModal(true)}
                  style={{
                    width: "100%",
                    background: "#DDFF57",
                    fontWeight: "bold",
                    fontSize: "18px",
                    color: "#431AB7",
                  }}
                >
                  Stake JOTs
                </PrimaryButton>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      {shareAmount !== 0 && (
        <Box className={classes.outBox}>
          <Grid container direction="row" justifyContent="space-between" className={classes.botRow1}>
            <Box className={classes.sectionTitle} style={{ padding: "35px 0 30px 0", width: "100%" }}>
              MY STAKING
            </Box>
            <Grid container item md={8} xs={12}>
              <Grid item md={4} xs={12}>
                <Box className={classes.infoItem}>
                  <Box className={classes.h1} style={{ fontWeight: 800 }}>
                    SHARE AMOUNT
                  </Box>
                  <Box className={classes.h3} mt={1}>
                    {shareAmount} SHARES
                  </Box>
                </Box>
              </Grid>
              <Grid item md={4} xs={12}>
                <Box className={classes.infoItem}>
                  <Box className={classes.h1} style={{ fontWeight: 800 }}>
                    POOL OWNERSHIP
                  </Box>
                  <Box className={classes.h3} mt={1}>
                    {poolOwnership}%
                  </Box>
                </Box>
              </Grid>
              <Grid item md={4} xs={12}>
                <Box className={classes.infoItem}>
                  <Box className={classes.h1} style={{ fontWeight: 800 }}>
                    MY LIQUIDITY VALUE
                  </Box>
                  <Box className={classes.h3} mt={1}>
                    {liquidityValue} USD
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box display="flex" flex="1" alignItems="center" justifyContent="space-between">
                <SecondaryButton
                  size="medium"
                  className={classes.secondaryButton}
                  onClick={() => setOpenRemoveLiquidityModal(true)}
                >
                  REMOVE
                </SecondaryButton>
                <PrimaryButton
                  size="medium"
                  className={classes.primaryButton}
                  onClick={() => setOpenLiquidityModal(true)}
                >
                  ADD MORE
                </PrimaryButton>
              </Box>
            </Grid>
          </Grid>
          {/* <Grid container className={classes.botRow2}>
            <Grid container item md={8} xs={12}>
              <Grid item xs={6}>
                <Box className={classes.infoItem}>
                  <Box className={classes.h1} style={{ fontWeight: 800 }}>
                    YIELD FROM TRADING FEES
                  </Box>
                  <Box className={classes.h3} mt={1}>
                    5%
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className={classes.infoItem}>
                  <Box className={classes.h1} style={{ fontWeight: 800 }}>
                    ACCUMULATED YEIDL REWARDS
                  </Box>
                  <Box className={classes.h3} mt={1}>
                    {rewardValue} USDT
                  </Box>
                </Box>
              </Grid>
            </Grid>
            <Grid item md={4} xs={12}>
              <Box display="flex" alignItems="center">
                <SecondaryButton
                  size="medium"
                  style={{ color: Color.Purple, width: "100%", border: "2px solid #9EACF2", height: 60 }}
                  onClick={() => handleClaimRewards()}
                >
                  CLAIM REWARDS
                </SecondaryButton>
              </Box>
            </Grid>
          </Grid> */}
        </Box>
      )}

      <Box className={classes.outBox} style={{ paddingBottom: 20 }}>
        <Box className={classes.sectionTitle}>Coin flip history</Box>
        <CoinFlipHistoryTable datas={collection.flipHistory ?? []} nfts={collection.SyntheticNFT} />
      </Box>
      {openLiquidityModal && (
        <AddLiquidityModal
          open={openLiquidityModal}
          handleClose={() => setOpenLiquidityModal(false)}
          onConfirm={handleConfirmAddLiquidity}
          JotAddress={collection.JotAddress}
        />
      )}
      <RemoveLiquidityModal
        open={openRemoveLiquidityModal}
        onClose={() => setOpenRemoveLiquidityModal(false)}
        onConfirm={handleConfirmRemoveLiquidity}
      />
      <LiquidityModal
        open={openProceedModal}
        onClose={() => setOpenProceedModal(false)}
        collection={collection}
        amount={amount}
        isAdd={isAdd}
        onCompleted={liquidity => {
          setTotalLiquidity(liquidity);
        }}
      />
    </Box>
  );
}
