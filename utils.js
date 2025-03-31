// Add structuredClone polyfill if it doesn't exist in the global scope
if (typeof globalThis.structuredClone !== "function") {
  try {
    const structuredCloneModule = require("@ungap/structured-clone");
    // structuredCloneModule is a function itself
    globalThis.structuredClone =
      typeof structuredCloneModule === "function"
        ? structuredCloneModule
        : structuredCloneModule.default ||
          function (obj) {
            return JSON.parse(JSON.stringify(obj));
          };
  } catch (e) {
    // Fallback to a simple deep clone for basic objects
    globalThis.structuredClone = function (obj) {
      return JSON.parse(JSON.stringify(obj));
    };
  }
}

import Constants from "expo-constants";

export const generateAPIUrl = (relativePath) => {
  const origin = Constants.experienceUrl.replace("exp://", "http://");

  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;

  if (process.env.NODE_ENV === "development") {
    return origin.concat(path);
  }

  if (!process.env.EXPO_PUBLIC_API_BASE_URL) {
    throw new Error("EXPO_PUBLIC_API_BASE_URL");
  }

  return process.env.EXPO_PUBLIC_API_BASE_URL.concat(path);
};
