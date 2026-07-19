export function convertSeries(series = []) {
  return series
    .filter(
      (entry) =>
        Array.isArray(entry) &&
        entry.length === 2 &&
        typeof entry[0] === "string" &&
        typeof entry[1] === "number"
    )
    .map(([date, value]) => ({
      date,
      value,
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
    ((latestPoint.value - previousPoint.value) /
      previousPoint.value) *
    100;

  return {
    value: change,
    latestPoint,
    previousPoint,
  };
}

export function mergeRegionAndCanadaSeries(
  regionSeries,
  canadaSeries
) {
  const canadaPriceByDate = new Map(
    canadaSeries.map(({ date, value }) => [date, value])
  );

  return regionSeries.map(({ date, value }) => ({
    date,
    regionPrice: value,
    canadaPrice: canadaPriceByDate.get(date) ?? null,
  }));
}