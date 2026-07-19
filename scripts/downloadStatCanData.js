import { downloadTable } from "./lib/downloadTable.js";

async function main() {
  await downloadTable();
}

main().catch((error) => {
  console.error(`Data download failed: ${error.message}`);

  process.exitCode = 1;
});
