import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { useHistory } from "react-router";

import { useMediaQuery } from "@material-ui/core";

import URL from "shared/functions/getURL";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { getUser } from "store/selectors";
import { getLoanChainImageUrl } from "shared/functions/chainFucntions";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "shared/ipfs/get";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { useNFTLoansPageStyles } from "../../index.styles";

const FractionalLoans = ({ loading, loans }) => {
  const classes = useNFTLoansPageStyles();

  const history = useHistory();
  const userSelector = useSelector(getUser);

  const [positions, setPositions] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);
  const isMediumScreen = useMediaQuery("(max-width: 1000px)");
  const [openDepositModal, setOpenDepositModal] = useState<boolean>(false);
  const [openBorrowModal, setOpenBorrowModal] = useState<boolean>(false);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  const getImageIPFS = async (cid: string) => {
    let files = await onGetNonDecrypt(cid, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      return "data:image/png;base64," + base64String;
    }
    return "";
  };

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
                onClick={() => history.push(`/loan/${row?.media?.MediaSymbol}`)}
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
                <Box display="flex" flexDirection="column" justifyContent="space-between" height="73px" ml={2}>
                  <span className={classes.loanMediaNameTag}>collection</span>
                  <span className={classes.loanMediaNameName}>{row?.media?.MediaName ?? ""}</span>
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
                <PrimaryButton className={classes.primary} size="medium">
                  Deposit
                </PrimaryButton>
                <SecondaryButton
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
    <div style={{ width: "100%" }}>
      <Box display="flex" justifyContent="space-between" padding="32px 64px 32px 32px">
        <button className={classes.greenButton} style={{ color: 'white', background: "#431AB7" }} onClick={() => history.push("/loan/positions")}>
          Manage your positions
        </button>
        <SecondaryButton
          className={classes.secondary}
          style={{ borderRadius: 4, marginTop: 0, height: 46, padding: "0 40px" }}
          size="medium"
          onClick={() => {}}
        >
          How it works?
        </SecondaryButton>
      </Box>

      <LoadingWrapper loading={loading} theme={"blue"} height="calc(100vh - 100px)">
        <div className={classes.tableContainerWithAbsoluteImage}>
          <div className={`${classes.tableLoansContainer} position-table`}>
            <CustomTable theme="art green" headers={tableHeaders} rows={tableData} />
          </div>
        </div>
      </LoadingWrapper>
    </div>
  );
};

export default React.memo(FractionalLoans);
