import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useHistory } from "react-router-dom";
import cls from "classnames";

import { useTheme, useMediaQuery, Grid } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { useNFTLoansPageStyles } from "../../index.styles";
import HowItWorksModal from "components/PriviDigitalArt/modals/HowItWorksModal";
import LendingCard from "./LendingCard";
import BorrowingCard from "./BorrowingCard";
import MarketsTable from "./MarketsTable";

const FractionalLoans = ({ loading, markets }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const classes = useNFTLoansPageStyles();

  const history = useHistory();

  const [positions, setPositions] = useState<any[]>([]);
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);
  const isMediumScreen = useMediaQuery("(max-width: 1000px)");

  const [openHowModal, setOpenHowModal] = useState<boolean>(false);

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "Asset",
      headerAlign: "left",
    },
    {
      headerName: "Total Lend",
      headerAlign: "center",
    },
    {
      headerName: "Lend APY",
      headerAlign: "center",
    },
    {
      headerName: "Total Borrow",
      headerAlign: "center",
    },
    {
      headerName: "Borrow APR",
      headerAlign: "center",
    },
    // {
    //   headerName: "Interest APR",
    //   headerAlign: "center",
    // },
    {
      headerName: "",
      headerAlign: "center",
      headerWidth: isMediumScreen ? 50 : 200,
    },
  ];

  useEffect(() => {
    setPositions(markets || []);
  }, [markets]);

  useEffect(() => {
    if (positions) {
      const data: Array<Array<CustomTableCellInfo>> = positions.map((row, index) => {
        const total_borrow_list = row.market_info.borrowList
        let total_borrow = 0
        let total_lend = 0
        if (total_borrow_list.length > 0) {
          total_borrow = total_borrow_list[total_borrow_list.length - 1].total_borrow
          total_lend = total_borrow_list[total_borrow_list.length - 1].total_reserves
        }
        return [
          {
            cell: (
              <Box
                display="flex"
                alignItems="fle-start"
                className={classes.tableAvatarField}
                onClick={() => { }}
              // onClick={() => history.push(`/loan/${row?.media?.MediaSymbol}`)}
              >
                <Box className={classes.mediaImageWrapper}>
                  <img
                    className={classes.mediaImage}
                    src={row.token_info.ImageUrl}
                  />
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  className={classes.loanMediaTextWrapper}
                >
                  {
                    row.token_info.Type !== 'Crypto' ?
                      <>
                        <span className={classes.loanMediaNameTag}>collection</span>
                        <span className={classes.loanMediaName}>{row.token_info.Name}</span>
                      </>
                      :
                      <>
                        <span className={classes.loanMediaName}>{row.token_info.Name}</span>
                        <span className={classes.loanMediaSymbol}>{row.token_info.Symbol}</span>
                      </>
                  }
                </Box>
              </Box>
            ),
            cellAlign: "center",
          },
          {
            cell: <span className={classes.marketValue}>{`${total_lend} ${row.token_info.Symbol}`}</span>,
            cellAlign: "center",
          },
          {
            cell: <span className={classes.marketValue}>{row.market_info.reserve_apy * 100}%</span>,
            cellAlign: "center",
          },
          {
            cell: <span className={classes.marketValue}>{`${total_borrow} ${row.token_info.Symbol}`}</span>,
            cellAlign: "center",
          },
          {
            cell: <span className={classes.marketValue}>{row.market_info.borrow_apy * 100}%</span>,
            cellAlign: "center",
          },
          {
            cell: (
              <Box className={classes.positionColumnButtons}>
                <button className={classes.primary} onClick={() => history.push(`/loan/asset/${row.token_address}`)}>
                  Borrow
                </button>
                <button
                  className={cls(classes.secondary, classes.outlinedButton)}
                  onClick={() => history.push(`/loan/asset/${row.token_address}`)}
                >
                  Lend
                </button>
              </Box>
            ),
            cellAlign: "center",
          },
        ];
      });
      setTableData(data);
    } else return;
  }, [positions]);

  return (
    <div style={{ width: "100%" }}>
      <div>
        {isMobile ? (
          <Box className={classes.loanTopButtonBox}>
            <Box className={classes.btnGroup}>
              <button
                className={classes.greenButton}
                style={{ background: "#431AB7", color: "#fff" }}
                onClick={() => history.push("/loan/manage_loans")}
              >
                Manage Loans
              </button>
              <button
                className={cls(classes.greenButton, classes.outlinedButton)}
                onClick={() => setOpenHowModal(true)}
              >
                How it works?
              </button>
            </Box>
          </Box>
        ) : (
          <Box className={classes.loanTopButtonBox}>
            <button
              className={classes.greenButton}
              style={{ background: "#431AB7", color: "#fff" }}
              onClick={() => history.push("/loan/manage_loans")}
            >
              Manage Loans
            </button>
            <button
              className={cls(classes.greenButton, classes.outlinedButton)}
              onClick={() => setOpenHowModal(true)}
            >
              How it works?
            </button>
          </Box>
        )}
      </div>
      <LoadingWrapper loading={loading} theme={"blue"} height="calc(100vh - 100px)">
        <div className={classes.tableContainerWithAbsoluteImage}>
          <Grid container spacing={3}>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <LendingCard markets={markets}/>
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <BorrowingCard markets={markets}/>
            </Grid>
          </Grid>
          <div className={`${classes.tableLoansContainer} position-table`}>
            <MarketsTable tableHeaders={tableHeaders} tableData={tableData} />
          </div>
        </div>
      </LoadingWrapper>

      {openHowModal && <HowItWorksModal open={openHowModal} handleClose={() => setOpenHowModal(false)} />}
    </div>
  );
};

export default React.memo(FractionalLoans);
