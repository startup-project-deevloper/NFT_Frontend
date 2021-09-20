import React, { useEffect, useState } from "react";
import Grid from "@material-ui/core/Grid";

import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import { Fade, Tooltip } from "@material-ui/core";
// ----------------- For the Graphs in Template ---------------------

import createPlotlyComponent from "react-plotly.js/factory";
import Plotly from "plotly.js-basic-dist";
import { TokenSelect } from "shared/ui-kit/Select/TokenSelect";
import StyledCheckbox from "shared/ui-kit/Checkbox";

import { tokenomicsNFTMediaTabStyles } from "./TokenomicsNFTMediaTab.styles";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as CheckCircleRegular } from "assets/icons/check-circle-regular.svg";
import { ReactComponent as CheckCircleSolid } from "assets/icons/check-circle-solid.svg";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";
import FileUpload from "shared/ui-kit/Page-components/FileUpload";

const Plot = createPlotlyComponent(Plotly);

const infoIcon = require("assets/icons/info_music_dao.png");
const calendarIcon = require("assets/icons/calendar_icon.png");

// Main line

const lineInitState = {
  maxPoints: 100,
  data: {
    x: [],
    y: [],
    mode: "lines",
    name: "AMM",
    line: {
      dash: "solid",
      color: "black",
    },
  },
  data2: {
    x: [],
    y: [],
    mode: "lines",
    name: "Target Supply",
    line: {
      dash: "dash",
      color: "grey",
    },
  },
  data3: {
    x: [],
    y: [],
    mode: "lines",
    name: "Target Price",
    line: {
      dash: "dash",
      color: "grey",
    },
  },
  layout: {
    autosize: false,
    height: 240,
    width: 540,
    bordercolor: "FFFFFF",
    showlegend: true,
    plot_bgcolor: "#F7F8FA",
    datarevision: 0,
    xaxis: {
      linecolor: "#99A1B3",
      linewidth: 2,
      mirror: true,
      automargin: true,
      autorange: false,
      range: [0, 10],
      title: {
        text: "",
        font: {
          family: "Agrandir",
          size: 8,
          color: "#99A1B3",
        },
      },
    },
    yaxis: {
      linecolor: "#99A1B3",
      linewidth: 2,
      mirror: true,
      automargin: true,
      autorange: false,
      range: [0, 10],
      title: {
        text: "",
        font: {
          family: "Agrandir",
          size: 8,
          color: "#99A1B3",
        },
      },
    },
    margin: {
      l: 0,
      r: 0,
      b: 10,
      t: 10,
      pad: 0,
    },
  },
};
const typeAMMs = ["Quadratic", "Linear", "Exponential", "Sigmoid"];

// ---------------------------------------------------

