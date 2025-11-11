import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getDeviceType = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad/.test(userAgent)) {
    return "mobile";
  } else if (/tablet/.test(userAgent)) {
    return "tablet";
  }
  return "desktop";
};

export const deviceToken = () => {
  return crypto.randomUUID();
};

export const getDeviceId = () => {
  let deviceId = localStorage.getItem("deviceId");
  if (!deviceId) {
    deviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);
  }
  return deviceId;
};

export const getDeviceName = () => {
  const { userAgent } = navigator;
  return userAgent.split(" ")[0]; // Simplified device name
};
