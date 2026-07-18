import { useTranslation } from "react-i18next";

import "./ComparisonToggle.css";

function ComparisonToggle({
  checked,
  onChange,
  disabled = false
}) {
  const { t } = useTranslation();

  return (
    <label
      className={`comparison-toggle ${
        disabled ? "comparison-toggle--disabled" : ""
      }`}
    >
      <input
        className="comparison-toggle__input"
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />

      <span
        className="comparison-toggle__switch"
        aria-hidden="true"
      >
        <span className="comparison-toggle__thumb" />
      </span>

      <span className="comparison-toggle__label">
        {t("trend.controls.compareCanada")}
      </span>
    </label>
  );
}

export default ComparisonToggle;