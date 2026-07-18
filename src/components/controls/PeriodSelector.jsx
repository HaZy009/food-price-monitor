import { useTranslation } from "react-i18next";

import "./PeriodSelector.css";

function PeriodSelector({ value, onChange }) {
  const { t } = useTranslation();

  const periods = ["12months", "24months", "fullHistory"];

  return (
    <fieldset className="period-selector">
      <legend className="period-selector__label">
        {t("trend.controls.periodLabel")}
      </legend>

      <div className="period-selector__buttons">
        {periods.map((period) => (
          <button
            key={period}
            type="button"
            className={`period-selector__button ${
              value === period
                ? "period-selector__button--active"
                : ""
            }`}
            onClick={() => onChange(period)}
            aria-pressed={value === period}
          >
            {t(`trend.periods.${period}`)}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default PeriodSelector;