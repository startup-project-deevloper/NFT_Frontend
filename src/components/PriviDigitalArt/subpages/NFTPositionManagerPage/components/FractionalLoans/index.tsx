import React, { useEffect, useState, ReactNode } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { useHistory } from "react-router";

import { useTheme, useMediaQuery, TableRow, TableCell, Collapse } from "@material-ui/core";

import URL from "shared/functions/getURL";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { getUser } from "store/selectors";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "shared/ipfs/get";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { useNFTPositionManagerPageStyles } from "../../index.styles";
import HowItWorksModal from "components/PriviDigitalArt/modals/HowItWorksModal";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import RangeSlider from "shared/ui-kit/RangeSlider";

const FractionalLoans = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const classes = useNFTPositionManagerPageStyles();

  const history = useHistory();
  const userSelector = useSelector(getUser);

  const [positions, setPositions] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<
    Array<{ data: Array<CustomTableCellInfo>; collapse: ReactNode }>
  >([]);
  const isMediumScreen = useMediaQuery("(max-width: 1000px)");
  const [openDepositModal, setOpenDepositModal] = useState<boolean>(false);
  const [openBorrowModal, setOpenBorrowModal] = useState<boolean>(false);
  const [openHowModal, setOpenHowModal] = useState<boolean>(false);
  const [openCollapse, setOpenCollapse] = useState<string[]>([]);

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

  useEffect(() => {
    if (userSelector?.id && ipfs) {
      loadData();
    }
  }, [userSelector, ipfs]);

  const loadData = () => {
    setIsDataLoading(true);
    Axios.get(
      `${URL()}/nftLoan/getUserNFTLoans/${userSelector.address}`
    )
      .then(async ({ data }) => {
        if (data.success) {
          const postionsData = await Promise.all(
            data.data?.map(async nft => {
              const cidUrl = nft.media?.cid ? await getImageIPFS(nft.media?.cid) : "";
              if (cidUrl) {
                nft.media["cidUrl"] = cidUrl;
              }
              return nft;
            })
          );
          setPositions(postionsData || []);
        }
      })
      .catch(e => {
        console.log(e);
      })
      .finally(() => {
        setIsDataLoading(false);
      });
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

  const handleOpenDepositModal = loan => {
    setOpenDepositModal(loan);
  };

  const handleOpenBorrowModal = loan => {
    setOpenBorrowModal(loan);
  };

  useEffect(() => {
    if (positions) {
      const data: Array<{ data: Array<CustomTableCellInfo>; collapse: ReactNode }> = positions.map(row => {
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

        return {
          data: [
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
                <Box display="flex" alignItems="center">
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
                  <div
                    onClick={() => {
                      if (!openCollapse.includes(row.id)) {
                        setOpenCollapse([...openCollapse, row.id]);
                      } else {
                        const updateCollapse = openCollapse.filter(i => i !== row.id);
                        setOpenCollapse([...updateCollapse]);
                      }
                    }}
                  >
                    <ArrowIcon isOpen={openCollapse.includes(row.id)} />
                  </div>
                </Box>
              ),
              cellAlign: "center",
            },
          ],
          collapse: <TableCollapse open={openCollapse.includes(row.id)} />,
        };
      });
      setTableData(data);
    } else return;
  }, [positions, openCollapse]);

  return (
    <div style={{ width: "100%" }}>
      <LoadingWrapper loading={isDataLoading} theme={"blue"} height="calc(100vh - 100px)">
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

const TableCollapse = ({ open }) => {
  const [jots, setJots] = useState(0);
  const [range, setRange] = useState(0);
  const classes = useNFTPositionManagerPageStyles();

  return (
    <TableCell style={{ paddingBottom: 0, paddingTop: 0, position: "relative" }} colSpan={7}>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box className={classes.collapseGap} style={{ display: open ? "block" : "none" }}>
          <div />
        </Box>
        <Box sx={{ margin: 1 }} className={classes.collapse}>
          <p>Deposit controls</p>
          <span>
            Adjust the funds you would like to borrow, change your collateral and control the risk by
            adjusting LTV and risk level{" "}
          </span>
          <Box display="flex" alignItems="center" flex={1} justifyContent="space-between" mt={4} mb={3}>
            <Box display="flex" flexDirection="column" flex={0.4}>
              <Box fontSize="14px" fontWeight="400">
                How much you want to borrow
              </Box>
              <InputWithLabelAndTooltip
                inputValue={jots}
                onInputValueChange={e => setJots(+e.target.value)}
                overriedClasses={classes.inputJots}
                required
                type="number"
                theme="light"
                minValue={1}
              />
              <Box style={{ cursor: "pointer", textAlign: "end" }}>Use Max</Box>
            </Box>
            <Box display="flex" flexDirection="column" flex={0.4}>
              <Box fontSize="14px" fontWeight="400" display="flex" justifyContent="space-between">
                <span>Min. Collateral you need to deposit</span>
                <span>(adjustable)</span>
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                className={classes.purpleBg}
                alignItems="center"
                padding="0 13px"
              >
                <span>JOTs</span>
                <span>24555</span>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box display="flex" alignItems="center" gridColumnGap="10px" fontSize="14px">
                  <Box className={classes.usdWrap} display="flex" alignItems="center">
                    <Box className={classes.point}></Box>
                    <Box fontWeight="700">{0.0} JOTs</Box>
                  </Box>
                  <span>Wallet Balance</span>
                </Box>
                <Box display="flex" alignItems="center" fontSize="16px">
                  MAX
                </Box>
              </Box>
            </Box>
            <PrimaryButton className={classes.primary} size="medium">
              Deposit Collateral
            </PrimaryButton>
          </Box>
          <div className={classes.border} />
          <Box mt={5}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <span>Adjust collateral to change your LTV</span>
              <span>
                Your Current LTV<span style={{ color: "#431AB7", marginLeft: 6 }}>50%</span>
              </span>
              <span>
                Your Current LTV<span style={{ color: "#D30401", marginLeft: 6 }}>80%</span>
              </span>
            </Box>
            <RangeSlider value={range} onChange={(event, newValue) => setRange(newValue)} />
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
              <span>
                <strong>Low Risk</strong>
              </span>
              <span>Medium Risk</span>
              <span>High Risk</span>
              <span>
                <strong>Liquidation</strong>
              </span>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </TableCell>
  );
};

const ArrowIcon = ({ isOpen }: any) => {
  if (!isOpen) {
    return (
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle opacity="0.1" cx="18" cy="18" r="18" fill="#431AB7" />
        <path
          d="M12 16L18 22L24 16"
          stroke="#431AB7"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle r="14" transform="matrix(1 0 0 -1 14 14)" fill="#431AB7" />
      <path
        d="M9.33203 15.8887L13.9987 11.8491L18.6654 15.8887"
        stroke="white"
        stroke-width="1.55556"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default React.memo(FractionalLoans);
