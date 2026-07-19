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
  productId = "eggs-1-dozen",
  regionId = "canada",
  period = "12months",
} = {}) {
  const regions = foodPrices;

  const canadaRegion = useMemo(
    () =>
      regions.find((currentRegion) => currentRegion.id === "canada") ?? null,
    [regions],
  );

  const region = useMemo(
    () =>
      regions.find((currentRegion) => currentRegion.id === regionId) ?? null,
    [regionId, regions],
  );

  const products = useMemo(() => canadaRegion?.products ?? [], [canadaRegion]);

  const product = useMemo(
    () =>
      products.find((currentProduct) => currentProduct.id === productId) ??
      null,
    [productId, products],
  );

  const regionProduct = useMemo(
    () =>
      region?.products.find(
        (currentProduct) => currentProduct.id === productId,
      ) ?? null,
    [productId, region],
  );

  const canadaProduct = useMemo(
    () =>
      canadaRegion?.products.find(
        (currentProduct) => currentProduct.id === productId,
      ) ?? null,
    [canadaRegion, productId],
  );

  const regionSeries = useMemo(
    () => convertSeries(regionProduct?.history ?? []),
    [regionProduct],
  );

  const canadaSeries = useMemo(
    () => convertSeries(canadaProduct?.history ?? []),
    [canadaProduct],
  );

  const filteredRegionSeries = useMemo(
    () => filterSeriesByPeriod(regionSeries, period),
    [regionSeries, period],
  );

  const filteredCanadaSeries = useMemo(
    () => filterSeriesByPeriod(canadaSeries, period),
    [canadaSeries, period],
  );

  const chartData = useMemo(
    () =>
      mergeRegionAndCanadaSeries(filteredRegionSeries, filteredCanadaSeries),
    [filteredRegionSeries, filteredCanadaSeries],
  );

  const latestPoint = useMemo(
    () => getLatestDataPoint(regionSeries),
    [regionSeries],
  );

  const annualChange = useMemo(
    () => getAnnualChange(regionSeries),
    [regionSeries],
  );

  return {
    products,
    regions,
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
