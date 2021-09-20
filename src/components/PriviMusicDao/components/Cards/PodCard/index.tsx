import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import SvgIcon from "@material-ui/core/SvgIcon";
import { setSelectedUser } from "store/actions/SelectedUser";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import Box from "shared/ui-kit/Box";
import { podCardStyles } from "./index.styles";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { ReactComponent as UserSolid } from "assets/icons/user-solid.svg";
import { useTypedSelector } from "store/reducers/Reducer";
import { musicDaoFruitPod } from "shared/services/API";
import { formatNumber } from "shared/functions/commonFunctions";
import { Color } from "shared/ui-kit";

export default function PodCard({ pod }) {
  const { convertTokenToUSD } = useTokenConversion();
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = podCardStyles();

  const [podData, setPodData] = React.useState<any>({});
  const user = useTypedSelector(state => state.user);

  const [endTime, setEndTime] = React.useState<any>({ days: 22, hours: 22, minutes: 12, seconds: 10 });

  const parentNode = React.useRef<any>();

  React.useEffect(() => {
    setPodData(pod);
  }, [pod]);

  const handleFruit = type => {
    musicDaoFruitPod(user.id, podData.PodAddress, type).then(res => {
      if (res.success) {
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
        <div
          className={styles.podImage}
          style={{
            backgroundImage: podData.ImageUrl ? `url(${podData.ImageUrl})` : `url(${getRandomImageUrl()})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            overflow: "hidden",
          }}
          ref={parentNode}
        ></div>
        {podData.CreatorImageUrl ? (
          <Box
            className={styles.avatar}
            style={{
              backgroundImage: `url(${podData.CreatorImageUrl})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              backgroundPosition: "center",
              cursor: "pointer",
            }}
            onClick={() => {
              if (podData.CreatorId) {
                history.push(`/trax/profile/${podData.CreatorId}`);
                dispatch(setSelectedUser(podData.CreatorId));
              }
            }}
          />
        ) : (
          <Box
            className={styles.avatar}
            onClick={() => {
              if (podData.CreatorId) {
                history.push(`/trax/profile/${podData.CreatorId}`);
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
      <Box className={styles.podInfo}>
        <Box
          className={styles.podInfoName}
          px={2}
          onClick={() => {
            console.log('data', podData);
            if(podData.PodAddress)
              history.push(`/trax/pods/${podData.PodAddress}`);
            else if(podData.id)
              history.push(`/trax/pods/${podData.id}`);
          }}
        >
          {podData.Name}
        </Box>
        <Box className={styles.podMainInfo}>
          <Box display="flex">
            <Box
              className={
                podData.released ? styles.greenBox : podData.investing ? styles.redBox : styles.blueBox
              }
              px={1}
              pt={0.5}
            >
              {podData.released ? "Released" : podData.investing ? "Investing" : "Under formation"}
            </Box>
          </Box>
          {
            (podData.released || podData.investing) ?
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
              </> : null
          }
          {
            podData.Reproductions ?
              <>
                <Box className={styles.divider} />
                <Box className={styles.flexBox}>
                  <Box>Reproductions:</Box>
                  <Box style={{ color: "black" }}>{podData.Reproductions ?? 0}</Box>
                </Box>
              </> : null
          }
          {
            podData.InvestorDivident ?
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
              </> : null
          }
        </Box>
      </Box>
    </Box>
  );
}

const getRandomImageUrl = () => {
  return require(`assets/podImages/${Math.floor(Math.random() * 15 + 1)}.png`);
};
