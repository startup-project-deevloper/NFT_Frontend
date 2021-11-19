import React, { useEffect, useState, useMemo } from "react";
import { Grid, useMediaQuery, useTheme } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { MasonryGrid } from "shared/ui-kit/MasonryGrid/MasonryGrid";
import MediaNFTCard from "./MediaNFTCard";
import CreateNFTModal from "../../../../modals/CreateNFTModal";

import { useCopyRightStyles } from "./index.styles";
import { useTypedSelector } from "store/reducers/Reducer";
import { PrimaryButton } from "shared/ui-kit";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { priviPodGetCopyrightNFTsByPod } from "shared/services/API";

const COLUMNS_COUNT_BREAK_POINTS_FOUR = {
  375: 1,
  600: 2,
  1000: 3,
  1440: 4,
};

const TABLEHEADER: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Account",
    headerAlign: "center",
  },
  {
    headerName: "Token Amount",
    headerAlign: "center",
  },
  {
    headerName: "Copyright %",
    headerAlign: "center",
  },
];

const Copyright = props => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { pod, podInfo } = props;

  const classes = useCopyRightStyles();

  const userSelector = useTypedSelector(state => state.user);

  const [mediaNFTs, setMediaNFTs] = useState<any[]>([]);

  const [openCreateNFTModal, setOpenCreateNFTModal] = useState<boolean>(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const resp = await priviPodGetCopyrightNFTsByPod(pod.Id, "PIX");
    if (resp.success) {
      setMediaNFTs(resp.data);
    }
  };

  const totalSupply = useMemo(() => +pod.FundingTarget / +pod.FundingPrice, [pod]);

  const getTableData = () => {
    const tableData: Array<Array<CustomTableCellInfo>> = [];
    Object.keys(pod.Investors).forEach(investor => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box>
            {isMobile ? `${investor.slice(0, 5)}...${investor.slice(investor.length - 5)}` : investor}
          </Box>
        ),
        cellAlign: "center",
      });
      row.push({
        cell: (
          <Box>
            {pod.Investors[investor] / +pod.FundingPrice} {pod.TokenSymbol}
          </Box>
        ),
        cellAlign: "center",
      });
      row.push({
        cell: <Box>{Math.round((pod.Investors[investor] / +pod.FundingTarget) * 100)}%</Box>,
        cellAlign: "center",
      });
      tableData.push(row);
    });
    return tableData;
  };

  const copyrightShare = useMemo(() => {
    const claimed = (pod.ClaimedStatus && pod.ClaimedStatus[userSelector.id]) || 0;
    return Math.round((claimed / totalSupply) * 100);
  }, [pod, userSelector]);

  return (
    <Box className={classes.container}>
      <Box className={classes.title} mt={isMobile ? 4 : 8} mb={isMobile ? 2 : 3}>
        Your Copyright Fractions
      </Box>
      <Box className={classes.whiteBox}>
        <Grid container>
          <Grid
            item
            xs={5}
            sm={4}
            style={{
              borderRight: "1px solid #E8E8E8",
            }}
          >
            <Box>
              <Box className={`${classes.h1} ${classes.bgGradient}`}>
                {(pod.ClaimedStatus && pod.ClaimedStatus[userSelector.id]) || 0}
              </Box>
              <Box className={`${classes.h3} ${classes.bgGradient}`}>Media Fractions</Box>
            </Box>
          </Grid>
          <Grid item xs={7} sm={4} className={classes.fractionItem}>
            <Box>
              <Box className={classes.h1}>{copyrightShare}%</Box>
              <Box className={classes.h3} color="#54658F">
                Your Copyright Share
              </Box>
            </Box>
          </Grid>
          {pod.ClaimedStatus && pod.ClaimedStatus[userSelector.id] && (
            <Grid
              item
              xs={12}
              sm={4}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                paddingTop: isMobile ? "20px" : "0",
              }}
            >
              <PrimaryButton
                onClick={() => setOpenCreateNFTModal(true)}
                size="small"
                style={{
                  borderRadius: "30px",
                  height: "40px",
                  padding: "8px 26px",
                  fontFamily: "Agrandir",
                  fontStyle: "normal",
                  fontWeight: "bold",
                  fontSize: isMobile ? "14px" : "16px",
                  lineHeight: "20px",
                  textAlign: "center",
                  background: "#2D3047",
                }}
                isRounded
              >
                Create NFT
              </PrimaryButton>
            </Grid>
          )}
        </Grid>
      </Box>
      <Box className={classes.title} mt={isMobile ? 4 : 8} mb={isMobile ? 2 : 3}>
        Distribution overview
      </Box>
      <CustomTable headers={TABLEHEADER} rows={getTableData()} theme="transaction" />
      <Box className={classes.title} mt={isMobile ? 4 : 8} mb={isMobile ? 2 : 3}>
        Created NFT
      </Box>
      <MasonryGrid
        gutter={"24px"}
        data={mediaNFTs}
        renderItem={(item, _) => <MediaNFTCard pod={pod} nft={item} />}
        columnsCountBreakPoints={COLUMNS_COUNT_BREAK_POINTS_FOUR}
      />
      <CreateNFTModal
        open={openCreateNFTModal}
        onClose={() => setOpenCreateNFTModal(false)}
        pod={pod}
        handleRefresh={() => loadData()}
      />
    </Box>
  );
};

export default Copyright;
