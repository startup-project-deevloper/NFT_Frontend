import React, { useEffect, useRef, useState } from "react";
import { default as ElasticCarousel } from "react-elastic-carousel";
import { useHistory, useLocation } from "react-router-dom";
import Moment from "react-moment";

import { Grid, SvgIcon } from "@material-ui/core";
import { Pagination, Rating } from "@material-ui/lab";

import { appPageStyles } from "./index.styles";
import PriviCard from "components/PriviZoo/components/PriviCard";
import { ChevronIconLeft as ChevronIconDown } from "shared/ui-kit/Icons/chevronIconDown";
import { ChevronIconLeft } from "shared/ui-kit/Icons";
import { Avatar, PrimaryButton } from "shared/ui-kit";
import InputWithLabelAndTooltip from "shared/ui-kit/InputWithLabelAndTooltip";

import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";

import { useSelector } from "react-redux";
import { getUser, getUsersInfoList } from "store/selectors";
import Axios from "axios";
import { LoadingWrapper } from "shared/ui-kit/Hocs";
import FileAttachment, { FileType } from "shared/ui-kit/FileAttachment";
import { ReactComponent as PlaySolid } from "assets/icons/play-solid.svg";
import { ReactComponent as DownloadSolid } from "assets/icons/download-solid.svg";
import ReactPlayer from "react-player";
import Waveform from "shared/ui-kit/Page-components/Discord/DiscordAudioWavesurfer/Waveform";
import Bottom from "../../components/Bottom";
import { Modal } from "shared/ui-kit";
import { saveAs } from "file-saver";
import DiscordPhotoFullScreen from "shared/ui-kit/Page-components/Discord/DiscordPhotoFullScreen/DiscordPhotoFullScreen";
import DiscordVideoFullScreen from "shared/ui-kit/Page-components/Discord/DiscordVideoFullScreen/DiscordVideoFullScreen";
import { useAuth } from "shared/contexts/AuthContext";
import { ShareWithQRCode } from "shared/ui-kit/Modal/Modals/ShareWithQRCode";
import { ZOO_APPS } from "shared/constants/constants";

