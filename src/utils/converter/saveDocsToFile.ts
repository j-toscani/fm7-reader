import fs from "fs";

export default function saveDocsToFile(path: string) {
  const fileAsString = getFileAsString(path);
  const lines = getLines(fileAsString);

  const encodings = lines.map(getPropsFromLine);

  savePropsAsJson(encodings, path.split(".txt").join(".json"));
}

function getFileAsString(path: string) {
  const stream = fs.readFileSync(path);
  return stream.toString();
}

function savePropsAsJson(
  encodings: ReturnType<typeof getPropsFromLine>[],
  saveAs: string
) {
  fs.writeFileSync(saveAs, JSON.stringify(encodings));
}

function getLines(fileAsString: string) {
  return fileAsString
    .split(";")
    .map((string) => string.trim())
    .filter((string) => string.length);
}

function toCamelCase(string: String) {
  return string[0].toLowerCase() + string.slice(1);
}

function getPropsFromLine(line: string) {
  const [encoding, property] = line.split(" ");
  return {
    encoding,
    property: toCamelCase(property),
  };
}
