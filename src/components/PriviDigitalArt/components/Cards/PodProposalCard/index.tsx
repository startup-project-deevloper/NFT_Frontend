import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

import { setSelectedUser } from "store/actions/SelectedUser";
import Box from "shared/ui-kit/Box";
import { useTypedSelector } from "store/reducers/Reducer";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { Color, Gradient, PrimaryButton } from "shared/ui-kit";
import Avatar from "shared/ui-kit/Avatar";
import { getUsersInfoList } from "store/selectors";
import { getDefaultAvatar, getDefaultBGImage } from "shared/services/user/getUserAvatar";
import useIPFS from "../../../../../shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "../../../../../shared/ipfs/get";
import getPhotoIPFS from "../../../../../shared/functions/getPhotoIPFS";
import { PodProposalCardStyles } from "./index.styles";

export default function PodProposalCard({ pod }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = PodProposalCardStyles();

  const users = useTypedSelector(getUsersInfoList);
  const user = useTypedSelector(state => state.user);

  const parentNode = useRef<any>();

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();
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
    if (pod && ipfs && Object.keys(ipfs).length !== 0) {
      if (pod && pod.InfoImage && pod.InfoImage.newFileCID) {
        getImageIPFS(pod.InfoImage.newFileCID);
      }
      if (pod && pod.CreatorId) {
        getImageCreatorIPFS(pod.CreatorId);
      }
      setPodData(pod);
    }
  }, [pod, ipfs]);

  const getImageCreatorIPFS = async (userId: string) => {
    let creatorFound = users.find(user => user.id === userId);

    if (creatorFound && creatorFound.infoImage && creatorFound.infoImage.newFileCID) {
      let imageUrl = await getPhotoIPFS(creatorFound.infoImage.newFileCID, downloadWithNonDecryption);
      setImageCreatorIPFS(imageUrl);
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
    }
  };

  return (
    <Box className={styles.podCard}>
      <Box className={styles.podImageContent}>
        <div
          className={styles.podImage}
          style={{
            backgroundImage: imageIPFS ? `url(${imageIPFS})` : `url(${getDefaultBGImage()})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
          ref={parentNode}
        ></div>
      </Box>
      <Box width={1} ml={2}>
        <Box display="flex">
          <Box style={{ background: Gradient.Green1, borderRadius: 8, padding: "4px 24px" }}>
            <Box className={styles.header1} color="white">
              POD Proposal
            </Box>
          </Box>
        </Box>
        <Box className={styles.header2} mt={2}>
          {podData.Name}
        </Box>
        {podData.Creator && (
          <Box display="flex" alignItems="center" mt={2} pb={2}>
            <Box
              onClick={() => {
                history.push(`/trax/profile/${podData.CreatorId}`);
                dispatch(setSelectedUser(podData.CreatorId));
              }}
            >
              <Avatar
                size={36}
                rounded
                bordered
                image={imageCreatorIPFS ? imageCreatorIPFS : getDefaultAvatar()}
              />
            </Box>
            <Box ml={2} className={styles.header1} style={{ color: "#707582" }}>
              Sent by
            </Box>
            <Box ml={2} className={styles.header1} style={{ color: Color.Green }}>
              {`@${users.find(u => u.address === podData.Creator)?.name}`}
            </Box>
          </Box>
        )}
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
          <Box
            display="flex"
            alignItems="center"
            className={styles.header3}
            borderTop="1px solid #00000022"
            flexGrow={1}
            pt={2}
            mr={5}
          >
            <Box className={styles.header3} color="#707582">
              Proposal Deadline
            </Box>
            <Box className={styles.flexBox} ml={1}>
              <Box fontSize={14} fontWeight={500} color="#65CB63" mr={"6px"}>
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
          <PrimaryButton
            size="medium"
            style={{ background: Gradient.Green1, paddingLeft: 48, paddingRight: 48 }}
            isRounded
            onClick={() => history.push(`/pods/${podData.Id}`)}
          >
            OPEN POD
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}
