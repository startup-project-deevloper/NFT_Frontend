import React, { useRef, useState } from "react";
import Popper from "@material-ui/core/Popper";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import { useTokenConversion } from "shared/contexts/TokenConversionContext";
import { Accordion, AccordionDetails, AccordionSummary, PrimaryButton } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import { mediaCardStyles } from "./index.styles";
import { useHistory } from "react-router-dom";
import { useTypedSelector } from "store/reducers/Reducer";
import { useAlertMessage } from "shared/hooks/useAlertMessage";
import MediaTermsModal from "components/PriviDigitalArt/subpages/PodPageIndividual/components/Media/EditTermModal";
// import { buildJsxFromObject } from "shared/functions/commonFunctions";
// import { SignatureRequestModal } from "shared/ui-kit/Modal/Modals";
import { IUploadMedia, uploadMedia } from "shared/services/API";
import PrintChart from "shared/ui-kit/Chart/Chart";
import { CustomTable, CustomTableCellInfo, CustomTableHeaderInfo } from "shared/ui-kit/Table";

const digitalArtPhoto = require("assets/backgrounds/digital_art_2.png");

const RadialConfig = {
  config: {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [] as any,
          backgroundColor: [] as any,
          hoverOffset: 0,
          labels: [] as any,
        },
      ],
    },
    options: {
      cutoutPercentage: 80,
      animation: false,
      rotation: Math.PI / 2,
      tooltips: { enabled: false },
    },
  },
};

const formatDate = dateInS => {
  const date = new Date(dateInS * 1000);
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
};

const RevenueHeader = [
  { headerName: "Community" },
  { headerName: "Revenue earnings" },
  { headerName: "Revenue Paid" },
];

const tableMock = [
  {
    communityName: "strangers community",
    imageUrl: require("assets/icons/anon_icon.png"),
    earnings: 5.68,
    paid: 2.1118,
  },
  {
    communityName: "strangers community",
    imageUrl: require("assets/icons/anon_icon.png"),
    earnings: 5.68,
    paid: 2.1118,
  },
];

