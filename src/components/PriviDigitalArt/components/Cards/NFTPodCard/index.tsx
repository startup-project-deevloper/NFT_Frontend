import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import SvgIcon from "@material-ui/core/SvgIcon";
import { setSelectedUser } from "store/actions/SelectedUser";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import Box from "shared/ui-kit/Box";
import { podCardStyles } from "./index.styles";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { ReactComponent as UserSolid } from "assets/icons/user-solid.svg";
import { RootState, useTypedSelector } from "store/reducers/Reducer";
import { _arrayBufferToBase64, formatNumber } from "shared/functions/commonFunctions";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { getUserAvatar } from "shared/services/user/getUserAvatar";
import Axios from "axios";
import URL from "shared/functions/getURL";
import { StyledSkeleton } from "shared/ui-kit/Styled-components/StyledComponents";
import { Color } from "shared/ui-kit";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "shared/ipfs/get";
import getPhotoIPFS from "shared/functions/getPhotoIPFS";

export default function NFTPodCard({ item }) {
  const { convertTokenToUSD } = useTokenConversion();
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = podCardStyles();

  const [podData, setPodData] = React.useState<any>({});
  const user = useTypedSelector(state => state.user);
  const usersList = useSelector((state: RootState) => state.usersInfoList);
  
  const [endTime, setEndTime] = useState<any>({ days: 22, hours: 22, minutes: 12, seconds: 10 });

  const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);

  const parentNode = React.useRef<any>();

  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const [imageCreatorIPFS, setImageCreatorIPFS] = useState<any>(null);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    if (ipfs && Object.keys(ipfs).length !== 0) {
      let pod = { ...item };
      console.log("pod: ", pod)
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
      if (pod && pod.InfoImage && pod.InfoImage.newFileCID) {
        getImageIPFS(pod.InfoImage.newFileCID);
      }
      if (pod && pod.Creator) {
        getImageCreatorIPFS(pod.Creator);
      }
    }
  }, [item, ipfs]);

  const getImageCreatorIPFS = async (userId: string) => {
    let creatorFound = usersList.find(user => user.id === userId);

    if (creatorFound && creatorFound.infoImage && creatorFound.infoImage.newFileCID) {
      let imageUrl = await getPhotoIPFS(creatorFound.infoImage.newFileCID, downloadWithNonDecryption);
      setImageCreatorIPFS(imageUrl)
    }
  };

  const getImageIPFS = async (cid: string) => {
    let files = await onGetNonDecrypt(cid, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      setImageIPFS("data:image/png;base64," + base64String);
    }
  };

  // React.useEffect(() => {
  //   if (item && user) {
  //     let p = { ...item };

  //     if (p.Creator || p.CreatorAddress) {
  //       if (p.Creator === user?.id) {
  //         p.CreatorImageUrl = getUserAvatar({
  //           id: user.id,
  //           anon: user.anon,
  //           hasPhoto: user.hasPhoto,
  //           anonAvatar: user.anonAvatar,
  //           url: user.url,
  //         });
  //       } else {
  //         const getCreatorData = async () => {
  //           await Axios.get(`${URL()}/user/getBasicUserInfo/${item.Creator ?? item.CreatorAddress}`)
  //             .then(response => {
  //               if (response.data.success) {
  //                 let data = response.data.data;

  //                 p.CreatorImageUrl = getUserAvatar({
  //                   id: data.id,
  //                   anon: data.anon,
  //                   hasPhoto: data.hasPhoto,
  //                   anonAvatar: data.anonAvatar,
  //                   url: data.url,
  //                 });
  //               } else {
  //                 p.CreatorImageUrl = getRandomAvatarForUserIdWithMemoization(item.creator);
  //               }
  //             })
  //             .catch(error => {
  //               console.log(error);
  //             });
  //         };

  //         getCreatorData();
  //       }
  //     } else {
  //       p.CreatorImageUrl = getRandomAvatarForUserIdWithMemoization(item.creator);
  //     }

  //     setPodData(p);
  //   }
  // }, [item, user]);

  const handleFruit = type => {
    const body = {
      userId: user.id,
      fruitId: type,
      podAddress: podData.PodAddress ?? podData.id,
    };

    Axios.post(`${URL()}/mediaPod/fruit`, body).then(res => {
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

  console.log(podData)
  return (
    <Box className={styles.podCard}>
      <Box className={styles.podImageContent}>
        <div
          className={styles.podImage}
          style={{
            // position: "relative", overflow: "hidden",
            backgroundImage: imageIPFS ? `url(${imageIPFS})` : `url(${getRandomImageUrl()})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
          ref={parentNode}
        >
          {!imageLoaded && (
            <Box my={1} position="absolute" top="0" left="0" width={1}>
              <StyledSkeleton width="100%" height={264} variant="rect" />
            </Box>
          )}

          {/* <img
            src={`${podData.Type && podData.Type !== "DIGITAL_ART_TYPE"
                ? podData.UrlMainPhoto
                : podData.UrlMainPhoto ?? podData.Url ?? podData.url ?? getRandomImageUrl()
              }`}
            onLoad={() => setImageLoaded(true)}
            alt={podData.Name}
            onClick={() => {
              history.push(`/pix/pods/${podData.PodAddress}`);
            }}
          /> */}
        </div>
        <Box display="flex" justifyContent="space-between" px={2} mt="-35px">
          {imageCreatorIPFS ? (
            <Box
              className={styles.avatar}
              style={{
                backgroundImage: imageCreatorIPFS ? `url(${imageCreatorIPFS})` : "",
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
          ) : (
            <Box
              className={styles.avatar}
              onClick={() => {
                if (podData.CreatorId) {
                  history.push(`/profile/${podData.CreatorId}`);
                  dispatch(setSelectedUser(podData.CreatorId));
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <SvgIcon>
                <UserSolid />
              </SvgIcon>
            </Box>
          )}
          <Box className={styles.socialButtons}>
            <FruitSelect fruitObject={podData} parentNode={parentNode.current} onGiveFruit={handleFruit} />
          </Box>
        </Box>
      </Box>
      <Box
        className={styles.podMainInfo}
        onClick={() => {
          history.push(`/pods/${podData.PodAddress}`);
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
                <Box style={{ marginRight: "10px", fontWeight: "bold" }}>
                  End of funding
                </Box>
                <Box style={{ color: "black" }}>
                  <>
                    <span style={{ color: Color.MusicDAODeepGreen }}>
                      {endTime.days ? `${String(endTime.days).padStart(2, "0")}days ` : ""}
                    </span>
                    {`${String(endTime.hours).padStart(2, "0")}h ${String(endTime.minutes).padStart(
                      2,
                      "0"
                    )}min ${String(endTime.seconds).padStart(2, "0")}s`}
                  </>
                </Box>
              </Box>

              <Box className={styles.divider} />
              <Box className={styles.flexBox}>
                <Box style={{ marginRight: "10px", fontWeight: "bold" }}>
                  Raised Amount
                </Box>
                <Box style={{ color: Color.MusicDAODeepGreen, fontWeight: "bold" }}>
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
                <Box style={{ marginRight: "10px", fontWeight: "bold" }}>
                  End of funding
                </Box>
                <Box style={{ color: "black" }}>
                  <>
                    <span style={{ color: Color.MusicDAODeepGreen }}>
                      0 days
                    </span> 0 min 0 s
                  </>
                </Box>
              </Box>

              <Box className={styles.divider} />
              <Box className={styles.flexBox}>
                <Box style={{ marginRight: "10px", fontWeight: "bold" }}>
                  Raised Amount
                </Box>
                <Box style={{ color: Color.Red, fontWeight: "bold" }}>
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
                <Box style={{ marginRight: "10px", fontWeight: "bold" }}>
                  Release Date
                </Box>
                <Box style={{ color: "black" }}>
                  <>
                    <span style={{ color: Color.MusicDAODeepGreen }}>
                      0 days
                    </span> 0 min 0 s
                  </>
                </Box>
              </Box>

              <Box className={styles.divider} />
              <Box className={styles.flexBox}>
                <Box style={{ marginRight: "10px", fontWeight: "bold" }}>
                  Revenue Accured
                </Box>
                <Box style={{ color: Color.Red, fontWeight: "bold" }}>
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
              <Box style={{ color: "black" }}>
                {podData.released ? (
                  `$${podData.totalStaked ?? 2803}`
                ) : podData.investing ? (
                  <>
                    <span style={{ color: Color.MusicDAODeepGreen }}>
                      {endTime.days ? `${String(endTime.days).padStart(2, "0")}days ` : ""}
                    </span>
                    {`${String(endTime.hours).padStart(2, "0")}h ${String(endTime.minutes).padStart(
                      2,
                      "0"
                    )}min ${String(endTime.seconds).padStart(2, "0")}s`}
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
              <Box style={{ color: "black" }}>{podData.Reproductions ?? 0}</Box>
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
