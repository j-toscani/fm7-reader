import base from "./base";
import add from "./add";

const all = [...base, ...add] as const;

const keys = all.map((obj) => obj.property);
console.log(keys.join(","));

export default all;
