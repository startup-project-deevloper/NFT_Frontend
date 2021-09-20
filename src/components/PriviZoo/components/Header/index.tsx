import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { FormControl } from "@material-ui/core";

import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
import { StyledMenuItem, StyledSelect } from "shared/ui-kit/Styled-components/StyledComponents";
import { PrimaryButton, SecondaryButton } from "shared/ui-kit";
import SignInModal from "components/Login/SignInModal";
import { CreatePriviWalletModal } from "shared/ui-kit/Modal/Modals";
import Box from 'shared/ui-kit/Box';
import { headerStyles } from './index.styles';

const OPTIONS = ["choose options"];

const Header = () => {
  const classes = headerStyles();
  const history = useHistory();

  const [option, setOption] = useState<any>();

  const [openSignInModal, setOpenSignInModal] = useState<boolean>(false);
  const [openPriviWalletDialog, setOpenPriviWalletDialog] = useState<boolean>(false);

  return (
    <Box width={1}>
      <Box className={classes.headerBox} zIndex={1}>
        <img src={require("assets/logos/privi_color_log.png")} />
        <Box className={classes.flexBox}>
          {/* <SearchWithCreate
            searchValue={""}
            searchPlaceholder="Search for Apps"
            handleSearchChange={() => {}}
            theme="light"
          />
          <Box className={classes.header1} ml={2} minWidth="120px">
            Filters and Sorting
          </Box>
          <Box className={classes.dotBox}>
            <Box>3</Box>
          </Box>
          <Box ml={2}>
            <FormControl variant="outlined">
              <StyledSelect className={classes.select} value={option} onChange={v => {}}>
                {OPTIONS.map((item, index) => (
                  <StyledMenuItem key={index} value={item}>
                    {item}
                  </StyledMenuItem>
                ))}
              </StyledSelect>
            </FormControl>
          </Box> */}
        </Box>
        <Box className={classes.flexBox}>
          <SecondaryButton
            size="small"
            onClick={() => {
              setOpenPriviWalletDialog(true);
            }}
          >
            Get privi wallet
          </SecondaryButton>
          <PrimaryButton
            size="small"
            onClick={() => {
              setOpenSignInModal(true);
            }}
          >
            Sign In
          </PrimaryButton>
        </Box>
      </Box>
      {openSignInModal && (
        <SignInModal open={openSignInModal} handleClose={() => setOpenSignInModal(false)} />
      )}
      {openPriviWalletDialog && (
        <CreatePriviWalletModal
          open={openPriviWalletDialog}
          handleClose={() => setOpenPriviWalletDialog(false)}
          handleOk={() => {
            setOpenPriviWalletDialog(false);
            history.push("/create-wallet");
          }}
        />
      )}
    </Box>
  );
};

export default Header;
