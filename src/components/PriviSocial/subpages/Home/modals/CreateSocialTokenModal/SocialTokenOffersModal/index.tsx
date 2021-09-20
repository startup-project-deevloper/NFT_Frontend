import { createStyles, makeStyles } from "@material-ui/core";
import React, { useState } from "react";
import { TabNavigation } from "shared/ui-kit";
import RequestAssistanceChatTab from "../RequestAssistance/components/ChatTab";
import RequestAssistanceTokenOffersTab from "../RequestAssistance/components/OffersTab";

const useStyles = makeStyles(() =>
  createStyles({
    content: {
      width: "600px",
      display: "flex",
      flexDirection: "column",
      "& h5": {
        margin: "0px 0px 16px",
        fontStyle: "normal",
        fontWeight: "bold",
        fontSize: "18px",
        color: "#181818",
      },
      "& label": {
        fontStyle: "normal",
        fontWeight: "normal",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        color: "#181818",
        "& img": {
          marginLeft: "8px",
        },
      },
      "& .MuiOutlinedInput-root": {
        width: "100%",
        height: 40,
      },
      "& .MuiOutlinedInput-input": {
        padding: "14px",
      },
      "& .MuiFormControl-root": {
        marginTop: "8px",
        width: "100%",
        marginBottom: "20px",
      },
    },
    appbarContainer: {
      width: "100%",
      marginBottom: "20px",

      "& .MuiAppBar-root": {
        paddingLeft: "0 !important",
      },
      "& .MuiTab-root": {
        minWidth: "auto",
      },
    },
  })
);

export default function SocialTokenOffersModal({
  socialToken,
  setSocialToken,
  setTokenPhoto,
  setRequestAssistance,
  tokenList,
  handleRefresh,
  handleClose,
}) {
  const classes = useStyles();
  const [menuSelection, setMenuSelection] = useState<number>(0);
  const [status, setStatus] = useState<any>();
  const [tabs, setTabs] = useState<string[]>(["Offers", "Chat"]);

  return (
    <>
      <div className={classes.appbarContainer}>
        <TabNavigation
          tabs={tabs}
          currentTab={menuSelection}
          variant="primary"
          size="large"
          theme="green"
          onTabChange={setMenuSelection}
        />
      </div>

      <div className={classes.content}>
        {menuSelection === 0 ? (
          <RequestAssistanceTokenOffersTab setRequestAssistance={setRequestAssistance} />
        ) : (
          <RequestAssistanceChatTab
            socialToken={socialToken}
            setSocialToken={setSocialToken}
            isCreator={true}
          />
        )}
      </div>
    </>
  );
}
