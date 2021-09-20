import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

type WrapperProps = React.PropsWithChildren<{
  isMusic: boolean;
  isArt: boolean;
  isZoo: boolean;
}>;

const Wrapper = styled.div<WrapperProps>`
  background: ${p => `${!p.isZoo && p.isArt ? "#9eacf2" : "inherit"}`};
  padding: ${p => `${!p.isZoo && p.isArt ? "20px 36px" : "0"}`};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: ${p =>
    `${p.isZoo ? "120px" : !p.isZoo && p.isMusic ? "35px" : !p.isZoo && p.isArt ? "0px" : "48px"}`};
  cursor: pointer;
  @media (max-width: 768px) {
    border-bottom: none;
  }
  /*@media only screen and (max-width: 600px) {
    margin-right: 0px;
    img:first-child {
      width: 70px;
    }
  }*/
  img:first-child:not(> div img) {
    width: 120px;
  }
  > div > img {
    margin-left: 15px;
    width: 10px !important;
  }
`;

const menuOptions = [
  "privi_music",
  "privi_pix_alpha",
  "privi_wallet",
  "privi_data",
  "privi_dao",
  "privi_pods",
  "privi_collab",
  "privi-trax-beta",
  "privi_zoo",
  "privi_social",
  "privi_metaverse",
  "privi_flix",
];

export default function PriviAppIcon(props) {
  const history = useHistory();

  const pathName = window.location.href;

  const [openMenu, setOpenMenu] = React.useState(false);
  const anchorMenuRef = React.useRef<HTMLImageElement>(null);

  const pathPrefix = React.useMemo(() => {
    const pathPrefixList = pathName.split("/");
    return pathPrefixList.length > 4 ? pathPrefixList[4] : "zoo";
  }, [pathName]);

  const handleToggleMenu = e => {
    e.stopPropagation();
    e.preventDefault();
    setOpenMenu(prevMenuOpen => !prevMenuOpen);
  };

  const handleCloseMenu = (event: React.MouseEvent<EventTarget>) => {
    if (anchorMenuRef.current && anchorMenuRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpenMenu(false);
  };

  function handleListKeyDownMenu(e: React.KeyboardEvent) {
    if (e.key === "Tab") {
      e.preventDefault();
      setOpenMenu(false);
    }
  }

  return (
    <Wrapper
      isMusic={pathPrefix !== "trax" && pathPrefix === "privi-music"}
      isArt={pathPrefix === "pix"}
      isZoo={pathPrefix === "zoo"}
      onClick={handleToggleMenu}
    >
      {pathPrefix === "pix" && !props.isTransparent ? (
        <img
          onClick={() => {
            let root = pathName.toLowerCase().includes("/zoo/page")
              ? "/zoo"
              : pathPrefix === "pix"
              ? "/pix/"
              : "/";
            history.push(root);
          }}
          style={{
            width: 136,
          }}
          src={require('assets/logos/privi_pix_alpha.svg')}
          alt="privi"
        />
      ) : (
        <img
          onClick={() => {
            let root = pathName.toLowerCase().includes("/zoo/page")
              ? "/zoo"
              : pathPrefix === "pix"
              ? "/pix/"
              : "/";
            history.push(root);
          }}
          style={
            pathPrefix === "social"
              ? { height: "40px" }
              : pathName.toLowerCase().includes("/zoo/page")
              ? { height: "50px" }
              : undefined
          }
          src={require(`assets/logos/${
            pathName.toLowerCase().includes("zoo/page")
              ? "privi_zoo_logo_beta"
              : pathPrefix === "trax"
              ? menuOptions[7]
              : pathPrefix === "metaverse"
              ? menuOptions[10]
              : pathPrefix === "music"
              ? menuOptions[0]
              : pathPrefix === "pix"
              ? `${menuOptions[1]}`
              : pathPrefix === "wallet"
              ? menuOptions[2]
              : pathPrefix === "data"
              ? menuOptions[3]
              : pathPrefix === "daos"
              ? menuOptions[4]
              : pathPrefix === "pods"
              ? menuOptions[5]
              : pathPrefix === "collabs"
              ? menuOptions[6]
              : pathPrefix === "social"
              ? menuOptions[9]
              : pathPrefix === "flix"
              ? menuOptions[11]
              : menuOptions[8]
          }${!pathName.toLowerCase().includes("/zoo/page") && props.isTransparent ? "_white" : ""}.png`)}
          alt="privi"
        />
      )}
      {/* <div ref={anchorMenuRef}>
        {!pathName.toLowerCase().includes("trax") && (
          <img
            src={require(`assets/icons/${
              props.isTransparent || pathName.toLowerCase().includes("pix")
                ? "arrow_white_right"
                : "arrow"
            }.png`)}
            alt="arrow"
            style={{ transform: openMenu ? "rotate(270deg)" : "rotate(90deg)" }}
          />
        )}
        <Popper
          open={openMenu}
          anchorEl={anchorMenuRef.current}
          transition
          disablePortal
          style={{ top: pathName.toLowerCase().includes("trax") ? 0 : -10, zIndex: 3 }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: placement === "bottom" ? "center top" : "center bottom",
                position: "inherit",
              }}
            >
              <Paper className={classes.paper}>
                <ClickAwayListener onClickAway={handleCloseMenu}>
                  <MenuList autoFocusItem={openMenu} onKeyDown={handleListKeyDownMenu}>
                    {menuOptions
                      .filter(
                        o =>
                          (pathName.toLowerCase().includes("pix") &&
                            !o.toLowerCase().includes("pix")) ||
                          (pathName.toLowerCase().includes("trax") &&
                            !o.toLowerCase().includes("privi_music_dao")) ||
                          (!pathName.toLowerCase().includes("pix") &&
                            !pathName.toLowerCase().includes("trax") &&
                            !pathName.toLowerCase().includes(o.replace("_", "-")))
                      )
                      .map((option, index) => (
                        <StyledMenuItem
                          key={`option-${index}`}
                          onClick={e => {
                            handleCloseMenu(e);
                            history.push(
                              `/${
                                option.includes("art")
                                  ? "pix"
                                  : option.includes("pods")
                                  ? "pods"
                                  : option.includes("music_dao")
                                  ? "trax"
                                  : option.replace("_", "-")
                              }${option.includes("data") ? "-new" : ""}${
                                option.includes("social") ? `/${props.id ?? user.urlSlug ?? user.id}` : ""
                              }`
                            );
                          }}
                          style={{
                            paddingTop: option.includes("music_dao") ? 10 : undefined,
                            paddingBottom: option.includes("music_dao") ? 10 : undefined,
                          }}
                        >
                          {
                            <img
                              src={require(`assets/logos/${option}.png`)}
                              alt={option}
                              height={option.includes("music_dao") ? undefined : 40}
                              width={option.includes("music_dao") ? undefined : 132}
                            />
                          }
                        </StyledMenuItem>
                      ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div> */}
    </Wrapper>
  );
}
