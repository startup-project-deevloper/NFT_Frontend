import React, { useEffect, useState } from "react";
import cls from "classnames";
import { useHistory } from "react-router-dom";
import Axios from "axios";

import { useTypedSelector } from "store/reducers/Reducer";
import Box from "shared/ui-kit/Box";
import URL from "shared/functions/getURL";
import { getUserAvatar } from "shared/services/user/getUserAvatar";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import { SharePopup } from "shared/ui-kit/SharePopup";
import { fractionalizedNFTCardStyles } from "./index.styles";
import { useAuth } from "shared/contexts/AuthContext";
import { StyledSkeleton } from "shared/ui-kit/Styled-components/StyledComponents";

const getRandomImageUrl = () => {
  return require(`assets/podImages/3.png`);
};

const chainIdMap = {
  1: "ethereum",
  3: "ethereum",
  4: "ethereum",
  137: "polygon",
  80001: "polygon"
}

export default function FractionalizedNFTCard({ item, heightFixed, index = 0 }) {
  const classes = fractionalizedNFTCardStyles();
  const history = useHistory();
  const { isSignedin } = useAuth();

  const [creator, setCreator] = React.useState<any>({
    imageUrl: "",
    name: "",
    urlSlug: "",
  });
  const [openOptionsMenu, setOpenOptionsMenu] = useState<boolean>(false);
  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (item) {
      const getCreatorData = async () => {
        await Axios.get(`${URL()}/user/getBasicUserInfo/${item.Creator ?? item.CreatorAddress}`)
          .then(response => {
            if (response?.data?.success) {
              const data = response.data.data;
              setCreator({
                ...data,
                name: data.name ?? `${data.firstName} ${data.lastName}`,
              });
            } else {
              setCreator({
                imageUrl: getRandomAvatarForUserIdWithMemoization(item.creator),
                name: "User name",
                urlSlug: "",
              });
            }
          })
          .catch(error => {
            console.log(error);
          });
      };
      getCreatorData();
    }
  }, [item]);

  const handleOpenDigitalArtModal = () => {
    if (isSignedin && item && creator) {
      let queryParam = "";
      if (item.tag) queryParam += (queryParam ? "&" : "") + `blockchainTag=${item.tag}`;
      if (item.collection) queryParam += (queryParam ? "&" : "") + `collectionTag=${item.collection}`;
      history.push(`/fractionalisation/${encodeURIComponent(item.MediaSymbol ?? item.id)}?${queryParam}`);
    }
  };

  const handleOptions = () => {
    setOpenOptionsMenu(!openOptionsMenu);
  };

  const handleCloseOptionsMenu = () => {
    setOpenOptionsMenu(false);
  };

  return (
    <div className={classes.card} style={{ marginBottom: heightFixed === "auction" ? 100 : 0 }}>
      <div className={classes.header}>
        {creator ? (
          <Box display="flex" alignItems="center" style={{ cursor: "pointer" }}>
            <div
              className={classes.avatar}
              style={{
                backgroundImage: creator && creator.imageIPFS
                  ? `url(${creator.imageIPFS})`
                  : creator ?
                    `url(${getUserAvatar({
                      id: creator.id,
                      anon: creator.anon,
                      hasPhoto: creator.hasPhoto,
                      anonAvatar: creator.anonAvatar,
                      url: creator.url,
                    })})` : "none",
              }}
              onClick={() => creator.urlSlug && history.push(`/${creator.urlSlug}/profile`)}
            />
            <Box display="flex" flexDirection="column">
              <div className={cls(classes.black, classes.creatorName)} style={{ marginBottom: 4 }}>
                {!creator.name ? "" : creator.name}
              </div>
              {creator.urlSlug && (
                <div className={cls(classes.gray, classes.creatorName)}>@{creator.urlSlug}</div>
              )}
            </Box>
          </Box>
        ) : (
          <StyledSkeleton width={120} animation="wave" />
        )}

        <Box display="flex" alignItems="center">
          <button onClick={handleOptions} className={classes.optionsBtn} ref={anchorShareMenuRef}>
            <MoreIcon />
          </button>
          <SharePopup
            item={item}
            openMenu={openOptionsMenu}
            anchorRef={anchorShareMenuRef}
            handleCloseMenu={handleCloseOptionsMenu}
          />
        </Box>
      </div>
      {heightFixed ? (
        <div
          className={cls(classes.media, classes.fixed)}
          style={{
            backgroundImage: `url(${
              item.Type && item.Type !== "DIGITAL_ART_TYPE"
                ? item.UrlMainPhoto
                : item.UrlMainPhoto ?? item.Url ?? getRandomImageUrl()
            })`,
            position: "relative",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={handleOpenDigitalArtModal}
        >
          {item?.FractionalizeData?.status === "Sale" ? (
            <div className={classes.liveSaleBtn}>
              <LiveSaleIcon />
              <span>Live Sale</span>
            </div>
          ) : item?.FractionalizeData?.status === "Auction" ? (
            <div className={classes.liveAuctionBtn}>
              <LiveAuctionIcon />
              <span>Live Auction</span>
            </div>
          ) : item?.FractionalizeData?.status === "Closed"? (
            <div className={classes.closedBtn}>
              <ClosedIcon />
              <span>Closed</span>
            </div>
          ) : null}
        </div>
      ) : (
        <div style={{ borderRadius: "16px", cursor: "pointer" }} onClick={handleOpenDigitalArtModal}>
          <img
            src={`${
              item.Type
                ? item.UrlMainPhoto
                : item.UrlMainPhoto ?? item.Url ?? item.url
            }`}
            alt={item.MediaSymbol ?? item.id}
            className={classes.media}
          />
        </div>
      )}
      <div className={classes.info} onClick={handleOpenDigitalArtModal}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb="8px">
          <div className={cls(classes.black, classes.title)}>
            {item?.FractionalizeData?.name}
          </div>
          <img src={require(`assets/logos/${chainIdMap[item?.FractionalizeData?.chainId ?? 1]}.png`)} alt={"chain"} className={classes.chain} />
        </Box>
      </div>
      <Box className={classes.viewsBox} onClick={handleOpenDigitalArtModal}></Box>
      <Box className={classes.podMainInfoContent} onClick={handleOpenDigitalArtModal}>
        <Box>
          <span>Total Supply</span>
          <p>{item?.FractionalizeData?.supply}</p>
        </Box>
        <Box>
          <span>Collectable Supply</span>
          <p>{item?.FractionalizeData?.collectableSupply ?? "0.00"}%</p>
        </Box>
        <Box>
          <span>Impleid Valuation</span>
          <p>{item?.FractionalizeData?.impleidValuation ?? "$2,543,347"}</p>
        </Box>
      </Box>
      {item?.FractionalizeData?.status == "Auction" && (
        <div className={classes.auctionSection}>
          <div>Auction Ending In</div>
          <span>03d 22h 32m 44s</span>
        </div>
      )}
    </div>
  );
}

const MoreIcon = () => (
  <svg width="20" height="5" viewBox="0 0 20 5" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="2.72639" cy="2.78889" r="2.02717" fill="#434343" />
    <circle cx="10.8358" cy="2.78889" r="2.02717" fill="#434343" />
    <circle cx="17.5926" cy="2.78889" r="2.02717" fill="#434343" />
  </svg>
);

export const LiveSaleIcon = () => (
  <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.16667 1.66602H3.5L1.5 7.66602H4.16667L2.83333 12.9993L10.1667 5.66602H6.56667L8.16667 1.66602Z"
      stroke="#431AB7"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LiveAuctionIcon = () => (
  <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M4.75 12C3.88982 12 3.09435 11.7832 2.36358 11.3496C1.63281 10.916 1.05619 10.3242 0.633714 9.57422C0.211238 8.82422 0 8.00781 0 7.125C0 6.78125 0.0494792 6.4707 0.148438 6.19336C0.247396 5.91602 0.369191 5.66797 0.513822 5.44922C0.658453 5.23047 0.803085 4.99219 0.947716 4.73438C1.09235 4.47656 1.21414 4.13672 1.3131 3.71484C1.41206 3.29297 1.46154 2.80469 1.46154 2.25C1.46154 2.32812 1.5015 2.4043 1.58143 2.47852C1.66136 2.55273 1.75651 2.62695 1.86689 2.70117C1.97726 2.77539 2.09906 2.90625 2.23227 3.09375C2.36548 3.28125 2.47396 3.5 2.55769 3.75C2.67949 4.13281 2.8774 4.47852 3.15144 4.78711C3.42548 5.0957 3.71474 5.25 4.01923 5.25C4.41506 5.25 4.7519 5.01953 5.02975 4.55859C5.30759 4.09766 5.51312 3.47656 5.64633 2.69531C5.77955 1.91406 5.84615 1.01562 5.84615 0C5.96034 0.34375 6.13542 0.703125 6.37139 1.07812C6.60737 1.45312 6.85667 1.79297 7.11929 2.09766C7.38191 2.40234 7.65785 2.75 7.94712 3.14062C8.23638 3.53125 8.49329 3.91211 8.71785 4.2832C8.94241 4.6543 9.12891 5.08789 9.27734 5.58398C9.42578 6.08008 9.5 6.59375 9.5 7.125C9.5 8.00781 9.28876 8.82422 8.86629 9.57422C8.44381 10.3242 7.86719 10.916 7.13642 11.3496C6.40565 11.7832 5.61018 12 4.75 12ZM6.21154 4.5C5.82332 5.5625 5.45793 6.3125 5.11538 6.75C4.97075 6.9375 4.78996 7.10547 4.57302 7.25391C4.35607 7.40234 4.15815 7.52148 3.97927 7.61133C3.80038 7.70117 3.6272 7.80273 3.45974 7.91602C3.29227 8.0293 3.16096 8.17383 3.06581 8.34961C2.97065 8.52539 2.92308 8.74219 2.92308 9C2.92308 9.47656 3.10387 9.8457 3.46544 10.1074C3.82702 10.3691 4.25521 10.5 4.75 10.5C5.48077 10.5 6.08974 10.3027 6.57692 9.9082C7.0641 9.51367 7.30769 8.97656 7.30769 8.29688C7.30769 7.77344 7.26583 7.32227 7.18209 6.94336C7.09836 6.56445 7.00321 6.2832 6.89663 6.09961C6.79006 5.91602 6.66827 5.68164 6.53125 5.39648C6.39423 5.11133 6.28766 4.8125 6.21154 4.5Z"
      fill="#431AB7"
    />
  </svg>
);

export const ClosedIcon = () => (
  <svg width="9" height="10" viewBox="0 0 9 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.00001 1.5L1 8.50001M1.00001 1.5L8.00001 8.50001"
      stroke="#F2604C"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const SortByIcon = () => (
  <svg width="11" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.36914 5.77539C5.45508 5.77539 5.53613 5.75977 5.6123 5.72852C5.68848 5.69727 5.75586 5.64648 5.81445 5.57617L10.0684 1.22852C10.1855 1.11523 10.2441 0.978516 10.2441 0.818359C10.2441 0.708984 10.2178 0.609375 10.165 0.519531C10.1123 0.429688 10.042 0.358398 9.9541 0.305664C9.86621 0.25293 9.76562 0.226563 9.65234 0.226563C9.49219 0.226563 9.35156 0.285156 9.23047 0.402344L5.37162 4.35434L1.50781 0.402344C1.39062 0.285156 1.25195 0.226563 1.0918 0.226563C0.978516 0.226563 0.87793 0.25293 0.790039 0.305664C0.702148 0.358398 0.631836 0.429688 0.579102 0.519531C0.526367 0.609375 0.5 0.708984 0.5 0.818359C0.5 0.900391 0.515625 0.975586 0.546875 1.04395C0.578125 1.1123 0.621094 1.17383 0.675781 1.22852L4.92383 5.58203C5.05664 5.71094 5.20508 5.77539 5.36914 5.77539Z"
      fill="#9EACF2"
    />
  </svg>
);
