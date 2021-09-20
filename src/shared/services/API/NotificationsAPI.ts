import axios from "axios";
import URL from "shared/functions/getURL";

export enum NotificationItemType {
  Community = "community",
  LevelUp = "levelUp",
  NFTPod = "NFTPod",
  Pod = "Pod",
  PriviCredit = "PriviCredit",
  StreamingLiveAudio = "StreamingLiveAudio",
  StreamingLiveVideo = "StreamingLiveVideo",
  TaskBadge = "taskBadge",
  Token = "token",
  User = "user",
}

export type Notification = {
  amount: number;
  itemId: string;
  id: string;
  onlyInformation: boolean;
  type: number;
  token: string;
  typeItemId: NotificationItemType;
  pod: string;
  follower: string;
  date: number; // timestamp
  otherItemId: string;
  comment: string;
};

type GetNotificationsResult =
  | {
    success: true;
    data: Notification[];
  }
  | { success: false };

export const getNotifications = async (): Promise<GetNotificationsResult> => {
  const response = await axios.get(`${URL()}/user/wall/getNotifications`);

  return response.data;
};

export const removeUserNotification = async (notificationId: string): Promise<GetNotificationsResult> => {
  const response = await axios.post(`${URL()}/user/removeNotification`, {
    notificationId: notificationId,
  });

  return response.data;
};