import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { FormControl } from "@material-ui/core";

import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import SignInModal from "components/Login/SignInModal";
import { CreatePriviWalletModal } from "shared/ui-kit/Modal/Modals";
import Box from "shared/ui-kit/Box";
import { headerStyles } from "./index.styles";

const OPTIONS = ["choose options"];

const Header = ({ cardHidden }) => {
  const classes = headerStyles();
  const history = useHistory();

  return (
    <Box width={1}>
      <Box className={classes.headerBox} zIndex={1}>
        <img src={require("assets/logos/privi_exchange.png")} className={classes.logo} />
        <Box
          className={classes.backBox}
          onClick={() => {
            history.goBack();
          }}
        >
          <span className={classes.backButton} style={{marginRight: 16}}>{"<"}</span>
          <span className={classes.backButton}>{"Back"}</span>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
