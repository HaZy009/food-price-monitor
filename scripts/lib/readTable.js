import AdmZip from "adm-zip";
import { parse } from "csv-parse/sync";

import { TABLE_PID, tableLanguages } from "./statCanConfig.js";

function findCsvEntry(zip) {
  const exactEntry = zip.getEntry(`${TABLE_PID}.csv`);

  if (exactEntry) {
    return exactEntry;
  }

  return zip
    .getEntries()
    .find(
      (entry) =>
        !entry.isDirectory && entry.entryName.toLowerCase().endsWith(".csv"),
    );
}

function normalizeColumnName(columnName) {
  return columnName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function getCanonicalColumnName(columnName) {
  const normalizedColumn = normalizeColumnName(columnName);

  const columnAliases = {
    ref_date: "REF_DATE",

    geo: "GEO",

    products: "Products",
    produits: "Products",

    value: "VALUE",
    valeur: "VALUE",

    vector: "VECTOR",
    vecteur: "VECTOR",

    status: "STATUS",
    statut: "STATUS",

    symbol: "SYMBOL",
    symbole: "SYMBOL",

    terminated: "TERMINATED",
    termine: "TERMINATED",
  };

  return columnAliases[normalizedColumn] ?? columnName.trim();
}

function readLanguageTable(language) {
  const config = tableLanguages[language];

  if (!config) {
    throw new Error(`Unsupported table language: ${language}.`);
  }

  const zip = new AdmZip(config.zipFilePath);
  const csvEntry = findCsvEntry(zip);

  if (!csvEntry) {
    throw new Error(
      `No CSV file was found in the ${language.toUpperCase()} ZIP archive.`,
    );
  }

  const csvText = csvEntry.getData().toString("utf8");

  const delimiter = language === "fr" ? ";" : ",";

  return parse(csvText, {
    columns: (columns) => columns.map(getCanonicalColumnName),

    skip_empty_lines: true,
    bom: true,
    relax_column_count: true,
    delimiter,
  });
}

export function readTable() {
  return {
    en: readLanguageTable("en"),
    fr: readLanguageTable("fr"),
  };
}
