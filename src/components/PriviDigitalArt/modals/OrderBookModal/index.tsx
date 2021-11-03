import React, {useState, useEffect} from "react";

import { Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { PrimaryButton } from "shared/ui-kit";
import { OrderBookModalStyles } from "./index.style";
import { CustomTable, CustomTableHeaderInfo } from "shared/ui-kit/Table";
import Pagination from "@material-ui/lab/Pagination";

const tableHeaders: Array<CustomTableHeaderInfo> = [
  {
    headerName: "NFT ID",
    headerAlign: "center",
  },
  {
    headerName: "PRICE",
    headerAlign: "center",
  },
  {
    headerName: "ORDER STRENTG",
    headerAlign: "center",
  },
  {
    headerName: "EXPIRATION",
    headerAlign: "center",
  },
  {
    headerName: "FROM",
    headerAlign: "center",
  },
  {
    headerName: "URL",
    headerAlign: "center",
  },
];
const ROWS_PER_PAGE = 10;

export default function OrderBookModal({ open, handleClose = () => {}, onConfirm }) {
  const classes = OrderBookModalStyles();
  const [historyRows, setHistoryRows] = useState<any>([
    {nftid:'#4555', price:'0.3 ETH', offer:'99.9% below the floor', expiration:'3 Days', from:'0x1s3...23s', url:'OpenSea'},
    {nftid:'#4555', price:'0.3 ETH', offer:'99.9% below the floor', expiration:'3 Days', from:'0x1s3...23s', url:'OpenSea'},
    {nftid:'#4555', price:'0.3 ETH', offer:'99.9% below the floor', expiration:'3 Days', from:'0x1s3...23s', url:'OpenSea'},
    {nftid:'#4555', price:'0.3 ETH', offer:'99.9% below the floor', expiration:'3 Days', from:'0x1s3...23s', url:'OpenSea'},
    {nftid:'#4555', price:'0.3 ETH', offer:'99.9% below the floor', expiration:'3 Days', from:'0x1s3...23s', url:'OpenSea'},
    {nftid:'#4555', price:'0.3 ETH', offer:'99.9% below the floor', expiration:'3 Days', from:'0x1s3...23s', url:'OpenSea'},
    {nftid:'#4555', price:'0.3 ETH', offer:'99.9% below the floor', expiration:'3 Days', from:'0x1s3...23s', url:'OpenSea'},
    {nftid:'#4555', price:'0.3 ETH', offer:'99.9% below the floor', expiration:'3 Days', from:'0x1s3...23s', url:'OpenSea'},
    {nftid:'#4555', price:'0.3 ETH', offer:'99.9% below the floor', expiration:'3 Days', from:'0x1s3...23s', url:'OpenSea'},
    {nftid:'#4555', price:'0.3 ETH', offer:'99.9% below the floor', expiration:'3 Days', from:'0x1s3...23s', url:'OpenSea'},
    {nftid:'#4555', price:'0.3 ETH', offer:'99.9% below the floor', expiration:'3 Days', from:'0x1s3...23s', url:'OpenSea'},  ]);
  const [activePage, setActivePage] = useState<number>(1);

  
  const handleConfirm = () => {
    handleClose();
  }

  const handleCloseModal = () => {
    handleClose();
  }

  return (
    <Modal size="daoMedium" isOpen={open} onClose={handleCloseModal} showCloseIcon className={classes.container}>
      <>
        <Box display="flex" alignItems="center" flexDirection="column">
          <Box fontSize="32px" color="#431AB7" marginTop="57px" fontWeight="800">
            Order book
          </Box>
          <Box style={{color:'#431AB7', backgroundColor:'#DDFF57', padding:'31px', borderRadius:'20px'}} display="flex" justifyContent="space-between" alignItems="center" width="100%">
            <Box>
              <Box sx={{fontSize:'14px', fontWeight:400}}>Mean</Box>
              <Box sx={{fontSize:'24px', fontWeight:800}}>$55,55</Box>
            </Box>
            <Box></Box>
            <Box>
              <Box sx={{fontSize:'14px', fontWeight:400}}>Mean</Box>
              <Box sx={{fontSize:'24px', fontWeight:800}}>$55,55</Box>
            </Box>
            <Box></Box>
            <Box>
              <Box sx={{fontSize:'14px', fontWeight:400}}>Mean</Box>
              <Box sx={{fontSize:'24px', fontWeight:800}}>$55,55</Box>
            </Box>
            <Box></Box>
            <Box>
              <Box sx={{fontSize:'14px', fontWeight:400}}>Mean</Box>
              <Box sx={{fontSize:'24px', fontWeight:800}}>$55,55</Box>
            </Box>
            <Box></Box>
            <Box>
              <Box sx={{fontSize:'14px', fontWeight:400}}>Mean</Box>
              <Box sx={{fontSize:'24px', fontWeight:800}}>$55,55</Box>
            </Box>
          </Box>
          <Box className={classes.outBox} style={{ background: "white", marginTop:'14px'}}>
            <div className={classes.h2}>Redemption history</div>
            <div className={classes.table}>
              <CustomTable
                headers={tableHeaders}
                rows={historyRows.slice((activePage - 1) * ROWS_PER_PAGE, activePage * ROWS_PER_PAGE).map(item => [
                  {
                  cell: item.nftid,
                  },
                  {
                  cell: item.price,
                  },
                  {
                  cell: item.offer
                  },
                  {
                  cellAlign: "center",
                  cell: item.expiration,
                  },
                  {
                  cellAlign: "center",
                  cell: item.from,
                  },
                  {
                  cellAlign: "center",
                  cell: (
                      <Box display="flex" alignItems="center">
                        <img src={require("assets/icons/icon_ethscan.png")} /><span>Opensea</span>
                      </Box>
                  ),
                  },
              ])}
                placeholderText="No history"
              />
              <Box display="flex" m={2} justifyContent="center" width="100%" className={classes.pagination}>
                <Pagination
                  count={Math.ceil(historyRows.length / ROWS_PER_PAGE)}
                  page={activePage}
                  onChange={(_, page) => {
                    setActivePage(page);
                    //   selectedTableFilter === 0 ? getAirdrops() : getAllocations();
                  }}
                />
              </Box>
            </div>
          </Box>
        </Box>
      </>
    </Modal>
  );
}
