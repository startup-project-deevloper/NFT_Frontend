import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { InputBase, Grid } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

import { RootState, useTypedSelector } from "store/reducers/Reducer";
import { handleSetStatus } from "shared/functions/commonFunctions";
import { airdropTokensModalStyles, useAutoCompleteStyles } from "./AirdropTokensModal.styles";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";
import { Color, Gradient, Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import CustomSwitch from "shared/ui-kit/CustomSwitch";

import { BlockchainNets } from "shared/constants/constants";
import { useWeb3React } from "@web3-react/core";
import Web3 from "web3";
import { toNDecimals } from "shared/functions/web3";
import { airdropSocialToken } from "shared/services/API";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { switchNetwork } from "shared/functions/metamask";
import { getUnixEpochTimeStamp } from "shared/helpers";

const airdropIcon = require("assets/icons/airdrop.svg");
const searchIcon = require("assets/icons/search.png");

const AddIcon = () => (
  <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M6 11.5V1.5M1 6.5L11 6.5"
      stroke="white"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const RemoveIcon = () => (
  <svg width="12" height="13" viewBox="0 0 12 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.73291 1.16403C3.73291 0.908182 3.94032 0.700775 4.19617 0.700775H7.56264C7.81849 0.700775 8.0259 0.908182 8.0259 1.16403C8.0259 1.41988 7.81849 1.62729 7.56265 1.62729H4.19617C3.94032 1.62729 3.73291 1.41988 3.73291 1.16403Z"
      fill="white"
    />
    <path
      d="M0.258789 3.41791H1.49414L2.26623 12.0653C2.28252 12.309 2.4852 12.4984 2.72949 12.4978H9.0293C9.27359 12.4984 9.47627 12.309 9.49256 12.0653L10.2647 3.41791H11.5V2.49139H0.258789V3.41791Z"
      fill="white"
    />
  </svg>
);

type AirdropTokensModalProps = {
  open: boolean;
  handleClose: () => void;
  handleRefresh: () => void;
  community?: any;
  socialToken?: any;
  setTxSuccess: (boolean) => void;
  setTxModalOpen: (boolean) => void;
  setTxHash: (string) => void;
  availableReserves: string;
};

export const AirdropTokensModal: React.FC<AirdropTokensModalProps> = ({
  open,
  handleClose,
  handleRefresh,
  community,
  socialToken,
  setTxSuccess,
  setTxModalOpen,
  setTxHash,
  availableReserves,
}) => {
  const classes = airdropTokensModalStyles();
  const autocompleteStyle = useAutoCompleteStyles();

  const users = useSelector((state: RootState) => state.usersInfoList);
  const user = useTypedSelector(state => state.user);
  const userBalances = useTypedSelector(state => state.userBalances);

  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());
  const [usersList, setUsersList] = useState<string[]>([]);
  const [searchName, setSearchName] = useState<string>("");
  const [walletAddress, setWalletAddress] = useState<string>("");
  const [step, setStep] = useState<number>(0);
  const [usersTKN, setUsersTKN] = useState<any>({});
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [status, setStatus] = React.useState<any>(null);
  const [usersInfo, setUsersInfo] = useState<Object>({});

  const { account, library, chainId } = useWeb3React();
  const { showAlertMessage } = useAlertMessage();

  useEffect(() => {
    if (open) {
      if (community) {
        setWalletAddress(community.CommunityAddress);
      } else if (socialToken) {
        setWalletAddress(socialToken.PoolAddress);
      }
    }
  }, [community, socialToken]);

  useEffect(() => {
    if (step === 0) {
      setUsersTKN({});
    }
    setStatus(null);
  }, [step]);

  const handleCancel = () => {
    setUsersList([]);
    setStep(0);
    handleClose();
    setStatus(null);
  };

  const handleAddAmount = (e, user) => {
    const values = { ...usersTKN };
    values[user] = e.target.value;
    setUsersTKN({ ...values });
  };

  const handleKeypress = e => {
    const characterCode = e.key;
    if (characterCode === "Backspace") return;
    if (characterCode === ".") return;

    const characterNumber = Number(characterCode);
    if (characterNumber >= 0 && characterNumber <= 9) {
      if (e.currentTarget.value && e.currentTarget.value.length) {
        return;
      } else if (characterNumber === 0) {
        e.preventDefault();
      }
    } else {
      e.preventDefault();
    }
  };

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else if (step === 1) {
      let isValid = true;
      if (Object.keys(usersTKN).length === usersList.length) {
        Object.keys(usersTKN).map(key => {
          if (!usersTKN[key]) {
            isValid = false;
          }
          return true;
        });
      } else {
        isValid = false;
      }
      if (isValid) {
        setStep(2);
      } else {
        setStatus({
          msg: "Please add valid Token Values for all users.",
          key: Math.random(),
          variant: "error",
        });
      }
    }
  };

  // create requests and make transfers in parallel
  const handleSubmit = async () => {
    const targetChain = BlockchainNets.find(net => net.value === "Polygon Chain");
    if (chainId && chainId !== targetChain?.chainId) {
      const isHere = await switchNetwork(targetChain?.chainId || 0);
      if (!isHere) {
        showAlertMessage("Got failed while switching over to target netowrk", { variant: "error" });
        return;
      }
    }

    const web3APIHandler = targetChain.apiHandler;
    const web3 = new Web3(library.provider);
    const decimals = 18;

    const amounts: String[] = usersList.map(userAddress => toNDecimals(usersTKN[userAddress], decimals));

    const contractRes = await web3APIHandler.SocialERC20.airdropTokens(
      web3,
      account!,
      {
        addresses: usersList,
        amounts,
        contractAddress: socialToken.id,
      },
      setTxModalOpen,
      setTxHash,
      handleClose
    );

    if (contractRes.success) {
      setTxSuccess(true);

      const airdrops: Object[] = usersList.map(userAddress => ({
        from: usersInfo[userAddress],
        amount: usersTKN[userAddress],
        date: getUnixEpochTimeStamp(new Date()),
      }));

      const apiRes = await airdropSocialToken({
        userId: user.id,
        airdrops,
      });

      if (apiRes.success) {
        showAlertMessage("Airdrop sent to users", { variant: "success" });
        handleRefresh();
      } else showAlertMessage("Airdrop failed", { variant: "error" });
    } else {
      setTxSuccess(false);
    }
  };

  const validate = (): boolean => {
    // check creator has enough balance for airdrop
    if (socialToken) {
      let sum = 0;
      usersList.forEach(userAddress => (sum += usersTKN[userAddress]));
      if (!userBalances[socialToken.TokenSymbol] || userBalances[socialToken.TokenSymbol].Balance < sum) {
        handleSetStatus(`Insufficient ${socialToken.TokenSymbol} balance`, "error", setStatus);
        return false;
      }
    }
    return true;
  };

  const selectUsers = (
    <>
      <img src={airdropIcon} className={classes.logoImg} alt={"airdrop"} />
      <Box className={classes.title}>
        {socialToken ? "Airdrop Your Social Token" : "Airdrop Community Tokens"}
      </Box>
      <div className={classes.contentDescription}>
        Send part of your {socialToken ? "Social" : "Community"} Tokens to other users of your choice
      </div>
      <div className={classes.shareSection}>
        <label>Search by user name or wallet address</label>
        <div className={classes.inputContainer}>
          <Autocomplete
            clearOnBlur
            id="autocomplete-share-media"
            freeSolo
            classes={autocompleteStyle}
            key={autocompleteKey}
            onChange={(event: any, newValue: any | null) => {
              if (newValue) {
                const userAddress = newValue.address;
                const usersCopy = [...usersList];
                usersCopy.push(userAddress);
                setUsersList(usersCopy);

                let tempUsersInfo = usersInfo;
                tempUsersInfo[userAddress] = {
                  id: newValue.id,
                  address: userAddress,
                  name: newValue.name,
                  avatar: newValue.imageURL,
                };

                setUsersInfo(tempUsersInfo);
                // reset search query
                setAutocompleteKey(new Date().getTime());
              }
            }}
            options={[...users.filter(user => !usersList.includes(user.address))]}
            renderOption={(option, { selected }) => (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #eff2f8",
                  margin: 0,
                  width: "100%",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", maxWidth: "85%", overflow: "hidden" }}>
                  <div
                    className={classes.userImage}
                    style={{
                      backgroundImage:
                        typeof option !== "string" && option.imageURL ? `url(${option.imageURL})` : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      cursor: "pointer",
                      borderRadius: "50%",
                      width: "32px",
                      height: "32px",
                      border: "3px solid #ffffff",
                      filter: "drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.12))",
                      marginRight: "12px",
                    }}
                  />
                  <div style={{ overflow: "hidden" }}>
                    <div
                      className={classes.userLabel}
                      style={{
                        fontSize: "16px",
                        color: Color.MusicDAODark,
                      }}
                    >
                      {option.name}
                    </div>
                    <div
                      className={classes.userLabel}
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      {`@${option.address}`}
                    </div>
                  </div>
                </div>
                <div className={classes.addBox}>
                  <AddIcon />
                </div>
              </div>
            )}
            getOptionLabel={option => option.name}
            getOptionSelected={option => option.address === usersList[0]}
            renderInput={params => (
              <InputBase
                value={searchName}
                onChange={event => {
                  setSearchName(event.target.value);
                }}
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                style={{ width: "100%" }}
                autoFocus
                placeholder="Search users"
              />
            )}
          />
          <img src={searchIcon} alt={"search"} />
        </div>
      </div>
      {usersList.length > 0 ? (
        <div className={classes.usersDisplay}>
          {usersList.map((user, index) => {
            const userIndex = users.findIndex(u => u.address === user);
            return (
              <div key={user}>
                <div className={classes.leftSideSection}>
                  <div
                    className={classes.avatarSection}
                    style={{
                      backgroundImage:
                        users.find(u => u.address === user) &&
                        users[userIndex].imageURL &&
                        users[userIndex].imageURL.length > 0
                          ? `url(${users[userIndex].imageURL})`
                          : "none",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      cursor: "pointer",
                    }}
                  />
                  <div style={{ overflow: "hidden", textAlign: "start" }}>
                    <div
                      className={classes.userLabel}
                      style={{
                        fontSize: "16px",
                        color: Color.MusicDAODark,
                      }}
                    >
                      {users[userIndex].name}
                    </div>
                    <div
                      className={classes.userLabel}
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      {`@${users[userIndex].address}`}
                    </div>
                  </div>
                </div>
                <div
                  className={classes.removeBox}
                  onClick={() => {
                    const usersCopy = [...usersList];
                    usersCopy.splice(index, 1);
                    setUsersList(usersCopy);

                    let tempUsersInfo = usersInfo;
                    delete tempUsersInfo[user];
                    setUsersInfo(tempUsersInfo);
                  }}
                >
                  <RemoveIcon />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </>
  );

  const addAmount = (
    <>
      <Box className={classes.title} mt={2} width={1}>
        <Box style={{ borderBottom: "1px solid #eff2f8" }} pb={2}>
          {step === 1 ? `Airdrop ${socialToken ? "Social" : "Community"} Tokens` : "Allocation Summary"}
        </Box>
        {step === 1 && (
          <Box mt={2}>
            <div
              className={classes.contentDescription}
              style={{ color: "#431AB7", fontWeight: 800, marginBottom: 8 }}
            >
              Allocation
            </div>
            <div className={classes.contentDescription}>{`Indicate how much of your ${
              socialToken ? "Social" : "Community"
            } Tokens you would like to distribute among selected users.`}</div>
          </Box>
        )}
      </Box>
      {step === 1 && (
        <Box
          style={{
            color: Color.MusicDAODark,
            paddingBottom: 16,
            borderBottom: "1px solid #eff2f8",
            width: "100%",
          }}
        >
          Available to Airdrop <span style={{ fontWeight: 800 }}>{availableReserves}</span>
        </Box>
      )}
      <div className={classes.mainContent} style={{ marginTop: step === 2 ? 48 : 24 }}>
        <Grid container item xs={12} md={12} className={classes.step2UserAmount}>
          <Grid item md={8} xs={8} className={classes.step2Title}>
            User
          </Grid>
          <Grid item md={4} xs={4} className={classes.step2Title}>
            Amount
          </Grid>
        </Grid>
        {usersList.length > 0
          ? usersList.map(user => {
              const userIndex = users.findIndex(u => u.address === user);
              return (
                <Box key={user} className={classes.step2UserList} mb={1}>
                  <Grid container spacing={1} item xs={12} md={12} alignItems="center">
                    <Grid item xs={1} md={1}>
                      <div
                        className={classes.avatarSection}
                        style={{
                          backgroundImage:
                            users.find(u => u.address === user) &&
                            users[userIndex].imageURL &&
                            users[userIndex].imageURL.length > 0
                              ? `url(${users[userIndex].imageURL})`
                              : "none",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          cursor: "pointer",
                        }}
                      />
                    </Grid>
                    <Grid item xs={7} md={7}>
                      <div style={{ overflow: "hidden", textAlign: "start", marginLeft: 8 }}>
                        <div
                          className={classes.userLabel}
                          style={{
                            fontSize: "16px",
                            color: Color.MusicDAODark,
                          }}
                        >
                          {users[userIndex].name}
                        </div>
                        <div
                          className={classes.userLabel}
                          style={{
                            fontSize: "14px",
                          }}
                        >
                          {`@${users[userIndex].address}`}
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={4} md={4}>
                      {step === 1 ? (
                        <div className={classes.amountInputContainer}>
                          <InputWithLabelAndTooltip
                            type="number"
                            onKeyDown={handleKeypress}
                            inputValue={usersTKN[user]}
                            minValue={"0"}
                            onInputValueChange={e => handleAddAmount(e, user)}
                            overriedClasses={classes.tokenAmount}
                          />
                        </div>
                      ) : (
                        <div className={classes.userTKNSection}>
                          {usersTKN[user]} {community?.TokenSymbol ?? socialToken?.TokenSymbol ?? ""}
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </Box>
              );
            })
          : null}
        {step === 1 && (
          <Box
            fontSize="18px"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            width={1}
            mt={2}
            py={2}
            borderTop="1px solid #eff2f8"
            borderBottom="1px solid #eff2f8"
          >
            <Box>Make it anonymous</Box>
            <CustomSwitch
              theme="green"
              onChange={() => setIsAnonymous(prev => !prev)}
              checked={isAnonymous}
            />
          </Box>
        )}
      </div>
    </>
  );

  const mainContent = () => {
    switch (step) {
      case 0:
        return selectUsers;
      case 1:
        return addAmount;
      case 2:
        return addAmount;
      default:
        break;
    }
  };

  return (
    <Modal size="small" isOpen={open} onClose={handleCancel} className={classes.root} showCloseIcon>
      <div className={classes.mainContent}>
        {mainContent()}
        {usersList.length ? (
          <div className={classes.controlButtons}>
            <SecondaryButton
              size="medium"
              onClick={handleCancel}
              style={{ border: `1px solid ${Color.MusicDAODark}`, color: Color.MusicDAODark }}
              isRounded
            >
              Cancel
            </SecondaryButton>
            <div>
              {step > 0 && (
                <PrimaryButton
                  size="medium"
                  onClick={() => setStep(step - 1)}
                  style={{ background: "#1A1B1C", color: "#ffffff" }}
                  isRounded
                >
                  Back
                </PrimaryButton>
              )}
              {step < 2 ? (
                <PrimaryButton size="medium" style={{ background: "#431AB7" }} isRounded onClick={handleNext}>
                  Next
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  size="medium"
                  style={{ background: "#431AB7" }}
                  isRounded
                  onClick={handleSubmit}
                >
                  Confirm and Submit
                </PrimaryButton>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};
