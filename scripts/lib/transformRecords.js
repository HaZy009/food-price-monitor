const EXCLUDED_REGIONS = new Set([
  "Whitehorse, Yukon",
  "Yellowknife, Northwest Territories",
]);

export function filterRecords(records) {
  return records.filter((record) => {
    const hasValue = record.VALUE !== "" && !Number.isNaN(Number(record.VALUE));

    const regionSupported = !EXCLUDED_REGIONS.has(record.GEO);

    return hasValue && regionSupported;
  });
}

function createSlug(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildRegions(records) {
  const regionNames = [...new Set(records.map((record) => record.GEO))];

  return regionNames
    .map((regionName) => ({
      id: createSlug(regionName),
      name: regionName,
    }))
    .sort((firstRegion, secondRegion) => {
      if (firstRegion.id === "canada") {
        return -1;
      }

      if (secondRegion.id === "canada") {
        return 1;
      }

      return firstRegion.name.localeCompare(secondRegion.name, "en");
    });
}
