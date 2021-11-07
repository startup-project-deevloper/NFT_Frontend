import React, { useEffect, useState } from "react";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { BackButton } from "components/PriviDigitalArt/components/BackButton";
import Box from "shared/ui-kit/Box";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { PrimaryButton, SecondaryButton, GradientSlider } from "shared/ui-kit";
import { useManageLoansPageStyles } from "./index.styles";

const SlideMarks = [
  {
    value: 0,
    label: "Borrow limit 0",
  },
  {
    value: 100,
    label: "$00.000",
  },
];

const tableLendingHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Asset",
  },
  {
    headerName: "APY",
    headerAlign: "center",
  },
  {
    headerName: "Lending",
    headerAlign: "center",
  },
  {
    headerName: "",
    headerAlign: "center",
  },
];

const tableBorrowingHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerName: "Asset",
  },
  {
    headerName: "APY",
    headerAlign: "center",
  },
  {
    headerName: "Lending",
    headerAlign: "center",
  },
  {
    headerName: "",
    headerAlign: "center",
  },
];

const tableLendingData: Array<Array<CustomTableCellInfo>> = [
  [
    {
      cell: (
        <Box color="#431AB7" display="flex" alignItems="center">
          <img src={require("assets/tokenImages/ETH.png")} width={26} />
          <Box ml={1}>ETH</Box>
        </Box>
      ),
    },
    {
      cell: <Box color="#431AB7">2.5%</Box>,
      cellAlign: "center",
    },
    {
      cell: <Box color="#431AB7">0.567 ETH</Box>,
      cellAlign: "center",
    },
    {
      cell: (
        <Box display="flex" alignItems="center">
          <SecondaryButton size="small" style={{ color: "#431AB7", border: "1px solid #431AB7" }}>
            Lend
          </SecondaryButton>
          <SecondaryButton size="small" style={{ color: "#431AB7", border: "1px solid #431AB7" }}>
            Withdraw
          </SecondaryButton>
        </Box>
      ),
    },
  ],
  [
    {
      cell: (
        <Box color="#431AB7" display="flex" alignItems="center">
          <img src={require("assets/tokenImages/USDT.png")} width={26} />
          <Box ml={1}>ETH</Box>
        </Box>
      ),
    },
    {
      cell: <Box color="#431AB7">2.5%</Box>,
      cellAlign: "center",
    },
    {
      cell: <Box color="#431AB7">0.567 ETH</Box>,
      cellAlign: "center",
    },
    {
      cell: (
        <Box display="flex" alignItems="center">
          <SecondaryButton size="small" style={{ color: "#431AB7", border: "1px solid #431AB7" }}>
            Lend
          </SecondaryButton>
          <SecondaryButton size="small" style={{ color: "#431AB7", border: "1px solid #431AB7" }}>
            Withdraw
          </SecondaryButton>
        </Box>
      ),
    },
  ],
];

const tableBorrowingData: Array<Array<CustomTableCellInfo>> = [
  [
    {
      cell: (
        <Box color="#431AB7" display="flex" alignItems="center">
          <img src={require("assets/tokenImages/ETH.png")} width={26} />
          <Box ml={1}>ETH</Box>
        </Box>
      ),
    },
    {
      cell: <Box color="#431AB7">2.5%</Box>,
      cellAlign: "center",
    },
    {
      cell: <Box color="#431AB7">0.567 ETH</Box>,
      cellAlign: "center",
    },
    {
      cell: (
        <Box display="flex" alignItems="center">
          <SecondaryButton size="small" style={{ color: "#431AB7", border: "1px solid #431AB7" }}>
            Borrow
          </SecondaryButton>
          <PrimaryButton size="small" style={{ background: "#431AB7" }}>
            Repay
          </PrimaryButton>
        </Box>
      ),
    },
  ],
  [
    {
      cell: (
        <Box color="#431AB7" display="flex" alignItems="center">
          <img src={require("assets/tokenImages/USDT.png")} width={26} />
          <Box ml={1}>ETH</Box>
        </Box>
      ),
    },
    {
      cell: <Box color="#431AB7">2.5%</Box>,
      cellAlign: "center",
    },
    {
      cell: <Box color="#431AB7">0.567 ETH</Box>,
      cellAlign: "center",
    },
    {
      cell: (
        <Box display="flex" alignItems="center">
          <SecondaryButton size="small" style={{ color: "#431AB7", border: "1px solid #431AB7" }}>
            Borrow
          </SecondaryButton>
          <PrimaryButton size="small" style={{ background: "#431AB7" }}>
            Repay
          </PrimaryButton>
        </Box>
      ),
    },
  ],
];

const NFTManageLoansPage = () => {
  const classes = useManageLoansPageStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));

  return (
    <div className={classes.root}>
      <BackButton purple />
      <div className={classes.headerSection}>Manage Your Loans</div>
      <div className={classes.balanceSection}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box className={classes.typo2} color="#EF41CB" mb={0.5}>
            Lending Balance
          </Box>
          <div className={classes.typo1}>100 USDTs</div>
        </Box>
        <div className={classes.netAPYSection}>
          <div className={classes.gradientSection}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <div className={classes.typo2}>Net APY</div>
              <Box className={classes.typo3} mt={1}>
                0 %
              </Box>
            </Box>
          </div>
        </div>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Box className={classes.typo2} color="#4541FF" mb={0.5}>
            Borrow Balance
          </Box>
          <div className={classes.typo1}>10240 USDTs</div>
        </Box>
      </div>
      <div className={classes.slideSection}>
        <GradientSlider
          marks={SlideMarks}
          step={1}
          value={56}
          disabled
          // onChange={(event: any, newValue: number | number[]) => {
          //   setClosenessDegree(newValue as number[]);
          // }}
          className={classes.slider}
          valueLabelDisplay="on"
          style={{ width: "90%" }}
        />
      </div>
      <div className={classes.positionSection}>
        <div className={classes.positionCard}>
          <Box ml={4} mb={4}>
            <div className={classes.typo3}>Lending positions</div>
          </Box>
          <CustomTable headers={tableLendingHeaders} rows={tableLendingData} placeholderText="No data" />
        </div>
        <div className={classes.positionCard}>
          <Box ml={4} mb={4}>
            <div className={classes.typo3}>Borrowing positions</div>
          </Box>
          <CustomTable headers={tableBorrowingHeaders} rows={tableBorrowingData} placeholderText="No data" />
        </div>
      </div>
    </div>
  );
};

export default NFTManageLoansPage;
