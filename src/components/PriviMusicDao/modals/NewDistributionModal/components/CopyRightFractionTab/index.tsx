import React from "react";

import { Fade, Tooltip } from "@material-ui/core";

import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";
import { copyRightFractionTabStyles } from "./index.styles";
import Avatar from "shared/ui-kit/Avatar";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";

const infoIcon = require("assets/icons/info_music_dao.png");

const CopyRightFractionTab = (props: any) => {
  const classes = copyRightFractionTabStyles();

  return (
    <div className={classes.generalNftMediaTab}>
      <Box>
        <InputWithLabelAndTooltip
          theme="music dao"
          type="text"
          inputValue={props.pod.CopyRightSupply}
          onInputValueChange={e => {
            let podCopy = { ...props.pod };
            podCopy.Name = e.target.value;
            props.setPod(podCopy);
            props.setPod({ ...props.pod, CopyRightSupply: e.target.value });
          }}
          labelName="Total Supply of Copyright Fractions"
          placeHolder="Hastags divided by comma"
          tooltip={`Total Supply of Copyright Fractions`}
        />
      </Box>
      <Box mt={3.5}>
        <InputWithLabelAndTooltip
          theme="music dao"
          type="text"
          inputValue={props.pod.CopyRightSymbol}
          onInputValueChange={e => {
            let podCopy = { ...props.pod };
            podCopy.Name = e.target.value;
            props.setPod(podCopy);
            props.setPod({ ...props.pod, CopyRightSymbol: e.target.value });
          }}
          labelName="Copyright Symbol"
          placeHolder="Write down your symbol"
          tooltip={`Copyright Symbol`}
        />
      </Box>
      <Box mt={3.5}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
          <div className={classes.infoHeaderCreatePod}>Distribution</div>
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
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5} px={8}>
          <Box fontSize={14} color="#2D3047">
            Artist
          </Box>
          <Box fontSize={14} color="#2D3047">
            Share(%)
          </Box>
        </Box>
        {props.pod.CreatorsData?.map((creator, index) => (
          <Box
            key={`distrib-${index}`}
            className={classes.distribBox}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex">
              <Avatar size={34} image={creator.imageUrl ?? getRandomAvatar()} radius={25} bordered rounded />
              <Box display="flex" flexDirection="column" ml={2}>
                <div className={classes.nameTypo}>{creator.name}</div>
                <div className={classes.slugTypo}>{`@${creator.id}`}</div>
              </Box>
            </Box>
            <InputWithLabelAndTooltip
              type="text"
              overriedClasses={classes.percentageBox}
              onInputValueChange={e => {
                let podCopy = { ...props.pod };
                podCopy.CreatorsData[index] = {
                  ...podCopy.CreatorsData[index],
                  sharingPercent: e.target.value,
                };
                props.setPod(podCopy);
              }}
              inputValue={creator.sharingPercent ?? 0}
            />
          </Box>
        ))}
        <Box className={classes.distribBox} display="flex" alignItems="center" justifyContent="space-between">
          <Box className={classes.nameTypo} flex={1}>
            Investors
          </Box>
          <Box className={classes.percentageBox}>{props.pod.InvestorShare ?? 0}</Box>
        </Box>
      </Box>
    </div>
  );
};

export default CopyRightFractionTab;
