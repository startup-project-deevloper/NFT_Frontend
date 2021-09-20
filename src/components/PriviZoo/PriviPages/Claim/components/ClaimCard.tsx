import React from "react";

import { useMediaQuery, useTheme } from "@material-ui/core";

import { StyledDivider, Color } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { useClaimStyles } from "../index.styles";

interface IClaimTokenCardProps {
  title: string;
  imgUrl: string;
  scanUrl: string;
  scanAddress: string;
  claimableAmount: string | number;
  buttonTitle?: string;
  tokenSymbol: string;
  handleClaim: () => void;
}

export const ClaimTokenCard: React.FC<IClaimTokenCardProps> = ({
  title,
  imgUrl,
  scanUrl,
  scanAddress,
  claimableAmount,
  handleClaim,
  buttonTitle,
  tokenSymbol,
}) => {
  const classes = useClaimStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(550));

  return (
    <Box className={classes.grayBox} mt={1}>
      <Box padding="10px">
        <img src={imgUrl} alt="PRIVI TRAX" width={100} />
      </Box>
      <Box style={{ flex: 1 }}>
        <Box display="flex" alignItems="center">
          <Box ml={1}>
            <Box mb={0.5} className={classes.title2}>
              {title}
            </Box>

            <div>Contract:</div>
            <Box display="flex" alignItems="center" mt={0.5}>
              <img src={require("assets/walletImages/contract.svg")} alt="" />
              <a href={scanUrl} target="_blank" className={classes.scanAddress}>
                {scanAddress}
              </a>
            </Box>
          </Box>
        </Box>
        <StyledDivider color={Color.Black} style={{ opacity: "0.1" }} type="solid" margin={2} />
        <Box
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Box> Claimable </Box>
            <div className={classes.title}>{`${claimableAmount} ${tokenSymbol}`}</div>
          </Box>
          <button
            className={classes.button}
            style={{
              background: "#4218B5",
            }}
            onClick={handleClaim}
          >
            {buttonTitle}
          </button>
        </Box>
      </Box>
    </Box>
  );
};
