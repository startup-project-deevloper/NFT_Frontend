import React from "react";
import cls from "classnames";

import Box from "shared/ui-kit/Box";

import { collectionCardStyles } from "./index.styles";
import { useHistory } from "react-router-dom";

export default function CollectionCard({ item, heightFixed }) {
  const classes = collectionCardStyles();
  const history = useHistory();

  const handleClick = () => {
    history.push({
      pathname: `/explorer/${item.name}`,
      state: {
        blockChain: item.blockChain,
      },
    });
  };

  return (
    <div
      className={classes.card}
      onClick={handleClick}
    >
      {heightFixed ? (
        <div
          className={cls(classes.image, classes.fixed)}
          style={{
            backgroundImage:
              item.imageURL && item.imageURL !== ""
                ? `url(${require(`assets/collectionImages/${item.imageURL}`)})`
                : "none",
          }}
        />
      ) : (
        <img
          src={require(`assets/collectionImages/${item.imageURL}`)}
          alt={item.name}
          className={classes.image}
        />
      )}
      <div className={classes.info}>
        <div
          className={classes.avatar}
          style={{
            backgroundImage:
              item.blockChain && item.blockChain !== ""
                ? `url(${require(`assets/chainImages/${item.blockChain}.png`)})`
                : "none",
          }}
        />
        <Box display="flex" flexDirection="column">
          <div className={classes.black}>{item.label}</div>
          {item.description && <div className={classes.gray}>{item.description}</div>}
        </Box>
      </div>
    </div>
  );
}
