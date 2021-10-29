import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { collabsTabStyles, useAutocompleteStyles } from "./CollabsTab.styles";
import { Autocomplete } from "@material-ui/lab";
import { InputBase } from "@material-ui/core";
import { RootState } from "store/reducers/Reducer";
import { Avatar } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { getMatchingUsers, IAutocompleteUsers } from "shared/services/API";
import { useTypedSelector } from "store/reducers/Reducer";
import useIPFS from "shared/utils-IPFS/useIPFS";
import getPhotoIPFS from "shared/functions/getPhotoIPFS";
import { getDefaultAvatar } from "shared/services/user/getUserAvatar";

const searchIcon = require("assets/icons/search.png");

const CollabsTab = ({ pod, setPod }) => {
  const classes = collabsTabStyles();
  const user = useSelector((state: RootState) => state.user);
  const users = useTypedSelector(state => state.usersInfoList);

  const autocompleteStyle = useAutocompleteStyles();
  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());

  const [searchValue, setSearchValue] = useState<string>("");
  const [autocompleteUsers, setAutocompleteUsers] = useState<IAutocompleteUsers[]>([]);

  const { ipfs, setMultiAddr, downloadWithNonDecryption } = useIPFS();

  useEffect(() => {
    setMultiAddr("https://peer1.ipfsprivi.com:5001/api/v0");
  }, []);

  // refresh autocomplete user list when searchValue changed
  useEffect(() => {
    if (searchValue && users.length && user && ipfs) {
      getMatchingUsers(searchValue, ["firstName", "address"]).then(async resp => {
        if (resp?.success) {
          const filteredUsers = resp.data.filter(u => u.address && u.address != user.address);
          const usersWithIPFS: IAutocompleteUsers[] = await Promise.all(
            filteredUsers.map(async (user): Promise<IAutocompleteUsers> => {
              const avatar = await getUserPhoto(user);
              return {
                ...user,
                avatar,
              };
            })
          );
          setAutocompleteUsers(usersWithIPFS);
        }
      });
    } else setAutocompleteUsers([]);
  }, [searchValue, ipfs, user, users]);

  const getUserPhoto = async (user: any) => {
    if (user && user.infoImage && user.infoImage.newFileCID) {
      let imageUrl = await getPhotoIPFS(user.infoImage.newFileCID, downloadWithNonDecryption);
      return imageUrl;
    } else {
      return getDefaultAvatar();
    }
  };

  const addAddressToSelectedList = user => {
    const newCollabs = [...pod.Collabs];
    newCollabs.push(user);
    setPod({ ...pod, Collabs: newCollabs });
  };

  const removeAddressFromSelectedList = user => {
    const newCollabs = pod.Collabs.filter(u => user.address !== u.address);
    setPod({ ...pod, Collabs: newCollabs });
  };

  return (
    <>
      <div className={classes.inputContainer}>
        <Autocomplete
          freeSolo
          key={autocompleteKey}
          classes={autocompleteStyle}
          onChange={(event: any, user: any | null) => {
            if (user && typeof user !== "string") {
              addAddressToSelectedList(user);
              setSearchValue("");
              setAutocompleteKey(new Date().getTime());
            }
          }}
          options={autocompleteUsers}
          renderOption={option => {
            let userName = `@${option.urlSlug}`;
            userName =
              userName.length > 17
                ? userName.substr(0, 14) + "..." + userName.substr(userName.length - 2, 2)
                : userName;
            return (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                padding="0 6px 6px"
                width="100%"
                style={{
                  borderBottom: "1px solid #00000021",
                }}
              >
                <Box display="flex" alignItems="center">
                  <Avatar noBorder url={option.avatar} size="medium" />
                  <Box ml="11px" fontFamily="Montserrat" color="#404658" fontSize="16px">
                    {userName}
                  </Box>
                </Box>
                <Box
                  display="flex"
                  color="#65CB63"
                  fontFamily="Montserrat"
                  fontWeight={600}
                  alignItems="center"
                >
                  Invite Artist
                  <div className={classes.addRound}>
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 13 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6.5 11.5V1.5M1.5 6.5L11.5 6.5"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Box>
              </Box>
            );
          }}
          getOptionLabel={option => `@${option.urlSlug}`}
          filterOptions={(options, _) =>
            options.filter(option => !pod.Collabs.find(collab => collab.address === option.address))
          }
          renderInput={params => (
            <InputBase
              value={searchValue}
              onChange={event => {
                setSearchValue(event.target.value);
              }}
              ref={params.InputProps.ref}
              inputProps={params.inputProps}
              style={{
                width: "100%",
                fontFamily: "Montserrat",
                fontSize: "16px",
                fontWeight: 600,
                color: "#2D3047",
              }}
              autoFocus
              placeholder="Type User"
            />
          )}
        />
        <img src={searchIcon} alt={"search"} />
      </div>
      {pod.Collabs && pod.Collabs.filter(u => u.address !== user.address).length > 0 && (
        <>
          <Box
            mt="22px"
            display="flex"
            alignItems="center"
            color="#2D3047"
            fontFamily="Montserrat"
            fontSize="14px"
            mb="14px"
            justifyContent="space-between"
          >
            <div>Artist</div>
            <div>Status</div>
          </Box>
          {pod.Collabs.map((u, index) =>
            u.address !== user.address ? (
              <UserTile
                key={`user-${index}-tile`}
                user={u}
                onClick={() => removeAddressFromSelectedList(u)}
              />
            ) : null
          )}
        </>
      )}
      <button
        className={classes.addButton}
        onClick={() => {
          if (searchValue !== "" && !pod.Collabs.includes(searchValue))
            addAddressToSelectedList({ address: searchValue });
        }}
      >
        <svg width="10" height="10" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.5 11.5V1.5M1.5 6.5L11.5 6.5"
            stroke="#431AB7"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Add Wallet Address
      </button>
    </>
  );
};

const UserTile = ({ user, onClick }) => {
  const classes = collabsTabStyles();

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      className={classes.userTile}
      onClick={onClick}
    >
      <Box display="flex" alignItems="center">
        {user.avatar && <Avatar noBorder url={user.avatar} size="medium" />}
        <Box className={classes.urlSlug}>
          {`@${user.urlSlug}` ?? user.address}
        </Box>
      </Box>
      <Box display="flex" alignItems="center">
        <Box className={classes.invitationSentBtn}>Invitation sent</Box>
        <button className={classes.removeButton} onClick={onClick}>
          <svg width="10" height="10" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1.5 6.5L11.5 6.5"
              stroke="red"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </Box>
    </Box>
  );
};

export default CollabsTab;
