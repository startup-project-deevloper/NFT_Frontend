import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import cls from "classnames";

import { FormControl, FormControlLabel, Radio, RadioGroup } from "@material-ui/core";

import { getCollectionsForPlatforms } from "./CollectionsSelect";

import DigitalArtContext, { ethereumList } from "shared/contexts/DigitalArtContext";
import { Color, SecondaryButton } from "shared/ui-kit";
import { BlockchainType, PlatformType, MediaStatus } from "shared/services/API";
import StyledCheckbox from "shared/ui-kit/Checkbox";
import { SearchWithCreate } from "shared/ui-kit/SearchWithCreate";
import Box from "shared/ui-kit/Box";

import { filtersStyles } from "./index.styles";

export default function Filters({ filters, onFiltersChange, showStatus = true }) {
  const classes = filtersStyles();
  const { setOpenFilters } = useContext(DigitalArtContext);

  const [blockChains, setBlockChains] = useState(filters.blockChains);
  const [platforms, setPlatforms] = useState(filters.platforms);
  const [status, setStatus] = useState(filters.status);
  const [collection, setCollection] = useState(filters.collection);

  const [collectionSearch, setCollectionSearch] = useState<string>("");
  const [allCollections, setAllCollections] = useState(() => getCollectionsForPlatforms(platforms, blockChains));

  useEffect(() => {
    if (filters) {
      setBlockChains(filters.blockChains);
      setPlatforms(filters.platforms);
      setStatus(filters.status);
      setCollection(filters.collection);
    }
  }, [filters]);

  useEffect(() => {
    setAllCollections(getCollectionsForPlatforms(platforms, blockChains));
  }, [blockChains, platforms]);

  useEffect(() => {
    if (!selectedCollectionItem) {
      setCollection(undefined);
    }
  }, [setCollection]);

  const filteredCollections = allCollections.filter(collection =>
    collectionSearch ? collection.name.toUpperCase().includes(collectionSearch.toUpperCase()) : true
  );

  const selectedCollectionItem = useMemo(() => allCollections.find(item => item.name === collection), [
    allCollections,
    collection,
  ]);

  const handleBlockchainFitler = (item: BlockchainType, platform: PlatformType) => {
    let chainList = [...blockChains];
    let platformList = [...platforms];
    if (item === BlockchainType.Eth) {
      if (chainList.includes(item)) {
        platformList = platformList.filter((l: PlatformType) => !ethereumList.includes(l));
        chainList = chainList.filter((l: BlockchainType) => l !== BlockchainType.Eth);
      } else {
        ethereumList.forEach((l: PlatformType) => !platformList.includes(l) && platformList.push(l));
        chainList.push(BlockchainType.Eth);
      }
    } else {
      if (chainList.includes(item)) {
        chainList = chainList.filter((l: BlockchainType) => l !== item);
        platformList = platformList.filter((l: PlatformType) => l !== platform)
      } else {
        chainList.push(item);
        platformList.push(platform);
      }
    }
    if (!platformList.length && chainList.length === 1 && chainList.includes(BlockchainType.Eth)) {
      platformList.push(PlatformType.Showtime);
    } else {
      platformList = platformList.filter((l: PlatformType) => l !== PlatformType.Showtime);
    }

    setBlockChains(chainList);
    setPlatforms(platformList);
  }

  const handlePlatformFitler = (item: PlatformType) => {
    let chainList = [...blockChains];
    let platformList = [...platforms];

    if (platformList.includes(item)) {
      platformList = platformList.filter((l: PlatformType) => l !== item);
    } else {
      if (ethereumList.includes(item) && !chainList.includes(BlockchainType.Eth)) {
        chainList.push(BlockchainType.Eth);
      }
      platformList.push(item);
    }

    if (!platformList.length && chainList.length === 1 && chainList.includes(BlockchainType.Eth)) {
      platformList.push(PlatformType.Showtime);
    } else {
      platformList = platformList.filter((l: PlatformType) => l !== PlatformType.Showtime);
    }

    setBlockChains(chainList);
    setPlatforms(platformList);
  }

  const toggleStatus = e => {
    const targetStatus = e.target.value;
    setStatus(currentStatus => (currentStatus === targetStatus ? undefined : targetStatus));
  };

  const handleFilterApply = () => {
    onFiltersChange({
      ...filters,
      blockChains,
      platforms,
      status,
      collection,
    });
  };

  return (
    <div className={classes.filters}>
      <div className={classes.content}>
        <Box display="flex" justifyContent="space-between" alignItems="center" marginBottom="25px">
          <h4>Filters</h4>
          <img
            src={require("assets/icons/cross_white.png")}
            alt="close"
            onClick={() => {
              setOpenFilters(false);
            }}
          />
        </Box>

        <div className={classes.options}>
          {showStatus && (
            <>
              <h5>🛎 Status</h5>
              <FormControl>
                <RadioGroup value={status} onChange={toggleStatus}>
                  <FormControlLabel
                    value={MediaStatus.All}
                    control={<Radio />}
                    label={
                      <Box fontFamily="Agrandir" fontSize={14} fontWeight={400} color="white">
                        All
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value={MediaStatus.BuyNow}
                    control={<Radio />}
                    label={
                      <Box fontFamily="Agrandir" fontSize={14} fontWeight={400} color="white">
                        Buy now
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value={MediaStatus.OnAuction}
                    control={<Radio />}
                    label={
                      <Box fontFamily="Agrandir" fontSize={14} fontWeight={400} color="white">
                        On auction
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value={MediaStatus.New}
                    control={<Radio />}
                    label={
                      <Box fontFamily="Agrandir" fontSize={14} fontWeight={400} color="white">
                        New
                      </Box>
                    }
                  />
                  <FormControlLabel
                    value={MediaStatus.LiveNow}
                    control={<Radio />}
                    label={
                      <Box fontFamily="Agrandir" fontSize={14} fontWeight={400} color="white">
                        Live now
                      </Box>
                    }
                  />
                </RadioGroup>
              </FormControl>

              <div className={classes.divider} />
            </>
          )}
          <h5>🔗 Blockchain</h5>
          <Box display="flex" flexDirection="column">
            <Box
              display="flex"
              alignItems="center"
              onClick={() => {
                handleBlockchainFitler(BlockchainType.Privi, PlatformType.Privi);
              }}
              marginBottom="16px"
            >
              <StyledCheckbox
                buttonColor={Color.White}
                checked={blockChains.includes(BlockchainType.Privi) ? true : false}
                name="checked"
              />
              <Box fontSize={14} fontWeight={400} color="white">
                PRIVI
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              onClick={() => {
                handleBlockchainFitler(BlockchainType.Eth, PlatformType.Showtime);
              }}
              marginBottom="16px"
            >
              <StyledCheckbox
                buttonColor={Color.White}
                checked={blockChains.includes(BlockchainType.Eth) ? true : false}
                name="checked"
              />
              <Box fontSize={14} fontWeight={400} color="white">
                Ethereum
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              onClick={() => {
                handleBlockchainFitler(BlockchainType.Wax, PlatformType.Wax);
              }}
              marginBottom="16px"
            >
              <StyledCheckbox
                buttonColor={Color.White}
                checked={blockChains.includes(BlockchainType.Wax) ? true : false}
                name="checked"
              />
              <Box fontSize={14} fontWeight={400} color="white">
                WAX
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              onClick={() => {
                handleBlockchainFitler(BlockchainType.Hicetnunc, PlatformType.Hicetnunc);
              }}
              marginBottom="16px"
            >
              <StyledCheckbox
                buttonColor={Color.White}
                checked={blockChains.includes(BlockchainType.Hicetnunc) ? true : false}
                name="checked"
              />
              <Box fontSize={14} fontWeight={400} color="white">
                Hicetnunc
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              onClick={() => {
                handleBlockchainFitler(BlockchainType.Binance, PlatformType.Binance);
              }}
              marginBottom="16px"
            >
              <StyledCheckbox
                buttonColor={Color.White}
                checked={blockChains.includes(BlockchainType.Binance) ? true : false}
                name="checked"
              />
              <Box fontSize={14} fontWeight={400} color="white">
                Binance
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              onClick={() => {
                handleBlockchainFitler(BlockchainType.Klaytn, PlatformType.Opensea);
              }}
              marginBottom="16px"
            >
              <StyledCheckbox
                buttonColor={Color.White}
                checked={blockChains.includes(BlockchainType.Klaytn) ? true : false}
                name="checked"
              />
              <Box fontSize={14} fontWeight={400} color="white">
                Klaytn
              </Box>
            </Box>

            <Box
              display="flex"
              alignItems="center"
              onClick={() => {
                handleBlockchainFitler(BlockchainType.Polygon, PlatformType.Opensea);
              }}
            >
              <StyledCheckbox
                buttonColor={Color.White}
                checked={blockChains.includes(BlockchainType.Polygon) ? true : false}
                name="checked"
              />
              <Box fontSize={14} fontWeight={400} color="white">
                Polygon
              </Box>
            </Box>
          </Box>

          <div className={classes.divider} />

          <Box display="flex" flexDirection="column">
            <Box
              className={cls(
                { [classes.blockchainSelected]: platforms.includes(PlatformType.Zora) },
                classes.blockchainOption
              )}
              onClick={() => handlePlatformFitler(PlatformType.Zora)}
            >
              <img src={require("assets/priviIcons/zora_icon.png")} alt="zora" />
              <span>Zora</span>
            </Box>
            <Box
              className={cls(
                { [classes.blockchainSelected]: platforms.includes(PlatformType.Opensea) },
                classes.blockchainOption
              )}
              onClick={() => handlePlatformFitler(PlatformType.Opensea)}
            >
              <img src={require("assets/priviIcons/opensea_icon.png")} alt="opensea" />
              <span>Opensea</span>
            </Box>
            <Box
              className={cls(
                { [classes.blockchainSelected]: platforms.includes(PlatformType.Mirror) },
                classes.blockchainOption
              )}
              onClick={() => handlePlatformFitler(PlatformType.Mirror)}
            >
              <img src={require("assets/priviIcons/mirror_icon.png")} alt="mirro" />
              <span>Mirror</span>
            </Box>
            {/* <Box
              className={cls(
                { [classes.blockchainSelected]: platforms.includes(PlatformType.Sorare) },
                classes.blockchainOption
              )}
              onClick={() => handlePlatformFitler(PlatformType.Sorare)}
            >
              <img src={require("assets/priviIcons/sorare_icon.png")} alt="sorare" />
              <span>Sorare</span>
            </Box> */}
            <Box
              className={cls(
                { [classes.blockchainSelected]: platforms.includes(PlatformType.Topshot) },
                classes.blockchainOption
              )}
              onClick={() => handlePlatformFitler(PlatformType.Topshot)}
            >
              <img src={require("assets/priviIcons/top_shot_icon.png")} alt="topshot" />
              <span>Topshot</span>
            </Box>
            <Box
              className={cls(
                { [classes.blockchainSelected]: platforms.includes(PlatformType.Foundation) },
                classes.blockchainOption
              )}
              onClick={() => handlePlatformFitler(PlatformType.Foundation)}
            >
              <img src={require("assets/priviIcons/foundation_icon.png")} alt="foundation" />
              <span>Foundation</span>
            </Box>
            {/* <Box
              className={cls(
                { [classes.blockchainSelected]: platforms.includes(PlatformType.Showtime) },
                classes.blockchainOption
              )}
              onClick={() => handlePlatformFitler(PlatformType.Showtime)}
            >
              <img src={require("assets/priviIcons/showtime_icon.png")} alt="showtime" />
              <span>Showtime</span>
            </Box> */}
          </Box>

          <div className={classes.divider} />

          <h5>🕳 Collections</h5>

          {selectedCollectionItem && (
            <div className={classes.collectionItem}>
              <div
                style={{
                  backgroundImage:
                    selectedCollectionItem.imageURL && selectedCollectionItem.imageURL.length > 0
                      ? `url(${require(`assets/collectionImages/${selectedCollectionItem.imageURL}`)})`
                      : "none",
                }}
              />
              {selectedCollectionItem.label ?? ""}
              <img
                style={{ marginRight: "7px" }}
                src={require("assets/icons/cross_white.png")}
                alt="clear"
                onClick={() => {
                  setCollection(undefined);
                  setCollectionSearch("");
                }}
              />
            </div>
          )}
          {!selectedCollectionItem && (
            <>
              <div className={classes.searcher}>
                <SearchWithCreate
                  searchValue={collectionSearch}
                  handleSearchChange={event => setCollectionSearch(event.target.value)}
                  searchPlaceholder={"Search"}
                  autoFocus={false}
                />
              </div>
              <div className={classes.collectionItems}>
                {filteredCollections.length > 0 ? (
                  filteredCollections.map((collection, index) => (
                    <div
                      className={classes.collectionItem}
                      key={`collection-${index}`}
                      onClick={() => setCollection(collection.name)}
                    >
                      <div
                        style={{
                          backgroundImage:
                            collection.imageURL && collection.imageURL.length > 0
                              ? `url(${require(`assets/collectionImages/${collection.imageURL}`)})`
                              : "none",
                        }}
                      />
                      {collection.label ?? ""}
                    </div>
                  ))
                ) : (
                  <div>No items</div>
                )}
              </div>
            </>
          )}
        </div>

        <Box display="flex" flexDirection="column">
       
          <SecondaryButton size="medium" onClick={handleFilterApply}>
            Apply
          </SecondaryButton>
          <SecondaryButton
            size="medium"
            onClick={() => {
              setOpenFilters(false);
            }}
          >
            Cancel
          </SecondaryButton>
        </Box>
      </div>
    </div>
  );
}
