import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

import "./PriceTrendChart.css";

function formatCurrency(value, locale) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2
  }).format(value);
}

function formatMonth(dateValue, locale) {
  const [year, month] = dateValue.split("-");

  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "numeric"
  }).format(new Date(Number(year), Number(month) - 1, 1));
}

function CustomTooltip({
  active,
  payload,
  label,
  locale,
  regionName,
  canadaName
}) {
  if (!active || !payload?.length || !label) {
    return null;
  }

  return (
    <div className="trend-tooltip">
      <p className="trend-tooltip__date">
        {formatMonth(label, locale)}
      </p>

      {payload.map((entry) => {
        const isCanada = entry.dataKey === "canadaPrice";

        return (
          <div
            className="trend-tooltip__row"
            key={entry.dataKey}
          >
            <span
              className={`trend-tooltip__indicator ${
                isCanada
                  ? "trend-tooltip__indicator--canada"
                  : ""
              }`}
            />

            <span>{isCanada ? canadaName : regionName}</span>

            <strong>
              {formatCurrency(entry.value, locale)}
            </strong>
          </div>
        );
      })}
    </div>
  );
}

function PriceTrendChart({
  data,
  regionName,
  showCanada
}) {
  const { t, i18n } = useTranslation();

  const locale =
    i18n.resolvedLanguage === "en" ? "en-CA" : "fr-CA";

  return (
    <div className="price-trend-chart">
      <ResponsiveContainer width="100%" height={360}>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 8,
            left: 8
          }}
        >
          <CartesianGrid
            stroke="var(--color-border)"
            strokeDasharray="3 3"
            vertical={false}
          />

          <XAxis
            dataKey="date"
            tickFormatter={(value) =>
              formatMonth(value, locale)
            }
            tickLine={false}
            axisLine={{
              stroke: "var(--color-border)"
            }}
            minTickGap={32}
            tick={{
              fill: "var(--color-text-secondary)",
              fontSize: 12
            }}
          />

          <YAxis
            tickFormatter={(value) =>
              formatCurrency(value, locale)
            }
            tickLine={false}
            axisLine={false}
            width={72}
            domain={["dataMin - 0.15", "dataMax + 0.15"]}
            tick={{
              fill: "var(--color-text-secondary)",
              fontSize: 12
            }}
          />

          <Tooltip
            content={
              <CustomTooltip
                locale={locale}
                regionName={regionName}
                canadaName={t("regions.canada")}
              />
            }
          />

          <Line
            type="monotone"
            dataKey="regionPrice"
            stroke="var(--color-primary)"
            strokeWidth={3}
            dot={false}
            activeDot={{
              r: 5,
              fill: "var(--color-primary)"
            }}
          />

          {showCanada && (
            <Line
              type="monotone"
              dataKey="canadaPrice"
              stroke="var(--color-secondary)"
              strokeWidth={2}
              strokeDasharray="7 5"
              dot={false}
              activeDot={{
                r: 5,
                fill: "var(--color-secondary)"
              }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default PriceTrendChart;