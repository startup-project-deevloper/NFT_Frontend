import { MessageBox } from "components/PriviSocial/components/Message/MessageBox";
import React from "react";

export default function Messenger({ type="social" }) {
  return <MessageBox type={type}/>;
}
