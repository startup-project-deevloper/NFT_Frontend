import React, { useEffect, useState } from "react";
import { Box } from "@material-ui/core";

import Avatar from "shared/ui-kit/Avatar";
import { copyRightFractionTabStyles } from "./index.styles";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { useTypedSelector } from "store/reducers/Reducer";
import { Color } from "shared/ui-kit";

const CopyRightFractionTab = (props: any) => {
  const { proposal, pod } = props;

  const classes = copyRightFractionTabStyles();
  const usersList = useTypedSelector(state => state.usersInfoList);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const [mediasPhotos, setMediasPhotos] = useState<any[]>([]);

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    if (ipfs) {
      getImages();
    }
  }, [pod, ipfs]);

  const getImages = async () => {
    let i: number = 0;
    let photos: any = {};
    for (let creator of pod.CreatorsData) {
      if (creator && creator.id) {
        let creatorFound = usersList.find(user => user.id === creator.id);

        if (creatorFound && creatorFound.infoImage && creatorFound.infoImage.newFileCID) {
          photos[creator.id + "-photo"] = creatorFound.ipfsImage;
        }
      }
    }
    setMediasPhotos(photos);
  };

  return (
    <div className={classes.generalNftMediaTab}>
      <Box className={classes.investorBox} display="flex" alignItems="center" justifyContent="space-between">
        <Box>Investors</Box>
        <Box>{proposal.CopyrightInvestorShare}%</Box>
      </Box>
      {pod.CreatorsData?.map((user, index) => (
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
                mediasPhotos && mediasPhotos[user.id + "-photo"]
                  ? mediasPhotos[user.id + "-photo"]
                  : getDefaultAvatar()
              }
              radius={25}
              bordered
              rounded
            />
            <Box display="flex" flexDirection="column" ml={2}>
              <Box display="flex" alignItems="center" mb={0.5}>
                <div className={classes.nameTypo}>{user.name}</div>
                {index === 0 && (
                  <Box className={classes.tabBox} ml={2.5}>
                    Proposer
                  </Box>
                )}
              </Box>
              <div className={classes.slugTypo}>{user.id}</div>
            </Box>
          </Box>
          <Box textAlign="end">
            <Box>
              {proposal.Votes && proposal.Votes[user.id] === true ? (
                <Box
                  display="flex"
                  alignItems="center"
                  style={{ color: Color.MusicDAOGreen, fontSize: 14, lineHeight: "15px" }}
                >
                  Accepted&nbsp;
                  <img src={require("assets/icons/accepted_green.png")} />
                </Box>
              ) : proposal.Votes && proposal.Votes[user.id] === false ? (
                <Box
                  display="flex"
                  alignItems="center"
                  style={{ color: Color.Red, fontSize: 14, lineHeight: "15px" }}
                >
                  Declined&nbsp;
                  <img src={require("assets/icons/declined_red.png")} />
                </Box>
              ) : (
                <></>
              )}
            </Box>
            <Box className={classes.percentageBox}>{`${
              proposal.Distribution ? proposal.Distribution[index] : "0"
            }%`}</Box>
          </Box>
        </Box>
      ))}
    </div>
  );
};

export default CopyRightFractionTab;
