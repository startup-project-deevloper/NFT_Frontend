import React from "react";
import { useHistory } from "react-router-dom";
import Box from "shared/ui-kit/Box";
import { ChevronIconLeft } from "shared/ui-kit/Icons";
import { headerStyles } from "./index.styles";

const Header = ({ cardHidden }) => {
  const classes = headerStyles();
  const history = useHistory();
  return (
    <Box width={1}>
      <Box className={classes.headerBox} zIndex={1}>
        <Box className={classes.title}>
          Privi <span style={{ fontWeight: 400 }}>WALLET</span>
        </Box>
        <Box
          className={classes.backBox}
          onClick={() => {
            history.goBack();
          }}
        >
          <Box mr={3}>
            <ChevronIconLeft />
          </Box>
          <span className={classes.backButton}>Back</span>
        </Box>
        {!cardHidden && <img src={require("assets/pixImages/WalletCards.png")} className={classes.card} />}
      </Box>
    </Box>
  );
};

export default Header;
