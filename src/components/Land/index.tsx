import { useMediaQuery, useTheme } from "@material-ui/core";
import Axios from "axios";
import { CopyAddressIcon } from "components/PriviMusicDao/components/Icons/SvgIcons";
import React, { useState } from "react";
import { SecondaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { landStyles } from "./index.styles";

export default function Land() {
  const classes = landStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const [firstName, setFirstName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [referralCode, setReferralCode] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const onSubmit = () => {
    const body = {
      name: firstName,
      email: email,
      code: code,
      address: address,
    };
    Axios.post(`${URL()}/airdrop/registerWallet`, body)
      .then(res => {
        if (res.data.success) {
          setReferralCode(res.data.data.referralCode);
          setIsSubmitted(true);
        }
      })
      .catch(e => console.log(e.toString));
  };

  return (
    <Box className={classes.container}>
      <Box className={classes.content}>
        <img className={classes.img1} src={require("assets/icons/bubble.png")} />
        <img className={classes.img2} src={require("assets/icons/bubble.png")} />
        <img className={classes.img3} src={require("assets/icons/bubble.png")} />
        <img className={classes.img4} src={require("assets/icons/bubble.png")} />
        <img className={classes.img5} src={require("assets/icons/bubble.png")} />
        <img className={classes.img6} src={require("assets/icons/bubble.png")} />
        <img className={classes.img7} src={require("assets/icons/bubble.png")} />
        <img className={classes.img8} src={require("assets/icons/bubble.png")} />
        <img className={classes.img9} src={require("assets/icons/bubble.png")} />
        <img className={classes.img10} src={require("assets/icons/bubble.png")} />
        <img className={classes.img11} src={require("assets/icons/bubble.png")} />
        <Box className={classes.title}>privi trax</Box>
        <Box className={classes.header1} mt={1} textAlign="center">
          A new era OF music has arrived
        </Box>
        <Box className={classes.header2} mt={1} style={{ color: "#DDFF57" }} textAlign="center">
          trax token launching august 10
        </Box>
        {isSubmitted ? (
          <>
            <Box className={classes.yellowBox} mt={10}>
              <Box className={classes.header4} textAlign="center">
                Thanks you for signing up to our airdrop
                <br /> bonus, we will keep you posted soon!
              </Box>
            </Box>
            <Box display="flex" alignItems="center" mt={8}>
              <img src={require("assets/icons/symbol_star_1.png")} />
              <Box className={classes.header4} mx={1} textAlign="center">
                You can use the below referral code to invite friends
              </Box>
              <img src={require("assets/icons/symbol_star_1.png")} />
            </Box>
            <Box className={classes.staticBox} mt={7}>
              <Box className={classes.header4} mr={4}>
                {referralCode}
              </Box>
              <CopyAddressIcon color="#431AB7" />
            </Box>
            <Box className={classes.staticBox} mt={7}>
              <Box className={classes.header4} mr={4}>
                prividrop.com/trax/ref-{referralCode}
              </Box>
            </Box>
            <Box mt={8} className={classes.header3} textAlign="center">
              You will <span style={{ color: "#DDFF57" }}>get a 20% bonus</span> on every
              {!isMobile && <br />}referred friend and
              <span style={{ color: "#DDFF57" }}>they would also {!isMobile && <br />}get a 20%</span> extra
              when using your code.
            </Box>
          </>
        ) : (
          <>
            <Box className={`${classes.headerBox} ${classes.header3}`} my={5}>
              <Box display="flex" alignItems="center" mb={isMobile ? 1 : 0}>
                <img src={require("assets/icons/symbol_star.png")} className={classes.starImg} />
                <span style={{ marginLeft: "16px" }}>EARN WHILE YOU LIKE</span>
              </Box>
              <Box display="flex" alignItems="center" mb={isMobile ? 1 : 0} mx={isMobile ? 0 : 8}>
                <img src={require("assets/icons/symbol_star.png")} className={classes.starImg} />
                <span style={{ marginLeft: "16px" }}>KILL PirACY</span>
              </Box>
              <Box display="flex" alignItems="center" mb={isMobile ? 1 : 0}>
                <img src={require("assets/icons/symbol_star.png")} className={classes.starImg} />
                <span style={{ marginLeft: "16px" }}>ARTISTS earn 3X SPOTIFY</span>
              </Box>
            </Box>
            <SecondaryButton
              size="medium"
              onClick={() => {}}
              style={{
                background: "#DDFF57",
                border: "none",
                color: "#431AB7",
                paddingLeft: "32px",
                paddingRight: "32px",
              }}
              className={classes.header3}
            >
              LEARN MORE
            </SecondaryButton>
            <Box className={classes.header1} style={{ lineHeight: "40px" }} mt={8}>
              TOKEN AIRDROP
            </Box>
            <Box
              className={classes.header2}
              mt={1}
              style={{ color: "#DDFF57", lineHeight: "30.24px", textAlign: "center" }}
            >
              Register your wallet here for an early sign up bonus
            </Box>
            <Box mt={2} display="flex" justifyContent="center" width={1}>
              <InputWithLabelAndTooltip
                overriedClasses={classes.inputBox}
                type="text"
                placeHolder="FIRST NAME"
                inputValue={firstName}
                onInputValueChange={e => setFirstName(e.target.value)}
              />
            </Box>
            <Box mt={1} display="flex" justifyContent="center" width={1}>
              <InputWithLabelAndTooltip
                overriedClasses={classes.inputBox}
                type="text"
                placeHolder="EMAIL"
                inputValue={email}
                onInputValueChange={e => setEmail(e.target.value)}
              />
            </Box>
            <Box mt={1} display="flex" justifyContent="center" width={1}>
              <InputWithLabelAndTooltip
                overriedClasses={classes.inputBox}
                type="text"
                placeHolder="Referral Code (optional)"
                inputValue={code}
                onInputValueChange={e => setCode(e.target.value)}
              />
            </Box>
            <Box mt={1} mb={3} display="flex" justifyContent="center" width={1}>
              <InputWithLabelAndTooltip
                overriedClasses={classes.inputBox}
                placeHolder={
                  isMobile
                    ? `ERC-20 Address you have
used with Defi Games
(Hint: Axie Infinity)`
                    : `ERC-20 Address you have used with Defi Games
(Hint: Axie Infinity)`
                }
                inputValue={address}
                onInputValueChange={e => setAddress(e.target.value)}
                style={{
                  border: "none",
                  rows: isMobile ? 3 : 2,
                  textAlign: "center",
                  outline: "none",
                  color: "#431AB7",
                }}
              />
            </Box>
            <SecondaryButton
              size="medium"
              onClick={onSubmit}
              style={{
                background: "#DDFF57",
                border: "none",
                color: "#431AB7",
                paddingLeft: "32px",
                paddingRight: "32px",
              }}
              className={classes.header3}
            >
              SUBMIT
            </SecondaryButton>
            <Box mt={3} className={classes.header4} style={{ color: "#DDFF57", textAlign: "center" }}>
              We will be announcing the detailed eligibility requirements soon after
              {isMobile ? "" : <br />} the Privi Trax launchpad on Ignition and BSCPad on August 10 2021
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}
