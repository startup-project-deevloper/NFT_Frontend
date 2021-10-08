import React from "react";
import { Modal } from "shared/ui-kit";
import { Box, makeStyles } from "@material-ui/core";
import { CustomTable, CustomTableHeaderInfo } from "shared/ui-kit/Table";

const useOffersModalStyles = makeStyles(theme => ({
  root: {
    width: "524px !important",
    display: "flex",
    flexDirection: "column",
    "& label": {
      color: "#1A1B1C",
      fontSize: "14px",
      lineHeight: "120%",
    },
    "& .MuiInput-root": {
      margin: "8px 0px 0px",
      background: "#FFFFFF",
      borderRadius: "8px",
      height: "40px",
      border: "1px solid #A4A4A4",
      fontFamily: "Agrandir",
    },
  },
  title: {
    fontSize: "18px",
    lineHeight: "14.5%",
    color: "#181818",
    alignSelf: "center",
    marginBottom: "24px",
    textAlign: "center",
  },
  offersTableContainer: {
    width: "100%",
    boxShadow: "0px 2px 14px rgba(0, 0, 0, 0.08)",
    borderRadius: "14px",
    "& .MuiTableCell-head": {
      backgroundColor: "#F7F9FE",
      color: "#181818 !important",
      fontSize: "14px",
      lineHeight: "120%",
      [theme.breakpoints.down("xs")]: {
        padding: 8,
        fontSize: 12
      },
    },

    "& .MuiTableCell-body": {
      color: "#707582",
      borderBottom: "1px solid #17171718",
      fontSize: "14px",
      lineHeight: "120%",
      [theme.breakpoints.down("xs")]: {
        padding: 8,
        fontSize: 10
      },
    },
  },
}));

const OfferHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerName: "TOKEN",
    headerAlign: "center",
  },
  {
    headerName: "SYMBOL",
    headerAlign: "center",
  },
  {
    headerName: "PRICE",
    headerAlign: "center",
  },
  {
    headerName: "AMOUNT",
    headerAlign: "center",
  },
  {
    headerName: "",
    headerAlign: "center",
  },
];

export const OffersModal = ({ list, type, open, onClose }) => {
  const classes = useOffersModalStyles();

  return (
    <Modal size="small" isOpen={open} onClose={onClose} showCloseIcon className={classes.root}>
      <div className={classes.title}>{type} Offers</div>
      <Box className={classes.offersTableContainer}>
        <CustomTable
          headers={OfferHeaders}
          rows={list}
          placeholderText={`There are no ${type} Offers yet`}
          theme="offers blue"
        />
      </Box>
    </Modal>
  );
};
