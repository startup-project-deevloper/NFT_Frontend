import React from "react";
import Box from "shared/ui-kit/Box";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import {createNftOptionCardStyles} from "./index.styles";
import Tooltip from '@material-ui/core/Tooltip';
import { Grid } from '@material-ui/core';

export default function CreateNftOptionCard() {
  const classes = createNftOptionCardStyles();

  return (
    <Grid item xs={12} sm={6} md={4} lg={4}>
      <Box display="flex" flexDirection="column" alignItems="center" >
        <div className={classes.card}>
          <div className={classes.innerBox}>
              <Box display="flex" justifyContent="center" alignItems="baseline" width={1} mb={"8px"}>
                <Tooltip title={`sss`}>
                  <div className={classes.ntfName}>NFT NAME</div>
                </Tooltip>
              </Box>
            <img
              src={require(`assets/backgrounds/digital_art_1.png`)}
              alt={'image'}
            />
            <div className={classes.starGroup}>
              <Box fontSize={7.8} mr={"2px"}>
                🌟{" "}
              </Box>
              <Box fontSize={11.7} mr={"2px"} pt={1}>
                🌟{" "}
              </Box>
              <Box fontSize={7.8}>🌟 </Box>
            </div>
          </div>
        </div>
      </Box>
    </Grid>
  );
}
