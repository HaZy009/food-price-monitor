import { useMemo } from "react";

import foodPrices from "../data/foodPrices.json";
import {
  convertSeries,
  filterSeriesByPeriod,
  getAnnualChange,
  getLatestDataPoint,
  mergeRegionAndCanadaSeries,
} from "../utils/dataHelpers";

function useFoodData({
  productId = "eggs",
  regionId = "canada",
  period = "12months",
} = {}) {
  const product = useMemo(
    () =>
      foodPrices.products.find(
        (currentProduct) => currentProduct.id === productId
      ) ?? null,
    [productId]
  );

  const region = useMemo(
    () =>
      foodPrices.regions.find(
        (currentRegion) => currentRegion.id === regionId
      ) ?? null,
    [regionId]
  );

  const regionSeries = useMemo(() => {
    const rawSeries =
      foodPrices.prices?.[productId]?.[regionId] ?? [];

    return convertSeries(rawSeries);
  }, [productId, regionId]);

  const canadaSeries = useMemo(() => {
    const rawSeries =
      foodPrices.prices?.[productId]?.canada ?? [];

    return convertSeries(rawSeries);
  }, [productId]);

  const filteredRegionSeries = useMemo(
    () => filterSeriesByPeriod(regionSeries, period),
    [regionSeries, period]
  );

  const filteredCanadaSeries = useMemo(
    () => filterSeriesByPeriod(canadaSeries, period),
    [canadaSeries, period]
  );

  const chartData = useMemo(
    () =>
      mergeRegionAndCanadaSeries(
        filteredRegionSeries,
        filteredCanadaSeries
      ),
    [filteredRegionSeries, filteredCanadaSeries]
  );

  const latestPoint = useMemo(
    () => getLatestDataPoint(regionSeries),
    [regionSeries]
  );

  const annualChange = useMemo(
    () => getAnnualChange(regionSeries),
    [regionSeries]
  );

  return {
    metadata: foodPrices.metadata,
    products: foodPrices.products,
    regions: foodPrices.regions,
    product,
    region,
    regionSeries,
    canadaSeries,
    filteredRegionSeries,
    filteredCanadaSeries,
    chartData,
    latestPoint,
    annualChange,
    hasData: regionSeries.length > 0,
  };
}

export default useFoodData;