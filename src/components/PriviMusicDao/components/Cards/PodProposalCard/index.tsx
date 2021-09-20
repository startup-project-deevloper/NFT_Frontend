import React from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import SvgIcon from "@material-ui/core/SvgIcon";
import { setSelectedUser } from "store/actions/SelectedUser";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import Box from "shared/ui-kit/Box";
import { PodProposalCardStyles } from "./index.styles";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { ReactComponent as UserSolid } from "assets/icons/user-solid.svg";
import { useTypedSelector } from "store/reducers/Reducer";
import { musicDaoFruitPod } from "shared/services/API";
import { formatNumber } from "shared/functions/commonFunctions";
import { Color, Gradient, PrimaryButton, SecondaryButton } from "shared/ui-kit";
import classNames from "classnames";
import Avatar from "shared/ui-kit/Avatar";
import { getUsersInfoList } from "store/selectors";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";

export default function PodProposalCard({ pod }) {
  const { convertTokenToUSD } = useTokenConversion();
  const history = useHistory();
  const dispatch = useDispatch();
  const styles = PodProposalCardStyles();

  const [podData, setPodData] = React.useState<any>({});
  const users = useTypedSelector(getUsersInfoList);
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
                image={users.find(u => u.address === podData.Creator)?.imageURL ?? getRandomAvatar()}
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
            <Box style={{ color: "black" }} ml={2}>
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
          <PrimaryButton
            size="medium"
            style={{ background: Gradient.Green1, paddingLeft: 48, paddingRight: 48 }}
            isRounded
          >
            OPEN POD
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}

const getRandomImageUrl = () => {
  return require(`assets/podImages/${Math.floor(Math.random() * 15 + 1)}.png`);
};
