import React, { useEffect, useState } from "react";
import cls from "classnames";
import { useHistory } from "react-router-dom";
import Axios from "axios";

import { useTypedSelector } from "store/reducers/Reducer";
import { useAuth } from "shared/contexts/AuthContext";
import Box from "shared/ui-kit/Box";
import { FruitSelect } from "shared/ui-kit/Select/FruitSelect";
import URL from "shared/functions/getURL";
import { getRandomAvatarForUserIdWithMemoization } from "shared/services/user/getUserAvatar";
import BidModal from "components/PriviDigitalArt/modals/BidModal";
import { SharePopup } from "shared/ui-kit/SharePopup";
import { getUserAvatar } from "shared/services/user/getUserAvatar";
import { loanCardStyles } from "./index.styles";
import { getLoanChainImageUrl } from "shared/functions/chainFucntions";
import useIPFS from "shared/utils-IPFS/useIPFS";
import { onGetNonDecrypt } from "shared/ipfs/get";
import { _arrayBufferToBase64 } from "shared/functions/commonFunctions";
import { StyledSkeleton } from "shared/ui-kit/Styled-components/StyledComponents";
import { getUser, getUsersInfoList } from "store/selectors";

const getRandomImageUrl = () => {
  return require(`assets/backgrounds/digital_art_1.png`);
};

