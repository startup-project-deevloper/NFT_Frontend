import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { setSelectedUser } from "store/actions/SelectedUser";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import Box from "shared/ui-kit/Box";
import { podCardStyles } from "./index.styles";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { RootState, useTypedSelector } from "store/reducers/Reducer";
import { _arrayBufferToBase64, formatNumber } from "shared/functions/commonFunctions";
import { getDefaultAvatar, getDefaultBGImage } from "shared/services/user/getUserAvatar";
import Axios from "axios";
import URL from "shared/functions/getURL";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "shared/ipfs/get";
import getPhotoIPFS from "shared/functions/getPhotoIPFS";
import SkeletonImageBox from "shared/ui-kit/SkeletonBox";

export default function NFTPodCard({ item }) {
  const { convertTokenToUSD } = useTokenConversion();
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = podCardStyles();

  const [podData, setPodData] = React.useState<any>({});
  const user = useTypedSelector(state => state.user);
  const usersList = useSelector((state: RootState) => state.usersInfoList);

  const [fundingEndTime, setFundingEndTime] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const parentNode = React.useRef<any>();

  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const [imageCreatorIPFS, setImageCreatorIPFS] = useState<any>(null);

  const { isIPFSAvailable, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    let pod = { ...item };

    if (pod && pod.FundingDate && pod.FundingDate > Math.trunc(Date.now() / 1000)) {
      pod.status = 'Funding'
    } else if (pod && pod.FundingDate && pod.FundingDate <= Math.trunc(Date.now() / 1000) &&
      (pod.RaisedFunds || 0) < pod.FundingTarget) {
      pod.status = 'Funding Failed'
    } else if (pod && pod.FundingDate && pod.FundingDate <= Math.trunc(Date.now() / 1000) &&
      (pod.RaisedFunds || 0) >= pod.FundingTarget) {
      pod.status = 'Funded'
    }
    setPodData(pod);

    if (pod?.FundingDate) {
      const timerId = setInterval(() => {
        const now = new Date();
        let delta = Math.floor(pod.FundingDate - now.getTime() / 1000);

        if (delta < 0) {
          setFundingEndTime({
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
          setFundingEndTime({
            days,
            hours,
            minutes,
            seconds,
          });
        }
      }, 1000);

      return () => clearInterval(timerId);
    }

  }, [item.Id]);

  useEffect(() => {
    if (isIPFSAvailable && item) {
      getImageIPFS(item.InfoImage?.newFileCID);
      getImageCreatorIPFS(item.Creator || '', item.CreatorId || '');
    }
  }, [isIPFSAvailable, item]);

  const getImageCreatorIPFS = async (userId: string, userId2: string) => {
    let creatorFound = usersList.find(user => user.id === userId || user.id === userId2);

    if (creatorFound && creatorFound.infoImage && creatorFound.infoImage.newFileCID) {
      let imageUrl = await getPhotoIPFS(creatorFound.infoImage.newFileCID, downloadWithNonDecryption);
      setImageCreatorIPFS(imageUrl)
    } else {
      setImageCreatorIPFS(getDefaultAvatar())
    }
  };

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

  const handleFruit = type => {
    const body = {
      userId: user.id,
      fruitId: type,
      podId: podData.Id,
      type: "PIX",
    };

    Axios.post(`${URL()}/priviPod/fruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...podData };
        itemCopy.fruits = [
          ...(itemCopy.fruits || []),
          { userId: user.id, fruitId: type, date: new Date().getTime() },
        ];
        setPodData(itemCopy);
      }
    });
  };

  return (
    <Box className={styles.podCard}>
      <Box className={styles.podImageContent}>
        <div className={styles.podImage} ref={parentNode}>
          <SkeletonImageBox
            loading={!imageIPFS}
            image={imageIPFS}
            className={styles.podImage}
            style={{
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              overflow: "hidden",
            }}
          />
        </div>
        <Box display="flex" justifyContent="space-between" px={2} mt="-35px">
          <SkeletonImageBox
            loading={!imageCreatorIPFS}
            image={imageCreatorIPFS}
            className={styles.avatar}
            style={{
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              if (podData.CreatorId) {
                history.push(`/profile/${podData.CreatorId}`);
                dispatch(setSelectedUser(podData.CreatorId));
              }
            }}
          />
          <Box className={styles.socialButtons}>
            <FruitSelect
              fruitObject={podData}
              parentNode={parentNode.current}
              onGiveFruit={handleFruit}
              style={{
                background: "#9EACF2"
              }}
            />
          </Box>
        </Box>
      </Box>
      <Box
        className={styles.podMainInfo}
        onClick={() => {
          history.push(`/pods/${podData.Id}`);
        }}
      >
        <Box className={styles.flexBox}>
          <Box>{podData.Name}</Box>

          <Box display="flex">
            <Box
              className={
                podData.status === 'Funding' ? styles.orangeBox : podData.status === 'Funding Failed' ? styles.redBox
                  : podData.status === 'Funded' ? styles.blueBox : styles.blueBox
              }
              style={{ fontWeight: "bold" }}
              px={1}
              pt={0.5}
            >
              {podData.status === 'Funding' ? "Funding" : podData.status === 'Funding Failed' ? "Funding Failed" :
                podData.status === 'Funded' ? "Funded" : "Under formation"}
            </Box>
          </Box>
        </Box>
        {
          podData.status === 'Funding' ?
            <>
              <Box className={styles.divider} />
              <Box className={styles.flexBox}>
                <Box mr="10px">
                  End of funding
                </Box>
                <Box fontWeight={800}>
                  {fundingEndTime.days ? `${String(fundingEndTime.days).padStart(2, "0")}d ` : ""}
                  {`${String(fundingEndTime.hours).padStart(2, "0")}h ${String(fundingEndTime.minutes).padStart(
                    2,
                    "0"
                  )}m ${String(fundingEndTime.seconds).padStart(2, "0")}s`}
                </Box>
              </Box>

              <Box className={styles.divider} />
              <Box className={styles.flexBox}>
                <Box mr="10px">
                  Raised Amount
                </Box>
                <Box fontWeight={800}>
                  ${podData.RaisedFunds || 0}
                </Box>
              </Box>

              <Box className={styles.divider} />
              <Box className={styles.podMainInfoContent}>
                <Box>
                  <span>Price</span>
                  <p>{formatNumber(convertTokenToUSD(podData.FundingToken, podData.FundingPrice && podData.FundingPrice !== -1 ? podData.FundingPrice : 0), "USD", 2)}</p>
                </Box>
                <Box>
                  <span>Investors share</span>
                  <p style={{ textAlign: "right" }}>
                    {(podData.InvestorShare ?? 0)}%
                  </p>
                </Box>
              </Box>
            </> : null
        }
        {
          podData.status === 'Funding Failed' ?
            <>
              <Box className={styles.divider} />
              <Box className={styles.flexBox}>
                <Box mr="10px">
                  End of funding
                </Box>
                <Box fontWeight={800}>
                  0d 0h 0m 0s
                </Box>
              </Box>

              <Box className={styles.divider} />
              <Box className={styles.flexBox}>
                <Box mr="10px">
                  Raised Amount
                </Box>
                <Box fontWeight={800}>
                  ${podData.RaisedFunds || 0}
                </Box>
              </Box>

              <Box className={styles.divider} />
              <Box className={styles.podMainInfoContent}>
                <Box>
                  <span>Price</span>
                  <p>{formatNumber(convertTokenToUSD(podData.FundingToken, podData.FundingPrice && podData.FundingPrice !== -1 ? podData.FundingPrice : 0), "USD", 2)}</p>
                </Box>
                <Box>
                  <span>Investors share</span>
                  <p style={{ textAlign: "right" }}>
                    {(podData.InvestorShare ?? 0)}%
                  </p>
                </Box>
              </Box>
            </> : null
        }
        {
          podData.status === 'Funded' ?
            <>
              <Box className={styles.divider} />
              <Box className={styles.flexBox}>
                <Box mr="10px">
                  Release Date
                </Box>
                <Box fontWeight={800}>
                  0d 0h 0m 0s
                </Box>
              </Box>

              <Box className={styles.divider} />
              <Box className={styles.flexBox}>
                <Box mr="10px">
                  Revenue Accured
                </Box>
                <Box fontWeight={800}>
                  ${podData.RaisedFunds || 0}
                </Box>
              </Box>

              <Box className={styles.divider} />
              <Box className={styles.podMainInfoContent}>
                <Box>
                  <span>Price</span>
                  <p>{formatNumber(convertTokenToUSD(podData.FundingToken, podData.FundingPrice && podData.FundingPrice !== -1 ? podData.FundingPrice : 0), "USD", 2)}</p>
                </Box>
                <Box>
                  <span>Investors share</span>
                  <p style={{ textAlign: "right" }}>
                    {(podData.InvestorShare ?? 0)}%
                  </p>
                </Box>
              </Box>
            </> : null
        }

        {podData.released || podData.investing ? (
          <>
            <Box className={styles.divider} />
            <Box className={styles.flexBox}>
              <Box>
                {podData.released ? "Total staked:" : podData.investing ? "End of funding" : "Release date"}
              </Box>
              <Box fontWeight={800}>
                {podData.released ? (
                  `$${podData.totalStaked ?? 2803}`
                ) : podData.investing ? (
                  <>
                    {fundingEndTime.days ? `${String(fundingEndTime.days).padStart(2, "0")}d ` : ""}
                    {`${String(fundingEndTime.hours).padStart(2, "0")}h ${String(fundingEndTime.minutes).padStart(
                      2,
                      "0"
                    )}m ${String(fundingEndTime.seconds).padStart(2, "0")}s`}
                  </>
                ) : (
                  "Unknown"
                )}
              </Box>
            </Box>
          </>
        ) : null}
        {podData.Reproductions ? (
          <>
            <Box className={styles.divider} />
            <Box className={styles.flexBox}>
              <Box>Reproductions:</Box>
              <Box fontWeight={800}>{podData.Reproductions ?? 0}</Box>
            </Box>
          </>
        ) : null}
        {podData.InvestorDivident ? (
          <>
            <Box className={styles.divider} />
            <Box className={styles.podMainInfoContent}>
              <Box>
                <span>Price</span>
                <p>{formatNumber(convertTokenToUSD(podData.FundingToken, podData.Price), "USD", 2)}</p>
              </Box>
              <Box>
                <span>Investors share</span>
                <p>{(podData.InvestorDivident ?? 0) * 100}%</p>
              </Box>
            </Box>
          </>
        ) : null}
      </Box>
    </Box >
  );
}

const getRandomImageUrl = () => {
  return require(`assets/podImages/${Math.floor(Math.random() * 15 + 1)}.png`);
};
