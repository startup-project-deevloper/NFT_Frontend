import React, { useEffect, useRef, useState } from "react";
import { Avatar, Modal } from "shared/ui-kit";
import styles from "./index.module.css";
import Moment from "react-moment";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import { useShareMedia } from "shared/contexts/ShareMediaContext";
import Axios from "axios";
import SvgIcon from "@material-ui/core/SvgIcon";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "store/reducers/Reducer";
import { withStyles } from "@material-ui/styles";
import { ClickAwayListener, Grow, MenuItem, Popper, MenuList, Paper } from "@material-ui/core";
import { ReactComponent as ShareAltSolid } from "assets/icons/share.svg";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import { setSelectedUser } from "store/actions/SelectedUser";
import { useHistory } from "react-router-dom";
import { GreenText } from "components/PriviSocial/index.styles";
import MorePicturesModal from "./MorePicturesModal";
import DiscordVideoFullScreen from "shared/ui-kit/Page-components/Discord/DiscordVideoFullScreen/DiscordVideoFullScreen";
import ReactPlayer from "react-player";
import { getRandomAvatarForUserIdWithMemoization, getUserAvatar } from "shared/services/user/getUserAvatar";
import getPhotoIPFS from "../../../../../../../shared/functions/getPhotoIPFS";
import useIPFS from "../../../../../../../shared/utils-IPFS/useIPFS";

const chatGreyIcon = require("assets/icons/message_gray.png");
const CustomMenuItem = withStyles({
  root: {
    fontSize: "14px",
    fontFamily: "Agrandir",
  },
})(MenuItem);

export default function WallItemModal({ item, open, onClose, comments, setComments, creatorImage, imageWallIPFS, videoWallIPFS }) {

  if (item)
    return (
      <Modal isOpen={open} theme="light" size="medium" showCloseIcon onClose={onClose}>
        <WallPostModalContent
          item={item}
          comments={comments}
          setComments={setComments}
          creatorImage={creatorImage}
          imageWallIPFS={imageWallIPFS}
          videoWallIPFS={videoWallIPFS}
        />
      </Modal>
    );
  else return null;
}

const ResponseWallPost = ({ response }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  return (
    <Box display="flex" alignItems="center" className={styles.responseContainer}>
      <div className={styles.userCardImageWallPost}>
        <div
          className={styles.authorPhotoWallPost}
          style={{
            backgroundImage: response && response.url ? `url(${response.url})` : "none",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
            cursor: "pointer",
          }}
          onClick={() => {
            history.push(`/${response.userId}/profile`);
            dispatch(setSelectedUser(response.userId));
          }}
        />
        <Box ml="8px" className={styles.commentUserInfo}>
          <Box fontSize="18px" fontWeight={800}>
            {response.userName}
          </Box>
          <GreenText fontSize="12px" bold className={styles.userUrlSlug}>
            @{response?.urlSlug}
          </GreenText>
        </Box>
      </div>

      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <div className={styles.response}>{response.response}</div>
        <Moment fromNow>{response.date}</Moment>
      </Box>
    </Box>
  );
};

