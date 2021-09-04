import base from "./assets/base";
import add from "./assets/add";

const all = {
  ...base,
  ...add,
} as const;

export type V1 = typeof base;
export type V2 = typeof all;

export type BufferKeysV1 = V1[number]["property"];
export type BufferKeysV2 = V2[number]["property"];
export type EncodingsV1 = V1[number]["encoding"];
export type EncodingsV2 = V2[number]["encoding"];