const PAGE_SIZE = 4;
const CommentBox = ({ item, appName, index }) => {
  const classes = appPageStyles();
  const playerVideo = React.useRef(null);
  const usersInfoList = useSelector(getUsersInfoList);
  const [selectedPhoto, setSelectedPhoto] = React.useState<string>("");
  const [selectedVideo, setSelectedVideo] = React.useState<string>("");
  const [openModalPhotoFullScreen, setOpenModalPhotoFullScreen] = React.useState<boolean>(false);
  const [openModalVideoFullScreen, setOpenModalVideoFullScreen] = React.useState<boolean>(false);

  const handleOpenModalPhotoFullScreen = () => {
    setOpenModalPhotoFullScreen(true);
  };

  const handleCloseModalPhotoFullScreen = () => {
    setOpenModalPhotoFullScreen(false);
  };
  const handleOpenModalVideoFullScreen = () => {
    setOpenModalVideoFullScreen(true);
  };

  const handleCloseModalVideoFullScreen = () => {
    setOpenModalVideoFullScreen(false);
  };

  const downloadFile = () => {
    saveAs(`${item.url}`, item.comment || "file");
  };

  return (
    <Box width={1} key={item} mb={1} style={{ borderBottom: "1px solid #18181822" }}>
      <Box className={classes.flexBox} justifyContent="space-between">
        <Box className={classes.flexBox}>
          <Avatar
            size="medium"
            url={
              usersInfoList.find(user => user.id === item.userId)?.imageUrl ??
              require("assets/anonAvatars/ToyFaces_Colored_BG_001.jpg")
            }
            alt=""
          />
          <Box mx={2}>{usersInfoList.find(user => user.id === item.userId)?.urlSlug}</Box>
          {item.fileType ? (
            <></>
          ) : (
            <>
              <Rating value={item.rate || 5} precision={0.5} disabled />
              <Box ml={2}>
                <b>{item.rate || 5}</b>
              </Box>
            </>
          )}
        </Box>
        <Moment format="DD.MM.YYYY">{item.date}</Moment>
      </Box>
      <Box className={classes.starBox} my={2}>
        {item.fileType ? (
          item.fileType === FileType.IMAGE ? (
            <div
              className={classes.imageContainer}
              onClick={() => {
                setSelectedPhoto(`${item.url}?${Date.now()}`);
                handleOpenModalPhotoFullScreen();
              }}
              style={{
                backgroundImage: `url(${item.url}?${Date.now()})`,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            />
          ) : item.fileType === FileType.VIDEO ? (
            <div className={classes.videoContainer}>
              <div className={classes.iconVideoWrapper}>
                <SvgIcon className={classes.playIconVideo}>
                  <PlaySolid />
                </SvgIcon>
              </div>
              <ReactPlayer
                onClick={() => {
                  setSelectedVideo(`${item.url}`);
                  handleOpenModalVideoFullScreen();
                }}
                url={`${item.url}`}
                ref={playerVideo}
                className={classes.videoPlayer}
                progressInterval={200}
              />
            </div>
          ) : item.fileType === FileType.AUDIO ? (
            <div className={classes.audioContainer}>
              <Waveform
                url={`${URL()}/priviZoo/getAudioMessage/${appName}/${index}`}
                mine={false}
                showTime={false}
                onPauseFunction={null}
                onPlayFunction={null}
                onReadyFunction={null}
              />
            </div>
          ) : (
            <div className="item-file">
              <div className="item-file-name">{item.comment}</div>
              <div
                onClick={() => {
                  downloadFile();
                }}
                className="item-file-icon"
              >
                <SvgIcon>
                  <DownloadSolid />
                </SvgIcon>
              </div>
            </div>
          )
        ) : (
          <>{item.comment}</>
        )}
      </Box>
      {selectedPhoto && openModalPhotoFullScreen && (
        <Modal
          size="medium"
          className={classes.discordPhotoFullModal}
          isOpen={openModalPhotoFullScreen}
          onClose={handleCloseModalPhotoFullScreen}
          theme="dark"
          showCloseIcon
        >
          <DiscordPhotoFullScreen onCloseModal={handleCloseModalPhotoFullScreen} url={selectedPhoto} />
        </Modal>
      )}
      {selectedVideo && openModalVideoFullScreen && (
        <Modal
          size="medium"
          className={`modal ${classes.dialogContainer}`}
          isOpen={openModalVideoFullScreen}
          onClose={handleCloseModalVideoFullScreen}
          theme="dark"
          showCloseIcon
        >
          <DiscordVideoFullScreen onCloseModal={handleCloseModalVideoFullScreen} url={selectedVideo} />
        </Modal>
      )}
    </Box>
  );
};

const AppPage = ({ match }) => {
  const classes = appPageStyles();
  const carouselRef = useRef<any>();
  const history = useHistory();
  const location = useLocation();

  const userSelector = useSelector(getUser);
  const usersInfoList = useSelector(getUsersInfoList);
  const { isSignedin } = useAuth();

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loadingComments, setLoadingComments] = useState<boolean>(false);
  const [comments, setComments] = useState<any[]>([]);
  const [comment, setComment] = useState<string>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [rate, setRate] = useState<number>(5);

  const [currentApp, setCurrentApp] = useState<any>(null);
  const [fileStatus, setFileStatus] = useState<any>(null);

  const anchorShareRef = React.useRef<HTMLDivElement>(null);
  const [openShareMenu, setOpenShareMenu] = React.useState<boolean>(false);
  const [openQrCodeModal, setOpenQrCodeModal] = useState<boolean>(false);

  React.useEffect(() => {
    if (match.params?.appId) {
      setCurrentApp(ZOO_APPS.find(data => data.type === match.params.appId));
    }
  }, [match.params?.appId]);

  React.useEffect(() => {
    if (currentApp) {
      setCurrentPage(0);
      // setLoadingComments(true);
      // Axios.get(`${URL()}/priviZoo/getComments/${currentApp.name}`)
      //   .then(res => {
      //     setComments(res.data.data);
      //     setLoadingComments(false);
      //   })
      //   .catch(_ => setLoadingComments(false));
    }
  }, [currentApp]);

  const addComment = () => {
    const body = {
      userId: userSelector.id,
      comment: comment,
      rate: rate,
    };
    Axios.post(`${URL()}/priviZoo/addComment/${currentApp.name}`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        setComment("");
        setComments(prev => [{ ...body, date: new Date().getTime() }, ...prev]);
      }
    });
  };

  const goApp = () => {
    if (currentApp?.appUrl) {
      history.push(currentApp?.appUrl);
    }
  };

  const handleYoutubeLink = () => {
    window.location.href = "https://www.facebook.com/PRIVI-Protocol-104693631453856";
  };

  const handleTwitterLink = () => {
    window.location.href = "http://www.twitter.com/priviprotocol";
  };

  const handleLinkedinLink = () => {
    window.location.href = "https://www.linkedin.com/company/privi-protocol/";
  };

  const handleInstagramLink = () => {
    window.location.href = "https://instagram.com/priviprotocol";
  };

  const handleTiktokLink = () => {
    window.location.href = "https://vm.tiktok.com/ZMechVPv8/";
  };

  const handleMediumLink = () => {
    window.location.href = "https://privi.medium.com/";
  };

  const handleShowShareMenu = (event: React.MouseEvent<EventTarget>) => {
    setOpenShareMenu(true);
  };

  const handleCloseShareMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorShareRef.current && anchorShareRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenShareMenu(false);
  };

  const handleShareWithQR = (event: React.MouseEvent<EventTarget>) => {
    setOpenShareMenu(false);
    setOpenQrCodeModal(true);
  };

  const hideQRCodeModal = () => {
    setOpenQrCodeModal(false);
  };

  const onFileChange = (file: any, type: FileType) => {
    const formData = new FormData();
    const now = Date.now();
    formData.append("file", file, "" + now);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    formData.append("userId", userSelector.id);
    formData.append("type", type);

    let url = `${URL()}/priviZoo/addFileComment/${currentApp.name}`;

    Axios.post(url, formData, config).then(res => {
      const resp = res.data;
      if (resp.success) {
        setComment("");
        setComments(prev => [{ ...resp.comment, date: new Date().getTime() }, ...prev]);
      }
    });
  };

  return (
    <Box width={1} pb={3}>
      <Box className={classes.navigationContainer}>
        <Box className={`${classes.flexBox} ${classes.contentBox}`} justifyContent="space-between" width={1}>
          <Box
            className={classes.flexBox}
            style={{ cursor: "pointer" }}
            onClick={() => {
              history.goBack();
            }}
          >
            <Box mr={3}>
              <ChevronIconLeft />
            </Box>
            <span className={classes.header2}>Back</span>
          </Box>
          {/* <div ref={anchorShareRef} style={{ cursor: "pointer" }} onClick={handleShowShareMenu}>
            <UploadIcon />
          </div>
          <Popper open={openShareMenu} anchorEl={anchorShareRef.current} transition placement="bottom-end">
            {({ TransitionProps, placement }) => (
              <Grow
                {...TransitionProps}
                style={{ transformOrigin: placement === "bottom-end" ? "right top" : "right bottom" }}
              >
                <Paper className={classes.popupPaper}>
                  <ClickAwayListener onClickAway={handleCloseShareMenu}>
                    <>
                      <Box display="flex" flexDirection="row" justifyContent="flex-end">
                        <Box style={{ cursor: "pointer" }} onClick={handleCloseShareMenu}>
                          <CloseIcon />
                        </Box>
                      </Box>
                      <Box className={classes.menu} onClick={() => navigator.clipboard.writeText(`https://www.privi.store/#/${location.pathname}`)}>
                        Copy link
                      </Box>
                      <Box className={classes.divider} />
                      <Box className={classes.menu} onClick={handleShareWithQR}>
                        Share With QR
                      </Box>
                      <Box display="flex" flexDirection="column" alignItems="center" maxWidth={200} my={2}>
                        <Text color={Color.White} align="center" mb={2}>Dowload your QR code and use it a simple way to give other acces to this project.</Text>
                        <QRCode id="qrCode" value={location.pathname} size={32} level={"H"} includeMargin />
                      </Box>
                      <Box className={classes.divider} />
                      <Box className={classes.menu}>
                        <FacebookShareButton
                          quote={`Privi ${currentApp?.name} is now on ${currentApp?.isPublished ? "Testnet" : "launching soon"}. @priviprotocol`}
                          url={`https://www.privi.store/#/${location.pathname}`}
                        >
                          Share on Facebook
                        </FacebookShareButton>
                      </Box>
                      <Box className={classes.divider} />
                      <Box className={classes.menu}>
                        <TwitterShareButton
                          title={`Privi ${currentApp?.name} is now on ${currentApp?.isPublished ? "Testnet" : "launching soon"}. @priviprotocol`}
                          url={`https://www.privi.store/#/${location.pathname}`}
                        >
                          Share on Twitter
                        </TwitterShareButton>
                      </Box>
                    </>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper> */}
        </Box>
        <Box className={`${classes.flexBox} ${classes.contentBox}`} justifyContent="space-between">
          <Box className={classes.titleContainer}>
            <Box className={classes.title}>{currentApp?.name}</Box>
            {currentApp?.isPublished ? (
              <Box className={classes.testNet}>Testnet</Box>
            ) : (
              <Box className={classes.comingSoon}>Coming Soon</Box>
            )}
          </Box>

          {/* {currentApp?.name === "Privi Exchange" ? (
           <button
           className={classes.earlyAccessBtn}
           onClick={() => window.location.href = "https://ddex.privi.store"}
         >
           Go To App
         </button>):null} */}

          {currentApp?.isPublished && (
            <Box className={classes.flexBox} style={{ marginLeft: "auto" }}>
              {currentApp?.name === "Privi Exchange" ? (
                <button
                  className={classes.earlyAccessBtn}
                  onClick={() => window.open("https://ddex.privi.store", "_blank")}
                >
                  Go to the App
                </button>
              ) : currentApp?.isPublished ? (
                <button
                  className={classes.earlyAccessBtn}
                  onClick={() => history.push(`${currentApp?.connect}`)}
                >
                  Join Waitlist
                </button>
              ) : (
                <Box className={classes.comingSoonContainer}>
                  <Box className={classes.comingSoonDescription}>
                    <h3>Join Waitlist for Testnet access</h3>
                    <h4>More updates will be posted soon</h4>
                  </Box>
                  {/* <button className={classes.followBtn}>Follow</button> */}
                  <button
                    className={classes.earlyAccessBtn}
                    onClick={() => history.push(`${currentApp?.connect}`)}
                  >
                    Join Waitlist
                  </button>
                </Box>
              )}
              {/* <SecondaryButton size="medium" onClick={() => { }}>
              <Box className={classes.flexBox}>
                <PlusIcon style={{ width: "16px", marginRight: "8px" }} />
                Add to My Apps
              </Box>
            </SecondaryButton> */}
            </Box>
          )}
        </Box>
        <Box className={classes.contentBox}>
          <ElasticCarousel
            isRTL={false}
            itemsToShow={1}
            pagination={false}
            showArrows={false}
            ref={carouselRef}
            onChange={(_, pageIndex) => {
              if (pageIndex !== currentPage) {
                setCurrentPage(pageIndex);
              }
            }}
          >
            {currentApp?.photo
              .filter(item => !item.includes("/Metaverse."))
              .map((item, index) => (
                <Box className={classes.musicBox} key={`${index}_elastic_item`}>
                  <img src={item} width="100%" height="100%" />
                </Box>
              ))}
          </ElasticCarousel>
          <Box
            className={classes.flexBox}
            justifyContent="space-between"
            style={{ background: "white" }}
            pt={1}
          >
            <Box className={classes.flexBox}>
              {currentApp?.photo
                .filter(item => !item.includes("/Metaverse."))
                .map((item, index) => (
                  <Box
                    className={`${classes.indexDotBox} ${index === currentPage ? "selected" : ""}`}
                    key={item}
                    ml={1}
                    onClick={() => {
                      if (index !== currentPage) {
                        carouselRef.current.goTo(index);
                      }
                    }}
                  >
                    <img src={item} width="100%" height="100%" style={{ objectFit: "cover" }} />
                  </Box>
                ))}
            </Box>
            <Box className={`${classes.navIconBox} ${classes.flexBox}`}>
              <Box
                style={{ transform: "rotate(90deg)" }}
                onClick={() => {
                  carouselRef.current.goTo(currentPage - 1);
                }}
              >
                <ChevronIconDown />
              </Box>
              <Box
                style={{ transform: "rotate(-90deg)" }}
                ml={3}
                onClick={() => {
                  carouselRef.current.goTo(currentPage + 1);
                }}
              >
                <ChevronIconDown />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Grid container spacing={2} className={classes.contentBox}>
        <Grid item xs={12} sm={isSignedin ? 6 : 12}>
          <Box className={classes.descriptionBox} mt={3}>
            <div className={classes.title3}>About {currentApp?.name}</div>
            <div className={classes.header3}>{currentApp?.longDescription}</div>
          </Box>
        </Grid>
        {isSignedin && (
          <Grid item xs={12} sm={6}>
            <>
              <Box className={classes.title2}>User feedback</Box>
              <Box className={classes.starBox} width={1}>
                <Box
                  className={classes.flexBox}
                  style={{ borderBottom: "1px solid #18181822", paddingBottom: "16px" }}
                >
                  <Avatar
                    size="medium"
                    url={
                      usersInfoList.find(user => user.id === userSelector.id)?.imageUrl ??
                      require("assets/anonAvatars/ToyFaces_Colored_BG_035.jpg")
                    }
                    alt=""
                  />
                  <InputWithLabelAndTooltip
                    overriedClasses=""
                    inputValue={comment}
                    onInputValueChange={e => setComment(e.target.value)}
                    placeHolder="Add a comment..."
                    style={{ margin: 0, marginLeft: "8px" }}
                    type="text"
                  />
                  <FileAttachment setStatus={setFileStatus} onFileChange={onFileChange} />
                </Box>
                <Box className={classes.flexBox} justifyContent="space-between" mt={2}>
                  <Box>
                    <Box className={classes.header1}>Rate your experience:</Box>
                    <Box className={classes.flexBox} mt={1}>
                      <Rating value={rate} precision={0.5} onChange={(e, v) => setRate(v || 0)} />
                      <Box ml={2}>
                        <b>{rate}</b>
                      </Box>
                    </Box>
                  </Box>
                  <PrimaryButton size="medium" onClick={addComment}>
                    Post
                  </PrimaryButton>
                </Box>
              </Box>
              <Box className={classes.flexBox} justifyContent="space-between" mt={3}>
                <Box className={classes.title2}>All comments</Box>
                <Box>{comments.length} comments</Box>
              </Box>
              <LoadingWrapper loading={loadingComments}>
                {comments.length > 0 && (
                  <>
                    <Box className={classes.shadowBox} mt={2}>
                      {comments
                        .filter(
                          (_, index) =>
                            index >= (pageNumber - 1) * PAGE_SIZE && index < pageNumber * PAGE_SIZE
                        )
                        .map((item, index) => (
                          <CommentBox
                            item={item}
                            appName={currentApp.name}
                            index={comments.length - 1 - index}
                          />
                        ))}
                    </Box>
                    <Box className={classes.flexBox} justifyContent="flex-end" mt={2}>
                      <Pagination
                        count={
                          comments.length - (comments.length % PAGE_SIZE) + (comments.length % 6 > 0 ? 1 : 0)
                        }
                        variant="outlined"
                        shape="rounded"
                        boundaryCount={1}
                        siblingCount={1}
                      />
                    </Box>
                  </>
                )}
              </LoadingWrapper>
            </>
          </Grid>
        )}
      </Grid>
      <Box width={1}>
        <Box className={classes.contentBox} style={{ marginBottom: "50px" }}>
          <Box className={classes.flexBox}>
            <img src={require("assets/icons/trending_icon_2.png")} width="56px" />
            <Box className={classes.title2}>Similar apps</Box>
          </Box>
          <Box className={classes.flexBox} mt={2} ml={3}>
            <Grid container spacing={3}>
              {ZOO_APPS.map(item => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.name}>
                  <PriviCard item={item} showEarlyAccess />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Box>
      <Box>
        <Bottom />
      </Box>
      <ShareWithQRCode
        isOpen={openQrCodeModal}
        onClose={hideQRCodeModal}
        shareLink={`https://www.privi.store/#/${location.pathname}`}
      />
    </Box>
  );
};

export default AppPage;
