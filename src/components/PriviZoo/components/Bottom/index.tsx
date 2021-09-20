import React from "react";

import { Hidden } from "@material-ui/core";

import { ReactComponent as YoutubeIcon } from "assets/snsIcons/youtube.svg";
import { ReactComponent as TwitterIcon } from "assets/snsIcons/twitter.svg";
import { ReactComponent as InstagramIcon } from "assets/snsIcons/instagram.svg";
import { ReactComponent as LinkedInIcon } from "assets/snsIcons/linkedin.svg";
import { ReactComponent as TiktokIcon } from "assets/snsIcons/tiktok.svg";
import { ReactComponent as MediaIcon } from "assets/snsIcons/media.svg";
import { ReactComponent as PriviBlueLogoIcon } from "assets/logos/privi_logo_blue.svg";
import Box from "shared/ui-kit/Box";
import { bottomStyles } from "./index.styles";

import {
  handleYoutubeLink,
  handleTwitterLink,
  handleInstagramLink,
  handleLinkedinLink,
  handleTiktokLink,
  handleMediumLink,
  handleHomeLink,
  handleLightPaperLink,
  handleTokenLink,
  handleKnowledgeHubLink,
  handleTermsAndConditionsLink,
} from "shared/constants/constants";

const Bottom = () => {
  const classes = bottomStyles();

  return (
    <Box className={classes.bottomBox}>
      <Box className={classes.contentBox}>
        <div>
          <div>
            <PriviBlueLogoIcon />
          </div>
          <Box className={classes.title2} color="#181818" mt={"55px"}>
            Find us on
          </Box>
          <Hidden xsDown>
            <Box className={classes.flexBox}>
              <Box className={classes.snsBox} onClick={handleYoutubeLink}>
                <YoutubeIcon width="26px" />
              </Box>
              <Box className={classes.snsBox} onClick={handleTwitterLink}>
                <TwitterIcon />
              </Box>
              <Box className={classes.snsBox} onClick={handleInstagramLink}>
                <InstagramIcon />
              </Box>
            </Box>
            <Box className={classes.flexBox} mt={1}>
              <Box className={classes.snsBox} onClick={handleLinkedinLink}>
                <LinkedInIcon />
              </Box>
              <Box className={classes.snsBox} onClick={handleTiktokLink}>
                <TiktokIcon />
              </Box>
              <Box className={classes.snsBox} onClick={handleMediumLink}>
                <MediaIcon />
              </Box>
            </Box>
          </Hidden>
          <Hidden smUp>
            <Box className={classes.flexBox}>
              <Box className={classes.snsBox} onClick={handleYoutubeLink}>
                <YoutubeIcon width="26px" />
              </Box>
              <Box className={classes.snsBox} onClick={handleTwitterLink}>
                <TwitterIcon />
              </Box>
              <Box className={classes.snsBox} onClick={handleInstagramLink}>
                <InstagramIcon />
              </Box>
              <Box className={classes.snsBox} onClick={handleLinkedinLink}>
                <LinkedInIcon />
              </Box>
              <Box className={classes.snsBox} onClick={handleTiktokLink}>
                <TiktokIcon />
              </Box>
              <Box className={classes.snsBox} onClick={handleMediumLink}>
                <MediaIcon />
              </Box>
            </Box>
          </Hidden>
        </div>
        <div>
          <Box className={classes.title2} color="#4218B5">
            EXPLORE
          </Box>
          <Box className={classes.header1} onClick={handleHomeLink}>
            Home
          </Box>
        </div>
        <div>
          <Box className={classes.title2} color="#4218B5">
            LEARN
          </Box>
          <Box className={classes.header1} onClick={handleLightPaperLink}>
            Lightpaper
          </Box>
          <Box className={classes.header1} mt={1} onClick={handleTokenLink}>
            Token Economy
          </Box>
          <Box className={classes.header1} mt={1} onClick={handleKnowledgeHubLink}>
            Knowledge Hub
          </Box>
          <Box className={classes.header1} mt={1} onClick={handleTermsAndConditionsLink}>
            Terms & Conditions
          </Box>
        </div>
      </Box>
    </Box>
  );
};

export default Bottom;
