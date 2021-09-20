import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "store/reducers/Reducer";
import Discord from "shared/ui-kit/Page-components/Discord/Discord";

const arePropsEqual = (prevProps, currProps) => {
  return prevProps.pod === currProps.pod;
};

const Chat = React.memo((props: any) => {
  const userSelector = useSelector((state: RootState) => state.user);
  const users = useSelector((state: RootState) => state.usersInfoList);

  const [userIsInCommunity, setUserIsInCommunity] = useState<boolean>(false);

  useEffect(() => {
    let isInCommunity: boolean = false;
    if (props.pod) {
      if (props.pod.Creator && props.pod.Creator === userSelector.id) {
        isInCommunity = true;
      }

      let members: any[] = [];

      if (props.pod.Collabs) {
        members = Object.keys(props.pod.Collabs || {}) || [];
      }

      if (members && members.length > 0) {
        let indexMemberV2 = members.findIndex(address => address === userSelector.address);
        if (indexMemberV2 !== -1) {
          isInCommunity = true;
        }
      }

      setUserIsInCommunity(isInCommunity);
    }
  }, []);

  return (
    <>
      {userIsInCommunity && users && users.length > 0 ? (
        <Discord
          discordId={props.pod.JarrId}
          sidebar={false}
          type={"Community-Jar"}
          id={props.pod.id}
          community={props.pod}
          showAll={false}
        />
      ) : (
        <p>Join to see Chat</p>
      )}
    </>
  );
}, arePropsEqual);

export default Chat;