export const MediaCard = ({ media, pod, handleRefresh, creator }) => {
  const classes = mediaCardStyles();
  const history = useHistory();
  const user = useTypedSelector(state => state.user);

  const { convertTokenToUSD } = useTokenConversion();
  const { showAlertMessage } = useAlertMessage();

  const [mediaData, setMediaData] = React.useState<any>(media);
  const [stakingRadialConfig, setStakingRadialConfig] = React.useState<any>();
  const [openFeedbackModal, setOpenFeedbackModal] = React.useState<boolean>(false);
  const [openFeedback, setOpenFeedback] = React.useState<boolean>(false);
  const [openMediaTermsModal, setOpenMediaTermsModal] = React.useState<boolean>(false);

  const [revenueTableData, setRevenueTableData] = useState<any[]>([]);

  const anchorRef = React.useRef<any>();
  const parentNode = React.useRef<HTMLDivElement>(null);

  const payloadRef = useRef<any>({});
  // const [openSignRequestModal, setOpenSignRequestModal] = useState<boolean>(false);
  // const [signRequestModalDetail, setSignRequestModalDetail] = useState<any>(null);

  React.useEffect(() => {
    const newStakingRadial = JSON.parse(JSON.stringify(RadialConfig));
    newStakingRadial.config.data.datasets[0].labels = [
      "Creator Fraction",
      "Fractions For Sale",
      "Sold Fractions",
    ];
    newStakingRadial.config.data.datasets[0].data = [50, 25, 25];
    newStakingRadial.config.data.datasets[0].backgroundColor = ["#3177FF", "#FF78D3", "#F9E373"];
    setStakingRadialConfig(newStakingRadial);

    const tableData: Array<Array<CustomTableCellInfo>> = [];
    tableMock.forEach(item => {
      const row: Array<CustomTableCellInfo> = [];
      row.push({
        cell: (
          <Box fontWeight={800} color="#1A1B1C" display="flex">
            <img
              src={item.imageUrl}
              style={{ width: 32, height: 32, borderRadius: "50%", marginRight: 8 }}
              alt=""
            />
            {item.communityName}
          </Box>
        ),
        cellAlign: "left",
      });
      row.push({
        cell: <Box color="#A4A4A4">{item.earnings.toFixed(2)}</Box>,
        cellAlign: "right",
      });
      row.push({
        cell: <Box color="#A4A4A4">{item.paid.toFixed(6)}</Box>,
        cellAlign: "right",
      });

      tableData.push(row);
    });
    setRevenueTableData(tableData);
  }, []);

  const handleToggle = () => {
    setOpenFeedback(prevOpen => !prevOpen);
  };

  const handleClose = () => {
    setOpenFeedback(false);
  };

  const handleOpenFeedback = () => {
    setOpenFeedbackModal(true);
    handleClose();
  };

  const handleCloseFeedbackModal = () => {
    setOpenFeedbackModal(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenFeedback(false);
    }
  }

  const handleOpenSignatureModal = () => {
    let payload: IUploadMedia = {
      MediaSymbol: media.MediaSymbol,
      PodAddress: pod.PodAddress,
    };
    payloadRef.current = payload;
    // setSignRequestModalDetail(buildJsxFromObject(payload));
    // setOpenSignRequestModal(true);
    handleConfirm();
  };

  const handleConfirm = () => {
    const payload = payloadRef.current;
    if (payload && Object.keys(payload)) {
      uploadMedia(user.address, payload, {}).then(resp => {
        if (resp?.success) {
          showAlertMessage("Media uploaded", { variant: "success" });
          handleRefresh();
        } else showAlertMessage("Media upload failed", { variant: "error" });
      });
    }
  };

  const getMenuPopper = () => {
    return (
      <Popper
        open={openFeedback}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        placement="bottom-end"
      >
        {({ TransitionProps, placement }) => (
          <Grow {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList autoFocusItem={openFeedback} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                  {/*<MenuItem onClick={handleClose}>Sell On A Community</MenuItem>*/}
                  <MenuItem onClick={handleOpenFeedback}>Get Feedback</MenuItem>
                  <MenuItem onClick={handleClose}>Edit Terms</MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    );
  };
  return (
    <Box className={classes.container}>
      {/* <SignatureRequestModal
        open={openSignRequestModal}
        address={user.address}
        transactionFee="0.0000"
        detail={signRequestModalDetail}
        handleOk={handleConfirm}
        handleClose={() => setOpenSignRequestModal(false)}
      /> */}
      <Box display="flex" alignItems="center" justifyContent="space-between" className={classes.header}>
        {media.ReleaseDate ? (
          <Box className={classes.fractionBox}>
            {"Release Date: "}
            {formatDate(media.ReleaseDate)}
          </Box>
        ) : (
          <div></div>
        )}

        <div className={classes.menuBox} ref={anchorRef} onClick={handleToggle}>
          <img src={require("assets/icons/three_dots_darkblue.png")} />
        </div>
        {getMenuPopper()}
      </Box>
      <Box className={classes.imageContainer}>
        <img
          src={
            mediaData.HasPhoto
              ? mediaData.Url ??
                `url(${URL()}/media/getMediaMainPhoto/${mediaData.MediaSymbol.replace(/\s/g, "")})`
              : digitalArtPhoto
          }
          style={{ objectFit: "cover" }}
          width="100%"
        />
      </Box>
      <Box display="flex" alignItems="center" mt={"-16px"} mb={4}>
        <div
          className={classes.avatar}
          style={{
            backgroundImage: creator.imageUrl ? `url(${creator.imageUrl})` : "none",
          }}
          onClick={() => creator.id && history.push(`/${creator.id}/profile`)}
        />
      </Box>

      <Box className={classes.title}>{mediaData.MediaName || ""}</Box>
      <Box className={classes.desc}>{mediaData.MediaDescription || ""}</Box>

      <Box mt={2}>
        <Accordion defaultExpanded>
          <AccordionSummary>
            <Box mt={3} className={classes.flexBox} width={1}>
              <Box width={1}>
                <Box className={classes.title1}>Regular Price</Box>
                <Box className={classes.content1} mt={1}>
                  ${" "}
                  {convertTokenToUSD(
                    media?.NftConditions?.FundingToken ?? media?.ViewConditions?.ViewingToken ?? "USDT",
                    media?.NftConditions?.Price ?? 0
                  )}
                </Box>
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box mt={1} className={classes.flexBox} justifyContent="space-between">
              <Box>
                <Box className={classes.header1}>Investor share</Box>
                <Box className={classes.header2}>
                  {mediaData.InvestorShare ? (mediaData.InvestorShare * 100).toFixed(0) : "0"}%
                </Box>
              </Box>
              <Box ml={2}>
                <Box className={classes.header1}>Sharing share</Box>
                <Box className={classes.header2}>
                  {mediaData.SharingPercent ? (mediaData.SharingPercent * 100).toFixed(0) : "0"}%
                </Box>
              </Box>
              <Box ml={2}>
                <Box className={classes.header1}>Collabs share</Box>
                <Box className={classes.header2}>
                  {1 - (mediaData.InvestorShare || 0) - (mediaData.SharingPercent || 0) * 100}%
                </Box>
              </Box>
              <Box ml={2}>
                <Box className={classes.header1}>Royalty</Box>
                <Box className={classes.header2}>
                  {mediaData.Royalty ? (mediaData.Royalty * 100).toFixed(0) : "0"}%
                </Box>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
      <Box>
        <Accordion>
          <AccordionSummary>
            <Box className={classes.title1}>Ownership Distribution</Box>
          </AccordionSummary>
          <AccordionDetails>
            <Box mt={1} className={classes.flexBox} justifyContent="space-between">
              <Box maxWidth="150px">
                {stakingRadialConfig && <PrintChart config={stakingRadialConfig} canvasHeight={250} />}
              </Box>
              <Box ml={2} width={1}>
                {stakingRadialConfig &&
                  stakingRadialConfig.config.data.datasets[0].labels.map((item, index) => (
                    <Box
                      className={classes.flexBox}
                      mb={2}
                      style={{ borderBottom: "1px dashed grey" }}
                      justifyContent="space-between"
                      pb={1}
                      key={item + "-" + index}
                      fontSize="14px"
                      color="#1A1B1C"
                    >
                      <Box className={classes.flexBox}>
                        <Box
                          className={classes.radialLabelBox}
                          style={{
                            background: stakingRadialConfig.config.data.datasets[0].backgroundColor[index],
                          }}
                        />
                        <Box ml={2}>{item}</Box>
                      </Box>
                      <Box ml={2} fontWeight={800}>
                        {stakingRadialConfig.config.data.datasets[0].data[index]}%
                      </Box>
                    </Box>
                  ))}
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
      {media.Revenue && (
        <Box className={classes.tableAccordion}>
          <Accordion>
            <AccordionSummary>
              <Box className={classes.title1}>Revenue</Box>
            </AccordionSummary>
            <AccordionDetails>
              <CustomTable headers={RevenueHeader} rows={revenueTableData} />
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
      <Box display="flex" justifyContent="center" mt={2}>
        {media.CreatorAddress == user.address && !media?.IsRegistered && (
          <PrimaryButton
            className={classes.primaryBtn}
            size="small"
            onClick={() => setOpenMediaTermsModal(true)}
          >
            Edit Terms
          </PrimaryButton>
        )}
        {media.CreatorAddress == user.address && !media?.IsUploaded && pod.RaisedFunds >= pod.FundingTarget && (
          <PrimaryButton className={classes.primaryBtn} size="small" onClick={handleOpenSignatureModal}>
            Upload Media
          </PrimaryButton>
        )}
      </Box>
      {openMediaTermsModal && (
        <MediaTermsModal
          open={openMediaTermsModal}
          handleClose={() => setOpenMediaTermsModal(false)}
          pod={pod}
          media={media}
          handleRefresh={handleRefresh}
        />
      )}
    </Box>
  );
};
