import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Box from "shared/ui-kit/Box";

import { priviCardStyles } from "./index.styles";

const PriviCard = ({
  item,
  hideAvatar = true,
  showMark = false,
  customWidth = "auto",
  showEarlyAccess = false,
}) => {
  const classes = priviCardStyles();
  const history = useHistory();

  const [cardImage, setCardImage] = useState(require("assets/backgrounds/privi_art.png"));

  useEffect(() => {
    if (item.photo[0]) {
      setCardImage(item.photo[0]);
    }
  }, [item]);

  const handlePriviApp = () => {
    history.push(`/zoo/page/${item.url}`);
  };

  const handleOpenApp = e => {
    e.preventDefault();
    e.stopPropagation();
    history.push(`${item?.connect}`);
  };

  return (
    <Box className={classes.container} style={{ width: customWidth }} onClick={handlePriviApp}>
      <img src={cardImage} className={classes.topImg} style={{ objectFit: "cover" }} />
      <Box px={2}>
        <Box className={classes.header1} mt={2}>
          {item.name}
        </Box>
        {hideAvatar &&
          (!item.isPublished ? (
            <Box className={classes.comingSoon} mt={2}>
              Coming Soon
            </Box>
          ) : (
            <Box className={classes.testNet} mt={2}>
              Testnet
            </Box>
          ))}
        <Box
          className={classes.header2}
          mt={!item.isPublished && !hideAvatar ? 3 : 2}
          style={{
            borderTop: !item.isPublished ? "1px solid #18181822" : "none",
          }}
          pt={!item.isPublished ? 3 : 0}
        >
          {item.description}
        </Box>
        {showEarlyAccess && item.isPublished && (
          <Box display="flex" justifyContent="center" mt={"24px"}>
            <span
              className={"earlyAccess-card"}
              onClick={handleOpenApp}
              style={{
                textTransform: "capitalize",
                padding: "10.5px 6px",
                width: "80%",
                borderRadius: 38,
                fontSize: 16,
                display: "flex",
                justifyContent: "center",
                minWidth: "fit-content",
                fontWeight: 800,
                cursor: "pointer",
                color: "#ffffff",
              }}
            >
              {item.name === "Privi Exchange" ? "Live On Testnet" : "early access"}
            </span>
          </Box>
        )}
      </Box>
      {/* {showMark && (
        <Box
          className={classes.flexBox}
          style={{ position: "absolute", bottom: "10px", justifyContent: "center" }}
          width={1}
        >
          <Box
            style={{
              width: "40px",
              height: "10px",
              borderTop: "2px solid #18181822",
              borderBottom: "2px solid #18181822",
            }}
          />
        </Box>
      )} */}
    </Box>
  );
};

export default PriviCard;
