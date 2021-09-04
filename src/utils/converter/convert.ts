import path from "path";
import saveDocsToFile from "./saveDocsToFile";

[path.resolve("sled.txt"), path.resolve("cardash.txt")].forEach(saveDocsToFile);
