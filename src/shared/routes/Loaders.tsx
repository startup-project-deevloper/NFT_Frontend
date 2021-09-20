import loadable from "@loadable/component";

// CONNECT (WAITLIST)
export const PriviPixConnect = loadable(() => import("components/Connect/PriviPixConnect"));
export const PriviDAOConnect = loadable(() => import("components/Connect/PriviDAOConnect"));
export const PriviFlixConnect = loadable(() => import("components/Connect/PriviFlixConnect"));
export const PriviPodsConnect = loadable(() => import("components/Connect/PriviPodsConnect"));
export const PriviDataConnect = loadable(() => import("components/Connect/PriviDataConnect"));
export const PriviSocialConnect = loadable(() => import("components/Connect/PriviSocialConnect"));
export const PriviCollabConnect = loadable(() => import("components/Connect/PriviCollabConnect"));
export const PriviWalletConnect = loadable(() => import("components/Connect/PriviWalletConnect"));
export const PriviExchangeConnect = loadable(() => import("components/Connect/PriviExchangeConnect"));
export const PriviMusicDaoConnect = loadable(() => import("components/Connect/PriviMusicDaoConnect"));
export const PriviMetaverseConnect = loadable(() => import("components/Connect/PriviMetaverseConnect"));
export const PriviPayConnect = loadable(() => import("components/Connect/PriviMetaverseConnect"));
export const PriviGovernanceConnect = loadable(() => import("components/Connect/PriviGovernanceConnect"));

// APPS
export const PriviLandPage = loadable(() => import("components/Land"));
export const PriviZoo = loadable(() => import("components/PriviZoo"));
export const PriviDAO = loadable(() => import("components/PriviDAO"));
export const PriviHome = loadable(() => import("components/PriviHome"));
export const PriviPods = loadable(() => import("components/PriviPods"));
export const PriviMusic = loadable(() => import("components/PriviMusic"));
export const NewPriviData = loadable(() => import("components/PriviData"));
export const PriviWallet = loadable(() => import("components/PriviWallet"));
export const PriviSocial = loadable(() => import("components/PriviSocial"));
export const PriviCollab = loadable(() => import("components/PriviCollab"));
export const PriviMetaverse = loadable(() => import("components/PriviPods"));
export const PriviPay = loadable(() => import("components/PriviPay"));
export const PriviMusicDao = loadable(() => import("components/PriviMusicDao"));
export const PriviFlix = loadable(() => import("components/PriviFlix"));
export const PriviExchange = loadable(() => import("components/PriviExchange"));
export const PriviDigitalArt = loadable(() => import("components/PriviDigitalArt"));
export const PriviZooPages = loadable(() => import("components/PriviZoo/PriviPages"));
export const PriviDAOPage = loadable(() => import("components/PriviDAO/subpages/DAOPage"));
export const PriviDigitalArtMediaPage = loadable(
  () => import("components/PriviDigitalArt/subpages/MediaPage")
);
export const PriviZooClaim = loadable(() => import("components/PriviZoo/PriviPages/Claim"));

// SHARED
export const SignIn = loadable(() => import("components/Login/SignIn"));
export const SignUp = loadable(() => import("components/Login/SignUp"));
export const Bridge = loadable(() => import("shared/connectors/bridge/Bridge"));
export const ForgotPassword = loadable(() => import("components/Login/ForgotPassword"));
export const ResendEmailValidation = loadable(() => import("components/Login/ResendEmailValidation"));
