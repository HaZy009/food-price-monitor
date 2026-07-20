import { readTable } from "./lib/readTable.js";

import {
  buildProductHistory,
  buildProductTranslations,
  buildRegionProducts,
  buildRegions,
  filterRecords,
} from "./lib/transformRecords.js";

import { writeDataset } from "./lib/writeDataset.js";

function main() {
  console.log("Updating bilingual food price dataset...");

  const tables = readTable();

  const englishRecords = filterRecords(tables.en);

  console.log(`English rows after filtering: ${englishRecords.length}`);

  console.log(`French rows available for translations: ${tables.fr.length}`);

  const productTranslations = buildProductTranslations(tables.en, tables.fr);

  console.log(`Product translations found: ${productTranslations.size}`);

  const regions = buildRegions(englishRecords);

  const regionsWithProducts = buildRegionProducts(
    englishRecords,
    regions,
    productTranslations,
  );

  const dataset = buildProductHistory(englishRecords, regionsWithProducts);

  const outputFilePath = writeDataset(dataset);

  const uniqueProducts = new Set(
    dataset.flatMap((region) => region.products.map((product) => product.id)),
  );

  const missingFrenchTranslations = new Set(
    dataset.flatMap((region) =>
      region.products
        .filter((product) => !productTranslations.has(product.names.en))
        .map((product) => product.names.en),
    ),
  );

  console.log("Dataset generated successfully.");
  console.log(`Regions: ${dataset.length}`);
  console.log(`Unique products: ${uniqueProducts.size}`);
  console.log(
    `Products without French translation: ${missingFrenchTranslations.size}`,
  );
  console.log(`Output: ${outputFilePath}`);

  if (missingFrenchTranslations.size > 0) {
    console.log("\nProducts using the English fallback:");

    [...missingFrenchTranslations]
      .sort((firstProduct, secondProduct) =>
        firstProduct.localeCompare(secondProduct, "en"),
      )
      .forEach((productName) => {
        console.log(`- ${productName}`);
      });
  }
}

try {
  main();
} catch (error) {
  console.error(`Dataset update failed: ${error.message}`);

  process.exitCode = 1;
}
