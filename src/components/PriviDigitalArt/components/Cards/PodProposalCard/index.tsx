import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useMediaQuery, useTheme } from "@material-ui/core";

import { setSelectedUser } from "store/actions/SelectedUser";
import Box from "shared/ui-kit/Box";
import { useTypedSelector } from "store/reducers/Reducer";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { Color, Gradient, PrimaryButton } from "shared/ui-kit";
import Avatar from "shared/ui-kit/Avatar";
import { getUsersInfoList } from "store/selectors";
import { getDefaultAvatar, getDefaultBGImage } from "shared/services/user/getUserAvatar";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "shared/ipfs/get";
import getPhotoIPFS from "shared/functions/getPhotoIPFS";
import { PodProposalCardStyles } from "./index.styles";
import SkeletonBox from "shared/ui-kit/SkeletonBox";

export default function PodProposalCard({ pod }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = PodProposalCardStyles();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const isTablet = useMediaQuery(theme.breakpoints.down("sm"));

  const users = useTypedSelector(getUsersInfoList);

  const { isIPFSAvailable, setMultiAddr, downloadWithNonDecryption } = useIPFS();
  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const [imageCreatorIPFS, setImageCreatorIPFS] = useState<any>(null);

  const [podData, setPodData] = useState<any>(pod);
  const [proposalEndTime, setProposalEndTime] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    if (pod && isIPFSAvailable) {
      getImageIPFS(pod.InfoImage?.newFileCID);
      getImageCreatorIPFS(pod.CreatorId);
      setPodData(pod);
    }
  }, [pod, isIPFSAvailable]);

  const getImageCreatorIPFS = async (userId: string) => {
    let creatorFound = users.find(user => user.id === userId);

    if (creatorFound && creatorFound.infoImage && creatorFound.infoImage.newFileCID) {
      let imageUrl = await getPhotoIPFS(creatorFound.infoImage.newFileCID, downloadWithNonDecryption);
      setImageCreatorIPFS(imageUrl);
    } else {
      setImageCreatorIPFS(getDefaultAvatar());
    }
  };

  useEffect(() => {
    if (!podData.distributionProposalAccepted) {
      const timerId = setInterval(() => {
        let delta;
        const now = new Date();
        if (podData?.ProposalDeadline) {
          delta = Math.floor(podData.ProposalDeadline._seconds - now.getTime() / 1000);
        } else {
          const created = new Date(podData.Created * 1000);
          created.setDate(created.getDate() + 7);
          delta = Math.floor((created.getTime() - now.getTime()) / 1000);
        }
        if (delta < 0) {
          setProposalEndTime({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          });
          clearInterval(timerId);
        } else {
          let days = Math.floor(delta / 86400);
          delta -= days * 86400;

          // calculate (and subtract) whole hours
          let hours = Math.floor(delta / 3600) % 24;
          delta -= hours * 3600;

          // calculate (and subtract) whole minutes
          let minutes = Math.floor(delta / 60) % 60;
          delta -= minutes * 60;

          // what's left is seconds
          let seconds = delta % 60;
          setProposalEndTime({
            days,
            hours,
            minutes,
            seconds,
          });
        }
      }, 1000);

      return () => clearInterval(timerId);
    }
  }, [podData?.ProposalDeadline]);

  const getImageIPFS = async (cid: string) => {
    let files = await onGetNonDecrypt(cid, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      setImageIPFS("data:image/png;base64," + base64String);
    } else {
      setImageIPFS(getDefaultBGImage());
    }
  };

  return (
    <Box className={styles.podCard}>
      <Box className={styles.podImageContent}>
        <SkeletonBox
          className={styles.podImage}
          image={imageIPFS}
          loading={!imageIPFS}
          width={1}
          height={1}
          style={{
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
            width: isMobile ? "138px" : "100%",
            height: isMobile ? "138px" : "100%"
          }}
        />
        {isMobile && (
        <div style={{ width: "100%", display: "flex", justifyContent: "flex-end", paddingTop: "10px" }}>
          <PrimaryButton
            size="medium"
            style={{ background: Color.Purple, width:"100%", height:36, fontSize: isMobile ? "14px" : "16px", fontWeight: 600 }}
            isRounded
            onClick={() => history.push(`/pods/${podData.Id}`)}
          >
            OPEN POD
          </PrimaryButton>
        </div>
      )}
      </Box>
      <Box width={1} ml={isMobile ? 1 : 2}>
        <Box display="flex">
          <Box style={{ background: Color.Purple, borderRadius: 8, padding: "3px 34px", height: '22px' }}>
            <Box className={styles.header1} color="white">
              POD Proposal
            </Box>
          </Box>
        </Box>
        <Box className={styles.header2} mt={2}>
          {podData.Name}
        </Box>
        {podData.Creator && (
          <Box display="flex" alignItems="center" mt={2}>
            <SkeletonBox
              className={styles.avatar}
              loading={!imageCreatorIPFS}
              image={imageCreatorIPFS}
              style={{
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
              }}
              onClick={() => {
                if (podData.CreatorId) {
                  history.push(`/artists/${podData.CreatorId}`);
                  dispatch(setSelectedUser(podData.CreatorId));
                }
              }}
            />
            <Box ml={isMobile ? 1 : 2} className={styles.header1} style={{ color: "#707582" }}>
              Sent by
            </Box>
            <Box ml={isMobile ? 1 : 2} className={styles.header1} style={{ color: Color.Purple }}>
              {`@${users.find(u => u.address === podData.Creator)?.name}`}
            </Box>
          </Box>
        )}
        <Box className={styles.botWrap} display="flex" alignItems="center" justifyContent="space-between" mt={2}>
          <Box
            display="flex"
            alignItems="center"
            className={styles.header3}
            borderTop="1px solid #00000022"
            flexGrow={1}
            pt={2}
            mr={isMobile ? 1 : 5}
            flexDirection={isMobile ? 'column' : 'row'}
          >
            <Box className={styles.header3} color="#707582">
              Proposal Deadline
            </Box>
            <Box className={styles.flexBox} ml={1}>
              <Box fontSize={14} fontWeight={500} color={Color.Purple} mr={"6px"}>
                {proposalEndTime.days} Days
              </Box>
              <Box fontSize={14} fontWeight={500} color="#2D3047" mr={"6px"}>
                {proposalEndTime.hours}h
              </Box>
              <Box fontSize={14} fontWeight={500} color="#2D3047" mr={"6px"}>
                {proposalEndTime.minutes}min
              </Box>
              <Box fontSize={14} fontWeight={500} color="#2D3047">
                {proposalEndTime.seconds}s
              </Box>
            </Box>
          </Box>
          {!isMobile && (
            <div style={{ width: isTablet ? "100%" : "", display: "flex", justifyContent: "flex-end" }}>
              <PrimaryButton
                size="medium"
                style={{ background: Color.Purple, padding: "0 20px", fontSize: '14px', fontWeight: 600 }}
                isRounded
                onClick={() => history.push(`/pods/${podData.Id}`)}
              >
                OPEN POD
              </PrimaryButton>
            </div>
          )}
        </Box>
      </Box>
    </Box>
  );
}
