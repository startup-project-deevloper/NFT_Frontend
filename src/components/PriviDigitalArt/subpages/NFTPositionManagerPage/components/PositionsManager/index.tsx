import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useSelector } from "react-redux";
import { format } from "date-fns";
import { useHistory } from "react-router";

import { useMediaQuery } from "@material-ui/core";

import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import RepayLoanModal from "components/PriviDigitalArt/modals/RepayLoanModal";
import WithdrawFundsModal from "components/PriviDigitalArt/modals/WithdrawFundsModal";
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
import { useNFTLoansPageStyles } from "../../../NFTLoansPage/index.styles";

const PositionsManager = () => {
  const classes = useNFTLoansPageStyles();

  const history = useHistory();
  const userSelector = useSelector(getUser);

  const [positions, setPositions] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState<boolean>(true);
  const [tableData, setTableData] = useState<Array<Array<CustomTableCellInfo>>>([]);
  const isMediumScreen = useMediaQuery("(max-width: 1000px)");

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
      headerName: "NFT",
      headerAlign: "center",
    },
    {
      headerName: "CHAIN",
      headerAlign: "center",
    },
    {
      headerName: "INTEREST",
      headerAlign: "right",
    },
    {
      headerName: "LOAN PRINCIPAL",
      headerAlign: "center",
    },
    {
      headerName: "ENDS ON",
      headerAlign: "center",
    },
    {
      headerName: "DEBT TO REPAY",
      headerAlign: "center",
    },
    {
      headerName: "",
      headerAlign: "center",
      headerWidth: isMediumScreen ? 50 : 200,
    },
  ];

  useEffect(() => {
    if (userSelector?.id && Object.keys(ipfs).length) {
      loadData();
    }
  }, [userSelector, ipfs]);

  const loadData = () => {
    setIsDataLoading(true);
    Axios.get(
      `${URL()}/nftLoan/getUserNFTLoans/${
        "0xB3865aeB5ef792DD395650314C3D85e78B78B1c9" || userSelector.address
      }`
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

  const [openRepayLoanModal, setOpenRepayLoanModal] = useState<any | boolean>(false);
  const [openWithdrawFundsModal, setOpenWithdrawFundsModal] = useState<any | boolean>(false);

  const handleOpenRepayLoan = loan => {
    setOpenRepayLoanModal(loan);
  };
  const handleCloseRepayLoan = () => {
    setOpenRepayLoanModal(false);
  };

  const handleOpenWithdrawFunds = loan => {
    setOpenWithdrawFundsModal(loan);
  };
  const handleCloseWithdrawFunds = () => {
    setOpenWithdrawFundsModal(false);
  };

  useEffect(() => {
    if (positions) {
      const timerId = setInterval(() => {
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
                  onClick={() => history.push(`/pix/loan/${row?.media?.MediaSymbol}`)}
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
                  <Box className={classes.mediaName}>{row?.media?.MediaName ?? ""}</Box>
                </Box>
              ),
              cellAlign: "center",
            },
            {
              cell: (
                <img
                  src={getLoanChainImageUrl(row.Chain, row.media.BlockchainNetwork)}
                  alt={"chain"}
                  className={classes.chain}
                />
              ),
              cellAlign: "center",
            },
            {
              cell: `${row.FeePct ? row.FeePct : "0"}%`,
              cellAlign: "center",
            },
            {
              cell: row.BidderAddress ? `${row.Bid || 0} ${row.FundingToken || "ETH"}` : "",
              cellAlign: "center",
            },
            {
              cell: endDate
                ? `Ended ${endDate}`
                : `${String(endTime.days).padStart(2, "0")}d
                  ${String(endTime.hours).padStart(2, "0")}h
                  ${String(endTime.minutes).padStart(2, "0")}m
                  ${String(endTime.seconds).padStart(2, "0")}s`,
              cellAlign: "center",
            },
            {
              cell: <div className={`${classes.blue} ${classes.debtColumn}`}>{row.Debt}</div>,
              cellAlign: "center",
            },
            {
              cell: (
                <Box className={classes.positionButtons}>
                  {row.BidderAddress ? (
                    <>
                      {row.Debt ? (
                        <SecondaryButton
                          className={classes.secondary}
                          size="medium"
                          onClick={() => handleOpenRepayLoan(row)}
                        >
                          Repay Loan
                        </SecondaryButton>
                      ) : (
                        <PrimaryButton className={classes.primary} disabled size="medium">
                          Loan repayed
                        </PrimaryButton>
                      )}
                      <SecondaryButton
                        className={classes.secondary}
                        size="medium"
                        onClick={() => handleOpenWithdrawFunds(row)}
                      >
                        Withdraw Funds
                      </SecondaryButton>
                    </>
                  ) : null}
                </Box>
              ),
              cellAlign: "center",
            },
          ];
        });
        setTableData(data);
      }, 1000);
      return () => clearInterval(timerId);
    } else return;
  }, [positions]);

  return (
    <div className={classes.content}>
      <Ellipse />

      <BackButton dark overrideFunction={() => history.push("/pix/loan")} />

      <Box className={classes.positionTitle}>✨ Manage your positions</Box>

      <LoadingWrapper loading={isDataLoading} theme={"blue"} height="calc(100vh - 100px)">
        <div className={classes.tableContainerWithAbsoluteImage}>
          <img src={require("assets/icons3d/vault.png")} alt="" className={classes.absoluteImage} />
          <div className={`${classes.tableContainer} position-table`}>
            <CustomTable theme="art green" headers={tableHeaders} rows={tableData} />
          </div>
        </div>
      </LoadingWrapper>
      {openRepayLoanModal && (
        <RepayLoanModal
          open={openRepayLoanModal !== false}
          onClose={handleCloseRepayLoan}
          loan={openRepayLoanModal}
          reload={loadData}
        />
      )}
      {openWithdrawFundsModal && (
        <WithdrawFundsModal
          open={openWithdrawFundsModal !== false}
          onClose={handleCloseWithdrawFunds}
          loan={openWithdrawFundsModal}
          reload={loadData}
        />
      )}
    </div>
  );
};

export default React.memo(PositionsManager);

const Ellipse = () => {
  const classes = useNFTLoansPageStyles();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="698"
      height="649"
      viewBox="0 0 698 649"
      fill="none"
      className={classes.ellipse2}
    >
      <g filter="url(#filter0_f)">
        <ellipse cx="349" cy="300.5" rx="169" ry="168.5" fill="#DDFF57" />
      </g>
      <defs>
        <filter
          id="filter0_f"
          x="0"
          y="-48"
          width="698"
          height="697"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation="90" result="effect1_foregroundBlur" />
        </filter>
      </defs>
    </svg>
  );
};
