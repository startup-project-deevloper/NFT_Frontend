export type IDOTokenSymbol = "TRAX" | "PIX";
export const IDO_TOKENS = ["TRAX", "PIX"] as const;

const TRAX_ASSET_URL = require("assets/icons3d/TRAX_ROTATE.gif");
const PIX_ASSET_URL = require("assets/icons3d/PIX_ROTATE.gif");

export const TOKEN_ASSET_URL: { [key in IDOTokenSymbol]: string } = {
  TRAX: TRAX_ASSET_URL,
  PIX: PIX_ASSET_URL,
};

export const VESTING_CONTRACT_ADDRESS: { [key in IDOTokenSymbol]: string } = {
  TRAX: process.env.TRAX_VESTING_CONTRACT_ADDRESS || "0xBc22a472351B2a0A3812E6d84B877fA38eF6EA7F",
  PIX: process.env.PIX_VESTING_CONTRACT_ADDRESS || "0x10381Ad3ddd0855d5bDD0445E1be6beb8b3de3FC",
};
