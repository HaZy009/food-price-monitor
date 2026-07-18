import { useTranslation } from "react-i18next";

import "./LanguageSwitcher.css";

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();

  const currentLanguage = i18n.resolvedLanguage ?? "fr";

  const changeLanguage = (language) => {
    i18n.changeLanguage(language);
    document.documentElement.lang = language;
  };

  return (
    <div
      className="language-switcher"
      role="group"
      aria-label={t("language.label")}
    >
      <button
        type="button"
        className={`language-switcher__button ${
          currentLanguage === "fr"
            ? "language-switcher__button--active"
            : ""
        }`}
        onClick={() => changeLanguage("fr")}
        aria-pressed={currentLanguage === "fr"}
      >
        FR
      </button>

      <button
        type="button"
        className={`language-switcher__button ${
          currentLanguage === "en"
            ? "language-switcher__button--active"
            : ""
        }`}
        onClick={() => changeLanguage("en")}
        aria-pressed={currentLanguage === "en"}
      >
        EN
      </button>
    </div>
  );
}

export default LanguageSwitcher;