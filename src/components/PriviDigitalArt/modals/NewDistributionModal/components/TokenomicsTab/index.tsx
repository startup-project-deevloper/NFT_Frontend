import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";

import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Fade, Tooltip } from "@material-ui/core";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";

import { tokenomicsTabStyles } from "./index.styles";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CheckCircleRegular } from "assets/icons/check-circle-regular.svg";
import { ReactComponent as CheckCircleSolid } from "assets/icons/check-circle-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";
import FileUpload from "shared/ui-kit/Page-components/FileUpload";
import useIPFS from "../../../../../../shared/utils-IPFS/useIPFS";

const infoIcon = require("assets/icons/info_music_dao.png");
const calendarIcon = require("assets/icons/calendar_icon.png");

const TokenomicsTab = (props: any) => {
  const classes = tokenomicsTabStyles();

  const [isCreator, setIsCreator] = useState<boolean>(false);

  const { setMultiAddr } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  const handleChangeTokenSelector = e => {
    console.log(`default value`, e.target.value);
    props.setPod(prev => ({ ...prev, FundingToken: e.target.value }));
  };

  useEffect(() => {
    if (props.tokenObjList && props.tokenObjList.length > 0) {
      props.setPod(prev => ({
        ...prev,
        InvestmentToken: "USDT",
        FundingToken: "USDT",
      }));
    }
  }, [props.tokenObjList]);

  useEffect(() => {
    if (props.isCreator !== undefined) {
      setIsCreator(props.isCreator);
    }
  }, [props.isCreator]);

  const ValidatedField = (propsFunction: any) => {
    return (
      <div
        style={
          propsFunction.isFlex && !propsFunction.marginApplied
            ? {
                marginLeft: "5px",
                display: "flex",
                alignItems: "center",
                width: "30px",
              }
            : propsFunction.isFlex && propsFunction.marginApplied
            ? {
                marginLeft: "5px",
                display: "flex",
                alignItems: "center",
                width: "30px",
                marginBottom: "8px",
              }
            : { marginBottom: "25px", marginLeft: "5px" }
        }
      >
        {propsFunction.field ? (
          <div
            style={
              propsFunction.isCreator
                ? { color: "#64c89e", fontSize: "30px", cursor: "pointer" }
                : { color: "#64c89e", fontSize: "30px" }
            }
            onClick={() => {
              if (propsFunction.isCreator) {
                // setField(false);
                propsFunction.validateFieldFalse();
              }
            }}
          >
            <SvgIcon>
              <CheckCircleSolid />
            </SvgIcon>
          </div>
        ) : (
          <div
            style={
              propsFunction.isCreator
                ? {
                    color: "rgb(101, 110, 126)",
                    fontSize: "30px",
                    cursor: "pointer",
                  }
                : { color: "rgb(101, 110, 126)", fontSize: "30px" }
            }
            onClick={() => {
              if (propsFunction.isCreator) {
                // setField(true);
                propsFunction.validateFieldTrue();
              }
            }}
          >
            <SvgIcon>
              <CheckCircleRegular />
            </SvgIcon>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={classes.tokenomicsTab}>
      {props.pod || !props.creation ? (
        <div>
          <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
            <Grid item xs={12} md={6}>
              <RenderInputCreateModal
                name={"Pod Token Name"}
                info={"Pod Token Name"}
                placeholder={"Hastags divided by comma"}
                type={"text"}
                width={-1}
                item={"TokenName"}
                pod={props.pod}
                setPod={props.setPod}
                creation={props.creation}
                isCreator={isCreator}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RenderInputCreateModal
                name={"Pod Token Symbol"}
                info={"Pod Token Symbol"}
                placeholder={"Your name here"}
                type={"text"}
                width={-1}
                item={"TokenSymbol"}
                pod={props.pod}
                setPod={props.setPod}
                creation={props.creation}
                isCreator={isCreator}
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
            <Grid item xs={12}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                  marginTop: 16,
                }}
              >
                <div className={classes.infoHeaderCreatePod}>Pod Token Image</div>
                <Tooltip
                  TransitionComponent={Fade}
                  TransitionProps={{ timeout: 600 }}
                  arrow
                  className={classes.tooltipHeaderInfo}
                  title={``}
                >
                  <img src={infoIcon} alt={"info"} />
                </Tooltip>
              </div>
              <FileUpload
                photo={props.tokenPhoto}
                photoImg={props.tokenPhotoImg}
                setterPhoto={props.setTokenPhoto}
                setterPhotoImg={props.setTokenPhotoImg}
                mainSetter={undefined}
                mainElement={undefined}
                type="image"
                canEdit
                theme="music dao"
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
            <Grid item xs={12} md={8}>
              <Box className={classes.flexRowInputs} width={1}>
                <RenderInputCreateModal
                  name="Funding Target Supply"
                  info="Funding Target Supply"
                  placeholder="Suggested: 10000"
                  width={-1}
                  type="number"
                  item="FundingTarget"
                  pod={props.pod}
                  setPod={props.setPod}
                  creation={props.creation}
                  isCreator={isCreator}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box mt={"28px"}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={"11px"}>
                  <div className={classes.infoHeaderCreatePod}>{""}</div>
                  <Tooltip
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                    arrow
                    className={classes.tooltipHeaderInfo}
                    title={``}
                  >
                    <img src={infoIcon} alt={"info"} />
                  </Tooltip>
                </Box>
                <TokenSelect
                  value={props.pod.FundingToken || "USDT"}
                  onChange={handleChangeTokenSelector}
                  tokens={props.tokenObjList}
                  style={{ height: "45px", backgroundColor: "rgba(218, 230, 229, 0.4)" }}
                />
              </Box>
            </Grid>
          </Grid>
          <Box className={classes.flexRowInputs}>
            <RenderInputCreateModal
              name="Funding Price"
              info="Funding Price"
              placeholder="Suggested: 1"
              width={-1}
              type="number"
              item="FundingPrice"
              pod={props.pod}
              setPod={props.setPod}
              creation={props.creation}
              isCreator={isCreator}
            />
          </Box>
          <Box className={classes.flexRowInputs} width={1}>
            <RenderInputCreateModal
              name="Royalty Share"
              info="Royalty Share"
              placeholder="Suggested: 1%"
              width={-1}
              type="number"
              max={100}
              item="Royalty"
              pod={props.pod}
              setPod={props.setPod}
              creation={props.creation}
              isCreator={isCreator}
            />
          </Box>
          <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
            <Grid item xs={12} md={6}>
              <Box className={classes.flexRowInputs}>
                <RenderInputCreateModal
                  name="Investor Share"
                  info="Investor Share"
                  placeholder="Share of revenue for investors"
                  width={-1}
                  type="number"
                  max={100}
                  item="InvestorShare"
                  pod={props.pod}
                  setPod={props.setPod}
                  creation={props.creation}
                  isCreator={isCreator}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className={classes.flexRowInputs}>
                <RenderInputCreateModal
                  name="Sharing Percentage"
                  info="Sharing Percentage"
                  placeholder="Share for sharing your content"
                  width={-1}
                  type="number"
                  min={0}
                  max={100}
                  item="SharingPercentage"
                  pod={props.pod}
                  setPod={props.setPod}
                  creation={props.creation}
                  isCreator={isCreator}
                />
              </Box>
            </Grid>
          </Grid>
          <Box className={classes.flexRowInputs} flexDirection="column">
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <div className={classes.infoHeaderCreatePod}>Funding Date</div>
              <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                arrow
                className={classes.tooltipHeaderInfo}
                title={``}
              >
                <img src={infoIcon} alt={"info"} />
              </Tooltip>
            </Box>
            <div
              className={classes.textFieldCreatePod}
              style={{
                display: "flex",
                alignItems: "center",
                height: "45px",
              }}
            >
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  id="date-picker-funding-date"
                  minDate={new Date().setDate(new Date().getDate() + 1)}
                  format="MM.dd.yyyy"
                  placeholder="Select date..."
                  value={
                    props.pod.FundingDate
                      ? new Date(props.pod.FundingDate * 1000)
                      : new Date().setDate(new Date().getDate() + 1)
                  }
                  onChange={(e: any) =>
                    props.setPod(prev => ({
                      ...prev,
                      FundingDate: Math.floor(new Date(e).getTime() / 1000),
                    }))
                  }
                  keyboardIcon={<img src={calendarIcon} alt={"calendar"} />}
                  className={classes.datePicker}
                />
              </MuiPickersUtilsProvider>
            </div>
          </Box>
        </div>
      ) : null}
    </div>
  );
};

export default TokenomicsTab;

//input component
const RenderInputCreateModal = props => {
  return (
    <div
      style={
        props.width === -1
          ? {
              width: "100%",
            }
          : {}
      }
    >
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <div style={{ width: "100%" }}>
          <InputWithLabelAndTooltip
            theme={"music dao"}
            labelName={props.name}
            tooltip={props.info}
            style={
              props.width === -1
                ? { width: "100%" }
                : props.isCreator
                ? { width: "calc(" + props.width + "px - 24px - 35px)" }
                : { width: "calc(" + props.width + "px - 24px)" }
            }
            type={props.type}
            minValue={props.min}
            maxValue={props.max}
            inputValue={props.value ? props.value : props.pod[props.item]}
            onInputValueChange={elem => {
              if (!props.isCreator && !props.pod[props.item + "Validation"]) {
                let podCopy = { ...props.pod };
                podCopy[props.item] = elem.target.value;
                props.setPod(podCopy);
              }
            }}
            placeHolder={props.placeholder}
            disabled={props.isCreator || props.pod[props.item + "Validation"]}
          />
        </div>
        {!props.creation ? (
          <ValidatedField
            field={props.pod[props.item + "Validation"]}
            isCreator={props.isCreator}
            isFlex={true}
            validateFieldTrue={() => {
              if (props.isCreator) {
                let podCopy = { ...props.pod };
                podCopy[props.item + "Validation"] = true;
                props.setPod(podCopy);
              }
            }}
            validateFieldFalse={() => {
              if (props.isCreator) {
                let podCopy = { ...props.pod };
                podCopy[props.item + "Validation"] = false;
                props.setPod(podCopy);
              }
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

const ValidatedField = (propsFunction: any) => {
  return (
    <div
      style={
        propsFunction.isFlex && !propsFunction.marginApplied
          ? {
              marginLeft: "5px",
              display: "flex",
              alignItems: "center",
              width: "30px",
            }
          : propsFunction.isFlex && propsFunction.marginApplied
          ? {
              marginLeft: "5px",
              display: "flex",
              alignItems: "center",
              width: "30px",
              marginBottom: "8px",
            }
          : { marginBottom: "25px", marginLeft: "5px" }
      }
    >
      {propsFunction.field ? (
        <div
          style={
            propsFunction.isCreator
              ? { color: "#64c89e", fontSize: "30px", cursor: "pointer" }
              : { color: "#64c89e", fontSize: "30px" }
          }
          onClick={() => {
            if (propsFunction.isCreator) {
              // setField(false);
              propsFunction.validateFieldFalse();
            }
          }}
        >
          <SvgIcon>
            <CheckCircleSolid />
          </SvgIcon>
        </div>
      ) : (
        <div
          style={
            propsFunction.isCreator
              ? {
                  color: "rgb(101, 110, 126)",
                  fontSize: "30px",
                  cursor: "pointer",
                }
              : { color: "rgb(101, 110, 126)", fontSize: "30px" }
          }
          onClick={() => {
            if (propsFunction.isCreator) {
              // setField(true);
              propsFunction.validateFieldTrue();
            }
          }}
        >
          <SvgIcon>
            <CheckCircleRegular />
          </SvgIcon>
        </div>
      )}
    </div>
  );
};
