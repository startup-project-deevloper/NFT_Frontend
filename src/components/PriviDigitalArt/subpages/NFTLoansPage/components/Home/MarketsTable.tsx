import React from 'react';
import { 
  Typography, 
  Divider,
  Table,
  TableHead,
  TableCell,
  TableRow,
  TableBody, 
} from '@material-ui/core';
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import { isArray } from "lodash";

import { useNFTLoansPageStyles } from "../../index.styles";

const MarketsTable = ({ tableHeaders, tableData }) => {
  const classes = useNFTLoansPageStyles();

  return (
    <div className={classes.marketsCard}>
      <div className={classes.tableHeader}>
        <Typography className={classes.headerTitle}>All markets</Typography>
      </div>
      <Divider className={classes.divider} /> 
      <Table>
        <TableHead>
          <TableRow
          >
            {tableHeaders?.map((header, index) => (
              <TableCell
                width={header.headerWidth || "auto"}
                key={index}
                align={header.headerAlign || "inherit"}
                style={{ cursor: header.sortable ? "pointer" : "auto" }}
              >
                {header.headerName}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData?.length > 0 ? (
            // @ts-ignore
            tableData?.map((row, i) => {
              const rowData = isArray(row) ? row : row?.data
              return (
                <React.Fragment>
                  <TableRow key={i}>
                    {rowData?.map((cellData, index) => (
                      <TableCell align={cellData.cellAlign || "inherit"} key={cellData.cell + "-" + index}>
                        {cellData.cell}
                      </TableCell>
                    ))}
                  </TableRow>
                  {
                    row?.collapse && (
                      <TableRow>
                        {row.collapse}
                      </TableRow>
                    )
                  }
                </React.Fragment>
              )
            })
          ) : (
            <TableRow>
              <TableCell align="center" colSpan={tableHeaders.length}>
                No Data
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
};

export default MarketsTable;