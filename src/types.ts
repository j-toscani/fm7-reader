import base from "./assets/base";
import add from "./assets/add";

const all = {
  ...base,
  ...add,
} as const;

type V1 = typeof base;
type V2 = typeof all;
