import { useTranslation } from "react-i18next";

import logoMono from "../../assets/logos/logo-mono.svg";

import "./Footer.css";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__source">
          <img
            className="footer__logo"
            src={logoMono}
            alt=""
            aria-hidden="true"
          />

          <div>
            <p className="footer__text">
              <strong>{t("footer.dataLabel")}:</strong>{" "}
              {t("footer.dataSource")}
            </p>

            <p className="footer__text">
              {t("footer.universityProject")}
            </p>
          </div>
        </div>

        <p className="footer__text">
          {t("footer.student")} · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}

export default Footer;