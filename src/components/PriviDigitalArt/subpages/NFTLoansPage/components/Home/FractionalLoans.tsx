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

const FractionalLoans = ({ loading, loans }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const classes = useNFTLoansPageStyles();

  const history = useHistory();

  const [positions, setPositions] = useState<any[]>([]);
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);
  const isMediumScreen = useMediaQuery("(max-width: 1000px)");

  const [openHowModal, setOpenHowModal] = useState<boolean>(false);

  const { setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

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
    setPositions(loans || []);
  }, [loans]);

  useEffect(() => {
    if (positions) {
      const data: Array<Array<CustomTableCellInfo>> = positions.map((row, index) => {
        let endTime: any = {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        };
        let endDate: any = "";
        if (row) {
          const now = new Date();
          let delta = Math.floor(row.Duration ? row.CreationDate + row.Duration - now.getTime() / 1000 : 0);
          if (delta < 0) {
            endDate = format(new Date((row.CreationDate + row.Duration) * 1000), "dd/MM/yyyy");
            endTime = {
              days: 0,
              hours: 0,
              minutes: 0,
              seconds: 0,
            };
          } else {
            let days = Math.floor(delta / 86400);
            delta -= days * 86400;

            // calculate (and subtract) whole hours
            let hours = Math.floor(delta / 3600) % 24;
            delta -= hours * 3600;

            // calculate (and subtract) whole minutes
            let minutes = Math.floor(delta / 60) % 60;
            delta -= minutes * 60;

            // what's left is seconds
            let seconds = delta % 60;
            endDate = "";
            endTime = {
              days,
              hours,
              minutes,
              seconds,
            };
          }
        }

        return [
          {
            cell: (
              <Box
                display="flex"
                alignItems="fle-start"
                className={classes.tableAvatarField}
                onClick={() => {}}
                // onClick={() => history.push(`/loan/${row?.media?.MediaSymbol}`)}
              >
                <Box className={classes.mediaImageWrapper}>
                  <img
                    className={classes.mediaImage}
                    src={require(`assets/anonAvatars/ToyFaces_Colored_BG_${("000" + (index + 1)).substr(
                      -3
                    )}.jpg`)}
                  />
                  {/* <div
                    className={classes.mediaImage}
                    style={{
                      backgroundImage: `assets/anonAvatars/ToyFaces_Colored_BG_0${index}`
                      backgroundImage:
                        row?.media?.cidUrl ?? row?.media?.UrlMainPhoto ?? row?.media?.Url ?? row?.media?.url
                          ? `url(${
                              row?.media?.cidUrl ??
                              row?.media?.UrlMainPhoto ??
                              row?.media?.Url ??
                              row?.media?.url
                            })`
                          : "none",
                      backgroundColor: "#DDFF57",
                    }}
                  /> */}
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  className={classes.loanMediaTextWrapper}
                >
                  <span className={classes.loanMediaNameTag}>collection</span>
                  <span className={classes.loanMediaName}>{row?.media?.MediaName ?? ""}</span>
                  {/* <span className={classes.loanMediaNameId}>ID #24556</span> */}
                </Box>
              </Box>
            ),
            cellAlign: "center",
          },
          {
            cell: <span className={classes.marketValue}>52,455 USDT</span>,
            cellAlign: "center",
          },
          {
            cell: <span className={classes.marketValue}>20%</span>,
            cellAlign: "center",
          },
          {
            cell: <span className={classes.marketValue}>$7,231.14M</span>,
            cellAlign: "center",
          },
          {
            cell: <span className={classes.marketValue}>2.5%</span>,
            cellAlign: "center",
          },
          {
            cell: (
              <Box className={classes.positionColumnButtons}>
                <button className={classes.primary} onClick={() => history.push(`/loan/asset/${row.id}`)}>
                  Borrow
                </button>
                <button
                  className={cls(classes.secondary, classes.outlinedButton)}
                  onClick={() => history.push(`/loan/asset/${row.id}`)}
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
              <LendingCard />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12}>
              <BorrowingCard />
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
