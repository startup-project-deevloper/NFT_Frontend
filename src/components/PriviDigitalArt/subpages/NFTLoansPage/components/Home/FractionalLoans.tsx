import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { useHistory } from "react-router";

import { useTheme, useMediaQuery } from "@material-ui/core";

import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { useNFTLoansPageStyles } from "../../index.styles";
import HowItWorksModal from "components/PriviDigitalArt/modals/HowItWorksModal";

const FractionalLoans = ({ loading, loans }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  const classes = useNFTLoansPageStyles();

  const history = useHistory();

  const [positions, setPositions] = useState<any[]>([]);
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);
  const isMediumScreen = useMediaQuery("(max-width: 1000px)");
  const [openDepositModal, setOpenDepositModal] = useState<boolean>(false);
  const [openBorrowModal, setOpenBorrowModal] = useState<boolean>(false);
  const [openHowModal, setOpenHowModal] = useState<boolean>(false);

  const { setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  const tableHeaders: Array<CustomTableHeaderInfo> = [
    {
      headerName: "Collection",
      headerAlign: "left",
    },
    {
      headerName: "Total Size",
      headerAlign: "center",
    },
    {
      headerName: "Total Borrowed",
      headerAlign: "right",
    },
    {
      headerName: "Collateral Locked",
      headerAlign: "center",
    },
    {
      headerName: "C-Ratio",
      headerAlign: "center",
    },
    {
      headerName: "Interest APR",
      headerAlign: "center",
    },
    {
      headerName: "",
      headerAlign: "center",
      headerWidth: isMediumScreen ? 50 : 200,
    },
  ];

  useEffect(() => {
    setPositions(loans || []);
  }, [loans]);

  const handleOpenDepositModal = loan => {
    setOpenDepositModal(loan);
  };

  const handleOpenBorrowModal = loan => {
    setOpenBorrowModal(loan);
  };

  useEffect(() => {
    if (positions) {
      const data: Array<Array<CustomTableCellInfo>> = positions.map(row => {
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
                alignItems="center"
                className={classes.tableAvatarField}
                onClick={() => {}}
                // onClick={() => history.push(`/loan/${row?.media?.MediaSymbol}`)}
              >
                <Box className={classes.mediaImageWrapper}>
                  <div
                    className={classes.mediaImage}
                    style={{
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
                  />
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                  className={classes.loanMediaTextWrapper}
                >
                  <span className={classes.loanMediaNameTag}>collection</span>
                  <span className={classes.loanMediaName}>{row?.media?.MediaName ?? ""}</span>
                  <span className={classes.loanMediaNameId}>ID #24556</span>
                </Box>
              </Box>
            ),
            cellAlign: "center",
          },
          {
            cell: <span style={{ color: "#431AB7" }}>52,455 USDT</span>,
            cellAlign: "center",
          },
          {
            cell: <span style={{ color: "#431AB7" }}>52,455 USDT</span>,
            cellAlign: "center",
          },
          {
            cell: <span style={{ color: "#431AB7" }}>52,455 JOTs</span>,
            cellAlign: "center",
          },
          {
            cell: <span style={{ color: "#431AB7" }}>2.5%</span>,
            cellAlign: "center",
          },
          {
            cell: <span style={{ color: "#04B800" }}>2.5%</span>,
            cellAlign: "center",
          },
          {
            cell: (
              <Box className={classes.positionColumnButtons}>
                <PrimaryButton disabled className={classes.primary} size="medium">
                  Deposit
                </PrimaryButton>
                <SecondaryButton
                  disabled
                  className={classes.secondary}
                  size="medium"
                  onClick={() => handleOpenBorrowModal(row)}
                >
                  Borrow
                </SecondaryButton>
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
    <div style={{ width: "100%", filter: "blur(7px)" }}>
      <div>
        {isMobile ? (
          <Box className={classes.loanTopButtonBox}>
            <Box className={classes.btnGroup}>
              <button
                disabled
                className={classes.greenButton}
                style={{ color: "white", background: "#431AB7" }}
                onClick={() =>
                  history.push({
                    pathname: "/loan/positions",
                    state: {
                      tabId: 1,
                    },
                  })
                }
              >
                Manage positions
              </button>
              <SecondaryButton
                size="medium"
                disabled
                onClick={() => setOpenHowModal(true)}
                style={{
                  color: "#431AB7",
                  border: "0.7px solid #431AB7",
                  boxSizing: "border-box",
                  boxShadow: "0px 8px 20px -12px rgba(79, 95, 17, 0.54)",
                  borderRadius: "4px",
                  padding: "0 32px",
                  marginTop: "16px",
                }}
              >
                How it works?
              </SecondaryButton>
            </Box>
          </Box>
        ) : (
          <Box className={classes.loanTopButtonBox}>
            <button
              disabled
              className={classes.greenButton}
              style={{ color: "white", background: "#431AB7" }}
              onClick={() =>
                history.push({
                  pathname: "/loan/positions",
                  state: {
                    tabId: 1,
                  },
                })
              }
            >
              Manage positions
            </button>
            <SecondaryButton
              disabled
              size="medium"
              onClick={() => setOpenHowModal(true)}
              style={{
                color: "#431AB7",
                border: "0.7px solid #431AB7",
                boxSizing: "border-box",
                boxShadow: "0px 8px 20px -12px rgba(79, 95, 17, 0.54)",
                borderRadius: "4px",
                padding: "0 32px",
              }}
            >
              How it works?
            </SecondaryButton>
          </Box>
        )}
      </div>
      <LoadingWrapper loading={loading} theme={"blue"} height="calc(100vh - 100px)">
        <div className={classes.tableContainerWithAbsoluteImage}>
          <div className={`${classes.tableLoansContainer} position-table`}>
            <CustomTable theme="art green" headers={tableHeaders} rows={tableData} />
          </div>
        </div>
      </LoadingWrapper>

      {openHowModal && <HowItWorksModal open={openHowModal} handleClose={() => setOpenHowModal(false)} />}
    </div>
  );
};

export default React.memo(FractionalLoans);
