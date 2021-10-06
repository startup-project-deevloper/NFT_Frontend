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
import { formatNumber } from "shared/functions/commonFunctions";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { getUserAvatar } from "shared/services/user/getUserAvatar";
import Axios from "axios";
import URL from "shared/functions/getURL";
import { StyledSkeleton } from "shared/ui-kit/Styled-components/StyledComponents";

export default function NFTPodCard({ item }) {
  const { convertTokenToUSD } = useTokenConversion();
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = podCardStyles();

  const [podData, setPodData] = React.useState<any>({});
  const user = useTypedSelector(state => state.user);
  const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);

  const parentNode = React.useRef<any>();

  React.useEffect(() => {
    if (item && user) {
      let p = { ...item };

      if (p.Creator || p.CreatorAddress) {
        if (p.Creator === user?.id) {
          p.CreatorImageUrl = getUserAvatar({
            id: user.id,
            anon: user.anon,
            hasPhoto: user.hasPhoto,
            anonAvatar: user.anonAvatar,
            url: user.url,
          });
        } else {
          const getCreatorData = async () => {
            await Axios.get(`${URL()}/user/getBasicUserInfo/${item.Creator ?? item.CreatorAddress}`)
              .then(response => {
                if (response.data.success) {
                  let data = response.data.data;

                  p.CreatorImageUrl = getUserAvatar({
                    id: data.id,
                    anon: data.anon,
                    hasPhoto: data.hasPhoto,
                    anonAvatar: data.anonAvatar,
                    url: data.url,
                  });
                } else {
                  p.CreatorImageUrl = getRandomAvatarForUserIdWithMemoization(item.creator);
                }
              })
              .catch(error => {
                console.log(error);
              });
          };

          getCreatorData();
        }
      } else {
        p.CreatorImageUrl = getRandomAvatarForUserIdWithMemoization(item.creator);
      }

      setPodData(p);
    }
  }, [item, user]);

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

  return (
    <Box className={styles.podCard}>
      <Box className={styles.podImageContent}>
        <div
          style={{ position: "relative", overflow: "hidden" }}
          className={styles.podImage}
          ref={parentNode}
        >
          {!imageLoaded && (
              <Box my={1} position="absolute" top="0" left="0" width={1}>
                <StyledSkeleton width="100%" height={264} variant="rect" />
              </Box>
            )}
            <img
              src={`${
                podData.Type && podData.Type !== "DIGITAL_ART_TYPE"
                  ? podData.UrlMainPhoto
                  : podData.UrlMainPhoto ?? podData.Url ?? podData.url ?? getRandomImageUrl()
              }`}
              onLoad={() => setImageLoaded(true)}
              alt={podData.Name}
              onClick={() => {
                history.push(`/pods/${podData.PodAddress}`);
              }}
            />
        </div>
        <Box display="flex" justifyContent="space-between" px={2} mt="-35px">
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
                podData.Status == "FORMATION"
                  ? styles.blueBox
                  : podData.Status == "INVESTING"
                  ? styles.lightBlueBox
                  : styles.greenBox
              }
              px={1}
              pt={0.5}
            >
              {podData.Status == "FORMATION"
                ? "Under Formation"
                : podData.Status == "INVESTING"
                ? "Investing"
                : "Released"}
            </Box>
          </Box>
        </Box>
        <Box className={styles.divider} />
        <Box className={styles.flexBox}>
          <Box>
            {podData.released ? "Total staked:" : podData.investing ? "End of funding" : "Release date"}
          </Box>
          <Box fontWeight={800}>0</Box>
        </Box>
        <Box className={styles.divider} />
        <Box className={styles.flexBox}>
          <Box>Views:</Box>
          <Box fontWeight={800}>{podData.Views ?? 0}</Box>
        </Box>
        <Box className={styles.divider} />
        <Box className={styles.podMainInfoContent}>
          <Box>
            <span>Price</span>
            <p>{formatNumber(convertTokenToUSD(podData.FundingToken, podData.Price), "USD", 2)}</p>
          </Box>
          <Box textAlign="right">
            <span>Investors share</span>
            <p>{(podData.SharingPercent ?? 0) * 100}%</p>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

const getRandomImageUrl = () => {
  return require(`assets/podImages/${Math.floor(Math.random() * 15 + 1)}.png`);
};
