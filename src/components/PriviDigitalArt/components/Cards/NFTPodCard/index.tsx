import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import Axios from "axios";

import { Popper, ClickAwayListener, Grow, Paper, MenuList, MenuItem } from "@material-ui/core";

import { setSelectedUser } from "store/actions/SelectedUser";
import { useTypedSelector } from "store/reducers/Reducer";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import Box from "shared/ui-kit/Box";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { _arrayBufferToBase64, formatNumber } from "shared/functions/commonFunctions";
import { getDefaultAvatar, getDefaultBGImage } from "shared/services/user/getUserAvatar";
import URL from "shared/functions/getURL";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "shared/ipfs/get";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import SkeletonImageBox from "shared/ui-kit/SkeletonBox";

import { podCardStyles } from "./index.styles";

export default function NFTPodCard({ item }) {
  const { convertTokenToUSD } = useTokenConversion();
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = podCardStyles();
  const { showAlertMessage } = useAlertMessage();

  const [podData, setPodData] = React.useState<any>({});
  const user = useTypedSelector(state => state.user);

  const [fundingEnded, setFundingEnded] = useState<boolean>(false);
  const [fundingEndTime, setFundingEndTime] = useState<any>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [collabCount, setCollabCount] = useState<number>(0);
  const [openCollabList, setOpenCollabList] = useState(false);
  const anchorCollabsRef = useRef<HTMLDivElement>(null);

  const parentNode = React.useRef<any>();
  const [imageIPFS, setImageIPFS] = useState<any>(null);
  const [imageIPFS1, setImageIPFS1] = useState<any>(null);
  const { ipfs, isIPFSAvailable, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    const pod = { ...item };
    if (pod?.FundingDate) {
      const timerId = setInterval(() => {
        const now = new Date();
        let delta = Math.floor(pod.FundingDate - now.getTime() / 1000);

        if (delta < 0) {
          setFundingEnded(true);
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
          setFundingEnded(false);
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
  }, [item?.FundingDate]);

  useEffect(() => {
    if (ipfs && Object.keys(ipfs).length !== 0) {
      setPodData(item);
      if (item) {
        // pod image
        if (item) {
          if (item?.InfoImage?.newFileCID && item?.InfoImage?.metadata?.properties?.name) {
            getImageIPFS(item.InfoImage.newFileCID, item.InfoImage.metadata.properties.name);
          } else {
            getImageIPFS("", "");
          }
        }

        // other user image

        if (item.collabUserData?.length > 0) {
          for (let index = 0; index < item.collabUserData.length; index++) {
            const v = item.collabUserData[index];
            if (v.userId !== item.CreatorId) {
              if (v.userImage?.urlIpfsImage) {
                setImageIPFS1(v.userImage.urlIpfsImage);
              } else if (
                v.userImage?.InfoImage?.newFileCID &&
                v.userImage?.InfoImage?.metadata?.properties?.name
              ) {
                getImageIPFS1(
                  v.userImage.InfoImage.newFileCID,
                  v.userImage.InfoImage.metadata.properties.name
                );
              } else {
                setImageIPFS1(getDefaultAvatar());
              }
              break;
            }
          }
          setCollabCount(item.collabUserData.length);
        }
      }
    }
  }, [item, ipfs]);

  const getImageIPFS = async (cid: string, fileName: string) => {
    if (cid && cid !== "" && fileName && fileName !== "") {
      let files = await onGetNonDecrypt(cid, fileName, (fileCID, fileName, download) =>
        downloadWithNonDecryption(fileCID, fileName, download)
      );

      if (files) {
        let base64String = _arrayBufferToBase64(files.buffer);
        setImageIPFS("data:image/png;base64," + base64String);
      } else {
        setImageIPFS(getDefaultBGImage());
      }
    } else {
      setImageIPFS(getDefaultBGImage());
    }
  };

  const getImageIPFS1 = async (cid: string, fileName: string) => {
    if (cid && cid !== "" && fileName && fileName !== "") {
      let files = await onGetNonDecrypt(cid, fileName, (fileCID, fileName, download) =>
        downloadWithNonDecryption(fileCID, fileName, download)
      );

      if (files) {
        let base64String = _arrayBufferToBase64(files.buffer);
        setImageIPFS1("data:image/png;base64," + base64String);
      } else {
        setImageIPFS1(getDefaultAvatar());
      }
    } else {
      setImageIPFS1(getDefaultAvatar());
    }
  };

  const handleFruit = type => {
    if (podData.fruits?.filter(f => f.fruitId === type)?.find(f => f.userId === user.id)) {
      showAlertMessage("You had already given this fruit.", { variant: "info" });
      return;
    }

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

  const handleToggleCollabMenu = e => {
    e.stopPropagation();
    e.preventDefault();
    setOpenCollabList(prevOpen => !prevOpen);
  };

  const handleCloseCollabMenu = (event: React.MouseEvent<EventTarget>) => {
    event.stopPropagation();
    if (anchorCollabsRef.current && anchorCollabsRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenCollabList(false);
  };

  function handleListKeyDownCollabMenu(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenCollabList(false);
    }
  }

  return (
    <Box className={styles.podCard}>
      <Box className={styles.podImageContent}>
        <div
          className={styles.podImage}
          ref={parentNode}
          onClick={() => {
            history.push(`/pods/${podData.id}`);
          }}
        >
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
        <div
          style={{ display: "flex", justifyContent: "space-between", padding: "0px 16px", marginTop: -35 }}
          onClick={handleToggleCollabMenu}
          ref={anchorCollabsRef}
        >
          <Box display="flex" alignItems="center">
            <SkeletonImageBox
              loading={false}
              image={podData?.creatorImageUrl ?? getDefaultAvatar()}
              className={styles.avatar}
              style={{
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                cursor: "pointer",
              }}
            />
            {collabCount > 1 && (
              <SkeletonImageBox
                className={styles.avatar1}
                loading={!imageIPFS1}
                image={imageIPFS1}
                style={{
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  cursor: "pointer",
                }}
              />
            )}
            {collabCount > 2 && <Box className={styles.avatarPlus}>+{collabCount - 2}</Box>}
            <Popper
              open={openCollabList}
              anchorEl={anchorCollabsRef.current}
              transition
              disablePortal={false}
              placement="bottom"
              style={{ position: "inherit" }}
            >
              {({ TransitionProps }) => (
                <Grow {...TransitionProps}>
                  <Paper className={styles.collabList}>
                    <ClickAwayListener onClickAway={handleCloseCollabMenu}>
                      <MenuList
                        autoFocusItem={openCollabList}
                        id="pod-card_collabs-list-grow"
                        onKeyDown={handleListKeyDownCollabMenu}
                      >
                        <div style={{ color: "#707582", margin: "20px 30px 10px", fontSize: "16px" }}>
                          All artists
                        </div>
                        {podData.collabUserData?.map(v => {
                          return (
                            <MenuItem
                              className={styles.collabItem}
                              onClick={() => {
                                if (podData.CreatorId) {
                                  history.push(`/artists/${podData.CreatorId}`);
                                  dispatch(setSelectedUser(podData.CreatorId));
                                }
                              }}
                            >
                              <Box
                                display="flex"
                                alignItems="center"
                                justifyContent="space-between"
                                width={1}
                              >
                                <Box display="flex" alignItems="center">
                                  <SkeletonImageBox
                                    className={styles.collabAvatar}
                                    loading={false}
                                    image={v.userImage.urlIpfsImage}
                                    style={{
                                      backgroundRepeat: "no-repeat",
                                      backgroundSize: "cover",
                                      backgroundPosition: "center",
                                      cursor: "pointer",
                                    }}
                                  />
                                  <div style={{ margin: "0 50px 0 15px", color: "#404658" }}>
                                    {v.firstName + " " + v.lastName}
                                  </div>
                                </Box>
                                <div style={{ color: "#7E7D95" }}>{v.numFollowers} Followers</div>
                              </Box>
                            </MenuItem>
                          );
                        })}
                      </MenuList>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>
          </Box>
          <Box className={styles.socialButtons}>
            <FruitSelect
              fruitObject={podData}
              parentNode={parentNode.current}
              onGiveFruit={handleFruit}
              style={{
                background: "#9EACF2",
              }}
            />
          </Box>
        </div>
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
                podData.status === "Funding"
                  ? styles.orangeBox
                  : podData.status === "Funding Failed"
                  ? styles.redBox
                  : podData.status === "Funded"
                  ? styles.blueBox
                  : styles.blueBox
              }
              style={{ fontWeight: "bold" }}
              px={1}
              pt={0.5}
            >
              {podData.status === "Funding"
                ? "Funding"
                : podData.status === "Funding Failed"
                ? "Funding Failed"
                : podData.status === "Funded"
                ? "Funded"
                : "Under formation"}
            </Box>
          </Box>
        </Box>
        {podData.status === "Funding" ? (
          <>
            <Box className={styles.divider} />
            <Box className={styles.flexBox}>
              <Box mr="10px">End of funding</Box>
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
              <Box mr="10px">Raised Amount</Box>
              <Box fontWeight={800}>${podData.RaisedFunds || 0}</Box>
            </Box>

            <Box className={styles.divider} />
            <Box className={styles.podMainInfoContent}>
              <Box>
                <span>Price</span>
                <p>
                  {formatNumber(
                    convertTokenToUSD(
                      podData.FundingToken,
                      podData.FundingPrice && podData.FundingPrice !== -1 ? podData.FundingPrice : 0
                    ),
                    "USD",
                    2
                  )}
                </p>
              </Box>
              <Box>
                <span>Investors share</span>
                <p style={{ textAlign: "right" }}>{podData.InvestorShare ?? 0}%</p>
              </Box>
            </Box>
          </>
        ) : null}
        {podData.status === "Funding Failed" ? (
          <>
            <Box className={styles.divider} />
            <Box className={styles.flexBox}>
              <Box mr="10px">End of funding</Box>
              <Box fontWeight={800}>0d 0h 0m 0s</Box>
            </Box>

            <Box className={styles.divider} />
            <Box className={styles.flexBox}>
              <Box mr="10px">Raised Amount</Box>
              <Box fontWeight={800}>${podData.RaisedFunds || 0}</Box>
            </Box>

            <Box className={styles.divider} />
            <Box className={styles.podMainInfoContent}>
              <Box>
                <span>Price</span>
                <p>
                  {formatNumber(
                    convertTokenToUSD(
                      podData.FundingToken,
                      podData.FundingPrice && podData.FundingPrice !== -1 ? podData.FundingPrice : 0
                    ),
                    "USD",
                    2
                  )}
                </p>
              </Box>
              <Box>
                <span>Investors share</span>
                <p style={{ textAlign: "right" }}>{podData.InvestorShare ?? 0}%</p>
              </Box>
            </Box>
          </>
        ) : null}
        {podData.status === "Funded" ? (
          <>
            <Box className={styles.divider} />
            <Box className={styles.flexBox}>
              <Box mr="10px">Release Date</Box>
              <Box fontWeight={800}>0d 0h 0m 0s</Box>
            </Box>

            <Box className={styles.divider} />
            <Box className={styles.flexBox}>
              <Box mr="10px">Revenue Accured</Box>
              <Box fontWeight={800}>${podData.RaisedFunds || 0}</Box>
            </Box>

            <Box className={styles.divider} />
            <Box className={styles.podMainInfoContent}>
              <Box>
                <span>Price</span>
                <p>
                  {formatNumber(
                    convertTokenToUSD(
                      podData.FundingToken,
                      podData.FundingPrice && podData.FundingPrice !== -1 ? podData.FundingPrice : 0
                    ),
                    "USD",
                    2
                  )}
                </p>
              </Box>
              <Box>
                <span>Investors share</span>
                <p style={{ textAlign: "right" }}>{podData.InvestorShare ?? 0}%</p>
              </Box>
            </Box>
          </>
        ) : null}

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
                    {`${String(fundingEndTime.hours).padStart(2, "0")}h ${String(
                      fundingEndTime.minutes
                    ).padStart(2, "0")}m ${String(fundingEndTime.seconds).padStart(2, "0")}s`}
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
    </Box>
  );
}

const getRandomImageUrl = () => {
  return require(`assets/podImages/${Math.floor(Math.random() * 15 + 1)}.png`);
};
