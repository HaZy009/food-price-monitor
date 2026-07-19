import { readTable } from "./lib/readTable.js";
import {
  buildProductHistory,
  buildRegionProducts,
  buildRegions,
  filterRecords,
} from "./lib/transformRecords.js";
import { writeDataset } from "./lib/writeDataset.js";

function main() {
  console.log("Updating food price dataset...");

  const records = readTable();
  const filteredRecords = filterRecords(records);

  const regions = buildRegions(filteredRecords);

  const regionsWithProducts = buildRegionProducts(filteredRecords, regions);

  const dataset = buildProductHistory(filteredRecords, regionsWithProducts);

  const outputFilePath = writeDataset(dataset);

  console.log(`Dataset generated successfully.`);
  console.log(`Regions: ${dataset.length}`);
  console.log(`Output: ${outputFilePath}`);
}

try {
  main();
} catch (error) {
  console.error(`Dataset update failed: ${error.message}`);
  process.exitCode = 1;
}
