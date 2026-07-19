import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const projectRoot = path.resolve(currentDirectory, "../..");

const outputDirectory = path.join(projectRoot, "src", "data");
const outputFilePath = path.join(outputDirectory, "foodPrices.json");

export function writeDataset(dataset) {
  fs.mkdirSync(outputDirectory, {
    recursive: true,
  });

  const jsonContent = JSON.stringify(dataset, null, 2);

  fs.writeFileSync(outputFilePath, `${jsonContent}\n`, "utf8");

  return outputFilePath;
}