const TokenomicsNFTMediaTab = (props: any) => {
  const classes = tokenomicsNFTMediaTabStyles();

  const [isCreator, setIsCreator] = useState<boolean>(false);
  /* ------------ member requirements ---------- */

  const [line, setLine] = useState<any>(lineInitState);

  const handleChangeTokenSelector = e => {
    props.setPod(prev => ({ ...prev, FundingToken: e.target.value }));
  };

  useEffect(() => {
    if (props.tokenObjList && props.tokenObjList.length > 0) {
      props.setPod(prev => ({
        ...prev,
        InvestmentToken: props.tokenObjList[0].token,
        FundingToken: props.tokenObjList[0].token,
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

  useEffect(() => {
    const amm = props.pod.AMM;
    const maxSupply = Number(props.pod.MaxSupply);
    const fundingPrice = Number(props.pod.FundingTokenPrice); // init price
    const maxPrice = Number(props.pod.MaxPrice);
    const newLine: any = { ...line };
    const xs: number[] = [];
    const ys: number[] = [];
    if (amm && fundingPrice != undefined && maxSupply && maxPrice && maxPrice >= fundingPrice) {
      switch (amm) {
        case "Linear":
          for (let i = 0; i < line.maxPoints; i++) {
            const x = (i * maxSupply) / line.maxPoints;
            const y = (maxPrice - fundingPrice) * (x / maxSupply) + fundingPrice;
            xs.push(x);
            ys.push(y);
          }
          break;
        case "Quadratic":
          for (let i = 0; i < line.maxPoints; i++) {
            const x = (i * maxSupply) / line.maxPoints;
            const y = (maxPrice - fundingPrice) * Math.pow(x / maxSupply, 2) + fundingPrice;
            xs.push(x);
            ys.push(y);
          }
          break;
      }
    }
    newLine.data.x = xs;
    newLine.data.y = ys;

    // set move view to the range given by maxPrice and maxSupply
    newLine.layout.yaxis.range = [0, maxPrice];
    newLine.layout.xaxis.range = [0, maxSupply];

    // set targetPrice and targetSupply lines
    const maxNum = Number.MAX_VALUE / 10;
    const minNum = -Number.MAX_VALUE / 10;
    let x2s: number[] = [];
    let y2s: number[] = [];
    let x3s: number[] = [];
    let y3s: number[] = [];
    if (maxSupply) {
      x2s = Array(line.maxPoints).fill(maxSupply);
      for (let i = 0; i < line.maxPoints; i++) {
        y2s.push(minNum + i * 2 * (maxNum / line.maxPoints));
      }
    }
    if (maxPrice) {
      y3s = Array(line.maxPoints).fill(maxPrice);
      for (let i = 0; i < line.maxPoints; i++) {
        x3s.push(minNum + i * 2 * (maxNum / line.maxPoints));
      }
    }
    newLine.data3.x = x3s;
    newLine.data3.y = y3s;
    newLine.data2.x = x2s;
    newLine.data2.y = y2s;
    // set axis labels
    if (props.pod.FundingToken) newLine.layout.yaxis.title.text = `Price (${props.pod.FundingToken})`;
    if (props.pod.TokenSymbol) newLine.layout.xaxis.title.text = `Supply (${props.pod.TokenSymbol})`;
    newLine.layout.datarevision += 1;
    setLine(newLine);
  }, [props.pod]);

  return (
    <div className={classes.tokenomicsTab}>
      {props.pod || !props.creation ? (
        <div>
          <Grid container spacing={2} direction="row" alignItems="flex-start" justify="flex-start">
            <Grid item xs={12} md={6}>
              <RenderInputCreateModal
                name={"Pod Token Name"}
                info={"Pod Token Name"}
                placeholder={"Add Name..."}
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
                name={"Token Symbol"}
                info={"Token Symbol"}
                placeholder={"Add Symbol"}
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
              <div style={{ display: "flex", alignItems: "flex-end" }}>
                <div style={{ width: "100%" }}>
                  <InputWithLabelAndTooltip
                    theme="music dao"
                    type="textarea"
                    inputValue={props.pod.TokenDescription}
                    onInputValueChange={e => {
                      if (!props.isCreator && !props.pod["TokenDescriptionValidation"]) {
                        let podCopy = { ...props.pod };
                        podCopy.TokenDescription = e.target.value;
                        props.setPod(podCopy);
                      }
                    }}
                    labelName="Description"
                    disabled={props.isCreator || props.pod["TokenDescriptionValidation"]}
                    placeHolder="Write a description..."
                    tooltip={`Describe us what it is about`}
                  />
                </div>
                {!props.creation ? (
                  <ValidatedField
                    field={props.pod.TokenDescriptionValidation}
                    isCreator={isCreator}
                    isFlex={true}
                    marginApplied={true}
                    validateFieldTrue={() => {
                      if (isCreator) {
                        let podCopy = { ...props.pod };
                        podCopy.TokenDescriptionValidation = true;
                        props.setPod(podCopy);
                      }
                    }}
                    validateFieldFalse={() => {
                      if (isCreator) {
                        let podCopy = { ...props.pod };
                        podCopy.TokenDescriptionValidation = false;
                        props.setPod(podCopy);
                      }
                    }}
                  />
                ) : null}
              </div>
            </Grid>
            <Grid item xs={12}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
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
              <Box mt={2}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <div className={classes.infoHeaderCreatePod}>Funding Target Supply</div>
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
                <TokenSelect
                  value={props.pod.FundingToken}
                  onChange={handleChangeTokenSelector}
                  tokens={props.tokenObjList}
                  style={{ height: "45px", backgroundColor: "rgba(218, 230, 229, 0.4)" }}
                />
              </Box>
            </Grid>
          </Grid>
          <Box className={classes.flexRowInputs} width={1}>
            <RenderInputCreateModal
              name="Trading Spread (%)"
              info="Trading Spread (%)"
              placeholder="Suggested: 1%"
              width={-1}
              type="number"
              item="Spread"
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
                  name="Maximum Supply"
                  info="Maximum Supply"
                  placeholder="Suggested 1"
                  width={-1}
                  type="number"
                  item="MaxSupply"
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
                  name="Funding Price"
                  info="Funding Price"
                  placeholder="Suggested: 1"
                  width={-1}
                  type="number"
                  item="FundingTokenPrice"
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
                  name="Maximum Price"
                  info="Maximum Price"
                  placeholder="Suggested: 10"
                  width={-1}
                  type="number"
                  item="MaxPrice"
                  pod={props.pod}
                  setPod={props.setPod}
                  creation={props.creation}
                  isCreator={isCreator}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 16,
                }}
              >
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
              </div>
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
            </Grid>
          </Grid>
        </div>
      ) : null}

      <Grid item xs={12} md={12} style={{ margin: "24px 0" }}>
        <div className={classes.flexRowInputs}>
          <div className={classes.infoHeaderCreatePod}>AMM Type</div>
          <Tooltip
            TransitionComponent={Fade}
            TransitionProps={{ timeout: 600 }}
            arrow
            className={classes.tooltipHeaderInfo}
            title={"Please select your AMM Type... "}
          >
            <img src={infoIcon} alt={"info"} />
          </Tooltip>
        </div>
        <div
          className={classes.optionButtons}
          style={{
            marginTop: "10px",
            height: "auto",
            display: "flex",
          }}
        >
          {typeAMMs.map((typeAmm, i) => {
            return (
              <div
                key={i}
                style={{
                  marginRight: "10px",
                  color: props.pod.AMM === typeAmm ? "black" : "#949BAB",
                }}
                onClick={() => {
                  const newPod = { ...props.pod };
                  newPod.AMM = typeAmm;
                  props.setPod(newPod);
                }}
              >
                <StyledCheckbox buttonType="circle" checked={props.pod.AMM === typeAmm} />
                {typeAmm}
              </div>
            );
          })}
        </div>
      </Grid>

      <div className={classes.plotSection}>
        <Plot data={[line.data, line.data2, line.data3]} layout={line.layout} graphDiv="graph" />
      </div>
    </div>
  );
};

export default TokenomicsNFTMediaTab;

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
