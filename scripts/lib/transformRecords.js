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

export function buildRegionProducts(records, regions) {
  return regions.map((region) => {
    const regionProducts = [
      ...new Set(
        records
          .filter((record) => record.GEO === region.name)
          .map((record) => record.Products),
      ),
    ]
      .sort((firstProduct, secondProduct) =>
        firstProduct.localeCompare(secondProduct, "en"),
      )
      .map((productName) => ({
        id: createSlug(productName),
        name: productName,
      }));

    return {
      ...region,
      products: regionProducts,
    };
  });
}

export function buildProductHistory(records, regions) {
  const historyByRegionAndProduct = new Map();

  records.forEach((record) => {
    const regionId = createSlug(record.GEO);
    const productId = createSlug(record.Products);
    const key = `${regionId}::${productId}`;

    if (!historyByRegionAndProduct.has(key)) {
      historyByRegionAndProduct.set(key, []);
    }

    historyByRegionAndProduct.get(key).push({
      date: record.REF_DATE,
      price: Number(record.VALUE),
    });
  });

  return regions.map((region) => ({
    ...region,
    products: region.products.map((product) => {
      const key = `${region.id}::${product.id}`;

      const history = historyByRegionAndProduct.get(key) ?? [];

      history.sort((firstEntry, secondEntry) =>
        firstEntry.date.localeCompare(secondEntry.date),
      );

      return {
        ...product,
        history,
      };
    }),
  }));
}
