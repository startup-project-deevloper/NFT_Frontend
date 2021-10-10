import React, { useState, useEffect, useRef } from "react";
// import DateFnsUtils from "@date-io/date-fns";
// import axios from "axios";
import { useSelector } from "react-redux";
import { Fade, Tooltip } from "@material-ui/core";
// import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import { RootState } from "store/reducers/Reducer";
// import URL from "shared/functions/getURL";
import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import { Color, Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { mediaTermsModalStyles } from "./index.styles";
import Box from "shared/ui-kit/Box";
import { InfoIcon } from "shared/ui-kit/Icons";
// import FileUpload from "shared/ui-kit/Page-components/FileUpload";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { musicDAORegisterMedia, IRegisterMedia, getTypeToTokenListMap } from "shared/services/API";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { buildJsxFromObject, formatNumber } from "shared/functions/commonFunctions";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import axios from "axios";
import URL from "../../../../shared/functions/getURL";

// const dateIcon = require("assets/icons/date.svg");
// const timeIcon = require("assets/icons/time.svg");

const RewardTokenMap = {
  CRYPTO: "Crypto",
  NFTMEDIA: "NFT Tokens",
  MEDIAPOD: "Pod Tokens",
  SOCIAL: "Social",
};

const mediaCopyTermsModal = ({ open, handleClose, pod, media, handleRefresh }) => {
  const userSelector = useSelector((state: RootState) => state.user);
  const { showAlertMessage } = useAlertMessage();

  const [tabmediaCopyTerms, setTabmediaCopyTerms] = useState<number>(0);
  const classes = mediaTermsModalStyles();

  const [mediaCopy, setMediaCopy] = useState<any>({
    PodAddress: "",
    MediaSymbol: "",
    Type: "",
    PaymentType: "DYNAMIC",
    Copies: 0,
    Royalty: 0,
    FundingToken: "USDT",
    ReleaseDate: Math.floor(Date.now() / 1000),
    PricePerSecond: 0,
    Price: 0,
    IsRecord: false,
    RecordToken: "USDT",
    RecordPaymentType: "DYNAMIC",
    RecordPrice: 0,
    RecordPricePerSecond: 0,
    RecordCopies: 0,
    RecordRoyalty: 0,

    Title: "",
    Description: "",
    ExclusivePermissions: false,
    RewardToken: "USDT",
    RewardPrice: 0,
  });

  const [upload, setUpload] = useState<any>(null);
  const [uploadImg, setUploadImg] = useState<any>(null);
  const [upload1, setUpload1] = useState<any>(null);
  const [uploadImg1, setUploadImg1] = useState<any>(null);

  // rewards tab
  const [tokens, setTokens] = useState<any>({});
  const [rewardTokenType, setRewardTokenType] = useState<string>(Object.keys(RewardTokenMap)[0]);

  const payloadRef = useRef<any>();
  const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  // set pod address and media symbol
  useEffect(() => {
    /*setMediaCopy({
      ...mediaCopy,
      PodAddress: pod.PodAddress,
      MediaName: media.MediaName,
      MediaSymbol: media.MediaSymbol,
      Type: media.Type,
      Collabs: media.Collabs,
    });*/
    setMediaCopy(media);
  }, [pod.PodAddress, media.MediaSymbol]);

  // get token list from backend
  useEffect(() => {
    getTypeToTokenListMap().then(resp => {
      if (resp?.success) setTokens(resp.data);
    });
  }, []);


  useEffect(() => {
    console.log(media, pod);
  }, []);

  const saveProgress = () => {
    axios.post(`${URL()}/musicDao/media/saveMedia`, {
      media: mediaCopy,
      podId: pod.Id
    }).then(response => {
      const resp = response.data;
      if (resp.success) {
        handleClose();
        handleRefresh();
      } else {

      }
    });
  };

  return (
    <>
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
        {/* <Box className={classes.cardOptions}>
          <Box className={classes.buttonsMediaTerms} pl={1.5} pr={2}>
            <Box className={classes.borderRoundBox} onClick={() => setTabmediaCopyTerms(0)}>
              <Box className={`${classes.mediaTermButton} ${classes.mediaTermButtonSelected}`}>1</Box>
            </Box>
            <Box className={classes.buttonsMediaTermsBorder} />
            <Box className={classes.borderRoundBox} onClick={() => setTabmediaCopyTerms(1)}>
              <Box
                className={`${classes.mediaTermButton} ${
                  tabmediaCopyTerms > 0 ? classes.mediaTermButtonSelected : ""
                }`}
              >
                2
              </Box>
            </Box>
            <Box className={classes.buttonsMediaTermsBorder} />
            <Box className={classes.borderRoundBox} onClick={() => setTabmediaCopyTerms(2)}>
              <Box
                className={`${classes.mediaTermButton} ${
                  tabmediaCopyTerms === 2 ? classes.mediaTermButtonSelected : ""
                }`}
              >
                3
              </Box>
            </Box>
          </Box>
          <Box className={classes.flexBox} justifyContent="space-between" mt={2}>
            <Box>General</Box>
            <Box>Payments</Box>
            <Box>Rewards</Box>
          </Box>
        </Box> */}
        <>
          {tabmediaCopyTerms === 0 ? (
            <>
              {/* <Box mt={2}>
                <Box className={classes.flexBox} justifyContent="space-between">
                  <Box className={classes.header1}>Song Images</Box>
                  <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                    <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
                  </Tooltip>
                </Box>
                <Box width={1} className={classes.uploadBox} mt={1}>
                  <FileUpload
                    photo={upload}
                    photoImg={uploadImg}
                    setterPhoto={setUpload}
                    setterPhotoImg={setUploadImg}
                    mainSetter={undefined}
                    mainElement={undefined}
                    type="image"
                    canEdit
                    isEditable
                  />
                </Box>
              </Box> */}
              <Box className={classes.title} textAlign="center" mt={2}>
                Edit Media
              </Box>
              <Box mt={2}>
                <Box className={classes.flexBox} justifyContent="space-between">
                  <Box className={classes.header1}>Song Name</Box>
                  <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                    <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
                  </Tooltip>
                </Box>
                <InputWithLabelAndTooltip
                  placeHolder="Song name here"
                  type="text"
                  disabled={true}
                  inputValue={mediaCopy.Title}
                  onInputValueChange={e => setMediaCopy({ ...mediaCopy, Title: e.target.value })}
                  style={{ background: "#F0F5F5" }}
                />
              </Box>
              <Box mt={1}>
                <Box className={classes.flexBox} justifyContent="space-between">
                  <Box className={classes.header1}>Description</Box>
                  <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                    <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
                  </Tooltip>
                </Box>
                <InputWithLabelAndTooltip
                  placeHolder="Write a description..."
                  type="textarea"
                  inputValue={mediaCopy.Description}
                  onInputValueChange={e => setMediaCopy({ ...mediaCopy, Description: e.target.value })}
                  style={{ background: "#F0F5F5" }}
                />
              </Box>
              <Box mt={1}>
                <Box className={classes.flexBox} justifyContent="space-between">
                  <Box className={classes.header1}>Genre</Box>
                  <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                    <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
                  </Tooltip>
                </Box>
                <InputWithLabelAndTooltip
                  placeHolder="Genre"
                  type="text"
                  inputValue={mediaCopy.Genre}
                  onInputValueChange={e => setMediaCopy({ ...mediaCopy, Genre: e.target.value })}
                  style={{ background: "#F0F5F5" }}
                />
              </Box>
              {/* <Box mt={1}>
                <Box className={classes.flexBox} justifyContent="space-between" mb={1}>
                  <Box className={classes.header1}>Song Main Image</Box>
                  <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                    <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
                  </Tooltip>
                </Box>
                <FileUpload
                  photo={upload1}
                  photoImg={uploadImg1}
                  setterPhoto={setUpload1}
                  setterPhotoImg={setUploadImg1}
                  mainSetter={undefined}
                  mainElement={undefined}
                  type="image"
                  canEdit
                />
              </Box>
              <Box className={classes.flexBox} mt={3}>
                <Box width={1} ml={1}>
                  <Box className={classes.header1}>Release Date</Box>
                  <Box width={1} className={classes.controlBox} mt={1}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardDatePicker
                        disableToolbar
                        variant="inline"
                        format="MM/dd/yyyy"
                        margin="dense"
                        id="date-picker-inline"
                        minDate={new Date()}
                        value={mediaCopy.ReleaseDate * 1000}
                        onChange={(date, _) => {
                          if (date) {
                            const newReleaseDate = new Date(mediaCopy.ReleaseDate * 1000);
                            newReleaseDate.setDate(date?.getDate());
                            newReleaseDate.setMonth(date?.getMonth());
                            newReleaseDate.setFullYear(date?.getFullYear());
                            setMediaCopy({
                              ...mediaCopy,
                              ReleaseDate: Math.floor(newReleaseDate.getTime() / 1000),
                            });
                          }
                        }}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        keyboardIcon={
                          <img className={classes.calendarImage} src={dateIcon} alt={"calendar"} />
                        }
                        size="small"
                        className={classes.datepicker}
                      />
                    </MuiPickersUtilsProvider>
                  </Box>
                </Box>
                <Box width={1} ml={1}>
                  <Box className={classes.header1}>Release Time</Box>
                  <Box width={1} className={classes.controlBox} mt={1}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                      <KeyboardTimePicker
                        margin="dense"
                        id="time-picker"
                        value={mediaCopy.ReleaseDate * 1000}
                        onChange={(elem: any) => {
                          const newReleaseDate = new Date(mediaCopy.ReleaseDate * 1000);
                          const date = new Date(elem);
                          newReleaseDate.setHours(date.getHours());
                          newReleaseDate.setMinutes(date.getMinutes());
                          setMediaCopy({
                            ...mediaCopy,
                            ReleaseDate: Math.floor(newReleaseDate.getTime() / 1000),
                          });
                        }}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                        size="small"
                        className={classes.datepicker}
                        keyboardIcon={
                          <img className={classes.calendarImage} src={timeIcon} alt={"calendar"} />
                        }
                      />
                    </MuiPickersUtilsProvider>
                  </Box>
                </Box>
              </Box> */}
            </>
          ) : tabmediaCopyTerms === 1 ? (
            <Box>
              <Box className={classes.header1} mt={2}>
                Charging
              </Box>
              <Box className={classes.flexBox} mt={1}>
                <Box
                  className={classes.radioBox}
                  onClick={() => {
                    let mediaCopyCopy = { ...mediaCopy };
                    mediaCopyCopy.PaymentType = "DYNAMIC";
                    mediaCopyCopy.PricePerSecond = 0;
                    mediaCopyCopy.Price = 0;
                    setMediaCopy(mediaCopyCopy);
                  }}
                >
                  <StyledCheckbox
                    buttonType="circle"
                    buttonColor={mediaCopy.PaymentType === "DYNAMIC" ? Color.Black : Color.GrayMedium}
                    checked={mediaCopy.PaymentType === "DYNAMIC"}
                  />
                  <Box mt={0.5}>Dynamic</Box>
                </Box>
                <Box
                  className={classes.radioBox}
                  ml={2}
                  onClick={() => {
                    let mediaCopyCopy = { ...mediaCopy };
                    mediaCopyCopy.PaymentType = "FIXED";
                    setMediaCopy(mediaCopyCopy);
                  }}
                >
                  <StyledCheckbox
                    buttonType="circle"
                    buttonColor={mediaCopy.PaymentType === "FIXED" ? Color.Black : Color.GrayMedium}
                    checked={mediaCopy.PaymentType === "FIXED"}
                  />
                  <Box mt={0.5}>Fixed</Box>
                </Box>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box mt={2}>
                    <Box className={classes.flexBox} justifyContent="space-between">
                      <Box className={classes.header1}>Token</Box>
                      <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                        <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
                      </Tooltip>
                    </Box>
                    {(tokens.CRYPTO ?? []).length > 0 && (
                      <Box className={classes.inputBox} mt={1}>
                        <TokenSelect
                          value={mediaCopy.FundingToken}
                          onChange={e => {
                            const selectedName: any = e.target.value;
                            let mediaCopyCopy = { ...mediaCopy };
                            mediaCopyCopy.FundingToken = selectedName;
                            setMediaCopy(mediaCopyCopy);
                          }}
                          tokens={tokens.CRYPTO ?? []}
                          style={{ background: "transparent", border: "none" }}
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RenderInputCreateModal
                    name={"Price per second"}
                    placeholder={"Enter Price..."}
                    type={"text"}
                    width={400}
                    item={"PricePerSecond"}
                    token={mediaCopy.FundingToken}
                    enableUSD={true}
                    mediaCopy={mediaCopy}
                    setMediaCopy={setMediaCopy}
                  />
                </Grid>
              </Grid>
              <Box>
                <Box className={classes.header1} mt={4}>
                  Exclusive Access
                </Box>
                <Box className={classes.flexBox} mt={1}>
                  <Box
                    className={classes.radioBox}
                    onClick={() => {
                      let mediaCopyCopy = { ...mediaCopy };
                      mediaCopyCopy.ExclusivePermissions = true;
                      setMediaCopy(mediaCopyCopy);
                    }}
                  >
                    <StyledCheckbox
                      buttonType="circle"
                      buttonColor={mediaCopy.ExclusivePermissions === true ? Color.Black : Color.GrayMedium}
                      checked={mediaCopy.ExclusivePermissions === true}
                    />
                    Yes
                  </Box>
                  <Box
                    className={classes.radioBox}
                    ml={2}
                    onClick={() => {
                      let mediaCopyCopy = { ...mediaCopy };
                      mediaCopyCopy.ExclusivePermissions = false;
                      setMediaCopy(mediaCopyCopy);
                    }}
                  >
                    <StyledCheckbox
                      buttonType="circle"
                      buttonColor={mediaCopy.ExclusivePermissions === false ? Color.Black : Color.GrayMedium}
                      checked={mediaCopy.ExclusivePermissions === false}
                    />
                    No
                  </Box>
                </Box>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box mt={2}>
                      <Box className={classes.flexBox} justifyContent="space-between">
                        <Box className={classes.header1}>Token</Box>
                        <Tooltip
                          TransitionComponent={Fade}
                          TransitionProps={{ timeout: 600 }}
                          arrow
                          title={""}
                        >
                          <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
                        </Tooltip>
                      </Box>
                      {(tokens.CRYPTO ?? []).length > 0 && (
                        <Box className={classes.inputBox} mt={1}>
                          <TokenSelect
                            value={mediaCopy.FundingToken}
                            onChange={e => {
                              const selectedName: any = e.target.value;
                              let mediaCopyCopy = { ...mediaCopy };
                              mediaCopyCopy.FundingToken = selectedName;
                              setMediaCopy(mediaCopyCopy);
                            }}
                            tokens={tokens.CRYPTO ?? []}
                            style={{ background: "transparent", border: "none" }}
                          />
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <RenderInputCreateModal
                      name={"Price"}
                      placeholder={"Enter Price..."}
                      type={"text"}
                      width={400}
                      item={"Price"}
                      token={mediaCopy.FundingToken}
                      enableUSD={true}
                      mediaCopy={mediaCopy}
                      setMediaCopy={setMediaCopy}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Box>
          ) : tabmediaCopyTerms === 2 ? (
            <Box>
              <Box className={classes.header1} mt={4}>
                Select Token Type
              </Box>
              <Box className={classes.flexBox} mb={2} flexWrap="wrap">
                {Object.entries(RewardTokenMap).map(([type, val], index) => {
                  return (
                    <Box
                      className={`${classes.tokenTypeButton} ${
                        type === rewardTokenType ? classes.tokenTypeButtonSelected : ""
                      }`}
                      onClick={() => {
                        setRewardTokenType(type);
                        setMediaCopy({
                          ...mediaCopy,
                          RewardToken: tokens[type].length ? tokens[type][0] : "",
                        });
                      }}
                      key={type}
                      mr={index < Object.keys(RewardTokenMap).length ? 2 : 0}
                      mt={2}
                    >
                      {`${val} ${
                        type.toUpperCase().includes("CRYPTO")
                          ? "💸"
                          : type.includes("NFT")
                          ? "🏆"
                          : type.includes("POD") || type.includes("BADGE")
                          ? "👘"
                          : "📸"
                      }`}
                    </Box>
                  );
                })}
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box mt={2}>
                    <Box className={classes.flexBox} justifyContent="space-between">
                      <Box className={classes.header1}>Token</Box>
                      <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                        <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
                      </Tooltip>
                    </Box>
                    {(tokens[rewardTokenType] ?? []).length > 0 && (
                      <Box className={classes.inputBox} mt={1}>
                        <TokenSelect
                          value={mediaCopy.RewardToken}
                          onChange={e => {
                            const selectedName: any = e.target.value;
                            let mediaCopyCopy = { ...mediaCopy };
                            mediaCopyCopy.RewardToken = selectedName;
                            setMediaCopy(mediaCopyCopy);
                          }}
                          tokens={tokens[rewardTokenType] ?? []}
                          style={{ background: "transparent", border: "none" }}
                        />
                      </Box>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <RenderInputCreateModal
                    name={"Price per second"}
                    placeholder={"Enter Price..."}
                    type={"text"}
                    width={400}
                    item={"RewardPrice"}
                    token={mediaCopy.RewardToken}
                    enableUSD={true}
                    mediaCopy={mediaCopy}
                    setMediaCopy={setMediaCopy}
                  />
                </Grid>
              </Grid>
            </Box>
          ) : null}
        </>
        <Box className={classes.footer} mt={3}>
          <Box className={classes.footerLeft}>
            {/* <SecondaryButton size="medium" onClick={saveProgress} isRounded>
              Save Progress
            </SecondaryButton> */}
          </Box>
          {tabmediaCopyTerms < 2 && (
            <Box className={classes.footerRight}>
              <PrimaryButton
                size="medium"
                onClick={() => {
                  // if (tabmediaCopyTerms === 0) {
                  //   setTabmediaCopyTerms(1);
                  // } else if (tabmediaCopyTerms === 1) {
                  //   setTabmediaCopyTerms(2);
                  // } else if (tabmediaCopyTerms === 2) {
                  //   setTabmediaCopyTerms(3);
                  // }
                  // handleOpenSignatureModal();
                  saveProgress()
                }}
                isRounded
              >
                Save{/* Next */}
              </PrimaryButton>
            </Box>
          )}
          {/*tabmediaCopyTerms == 2 && (
            <Box className={classes.footerRight}>
              <PrimaryButton size="medium"
                             onClick={() => handleOpenSignatureModal()} isRounded>
                Register Conditions
              </PrimaryButton>
            </Box>
          )*/}
        </Box>
      </Modal>
      {openSignRequestModal && (
        <SignatureRequestModal
          open={openSignRequestModal}
          address={userSelector.address}
          transactionFee="0.0000"
          detail={signRequestModalDetail}
          handleOk={() => {}}
          handleClose={() => setOpenSignRequestModal(false)}
        />
      )}
    </>
  );
};

export default mediaCopyTermsModal;

const RenderInputCreateModal = p => {
  const { convertTokenToUSD } = useTokenConversion();
  const classes = mediaTermsModalStyles();
  return (
    <Box mt={2}>
      <Box className={classes.flexBox} justifyContent="space-between">
        <Box className={classes.header1}>{p.name}</Box>
        <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
          <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
        </Tooltip>
      </Box>
      <Box className={classes.inputBox} mt={1}>
        <Box className={classes.flexBox} justifyContent="space-between" height="50px">
          <InputWithLabelAndTooltip
            style={{ background: "transparent", marginTop: 0, marginBottom: 0, border: "none" }}
            type={p.type}
            minValue={p.min}
            inputValue={p.mediaCopy[p.item]}
            onInputValueChange={elem => {
              const newMediaCopy = { ...p.mediaCopy };
              newMediaCopy[p.item] = elem.target.value;
              p.setMediaCopy(newMediaCopy);
            }}
            placeHolder={p.placeholder}
          />
          {p.enableUSD && (
            <Box style={{ whiteSpace: "nowrap" }} mx={2}>
              {formatNumber(convertTokenToUSD(p.token, p.mediaCopy[p.item]), "USD", 4)}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
