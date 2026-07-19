import { useTranslation } from "react-i18next";
import {
  PackageSearch,
  TrendingDown,
  TrendingUp,
  Minus,
  WalletCards,
} from "lucide-react";

import useFoodData from "../../hooks/useFoodData";
import StatCard from "./StatCard";

import "./StatCards.css";

function StatCards({ selectedProduct, selectedRegion }) {
  const { t, i18n } = useTranslation();

  const { product, latestPoint, annualChange, hasData } = useFoodData({
    productId: selectedProduct,
    regionId: selectedRegion,
    period: "fullHistory",
  });

  const locale = i18n.resolvedLanguage === "en" ? "en-CA" : "fr-CA";

  const formatCurrency = (value) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 2,
    }).format(value);

  const formatMonth = (dateValue) => {
    if (!dateValue) {
      return t("stats.unavailable");
    }

    const [year, month] = dateValue.split("-");

    return new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    }).format(new Date(Number(year), Number(month) - 1, 1));
  };

  const productParts = product?.name.split(",") ?? [];

  const productName = productParts[0]?.trim() || t("stats.unavailable");

  const productQuantity =
    productParts.slice(1).join(",").trim() || t("stats.unavailable");

  const latestPrice =
    hasData && latestPoint
      ? formatCurrency(latestPoint.value)
      : t("stats.unavailable");

  const latestDate = latestPoint
    ? formatMonth(latestPoint.date)
    : t("stats.unavailable");

  const annualChangeValue = annualChange?.value ?? null;

  const formattedAnnualChange =
    annualChangeValue != null
      ? `${new Intl.NumberFormat(locale, {
          signDisplay: "always",
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(annualChangeValue)} %`
      : t("stats.unavailable");

  const changeVariant =
    annualChangeValue > 0
      ? "increase"
      : annualChangeValue < 0
        ? "decrease"
        : "default";

  const ChangeIcon =
    annualChangeValue > 0
      ? TrendingUp
      : annualChangeValue < 0
        ? TrendingDown
        : Minus;

  const changeDescription = annualChange?.previousPoint?.date
    ? t("stats.change.since", {
        date: formatMonth(annualChange.previousPoint.date),
      })
    : t("stats.change.unavailable");

  return (
    <section className="stat-cards" aria-label={t("stats.sectionLabel")}>
      <StatCard
        label={t("stats.product.label")}
        value={productName}
        description={productQuantity}
        icon={PackageSearch}
      />

      <StatCard
        label={t("stats.price.label")}
        value={latestPrice}
        description={latestDate}
        icon={WalletCards}
      />

      <StatCard
        label={t("stats.change.label")}
        value={formattedAnnualChange}
        description={changeDescription}
        icon={ChangeIcon}
        variant={changeVariant}
      />
    </section>
  );
}

export default StatCards;
