export function convertSeries(series = []) {
  return series
    .filter(
      (entry) =>
        entry &&
        typeof entry.date === "string" &&
        typeof entry.price === "number",
    )
    .map((entry) => ({
      date: entry.date,
      value: entry.price,
    }));
}

export function filterSeriesByPeriod(series, period) {
  if (period === "fullHistory") {
    return series;
  }

  const periodLengths = {
    "12months": 12,
    "24months": 24,
  };

  const numberOfMonths = periodLengths[period];

  if (!numberOfMonths) {
    return series;
  }

  return series.slice(-numberOfMonths);
}

export function getLatestDataPoint(series) {
  if (!series.length) {
    return null;
  }

  return series.at(-1);
}

export function getAnnualChange(series) {
  if (series.length < 2) {
    return null;
  }

  const latestIndex = series.length - 1;
  const comparisonIndex = Math.max(0, latestIndex - 12);

  const latestPoint = series[latestIndex];
  const previousPoint = series[comparisonIndex];

  if (!previousPoint?.value || previousPoint.value === 0) {
    return null;
  }

  const change =
    ((latestPoint.value - previousPoint.value) / previousPoint.value) * 100;

  return {
    value: change,
    latestPoint,
    previousPoint,
  };
}

export function mergeRegionAndCanadaSeries(regionSeries, canadaSeries) {
  const canadaPriceByDate = new Map(
    canadaSeries.map(({ date, value }) => [date, value]),
  );

  return regionSeries.map(({ date, value }) => ({
    date,
    regionPrice: value,
    canadaPrice: canadaPriceByDate.get(date) ?? null,
  }));
}

export function getRegionalComparisonData(
  regions,
  productId,
  selectedRegionId,
) {
  const canadaRegion = regions.find((region) => region.id === "canada");

  const canadaProduct = canadaRegion?.products.find(
    (product) => product.id === productId,
  );

  const latestDate = canadaProduct?.history.at(-1)?.date;

  if (!latestDate) {
    return [];
  }

  return regions
    .map((region) => {
      const product = region.products.find(
        (currentProduct) => currentProduct.id === productId,
      );

      const dataPoint = product?.history.find(
        (entry) => entry.date === latestDate,
      );

      if (!dataPoint) {
        return null;
      }

      return {
        regionId: region.id,
        regionName: region.name,
        price: dataPoint.price,
        date: dataPoint.date,
        isSelected: region.id === selectedRegionId,
      };
    })
    .filter(Boolean)
    .sort((firstRegion, secondRegion) => {
      return secondRegion.price - firstRegion.price;
    });
}
