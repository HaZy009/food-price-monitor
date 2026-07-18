import { useTranslation } from "react-i18next";

import "./ProductSelector.css";

function ProductSelector({ value, onChange }) {
  const { t } = useTranslation();

  const products = [
    "eggs",
    "butter",
    "groundBeef",
    "chickenBreasts",
    "apples",
    "tomatoes",
    "whiteBread",
    "milk",
    "whiteRice",
    "vegetableOil"
  ];

  return (
    <div className="product-selector">
      <label
        className="product-selector__label"
        htmlFor="product-select"
      >
        {t("trend.controls.productLabel")}
      </label>

      <select
        className="product-selector__select"
        id="product-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {products.map((product) => (
          <option key={product} value={product}>
            {t(`products.${product}.fullName`)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ProductSelector;