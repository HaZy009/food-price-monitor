import { useTranslation } from "react-i18next";

function App() {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const nextLanguage = i18n.language === "fr" ? "en" : "fr";
    i18n.changeLanguage(nextLanguage);
  };

  return (
    <main>
      <h1>{t("app.name")}</h1>

      <button type="button" onClick={toggleLanguage}>
        {i18n.language === "fr" ? "EN" : "FR"}
      </button>
    </main>
  );
}

export default App;