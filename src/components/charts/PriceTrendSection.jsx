import { useState } from "react";
import { useTranslation } from "react-i18next";

import ProductSelector from "../selectors/ProductSelector";
import PeriodSelector from "../controls/PeriodSelector";
import ComparisonToggle from "../controls/ComparisonToggle";
import PriceTrendChart from "./PriceTrendChart";
import { mockPriceTrend } from "../../data/mockPriceTrend";

import "./PriceTrendSection.css";

function PriceTrendSection({ selectedRegion }) {
  const { t, i18n } = useTranslation();

  const [selectedProduct, setSelectedProduct] = useState("eggs");
  const [selectedPeriod, setSelectedPeriod] = useState("12months");
  const [compareCanada, setCompareCanada] = useState(false);

  const isCanadaSelected = selectedRegion === "canada";
  const showCanadaComparison = !isCanadaSelected && compareCanada;

  const regionName = t(`regions.${selectedRegion}`);
  const productName = t(`products.${selectedProduct}.name`);
  const productQuantity = t(`products.${selectedProduct}.quantity`);

  const locale = i18n.resolvedLanguage === "en" ? "en-CA" : "fr-CA";

  const formatCurrency = (value) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 2,
    }).format(value);

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

      <PriceTrendChart
        data={mockPriceTrend}
        regionName={regionName}
        showCanada={showCanadaComparison}
      />

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
        <p>
          {t("trend.summary", {
            region: regionName,
            product: productName.toLowerCase(),
            quantity: productQuantity,
            previousPrice: formatCurrency(4.52),
            latestPrice: formatCurrency(4.85),
            change: "7.3",
          })}
        </p>

        <small>{t("trend.source")}</small>
      </div>
    </section>
  );
}

export default PriceTrendSection;
