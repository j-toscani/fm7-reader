import base from "./base";
import add from "./add";

const all = {
  ...base,
  ...add,
} as const;

export default all;