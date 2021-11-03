import * as React from "react";

import { Fade, Tooltip } from "@material-ui/core";

import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";
import Box from "shared/ui-kit/Box";
import { copyRightFractionTabStyles } from "./index.styles";
import Avatar from "shared/ui-kit/Avatar";
import { getDefaultAvatar, getRandomAvatar } from "shared/services/user/getUserAvatar";
import useIPFS from "../../../../../../shared/utils-IPFS/useIPFS";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../../store/reducers/Reducer";

const infoIcon = require("assets/icons/info_music_dao.png");

const CopyRightFractionTab = (props: any) => {
  const classes = copyRightFractionTabStyles();
  const usersList = useSelector((state: RootState) => state.usersInfoList);

  const { ipfs, setMultiAddr } = useIPFS();

  const [mediasPhotos, setMediasPhotos] = useState<any[]>([]);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    if (ipfs && props.pod) {
      getImages();
    }
  }, [props.pod]);

  const getImages = async () => {
    let i: number = 0;
    let photos: any = {};
    for (let creator of props.pod.CreatorsData) {
      if (creator && creator.id) {
        let creatorFound = usersList.find(user => user.id === creator.id);
        
        if (creatorFound && creatorFound.ipfsImage) {
          photos[creator.id + "-photo"] = creatorFound.ipfsImage;
        }
      }
    }
    setMediasPhotos(photos);
  };

  const maxInvestorsShare = React.useMemo(() => {
    if (!props.pod || !props.pod.CreatorsData) return 100;
    const creatorsSum = props.pod.CreatorsData.map((e: any) => Number(e.sharingPercent ?? 0)).reduce(
      (a: number, b: number) => a + b,
      0
    );
    return 100 - creatorsSum;
  }, [props.pod]);

  const getMaxCreatorShare = React.useCallback(
    (ownIndex: number) => {
      if (!props.pod || !props.pod.CreatorsData) return 100;
      const creatorsSum = props.pod.CreatorsData.filter((e: any, index: number) => index !== ownIndex)
        .map((e: any) => Number(e.sharingPercent ?? 0))
        .reduce((a: number, b: number) => a + b, 0);
      return 100 - creatorsSum - Number(props.pod.CopyrightInvestorShare ?? 0);
    },
    [props.pod]
  );

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
          placeHolder="Write supply value for Copyright Fractions"
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
        {props.pod.CreatorsData?.map((creator, index) => {
          return (
            <Box
              key={`distrib-${index}`}
              className={classes.distribBox}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box display="flex">
                <Avatar
                  size={34}
                  image={
                    mediasPhotos && mediasPhotos[creator.id + "-photo"]
                      ? mediasPhotos[creator.id + "-photo"]
                      : getDefaultAvatar()
                  }
                  radius={25}
                  bordered
                  rounded
                />
                <Box display="flex" flexDirection="column" ml={2}>
                  <div className={classes.nameTypo}>{creator.name}</div>
                  <div className={classes.slugTypo}>{`@${creator.id}`}</div>
                </Box>
              </Box>
              <InputWithLabelAndTooltip
                type="number"
                minValue={0}
                maxValue={getMaxCreatorShare(index)}
                overriedClasses={classes.percentageBox}
                onInputValueChange={e => {
                  if (Number(e.target.value) > getMaxCreatorShare(index) || Number(e.target.value) < 0) {
                    return;
                  }
                  let podCopy = { ...props.pod };
                  podCopy.CreatorsData[index] = {
                    ...podCopy.CreatorsData[index],
                    sharingPercent: Number(e.target.value),
                  };
                  props.setPod(podCopy);
                }}
                inputValue={creator.sharingPercent || 0}
              />
            </Box>
          );
        })}
        <Box className={classes.distribBox} display="flex" alignItems="center" justifyContent="space-between">
          <Box className={classes.nameTypo} flex={1}>
            Investors
          </Box>
          <InputWithLabelAndTooltip
            type="number"
            maxValue={maxInvestorsShare}
            minValue={0}
            overriedClasses={classes.percentageBox}
            onInputValueChange={e => {
              if (Number(e.target.value) < 0) return;
              if (Number(e.target.value) > maxInvestorsShare) return;
              props.setPod({
                ...props.pod,
                CopyrightInvestorShare: Number(e.target.value),
              });
            }}
            inputValue={props.pod.CopyrightInvestorShare || 0}
          />
        </Box>
      </Box>
    </div>
  );
};

export default CopyRightFractionTab;
