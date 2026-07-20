import path from "node:path";
import { fileURLToPath } from "node:url";

export const TABLE_PID = "18100245";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

export const projectRoot = path.resolve(currentDirectory, "../..");

export const tempDirectory = path.join(projectRoot, "temp");

export const tableLanguages = {
  en: {
    code: "en",
    zipFilePath: path.join(tempDirectory, `${TABLE_PID}-eng.zip`),
  },

  fr: {
    code: "fr",
    zipFilePath: path.join(tempDirectory, `${TABLE_PID}-fra.zip`),
  },
};

export const outputFilePath = path.join(
  projectRoot,
  "src",
  "data",
  "foodPrices.json",
);

export function getDownloadEndpoint(language) {
  return (
    `https://www150.statcan.gc.ca/t1/wds/rest/` +
    `getFullTableDownloadCSV/${TABLE_PID}/${language}`
  );
}
