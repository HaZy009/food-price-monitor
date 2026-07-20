import fs from "node:fs/promises";

import {
  TABLE_PID,
  getDownloadEndpoint,
  tableLanguages,
  tempDirectory,
} from "./statCanConfig.js";

async function ensureTempDirectory() {
  await fs.mkdir(tempDirectory, {
    recursive: true,
  });
}

async function getDownloadUrl(language) {
  const downloadEndpoint = getDownloadEndpoint(language);

  const response = await fetch(downloadEndpoint);

  if (!response.ok) {
    throw new Error(
      `Statistics Canada API returned HTTP ${response.status} for ${language}.`,
    );
  }

  const result = await response.json();

  if (result.status !== "SUCCESS" || typeof result.object !== "string") {
    throw new Error(
      `Statistics Canada did not return a valid ${language} download URL.`,
    );
  }

  return result.object;
}

async function downloadZip(downloadUrl, zipFilePath, language) {
  const response = await fetch(downloadUrl);

  if (!response.ok) {
    throw new Error(
      `${language.toUpperCase()} ZIP download returned HTTP ${response.status}.`,
    );
  }

  const zipBuffer = Buffer.from(await response.arrayBuffer());

  if (zipBuffer.length === 0) {
    throw new Error(
      `The downloaded ${language.toUpperCase()} ZIP file is empty.`,
    );
  }

  await fs.writeFile(zipFilePath, zipBuffer);

  return zipBuffer.length;
}

async function downloadLanguageTable(language, zipFilePath) {
  console.log(
    `Requesting Statistics Canada table ${TABLE_PID} (${language})...`,
  );

  const downloadUrl = await getDownloadUrl(language);

  console.log(`${language.toUpperCase()} download URL received.`);

  console.log(`Downloading ${language.toUpperCase()} ZIP file...`);

  const fileSize = await downloadZip(downloadUrl, zipFilePath, language);

  console.log(`${language.toUpperCase()} download completed: ${zipFilePath}`);

  console.log(
    `${language.toUpperCase()} ZIP size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`,
  );

  return {
    language,
    zipFilePath,
    fileSize,
  };
}

export async function downloadTable() {
  await ensureTempDirectory();

  const downloads = await Promise.all(
    Object.entries(tableLanguages).map(([language, config]) =>
      downloadLanguageTable(language, config.zipFilePath),
    ),
  );

  return downloads;
}
