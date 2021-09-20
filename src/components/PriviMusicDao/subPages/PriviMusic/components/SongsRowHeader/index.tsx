import React from "react";
import { createStyles, TableCell, TableHead, TableRow, useMediaQuery, withStyles } from "@material-ui/core";

export default function SongsRowHeader({ page }) {
  const mobileMatch = useMediaQuery("(max-width:600px)");

  if (mobileMatch) {
    return null;
  } else {
    return (
      <TableHead>
        <StyledTableRow>
          <StyledTableCell align="left">TITLE</StyledTableCell>
          <StyledTableCell align="center">ALBUM</StyledTableCell>
          {
            page !== "search" ?
              <StyledTableCell align="center">VIEWS</StyledTableCell> :
              null
          }
          <StyledTableCell align="center">DURATION</StyledTableCell>
          <StyledTableCell></StyledTableCell>
        </StyledTableRow>
      </TableHead>
    );
  }
}

const StyledTableCell = withStyles(() =>
  createStyles({
    head: {
      fontFamily: "Agrandir",
      fontSize: "14px",
      color: "#181818",
      fontWeight: 800,
      borderBottom: "1px solid #EFF2F8",
      padding: 16,
    },
  })
)(TableCell);

const StyledTableRow = withStyles(() =>
  createStyles({
    head: {
      background: "transparent",
    },
  })
)(TableRow);
