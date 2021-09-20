import React from "react";
import { makeStyles } from "@material-ui/core";

import Box from "shared/ui-kit/Box";
import { Text } from "../ui-kit";
import { Color, FontSize, PrimaryButton } from "shared/ui-kit";
import { priviMusicDaoPageStyles } from "components/PriviMusicDao/index.styles";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
  container: {
    position: "relative",
    height: "100%",
    background: Color.White,
    boxShadow: "0px 10px 20px rgba(19, 45, 38, 0.07)",
    borderRadius: 20,
    overflow: "hidden",
  },
  footer: {
    position: "relative",
    borderTop: "1px solid rgba(255, 255, 255, 0.12)",
    height: 100,
  },
  footerBack: {
    position: "absolute",
    width: "100%",
    height: 200,
    background: "linear-gradient(180deg, rgba(28, 31, 41, 0) 0%, #242D43 54.55%)",
    bottom: 0,
    left: 0,
  },
  follow: {
    background: `${Color.White} !important`,
    color: `${Color.MusicDAODark} !important`,
  },
});

export default function ArtistCard({ data, customSize }: { data: any; customSize?: any }) {
  const commonClasses = priviMusicDaoPageStyles();
  const classes = useStyles();
  const history = useHistory();

  return (
    <Box
      display="flex"
      flexDirection="column"
      className={classes.container}
      style={{
        width: customSize?.width ? customSize.width : "",
        height: customSize?.height ? customSize.height : "",
        cursor: "pointer",
      }}
      onClick={() => history.push(`/trax/artists/${data.id}`)}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        style={{
          backgroundImage: `url(${data.image})`,
        }}
        flex={1}
        px={2}
        py={3}
      >
        <div className={classes.footerBack} />
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="space-between">
          <PrimaryButton size="small" className={commonClasses.primaryButton} isRounded>
            Claim
          </PrimaryButton>
          <img width="32" src={require("assets/musicDAOImages/trending.png")} alt="trending" />
        </Box>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          zIndex={9999}
        >
          <Text size={FontSize.XL} color={Color.White}>
            {data.name}
          </Text>
          <CheckIcon />
        </Box>
      </Box>
      <Box
        className={classes.footer}
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        px={2}
      >
        <Box display="flex" flexDirection="column">
          <Text color={Color.White}>{data.following}</Text>
          <Text color={Color.White}>Followers</Text>
        </Box>
        <PrimaryButton className={classes.follow} size="small" isRounded>
          Follow
        </PrimaryButton>
      </Box>
    </Box>
  );
}

const CheckIcon = () => (
  <svg width="21" height="20" viewBox="0 0 21 20" fill="none">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.1218 9.00966C20.6293 9.57311 20.6293 10.4288 20.1218 10.9923L19.0528 12.1791C18.7717 12.4912 18.6363 12.908 18.6803 13.3256L18.8476 14.914C18.9271 15.6686 18.4236 16.3612 17.6813 16.5183L16.12 16.8489C15.7083 16.936 15.3531 17.1942 15.1431 17.559L14.3475 18.9411C13.9685 19.5995 13.1529 19.8644 12.4594 19.5544L11.0035 18.9038C10.6189 18.7319 10.1794 18.7319 9.79476 18.9038L8.33891 19.5544C7.64538 19.8644 6.82978 19.5995 6.4508 18.9411L5.65519 17.559C5.44522 17.1942 5.09 16.936 4.67825 16.8489L3.11694 16.5183C2.37468 16.3612 1.87117 15.6686 1.95064 14.9141L2.11795 13.3256C2.16195 12.9079 2.02656 12.4912 1.74549 12.1792L0.676509 10.9923C0.169025 10.4288 0.169029 9.57312 0.676517 9.00967L1.74552 7.8228C2.0266 7.51073 2.16199 7.09401 2.11799 6.67633L1.95069 5.0879C1.87121 4.33337 2.37472 3.64077 3.11698 3.48363L4.67829 3.15309C5.09004 3.06592 5.44526 2.80771 5.65523 2.44295L6.45084 1.06084C6.82982 0.402487 7.64541 0.137544 8.33895 0.447493L9.79482 1.09814C10.1794 1.27002 10.619 1.27002 11.0036 1.09814L12.4594 0.447493C13.153 0.137544 13.9686 0.402488 14.3475 1.06084L15.1431 2.44295C15.3531 2.80771 15.7083 3.06592 16.1201 3.15309L17.6814 3.48363C18.4236 3.64077 18.9272 4.33337 18.8477 5.08791L18.6803 6.67632C18.6364 7.094 18.7717 7.51073 19.0528 7.82281L20.1218 9.00966ZM14.8883 8.69675C15.3221 8.26291 15.3221 7.55951 14.8883 7.12566C14.4545 6.69182 13.7511 6.69182 13.3172 7.12566L8.91844 11.5244L7.48213 10.0881C7.04829 9.65429 6.34489 9.65429 5.91105 10.0881C5.4772 10.522 5.4772 11.2254 5.91105 11.6592L8.1329 13.8811C8.34123 14.0894 8.6238 14.2064 8.91844 14.2064C9.21307 14.2064 9.49564 14.0894 9.70398 13.8811L14.8883 8.69675Z"
      fill="white"
    />
  </svg>
);
