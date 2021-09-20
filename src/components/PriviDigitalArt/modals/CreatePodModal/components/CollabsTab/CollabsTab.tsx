import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { collabsTabStyles } from "./CollabsTab.styles";
import { Autocomplete } from "@material-ui/lab";
import { InputBase } from "@material-ui/core";
import { RootState } from "store/reducers/Reducer";
import { Avatar } from "shared/ui-kit";
import Box from "shared/ui-kit/Box";
import { getRandomAvatar } from "shared/services/user/getUserAvatar";
import { getMatchingUsers, IAutocompleteUsers } from "shared/services/API";

const searchIcon = require("assets/icons/search.png");

const CollabsTab = ({ pod, setPod }) => {
  const classes = collabsTabStyles();
  const user = useSelector((state: RootState) => state.user);

  const [autocompleteKey, setAutocompleteKey] = useState<number>(new Date().getTime());

  const [searchValue, setSearchValue] = useState<string>("");
  const [autocompleteUsers, setAutocompleteUsers] = useState<IAutocompleteUsers[]>([]);

  // refresh autocomplete user list when searchValue changed
  useEffect(() => {
    if (searchValue) {
      getMatchingUsers(searchValue, ["firstName", "address"]).then(resp => {
        if (resp?.success)
          setAutocompleteUsers(resp.data.filter(u => u.address && u.address != user.address));
      });
    } else setAutocompleteUsers([]);
  }, [searchValue]);

  const addAddressToSelectedList = user => {
    const newCollabs = [...pod.Collabs];
    newCollabs.push(user);
    setPod({ ...pod, Collabs: newCollabs });
  };

  console.log(autocompleteUsers);

  return (
    <>
      <div className={classes.inputContainer}>
        <Autocomplete
          freeSolo
          key={autocompleteKey}
          className={classes.autocomplete}
          onChange={(event: any, user: any | null) => {
            if (user && typeof user !== "string") {
              addAddressToSelectedList(user);
              setSearchValue("");
              setAutocompleteKey(new Date().getTime());
            }
          }}
          options={autocompleteUsers}
          renderOption={option => (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              className={classes.itemContainer}
            >
              <Box display="flex" alignItems="center">
                <Avatar noBorder url={option.imageUrl ? option.imageUrl : option.anonAvatar? require("assets/anonAvatars/" + option.anonAvatar) : getRandomAvatar()} size="medium" />
                <Box className={classes.itemUsername}>
                  @
                  {option.urlSlug && !option.urlSlug.startsWith("Px")
                    ? option.urlSlug
                    : option?.name ?? ""}
                </Box>
              </Box>
              <Box display="flex" flexDirection="row" alignItems="center">
                <span className={classes.itemDescription}>Request Support</span>
                <div className={classes.addRound}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="24" height="24" rx="12" fill="#431AB7" />
                    <path
                      d="M12.0007 16.668V7.33464M7.33398 12.0013L16.6673 12.0013"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Box>
            </Box>
          )}
          getOptionLabel={option =>
            option.urlSlug && option.urlSlug.startsWith("Px") ? `@${option.urlSlug}` : `@${option.name}`
          }
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
              autoFocus
              placeholder="Type User"
            />
          )}
        />
        <img src={searchIcon} alt={"search"} />
      </div>
      {pod.Collabs && (
        <Box className={classes.artists} mt={3} mb={3}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            bgcolor="#431AB7"
            padding={1}
            fontSize={12}
            color={"white"}
          >
            <div>Artist</div>
            <div>Status</div>
          </Box>
          {pod.Collabs.map((u, index) =>
            u.address != user.address ? <UserTile key={`user-${index}-tile`} user={u} /> : null
          )}
        </Box>
      )}
      {/* <Box
        className={classes.addButton}
        onClick={() => {
          if (searchValue !== "" && !pod.Collabs.includes(searchValue))
            addAddressToSelectedList({ address: searchValue });
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="12" fill="#431AB7" />
          <path
            d="M12.0007 16.668V7.33464M7.33398 12.0013L16.6673 12.0013"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Add Wallet Address
      </Box> */}
    </>
  );
};

const UserTile = ({ user }) => {

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" padding={1} fontSize={12}>
      {user.imageUrl || user.anonAvatar ? (
        <Box display="flex" alignItems="center">
          <Avatar
            noBorder
            url={typeof user !== "string" && user.imageUrl ? user.imageUrl : require("assets/anonAvatars/" + user.anonAvatar)}
            size="medium"
          />
          <Box ml="11px" color="#1A1B1C" fontSize="12px">
            @{user.urlSlug && !user.urlSlug.startsWith("Px") ? user.urlSlug : user.name ?? ""}
          </Box>
        </Box>
      ) : (
        user.address ?? ""
      )}
      <Box color="#431AB7" fontSize="12px">
        Invitation sent
      </Box>
    </Box>
  );
};

export default CollabsTab;
