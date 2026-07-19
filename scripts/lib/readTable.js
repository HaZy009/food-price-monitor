import AdmZip from "adm-zip";
import { parse } from "csv-parse/sync";

import {
  TABLE_PID,
  zipFilePath,
} from "./statCanConfig.js";

export function readTable() {
  const zip = new AdmZip(zipFilePath);

  const csvEntry = zip.getEntry(`${TABLE_PID}.csv`);

  if (!csvEntry) {
    throw new Error(
      `The file ${TABLE_PID}.csv was not found in the ZIP archive.`
    );
  }

  const csvText = csvEntry
    .getData()
    .toString("utf8");

  return parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    relax_column_count: true,
  });
}