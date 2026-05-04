export type DeviceType = "android" | "ios" | "unknown";

export const CREDIFIX_PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.credfix";

export const CREDIFIX_APP_STORE_URL =
  "https://apps.apple.com/bh/app/credfix/id6760899516";

export function detectDevice(): DeviceType {
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return "android";
  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  return "unknown";
}

export function openCredfixDownload() {
  const device = detectDevice();

  if (device === "android") {
    window.open(CREDIFIX_PLAY_STORE_URL, "_blank", "noopener,noreferrer");
  } else if (device === "ios") {
    window.open(CREDIFIX_APP_STORE_URL, "_blank", "noopener,noreferrer");
  }

  return device;
}
