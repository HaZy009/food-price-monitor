import { useTranslation } from "react-i18next";
import {
  Egg,
  TrendingUp,
  WalletCards
} from "lucide-react";

import StatCard from "./StatCard";

import "./StatCards.css";

function StatCards() {
  const { t, i18n } = useTranslation();

  const locale = i18n.resolvedLanguage === "en"
    ? "en-CA"
    : "fr-CA";

  const latestPrice = 4.85;
  const annualChange = 7.3;

  const formattedPrice = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2
  }).format(latestPrice);

  const formattedChange = new Intl.NumberFormat(locale, {
    signDisplay: "always",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(annualChange);

  const changeVariant =
    annualChange > 0
      ? "increase"
      : annualChange < 0
        ? "decrease"
        : "default";

  return (
    <section
      className="stat-cards"
      aria-label={t("stats.sectionLabel")}
    >
      <StatCard
        label={t("stats.product.label")}
        value={t("products.eggs.name")}
        description={t("products.eggs.quantity")}
        icon={Egg}
      />

      <StatCard
        label={t("stats.price.label")}
        value={formattedPrice}
        description={t("stats.price.date")}
        icon={WalletCards}
      />

      <StatCard
        label={t("stats.change.label")}
        value={`↑ ${formattedChange} %`}
        description={t("stats.change.period")}
        icon={TrendingUp}
        variant={changeVariant}
      />
    </section>
  );
}

export default StatCards;