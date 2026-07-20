import path from "node:path";
import { fileURLToPath } from "node:url";
import AdmZip from "adm-zip";
import { parse } from "csv-parse/sync";

const TABLE_PID = "18100245";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);

const projectRoot = path.resolve(currentDirectory, "..");

const zipFilePath = path.join(projectRoot, "temp", `${TABLE_PID}-fra.zip`);

function findMainCsvEntry(zip) {
  const csvEntries = zip
    .getEntries()
    .filter(
      (entry) =>
        !entry.isDirectory && entry.entryName.toLowerCase().endsWith(".csv"),
    );

  if (csvEntries.length === 0) {
    throw new Error("No CSV file was found in the ZIP archive.");
  }

  console.log("CSV files found:");

  csvEntries.forEach((entry) => {
    console.log(`- ${entry.entryName}`);
  });

  const preferredEntry =
    csvEntries.find((entry) => entry.entryName.includes(TABLE_PID)) ??
    csvEntries[0];

  return preferredEntry;
}

function inspectCsv(csvBuffer) {
  const csvText = csvBuffer.toString("utf8");

  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_column_count: true,
    to_line: 6,
  });

  if (records.length === 0) {
    throw new Error("The CSV file does not contain any data rows.");
  }

  const columns = Object.keys(records[0]);

  console.log("\nColumns:");

  columns.forEach((column) => {
    console.log(`- ${column}`);
  });

  console.log("\nFirst rows:");

  records.slice(0, 3).forEach((record, index) => {
    console.log(`\nRow ${index + 1}:`);
    console.log(record);
  });
}

function main() {
  console.log(`Opening ZIP file: ${zipFilePath}`);

  const zip = new AdmZip(zipFilePath);
  const csvEntry = findMainCsvEntry(zip);

  console.log(`\nSelected CSV: ${csvEntry.entryName}`);

  const csvBuffer = csvEntry.getData();

  inspectCsv(csvBuffer);
}

try {
  main();
} catch (error) {
  console.error(`Inspection failed: ${error.message}`);
  process.exitCode = 1;
}
