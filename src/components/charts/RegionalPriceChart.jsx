import { useTranslation } from "react-i18next";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Label,
} from "recharts";

import "./RegionalPriceChart.css";

function RegionalChartTooltip({
  active,
  payload,
  formatCurrency,
  translate,
  formattedDate,
}) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="regional-chart__tooltip">
      <strong className="regional-chart__tooltip-region">
        {translate(`regions.${item.regionId}`)}
      </strong>

      <span className="regional-chart__tooltip-price">
        {formatCurrency(item.price)}
      </span>

      <small className="regional-chart__tooltip-date">{formattedDate}</small>
    </div>
  );
}

function RegionalPriceChart({
  data,
  selectedRegion,
  productName,
  productQuantity,
}) {
  const { t, i18n } = useTranslation();

  const locale = i18n.resolvedLanguage === "en" ? "en-CA" : "fr-CA";

  const formatCurrency = (value) =>
    new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "CAD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);

  const latestDate = data[0]?.date ?? null;

  const formattedDate = latestDate
    ? new Intl.DateTimeFormat(locale, {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${latestDate}-01T00:00:00Z`))
    : t("comparison.unavailableDate");

  const formattedProduct = productQuantity
    ? `${productName} (${productQuantity})`
    : productName;

  if (!data.length) {
    return (
      <section
        className="regional-chart"
        aria-labelledby="regional-chart-title"
      >
        <div className="regional-chart__empty">{t("comparison.noData")}</div>
      </section>
    );
  }

  return (
    <section className="regional-chart" aria-labelledby="regional-chart-title">
      <div className="regional-chart__header">
        <div>
          <h3 className="regional-chart__title" id="regional-chart-title">
            {t("comparison.title")}
          </h3>

          <p className="regional-chart__subtitle">
            {t("comparison.subtitle", {
              date: formattedDate,
            })}
          </p>

          <p className="regional-chart__product">
            <span>{t("comparison.productLabel")}</span>
            {formattedProduct}
          </p>
        </div>

        <span className="regional-chart__date-badge">{formattedDate}</span>
      </div>

      <div className="regional-chart__chart">
        <ResponsiveContainer width="100%" height={440}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 10,
              right: 35,
              left: 35,
              bottom: 35,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal vertical />

            <XAxis
              type="number"
              domain={[0, "dataMax"]}
              tickFormatter={formatCurrency}
            >
              <Label
                value={t("comparison.axisLabel")}
                position="bottom"
                offset={15}
              />
            </XAxis>

            <YAxis
              type="category"
              dataKey="regionId"
              width={175}
              tickFormatter={(value) => t(`regions.${value}`)}
            />

            <Tooltip
              cursor={{
                fill: "rgba(37, 99, 235, 0.08)",
              }}
              content={
                <RegionalChartTooltip
                  formatCurrency={formatCurrency}
                  translate={t}
                  formattedDate={formattedDate}
                />
              }
            />

            <Bar dataKey="price" radius={[0, 7, 7, 0]} maxBarSize={28}>
              {data.map((entry) => (
                <Cell
                  key={entry.regionId}
                  fill={
                    entry.regionId === selectedRegion
                      ? "var(--regional-chart-selected)"
                      : "var(--regional-chart-default)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="regional-chart__footer">
        <span className="regional-chart__legend">
          <span className="regional-chart__legend-color" />
          {t("comparison.selectedRegionLegend")}
        </span>

        <small>{t("comparison.explanation")}</small>
      </div>
    </section>
  );
}

export default RegionalPriceChart;
