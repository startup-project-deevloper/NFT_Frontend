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
    <Wrapper isMusic={false} isArt={true} isZoo={false} onClick={handleToggleMenu}>
      <img
        onClick={() => {
          history.push("/");
        }}
        style={{
          width: 136,
        }}
        src={require("assets/logos/privi_pix_alpha.svg")}
        alt="privi"
      />
    </Wrapper>
  );
}
