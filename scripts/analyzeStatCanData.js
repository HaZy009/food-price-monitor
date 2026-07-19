import { readTable } from "./lib/readTable.js";
import { buildRegions, filterRecords } from "./lib/transformRecords.js";
import { TABLE_PID } from "./lib/statCanConfig.js";

function getSortedUniqueValues(records, columnName) {
  return [
    ...new Set(records.map((record) => record[columnName]).filter(Boolean)),
  ].sort((firstValue, secondValue) =>
    firstValue.localeCompare(secondValue, "en"),
  );
}

function countByValue(records, columnName) {
  const counts = new Map();

  records.forEach((record) => {
    const value = record[columnName] || "(empty)";

    counts.set(value, (counts.get(value) ?? 0) + 1);
  });

  return [...counts.entries()].sort(([firstValue], [secondValue]) =>
    firstValue.localeCompare(secondValue, "en"),
  );
}

function analyzeRegions(records) {
  const regions = getSortedUniqueValues(records, "GEO");

  console.log(`\nRegions (${regions.length}):`);

  regions.forEach((region) => {
    const regionRecords = records.filter((record) => record.GEO === region);

    const dates = getSortedUniqueValues(regionRecords, "REF_DATE");

    const products = getSortedUniqueValues(regionRecords, "Products");

    console.log(`\n- ${region}`);
    console.log(`  Rows: ${regionRecords.length}`);
    console.log(`  Products: ${products.length}`);
    console.log(`  Months: ${dates.length}`);
    console.log(`  First month: ${dates[0] ?? "none"}`);
    console.log(`  Latest month: ${dates.at(-1) ?? "none"}`);
  });
}

function analyzeProducts(records) {
  const products = getSortedUniqueValues(records, "Products");

  console.log(`\nProducts (${products.length}):`);

  products.forEach((product, index) => {
    console.log(`${index + 1}. ${product}`);
  });
}

function analyzeValues(records) {
  const missingValues = records.filter(
    (record) =>
      record.VALUE === "" ||
      record.VALUE == null ||
      Number.isNaN(Number(record.VALUE)),
  );

  const validValues = records.filter(
    (record) =>
      record.VALUE !== "" &&
      record.VALUE != null &&
      !Number.isNaN(Number(record.VALUE)),
  );

  console.log("\nValues:");
  console.log(`- Valid numeric values: ${validValues.length}`);
  console.log(`- Missing or invalid values: ${missingValues.length}`);

  if (missingValues.length > 0) {
    console.log("\nExamples of missing values:");

    missingValues.slice(0, 10).forEach((record) => {
      console.log(
        `- ${record.REF_DATE} | ${record.GEO} | ${record.Products} | STATUS=${record.STATUS || "(empty)"}`,
      );
    });
  }
}

function analyzeStatuses(records) {
  const statusCounts = countByValue(records, "STATUS");

  console.log("\nSTATUS values:");

  statusCounts.forEach(([status, count]) => {
    console.log(`- ${status}: ${count}`);
  });

  const symbolCounts = countByValue(records, "SYMBOL");

  console.log("\nSYMBOL values:");

  symbolCounts.forEach(([symbol, count]) => {
    console.log(`- ${symbol}: ${count}`);
  });

  const terminatedCounts = countByValue(records, "TERMINATED");

  console.log("\nTERMINATED values:");

  terminatedCounts.forEach(([terminated, count]) => {
    console.log(`- ${terminated}: ${count}`);
  });
}

function analyzeDates(records) {
  const dates = getSortedUniqueValues(records, "REF_DATE");

  console.log("\nOverall date range:");
  console.log(`- First month: ${dates[0] ?? "none"}`);
  console.log(`- Latest month: ${dates.at(-1) ?? "none"}`);
  console.log(`- Distinct months: ${dates.length}`);
}

function main() {
  console.log(`Analyzing Statistics Canada table ${TABLE_PID}...`);

  const records = readTable();
  const filteredRecords = filterRecords(records);
  const regions = buildRegions(filteredRecords);

  console.log(`Supported regions: ${regions.length}`);

  console.log("\nStructured regions:");

  regions.forEach((region) => {
    console.log(`- ${region.id}: ${region.name}`);
  });

  console.log(`Rows after filtering: ${filteredRecords.length}`);

  console.log(`\nTotal rows: ${records.length}`);

  analyzeDates(records);
  analyzeRegions(records);
  analyzeProducts(records);
  analyzeValues(records);
  analyzeStatuses(records);
}

try {
  main();
} catch (error) {
  console.error(`Analysis failed: ${error.message}`);
  process.exitCode = 1;
}
