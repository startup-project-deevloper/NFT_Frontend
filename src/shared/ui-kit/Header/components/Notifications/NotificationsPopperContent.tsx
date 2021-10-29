import { formatDistanceToNowStrict } from "date-fns/esm";
import React, { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Notification } from "shared/services/API/NotificationsAPI";
import { Avatar, Color, FontSize, grid, HeaderBold4, HeaderBold6 } from "shared/ui-kit";
import styled from "styled-components";
import { RootState } from "store/reducers/Reducer";
import { NotificationButtons } from "./NotificationButtons";
import { NotificationContent } from "./NotificationContent/NotificationContent";
import { ReactComponent as RemoveIcon } from "assets/icons/close.svg";
import useIPFS from "shared/utils-IPFS/useIPFS";
import getPhotoIPFS from "shared/functions/getPhotoIPFS";

type NotificationsPopperContentProps = {
  notifications: Notification[];
  onDismissNotification: (notificationId: string) => void;
  onRefreshAllProfile: (userId: string) => void;
  removeNotification: (notificationId: string) => void;
  handleClosePopper: () => void;
  viewMore: (value: string) => void;
  setSelectedNotification?: any;
  handleShowContributionModal: () => void;
  handleHidePopper: () => void;
  theme?: "dark" | "light";
};

const getDateDistance = (start: number, end: number) => {
  const distanceDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return distanceDays;
};

const NotificationItem = ({
  notification,
  onDismissNotification,
  onRefreshAllProfile,
  removeNotification,
  viewMore,
  setSelectedNotification,
  handleClosePopper,
  handleShowContributionModal,
  handleHidePopper,
  theme,
}) => {
  const users = useSelector((state: RootState) => state.usersInfoList);
  const userSelector = useSelector((state: RootState) => state.user);
  const { downloadWithNonDecryption } = useIPFS();

  const notificationUserId = notification.typeItemId === "user" ? notification.itemId : notification.follower;
  let user: any = users.find(usr => usr.id === notificationUserId);

  const [avatar, setAvatar] = useState<string | undefined>("");

  if (!user || !user.url) {
    user = userSelector;
  }

  useEffect(() => {
    (async () => {
      if (notification.user && notification.user.infoImage && notification.user.infoImage.newFileCID) {
        const imageUrl = await getPhotoIPFS(
          notification.user.infoImage.newFileCID,
          downloadWithNonDecryption
        );
        setAvatar(imageUrl);
      } else {
        setAvatar(notification.avatar);
      }
    })();
  }, [notification]);

  return (
    <NotificationContainer key={notification.date}>
      <AvatarContainer>
        <Avatar
          noBorder={theme === "dark"}
          url={theme === "dark" ? require("assets/icons3d/SuperToroid-Iridescent.png") : avatar}
          size="medium"
        />
      </AvatarContainer>
      <ContentContainer>
        <NotificationMessage theme={theme}>
          <NotificationContent notification={notification} />
        </NotificationMessage>
        <NotificationButtons
          theme={theme}
          notification={notification}
          onDismissNotification={() => {
            onDismissNotification(notification.id);
          }}
          refreshAllProfile={onRefreshAllProfile}
          viewMore={viewMore}
          setSelectedNotification={setSelectedNotification}
          handleShowContributionModal={handleShowContributionModal}
          handleClosePopper={handleClosePopper}
          handleHidePopper={handleHidePopper}
        />
        <TimeLabel>{formatDistanceToNowStrict(new Date(notification.date), { addSuffix: true })}</TimeLabel>
        {/* <RemoveButtonWrapper onClick={() => { removeNotification(notification.id) }}>
    </RemoveButtonWrapper> */}
      </ContentContainer>
      <RemoveButton onClick={() => removeNotification(notification.id)} />
    </NotificationContainer>
  );
};

export const NotificationsPopperContent: React.FunctionComponent<NotificationsPopperContentProps> = ({
  notifications,
  onDismissNotification,
  onRefreshAllProfile,
  removeNotification,
  viewMore,
  setSelectedNotification,
  handleClosePopper,
  handleShowContributionModal,
  handleHidePopper,
  theme = "light",
}) => {
  const [newNotifications, _] = useMemo(() => {
    const newN: Notification[] = [];
    const pastN: Notification[] = [];

    notifications.map(notification => {
      if (getDateDistance(notification.date, new Date().getTime()) < 7) {
        newN.push(notification);
      } else {
        pastN.push(notification);
      }
    });

    return [newN, pastN];
  }, [notifications]);

  return (
    <div>
      <HeaderBold4 theme={theme}>Notifications</HeaderBold4>
      <NewPastWrapper>
        <HeaderBold6>New</HeaderBold6>
      </NewPastWrapper>
      <TimeDivider theme={theme} />
      {newNotifications.map(n => (
        <NotificationItem
          notification={n}
          onDismissNotification={onDismissNotification}
          onRefreshAllProfile={onRefreshAllProfile}
          removeNotification={removeNotification}
          viewMore={viewMore}
          setSelectedNotification={setSelectedNotification}
          handleClosePopper={handleClosePopper}
          handleShowContributionModal={handleShowContributionModal}
          handleHidePopper={handleHidePopper}
          theme={theme}
        />
      ))}
      {/* <NewPastWrapper>
        <HeaderBold6 theme={theme}>Past</HeaderBold6>
      </NewPastWrapper>
      <TimeDivider theme={theme} />
      {pastNotifications.map(renderNotification)} */}
    </div>
  );
};

const NotificationContainer = styled.div`
  padding: ${grid(2)} ${grid(2)} ${grid(2)} 0;
  display: flex;
  align-items: stretch;
  position: relative;
`;

const AvatarContainer = styled.div`
  flex-grow: 0;
  margin-right: ${grid(2)};
`;

const ContentContainer = styled.div`
  width: 100%;
`;

type NotificationMessageProps = React.PropsWithChildren<{
  theme?: "dark" | "light";
}>;

const NotificationMessage = styled.div<NotificationMessageProps>`
  margin-top: 0;
  margin-bottom: ${grid(1)};
  font-size: ${FontSize.M};
  color: ${p => (p.theme === "dark" ? Color.White : "#181818")};
  word-break: break-word;

  label {
    font-size: 14px;
    color: ${p => (p.theme === "dark" ? Color.White : "#181818")};
    margin: 0;
    margin-bottom: 10px;
    display: block;
  }

  b {
    font-weight: bold;
    cursor: pointer;
  }

  em {
    font-style: normal;
    font-weight: bold;
  }
`;

const TimeLabel = styled.p`
  margin-top: 8px;
  color: ${Color.GrayDark};
  font-size: ${FontSize.S};
`;

const TimeDivider = styled.div<NotificationMessageProps>`
  opacity: 0.1;
  border: 1px solid ${p => (p.theme === "dark" ? Color.White : Color.Black)};
`;

const NewPastWrapper = styled.div`
  margin-top: 20px;
`;

const RemoveButton = styled(RemoveIcon)`
  cursor: pointer;
  margin-left: 20px;
  width: 16px;
  height: 16px;
  color: ${p => (p.theme === "dark" ? Color.White : Color.GrayDark)};
`;
