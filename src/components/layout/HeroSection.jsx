import { useTranslation } from "react-i18next";
import { CalendarDays, Database, RefreshCw } from "lucide-react";

import RegionSelector from "../selectors/RegionSelector";

import "./HeroSection.css";

function HeroSection({ selectedRegion, onRegionChange }) {
  const { t } = useTranslation();

  return (
    <section className="hero">
      <div className="hero__content">
        <p className="hero__eyebrow">
          {t("hero.eyebrow")}
        </p>

        <h1 className="hero__title">
          {t("hero.title")}
        </h1>

        <p className="hero__description">
          {t("hero.description")}
        </p>

        <dl className="hero__metadata">
          <div className="hero__metadata-item">
            <Database size={16} aria-hidden="true" />

            <div>
              <dt>{t("hero.metadata.sourceLabel")}</dt>
              <dd>{t("hero.metadata.sourceValue")}</dd>
            </div>
          </div>

          <div className="hero__metadata-item">
            <CalendarDays size={16} aria-hidden="true" />

            <div>
              <dt>{t("hero.metadata.latestDateLabel")}</dt>
              <dd>{t("hero.metadata.latestDateValue")}</dd>
            </div>
          </div>

          <div className="hero__metadata-item">
            <RefreshCw size={16} aria-hidden="true" />

            <div>
              <dt>{t("hero.metadata.frequencyLabel")}</dt>
              <dd>{t("hero.metadata.frequencyValue")}</dd>
            </div>
          </div>
        </dl>
      </div>

      <div className="hero__region">
        <RegionSelector
          value={selectedRegion}
          onChange={onRegionChange}
        />
      </div>
    </section>
  );
}

export default HeroSection;