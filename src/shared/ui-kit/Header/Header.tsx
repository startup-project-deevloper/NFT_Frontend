import React, { useEffect, useState, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";

import {
  Dialog,
  Popper,
  ClickAwayListener,
  Grow,
  Paper,
  MenuList,
  MenuItem,
  Hidden,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";

import { socket } from "components/Login/Auth";
import SignInModal from "components/Login/SignInModal";
import MediaSellingOfferModal from "shared/ui-kit/Modal/Modals/MediaSellingOfferModal";
import { useNotifications } from "shared/contexts/NotificationsContext";
import URL from "shared/functions/getURL";
import { getUser, getUsersInfoList } from "store/selectors/user";
import { setUser, signOut } from "store/actions/User";
import CreateMediaModal from "shared/ui-kit/Modal/Modals/CreateMediaModal";
import CreatePixMediaModal from "components/PriviDigitalArt/modals/CreateMediaModal";
import PodCreateNFTMediaModal from "shared/ui-kit/Modal/Modals/Pod-Create-NFTMedia-Modal/PodCreateNFTMediaModal";
import CreateCommunityModal from "shared/ui-kit/Modal/Modals/CreateCommunity";
import CreateImportSocialTokenModal from "shared/ui-kit/Modal/Modals/Create-social-token/CreateImportSocialTokenModal";
import { capitalize } from "shared/helpers/string";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";
import { getUserAvatar } from "shared/services/user/getUserAvatar";
import { createUserInfo, setUsersInfoList } from "store/actions/UsersInfo";
import CommunityContributionModal from "shared/ui-kit/Modal/Modals/CommunityContributionModal";
import ShareContributionModal from "shared/ui-kit/Modal/Modals/ShareContributionModal";
import { useAuth } from "shared/contexts/AuthContext";
import { useMessages } from "shared/contexts/MessagesContext";
import { _signPayload } from "shared/services/WalletSign";

import { IconMenu } from "./components/Toolbar/IconMenu";
import { IconMessages } from "./components/Toolbar/IconMessages";
import { IconNotifications } from "./components/Toolbar/IconNotifications";
import { IconMessagesWhite } from "./components/Toolbar/IconMessagesWhite";
import { IconNotificationsWhite } from "./components/Toolbar/IconNotificationsWhite";
import { ToolbarButtonWithPopper } from "./components/Toolbar/ToolbarButtonWithPopper";
import { MessageNotifications } from "./components/Message/MessageNotifications";
import { NotificationsPopperContent } from "./components/Notifications/NotificationsPopperContent";
import { PrimaryButton, SecondaryButton } from "../Buttons";
import { headerStyles } from "./Header.styles";

import { ReactComponent as SubStratIcon } from "assets/icons/substrat_card.svg";
import { ReactComponent as PriviIcon } from "assets/icons/privi_wallet_card.svg";
import { ReactComponent as GovernanceIcon } from "assets/icons/governance_card.svg";
import { ReactComponent as DefiIcon } from "assets/icons/defi_card.svg";
import { ReactComponent as FiberManualRecordIcon } from "assets/icons/fiber_manual_record.svg";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import useIPFS from "../../utils-IPFS/useIPFS";
import getPhotoIPFS from "../../functions/getPhotoIPFS";
import { usePageRefreshContext } from "shared/contexts/PageRefreshContext";

enum OpenType {
  Home = "HOME",
  Playlist = "PLAYLIST",
  Album = "ALBUM",
  Artist = "ARTIST",
  Liked = "LIKED",
  Library = "LIBRARY",
  Search = "SEARCH",
  Queue = "QUEUE",
}

const Header = props => {
  const classes = headerStyles();
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down(769));

  const pathName = window.location.href;
  const idUrl = pathName.split("/")[5] ? pathName.split("/")[5] : "" + localStorage.getItem("userId");

  const { setSignedin } = useAuth();
  const history = useHistory();
  const dispatch = useDispatch();
  const userSelector = useSelector(getUser);
  const usersInfoList = useSelector(getUsersInfoList);

  const width = useWindowDimensions().width;

  const {
    unreadNotifications,
    notifications,
    dismissNotification,
    markAllNotificationsAsRead,
    removeNotification,
  } = useNotifications();

  const { unreadMessages } = useMessages();
  const { account } = useWeb3React();

  const [userId, setUserId] = useState<string>("");
  const [ownUser, setOwnUser] = useState<boolean>(idUrl === localStorage.getItem("userId"));
  const [userProfile, setUserProfile] = useState<any>({});
  const [openSignInModal, setOpenSignInModal] = useState<boolean>(false);
  const [openMediaModal, setOpenMediaModal] = useState<boolean>(false);
  const [openPodCreateModal, setOpenPodCreateModal] = useState<boolean>(false);
  const [openCreateCommunityModal, setOpenCreateCommunityModal] = useState<boolean>(false);
  const [openCreateSocialTokenModal, setOpenCreateSocialTokenModal] = useState<boolean>(false);
  const [openCreateContentModal, setOpenCreateContentModal] = useState<boolean>(false);
  const [openNotificationModal, setOpenNotificationModal] = useState<boolean>(false);
  const [openMessagesModal, showMessagesModal] = useState<boolean>(false);
  const [openContributionModal, setOpenContributionModal] = useState(false);
  const [openModalShareContribution, setOpenModalShareContribution] = useState(false);
  const [communityName, setCommunityName] = useState("");
  const [communityAddress, setCommunityAddress] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<any>();
  const [openPriviWalletDialog, setOpenPriviWalletDialog] = useState<boolean>(false);
  const [numberMessages, setNumberMessages] = useState<number>(0);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [arrowEl, setArrowEl] = React.useState<null | HTMLElement>(null);

  const [appAnchorEl, setAppAnchorEl] = React.useState<null | HTMLElement>(null);

  const [hideNotificationsModal, setHideNotificationsModal] = useState<boolean>(false);

  const popperOpen = Boolean(anchorEl);
  const popperId = popperOpen ? "spring-popper" : undefined;

  const appPopperOpen = Boolean(appAnchorEl);

  const [openMobileMenu, setOpenMobileMenu] = React.useState<boolean>(false);
  const anchorMobileMenuRef = React.useRef<HTMLDivElement>(null);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const [imageIPFS, setImageIPFS] = useState<any>(null);

  const { profileAvatarChanged } = usePageRefreshContext();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    getPhotoUser();
  }, [ipfs, userSelector.id, profileAvatarChanged]);

  const getPhotoUser = async () => {
    if (ipfs && userSelector && userSelector.infoImage && userSelector.infoImage.newFileCID) {
      setImageIPFS(await getPhotoIPFS(userSelector.infoImage.newFileCID, downloadWithNonDecryption));
    }
  };

  const handleOpenMobileMenu = (event: React.MouseEvent<EventTarget>) => {
    event.stopPropagation();
    setOpenMobileMenu(true);
  };

  const handleCloseMobileMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorMobileMenuRef.current && anchorMobileMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpenMobileMenu(false);
  };

  const handleListKeyDownMobileMenu = (event: React.KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenMobileMenu(false);
    }
  };

  const handleOpenWalletDialog = () => {
    setOpenPriviWalletDialog(true);
  };
  const handleCloseWalletDialog = () => {
    setOpenPriviWalletDialog(false);
  };
  const handleCreatePopup = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMediaModal = () => {
    setOpenMediaModal(false);
  };

  const handleClosePodCreateModal = () => {
    setOpenPodCreateModal(false);
  };

  const handleCloseCreateCommunityModal = () => {
    setOpenCreateCommunityModal(false);
  };

  const handleCloseSocialTokenModal = () => {
    setOpenCreateSocialTokenModal(false);
  };

  const handleLogout = () => {
    setSignedin(false);
    dispatch(signOut());
    const isNotifiedTestnet = localStorage.getItem(`PixTestNetNotify${account}`);
    localStorage.clear();
    if (isNotifiedTestnet) {
      localStorage.setItem(`PixTestNetNotify${account}`, "true");
    }
    history.push("/");
    window.location.reload();
  };

  const [openModalMediaSellingOffer, setOpenModalMediaSellingOffer] = useState<boolean>(false);

  const handleOpenModalMediaSellingOffer = () => {
    setOpenModalMediaSellingOffer(true);
  };

  const handleCloseModalMediaSellingOffer = () => {
    setOpenModalMediaSellingOffer(false);
  };

  const handleOpenContributionModal = () => {
    setOpenNotificationModal(false);
    setOpenContributionModal(true);
  };

  const handleCloseContributionModal = () => {
    setOpenContributionModal(false);
  };

  const handleOpenModalShareContribution = () => {
    setOpenModalShareContribution(true);
  };

  const handleCloseModalShareContribution = () => {
    setOpenModalShareContribution(false);
  };

  const handleShareCommunity = () => {
    handleCloseContributionModal();
    handleOpenModalShareContribution();
  };

  const viewMore = notification => {
    setOpenNotificationModal(false);
    switch (notification.type) {
      case 113:
        handleOpenModalMediaSellingOffer();
        break;
      case 115:
        history.push(`/communities/${notification.otherItemId}`);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    setUserWithIpfsImage();
    setUserId(userSelector.id);
    setOwnUser(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idUrl, ipfs]);

  const setUserWithIpfsImage = async () => {
    if (ipfs && userSelector && userSelector.infoImage && userSelector.infoImage.newFileCID) {
      userSelector.ipfsImage = await getPhotoIPFS(
        userSelector.infoImage.newFileCID,
        downloadWithNonDecryption
      );
    }

    dispatch(setUser(userSelector));
  };

  useEffect(() => {
    if (userId && userId.length > 0) {
      if (socket) {
        socket.on("user_connect_status", async connectStatus => {
          const users = usersInfoList;
          const index = users.findIndex(u => u.id === connectStatus.userId);
          if (index >= 0) {
            const user = users.find(u => u.id === connectStatus.userId);
            if (user) {
              user.connected = connectStatus.connected;
              const uList = [...usersInfoList.slice(0, index), user, ...usersInfoList.slice(index + 1)];

              for (let usr of uList) {
                if (
                  usr &&
                  usr.infoImage &&
                  usr.infoImage.newFileCID &&
                  (!usr.ipfsImage || usr.ipfsImage === "")
                ) {
                  usr.ipfsImage = await getPhotoIPFS(usr.infoImage.newFileCID, downloadWithNonDecryption);
                } else {
                  usr.ipfsImage = getDefaultAvatar();
                }
              }
              dispatch(setUsersInfoList(uList));
            }
          }
          if (connectStatus.userId === userId) {
            let setterUser: any = { ...userProfile };
            setterUser.connected = connectStatus.connected;
            setUserProfile(setterUser);
          }
        });
      }
    }
  }, [userId, userProfile]);

  useEffect(() => {
    setNumberMessages(unreadMessages);
  }, [unreadMessages]);

  useEffect(() => {
    if (!usersInfoList || (usersInfoList.length === 0 && ipfs)) {
      axios
        .post(`${URL()}/chat/getUsers`)
        .then(response => {
          if (response.data.success) {
            //should be remove user's id from the list ?? so they don't message themselves
            // const allUsers = [...response.data.data].filter(user => user.id !== userSelector.id) ?? [];
            const allUsers = response.data.data;
            const u = [] as any[];
            allUsers.forEach(user => {
              let image = "";
              if (
                user.anon != undefined &&
                user.anon === true &&
                user.anonAvatar &&
                user.anonAvatar.length > 0
              ) {
                image = `${require(`assets/anonAvatars/${user.anonAvatar}`)}`;
              } /* else {
                if (user.hasPhoto && user.url) {
                  image = `${user.url}?${Date.now()}`;
                }
              }*/
              // user.imageUrl = image;
              user.assistances = user.assistances ?? 0;
              user.rate = user.rate ?? 0;

              u.push(
                createUserInfo(
                  user.id,
                  `${user.firstName ? user.firstName : ""} ${user.lastName ? user.lastName : ""}`,
                  user.address ?? "",
                  user.mnemonic ?? "",
                  image,
                  user.level ?? 1,
                  user.numFollowers || 0,
                  user.numFollowings || 0,
                  user.creds.length ?? 0,
                  user.badges ?? [],
                  user.urlSlug ??
                    `${user.firstName ? user.firstName : ""}${user.lastName ? user.lastName : ""}`,
                  user.twitter ?? "",
                  user.anon ?? false,
                  user.verified ?? false,
                  user.MediaLikes?.length ?? 0,
                  user.profileViews ?? 0,
                  user.awards?.length ?? 0,
                  user.trustScore ?? 0,
                  user.endorsementScore ?? 0,
                  user.bio ?? "",
                  user.isExternalUser ?? false,
                  user.connected ?? false,
                  user.rate ?? 0,
                  user.imageUrl ?? "",
                  user.assistances ?? 0,
                  user.anonAvatar ?? "",
                  user.backgroundURL ?? "",
                  user.hasPhoto ?? false,
                  user.myMediasCount ?? 0,
                  user.url ?? "",
                  user.wallets ?? [],
                  user.email ?? "",
                  user.infoImage ?? {},
                  false,
                  user.ipfsImage ?? ""
                )
              );
            });
            allUsers.sort((user1, user2) => {
              const name1 = user1.firstName || user1.urlSlug;
              const name2 = user2.firstName || user2.urlSlug;
              if (name1.startsWith("0x") && name2.startsWith("0x")) return name1.localeCompare(name2);
              if (name1.startsWith("0x")) return 1;
              if (name2.startsWith("0x")) return -1;
              return capitalize(name1).localeCompare(capitalize(name2));
            });
            // setUsers(allUsers);
            // setFilteredUsers(allUsers);
            const dispatchUsers = async () => {
              for (let usr of u) {
                if (usr && usr.infoImage && usr.infoImage.newFileCID) {
                  usr.ipfsImage = await getPhotoIPFS(usr.infoImage.newFileCID, downloadWithNonDecryption);
                } else {
                  usr.ipfsImage = getDefaultAvatar();
                }
              }
              await dispatch(setUsersInfoList(u));
            };

            dispatchUsers();
          }
        })
        .catch(error => {
          console.log(error);
        });
    } else {
      const allUsers = usersInfoList.filter(user => user.id !== userSelector.id) ?? [];
      allUsers.forEach(user => {
        let image = "";
        if (user.anon != undefined && user.anon === true && user.anonAvatar && user.anonAvatar.length > 0) {
          image = `${require(`assets/anonAvatars/${user.anonAvatar}`)}`;
        } else {
          if (user.hasPhoto && user.url) {
            image = `${user.url}?${Date.now()}`;
          }
        }
        user.imageUrl = image;
        user.assistances = user.assistances ?? 0;
        user.rate = user.rate ?? 0;
      });
      // setFilteredUsers(allUsers);
    }
  }, [usersInfoList, userSelector.id, ipfs]);

  useEffect(() => {
    setIsHideHeader(true);

    const pathPrefixList = pathName.split("/");
    let pathPrefix = pathPrefixList.length > 4 ? pathPrefixList[4] : "zoo";

    setIsTransparent(false);
    setIsPriviData(false);
    setIsPriviMusicDao(false);
    setIsWallet(false);
    setIsZoo(false);
    setIsPriviPix(true);

    let className = "privi-app-header pix";

    setAppHeaderBackgroundColor(className);
  }, [pathName, width]);

  useEffect(() => {
    if (account) handleWallet(account);
  }, [account]);

  const handleWallet = async (address: string) => {
    const userId = localStorage.getItem("userId");

    if (address) {
      axios
        .post(`${URL()}/wallet/registerUserEthAccount`, {
          walletType: "Metamask",
          walletName: "Metamask",
          userId,
          address,
          walletStatus: true,
        })
        .then(res => {
          //console.log("RES - ", res);
          if (res.data.success) {
            //console.log("===========success");
          }
        })
        .catch(err => {
          console.error("handleConnect getUserRegisteredEthAccount failed", err);
        });
    }
  };

  const [isHideHeader, setIsHideHeader] = useState<boolean>(false);
  const [isTransparent, setIsTransparent] = useState<boolean>(false);
  const [isPriviData, setIsPriviData] = useState<boolean>(false);
  const [isPriviMusicDao, setIsPriviMusicDao] = useState<boolean>(false);
  const [isWallet, setIsWallet] = useState<boolean>(false);
  const [isZoo, setIsZoo] = useState<boolean>(false);
  const [isPriviPix, setIsPriviPix] = useState<boolean>(false);

  const [appHeaderBackgroundColor, setAppHeaderBackgroundColor] = useState<string>("privi-app-header");

  const getAppsPopover = () => {
    return (
      <Popper
        open={appPopperOpen}
        anchorEl={appAnchorEl}
        placement="bottom-end"
        style={{ zIndex: 1000 }}
        modifiers={{
          offset: {
            enabled: true,
            offset: "20, 0",
          },
        }}
      >
        <ClickAwayListener
          onClickAway={() => {
            setAppAnchorEl(null);
          }}
        >
          <div className={classes.appPopover}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #18181822",
                paddingBottom: "20px",
              }}
            >
              <div>My apps</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <PrimaryButton size="small" onClick={() => {}}>
                  See All
                </PrimaryButton>
                <SecondaryButton size="small" onClick={() => {}}>
                  Edit
                </SecondaryButton>
              </div>
            </div>
            <div style={{ marginTop: "16px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  className="itemBox"
                  onClick={() => {
                    setAppAnchorEl(null);
                    history.push(`/zoo/music`);
                  }}
                >
                  <div style={{ marginRight: "16px" }}>
                    <SubStratIcon style={{ color: "red", fill: "red" }} />
                  </div>
                  <div>
                    <div>Community DAO</div>
                    <div>Few words of app description. an optional content. </div>
                  </div>
                </div>
                <div
                  className="itemBox"
                  onClick={() => {
                    setAppAnchorEl(null);
                    history.push(`/zoo/music`);
                  }}
                >
                  <div style={{ marginRight: "16px" }}>
                    <PriviIcon style={{ color: "red", fill: "red" }} />
                  </div>
                  <div>
                    <div>Privi Wallet</div>
                    <div>Few words of app description. an optional content. </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <div
                  className="itemBox"
                  onClick={() => {
                    setAppAnchorEl(null);
                    history.push(`/zoo/music`);
                  }}
                >
                  <div style={{ marginRight: "16px" }}>
                    <GovernanceIcon style={{ color: "red", fill: "red" }} />
                  </div>
                  <div>
                    <div>Governance</div>
                    <div>Few words of app description. an optional content. </div>
                  </div>
                </div>
                <div
                  className="itemBox"
                  onClick={() => {
                    setAppAnchorEl(null);
                    history.push(`/zoo/music`);
                  }}
                >
                  <div style={{ marginRight: "16px" }}>
                    <DefiIcon style={{ color: "red", fill: "red" }} />
                  </div>
                  <div>
                    <div>Community</div>
                    <div>Few words of app description. an optional content. </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SecondaryButton size="medium" onClick={() => {}} style={{ marginTop: "16px" }}>
                Discover More Apps
              </SecondaryButton>
            </div>
          </div>
        </ClickAwayListener>
      </Popper>
    );
  };

  const isSignedIn = () => {
    return !!localStorage.getItem("token");
  };

  const handleProfile = e => {
    handleCloseMobileMenu(e);
    history.push(`/${userSelector.id}/profile`);
    setAnchorEl(null);
  };

  const handleSearch = e => {
    handleCloseMobileMenu(e);
    history.push(`/explorer`);
  };

  const handleMessage = e => {
    handleCloseMobileMenu(e);
    history.push(`/${userSelector.urlSlug}/messages`);
  };

  const userAvatar = useMemo(() => {
    return getUserAvatar({
      id: userSelector.id,
      anon: userSelector.anon,
      hasPhoto: userSelector.hasPhoto,
      anonAvatar: userSelector.anonAvatar,
      url: userSelector.url,
    });
  }, [userSelector]);

  const mobileMenu = (
    <>
      <div className={classes.iconMenu} ref={anchorMobileMenuRef} onClick={handleOpenMobileMenu}>
        <IconMenu />
      </div>
      <Popper
        open={openMobileMenu}
        anchorEl={anchorMobileMenuRef.current}
        transition
        disablePortal={false}
        placement="bottom"
        style={{ position: "inherit", zIndex: 9999 }}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps}>
            <Paper className={classes.mobilePopup}>
              <ClickAwayListener onClickAway={handleCloseMobileMenu}>
                <MenuList
                  autoFocusItem={openMobileMenu}
                  id="header-right-menu-list-grow"
                  onKeyDown={handleListKeyDownMobileMenu}
                >
                  <MenuItem onClick={handleProfile}>
                    <div className="avatar-container">
                      <div
                        className="avatar"
                        style={{
                          // backgroundImage: userSelector.id
                          //   ? `url(${getUserAvatar({
                          //       id: userSelector.id,
                          //       anon: userSelector.anon,
                          //       hasPhoto: userSelector.hasPhoto,
                          //       anonAvatar: userSelector.anonAvatar,
                          //       url: userSelector.url,
                          //     })})`
                          //   : "none",
                          backgroundImage: imageIPFS ? `url(${imageIPFS})` : `url(${getDefaultAvatar()})`,
                          cursor: ownUser ? "pointer" : "auto",
                          backgroundRepeat: "no-repeat",
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      />
                    </div>
                    Profile
                  </MenuItem>
                  <PrimaryButton
                    className={classes.pixApp}
                    size="medium"
                    isRounded
                    onClick={e => {
                      handleCloseMobileMenu(e);
                      history.push("/");
                    }}
                  >
                    Pix
                    <img src={require("assets/logos/privi_pix_simple.png")} alt="icon" />
                  </PrimaryButton>
                  <MenuItem onClick={handleSearch}>
                    <svg
                      width="19"
                      height="19"
                      viewBox="0 0 19 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M17.6464 18.3536C17.8417 18.5488 18.1583 18.5488 18.3536 18.3536C18.5488 18.1583 18.5488 17.8417 18.3536 17.6464L17.6464 18.3536ZM15.5 8.5C15.5 12.366 12.366 15.5 8.5 15.5V16.5C12.9183 16.5 16.5 12.9183 16.5 8.5H15.5ZM8.5 15.5C4.63401 15.5 1.5 12.366 1.5 8.5H0.5C0.5 12.9183 4.08172 16.5 8.5 16.5V15.5ZM1.5 8.5C1.5 4.63401 4.63401 1.5 8.5 1.5V0.5C4.08172 0.5 0.5 4.08172 0.5 8.5H1.5ZM8.5 1.5C12.366 1.5 15.5 4.63401 15.5 8.5H16.5C16.5 4.08172 12.9183 0.5 8.5 0.5V1.5ZM18.3536 17.6464L14.166 13.4589L13.4589 14.166L17.6464 18.3536L18.3536 17.6464Z"
                        fill="#767676"
                      />
                    </svg>
                    Search
                  </MenuItem>
                  <MenuItem onClick={handleMessage}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.00003 9.50003C0.996587 10.8199 1.30496 12.1219 1.90003 13.3C2.6056 14.7118 3.69028 15.8992 5.03258 16.7293C6.37488 17.5594 7.92179 17.9994 9.50003 18C10.8199 18.0035 12.1219 17.6951 13.3 17.1L19 19L17.1 13.3C17.6951 12.1219 18.0035 10.8199 18 9.50003C17.9994 7.92179 17.5594 6.37488 16.7293 5.03258C15.8992 3.69028 14.7118 2.6056 13.3 1.90003C12.1219 1.30496 10.8199 0.996587 9.50003 1.00003H9.00003C6.91568 1.11502 4.94699 1.99479 3.47089 3.47089C1.99479 4.94699 1.11502 6.91568 1.00003 9.00003V9.50003Z"
                        stroke="#767676"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Messages
                  </MenuItem>
                  <MenuItem>
                    {!isZoo && (
                      <ToolbarButtonWithPopper
                        theme="pop"
                        tooltip="Notifications"
                        icon={
                          !props.openTab ||
                          !pathName.toLowerCase().includes("privi-music") ||
                          !pathName.toLowerCase().includes("pods") ||
                          (props.openTab &&
                            (props.openTab.type === OpenType.Search || props.openTab.type === OpenType.Home))
                            ? IconNotifications
                            : IconNotificationsWhite
                        }
                        badge={unreadNotifications > 0 ? unreadNotifications.toString() : undefined}
                        onIconClick={markAllNotificationsAsRead}
                        openToolbar={openNotificationModal}
                        handleOpenToolbar={setOpenNotificationModal}
                        hidden={hideNotificationsModal}
                        label="Notifications"
                      >
                        <NotificationsPopperContent
                          theme={isTransparent ? "dark" : "light"}
                          notifications={notifications}
                          onDismissNotification={dismissNotification}
                          removeNotification={removeNotification}
                          onRefreshAllProfile={() => null}
                          viewMore={value => viewMore(value)}
                          setSelectedNotification={setSelectedNotification}
                          handleShowContributionModal={handleOpenContributionModal}
                          handleClosePopper={() => {
                            setOpenNotificationModal(false);
                            setHideNotificationsModal(false);
                          }}
                          handleHidePopper={() => {
                            setHideNotificationsModal(true);
                          }}
                        />
                      </ToolbarButtonWithPopper>
                    )}
                  </MenuItem>
                  {/* <MenuItem>
                    <PrimaryButton
                      size="medium"
                      onClick={() => { }}
                      style={{
                        backgroundColor: "#DDFF57",
                        padding: "8px 24px",
                        display: "flex",
                        alignItems: "center",
                        color: "#431AB7",
                        fontSize: "14px",
                        borderRadius: "4px",
                      }}
                    >
                      <img
                        src={require("assets/icons/polygon_scan.png")}
                        style={{
                          width: "24px",
                          height: "24px",
                          marginRight: "16px",
                        }}
                      />
                      Polygon bridge
                    </PrimaryButton>
                  </MenuItem> */}
                  <MenuItem>
                    <PrimaryButton
                      className={classes.createPix}
                      size="medium"
                      isRounded
                      onClick={e => {
                        setOpenCreateContentModal(true);
                        handleCloseMobileMenu(e);
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                      >
                        <path
                          d="M6 1V11M1 6L11 6"
                          stroke="#DDFF57"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>{" "}
                      Create Content
                    </PrimaryButton>
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );

  return (
    <div
      className={classes.header}
      style={{
        borderBottom: "1px solid #E0E0E0",
        background: isPriviPix && width < 768 ? "#9eacf2" : "white",
      }}
    >
      <div
        className={isTransparent ? "transparent" : isHideHeader ? appHeaderBackgroundColor : ""}
        style={{
          height: "72px",
        }}
      >
        <div className="header-left">
          <div className={classes.mobileMenu}>{mobileMenu}</div>
          {isHideHeader ? (
            pathName.includes("/zoo/page") ? (
              <div className={classes.pixLogoZoo}>
                <img
                  onClick={() => {
                    history.push("/");
                  }}
                  src={require("assets/logos/privi_color_log.png")}
                  alt="privi"
                />
              </div>
            ) : (
              <div className={classes.pixLogo}>
                <img
                  onClick={() => {
                    history.push("/");
                  }}
                  src={require("assets/logos/privi_pix_alpha.svg")}
                  alt="privi"
                />
              </div>
            )
          ) : (
            <>
              <div className="header-title">PRIVI</div>
              <img className="header-logo" src={require(`assets/logos/PRIVILOGO.png`)} alt="privi logo" />
            </>
          )}
        </div>
        <div className="header-right">
          {isSignedIn() ? (
            <>
              <div className="header-icons">
                {!isZoo &&
                  (isTablet ? (
                    <div
                      className={classes.iconMenu}
                      onClick={() => {
                        history.push(`/${userSelector.urlSlug}/messages`);
                      }}
                    >
                      <IconMessagesWhite />
                    </div>
                  ) : (
                    <ToolbarButtonWithPopper
                      theme={isTransparent ? "dark" : "light"}
                      tooltip="Messages"
                      icon={isTablet ? IconMessagesWhite : IconMessages}
                      badge={numberMessages > 0 ? numberMessages.toString() : undefined}
                      openToolbar={openMessagesModal}
                      handleOpenToolbar={showMessagesModal}
                    >
                      <MessageNotifications handleClosePopper={() => showMessagesModal(false)} />
                    </ToolbarButtonWithPopper>
                  ))}
                {!isZoo && (
                  <ToolbarButtonWithPopper
                    theme={isTransparent ? "dark" : "light"}
                    tooltip="Notifications"
                    icon={isTablet ? IconNotificationsWhite : IconNotifications}
                    badge={unreadNotifications > 0 ? unreadNotifications.toString() : undefined}
                    onIconClick={markAllNotificationsAsRead}
                    openToolbar={openNotificationModal}
                    handleOpenToolbar={setOpenNotificationModal}
                    hidden={hideNotificationsModal}
                  >
                    <NotificationsPopperContent
                      theme={isTransparent ? "dark" : "light"}
                      notifications={notifications}
                      onDismissNotification={dismissNotification}
                      removeNotification={removeNotification}
                      onRefreshAllProfile={() => null}
                      viewMore={value => viewMore(value)}
                      setSelectedNotification={setSelectedNotification}
                      handleShowContributionModal={handleOpenContributionModal}
                      handleClosePopper={() => {
                        setOpenNotificationModal(false);
                        setHideNotificationsModal(false);
                      }}
                      handleHidePopper={() => {
                        setHideNotificationsModal(true);
                      }}
                    />
                  </ToolbarButtonWithPopper>
                )}
              </div>
              <Hidden mdDown={width <= 768 && isPriviPix}>
                {isPriviPix && account && (
                  <Hidden smDown>
                    <SecondaryButton size="medium" className={classes.accountInfo}>
                      <span>
                        <FiberManualRecordIcon />
                      </span>
                      <label>
                        {account.slice(0, 7)}...{account.slice(account.length - 7)}
                      </label>
                    </SecondaryButton>
                  </Hidden>
                )}
                <div className="avatar-container">
                  <div
                    id="header-popup-wallet"
                    aria-describedby={popperId}
                    onClick={handleCreatePopup}
                    className="avatar"
                    style={{
                      // backgroundImage: userSelector.id ? `url(${userAvatar})` : "none",
                      backgroundImage: imageIPFS ? `url(${imageIPFS})` : `url(${getDefaultAvatar()})`,
                      cursor: ownUser ? "pointer" : "auto",
                      backgroundRepeat: "no-repeat",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  />
                </div>
              </Hidden>
            </>
          ) : // <div className="header-buttons">
          //   <button className={classes.header_secondary_button} onClick={handleOpenWalletDialog}>
          //     Get Privi Wallet
          //   </button>
          //   <button onClick={() => setOpenSignInModal(true)}>Sign In</button>
          // </div>
          null}
        </div>
        <SignInModal open={openSignInModal} handleClose={() => setOpenSignInModal(false)} />
        <Popper
          id={popperId}
          open={popperOpen}
          anchorEl={anchorEl}
          transition
          modifiers={{
            arrow: {
              enabled: true,
              element: arrowEl,
            },
            offset: {
              enabled: true,
              offset: "20, 0",
            },
          }}
          placement="bottom-end"
          style={{ zIndex: 1000 }}
        >
          <span className={classes.header_popup_arrow} ref={setArrowEl} />
          <ClickAwayListener
            onClickAway={() => {
              setAnchorEl(null);
            }}
          >
            <div className={classes.header_popup_back}>
              {anchorEl?.id === "header-popup-create" ? (
                <>
                  <div className={classes.header_popup_back_item}>Light Content</div>
                  <div
                    className={classes.header_popup_back_item}
                    onClick={() => {
                      setOpenMediaModal(true);
                      setAnchorEl(null);
                    }}
                  >
                    Media
                  </div>
                  <div
                    className={classes.header_popup_back_item}
                    onClick={() => {
                      setOpenPodCreateModal(true);
                      setAnchorEl(null);
                    }}
                  >
                    Pod
                  </div>
                  <div
                    className={classes.header_popup_back_item}
                    onClick={() => {
                      setOpenCreateCommunityModal(true);
                      setAnchorEl(null);
                    }}
                  >
                    Community
                  </div>
                  <div
                    className={classes.header_popup_back_item}
                    onClick={() => {
                      setOpenCreateSocialTokenModal(true);
                      setAnchorEl(null);
                    }}
                  >
                    Token
                  </div>
                </>
              ) : anchorEl?.id === "header-popup-wallet" ? (
                <>
                  <div className={classes.header_popup_back_item} onClick={handleProfile}>
                    Profile
                  </div>
                  <div
                    className={classes.header_popup_back_item}
                    onClick={() => {
                      handleLogout();
                      setAnchorEl(null);
                    }}
                  >
                    Log Out
                  </div>
                </>
              ) : anchorEl?.id === "header-popup-contact" ? (
                <>
                  <div
                    className={classes.header_popup_back_item}
                    onClick={() => {
                      history.push("/communities");
                      setAnchorEl(null);
                    }}
                  >
                    Communities
                  </div>
                  <div
                    className={classes.header_popup_back_item}
                    onClick={() => {
                      history.push("/collab");
                      setAnchorEl(null);
                    }}
                  >
                    Collabs
                  </div>
                </>
              ) : null}
            </div>
          </ClickAwayListener>
        </Popper>
        {isSignedIn() && openMediaModal && (
          <CreateMediaModal open={openMediaModal} handleClose={handleCloseMediaModal} />
        )}
        {isSignedIn() && openPodCreateModal && (
          <PodCreateNFTMediaModal
            onClose={handleClosePodCreateModal}
            type={"Digital NFT"}
            open={openPodCreateModal}
          />
        )}
        {isSignedIn() && openCreateCommunityModal && (
          <CreateCommunityModal
            open={openCreateCommunityModal}
            handleClose={handleCloseCreateCommunityModal}
          />
        )}
        {isSignedIn() && openCreateSocialTokenModal && (
          <CreateImportSocialTokenModal
            user={userSelector}
            handleClose={handleCloseSocialTokenModal}
            type={"FT"}
            handleRefresh={() => {}}
            open={openCreateSocialTokenModal}
          />
        )}
        {isSignedIn() && openContributionModal && (
          <>
            <Dialog
              className="modalCommunityContribution"
              open={openContributionModal}
              onClose={handleCloseContributionModal}
              fullWidth={true}
              maxWidth={"md"}
            >
              <CommunityContributionModal
                handleClose={handleCloseContributionModal}
                communityId={selectedNotification?.otherItemId}
                communityName={selectedNotification?.pod}
                token={selectedNotification?.token}
                amount={selectedNotification?.amount}
                shareOnCommunity={handleShareCommunity}
                userId={selectedNotification?.itemId}
              />
            </Dialog>
            <Dialog
              className="modalShareContribution"
              open={openModalShareContribution}
              onClose={handleOpenModalShareContribution}
              fullWidth={true}
              maxWidth={"md"}
            >
              <ShareContributionModal
                handleClose={handleCloseModalShareContribution}
                communityId={communityAddress}
                communityName={communityName}
              />
            </Dialog>
          </>
        )}
        <MediaSellingOfferModal
          open={openModalMediaSellingOffer}
          handleClose={handleCloseModalMediaSellingOffer}
          selectedNotification={selectedNotification}
        />
      </div>
      {isSignedIn() && (
        <CreatePixMediaModal
          open={openCreateContentModal}
          handleClose={() => setOpenCreateContentModal(false)}
          handleRefresh={props.handleRefresh}
        />
      )}
    </div>
  );
};

export default Header;
