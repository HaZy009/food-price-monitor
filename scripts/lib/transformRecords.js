const EXCLUDED_REGIONS = new Set([
  "Whitehorse, Yukon",
  "Yellowknife, Northwest Territories",
]);

function getRecordValue(record) {
  return record.VALUE ?? record.VALEUR ?? "";
}

function getProductName(record) {
  return record.Products ?? record.Produits ?? "";
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

export function filterRecords(records) {
  return records.filter((record) => {
    const rawValue = getRecordValue(record);

    const hasValue =
      rawValue !== "" && rawValue != null && !Number.isNaN(Number(rawValue));

    const regionSupported = record.GEO && !EXCLUDED_REGIONS.has(record.GEO);

    const hasProduct = Boolean(getProductName(record));

    return hasValue && regionSupported && hasProduct;
  });
}

export function buildProductTranslations(englishRecords, frenchRecords) {
  const frenchProductsByVector = new Map();

  frenchRecords.forEach((record) => {
    const vector = record.VECTOR;
    const frenchName = getProductName(record);

    if (vector && frenchName) {
      frenchProductsByVector.set(vector, frenchName);
    }
  });

  const translationsByEnglishName = new Map();

  englishRecords.forEach((record) => {
    const englishName = getProductName(record);
    const frenchName = frenchProductsByVector.get(record.VECTOR);

    if (
      englishName &&
      frenchName &&
      !translationsByEnglishName.has(englishName)
    ) {
      translationsByEnglishName.set(englishName, frenchName);
    }
  });

  return translationsByEnglishName;
}

export function buildRegions(records) {
  const regionNames = [
    ...new Set(records.map((record) => record.GEO).filter(Boolean)),
  ];

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

export function buildRegionProducts(records, regions, productTranslations) {
  return regions.map((region) => {
    const productNames = [
      ...new Set(
        records
          .filter((record) => record.GEO === region.name)
          .map(getProductName)
          .filter(Boolean),
      ),
    ];

    const regionProducts = productNames
      .sort((firstProduct, secondProduct) =>
        firstProduct.localeCompare(secondProduct, "en"),
      )
      .map((englishName) => ({
        id: createSlug(englishName),

        names: {
          en: englishName,
          fr: productTranslations.get(englishName) ?? englishName,
        },
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
    const productName = getProductName(record);
    const productId = createSlug(productName);
    const key = `${regionId}::${productId}`;

    if (!historyByRegionAndProduct.has(key)) {
      historyByRegionAndProduct.set(key, []);
    }

    historyByRegionAndProduct.get(key).push({
      date: record.REF_DATE,
      price: Number(getRecordValue(record)),
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
