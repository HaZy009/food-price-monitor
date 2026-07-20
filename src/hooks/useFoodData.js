import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import foodPrices from "../data/foodPrices.json";
import {
  convertSeries,
  filterSeriesByPeriod,
  getAnnualChange,
  getLatestDataPoint,
  getRegionalComparisonData,
  mergeRegionAndCanadaSeries,
} from "../utils/dataHelpers";

function useFoodData({
  productId = "eggs-1-dozen",
  regionId = "canada",
  period = "12months",
} = {}) {
  const { i18n } = useTranslation();

  const regions = foodPrices;

  const language = i18n.resolvedLanguage?.startsWith("fr") ? "fr" : "en";

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

  const rawProducts = useMemo(
    () => canadaRegion?.products ?? [],
    [canadaRegion],
  );

  const products = useMemo(
    () =>
      rawProducts.map((currentProduct) => ({
        ...currentProduct,
        name:
          currentProduct.names?.[language] ??
          currentProduct.names?.en ??
          currentProduct.id,
      })),
    [language, rawProducts],
  );

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

  const regionalComparisonData = useMemo(
    () => getRegionalComparisonData(regions, productId, regionId),
    [productId, regionId, regions],
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
    regionalComparisonData,
    hasData: regionSeries.length > 0,
  };
}

export default useFoodData;