export const WallPostModalContent = ({
  item,
  onlyDisplay,
  comments,
  setComments,
  creatorImage,
  imageWallIPFS,
  videoWallIPFS
}: {
  item: any;
  onlyDisplay?: boolean;
  comments: any[];
  setComments: any;
  creatorImage: any;
  imageWallIPFS: any;
  videoWallIPFS: any;
}) => {
  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const history = useHistory();

  const { shareMediaToSocial } = useShareMedia();

  const [isListed, setIsListed] = useState(false);

  const [response, setResponse] = useState("");
  const [responseLoader, setResponseLoader] = useState(false);

  const [status, setStatus] = useState<any>("");
  const [openShareMenu, setOpenShareMenu] = useState(false);
  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);

  const [openMorePicturesModal, setOpenMorePicturesModal] = useState<boolean>(false);
  const handleOpenMorePicturesModal = () => {
    setOpenMorePicturesModal(true);
  };
  const handleCloseMorePicturesModal = () => {
    setOpenMorePicturesModal(false);
  };

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    if (!onlyDisplay) {
      if (item.Catalog) {
        if (item.Catalog.some(listItem => listItem.userId === userSelector.id)) {
          setIsListed(true);
        }
      } else {
        setIsListed(false);
      }
    }
  }, [item]);

  const handleList = e => {
    e.stopPropagation();
    e.preventDefault();

    const itemCopy = { ...item };
    itemCopy.userAddress = userSelector.id;

    let path = "/user/wall/catalog";
    Axios.post(`${URL()}` + path, itemCopy)
      .then(response => {
        if (response.data.success) {
          setIsListed(!isListed);
        }
      })
      .catch(error => {
        console.log(error);
      });
  };

  const makeResponse = () => {
    if (response) {
      let body = {
        blogPostId: item.id,
        userId: userSelector.id,
        userName: userSelector.firstName,
        response: response,
      };
      setResponseLoader(true);
      Axios.post(`${URL()}/user/wall/makeResponse`, body)
        .then(response => {
          if (response.data.success) {
            let responses: any[] = [...response.data.data];
            let r = [] as any;

            responses.forEach(async response => {
              let slug = response.userName;
              let image = "";

              let thisUser = users.find(u => u.id === response.userId);
              console.log('resp', response, thisUser);

              if (thisUser) {
                slug = thisUser.urlSlug;
                image = await getReturnUserPhoto(thisUser);
              }

              r.push({ ...response, urlSlug: slug, url: image });
            });

            setComments && setComments(r);
            setResponse("");
            setResponseLoader(false);
          } else {
            setResponseLoader(false);
            setStatus({
              msg: "Error making request",
              key: Math.random(),
              variant: "error",
            });
          }
        })
        .catch(error => {
          console.log(error);
          setResponseLoader(false);
          setStatus({
            msg: "Error making request",
            key: Math.random(),
            variant: "error",
          });
        });
    }
  };

  const getReturnUserPhoto = async (userFound: any) => {
    if (userFound && userFound.infoImage && userFound.infoImage.newFileCID) {
      let imageUrl = await getPhotoIPFS(userFound.infoImage.newFileCID, downloadWithNonDecryption);
      return(imageUrl);
    } else {
      return("");
    }
  }
  const handleKeyDown = event => {
    if (event.key === "Enter") {
      makeResponse();
    }
  };

  const handleToggleShareMenu = e => {
    e.stopPropagation();
    e.preventDefault();

    setOpenShareMenu(prevShareMenuOpen => !prevShareMenuOpen);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorShareMenuRef.current && anchorShareMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenShareMenu(false);
  };

  const handleOpenShareModal = () => {
    shareMediaToSocial(item.urlSlug, "userWall", "SOCIAL_APP");
    setOpenShareMenu(false);
  };

  function handleListKeyDownShareMenu(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenShareMenu(false);
    }
  }

  const [openModalDiscordVideoFullScreen, setOpenModalDiscordVideoFullScreen] = useState<boolean>(false);
  const handleOpenModalDiscordVideoFullScreen = () => {
    setOpenModalDiscordVideoFullScreen(true);
  };
  const handleCloseModalDiscordVideoFullScreen = () => {
    setOpenModalDiscordVideoFullScreen(false);
  };

  return (
    <>
      <Moment className={styles.date} fromNow>
        {!onlyDisplay ? item?.createdAt : new Date()}
      </Moment>
      {(imageWallIPFS && (
        <Box className={styles.postImages} mt="24px">
          {imageWallIPFS && imageWallIPFS !== "" && (
            <div
              className={styles.photoPost}
              style={{
                backgroundImage: `url(${imageWallIPFS})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
                backgroundPosition: "center",
                borderRadius:
                  item.descriptionImages && item.descriptionImages.length > 0 ? `67px 0px 0px 67px` : "67px",
              }}
            />
          )}
          {item.descriptionImages && item.descriptionImages.length > 0 && (
            <Box
              className={styles.postDescriptionImages}
              style={{
                marginLeft: imageWallIPFS && imageWallIPFS !== "" ? "4px" : 0,
                flexDirection: imageWallIPFS && imageWallIPFS !== "" ? "column" : "row",
              }}
              width={imageWallIPFS && imageWallIPFS !== "" ? "50%" : "100%"}
            >
              {item.descriptionImages &&
                item.descriptionImages.length > 0 &&
                item.descriptionImages
                  .filter((im, ind) => ind < 2)
                  .map((image, index) => (
                    <div
                      className={styles.photoPost}
                      style={{
                        width: imageWallIPFS && imageWallIPFS !== "" ? "100%" : "50%",
                        backgroundImage: image
                          ? `url(${URL()}/user/wall/getDescriptionPostPhoto/${image})`
                          : "none",
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        marginTop: imageWallIPFS && imageWallIPFS !== "" && index === 1 ? "4px" : 0,
                        marginLeft: !imageWallIPFS && index === 1 ? "4px" : 0,
                        height: imageWallIPFS && imageWallIPFS !== "" ? "50%" : "100%",
                        backgroundPosition: "center",
                        borderRadius:
                          index === 0
                            ? imageWallIPFS && imageWallIPFS !== ""
                              ? item.descriptionImages.length > 1
                                ? `0px 67px 0px 0px`
                                : `0px 67px 67px 0px`
                              : item.descriptionImages.length > 1
                              ? `67px 0px 0px 67px`
                              : `67px 67px 67px 67px`
                            : imageWallIPFS && imageWallIPFS !== ""
                            ? "0px 0px 67px 0px"
                            : `0px 67px 67px 0px`,
                      }}
                    />
                  ))}
            </Box>
          )}

          {item.descriptionImages && item.descriptionImages.length > 2 && (
            <div
              className={styles.moreImages}
              style={{
                marginTop: imageWallIPFS && imageWallIPFS !== "" ? "4px" : 0,
                marginLeft: !imageWallIPFS ? "4px" : 0,
                borderRadius: imageWallIPFS && imageWallIPFS !== "" ? "0px 0px 67px 0px" : `0px 67px 67px 0px`,
                height: imageWallIPFS && imageWallIPFS !== "" ? "50%" : "100%",
              }}
              onClick={handleOpenMorePicturesModal}
            >
              +{item.descriptionImages.length - 2}
            </div>
          )}
        </Box>
      ))}

      {videoWallIPFS ? (
        <Box display="flex" justifyContent="center" mt={3} mb={3}>
          <ReactPlayer
            onClick={() => {
              handleOpenModalDiscordVideoFullScreen();
            }}
            url={videoWallIPFS ? videoWallIPFS : null}
            className={styles.reactPlayer}
            progressInterval={200}
          />
          <Modal
            size="small"
            className={styles.reactPlayerModal}
            isOpen={openModalDiscordVideoFullScreen}
            onClose={handleCloseModalDiscordVideoFullScreen}
            showCloseIcon
          >
            <DiscordVideoFullScreen onCloseModal={handleCloseModalDiscordVideoFullScreen}
                                    url={videoWallIPFS ? videoWallIPFS : ""} />
          </Modal>
        </Box>
      ) : null}

      <Box className={styles.userPane} mb={"48px"}>
        <Box className={styles.userInfo} onClick={() => history.push(`/${item.createdBy}/profile`)}>
          <Avatar
            url={
              creatorImage ? creatorImage : "none"
            }
            size={"large"}
          />
          <Box ml={"36px"}>
            <Box fontSize="22px" fontWeight={800}>
              {users.find(u => u.id === item?.createdBy)?.name ||
                users.find(u => u.id === item?.createdBy)?.urlSlug}
            </Box>
            <Box className={styles.userDetail}>
              <Box display="flex" alignItems="center">
                <GreenText fontSize="14px">
                  @{users.find(u => u.id === item?.createdBy)?.urlSlug ?? "Username"}
                </GreenText>
                {users.find(u => u.id === item?.createdBy)?.verified && (
                  <img
                    src={require("assets/icons/verified_gray.png")}
                    alt="verified"
                    width="16.5px"
                    height="16.5px"
                    style={{ marginLeft: "4.5px" }}
                  />
                )}
              </Box>
              <div className={styles.levelLabel}>{`level ${
                users.find(u => u.id === item?.createdBy)?.level ?? 1
              }`}</div>
            </Box>
          </Box>
        </Box>
        {item.hashtags && item.hashtags.length > 0 && (
          <Box display="flex" alignItems="center" flexWrap="wrap">
            {item.hashtags.map((hashtag, i) => {
              return (
                <div key={i} className={styles.hashtag}>
                  {hashtag}
                </div>
              );
            })}
          </Box>
        )}
      </Box>

      <Box mb="48px">
        <h3 className={styles.title}>{item.name}</h3>
        {item.textShort && <p className={styles.textShort}>{item.textShort}</p>}
        {item.descriptionArray && (
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html: typeof item.descriptionArray === "string" ? item.descriptionArray : item.description,
            }}
          />
        )}
      </Box>

      <Box mb="48px" display="flex" alignItems="center" justifyContent="space-between">
        {comments && comments.length ? (
          <div className={styles.numResponsesWallPost}>
            <img src={chatGreyIcon} alt={"chat bubble"} />
            {comments.length ?? 0} comments
          </div>
        ) : (
          <div />
        )}

        {!onlyDisplay ? (
          <div className={styles.socialsRowPostItem}>
            <span onClick={!onlyDisplay ? handleList : undefined}>
              <img
                src={require(isListed
                  ? "assets/priviIcons/bookmark-filled.svg"
                  : "assets/priviIcons/bookmark.svg")}
                alt="bookmark"
              />
            </span>
            <span onClick={!onlyDisplay ? handleToggleShareMenu : undefined} ref={anchorShareMenuRef}>
              <SvgIcon htmlColor={"white"}>
                <ShareAltSolid />
              </SvgIcon>
            </span>
            {!onlyDisplay && (
              <Popper
                open={openShareMenu}
                anchorEl={anchorShareMenuRef.current}
                transition
                disablePortal={false}
                style={{ position: "inherit", zIndex: 1400 }}
              >
                {({ TransitionProps, placement }) => (
                  <Grow
                    {...TransitionProps}
                    style={{
                      transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                      position: "inherit",
                    }}
                  >
                    <Paper className={styles.paper}>
                      <ClickAwayListener onClickAway={handleCloseShareMenu}>
                        <MenuList
                          autoFocusItem={openShareMenu}
                          id="menu-list-grow"
                          onKeyDown={handleListKeyDownShareMenu}
                        >
                          <CustomMenuItem onClick={handleOpenShareModal}>
                            <img
                              src={require("assets/icons/butterfly.png")}
                              alt={"spaceship"}
                              style={{ width: 20, height: 20, marginRight: 5 }}
                            />
                            Share on social media
                          </CustomMenuItem>
                        </MenuList>
                      </ClickAwayListener>
                    </Paper>
                  </Grow>
                )}
              </Popper>
            )}
          </div>
        ) : (
          <></>
        )}
      </Box>

      <LoadingWrapper theme="blue" loading={responseLoader}>
        <>
          {!onlyDisplay && comments && comments.length > 0 ? (
            <div className={styles.commentsSection}>
              {comments.map((item, i) => (
                <ResponseWallPost key={i} response={item} />
              ))}
            </div>
          ) : null}
          {!onlyDisplay ? (
            <div className={styles.inputResponseWallPost}>
              <input
                value={response}
                placeholder="Write a message..."
                onChange={e => {
                  let res = e.target.value;
                  setResponse(res);
                }}
                onKeyDown={handleKeyDown}
                type="text"
                disabled={onlyDisplay}
              />
              <img src={require("assets/icons/send_gray.png")} alt={"send"} onClick={makeResponse} />
            </div>
          ) : (
            <></>
          )}
        </>
      </LoadingWrapper>
      {item.descriptionImages && item.descriptionImages.length > 2 && (
        <MorePicturesModal
          open={openMorePicturesModal}
          onClose={handleCloseMorePicturesModal}
          picturesArray={item.descriptionImages}
        />
      )}
    </>
  );
};
