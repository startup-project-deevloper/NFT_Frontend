import React from "react";
import { useHistory } from "react-router-dom";
import Box from "shared/ui-kit/Box";
import { headerStyles } from "./index.styles";
import { ChevronIconLeft } from "shared/ui-kit/Icons";
const OPTIONS = ["choose options"];

const Header = ({ cardHidden }) => {
  const classes = headerStyles();
  const history = useHistory();

  return (
    <Box width={1}>
      <Box className={classes.headerBox} zIndex={1}>
        <img src={require("assets/logos/privi_metaverse_logo.png")} className={classes.logo} />
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
