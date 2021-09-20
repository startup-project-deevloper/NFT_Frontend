import React, { useState, useEffect, useRef } from "react";
import DateFnsUtils from "@date-io/date-fns";
import { useSelector } from "react-redux";
import { Fade, Tooltip } from "@material-ui/core";
import { KeyboardDatePicker, KeyboardTimePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import { RootState } from "store/reducers/Reducer";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import { Color, Modal, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import { mediaTermsModalStyles } from "./index.styles";
import Box from "shared/ui-kit/Box";
import { InfoIcon } from "shared/ui-kit/Icons";
import FileUpload from "shared/ui-kit/Page-components/FileUpload";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import { registerMedia, IRegisterMedia, getTypeToTokenListMap } from "shared/services/API";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import { /* buildJsxFromObject, */ formatNumber } from "shared/functions/commonFunctions";
// import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { LoadingScreen } from "shared/ui-kit/Hocs/LoadingScreen";

const dateIcon = require("assets/icons/date.svg");
const timeIcon = require("assets/icons/time.svg");

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
    Price: "",
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
  const [loading, setLoading] = useState<boolean>(false);

  // rewards tab
  const [tokens, setTokens] = useState<any>({});
  const [rewardTokenType, setRewardTokenType] = useState<string>(Object.keys(RewardTokenMap)[0]);

  const payloadRef = useRef<any>();
  // const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  // const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  // set pod address and media symbol
  useEffect(() => {
    setMediaCopy({
      ...mediaCopy,
      PodAddress: pod.PodAddress,
      MediaName: media.MediaName,
      MediaSymbol: media.MediaSymbol,
      Type: media.Type,
      Collabs: media.Collabs,
    });
  }, [pod.PodAddress, media.MediaSymbol]);

  // get token list from backend
  useEffect(() => {
    getTypeToTokenListMap().then(resp => {
      if (resp?.success) setTokens(resp.data);
    });
  }, []);

  const saveProgress = () => {};

  const handleRegister= () => {
    const payload: IRegisterMedia = {
      Requester: userSelector.address,
      PodAddress: mediaCopy.PodAddress,
      MediaSymbol: mediaCopy.MediaSymbol,
      Type: mediaCopy.Type,
      PaymentType: mediaCopy.PaymentType,
      Copies: mediaCopy.Copies,
      Royalty: mediaCopy.Royalty,
      FundingToken: mediaCopy.FundingToken,
      ReleaseDate: mediaCopy.ReleaseDate,
      PricePerSecond: mediaCopy.PricePerSecond,
      Price: Number(mediaCopy.Price),
      IsRecord: mediaCopy.IsRecord,
      RecordToken: mediaCopy.RecordToken,
      RecordPaymentType: mediaCopy.RecordPaymentType,
      RecordPrice: mediaCopy.RecordPrice,
      RecordPricePerSecond: mediaCopy.RecordPricePerSecond,
      RecordCopies: mediaCopy.RecordCopies,
      RecordRoyalty: mediaCopy.RecordRoyalty,
    };
    const additionalData = {
      Title: mediaCopy.Title,
      Description: mediaCopy.Description,
      // RewardToken: mediaCopy.RewardToken,
      // RewardPrice: mediaCopy.RewardPrice,
    };
    setLoading(true);
    registerMedia(userSelector.address, payload, additionalData)
      .then(resp => {
        if (resp?.success) {
          showAlertMessage("Terms registered successfully", { variant: "success" });
          setTimeout(() => {
            handleRefresh();
            handleClose();
          }, 1000);
        } else {
          showAlertMessage("Terms registeration failed", { variant: "error" });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <LoadingScreen
      loading={loading}
      title={`Transaction \nin progress`}
      subTitle={`Transaction is proceeding on Privi Chain.\nThis can take a moment, please be patient...`}
      handleClose={() => {}}
    >
      <Modal size="medium" isOpen={open} onClose={handleClose} showCloseIcon>
        <>
          <Box mt={2}>
            <Box className={classes.flexBox} justifyContent="space-between">
              <Box className={classes.header1}>NFT Image</Box>
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
          </Box>
          <Box mt={3}>
            <Box className={classes.flexBox} justifyContent="space-between">
              <Box className={classes.header1}>NFT Name</Box>
              <Tooltip TransitionComponent={Fade} TransitionProps={{ timeout: 600 }} arrow title={""}>
                <InfoIcon style={{ color: "#2D3047", width: "14px" }} />
              </Tooltip>
            </Box>
            <InputWithLabelAndTooltip
              placeHolder="Your name here"
              type="text"
              inputValue={mediaCopy.MediaName}
              onInputValueChange={e => setMediaCopy({ ...mediaCopy, MediaName: e.target.value })}
              disabled={true}
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
          <Box className={classes.flexBox}>
            <Box width={1} mr={1}>
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
          </Box>
          <Box className={classes.header1} mt={2}>
            NFT Price
          </Box>
          <Box className={classes.flexBox} mt={1}>
            <Box
              className={classes.radioBox}
              onClick={() => {
                let mediaCopyCopy = { ...mediaCopy };
                mediaCopyCopy.PaymentType = "DYNAMIC";
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
                      style={{ background: "transparent", border: "1px solid #E0E4F3" }}
                    />
                  </Box>
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <RenderInputCreateModal
                name={"Price"}
                placeholder={"0"}
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
        </>
        <Box className={classes.footer} mt={3}>
          <Box className={classes.footerLeft}>
            <SecondaryButton size="medium" onClick={saveProgress} isRounded>
              Save Progress
            </SecondaryButton>
          </Box>
          <Box className={classes.footerRight}>
            <PrimaryButton size="medium" onClick={handleRegister} isRounded>
              Register Conditions
            </PrimaryButton>
          </Box>
        </Box>
      </Modal>
    </LoadingScreen>
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
      <Box className={classes.inputBox} mt={1} border="1px solid #E0E4F3">
        <Box className={classes.flexBox} justifyContent="space-between" height="48px">
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
