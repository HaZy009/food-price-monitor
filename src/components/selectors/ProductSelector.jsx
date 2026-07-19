import { useTranslation } from "react-i18next";

import "./ProductSelector.css";

function ProductSelector({ products, value, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="product-selector">
      <label className="product-selector__label" htmlFor="product-select">
        {t("trend.controls.productLabel")}
      </label>

      <select
        className="product-selector__select"
        id="product-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {t(product.fullNameKey)}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ProductSelector;
