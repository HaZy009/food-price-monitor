import path from "node:path";
import { fileURLToPath } from "node:url";

export const TABLE_PID = "18100245";
export const TABLE_LANGUAGE = "en";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

export const projectRoot = path.resolve(currentDirectory, "../..");

export const tempDirectory = path.join(projectRoot, "temp");

export const zipFilePath = path.join(tempDirectory, `${TABLE_PID}-eng.zip`);

export const outputFilePath = path.join(
  projectRoot,
  "src",
  "data",
  "foodPrices.json",
);

export const downloadEndpoint =
  `https://www150.statcan.gc.ca/t1/wds/rest/` +
  `getFullTableDownloadCSV/${TABLE_PID}/${TABLE_LANGUAGE}`;
