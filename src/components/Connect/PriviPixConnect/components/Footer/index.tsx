import React from "react";

import { ReactComponent as YoutubeIcon } from "assets/snsIcons/youtube.svg";
import { ReactComponent as TwitterIcon } from "assets/snsIcons/twitter.svg";
import { ReactComponent as InstagramIcon } from "assets/snsIcons/instagram.svg";
import { ReactComponent as LinkedInIcon } from "assets/snsIcons/linkedin.svg";
import { ReactComponent as TiktokIcon } from "assets/snsIcons/tiktok.svg";
import { ReactComponent as MediaIcon } from "assets/snsIcons/media.svg";
import { ReactComponent as DiscordIcon } from "assets/snsIcons/discord.svg";
import { ReactComponent as TelegramIcon } from "assets/snsIcons/telegram.svg";
import { ReactComponent as PriviBlueLogoIcon } from "assets/logos/privi_logo_blue.svg";
import Box from "shared/ui-kit/Box";
import { footerStyles } from "./index.styles";
import {
  handleDiscordLink,
  handleTelegramLink,
  handleYoutubeLink,
  handleTwitterLink,
  handleInstagramLink,
  handleLinkedinLink,
  handleTiktokLink,
  handleMediumLink,
  handleAboutLink,
  handleNewsletterLink,
  handleWyrtNFTLink,
  handleClaimIDOTokenLink,
  handleTermsAndConditionsLink,
} from "shared/constants/constants";

const Footer = () => {
  const classes = footerStyles();

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
          <Box className={classes.flexBox}>
            <Box className={classes.snsBox} onClick={handleDiscordLink}>
              <DiscordIcon />
            </Box>
            <Box className={classes.snsBox} onClick={handleTwitterLink}>
              <TwitterIcon />
            </Box>
            <Box className={classes.snsBox} onClick={handleInstagramLink}>
              <InstagramIcon />
            </Box>
            <Box className={classes.snsBox} onClick={handleTelegramLink}>
              <TelegramIcon />
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
            <Box className={classes.snsBox} onClick={handleYoutubeLink}>
              <YoutubeIcon width="26px" />
            </Box>
          </Box>
        </div>
        <div>
          <Box className={classes.header1} onClick={handleAboutLink}>
            About
          </Box>
          <Box className={classes.header1} onClick={handleNewsletterLink}>
            Newsletter
          </Box>
          <Box className={classes.header1} mt={1} onClick={handleWyrtNFTLink}>
            Wyrt NFTs
          </Box>
          <Box className={classes.header1} mt={1} onClick={handleClaimIDOTokenLink}>
            Claim IDO Tokens
          </Box>
          <Box className={classes.header1} mt={1} onClick={handleTermsAndConditionsLink}>
            Terms & Conditions
          </Box>
        </div>
      </Box>
    </Box>
  );
};

export default Footer;
