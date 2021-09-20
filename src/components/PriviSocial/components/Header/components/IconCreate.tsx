import React from "react";

export const IconCreate: React.FunctionComponent<{ isActive: boolean }> = ({ isActive }) => (
  <svg width="26" height="26" viewBox="0 0 26 26">
    <path
      fill={isActive ? "#00FF15" : "#727F9A"}
      d="M13.8,7.7c0-0.4-0.3-0.8-0.8-0.8s-0.8,0.3-0.8,0.8H13.8z M12.3,18.3c0,0.4,0.3,0.8,0.8,0.8s0.8-0.3,0.8-0.8
	H12.3z M7.7,12.3c-0.4,0-0.8,0.3-0.8,0.8s0.3,0.8,0.8,0.8V12.3z M18.3,13.8c0.4,0,0.8-0.3,0.8-0.8s-0.3-0.8-0.8-0.8V13.8z M12.3,7.7
	v10.7h1.5V7.7H12.3z M7.7,13.8h10.7v-1.5H7.7V13.8z M24.3,13c0,6.2-5,11.3-11.3,11.3v1.5c7,0,12.8-5.7,12.8-12.8H24.3z M13,24.3
	c-6.2,0-11.3-5-11.3-11.3H0.3C0.3,20,6,25.8,13,25.8V24.3z M1.8,13c0-6.2,5-11.3,11.3-11.3V0.3C6,0.3,0.3,6,0.3,13H1.8z M13,1.8
	c6.2,0,11.3,5,11.3,11.3h1.5C25.8,6,20,0.3,13,0.3V1.8z"
    />
  </svg>
);