export default function LoanCard({ item, index = 0, setItem }) {
  const classes = loanCardStyles();

  const history = useHistory();
  const user = useTypedSelector(getUser);
  const users = useTypedSelector(getUsersInfoList);

  const { isSignedin } = useAuth();

  const [media, setMedia] = React.useState<any>(item.media);
  const [creator, setCreator] = React.useState<any>();

  const [loanEnded, setLoanEnded] = React.useState<boolean>(true);
  const [endTime, setEndTime] = useState<any>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [openOptionsMenu, setOpenOptionsMenu] = useState<boolean>(false);
  const [openBidModal, setOpenBidModal] = useState<boolean>(false);

  const anchorShareMenuRef = React.useRef<HTMLButtonElement>(null);

  const parentNode = React.useRef<HTMLDivElement>(null);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  const [imageIPFS, setImageIPFS] = useState("");

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  useEffect(() => {
    if (media && users) {
      if (item?.CreatorAddress) {
        const c = users.find(u => u.address === item?.CreatorAddress);
        if (c) {
          setCreator(c);
        } else {
          setCreator({
            imageUrl: getRandomAvatarForUserIdWithMemoization(media?.creator),
            name: media?.creator,
            urlSlug: media?.creator,
          });
        }
      } else {
        setCreator({
          imageUrl: getRandomAvatarForUserIdWithMemoization(media?.creator),
          name: media?.creator,
          urlSlug: media?.creator,
        });
      }
    }

    if (media && media?.cid) {
      getImageIPFS(media?.cid);
    }
  }, [media, users]);

  useEffect(() => {
    if (media?.cid) {
      getImageIPFS(media?.cid);
    }
  }, [ipfs]);

  const getImageIPFS = async (cid: string) => {
    let files = await onGetNonDecrypt(cid, (fileCID, download) =>
      downloadWithNonDecryption(fileCID, download)
    );
    if (files) {
      let base64String = _arrayBufferToBase64(files.content);
      setImageIPFS("data:image/png;base64," + base64String);
    }
  };

  useEffect(() => {
    if (item) {
      const timerId = setInterval(() => {
        const now = new Date();
        let delta = Math.floor(item.Duration ? item.CreationDate + item.Duration - now.getTime() / 1000 : 0);
        if (delta <= 0) {
          setLoanEnded(true);
          setEndTime({
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
          });
          clearInterval(timerId);
        } else {
          let days = Math.floor(delta / 86400);
          delta -= days * 86400;

          // calculate (and subtract) whole hours
          let hours = Math.floor(delta / 3600) % 24;
          delta -= hours * 3600;

          // calculate (and subtract) whole minutes
          let minutes = Math.floor(delta / 60) % 60;
          delta -= minutes * 60;

          // what's left is seconds
          let seconds = delta % 60;
          setLoanEnded(false);
          setEndTime({
            days,
            hours,
            minutes,
            seconds,
          });
        }
      }, 1000);

      return () => clearInterval(timerId);
    } else return;
  }, [item]);

  const handleOpenDigitalArtModal = () => {
    if (isSignedin && media && creator) {
      history.push(`/loan/${item.id}`);
    }
  };

  const handleOptions = () => {
    setOpenOptionsMenu(!openOptionsMenu);
  };

  const handleCloseOptionsMenu = () => {
    setOpenOptionsMenu(false);
  };

  const handleFruit = type => {
    let body = {
      userId: user.id,
      fruitId: type,
      mediaAddress: item.id,
      mediaType: media?.Type,
      tag: "polygon",
    };

    Axios.post(`${URL()}/media/fruit`, body).then(res => {
      const resp = res.data;
      if (resp.success) {
        const itemCopy = { ...media };
        itemCopy.fruits = resp.fruitsArray;
        setMedia(itemCopy);
      }
    });
  };

  const handleOpenBidModal = e => {
    e.preventDefault();
    e.stopPropagation();
    setOpenBidModal(true);
  };

  const handleCloseBidModal = () => {
    setOpenBidModal(false);
  };

  return (
    <div className={classes.card} style={{ marginBottom: 0 }}>
      <div className={classes.header}>
        <Box display="flex" alignItems="center">
          {creator ? (
            <div
              className={classes.avatar}
              style={{
                backgroundImage:
                  creator?.ipfsImage ? `url(${creator?.ipfsImage})` : `url(${require(`assets/anonAvatars/ToyFaces_Colored_BG_111.jpg`)})`,
              }}
              onClick={() => creator.urlSlug && history.push(`/${creator.urlSlug}/profile`)}
            />
          ) : (
            <StyledSkeleton width={40} height={40} animation="wave" variant="circle" />
          )}
          <Box display="flex" flexDirection="column">
            <div className={cls(classes.black, classes.creatorName)} style={{ marginBottom: 4 }}>
              {creator?.name ?? <StyledSkeleton width={120} animation="wave" />}
            </div>
            {creator?.urlSlug ? (
              <div className={cls(classes.gray, classes.creatorName)}>@{creator.urlSlug}</div>
            ) : (
              <StyledSkeleton width={80} animation="wave" />
            )}
          </Box>
        </Box>

        {media && (
          <Box display="flex" alignItems="center">
            <div className={classes.fruitsContainer}>
              <FruitSelect
                fruitObject={media}
                onGiveFruit={handleFruit}
                parentNode={parentNode.current ?? undefined}
              />
            </div>
            <button onClick={handleOptions} className={classes.optionsBtn} ref={anchorShareMenuRef}>
              <img src={require(`assets/icons/menu_dots.png`)} alt="like" />
            </button>
            <SharePopup
              item={media}
              openMenu={openOptionsMenu}
              anchorRef={anchorShareMenuRef}
              handleCloseMenu={handleCloseOptionsMenu}
            />
            {/* <ShareMenu
              openMenu={openOptionsMenu}
              anchorRef={anchorShareMenuRef}
              item={media}
              handleCloseMenu={handleCloseOptionsMenu}
              index={index}
            /> */}
          </Box>
        )}
      </div>
      {media?.cid && !imageIPFS ? (
        <Box my={1}>
          <StyledSkeleton width="100%" height={226} variant="rect" />
        </Box>
      ) : (
        <div
          className={cls(classes.media, classes.fixed)}
          style={{
            backgroundImage: `url(${
              media?.cid
                ? imageIPFS
                : media?.Type && media?.Type !== "DIGITAL_ART_TYPE"
                ? media?.UrlMainPhoto
                : media?.UrlMainPhoto ?? media?.Url ?? media?.url ?? getRandomImageUrl()
            })`,
          }}
          onClick={handleOpenDigitalArtModal}
        />
      )}
      <div className={classes.info} onClick={handleOpenDigitalArtModal}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb="8px" mt={1}>
          <div className={cls(classes.black, classes.title)}>{media?.MediaName ?? media?.title}</div>
          <img
            src={getLoanChainImageUrl(item?.Chain, media?.BlockchainNetwork)}
            alt={"Chain"}
            className={classes.chain}
          />
        </Box>
        <Box display="flex" justifyContent="space-between" color="#431AB7" mt={1}>
          {item?.BidderAddress ? (
            <Box>
              <div className={classes.label}>Loan Principal</div>
              <div className={classes.bold}>
                {item?.Bid} {item?.FundingToken ?? "ETH"}
              </div>
            </Box>
          ) : null}
          <Box>
            <div className={classes.label}>Interest</div>
            <div className={classes.bold}>{`${item?.FeePct || "0"}%`}</div>
          </Box>
        </Box>
        {
          //media?.Loan && (
        }{" "}
        <div className={classes.loan}>
          <div>{!loanEnded ? "Loan Ends In" : "Loan Ended"}</div>
          {!loanEnded && (
            <h5>
              {`${endTime.days ? `${String(endTime.days).padStart(2, "0")}d` : ""} ${String(
                endTime.hours
              ).padStart(2, "0")}h ${String(endTime.minutes).padStart(2, "0")}m ${String(
                endTime.seconds
              ).padStart(2, "0")}s`}
            </h5>
          )}
        </div>
        {item.CreatorAddress !== user?.address && !loanEnded ? (
          item?.BidderAddress ? (
            <button className={classes.secondary} onClick={handleOpenBidModal}>
              Place a higher bid
            </button>
          ) : (
            <button className={classes.primary} onClick={handleOpenBidModal}>
              Place a bid
            </button>
          )
        ) : null}
      </div>

      {openBidModal && (
        <BidModal
          loan={item}
          setLoan={setItem}
          open={openBidModal}
          onClose={handleCloseBidModal}
          previousBid={item.Bid ?? 0}
        />
      )}
    </div>
  );
}
