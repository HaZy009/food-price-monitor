import { useState } from "react";
import { useTranslation } from "react-i18next";

import ProductSelector from "../selectors/ProductSelector";
import PeriodSelector from "../controls/PeriodSelector";
import ComparisonToggle from "../controls/ComparisonToggle";
import PriceTrendChart from "./PriceTrendChart";
import useFoodData from "../../hooks/useFoodData";

import "./PriceTrendSection.css";

function PriceTrendSection({ selectedRegion }) {
  const { t, i18n } = useTranslation();

  const [selectedProduct, setSelectedProduct] = useState("eggs");
  const [selectedPeriod, setSelectedPeriod] = useState("12months");
  const [compareCanada, setCompareCanada] = useState(false);

  const { products, product, chartData, latestPoint, annualChange, hasData } =
    useFoodData({
      productId: selectedProduct,
      regionId: selectedRegion,
      period: selectedPeriod,
    });

  const isCanadaSelected = selectedRegion === "canada";
  const showCanadaComparison = !isCanadaSelected && compareCanada;

  const regionName = t(`regions.${selectedRegion}`);
  const productName = product
    ? t(product.nameKey)
    : t("trend.unavailableProduct");

  const productQuantity = product ? t(product.quantityKey) : "";

  const locale = i18n.resolvedLanguage === "en" ? "en-CA" : "fr-CA";

  const formatCurrency = (value) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 2,
    }).format(value);

  const previousPrice = annualChange?.previousPoint?.value ?? null;

  const latestPrice =
    annualChange?.latestPoint?.value ?? latestPoint?.value ?? null;

  const formattedChange =
    annualChange?.value != null
      ? new Intl.NumberFormat(locale, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(Math.abs(annualChange.value))
      : null;

  const changeDirection =
    annualChange?.value > 0
      ? "increase"
      : annualChange?.value < 0
        ? "decrease"
        : "stable";

  return (
    <section className="trend-section" aria-labelledby="trend-section-title">
      <div className="trend-section__header">
        <div>
          <h2 className="trend-section__title" id="trend-section-title">
            {t("trend.title", {
              product: productName.toLowerCase(),
              region: regionName,
            })}
          </h2>

          <p className="trend-section__subtitle">
            {t("trend.subtitle", {
              quantity: productQuantity,
            })}
          </p>
        </div>

        <span className="trend-section__region-badge">{regionName}</span>
      </div>

      <div className="trend-section__controls">
        <ProductSelector
          products={products}
          value={selectedProduct}
          onChange={setSelectedProduct}
        />

        <PeriodSelector value={selectedPeriod} onChange={setSelectedPeriod} />

        <ComparisonToggle
          checked={showCanadaComparison}
          onChange={setCompareCanada}
          disabled={isCanadaSelected}
        />
      </div>

      {hasData ? (
        <PriceTrendChart
          data={chartData}
          regionName={regionName}
          showCanada={showCanadaComparison}
        />
      ) : (
        <div className="trend-section__empty">{t("trend.noData")}</div>
      )}

      {showCanadaComparison && (
        <div className="trend-section__legend">
          <span>
            <span className="trend-section__legend-line" />
            {regionName}
          </span>

          <span>
            <span className="trend-section__legend-line trend-section__legend-line--canada" />
            {t("regions.canada")}
          </span>
        </div>
      )}

      <div className="trend-section__summary">
        {previousPrice != null &&
        latestPrice != null &&
        formattedChange != null ? (
          <p>
            {t(`trend.summary.${changeDirection}`, {
              region: regionName,
              product: productName.toLowerCase(),
              quantity: productQuantity,
              previousPrice: formatCurrency(previousPrice),
              latestPrice: formatCurrency(latestPrice),
              change: formattedChange,
            })}
          </p>
        ) : (
          <p>{t("trend.summary.unavailable")}</p>
        )}

        <small>{t("trend.source")}</small>
      </div>
    </section>
  );
}

export default PriceTrendSection;
