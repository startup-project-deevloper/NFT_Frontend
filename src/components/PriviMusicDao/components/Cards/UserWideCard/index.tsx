import React from "react";
import classnames from "classnames";

import { useTypedSelector } from "store/reducers/Reducer";
import { makeStyles } from "@material-ui/core";
import Axios from "axios";
import { getRandomAvatar, getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import URL from "shared/functions/getURL";
import Box from "shared/ui-kit/Box";

const userCardStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    height: 153,
    background: "#ffffff",
    borderRadius: 12,
    userSelect: "none",
    cursor: "pointer",
    display: "flex",
    padding: "9px 11px 11px",
    justifyContent: "space-between",
    "&:last-child:not(:first-child)": {
      marginLeft: "14px",
    },
  },
  avatar: {
    boxShadow:
      "0px 49.134px 26.8417px -40.945px rgba(22, 118, 205, 0.29), 0px 26.3868px 17.7428px -15.0132px rgba(49, 61, 72, 0.29)",
    borderRadius: 20,
    height: "100%",
    width: "114px",
    objectFit: "cover",
  },
  title: {
    fontFamily: "Agrandir Grand",
    fontStyle: "normal",
    fontWeight: 800,
    fontSize: "34px",
    lineHeight: "104.5%",
    color: "#081831",
    textShadow: "0px 0px 20px rgba(255, 255, 255, 0.3)",
  },
  userName: {
    fontFamily: "Agrandir",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "11px",
    lineHeight: "104.5%",
    color: "#65CB63",
    marginTop: 2,
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: 10,
  },
  icon: {
    width: 14,
    height: 14,
  },
  status: {
    marginLeft: 8,
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "12px",
    lineHeight: "104.5%",
    color: "#707582",
  },
  hashtag: {
    background: "linear-gradient(0deg, #F2FBF6, #F2FBF6)",
    borderRadius: "6px",
    padding: "6px 12px",
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: "12px",
    lineHeight: "15px",
    color: "#2D3047",
    width: "fit-content",
    height: "fit-content",

    "&:not(:first-child)": {
      marginLeft: "13px",
    },
  },
}));

const UserWideCard = props => {
  const classes = userCardStyles();
  const { userId, className } = props;
  const userSelector = useTypedSelector(state => state.user);

  const [user, setUser] = React.useState<any>();

  React.useEffect(() => {
    if (userId && userSelector) {
      const getCreatorData = async () => {
        if (userId === userSelector.id) setUser(userSelector);
        else
          Axios.get(`${URL()}/user/getBasicUserInfo/${userId}`)
            .then(response => {
              if (response.data.success) {
                let data = response.data.data;
                setUser({
                  ...data,
                  name: data.name ?? `${data.firstName} ${data.lastName}`,
                });
              } else {
                setUser({
                  url: getRandomAvatarForUserIdWithMemoization(userId),
                  name: "User name",
                  urlSlug: "Username",
                });
              }
            })
            .catch(error => {
              console.log(error);
            });
      };
      getCreatorData();
    }
  }, [userSelector, userId]);

  return (
    <div className={classnames(classes.container, className)}>
      <Box display="flex" alignItems="center">
        <img
          className={classes.avatar}
          src={
            user?.url
              ? user?.url
              : user?.id
              ? getRandomAvatarForUserIdWithMemoization(user.id)
              : getRandomAvatar()
          }
          alt=""
        />
        <Box ml={4}>
          <div className={classes.title}>{user?.name || "User name"}</div>
          <div className={classes.userName}>@{user?.urlSlug || "Username"}</div>
          {user?.verified && (
            <div className={classes.iconContainer}>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14.1627 8.43652C14.5053 8.05613 14.5053 7.47842 14.1627 7.09802L13.441 6.29676C13.2512 6.08608 13.1598 5.80474 13.1895 5.52275L13.3025 4.4504C13.3562 3.941 13.0162 3.47341 12.5151 3.36733L11.4611 3.14418C11.1831 3.08533 10.9433 2.911 10.8015 2.66475L10.2644 1.73167C10.0085 1.28721 9.45792 1.10834 8.98971 1.31759L8.00683 1.75685C7.74719 1.87289 7.45043 1.87289 7.19079 1.75685L6.20791 1.31759C5.7397 1.10834 5.18909 1.28721 4.93323 1.73167L4.3961 2.66475C4.25435 2.911 4.01453 3.08533 3.73656 3.14418L2.6825 3.36733C2.18139 3.47342 1.84146 3.941 1.89512 4.45039L2.00807 5.52276C2.03777 5.80474 1.94637 6.08608 1.75661 6.29676L1.03491 7.09803C0.692296 7.47842 0.692293 8.05613 1.0349 8.43652L1.75659 9.23779C1.94634 9.44847 2.03774 9.7298 2.00804 10.0118L1.89509 11.0842C1.84143 11.5936 2.18136 12.0611 2.68247 12.1672L3.73653 12.3904C4.0145 12.4492 4.25432 12.6235 4.39608 12.8698L4.9332 13.8029C5.18906 14.2473 5.73968 14.4262 6.20789 14.2169L7.19075 13.7777C7.4504 13.6616 7.74717 13.6616 8.00681 13.7777L8.98967 14.2169C9.45789 14.4262 10.0085 14.2473 10.2644 13.8029L10.8015 12.8698C10.9432 12.6235 11.1831 12.4492 11.461 12.3904L12.5151 12.1672C13.0162 12.0611 13.3561 11.5935 13.3025 11.0841L13.1895 10.0118C13.1598 9.72981 13.2512 9.44847 13.441 9.23779L14.1627 8.43652Z"
                  fill="url(#paint0_linear_wide)"
                />
                <path
                  d="M5.09912 8.35742L6.59912 9.85742L10.0991 6.35742"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <defs>
                  <linearGradient
                    id="paint0_linear_wide"
                    x1="1.51708"
                    y1="7.20367"
                    x2="14.2082"
                    y2="8.9906"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0.179206" stopColor="#A0D800" />
                    <stop offset="0.852705" stopColor="#0DCC9E" />
                  </linearGradient>
                </defs>
              </svg>
              <span className={classes.status}>Verified Artist</span>
            </div>
          )}
        </Box>
      </Box>
      <Box display="flex" justifyContent="flex-end" pl="7px" pt="11px">
        {user?.hashtags &&
          user?.hashtags.map((h, i) => (
            <div className={classes.hashtag} key={i}>
              {h}
            </div>
          ))}
      </Box>
    </div>
  );
};

export default UserWideCard;
