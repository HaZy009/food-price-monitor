import fs from "node:fs/promises";

import {
  TABLE_PID,
  downloadEndpoint,
  tempDirectory,
  zipFilePath,
} from "./statCanConfig.js";

async function ensureTempDirectory() {
  await fs.mkdir(tempDirectory, {
    recursive: true,
  });
}

async function getDownloadUrl() {
  const response = await fetch(downloadEndpoint);

  if (!response.ok) {
    throw new Error(`Statistics Canada API returned HTTP ${response.status}.`);
  }

  const result = await response.json();

  if (result.status !== "SUCCESS" || typeof result.object !== "string") {
    throw new Error("Statistics Canada did not return a valid download URL.");
  }

  return result.object;
}

async function downloadZip(downloadUrl) {
  const response = await fetch(downloadUrl);

  if (!response.ok) {
    throw new Error(`ZIP download returned HTTP ${response.status}.`);
  }

  const zipBuffer = Buffer.from(await response.arrayBuffer());

  if (zipBuffer.length === 0) {
    throw new Error("The downloaded ZIP file is empty.");
  }

  await fs.writeFile(zipFilePath, zipBuffer);

  return zipBuffer.length;
}

export async function downloadTable() {
  console.log(`Requesting Statistics Canada table ${TABLE_PID}...`);

  await ensureTempDirectory();

  const downloadUrl = await getDownloadUrl();

  console.log("Download URL received.");
  console.log("Downloading ZIP file...");

  const fileSize = await downloadZip(downloadUrl);

  console.log(`Download completed: ${zipFilePath}`);

  console.log(`ZIP size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`);

  return {
    zipFilePath,
    fileSize,
  };
}
