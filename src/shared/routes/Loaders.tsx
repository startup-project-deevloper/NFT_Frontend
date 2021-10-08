import loadable from "@loadable/component";

// CONNECT (WAITLIST)
export const PriviPixConnect = loadable(() => import("components/Connect/PriviPixConnect"));

// APPS
export const PriviDigitalArt = loadable(() => import("components/PriviDigitalArt"));
export const PriviDigitalArtMediaPage = loadable(
  () => import("components/PriviDigitalArt/subpages/MediaPage")
);