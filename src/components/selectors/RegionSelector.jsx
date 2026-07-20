import { useTranslation } from "react-i18next";
import { MapPin } from "lucide-react";

import "./RegionSelector.css";

function RegionSelector({ value, onChange }) {
  const { t } = useTranslation();

  const regions = [
    "canada",
    "newfoundland-and-labrador",
    "prince-edward-island",
    "nova-scotia",
    "new-brunswick",
    "quebec",
    "ontario",
    "manitoba",
    "saskatchewan",
    "alberta",
    "british-columbia",
  ];

  return (
    <section
      className="region-selector"
      aria-labelledby="region-selector-title"
    >
      <div className="region-selector__heading">
        <span className="region-selector__icon" aria-hidden="true">
          <MapPin size={18} strokeWidth={2} />
        </span>

        <h2 className="region-selector__title" id="region-selector-title">
          {t("region.title")}
        </h2>
      </div>

      <label className="region-selector__label" htmlFor="region-select">
        {t("region.label")}
      </label>

      <select
        className="region-selector__select"
        id="region-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {regions.map((region) => (
          <option key={region} value={region}>
            {t(`regions.${region}`)}
          </option>
        ))}
      </select>

      <p className="region-selector__description">{t("region.description")}</p>
    </section>
  );
}

export default RegionSelector;
