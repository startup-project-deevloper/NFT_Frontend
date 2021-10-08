import React, { useState, useContext } from "react";
import NFTLoansHome from "./components/Home";
import NFTLoansDeposit from "./components/Deposit";
import Box from "shared/ui-kit/Box";
import DigitalArtContext from "shared/contexts/DigitalArtContext";
import { useNFTLoansPageStyles } from "./index.styles";

const NFTLoansPage = () => {
  const classes = useNFTLoansPageStyles();
  const { setOpenFilters } = useContext(DigitalArtContext);
  const [openDepositPage, setOpenDepositPage] = useState<boolean>(false);

  React.useEffect(() => {
    setOpenFilters(false);
  }, []);

  return (
    <Box className={classes.main}>
      {!openDepositPage ? (
        <NFTLoansHome setOpenDepositPage={setOpenDepositPage} />
      ) : (
        <NFTLoansDeposit setOpenDepositPage={setOpenDepositPage} />
      )}
      {/* <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        color="white"
        width={1}
        height={1}
        style={{ background: "#000000a0", position: "absolute", left: 0, top: 0 }}
      >
        <Box style={{ background: "#00000060", borderRadius: "16px" }} px={20} textAlign="center" pt={4}>
          <Box height="175px" display="flex" alignItems="center" justifyContent="center">
            <img src={require("assets/logos/privi_pix_alpha_white.png")} width={200} alt={"privi"} />
          </Box>
          <h1>Coming soon</h1>
        </Box>
      </Box> */}
    </Box>
  );
};

export default React.memo(NFTLoansPage);
