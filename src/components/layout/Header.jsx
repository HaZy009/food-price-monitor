import { useTranslation } from "react-i18next";

import logoColor from "../../assets/logos/logo-color.svg";
import LanguageSwitcher from "../selectors/LanguageSwitcher";

import "./Header.css";

function Header() {
  const { t } = useTranslation();

  return (
    <header className="header">
      <div className="header__container">
        <a className="header__brand" href="#top">
          <img
            className="header__logo"
            src={logoColor}
            alt=""
            aria-hidden="true"
          />

          <span className="header__name">{t("app.name")}</span>
        </a>

        <LanguageSwitcher />
      </div>
    </header>
  );
}

export default Header;