import { makeStyles } from "@material-ui/core";
import styled from "styled-components";

import { Gradient } from "shared/ui-kit";

export type RedTextProps = React.PropsWithChildren<{
  fontSize?: string;
  pointer?: boolean;
  bold?: boolean;
}>;

export const RedText = styled.div<RedTextProps>`
  font-size: ${p => p.fontSize ?? "18px"};
  background: ${Gradient.LightRed};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-decoration: none;
  font-weight: ${p => (p.bold ? 800 : 400)};
  cursor: ${p => (p.pointer ? "cursor" : "inherit")};
`;

export const profileFollowsModalStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "597px !important",
    fontSize: "16px",
    background: '#1E2026 !important',
    color: "#ffffff !important",
    "& h3": {
      color: "#ffffff",
      margin: "18px 0px 16px",
      fontSize: 18,
    },
    "& h4": {
      color: "#ffffff",
      margin: 0,
      fontSize: "16px",
    },
    "& button": {
      borderRadius: 20,
      padding: "4px 12px 4px 10px",
      minHeight: 0,
      minWidth: 0,
      margin: 0,
      width: "auto",
      height: "auto",
      fontSize: 14,
      border: "none",
    },
  },

  filterPill: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: "7px 14px 6px",
    borderRadius: 36,
    marginRight: 8,
    background: "linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%);",
    fontSize: "14px",
    fontWeight: 800,
    color: "#ffffff",
    cursor: "pointer",
  },
  filterPillSelected: {
    color: "#FF5954",
    background: "#ffffff !important",
  },
  usersList: {
    maxHeight: "300px",
    overflowY: "auto",
  },
  slider: {
    width: "100%",
  },

  optionsConnectionButtonUnfollow: {
    background: "linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%)",
    color: "#1A1A1C",
  },
  optionsConnectionButtonRequest: {
    background: "linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%)",
    color: "#1A1A1C",
  },
  optionsConnectionButton: {
    background: "linear-gradient(225.12deg, #F2A07E -33.5%, #FF5954 71.42%)",
    color: "#1A1A1C",
  },
}));
