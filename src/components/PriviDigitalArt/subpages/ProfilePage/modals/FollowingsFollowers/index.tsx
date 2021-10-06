import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import axios from "axios";
import cls from "classnames";

import { RootState } from "store/reducers/Reducer";
import URL from "shared/functions/getURL";
import AlertMessage from "shared/ui-kit/Alert/AlertMessage";
import { useUserConnections } from "shared/contexts/UserConnectionsContext";

import { Avatar, Modal } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { GreenText } from "components/PriviSocial/index.styles";
import { GreenSlider } from "components/PriviSocial/subpages/Feed";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import ClosenessDegreeModal from "../ClosenessDegreeModal";
import { profileFollowsModalStyles } from "./index.styles";
import { StyledSkeleton } from "shared/ui-kit/Styled-components/StyledComponents";

const interestsList = ["art", "arts and crafts", "Investing", "NFTs", "Exclusive material"];

const arePropsEqual = (prevProps, currProps) => {
  return (
    prevProps.open === currProps.open &&
    prevProps.header === currProps.header &&
    prevProps.list === currProps.list &&
    prevProps.isLoadingFollows === currProps.isLoadingFollows
  );
};

const ProfileFollowsModal = React.memo(
  ({
    list,
    onClose,
    open,
    header,
    refreshFollowings,
    refreshFollowers,
    isLoadingFollows,
    ownUser = true,
  }: {
    list: any[];
    onClose: () => void;
    open: boolean;
    header: "Followers" | "Followings";
    refreshFollowings: () => void;
    refreshFollowers: () => void;
    isLoadingFollows: boolean;
    ownUser: boolean;
  }) => {
    const userSelector = useSelector((state: RootState) => state.user);
    const users = useSelector((state: RootState) => state.usersInfoList);
    const userConnections = useUserConnections();
    const classes = profileFollowsModalStyles();
    const history = useHistory();

    const [usersFilteredList, setUsersFilteredList] = useState<any[]>([]);

    const [suggestionsList, setSuggestionsList] = useState<any[]>([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState<boolean>(false);

    const [interestFilters, setInterestFilters] = useState<string[]>([]);
    const [closenessDegree, setClosenessDegree] = useState<number[]>([0, 2]);

    const [selectedUser, setSelectedUser] = useState<any>();

    const [status, setStatus] = useState<any>("");

    const [openClosenessDegreeModal, setOpenClosenessDegreeModal] = useState<boolean>(false);

    const handleOpenClosenessDegreeModal = u => {
      setSelectedUser(u);
      setOpenClosenessDegreeModal(true);
    };

    const handleCloseClosenessDegreeModal = () => {
      setOpenClosenessDegreeModal(false);
      setSelectedUser(null);
    };

    useEffect(() => {
      if (users?.length > 0) getSuggesttedUsers();
    }, [users]);

    useEffect(() => {
      let us = [] as any;
      // 0: never, 1: request, 2: follow or following
      if (list && list.length > 0) {
        list
          .filter(user => (header === "Followers" ? user.isFollower === 2 : user.isFollowing === 2))
          .forEach(user => {
            if (
              (!user.closenessDegree ||
                (user.closenessDegree >= closenessDegree[0] && user.closenessDegree <= closenessDegree[1])) &&
              (interestFilters.length === 0 ||
                !user.interests ||
                user.interests.some(r => interestFilters.indexOf(r) >= 0))
            ) {
              us.push(user);
            }
          });
        setUsersFilteredList(us);
      }
    }, [list, closenessDegree, interestFilters]);

    const getSuggesttedUsers = () => {
      if (loadingSuggestions) {
        return;
      }
      setLoadingSuggestions(true);
      axios
        .get(`${URL()}/user/getSuggestedUsers/${userSelector.id}`)
        .then(res => {
          const resp = res.data;
          if (resp.success) {
            const data = resp.data;

            let suggestions = [...data];

            if (suggestions.length > 0) {
              suggestions.forEach((user, index) => {
                const matchedUser = users.find(u => u.id === user.id || u.id === user.id?.user);
                if (matchedUser) {
                  suggestions[index].userImageURL = matchedUser.imageURL
                    ? matchedUser.imageURL
                    : matchedUser.imageUrl
                    ? matchedUser.imageUrl
                    : matchedUser.url
                    ? matchedUser.url
                    : require(`assets/anonAvatars/${matchedUser.anonAvatar}`);
                  suggestions[index].urlSlug = matchedUser.urlSlug;
                }
              });
            } else {
              suggestions = users;
            }

            setSuggestionsList(suggestions);
          }
        })
        .catch(e => console.log(e))
        .finally(() => {
          setLoadingSuggestions(false);
        });
    };

    const goToProfile = (id: any) => {
      history.push(`/${id}/profile`);
      onClose();
    };

    const followUser = async (item: any) => {
      try {
        await userConnections.followUser(item.id);

        setStatus({
          msg: `Follow request sent to ${item.name}`,
          key: Math.random(),
          variant: "success",
        });

        if (header === "Followers") {
          refreshFollowers();
        } else if (header === "Followings") {
          refreshFollowings();
        }
      } catch (err) {
        setStatus({
          msg: `Sorry, failed to follow ${item.name}`,
          key: Math.random(),
          variant: "error",
        });
      }
    };

    const unfollowUser = async (item: any) => {
      try {
        await userConnections.unfollowUser(item.id);

        setStatus({
          msg: `Stopped to follow ${item.name}`,
          key: Math.random(),
          variant: "success",
        });

        if (header === "Followers") {
          refreshFollowers();
        } else if (header === "Followings") {
          refreshFollowings();
        }
      } catch (err) {
        setStatus({
          msg: `Sorry, failed to stop following ${item.name}`,
          key: Math.random(),
          variant: "error",
        });
      }
    };

    return (
      <Modal className={classes.root} isOpen={open} onClose={onClose} showCloseIcon size="medium">
        <h3>
          {list?.filter(user => (header === "Followers" ? user.isFollower === 2 : user.isFollowing === 2))
            ?.length || 0}{" "}
          {header}
        </h3>

        <LoadingWrapper theme="blue" loading={isLoadingFollows}>
          {!list ||
          list.filter(user => (header === "Followers" ? user.isFollower === 2 : user.isFollowing === 2))
            .length === 0 ? (
            <div>
              {header === "Followers" ? (
                <div>You don't have no followers yet</div>
              ) : (
                <div>Start to follow</div>
              )}
            </div>
          ) : (
            <>
              {/* <Box color="#707582" mb="12px">
                Filter by Interests
              </Box>

              <Box display="flex" alignItems="center" mb={"32px"}>
                {interestsList.map((interest, index) => (
                  <div
                    onClick={() => {
                      if (interestFilters.includes(interest)) {
                        let ins = interestFilters.splice(index, 1);
                        setInterestFilters(ins);
                      } else {
                        let ins = [...interestFilters, interest];
                        setInterestFilters(ins);
                      }
                    }}
                    className={cls(
                      { [classes.filterPillSelected]: interestFilters.includes(interest) },
                      classes.filterPill
                    )}
                    key={index}
                  >
                    {interest}
                  </div>
                ))}
              </Box> */}
              <Box mb={"32px"}>
                <Box color="#000000" fontSize="16px" mb="2">
                  Filter by degrees of closeness
                </Box>
                <GreenSlider
                  min={0}
                  marks
                  step={0.1}
                  max={3}
                  value={closenessDegree}
                  onChange={(event: any, newValue: number | number[]) => {
                    setClosenessDegree(newValue as number[]);
                  }}
                  className={classes.slider}
                  valueLabelDisplay="auto"
                />
                <Box display="flex" justifyContent="space-between" color="#707582" mt={"6px"} fontSize="11px">
                  <Box>0</Box>
                  <Box>3.0</Box>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb="16px">
                <h4>Users</h4>
                {ownUser && <h4>Degree of closeness</h4>}
              </Box>
              <div className={classes.usersList}>
                {usersFilteredList.map((item: any, index: number) => {
                  return (
                    <Box display="flex" mb={2} alignItems="center" justifyContent="space-between" key={index}>
                      <Box
                        alignItems="center"
                        display="flex"
                        style={{ cursor: "pointer" }}
                        onClick={() => goToProfile(item.urlSlug ?? item.id)}
                      >
                        <Avatar
                          url={
                            item.userImageURL && item.userImageURL.length > 0
                              ? item.userImageURL
                              : item.url && item.url.length > 0
                              ? item.url
                              : getRandomAvatarForUserIdWithMemoization(item.id)
                          }
                          size="small"
                        />
                        <Box ml={"14px"}>
                          <Box>{item.name ?? item.firstName ?? "User name"}</Box>
                          <Box mt={"4px"} fontSize="11px" color="#707582">
                            @{item.urlSlug ?? "Username"}
                          </Box>
                        </Box>
                      </Box>

                      {ownUser && (
                        <div
                          style={{ cursor: "pointer" }}
                          onClick={() => handleOpenClosenessDegreeModal(item)}
                        >
                          <GreenText fontSize="14px" bold>
                            {item.closenessDegree && item.closenessDegree !== 0
                              ? item.closenessDegree
                              : ` + Degrees of closeness`}
                          </GreenText>
                        </div>
                      )}
                    </Box>
                  );
                })}
              </div>
            </>
          )}
        </LoadingWrapper>

        <Box mt="40px" mb="18px">
          Users you may want to follow
        </Box>
        <LoadingWrapper theme="blue" loading={loadingSuggestions}>
          {!suggestionsList || suggestionsList.length === 0 ? (
            <div>No suggest users</div>
          ) : (
            <div className={classes.usersList}>
              {suggestionsList.map((item, index) => (
                <Box mb={2} display="flex" alignItems="center" justifyContent="space-between" key={index}>
                  <Box
                    alignItems="center"
                    display="flex"
                    style={{ cursor: "pointer" }}
                    onClick={() => goToProfile(item.urlSlug ?? item.id)}
                  >
                    <Avatar
                      url={
                        item.userImageURL && item.userImageURL.length > 0
                          ? item.userImageURL
                          : item.url && item.url.length > 0
                          ? item.url
                          : getRandomAvatarForUserIdWithMemoization(item.id)
                      }
                      size="small"
                    />
                    <Box ml={"14px"}>
                      <Box>{item.name ?? item.firstName ?? <StyledSkeleton width={120} animation="wave" />}</Box>
                      <Box mt={"4px"} fontSize="11px" color="#707582">
                        @{item.urlSlug ?? "Username"}
                      </Box>
                    </Box>
                  </Box>

                  {ownUser &&
                    (list.find(u => u.id === item.id)?.isFollowing === 2 ? (
                      <button
                        onClick={() => unfollowUser(item)}
                        className={classes.optionsConnectionButtonUnfollow}
                      >
                        Unfollow
                      </button>
                    ) : list.find(u => u.id === item.id)?.isFollowing === 1 ? (
                      <button className={classes.optionsConnectionButtonRequest}>Request sent</button>
                    ) : (
                      <button
                        onClick={() => followUser(item)}
                        className={classes.optionsConnectionButton}
                        style={{ border: "none" }}
                      >
                        + Follow
                      </button>
                    ))}
                </Box>
              ))}
            </div>
          )}
        </LoadingWrapper>

        {status ? <AlertMessage key={status.key} message={status.msg} variant={status.variant} /> : ""}

        <ClosenessDegreeModal
          user={selectedUser}
          header={header}
          handleClose={handleCloseClosenessDegreeModal}
          open={openClosenessDegreeModal}
          refreshFollowings={refreshFollowings}
          refreshFollowers={refreshFollowers}
        />
      </Modal>
    );
  },
  arePropsEqual
);

export default ProfileFollowsModal;
